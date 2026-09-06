import {NextResponse} from 'next/server';
import {verifyGrant} from '@/core/authorization';
import {requireKeys} from '@/core/crypto';
import {generateECR} from '@/core/ecr';
import {Execution,Observation} from '@/core/types';

export async function POST(req:Request){
 try{
  const {grant,execution,observations}=await req.json() as {grant:any;execution:Execution;observations:Observation[]};
  if(!grant||!execution||!Array.isArray(observations))return NextResponse.json({error:'MISSING_GRANT_EXECUTION_OR_OBSERVATIONS'},{status:400});
  const {publicKeyHex,privateKeyHex}=requireKeys();
  if(!verifyGrant(grant,publicKeyHex))return NextResponse.json({error:'INVALID_AUTHORIZATION'},{status:403});
  if(execution.intent_id!==grant.intent.intent_id)return NextResponse.json({error:'EXECUTION_INTENT_MISMATCH'},{status:400});
  const ecr=generateECR(grant.intent.intent_id,grant.intent.authorized_effect,execution,observations,privateKeyHex,grant.issuer_key_id,publicKeyHex);
  return NextResponse.json(ecr);
 }catch(e:any){return NextResponse.json({error:e.message||'ORCHESTRATION_FAILED'},{status:502});}
}
