import crypto from 'node:crypto';
import {createGrant, verifyGrantDetailed} from './authorization';
import {derivePublicKeyHex} from './crypto';
import {Intent} from './types';

test('expired grant is distinguishable from cryptographic validity', () => {
  const {privateKey, publicKey} = crypto.generateKeyPairSync('ed25519');
  const privateKeyHex=privateKey.export({format:'der',type:'pkcs8'}).toString('hex');
  const publicKeyHex=publicKey.export({format:'der',type:'spki'}).toString('hex');
  expect(derivePublicKeyHex(privateKeyHex)).toBe(publicKeyHex);
  const intent:Intent={intent_id:'intent_test',tenant_id:'tenant_a',created_at:'2026-09-10T00:00:00Z',authorized_effect:{system:'stripe',operation:'refund',amount:50000,currency:'brl'}};
  const grant=createGrant(intent,privateKeyHex,'key_1','exec_1','idem_1',{system:'stripe',operation:'refund'});
  const result=verifyGrantDetailed(grant,{key_id:'key_1',public_key_hex:publicKeyHex,status:'ACTIVE',activated_at:'2026-01-01T00:00:00Z'},{allowActive:true,allowRetiredHistorical:true,allowRevoked:false},Date.parse(grant.expires_at)+1);
  expect(result.signatureValid).toBe(true);
  expect(result.keyKnown).toBe(true);
  expect(result.trustPolicy).toBe(true);
  expect(result.expired).toBe(true);
  expect(result.bindingValid).toBe(true);
});
