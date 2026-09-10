-- Spiral Intent P0: tenant isolation.
-- Apply after the application tables are created. Every tenant-owned table must
-- carry tenant_id and deny cross-tenant access at the database boundary.

create extension if not exists pgcrypto;

create table if not exists tenants (
  tenant_id uuid primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists tenant_keys (
  tenant_id uuid not null references tenants(tenant_id) on delete cascade,
  key_id text not null,
  public_key_hex text not null,
  status text not null check (status in ('ACTIVE','RETIRED','REVOKED')),
  activated_at timestamptz not null,
  retired_at timestamptz,
  revoked_at timestamptz,
  primary key (tenant_id, key_id)
);

create table if not exists intents (
  tenant_id uuid not null references tenants(tenant_id) on delete cascade,
  intent_id text not null,
  policy_version text not null,
  authorized_effect jsonb not null,
  created_at timestamptz not null default now(),
  primary key (tenant_id, intent_id)
);

create table if not exists authorizations (
  tenant_id uuid not null references tenants(tenant_id) on delete cascade,
  grant_id text not null,
  intent_id text not null,
  execution_id text not null,
  idempotency_key text not null,
  key_id text not null,
  scope jsonb not null,
  issued_at timestamptz not null,
  expires_at timestamptz not null,
  signature text not null,
  primary key (tenant_id, grant_id),
  unique (tenant_id, execution_id),
  unique (tenant_id, idempotency_key)
);

create table if not exists executions (
  tenant_id uuid not null references tenants(tenant_id) on delete cascade,
  execution_id text not null,
  intent_id text not null,
  idempotency_key text not null,
  state text not null,
  external_operation_id text,
  created_at timestamptz not null default now(),
  primary key (tenant_id, execution_id),
  unique (tenant_id, idempotency_key)
);

create table if not exists observations (
  tenant_id uuid not null references tenants(tenant_id) on delete cascade,
  observation_id text not null,
  execution_id text not null,
  provider_event_id text,
  observation jsonb not null,
  observed_at timestamptz not null,
  primary key (tenant_id, observation_id),
  unique (tenant_id, provider_event_id)
);

create table if not exists ecrs (
  tenant_id uuid not null references tenants(tenant_id) on delete cascade,
  receipt_id text not null,
  execution_id text not null,
  verdict text not null check (verdict in ('CONFIRMED','DEVIATED','INCONCLUSIVE','CONFLICTED')),
  ecr jsonb not null,
  issued_at timestamptz not null default now(),
  primary key (tenant_id, receipt_id),
  unique (tenant_id, execution_id)
);

create table if not exists audit_events (
  tenant_id uuid not null references tenants(tenant_id) on delete cascade,
  sequence bigint generated always as identity,
  event_id uuid not null default gen_random_uuid(),
  execution_id text,
  event_type text not null,
  payload jsonb not null,
  previous_hash text,
  event_hash text not null,
  created_at timestamptz not null default now(),
  primary key (tenant_id, sequence),
  unique (tenant_id, event_id)
);

-- Application role must set the tenant at transaction/request boundary:
--   select set_config('app.current_tenant', '<uuid>', true);

alter table tenant_keys enable row level security;
alter table intents enable row level security;
alter table authorizations enable row level security;
alter table executions enable row level security;
alter table observations enable row level security;
alter table ecrs enable row level security;
alter table audit_events enable row level security;

create policy tenant_keys_isolation on tenant_keys using (tenant_id = nullif(current_setting('app.current_tenant', true),'')::uuid);
create policy intents_isolation on intents using (tenant_id = nullif(current_setting('app.current_tenant', true),'')::uuid);
create policy authorizations_isolation on authorizations using (tenant_id = nullif(current_setting('app.current_tenant', true),'')::uuid);
create policy executions_isolation on executions using (tenant_id = nullif(current_setting('app.current_tenant', true),'')::uuid);
create policy observations_isolation on observations using (tenant_id = nullif(current_setting('app.current_tenant', true),'')::uuid);
create policy ecrs_isolation on ecrs using (tenant_id = nullif(current_setting('app.current_tenant', true),'')::uuid);
create policy audit_events_isolation on audit_events using (tenant_id = nullif(current_setting('app.current_tenant', true),'')::uuid);

-- Application users receive DML through policies, never direct tenant_id updates.
-- Production should use a dedicated migration/deployment role to create the
-- policies and revoke UPDATE/DELETE on audit_events from the application role.
