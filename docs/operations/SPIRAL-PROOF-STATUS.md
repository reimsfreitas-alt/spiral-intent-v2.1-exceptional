# Spiral Proof — Operational Status

**Snapshot:** 2026-09-10

This document records only evidence observed during the current hardening pass. A deployment marked READY proves deployment readiness, not external-effect verification.

## 1. Spiral Intent

- Production deployment: **READY** on Vercel.
- Current main commit: `f1ce167a23cc790291e889ec8c6fab8089591c27`.
- Current architecture retains the governed pipeline: intent → policy → signed authorization → lease/fencing queue → worker → independent observer → verifier → receipt → ledger.
- README explicitly states the system is Postgres-backed, cryptographically scope-bound, uses lease/fencing, database idempotency, a hash-chained audit log and independently verifiable receipts.
- External provider proof remains the principal boundary: the tested external system is `mock-bank`; Stripe adapter exists but has not been exercised against live Stripe in this environment.
- Current Vercel status check for the production commit is successful.

## 2. Spiral Lite

- Production deployment: **READY**.
- Production commit: `bfedbed2afd48adab9ae99e1d80b97e15a9c62b0`.
- The executable dispatch endpoint exists and defaults to `LOG_ONLY`.
- It derives deterministic opportunity and idempotency identifiers and issues a time-bounded authorization binding.
- The current implementation is not evidence of real Meta/WhatsApp execution or durable persistence; those remain explicit integration gates.
- The previously merged OS kernel remains in main; the follow-up Vercel configuration commit added deployment configuration without replacing the kernel.

## 3. Distribution Engine

- Main branch received a deterministic `ExecutionContract` with `execution_id`, `tenant_id`, `action`, `scope`, `authorization`, `idempotency_key`, `deadline`, `target`, `payload_ref`, `correlation_id`, and `source_ref`.
- Publisher no longer uses `Date.now()` to create idempotency keys.
- Adapter errors are represented as `UNKNOWN` unless the adapter explicitly proves `confirmed_not_sent=true`; this avoids claiming failure when the external effect may have happened.
- Contract tests prove deterministic identity and tenant/target separation.
- GitHub Actions run `34429667842` completed successfully: install, build and smoke test all passed.
- The engine still has no dedicated Vercel project in the connected environment; no production deployment is claimed.

## 4. Spiral Talk

- Production deployment is **READY**.
- Current production experience remains available at the established Spiral Talk route.
- This pass does not claim new algorithmic maturity without fresh execution evidence.

## 5. Proof gates still open

1. Live external effect through Spiral Intent with independent read-back and ECR verification.
2. Real Meta/WhatsApp governed execution for Lite, including opt-out/TOCTOU/idempotency controls.
3. Durable, multi-tenant production control plane for Lite.
4. Distribution Engine reconciliation, lease/fencing and provider-level idempotency beyond deterministic identity generation.
5. Cross-product shared receipt/provenance contract where reuse does not weaken the existing proven Intent core.

## Operating rule

**Documentation is not proof. Deployment is not proof. Worker success is not proof.**

The Spiral Proof standard is: **AUTHORIZED → EXECUTED → OBSERVED → VERIFIED → RECEIPT**.
