import {evaluateKeyTrust, verifyWithKeyLifecycle, VerificationKeyRecord} from './key-lifecycle';

describe('key lifecycle', () => {
  const retired: VerificationKeyRecord = {
    key_id: 'key_1', public_key_hex: '00', status: 'RETIRED', activated_at: '2026-01-01T00:00:00Z', retired_at: '2026-09-01T00:00:00Z'
  };

  test('RETIRED key remains trusted for historical verification', () => {
    expect(evaluateKeyTrust(retired, {allowActive:true, allowRetiredHistorical:true, allowRevoked:false})).toBe(true);
    expect(verifyWithKeyLifecycle(retired, true, {allowActive:true, allowRetiredHistorical:true, allowRevoked:false})).toEqual({signatureValid:true,keyKnown:true,trustPolicy:true,reason:'VALID'});
  });

  test('RETIRED key can be cryptographically valid but policy rejected', () => {
    expect(verifyWithKeyLifecycle(retired, true, {allowActive:true, allowRetiredHistorical:false, allowRevoked:false})).toEqual({signatureValid:true,keyKnown:true,trustPolicy:false,reason:'KEY_NOT_TRUSTED'});
  });

  test('unknown key is distinct from invalid signature', () => {
    expect(verifyWithKeyLifecycle(undefined, false, {allowActive:true, allowRetiredHistorical:true, allowRevoked:false}).reason).toBe('UNKNOWN_KEY');
    expect(verifyWithKeyLifecycle(retired, false, {allowActive:true, allowRetiredHistorical:true, allowRevoked:false}).reason).toBe('SIGNATURE_INVALID');
  });
});
