# Independent Effect Verification for Agentic AI

## A technical position paper

**Author:** Reinaldo M. S. Freitas, Spiral Codes, Brazil
**Date:** September 2026

## Abstract

Agentic AI systems increasingly move from generating information to taking actions through APIs, databases, communication systems, and enterprise software. This changes the governance problem. It is no longer sufficient to ask whether an agent was authorized to act or whether an executor reported success. A consequential system also needs to establish whether the externally observed effect corresponds to the effect that was authorized.

This paper proposes **Independent Effect Verification (IEV)** as an architectural layer between agent authorization and organizational trust. The model separates intent, policy, authorization, execution, evidence, observation, and verification. Its central invariant is: **EXECUTED ≠ CONFIRMED**. An executor may claim that an operation succeeded while an independent observer may find that the effect was absent, partial, duplicated, delayed, or materially different from the authorized effect.

The proposed architecture uses an authorization envelope, explicit execution identity, append-only evidence records, independent observation, deterministic verification, and a signed Effect Correspondence Receipt (ECR). The purpose is not to replace existing agent frameworks, identity systems, policy engines, or workflow automation, but to provide a verifiable boundary between an authorized action and its external effect.

## 1. The governance gap

Current agent architectures commonly combine reasoning, tool selection, execution, and application-level success reporting. These layers are useful but create an epistemic problem: the component that performs an action may also be the component that declares that the action succeeded.

Authorization answers: **may this action occur?**

Execution answers: **did the worker attempt the action?**

Observation answers: **what can be established from the external system?**

Verification answers: **does the observed effect correspond to the authorized effect?**

These are different questions and should not be collapsed into one status field.

## 2. Independent Effect Verification

IEV defines the following causal chain:

`INTENT → POLICY → AUTHORIZATION → EXECUTION → EVIDENCE → OBSERVATION → VERIFICATION → RECEIPT`

The executor is not the verifier. A worker can submit execution evidence but cannot unilaterally convert its own claim into a verified external effect.

The verifier compares at least three independently meaningful representations:

1. **Authorized effect** — what the policy and authorization envelope permitted.
2. **Execution evidence** — what the worker claims it attempted or completed.
3. **Observed effect** — what the external system or an independent observer establishes.

The verification result can be **CONFIRMED**, **DEVIATED**, **INCONCLUSIVE**, or **CONFLICTED**.

## 3. Authorization binding

A cryptographic signature proves that an authorization envelope was signed. It does not, by itself, prove that the execution used the correct envelope.

Therefore an execution should be semantically bound to the authorization through fields such as:

- tenant_id
- execution_id
- action
- adapter
- target
- scope
- policy_version
- deadline
- nonce
- idempotency_key
- correlation_id

The binding must be verified before the side effect is performed. This closes a class of failures in which a valid authorization is presented but a different action, target, tenant, or payload is executed.

## 4. Execution is not exactly-once

Distributed systems cannot safely promise end-to-end exactly-once external execution merely because a local database transaction succeeded. A practical architecture instead combines at-least-once processing, idempotent handlers, deduplication, reconciliation, and provider-specific guarantees.

The system should distinguish causal identities such as `source_ref`, `opportunity_id`, `execution_id`, `idempotency_key`, `provider_event_id`, and `correlation_id`. Reusing one identifier for all purposes makes reconciliation and audit ambiguous.

## 5. Evidence and the ledger

A trustworthy audit record should preserve the causal chain rather than only the final status. A useful receipt projection can bind:

- Authorization Hash
- Execution Hash
- Observation Hash
- Ledger Sequence
- Verification Verdict
- Verifier Identity
- Receipt Signature

An append-only ledger provides tamper evidence when records are hash-linked and integrity can be independently checked. It does not automatically provide tamper resistance; storage permissions, database controls, key management, and external anchoring remain separate concerns.

## 6. Observation and reconciliation

External systems are imperfect. Webhooks can arrive twice, out of order, late, or not at all. Network failures can create an UNKNOWN outcome after a provider accepted an operation.

Therefore UNKNOWN is a first-class operational condition. The system should reconcile before retrying an ambiguous effect. Retrying a non-idempotent operation solely because the first response was lost can create duplicate external effects.

## 7. Human autonomy and governance

IEV is intended to preserve human authority, not replace it. High-risk or ambiguous operations can require human approval. Human decisions should be recorded with actor identity, policy version, timestamp, justification, and an immutable snapshot of the decision context.

The system should measure processes and effects, not infer moral qualities or performance characteristics of individuals.

## 8. Relation to existing agent infrastructure

IEV is complementary to agent frameworks, workflow engines, IAM, policy-as-code, observability platforms, and automation systems. Those systems answer important questions about reasoning, access, orchestration, and execution. IEV focuses on the boundary where an authorized digital action becomes an externally consequential effect.

The architectural distinction is therefore:

**Agent:** proposes and acts within its permitted scope.

**Policy:** determines what is permitted.

**Worker:** executes an authorized operation.

**Observer:** establishes external evidence.

**Verifier:** independently determines correspondence.

**Receipt:** makes the resulting claim auditable and verifiable.

## 9. Falsifiability and limitations

IEV is not a claim that every real-world effect can be perfectly verified. Some external effects are inherently ambiguous or only partially observable. In those cases the correct output is INCONCLUSIVE, not an invented success state.

The framework should therefore be evaluated experimentally on real integrations, including duplicate delivery, delayed webhooks, provider-side mutation, partial execution, authorization expiry, replay attempts, scope escape, and observer disagreement.

The strongest evidence for the framework is not a diagram or a product claim. It is a reproducible execution in which an authorized effect, an observed external effect, and an independently generated receipt can be compared.

## 10. Conclusion

As AI systems become capable of acting, the question of governance moves from what a model says to what a system actually changes.

The missing boundary is not another chatbot interface. It is a verifiable relationship between authorization and external effect.

**AUTHORIZED. OBSERVED. VERIFIED.**

That is the thesis of Independent Effect Verification.

---

## References and context

1. Hagar, N.; Diakopoulos, N. (2026). *Runtime configuration for situated governance of AI agents: a case study in investigative journalism*. AI and Ethics.
2. Cambridge Forum on AI: Law and Governance (2026). *Governing Agentic AI* — themed issue call for papers.
3. Sato, T. (2026). *The Agent Execution Protocol (AEP) for Agentic AI Systems*. Internet-Draft, IETF Datatracker.
4. Nature (2026). *Ethical and governance concern in artificial intelligence* — open research collection.
5. Journal of Artificial Intelligence Governance. Author guidelines on AI governance, accountability, transparency, and reproducible evidence.

**Disclosure:** This paper was developed with generative AI assistance. The human author is responsible for the final claims, technical validation, citations, and revisions.