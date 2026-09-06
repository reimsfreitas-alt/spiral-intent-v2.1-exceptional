import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {verifyGrant} from '@/core/authorization';
import {Observation,Execution} from '@/core/types';

const stripe=new Stripe(process.env.STRIPE_READ_ONLY_KEY||'');

export async function POST(req:Request){
 try{
  const {grant,execution}=await req.json() as {grant:any;execution:Execution};
  if(!grant||!execution?.external_operation_id)return NextResponse.json({error:'MISSING_GRANT_OR_EXECUTION'},{status:400});
  const publicKeyHex=process.env.ED25519_PUBLIC_KEY_HEX;
  if(!publicKeyHex)return NextResponse.json({error:'ED25519_PUBLIC_KEY_NOT_CONFIGURED'},{status:500});
  if(!verifyGrant(grant,publicKeyHex))return NextResponse.json({error:'INVALID_AUTHORIZATION'},{status:403});
  const refund=await stripe.refunds.retrieve(execution.external_operation_id);
  const observedAt=new Date().toISOString();
  const observation:Observation={
   system:'stripe',
   operation:'refund',
   external_operation_id:refund.id,
   amount:refund.amount,
   currency:refund.currency,
   status:refund.status||'unknown',
   observed_at:observedAt,
   observer_id:'stripe-readonly-observer-01',
   trust_domain:{org:'spiral-observer',cloud:'vercel',credential_class:'stripe_read_only'},
   freshness_ms:Math.max(0,Date.now()-new Date(execution.created_at).getTime()),
   independence_vector:['separate_credential','read_only_api','no_execution_call'],
   source:{kind:'stripe_api',locator:`refund:${refund.id}`,observed_at:observedAt}
  };
  return NextResponse.json(observation);
 }catch(e:any){return NextResponse.json({error:e.message||'OBSERVATION_FAILED'},{status:502});}
}
