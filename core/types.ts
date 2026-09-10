export type Verdict = 'CONFIRMED' | 'DEVIATED' | 'INCONCLUSIVE' | 'CONFLICTED';

export interface TenantContext { tenant_id: string; }
export interface AuthorizedEffect { system: 'stripe'; operation: 'refund'; amount: number; currency: string; resource_id?: string; }
export interface Intent { intent_id: string; tenant_id?: string; created_at: string; authorized_effect: AuthorizedEffect; policy_version?: string; }
export interface AuthorizationGrant { grant_id: string; tenant_id?: string; intent: Intent; execution_id?: string; idempotency_key?: string; scope?: Record<string, unknown>; issued_at: string; expires_at: string; issuer_key_id: string; signature: string; }
export interface Execution { execution_id: string; tenant_id?: string; intent_id: string; external_operation_id: string; requested_amount: number; executed_amount: number; deviate: boolean; is_simulated_deviation?: boolean; warning?: string; created_at: string; idempotency_key?: string; correlation_id?: string; }
export interface Observation { system: 'stripe'; operation: 'refund'; external_operation_id: string; amount: number; currency: string; status: string; observed_at: string; observer_id: string; trust_domain: { org: string; cloud: string; credential_class: string; }; freshness_ms: number; independence_vector: string[]; source: { kind: string; locator: string; observed_at: string; }; provider_event_id?: string; }
export type ObservedEffect = Observation;
export interface VerificationResult { verdict: Verdict; reason: string; invariants: { system: boolean; operation: boolean; amount: boolean; currency: boolean; status: boolean; }; trace: string[]; }
export interface ECRPayload { spec_version: 'ievp/v1'; receipt_id: string; issued_at: string; intent_id: string; authorized_effect: AuthorizedEffect; execution: Execution; observations: Observation[]; verification: VerificationResult; issuer: { id: string; key_id: string; }; hashes: { canonical_sha256: string; authorized_effect_sha256: string; observed_effect_sha256: string; }; ledger_root_hash?: string; ledger_sequence?: number; }
export interface ECR extends ECRPayload { signature: string; public_key_hex: string; }
