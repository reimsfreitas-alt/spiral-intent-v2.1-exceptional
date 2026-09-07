export type Verdict = 'CONFIRMED' | 'DEVIATED' | 'INCONCLUSIVE' | 'CONFLICTED';
export type JobState = 'QUEUED' | 'EXECUTING' | 'OBSERVING' | 'VERIFYING' | Verdict | 'FAILED' | 'REJECTED';
export interface AuthorizedEffect { system:'stripe'; operation:'refund'; target:string; amount:number; currency:string; }
export interface Intent { intent_id:string; created_at:string; authorized_effect:AuthorizedEffect; }
export interface AuthorizationGrant { authorization_id:string; intent:Intent; policy_id:string; policy_version:string; nonce:string; issued_at:string; expires_at:string; issuer_key_id:string; signature:string; }
export interface Execution { execution_id:string; intent_id:string; authorization_id:string; requested_target:string; external_operation_id:string; requested_amount:number; executed_amount:number; deviate:boolean; created_at:string; }
export interface ObservedEffect { system:'stripe'; operation:'refund'; target:string; external_operation_id:string; amount:number; currency:string; status:string; observed_at:string; }
export interface VerificationResult { verdict:Verdict; reason:string; invariants:{system:boolean;operation:boolean;target:boolean;amount:boolean;currency:boolean;status:boolean;claim_matches_observed:boolean;authorized_matches_observed:boolean}; }
export interface ECRPayload { spec_version:'ievp/v2'; receipt_id:string; issued_at:string; intent_id:string; execution_id:string; authorization_id:string; authorized_effect:AuthorizedEffect; execution:Execution; observed_effect:ObservedEffect; verification:VerificationResult; issuer:{id:string;key_id:string}; hashes:{payload_sha256:string;authorized_effect_sha256:string;observed_effect_sha256:string}; }
export interface ECR extends ECRPayload { signature:string; }
