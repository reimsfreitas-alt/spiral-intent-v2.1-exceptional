import crypto from 'node:crypto';
import {ECR,ECRPayload,Execution,AuthorizedEffect,Observation} from './types';
import {jcs,sha256,signEd25519} from './crypto';
import {verifyEffect} from './verifier';

export function generateECR(intentId:string,a:AuthorizedEffect,execution:Execution,observations:Observation[],privateKeyHex:string,keyId='ed25519-primary',publicKeyHex:string):ECR{
 const verification=verifyEffect(a,observations);
 const payload:ECRPayload={spec_version:'ievp/v1',receipt_id:`ecr_${crypto.randomUUID()}`,issued_at:new Date().toISOString(),intent_id:intentId,authorized_effect:a,execution,observations,verification,issuer:{id:'did:spiral:verifier-node-01',key_id:keyId},hashes:{canonical_sha256:'',authorized_effect_sha256:sha256(jcs(a)),observed_effect_sha256:sha256(jcs(observations))}};
 const canonicalPayload={...payload,public_key_hex:publicKeyHex,hashes:{...payload.hashes,canonical_sha256:''}};
 payload.hashes.canonical_sha256=sha256(jcs(canonicalPayload));
 const signedPayload={...payload,public_key_hex:publicKeyHex};
 return {...payload,signature:signEd25519(jcs(signedPayload),privateKeyHex),public_key_hex:publicKeyHex};
}
