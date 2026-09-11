# Spiral Intent

Independent execution assurance: a governed boundary between an agent's intent, what a
worker actually executes against an external system, and what an independent observer
reads back. The worker never gets to declare its own success.

## What this is (and isn't) — read this before trusting any older doc

This was a static landing page with a demo-shaped API for most of its life. As of
2026-09-07 it contains a real persisted execution core: Postgres-backed persistence,
cryptographic scope binding, lease/fencing on the job queue, idempotency enforced at
the database, a hash-chained audit log, and a signed, independently-verifiable receipt
for executions that reach the observation/verifier path. See `ARCHITECTURE.md` for the
full pipeline and `SECURITY.md` for what is and isn't covered.

**Important architecture boundary:** `src/core/` is the current production execution
path. `src/os/` is a kernel/control-plane prototype and contract surface with its own
in-memory test runtime. It is intentionally not presented as a second production
executor. The convergence work is tracked in `docs/MASTER-AUDIT-2026-09-11.md`.

**The one production proof gap that remains:** the external system in every test run in
this environment is `mock-bank/server.ts`, not Stripe. This sandbox's network egress does
not reach `api.stripe.com`. The Stripe adapter (`src/core/bank-adapter.ts`) uses the real
`stripe` SDK and real write/read key separation — it has simply never been run against
the real Stripe API. Swapping it in is `EXTERNAL_ADAPTER=stripe` plus real
`STRIPE_SECRET_KEY`/`STRIPE_READ_ONLY_KEY`, not a code change.

## Pipeline

```
INTENT -> POLICY -> AUTHORIZATION (signed, target-bound) -> QUEUE (lease+fencing)
  -> WORKER (external call) -> INDEPENDENT OBSERVER -> VERIFIER (3-way) -> RECEIPT -> LEDGER
```

Verdicts: `CONFIRMED`, `DEVIATED`, `CONFLICTED`, `INCONCLUSIVE`. All four are reachable
and covered by tests — see `src/core/verifier.ts` for the exact decision table.

## Running it locally

Requires Postgres reachable at `DATABASE_URL`, and two Ed25519 key identities (policy
authority, receipt authority) registered via `scripts/setup-keys.ts`.

```
psql -f db/schema.sql "$DATABASE_URL"
npx tsx scripts/setup-keys.ts     # prints the env vars to export
npm run build && npm start        # or: npm run dev
npx tsx mock-bank/server.ts       # separate terminal, unless EXTERNAL_ADAPTER=stripe
```

Full adversarial proof (persistence, scope binding, lease fencing, idempotency, replay,
crash recovery, audit-chain tamper detection, offline receipt verification):

```
npx tsx scripts/e2e.ts
```

## API

All routes except `/api/health`, `/api/pubkey`, and `/api/receipts/:id/verify` require
`Authorization: Bearer $SPIRAL_API_TOKEN`. The verify endpoint is deliberately open —
anyone holding a receipt must be able to verify it without holding credentials.

- `POST /api/intent` — `{amount, currency, target}` -> signed `{grant, idempotent}`
- `POST /api/worker` — `{grant, target, amount}` -> executes, rejects on target/amount mismatch before any external call
- `POST /api/observer` — `{execution_id, grant, external_operation_id, target, claimed_amount}` -> signed ECR receipt
- `GET /api/receipts/:id` — fetch a persisted receipt
- `POST /api/receipts/:id/verify` — verify by id (looks the receipt up)
- `POST /api/verify` — verify an arbitrary ECR the caller supplies directly
- `GET /api/pubkey?role=receipt_authority|policy_authority` — public key only, never private

## Known gaps

1. `AuthorizedEffect` binds `target` cryptographically (this is what makes the scope-binding
test in `scripts/e2e.ts` pass), but the authorization does not yet pin a `resource_id`
narrower than the target string itself in cases where a `target` could be ambiguous
across systems. Low risk today with a single external system; worth revisiting before a
second connector is added.
2. The current `src/os/` runtime is an in-memory control-plane prototype. It must converge
with the persisted `src/core/` execution authority before it can be described as the
production OS runtime.
3. The final production proof still requires one real external execution/observation cycle
against the target external provider in the target environment.

<!-- landing restore trigger: preserve approved five-language flow and media -->
