# Spiral Proof — Next Operational Gates

## Current truth

Spiral Intent is the control plane for governed agent execution: intent, policy, authorization, execution, independent observation, verification and ECR. The critical commercial proof remains an externally observed effect whose correspondence to authorization can be independently verified.

## Tomorrow-risk register

1. **Real adapter gap** — mock-bank proves architecture, not production integration. The next proof must exercise a real external system under controlled credentials.
2. **Authorization binding drift** — signature validity alone is insufficient. Verify tenant, execution_id, action, adapter, target/scope, deadline and idempotency binding.
3. **Execution/effect confusion** — never collapse EXECUTED, OBSERVED and VERIFIED.
4. **UNKNOWN and reconciliation** — an ambiguous provider response must not be retried blindly. Reconcile before retry.
5. **Receipt completeness** — ECR should be a certificate of the causal chain, not merely a success message.
6. **Tenant isolation** — production readiness requires explicit isolation and authorization boundaries before onboarding multiple customers.
7. **Recovery** — restart, duplicate delivery, stale lease and partial failure must converge without corrupting the evidence chain.

## P0 gates

- One real external adapter in a controlled environment.
- Independent observation of the resulting effect.
- ECR containing authorization, execution, observation and verification hashes plus ledger sequence.
- Public/offline receipt verification path.
- Replay, stale-authorization, scope-escape and duplicate-execution tests.
- Recovery/reconciliation test for UNKNOWN.
- Production deployment state verified as READY before any commercial claim.

## 24-hour decision rule

Close evidence gaps before adding surface area. No new connector, marketplace, blockchain, AI verifier or large dashboard should outrank the first real independently verified effect.

## Evidence standard

BUILDING is not READY. A passing unit test is not production evidence. EXECUTED is not CONFIRMED. Provider claim is not independent observation.
