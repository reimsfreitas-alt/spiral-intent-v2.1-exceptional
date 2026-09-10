import crypto from 'node:crypto';
import {AuthorizationGrant,Intent} from './types';
import {jcs,signEd25519,verifyEd25519} from './crypto';
import {KeyVerificationResult,VerificationKeyRecord,VerificationTrustPolicy,verifyWithKeyLifecycle} from './key-lifecycle';

export function createGrant(intent:Intent,privateKeyHex:string,keyId='ed25519-primary',executionId?:string,idempotencyKey?:string,scope?:Record<string,unknown>):AuthorizationGrant{
 const body={grant_id:`grant_${crypto.randomUUID()}`,tenant_id:intent.tenant_id,intent,execution_id:executionId,idempotency_key:idempotencyKey,scope,issued_at:new Date().toISOString(),expires_at:new Date(Date.now()+5*60_000).toISOString(),issuer_key_id:keyId};
 return {...body,signature:signEd25519(jcs(body),privateKeyHex)};
}

export function verifyGrantDetailed(g:AuthorizationGrant,key:VerificationKeyRecord,policy:VerificationTrustPolicy,now=Date.now()):KeyVerificationResult & {expired:boolean;bindingValid:boolean} {
 const {signature,...body}=g;
 const signatureValid=verifyEd25519(jcs(body),signature,key.public_key_hex);
 const lifecycle=verifyWithKeyLifecycle(key,signatureValid,policy);
 const expired=new Date(g.expires_at).getTime()<=now;
 const bindingValid=!!g.execution_id && !!g.idempotency_key && !!g.scope && (!g.tenant_id || g.tenant_id===g.intent.tenant_id);
 return {...lifecycle,expired,bindingValid};
}

export function verifyGrant(g:AuthorizationGrant,publicKeyHex:string):boolean{
 const {signature,...body}=g; return verifyEd25519(jcs(body),signature,publicKeyHex)&&new Date(g.expires_at).getTime()>Date.now();
}
