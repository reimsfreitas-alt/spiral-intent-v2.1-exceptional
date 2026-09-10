-- P0/P1: make the audit ledger append-only at the database boundary.

create or replace function deny_audit_mutation() returns trigger language plpgsql as $$
begin
  raise exception 'AUDIT_LEDGER_APPEND_ONLY';
end;
$$;

drop trigger if exists audit_events_no_update on audit_events;
drop trigger if exists audit_events_no_delete on audit_events;
create trigger audit_events_no_update before update on audit_events for each row execute function deny_audit_mutation();
create trigger audit_events_no_delete before delete on audit_events for each row execute function deny_audit_mutation();

-- The deployment role should run these grants with the actual application role:
-- revoke update, delete on audit_events from spiral_app;
-- grant select, insert on audit_events to spiral_app;

-- Hash-chain rule: event_hash must be computed over previous_hash + canonical body.
-- The application must insert events in a transaction and never accept a caller-
-- supplied sequence value. A production implementation should also serialize
-- append operations per tenant (advisory transaction lock or equivalent).
