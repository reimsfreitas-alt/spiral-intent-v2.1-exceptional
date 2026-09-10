export type KeyStatus = 'ACTIVE' | 'RETIRED' | 'REVOKED';

export interface VerificationTrustPolicy {
  allowActive: boolean;
  allowRetiredHistorical: boolean;
  allowRevoked: boolean;
}

export interface VerificationKeyRecord {
  key_id: string;
  public_key_hex: string;
  status: KeyStatus;
  activated_at: string;
  retired_at?: string;
  revoked_at?: string;
}

export interface KeyVerificationResult {
  signatureValid: boolean;
  keyKnown: boolean;
  trustPolicy: boolean;
  reason: 'VALID' | 'UNKNOWN_KEY' | 'SIGNATURE_INVALID' | 'KEY_NOT_TRUSTED';
}

export function evaluateKeyTrust(key: VerificationKeyRecord | undefined, policy: VerificationTrustPolicy): boolean {
  if (!key) return false;
  if (key.status === 'ACTIVE') return policy.allowActive;
  if (key.status === 'RETIRED') return policy.allowRetiredHistorical;
  return policy.allowRevoked;
}

export function verifyWithKeyLifecycle(
  key: VerificationKeyRecord | undefined,
  signatureValid: boolean,
  policy: VerificationTrustPolicy
): KeyVerificationResult {
  const keyKnown = !!key;
  const trustPolicy = evaluateKeyTrust(key, policy);
  if (!keyKnown) return { signatureValid: false, keyKnown: false, trustPolicy: false, reason: 'UNKNOWN_KEY' };
  if (!signatureValid) return { signatureValid: false, keyKnown: true, trustPolicy, reason: 'SIGNATURE_INVALID' };
  if (!trustPolicy) return { signatureValid: true, keyKnown: true, trustPolicy: false, reason: 'KEY_NOT_TRUSTED' };
  return { signatureValid: true, keyKnown: true, trustPolicy: true, reason: 'VALID' };
}
