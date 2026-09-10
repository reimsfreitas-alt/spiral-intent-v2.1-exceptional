export type OSDecision = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
export type OSState = 'RECEIVED' | 'POLICY_EVALUATED' | 'AUTHORIZED' | 'REQUIRES_APPROVAL' | 'REJECTED' | 'READY' | 'EXECUTING' | 'OBSERVING' | 'VERIFIED' | 'DEVIATED' | 'CONFLICTED' | 'INCONCLUSIVE' | 'FAILED';

export interface IntentRequest {
  intent_id: string;
  tenant_id: string;
  actor_id: string;
  action: string;
  target: string;
  payload_ref?: string;
  correlation_id: string;
  created_at: string;
}

export interface PolicyRule {
  policy_id: string;
  version: string;
  action: string;
  target_prefix?: string;
  decision: OSDecision;
  expires_after_seconds?: number;
}

export interface AuthorizationEnvelope {
  authorization_id: string;
  intent_id: string;
  tenant_id: string;
  actor_id: string;
  action: string;
  target: string;
  payload_ref?: string;
  policy_id: string;
  policy_version: string;
  idempotency_key: string;
  nonce: string;
  issued_at: string;
  expires_at: string;
  scope_hash: string;
}

export interface OSEvent {
  sequence: number;
  event_id: string;
  tenant_id: string;
  intent_id: string;
  state: OSState;
  type: string;
  occurred_at: string;
  data: Record<string, unknown>;
  previous_hash: string | null;
  hash: string;
}

export interface ExecutionReceipt {
  execution_id: string;
  authorization_id: string;
  intent_id: string;
  verdict: 'CONFIRMED' | 'DEVIATED' | 'CONFLICTED' | 'INCONCLUSIVE';
  event_sequence: number;
  receipt_hash: string;
}
