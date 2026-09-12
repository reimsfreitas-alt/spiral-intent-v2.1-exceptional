# Spiral Wealth — Orchestrator Specification

Date: 2026-09-11
Status: implementation handoff; do not treat as production-complete until tests and runtime evidence pass.

## Purpose

The Orchestrator is the Spiral OS control-plane runtime. It coordinates Lead, Intent, Policy, Authorization, Distribution Engine, Observation, Reconciliation, Verdict and Receipt. It is not a commercial product and it must not manufacture verification.

## Canonical lifecycle

`DECLARED -> CLASSIFIED -> AUTHORIZED -> DISPATCHED -> EXECUTING -> OBSERVING -> RECONCILING -> VERIFIED -> RECEIPTED`

Exceptional states:

`REQUIRES_APPROVAL`, `REJECTED`, `DEVIATED`, `INCONCLUSIVE`, `FAILED`, `HALTED`, `CONFLICTED`.

## Authority boundaries

- Policy Authority: decides whether an action is allowed.
- Authorization: creates a bounded authorization envelope.
- Orchestrator: coordinates state transitions, retries, approval, recovery and provider dispatch.
- Execution Worker: performs the external write.
- Observer: reads external reality independently.
- Verifier/Reconciler: compares authorized expectation with observed reality.
- Receipt: records the resulting conclusion.

The Orchestrator must never convert an executor claim directly into VERIFIED.

## Delivery semantics

Use at-least-once execution semantics. Every dispatch must carry an idempotency key. Retries must preserve the same logical idempotency key for the same operation. Provider-specific idempotency and observation capabilities are part of the provider contract.

Exactly-once external side effects must not be claimed.

## Provider contract

Minimum provider descriptor:

- `provider_id`
- `execution_mode` (`REAL` | `SIMULATED`)
- `capabilities`
- `idempotency`
- `observation`
- `reconciliation`
- `status`
- authentication requirements

## Runtime API shape

Prefer existing API conventions where possible. If no compatible route exists, implement:

- `POST /api/orchestrator/runs`
- `GET /api/orchestrator/runs/:id`
- `POST /api/orchestrator/runs/:id/approve`
- `POST /api/orchestrator/runs/:id/resume`
- `POST /api/orchestrator/runs/:id/cancel`

Do not duplicate an existing endpoint merely to rename it.

## Recovery

The state machine must survive process restart. Persist the authoritative run state before transitions that can cause external effects. Recovery must reconcile ambiguous executions instead of assuming failure or success.

## Tenant boundary

All runtime queries and writes must set and enforce the current tenant context. Existing RLS mechanism must remain intact; application-level tenant scoping alone is not a substitute for runtime RLS wiring.

## Security invariants

- authorization is single-use;
- consumed authorization cannot be replayed;
- persisted authorization must be loaded and verified before receipt generation;
- `execution_mode` is application-level write-once unless a stronger DB constraint is added;
- receipt generation requires reconciliation/verifier outcome;
- executor cannot manufacture VERIFIED;
- cross-tenant reads/writes are rejected;
- direct SQL tests must remain explicit about the absence/presence of DB-level immutability.

## Required tests

1. successful execution;
2. policy rejection;
3. approval required;
4. duplicate authorization;
5. retry with same idempotency key;
6. provider failure;
7. observer disagreement;
8. DEVIATED verdict;
9. INCONCLUSIVE verdict;
10. receipt only after reconciliation;
11. cross-tenant isolation;
12. authorization replay prevention;
13. execution_mode cannot silently change;
14. executor cannot manufacture VERIFIED;
15. orchestrator crash/restart recovery.

## Full vertical slice

`INTENT -> POLICY -> AUTHORIZATION -> ORCHESTRATOR -> EXECUTION -> OBSERVATION -> RECONCILIATION -> VERDICT -> RECEIPT`

## Demo discipline

The commercial demo may remain SIMULATED and must be explicitly labeled. Example: policy authorizes a R$50 refund; executor claims R$500; observer sees R$500; verifier returns `POLICY_MISMATCH`; final verdict `DEVIATED`; receipt is non-confirming. No real receipt identifier may be presented as production evidence unless an actual external execution and independent observation occurred.
