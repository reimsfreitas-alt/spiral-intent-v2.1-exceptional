# Spiral Intent — Production Readiness Gate

## Current verdict

**NOT READY for production claims.** The repository contains a read-only/demo Operating System surface and the production deployment must pass direct route, runtime, security and browser validation before being presented as production-ready.

## P0 — Entry surface

- Canonical OS route: `/os`
- `/os` must resolve directly to the OS surface; it must not depend on an iframe.
- `/os.html` remains the current static read-only/demo implementation.
- Validate production HTTP status, browser rendering, console errors, mobile rendering and direct refresh before closing P0.

## P1 — Governance invariants

The execution boundary must enforce server-side:

1. valid authorization;
2. authorization expiry;
3. exact payload/execution binding;
4. idempotency/replay protection;
5. tenant isolation;
6. execution scope;
7. independent observation;
8. verification before receipt issuance.

A frontend-only check is never a security boundary.

## P1 — Evidence semantics

The UI must never collapse these states:

`AUTHORIZED != EXECUTED != OBSERVED != VERIFIED != RECEIPT`

Any simulated data must be visibly labelled `DEMO` or `SIMULATED`.

## P2 — UX and performance

- Preserve the obsidian / warm-gold technical visual language.
- Remove unnecessary iframe dependencies.
- Verify mobile layout and table overflow.
- Avoid presenting synthetic metrics as operational production statistics.

## Release gate

A release may be called **DEMO READY** only after `/os` is directly reachable and the demo flow is coherent.

A release may be called **PILOT READY** only after the server-side governance invariants and evidence semantics are validated by automated tests.

A release may be called **PRODUCTION READY** only after real external integrations, secrets, tenant isolation, observation and verification paths are validated in the target environment.
