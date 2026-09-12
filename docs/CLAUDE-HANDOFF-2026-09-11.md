# Claude Engineering Handoff — 2026-09-11

## Mission

Prepare Spiral Wealth for the first real external Receipt and first paid Verification Sprint without expanding product scope unnecessarily.

## Commercial contract to preserve

- Company: **Spiral Wealth**
- Category: **Governed Execution Infrastructure**
- Product capability: **Independent Outcome Verification (IOV)**
- Commercial wedge: **The 14-Day Verification Sprint**
- Pilot hypothesis: **R$10,000**, convertible into annual contract
- Initial ICP: B2B SaaS / AI workflow builders / software houses with consequential external actions
- Expansion: one workflow → multiple providers → departmental standard → enterprise Control Fabric
- Principle: **The executor reports what it did. The verifier checks what happened.**

## Required physical milestone

`SP-RCPT-000001` must be a REAL external-provider execution/observation/reconciliation cycle before being represented as real anywhere.

Required sequence:

```text
INTENT
→ POLICY
→ AUTHORIZATION
→ EXECUTION
→ EXTERNAL STATE
→ INDEPENDENT OBSERVATION
→ RECONCILIATION
→ VERDICT
→ RECEIPT
```

Minimum first proof:

1. Real external write.
2. External identifier captured.
3. Observer uses a separated read path and does not possess write authority.
4. Verifier does not trust executor success as its verdict input.
5. Authorized effect and observed state are reconciled deterministically.
6. Receipt records the evidence and verdict.
7. A second person can inspect/reproduce the reasoning from the recorded evidence.

## Critical terminology

Use:
- independent observation
- reconciliation
- verifiable receipt
- confirmed / deviated / conflicted / inconclusive
- at-least-once + idempotency + reconciliation

Do not use as absolute claims:
- mathematically guaranteed success
- legal proof
- tamper-proof
- exactly-once external execution
- zero risk
- complete elimination of uncertainty

## Existing architecture boundaries

- `src/core/` is the current persisted execution authority.
- `src/os/` is still a control-plane prototype/contract surface until convergence.
- Application-level tenant isolation must not be called database RLS unless RLS is actually implemented against the current schema.
- PR #3's RLS implementation is not mergeable as-is because its schema assumptions differ from the current commissioning branch.
- CI currently has a lockfile/setup-node cache issue; do not call CI green until `npm ci` can run successfully in GitHub Actions.
- Do not claim an external production Receipt based on mock-bank/local E2E.

## Landing contract

The root landing now presents one machine, not a product catalog:

`LEAD / INTENT → POLICY → AUTHORIZATION → DISTRIBUTION ENGINE → EXTERNAL WORLD → INDEPENDENT OBSERVER → RECONCILIATION → VERDICT → RECEIPT → OS`

Spiral Lead and Spiral Intent are commercial/operational surfaces. Distribution Engine is infrastructure, not a third commercial product. Spiral Talk is separate and must remain outside this architecture.

## Engineering priority order

### P0
- Make the first real Receipt possible and reproducible.
- Keep execution/observation/verification separation real, not cosmetic.
- Resolve provider selection and credentials safely.
- Demonstrate CONFIRMED and intentionally induced DEVIATED outcomes.

### P1
- Converge OS/control-plane state with the persisted execution authority where required.
- Reconcile tenant model and implement schema-compatible RLS before claiming production RLS.
- Fix CI lockfile/cache path and get the real test/build pipeline green.
- Tighten resource-level identity for multi-provider targets.

### P2
- Provider adapter expansion.
- Observation semantics library.
- Reconciliation rule library.
- Commercial telemetry required for pilot reporting.

## Do not do

- Do not create a new product.
- Do not introduce another workflow/orchestration platform merely because it is fashionable.
- Do not merge incompatible PR #3 blindly.
- Do not replace existing approved media/videos without a specific request.
- Do not call simulated evidence production evidence.
- Do not overclaim cryptography as legal/compliance proof.

## Definition of done for this freeze

```text
REAL EXTERNAL EXECUTION
+ SEPARATED OBSERVATION
+ DETERMINISTIC RECONCILIATION
+ REAL RECEIPT
+ CONFIRMED CASE
+ DEVIATED CASE
+ CI GREEN
+ DOCUMENTED LIMITATIONS
= ENGINEERING READY FOR COMMERCIAL VALIDATION
```

The next business milestone after this is not more architecture. It is the first paid Verification Sprint.
