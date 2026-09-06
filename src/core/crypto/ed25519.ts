import crypto from 'node:crypto';

function privateKey(hex:string):crypto.KeyObject{return crypto.createPrivateKey({key:Buffer.from(hex,'hex'),format:'der',type:'pkcs8'});}
function publicKey(hex:string):crypto.KeyObject{return crypto.createPublicKey({key:Buffer.from(hex,'hex'),format:'der',type:'spki'});}
export function signEd25519(bytes:Uint8Array, privateKeyHex:string):string{return crypto.sign(null,Buffer.from(bytes),privateKey(privateKeyHex)).toString('base64url');}
export function verifyEd25519(bytes:Uint8Array, signature:string, publicKeyHex:string):boolean{return crypto.verify(null,Buffer.from(bytes),publicKey(publicKeyHex),Buffer.from(signature,'base64url'));}
