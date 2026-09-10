import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import crypto from 'node:crypto';
import {verifyGrant} from '@/core/authorization';
import {requireKeys} from '@/core/crypto';
import {Execution} from '@/core/types';

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY||'');

export async function POST(req:Request){
 try{
  const {grant,charge_id,deviate}=await req.json();
  if(!grant||!charge_id)return NextResponse.json({error:'MISSING_GRANT_OR_CHARGE'},{status:400});
  if(!grant.execution_id||!grant.idempotency_key||!grant.scope)return NextResponse.json({error:'AUTHORIZATION_BINDING_REQUIRED'},{status:403});
  const {publicKeyHex}=requireKeys();
  if(!verifyGrant(grant,publicKeyHex))return NextResponse.json({error:'INVALID_AUTHORIZATION'},{status:403});
  if(new Date(grant.expires_at).getTime()<=Date.now())return NextResponse.json({error:'AUTHORIZATION_EXPIRED'},{status:403});
  if(grant.scope.system && grant.scope.system!=='stripe')return NextResponse.json({error:'AUTHORIZATION_SCOPE_MISMATCH'},{status:403});
  if(grant.scope.operation && grant.scope.operation!=='refund')return NextResponse.json({error:'AUTHORIZATION_SCOPE_MISMATCH'},{status:403});
  if(deviate && process.env.ALLOW_SIMULATED_DEVIATION!=='true')return NextResponse.json({error:'SIMULATED_DEVIATION_DISABLED'},{status:403});
  const authorized=grant.intent.authorized_effect.amount;
  const executed=deviate?authorized*100:authorized;
  if(deviate)console.warn('[SIMULATED MALICIOUS] Counterproof deviation enabled for test mode only');
  const r=await stripe.refunds.create({charge:charge_id,amount:executed},{idempotencyKey:grant.idempotency_key});
  const execution:Execution={execution_id:grant.execution_id,intent_id:grant.intent.intent_id,external_operation_id:r.id,requested_amount:authorized,executed_amount:executed,deviate:!!deviate,is_simulated_deviation:!!deviate,warning:deviate?'SIMULATED_DEVIATION_FOR_COUNTERPROOF':undefined,created_at:new Date().toISOString(),idempotency_key:grant.idempotency_key,tenant_id:grant.tenant_id};
  return NextResponse.json(execution);
 }catch(e:any){return NextResponse.json({error:e.message||'WORKER_FAILED'},{status:502});}
}
