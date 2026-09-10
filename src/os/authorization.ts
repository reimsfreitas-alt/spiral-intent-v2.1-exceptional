import {createHash,randomBytes} from 'node:crypto';
import {AuthorizationEnvelope,IntentRequest,PolicyResult} from './types';
import {canonical,sha256} from './hash';

export function idempotencyKey(intent: IntentRequest): string {
  return createHash('sha256').update(canonical({tenant_id:intent.tenant_id,intent_id:intent.intent_id,action:intent.action,target:intent.target,payload_ref:intent.payload_ref ?? null})).digest('hex');
}

export function issueAuthorization(intent: IntentRequest, policy: PolicyResult, now = new Date(), ttlSeconds = 300): AuthorizationEnvelope {
  if (policy.decision !== 'ALLOW') throw new Error(`AUTHORIZATION_NOT_ALLOWED:${policy.decision}`);
  const issuedAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
  const scope = {tenant_id:intent.tenant_id,actor_id:intent.actor_id,action:intent.action,target:intent.target,payload_ref:intent.payload_ref ?? null,policy_id:policy.policy_id,policy_version:policy.version};
  return {authorization_id:randomBytes(16).toString('hex'),intent_id:intent.intent_id,tenant_id:intent.tenant_id,actor_id:intent.actor_id,action:intent.action,target:intent.target,payload_ref:intent.payload_ref,policy_id:policy.policy_id,policy_version:policy.version,idempotency_key:idempotencyKey(intent),nonce:randomBytes(16).toString('hex'),issued_at:issuedAt,expires_at:expiresAt,scope_hash:sha256(scope)};
}

export function verifyAuthorization(envelope: AuthorizationEnvelope, intent: IntentRequest, now = new Date()): void {
  if (envelope.tenant_id !== intent.tenant_id || envelope.intent_id !== intent.intent_id) throw new Error('AUTHORIZATION_BINDING_MISMATCH');
  if (envelope.action !== intent.action || envelope.target !== intent.target || (envelope.payload_ref ?? null) !== (intent.payload_ref ?? null)) throw new Error('AUTHORIZATION_SCOPE_MISMATCH');
  if (new Date(envelope.expires_at).getTime() <= now.getTime()) throw new Error('AUTHORIZATION_EXPIRED');
  if (envelope.idempotency_key !== idempotencyKey(intent)) throw new Error('IDEMPOTENCY_BINDING_MISMATCH');
}
