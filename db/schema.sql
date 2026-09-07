-- Spiral Intent — persistent ledger schema
CREATE TABLE IF NOT EXISTS key_identities (
  key_id TEXT PRIMARY KEY, algorithm TEXT NOT NULL DEFAULT 'Ed25519', public_key_hex TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('policy_authority','receipt_authority')), status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','RETIRED')), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS intents (
  intent_id TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), system TEXT NOT NULL, operation TEXT NOT NULL,
  target TEXT NOT NULL, amount BIGINT NOT NULL, currency TEXT NOT NULL, idempotency_key TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS authorizations (
  authorization_id TEXT PRIMARY KEY, intent_id TEXT NOT NULL REFERENCES intents(intent_id), policy_id TEXT NOT NULL, policy_version TEXT NOT NULL,
  target TEXT NOT NULL, amount BIGINT NOT NULL, nonce TEXT NOT NULL UNIQUE, issued_at TIMESTAMPTZ NOT NULL DEFAULT now(), expires_at TIMESTAMPTZ NOT NULL,
  issuer_key_id TEXT NOT NULL REFERENCES key_identities(key_id), signature TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED','CONSUMED','EXPIRED','REJECTED'))
);
CREATE TABLE IF NOT EXISTS jobs (
  execution_id TEXT PRIMARY KEY, authorization_id TEXT NOT NULL REFERENCES authorizations(authorization_id),
  state TEXT NOT NULL DEFAULT 'QUEUED' CHECK (state IN ('QUEUED','EXECUTING','OBSERVING','VERIFYING','CONFIRMED','DEVIATED','INCONCLUSIVE','CONFLICTED','FAILED','REJECTED')),
  requested_target TEXT NOT NULL, claimed_amount BIGINT, lease_owner TEXT, lease_until TIMESTAMPTZ,
  lease_generation INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS observations (
  id BIGSERIAL PRIMARY KEY, execution_id TEXT NOT NULL REFERENCES jobs(execution_id), observed_amount BIGINT NOT NULL,
  observed_currency TEXT NOT NULL, observed_status TEXT NOT NULL, external_operation_id TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(), observer_key_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS receipts (
  receipt_id TEXT PRIMARY KEY, execution_id TEXT NOT NULL REFERENCES jobs(execution_id) UNIQUE,
  payload JSONB NOT NULL, signature TEXT NOT NULL, issuer_key_id TEXT NOT NULL REFERENCES key_identities(key_id), issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_events (
  seq BIGSERIAL PRIMARY KEY, execution_id TEXT, event_type TEXT NOT NULL, payload JSONB NOT NULL,
  hash TEXT NOT NULL, previous_hash TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(state);
CREATE INDEX IF NOT EXISTS idx_audit_execution ON audit_events(execution_id);
