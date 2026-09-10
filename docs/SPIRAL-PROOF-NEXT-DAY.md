# Spiral Proof — Next-Day Operating Forecast

## Current signal
The executable vertical slice has evidence for the core effect-verification loop, while production hardening still has open boundaries: tenant isolation, persistent key identity/trust, execution binding, durable append-only persistence, and real external effect evidence.

## Tomorrow's likely failure modes

1. **False production confidence** — a READY deployment is mistaken for production assurance.
   - Countermeasure: commercial claims require an evidence gate: real effect + independent observation + deterministic verification + portable receipt.

2. **Authorization drift at execution time** — an envelope was valid when issued but target/scope/deadline changed before execution.
   - Countermeasure: verify binding, expiry, scope and idempotency immediately before the external side effect.

3. **Key rotation breaks historical receipts** — RETIRED issuer keys disappear from the active-key path.
   - Countermeasure: persistent key registry; separate signature validity, key identity and trust policy; RETIRED remains eligible for historical verification.

4. **Tenant escape** — application filtering is trusted without a database boundary.
   - Countermeasure: PostgreSQL RLS with transaction-scoped `app.current_tenant` and regression test.

5. **Unknown external outcome gets retried** — a timeout is interpreted as failure and a duplicate side effect occurs.
   - Countermeasure: UNKNOWN is first-class; reconcile/read-after-write before retry.

6. **Receipt becomes a log dump** — an ECR contains events but does not certify correspondence.
   - Countermeasure: ECR binds authorization, execution, observation, verification, hashes and ledger provenance.

7. **Mock becomes marketing proof** — MockBank/Stripe test mode is presented as real customer evidence.
   - Countermeasure: label mock/test evidence explicitly; close one controlled real external-effect gate before production claims.

## 48-hour order

- Close compile/test regressions created by the hardening pass.
- Run the full 25+ E2E suite after database reset.
- Execute the SQL RLS regression with a non-owner application role.
- Produce an ECR export fixture and verify it with `npm run verify:offline` after removing the runtime/database.
- Add a real Stripe test-mode adapter path only after the execution contract is enforced.
- Then build the operational control surface around the proven protocol, not around mock data.

## Commercial gate

The first sales demo should make one distinction impossible to miss:

`SYSTEM CLAIM: SUCCESS R$500`  →  `OBSERVED EFFECT: R$5,000`  →  `VERDICT: DEVIATED`

The sale is not the dashboard. The sale is the independently verifiable evidence that the claimed effect and the observed effect can diverge — and that the divergence is detected.
