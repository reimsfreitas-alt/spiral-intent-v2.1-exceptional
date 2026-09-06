export type Verdict = 'CONFIRMED' | 'DEVIATED' | 'INCONCLUSIVE' | 'CONFLICTED';

export interface AuthorizedEffect { system: 'stripe'; operation: 'refund'; amount: number; currency: string; }
export interface Intent { intent_id: string; created_at: string; authorized_effect: AuthorizedEffect; }
export interface AuthorizationGrant { grant_id: string; intent: Intent; issued_at: string; expires_at: string; issuer_key_id: string; signature: string; }
export interface Execution { execution_id: string; intent_id: string; external_operation_id: string; requested_amount: number; executed_amount: number; deviate: boolean; created_at: string; }
export interface ObservedEffect { system: 'stripe'; operation: 'refund'; external_operation_id: string; amount: number; currency: string; status: string; observed_at: string; }
export interface VerificationResult { verdict: Verdict; reason: string; invariants: { system: boolean; operation: boolean; amount: boolean; currency: boolean; status: boolean }; }
export interface ECRPayload { spec_version: 'ievp/v1'; receipt_id: string; issued_at: string; intent_id: string; authorized_effect: AuthorizedEffect; execution: Execution; observed_effect: ObservedEffect; verification: VerificationResult; issuer: { id: string; key_id: string }; hashes: { payload_sha256: string; authorized_effect_sha256: string; observed_effect_sha256: string }; }
export interface ECR extends ECRPayload { signature: string; }
