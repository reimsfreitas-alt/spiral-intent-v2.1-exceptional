# Spiral Wealth

**Governed Execution Infrastructure**

Spiral governs execution and independently verifies outcomes when software, automations and AI agents act outside the company's direct system boundary.

## Commercial thesis

The product capability is **Independent Outcome Verification (IOV)**: observe external state through a separated read path, reconcile it against the authorized intended effect, and issue a verifiable receipt with a structured verdict.

The customer is not buying a queue, database, workflow engine, or generic observability product. The customer is buying reduced exposure to **blind execution risk**.

> Govern execution. Verify outcomes.

The commercial wedge is the **14-Day Verification Sprint**: one critical outbound workflow, one external provider, lightweight integration, controlled observation, reconciliation and an executive result. Current pilot pricing is a market-validation hypothesis of R$10,000, convertible into an annual contract.

See `docs/COMMERCIAL-THESIS-2026-09-11.md` for the complete ICP, pricing, market, expansion and validation thesis.

## Architecture

```text
INTENT -> POLICY -> AUTHORIZATION -> QUEUE -> WORKER
  -> EXTERNAL SYSTEM -> INDEPENDENT OBSERVER -> VERIFIER
  -> RECEIPT -> LEDGER
```

The governing principle is:

> **The executor reports what it did. The verifier checks what happened.**

Execution, observation and verification are deliberately separated. Spiral does not treat an executor's HTTP success response as sufficient evidence that the authorized external effect materialized as intended.

## Product surfaces

- **Spiral Lead** — commercial/operational entry surface for opportunity and operation context.
- **Spiral Intent** — intent, policy and authorization surface.
- **Distribution Engine** — execution infrastructure; not a separate commercial product.
- **Spiral OS** — control-plane/cockpit surface for canonical operation state.
- **Spiral Talk** — separate product; not part of this platform architecture.

## What this repository currently contains

This repository is the primary Spiral Intent execution codebase and commissioning surface. The current production execution path is under `src/core/`; `src/os/` remains a control-plane prototype/contract surface until convergence work is completed.

The codebase includes persisted execution, cryptographic scope binding, queue lease/fencing, database idempotency, hash-chained audit records and signed receipts along the observation/verifier path. These capabilities must not be represented as broader guarantees than their tested implementation supports.

## Evidence boundary

**Do not claim the first real external Receipt has already been produced until it has actually been executed and independently observed in the target environment.**

The remaining irreversible proof milestone is:

**SP-RCPT-000001 → real external execution → independent observation → reconciliation → verdict → receipt.**

A successful local/mock run is not a real external-provider proof.

## Known technical gaps

1. The final production proof still requires one real external execution/observation cycle against the target provider in the target environment.
2. The current `src/os/` runtime is an in-memory control-plane prototype and must converge with the persisted `src/core/` execution authority before being described as the production OS runtime.
3. `AuthorizedEffect` binds target scope, but resource-level identity may need tightening as additional connectors are introduced.
4. Application-level isolation and database-level RLS must not be conflated; tenant/RLS hardening requires schema-compatible implementation before being claimed as production capability.
5. External effects should be treated as at-least-once with idempotency and reconciliation, not as a universal exactly-once guarantee.

## Validation order

```text
FIRST REAL RECEIPT
        ↓
FIRST PAID VERIFICATION SPRINT
        ↓
FIRST ANNUAL CUSTOMER
        ↓
REPEATABLE ICP + PRICING
        ↓
PROVIDER / SEMANTIC MOAT
        ↓
ENTERPRISE PLATFORM
```

No new product theory is required before the first commercial validation cycle.
