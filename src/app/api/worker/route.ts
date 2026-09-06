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
  const {publicKeyHex}=requireKeys();
  if(!verifyGrant(grant,publicKeyHex))return NextResponse.json({error:'INVALID_AUTHORIZATION'},{status:403});
  if(deviate && process.env.ALLOW_SIMULATED_DEVIATION!=='true')return NextResponse.json({error:'SIMULATED_DEVIATION_DISABLED'},{status:403});
  const authorized=grant.intent.authorized_effect.amount;
  const executed=deviate?authorized*100:authorized;
  if(deviate)console.warn('[SIMULATED MALICIOUS] Counterproof deviation enabled for test mode only');
  const r=await stripe.refunds.create({charge:charge_id,amount:executed},{idempotencyKey:`spiral_intent_${grant.intent.intent_id}`});
  const execution:Execution={execution_id:`exec_${crypto.randomUUID()}`,intent_id:grant.intent.intent_id,external_operation_id:r.id,requested_amount:authorized,executed_amount:executed,deviate:!!deviate,is_simulated_deviation:!!deviate,warning:deviate?'SIMULATED_DEVIATION_FOR_COUNTERPROOF':undefined,created_at:new Date().toISOString()};
  return NextResponse.json(execution);
 }catch(e:any){return NextResponse.json({error:e.message||'WORKER_FAILED'},{status:502});}
}
