# Spiral Intent — Gemini Excellence Build Brief

## Mission
Take the existing Spiral Intent to exceptional product quality. Do not create another product and do not alter the core thesis.

## Product thesis
Spiral Intent is Independent Execution Assurance: it separates authorization, execution, independent observation and verification so the system that acts cannot self-attest success.

Core lifecycle:
`INTENT → POLICY → AUTHORIZATION → EXECUTION → OBSERVATION → VERIFICATION → RECEIPT`

## P0 engineering
Preserve and harden the existing governed-execution architecture.
- Multi-tenant isolation at every database boundary.
- Explicit authorization scope and resource binding.
- Signed authorization envelope with strict expiry and nonce/replay protection.
- Execution must validate the exact authority it consumes.
- Lease/fencing for concurrent workers.
- Database idempotency at the execution boundary.
- Append-only audit ledger and integrity verification.
- Independent observer that cannot be written by the executor.
- Verifier must distinguish CONFIRMED, DEVIATED, INCONCLUSIVE and CONFLICTED.
- Signed receipts must be independently verifiable.
- Preserve key rotation / historical trust semantics.
- Adversarial tests: replay, scope escape, tenant escape, stale authorization, concurrent execution, crash recovery, observer disagreement, ledger tampering, verifier precedence and receipt verification.
- Never claim a live external connector is production-ready until it has actually been exercised end-to-end.

## Operating System UX
Build a premium operational surface with:
Overview, Intents, Policies, Authorizations, Executions, Observations, Verification, Receipts, Security, Settings.

The central object is the evidence chain. A user should be able to inspect one execution and see:
intent → policy decision → authorization envelope → worker claim → independent external observation → verifier comparison → receipt.

Visual language: obsidian / graphite / warm gold with restrained cyan technical accents. Human, cinematic, precise, quiet. Inspired by the Spiral Orb presentation quality, but original. Avoid generic AI dashboard templates, fake metrics, excessive cards and startup clichés.

## Landing
The landing must communicate the category in seconds:
"Proof for systems that act."

Above the fold: one precise claim, visible deviation demonstration, one primary CTA and immediate path into the OS.

Then:
- the missing layer
- why successful execution is not proof
- seven-stage proof path
- technical demonstration
- trust boundaries
- explicit verdicts
- security architecture
- enterprise pilot

Do not invent customers, ROI, testimonials or production integrations.

Fix current presentation weakness: the root currently wraps the approved landing in an iframe. Preserve visual compatibility if needed, but improve SEO, metadata, accessibility and OS discoverability.

## Demo
Use fictional data and explicit DEMO labels. Show at least one DEVIATED case where worker success conflicts with independently observed external state, and one CONFIRMED case.

## Deliverables
1. Production-quality implementation.
2. Exceptional OS UI.
3. Exceptional landing UX.
4. P0 adversarial tests.
5. Architecture and threat model documentation.
6. Deployment checklist.
7. REAL / DEMO / ROADMAP labels.
8. No new product category. This is Spiral Intent excellence work.
