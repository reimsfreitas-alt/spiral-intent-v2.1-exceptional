# Spiral Intent

Independent execution assurance: a governed boundary between an agent's intent, what a
worker actually executes against an external system, and what an independent observer
reads back. The worker never gets to declare its own success.

## What this is (and isn't) — read this before trusting any older doc

This was a static landing page with a demo-shaped API for most of its life. As of
2026-09-07 it is a real system: Postgres-backed persistence, cryptographic scope binding,
lease/fencing on the job queue, idempotency enforced at the database, a hash-chained
audit log, and a signed, independently-verifiable receipt for every execution. See
`ARCHITECTURE.md` for the full pipeline and `SECURITY.md` for what is and isn't covered.

**The one thing that is not real yet:** the external system in every test run in this
environment is `mock-bank/server.ts`, not Stripe. This sandbox's network egress does not
reach `api.stripe.com`. The Stripe adapter (`src/core/bank-adapter.ts`) uses the real
`stripe` SDK and real write/read key separation — it has simply never been run against the
real Stripe API. Swapping it in is `EXTERNAL_ADAPTER=stripe` plus real
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

## Known gap, not yet fixed

`AuthorizedEffect` binds `target` cryptographically (this is what makes the scope-binding
test in `scripts/e2e.ts` pass), but the authorization does not yet pin a `resource_id`
narrower than the target string itself in cases where a `target` could be ambiguous
across systems. Low risk today with a single external system; worth revisiting before a
second connector is added.

<!-- landing restore trigger: preserve approved five-language flow and media -->
