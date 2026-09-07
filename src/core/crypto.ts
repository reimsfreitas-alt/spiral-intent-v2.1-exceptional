import canonicalize from 'canonicalize';
import crypto from 'node:crypto';
export function jcs(value:unknown):string{const out=canonicalize(value);if(typeof out!=='string')throw new Error('JCS_CANONICALIZATION_FAILED');return out;}
export function sha256(value:string):string{return crypto.createHash('sha256').update(value,'utf8').digest('hex');}
function privateKey(hex:string):crypto.KeyObject{return crypto.createPrivateKey({key:Buffer.from(hex,'hex'),format:'der',type:'pkcs8'});}
function publicKey(hex:string):crypto.KeyObject{return crypto.createPublicKey({key:Buffer.from(hex,'hex'),format:'der',type:'spki'});}
export function signEd25519(canonical:string,privateKeyHex:string):string{return crypto.sign(null,Buffer.from(canonical),privateKey(privateKeyHex)).toString('base64url');}
export function verifyEd25519(canonical:string,signature:string,publicKeyHex:string):boolean{try{return crypto.verify(null,Buffer.from(canonical),publicKey(publicKeyHex),Buffer.from(signature,'base64url'));}catch{return false;}}
export function derivePublicKeyHex(privateKeyHex:string):string{return crypto.createPublicKey(privateKey(privateKeyHex)).export({format:'der',type:'spki'}).toString('hex');}
