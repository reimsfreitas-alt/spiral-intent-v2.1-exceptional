import crypto from 'node:crypto';
import {AuthorizationGrant,Intent} from './types';
import {jcs,signEd25519,verifyEd25519} from './crypto';
export function createGrant(intent:Intent,privateKeyHex:string,keyId='ed25519-primary'):AuthorizationGrant{
 const body={grant_id:`grant_${crypto.randomUUID()}`,intent,issued_at:new Date().toISOString(),expires_at:new Date(Date.now()+5*60_000).toISOString(),issuer_key_id:keyId};
 return {...body,signature:signEd25519(jcs(body),privateKeyHex)};
}
export function verifyGrant(g:AuthorizationGrant,publicKeyHex:string):boolean{
 const {signature,...body}=g; return verifyEd25519(jcs(body),signature,publicKeyHex)&&new Date(g.expires_at).getTime()>Date.now();
}
