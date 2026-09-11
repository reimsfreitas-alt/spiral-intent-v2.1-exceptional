# Spiral Intent — Master Audit

**Date:** 2026-09-11
**Authority:** Spiral Master
**Status:** ACTIVE — execution audit, not a production-readiness claim

## Executive verdict

The repository has a credible production core, but it currently contains **two execution representations** that must not be treated as equivalent:

1. `src/core/` — the current production execution path: Postgres persistence, authorization, queue/lease fencing, external adapter, independent observation, verifier and signed ECR receipt.
2. `src/os/` — a separate in-memory kernel prototype/test surface. It has useful state/policy/authorization concepts and tests, but it is not the runtime used by the production execution path.

Therefore:

> **`src/os/` is not yet the canonical production runtime. `src/core/` remains the execution source of truth.**

This resolves the apparent fragmentation without deleting either body of work.

## Evidence inspected

- `README.md`
- `src/core/engine.ts`
- `src/core/queue.ts`
- `src/core/authorization.ts`
- `src/core/ledger.ts`
- `src/core/verifier.ts`
- `src/core/ecr.ts`
- `src/os/runtime.ts`
- `src/os/runtime.test.ts`
- `src/os/state-machine.ts`
- `src/os/policy.ts`
- `src/os/authorization.ts`
- `src/app/os/page.tsx`
- `os.html`
- `PRODUCTION-READINESS.md`

## Finding 1 — The apparent clone is real, but it is not two production systems

`src/os/runtime.ts` implements an in-memory `SpiralIntentOS` with `MemoryLedger`, local policy evaluation, local authorization and a local state machine. Its tests explicitly exercise a synthetic lifecycle through `AUTHORIZED` and `READY`.

`src/core/engine.ts`, by contrast, is the asynchronous persisted execution path. It creates authorization grants, persists/consumes them, enqueues jobs, claims leases, executes the external adapter, records observations and generates the signed ECR.

**Conclusion:** the codebases overlap conceptually, but the OS folder is currently a kernel prototype/specification layer, not a second production executor.

## Finding 2 — Do not delete `src/os/`

The OS prototype contains valuable domain vocabulary and invariants. Deleting it would destroy useful work and obscure the intended architecture.

Instead, the next engineering step is **convergence**: define the OS as the control-plane/kernel contract and make the production `src/core/` path conform to that contract where it is safe and testable.

## Finding 3 — The OS visual surface contains synthetic operational data

`os.html` contains fixed demonstration metrics and entities such as authorization/execution counts and `DEMO-BANK` examples. The existing production gate correctly states that simulated data must be visibly labelled `DEMO`/`SIMULATED` and must never be presented as production statistics.

**Action:** the OS surface must remain explicitly DEMO until backed by real server data. No synthetic metric may be marketed as live operational evidence.

## Finding 4 — `/os` currently redirects to the static demo

`src/app/os/page.tsx` currently redirects `/os` to `/os.html`. The production gate requires direct `/os` reachability and explicitly calls for removal of unnecessary iframe dependencies. The redirect itself is not the core architectural problem; the important issue is that `/os` currently lands on a static demo surface rather than a server-backed operational surface.

**P0:** replace the static-demo dependency with a direct route backed by an explicitly labelled demo adapter first; only promote it to operational data after server-side integration and validation.

## Finding 5 — Production core is stronger than the OS surface

The production core already contains the important assurance separation:

`INTENT -> POLICY -> AUTHORIZATION -> QUEUE -> WORKER -> OBSERVATION -> VERIFICATION -> RECEIPT -> LEDGER`

The worker is not the verifier, and the worker cannot choose the final verdict. This is consistent with the central Spiral Intent invariant:

`EXECUTED != CONFIRMED`

## P0 execution order

1. **Freeze the architecture boundary:** `src/core` = production execution path; `src/os` = control-plane/kernel contract until convergence is proven.
2. **Eliminate evidence ambiguity:** mark all static/demo metrics and external examples as `DEMO`/`SIMULATED`.
3. **Make `/os` a truthful direct surface:** no iframe, no fake production metrics, no implied live state.
4. **Add an OS-to-core integration contract:** map OS intent/policy/authorization/state vocabulary onto the existing persisted core without duplicating execution logic.
5. **Add tests for the contract:** authorization scope, expiry, idempotency, tenant isolation, state transitions, independent observation and receipt gating.
6. **Only then run the real external adapter proof.** The current documented gap remains real external execution against the target provider.

## Release truth

- **DEMO READY:** truthful `/os` surface with all synthetic data labelled.
- **PILOT READY:** server-side governance invariants and evidence semantics covered by automated tests.
- **PRODUCTION READY:** real external adapter, secrets, tenant isolation, independent observation, verification and receipt path validated in the target environment.

## Non-negotiable rule

No UI, README, landing page or sales material may claim a production external effect merely because a worker returned successfully or because a synthetic OS screen displays a metric.

The evidence chain must remain:

`AUTHORIZED != EXECUTED != OBSERVED != VERIFIED != RECEIPT`

## Immediate owner action

The next code change should be a **small convergence change**, not a rewrite: establish the production/core runtime as the execution authority and make the OS layer consume/express that authority rather than implement a competing in-memory execution model.
