import {NextResponse} from 'next/server';
import {jcs,sha256,verifyEd25519} from '@/core/crypto';
import {ECR} from '@/core/types';
import {verifyEffect} from '@/core/verifier';

export async function POST(req:Request){
 try{
  const ecr=await req.json() as ECR;
  const {signature,public_key_hex,hashes,...payload}=ecr;
  if(!signature||!public_key_hex||!hashes?.canonical_sha256)return NextResponse.json({valid:false,reason:'MALFORMED_ECR'},{status:400});
  const canonicalPayload={...payload,public_key_hex,hashes:{...hashes,canonical_sha256:''}};
  const recomputedHash=sha256(jcs(canonicalPayload));
  const hashValid=recomputedHash===hashes.canonical_sha256;
  const signedPayload={...payload,public_key_hex,hashes};
  const signatureValid=verifyEd25519(jcs(signedPayload),signature,public_key_hex);
  const authorizedHash=sha256(jcs(payload.authorized_effect))===hashes.authorized_effect_sha256;
  const observedHash=sha256(jcs(payload.observations))===hashes.observed_effect_sha256;
  const deterministic=verifyEffect(payload.authorized_effect,payload.observations);
  const verdictValid=jcs(deterministic)===jcs(payload.verification);
  const valid=hashValid&&signatureValid&&authorizedHash&&observedHash&&verdictValid;
  return NextResponse.json({valid,offline:true,checks:{canonical_hash:hashValid,ed25519_signature:signatureValid,authorized_effect_hash:authorizedHash,observations_hash:observedHash,deterministic_verdict:verdictValid},recomputed_hash:recomputedHash,verdict:deterministic.verdict,reason:deterministic.reason});
 }catch(e:any){return NextResponse.json({valid:false,reason:e.message||'OFFLINE_VERIFICATION_FAILED'},{status:400});}
}
