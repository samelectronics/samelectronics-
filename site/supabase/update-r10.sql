-- R10 Stage 2 (S1 · S4 · S5 · S7). Safe to run more than once.
-- 1) Staff rights only count after the personal 6-digit code (Supabase MFA, session level "aal2").
create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt()->>'aal', 'aal1') = 'aal2' and exists (select 1 from staff s where s.id = auth.uid() and s.active);
$$;
create or replace function has_perm(p text) returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt()->>'aal', 'aal1') = 'aal2' and exists (select 1 from staff s where s.id = auth.uid() and s.active and (s.role in ('owner','manager') or p = any(s.perms)));
$$;
-- a staff member can always see their own row (so the sign-in knows to ask for the code); nothing else before aal2
drop policy if exists "own staff row" on staff;
create policy "own staff row" on staff for select using (id = auth.uid());

-- 2) Staff by invitation only. The owner/manager invites an e-mail; the person becomes staff only after they have
--    created an account with that e-mail AND confirmed it, the first time they open the Control Room.
create table if not exists staff_invites (
  email text primary key, name text, role text not null default 'sales', title text, perms text[] default '{}',
  branch text default 'Dubai · Deira', invited_by uuid, created_at timestamptz default now()
);
alter table staff_invites enable row level security;
drop policy if exists "staff see invites" on staff_invites;
create policy "staff see invites" on staff_invites for select using (has_perm('staff'));
drop policy if exists "staff remove invites" on staff_invites;
create policy "staff remove invites" on staff_invites for delete using (has_perm('staff'));

create or replace function invite_staff(p jsonb) returns text language plpgsql security definer set search_path = public, auth as $$
declare e text := lower(trim(p->>'email'));
begin
  if not has_perm('staff') then raise exception 'Only the owner and managers can invite staff.'; end if;
  if e is null or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Enter a valid e-mail.'; end if;
  if (p->>'role') = 'owner' and not exists (select 1 from staff where id = auth.uid() and role = 'owner') then raise exception 'Only the owner can invite another owner.'; end if;
  if exists (select 1 from auth.users u where lower(u.email) = e and u.email_confirmed_at is not null) then perform save_staff(p); return 'added'; end if;
  insert into staff_invites (email, name, role, title, perms, branch, invited_by)
  values (e, p->>'name', coalesce(p->>'role','sales'), p->>'title', coalesce(array(select jsonb_array_elements_text(p->'perms')), '{}'), coalesce(p->>'branch','Dubai · Deira'), auth.uid())
  on conflict (email) do update set name = excluded.name, role = excluded.role, title = excluded.title, perms = excluded.perms, branch = excluded.branch;
  insert into audit_log (action, target, detail) values ('staff.invite', e, coalesce(p->>'role','sales'));
  return 'invited';
end $$;

create or replace function claim_staff_invite() returns boolean language plpgsql security definer set search_path = public, auth as $$
declare e text; c timestamptz; i staff_invites;
begin
  select lower(u.email), u.email_confirmed_at into e, c from auth.users u where u.id = auth.uid();
  if e is null or c is null then return false; end if;           -- only a confirmed address
  select * into i from staff_invites where email = e; if not found then return false; end if;
  insert into staff (id, email, name, role, title, perms, branch, active)
  values (auth.uid(), e, coalesce(i.name, split_part(e, '@', 1)), i.role, i.title, i.perms, i.branch, true)
  on conflict (id) do nothing;
  delete from staff_invites where email = e;
  insert into audit_log (action, target, detail) values ('staff.joined', e, i.role);
  return true;
end $$;

-- 3) Recovery: the owner (or a manager with the staff right) can reset someone's two-step; they enrol again next sign-in.
create or replace function reset_staff_mfa(p_id uuid) returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not has_perm('staff') then raise exception 'Not allowed.'; end if;
  if exists (select 1 from staff where id = p_id and role = 'owner') and not exists (select 1 from staff where id = auth.uid() and role = 'owner') then raise exception 'Only the owner can reset the owner.'; end if;
  delete from auth.mfa_factors where user_id = p_id;
  insert into audit_log (action, target, detail) values ('staff.reset_2fa', (select email from staff where id = p_id), '');
end $$;

revoke execute on function public.invite_staff(jsonb) from public, anon;
revoke execute on function public.claim_staff_invite() from public, anon;
revoke execute on function public.reset_staff_mfa(uuid) from public, anon;
grant execute on function public.invite_staff(jsonb) to authenticated;
grant execute on function public.claim_staff_invite() to authenticated;
grant execute on function public.reset_staff_mfa(uuid) to authenticated;

-- 4) S1: the owner's own e-mail is invited as owner. It becomes the owner account only after the owner signs up with
--    it and confirms the e-mail (claim_staff_invite checks the confirmation).
insert into staff_invites (email, name, role, title) values ('tarek-chou@hotmail.com', 'Tarek Alchoumari', 'owner', 'Founder')
on conflict (email) do nothing;
