import crypto from 'node:crypto';
import {ECR,ECRPayload,Execution,AuthorizedEffect,ObservedEffect} from './types';
import {jcs,sha256,signEd25519} from './crypto';
import {verifyEffect} from './verifier';
export function generateECR(intentId:string,a:AuthorizedEffect,execution:Execution,o:ObservedEffect,privateKeyHex:string,keyId='ed25519-primary'):ECR{
 const verification=verifyEffect(a,o);
 const effectHashes={authorized_effect_sha256:sha256(jcs(a)),observed_effect_sha256:sha256(jcs(o))};
 const payload:ECRPayload={spec_version:'ievp/v1',receipt_id:`ecr_${crypto.randomUUID()}`,issued_at:new Date().toISOString(),intent_id:intentId,authorized_effect:a,execution,observed_effect:o,verification,issuer:{id:'did:spiral:verifier-node-01',key_id:keyId},hashes:{...effectHashes,payload_sha256:''}};
 payload.hashes.payload_sha256=sha256(jcs(payload));
 const signature=signEd25519(jcs(payload),privateKeyHex);
 return {...payload,signature};
}
