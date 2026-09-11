# Spiral Intent OS — Control-Plane Contract

This directory is **not** a second production executor.

## Current role

`src/os/` contains the control-plane/kernel vocabulary used to express:

- intent receipt;
- policy evaluation;
- bounded authorization;
- state transitions;
- ledger/event semantics.

Its current `runtime.ts` uses an in-memory `MemoryLedger` and exists for domain-level tests and contract development.

## Production authority

The current production execution authority remains `src/core/`:

`INTENT -> AUTHORIZATION -> QUEUE -> WORKER -> OBSERVATION -> VERIFICATION -> RECEIPT -> LEDGER`

That path uses Postgres persistence, lease/fencing, external adapters, independent observation and signed receipts.

## Convergence rule

Future OS work must **converge on `src/core/` rather than create a parallel executor**.

Do not:

- move production execution into this directory without an explicit migration plan;
- duplicate queue, persistence, external adapter or receipt logic here;
- use this runtime as evidence of a production external effect;
- expose synthetic `MemoryLedger` data as live operational telemetry.

The intended end state is a single execution authority with the OS acting as its governed control-plane contract and observability surface.

See `docs/MASTER-AUDIT-2026-09-11.md` for the current convergence gate.
