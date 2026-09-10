# Spiral Intent OS — Kernel v0.1

## Purpose

Spiral Intent OS is the control-plane kernel that turns an agent's proposed effect into a bounded, auditable execution lifecycle.

The invariant is simple:

> EXECUTED ≠ CONFIRMED

An executor cannot be the sole authority for the effect it produced. Authorization, execution, observation and verification remain separate responsibilities.

## Canonical lifecycle

```text
INTENT
  -> POLICY
  -> AUTHORIZATION
  -> READY
  -> EXECUTION
  -> OBSERVATION
  -> VERIFICATION
  -> RECEIPT
  -> LEDGER
```

The current kernel implements the first control-plane slice:

```text
RECEIVED -> POLICY_EVALUATED -> AUTHORIZED -> READY
```

Terminal policy outcomes are explicit:

```text
POLICY_EVALUATED -> REJECTED
POLICY_EVALUATED -> REQUIRES_APPROVAL
```

## Kernel modules

- `src/os/types.ts` — canonical contracts and state vocabulary.
- `src/os/policy.ts` — deterministic policy evaluation with default deny.
- `src/os/authorization.ts` — bound authorization envelope, expiry, nonce and deterministic idempotency key.
- `src/os/state-machine.ts` — explicit legal transitions; invalid transitions fail closed.
- `src/os/ledger.ts` — append-only in-memory reference ledger with SHA-256 hash chaining and integrity verification.
- `src/os/runtime.ts` — executable coordinator for the control-plane slice.
- `src/os/hash.ts` — canonical serialization and hashing primitives.

## Binding rule

An authorization is bound to tenant, actor, intent, action, target, payload reference, policy identity/version and idempotency identity. A later execution layer must reject any request whose effective scope differs from the authorization envelope.

## What this kernel does not claim yet

This commit does not claim production persistence, cryptographic envelope signatures, real external adapters, distributed leases, webhook observation, or independent ECR verification. Those capabilities remain separate implementation gates and must not be represented as shipped merely because the contracts exist.

## Acceptance gates

1. Policy evaluation is deterministic and defaults to deny.
2. Authorization expires and cannot be replayed against a changed scope.
3. State transitions are explicit and invalid transitions fail closed.
4. Every lifecycle transition produces a ledger event.
5. Ledger integrity is independently checkable.
6. CI executes the kernel tests and application build on every change.

## Next construction order

1. Replace reference memory ledger with the existing Postgres persistence boundary.
2. Add signed AuthorizationEnvelope using the existing Ed25519 authority implementation.
3. Add execution binding and idempotent execution records.
4. Add lease/fencing around workers.
5. Add independent observation and reconciliation.
6. Project the existing ECR verifier into the OS receipt layer.
7. Expose a stable API and operator surface only after the kernel invariants are enforced.
