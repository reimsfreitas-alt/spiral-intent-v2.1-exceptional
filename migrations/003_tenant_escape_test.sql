-- Executable tenant-escape regression test. Run after 001 + 002 in an isolated
-- PostgreSQL test database with a non-owner application role.

begin;
insert into tenants (tenant_id,name) values
 ('00000000-0000-0000-0000-000000000001','tenant-a'),
 ('00000000-0000-0000-0000-000000000002','tenant-b')
on conflict do nothing;

select set_config('app.current_tenant','00000000-0000-0000-0000-000000000001',true);
insert into intents (tenant_id,intent_id,policy_version,authorized_effect)
values ('00000000-0000-0000-0000-000000000001','escape-a','v1','{"system":"stripe","operation":"refund","amount":50000,"currency":"brl"}')
on conflict do nothing;

-- Must return exactly one row.
select count(*) as visible_for_tenant_a from intents;

select set_config('app.current_tenant','00000000-0000-0000-0000-000000000002',true);
-- Must return zero rows: tenant B cannot read tenant A.
select count(*) as visible_for_tenant_b from intents where intent_id='escape-a';

rollback;
