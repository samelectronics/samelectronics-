-- Sam Electronics · Supabase schema (P1). Run once in Supabase → SQL Editor. Safe to re-run (IF NOT EXISTS / OR REPLACE).
-- Everything the site's backend contract needs (site/src/lib/backend/types.ts): customers, companies, orders with VAT,
-- reviews, live chat, applications, staff with roles and permissions, site settings, audit log, e-mail queue.
-- Security: row-level security on every table. Customers see only their own rows; staff see what their permissions allow.
-- Prices, VAT and stock are always recomputed on the server (place_order) — numbers sent by a browser are never trusted.

create extension if not exists pgcrypto;

-- ── catalogue ─────────────────────────────────────────────────────────────────────────────────────────────
create table if not exists brands (id text primary key, name text not null, code text, grp text default 'standalone', about text, logo text, sort int default 0);
create table if not exists models (id text primary key, brand_id text references brands(id) on delete cascade, series text, name text not null, model_numbers text[] default '{}', device text default 'phone', fits text[] default '{}', released date);
create table if not exists categories (id text primary key, name text not null, one text, part text, soon boolean default false, sort int default 0);
create table if not exists manufacturers (id text primary key, name text not null, about text, country text, logo text);
create table if not exists products (
  id text primary key, model_id text references models(id) on delete set null, category text references categories(id), part text, part_name text,
  grade text, quality text, manufacturer text references manufacturers(id), title text not null, description text, colour text, shot text, photos text[] default '{}',
  retail_price numeric(10,2) not null default 0, wholesale_price numeric(10,2) not null default 0, cost_price numeric(10,2),
  stock_qty int not null default 0, low_stock_threshold int default 3, location text, barcode text, warranty text,
  badges text[] default '{}', visible boolean default true, sample boolean default false, updated_at timestamptz default now()
);
create table if not exists deals (id uuid primary key default gen_random_uuid(), product_id text references products(id) on delete cascade, discount int not null check (discount between 1 and 90), starts timestamptz default now(), ends timestamptz not null, label text);
create table if not exists stock_moves (id uuid primary key default gen_random_uuid(), product_id text references products(id) on delete cascade, delta int not null, reason text not null, ref text, staff_id uuid, created_at timestamptz default now());

-- ── people ──────────────────────────────────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade, email text not null, name text, phone text, verified boolean default false,
  kind text default 'customer' check (kind in ('customer','wholesale')), trade_approved boolean default false, points int default 0,
  card_kind text check (card_kind in ('circuit','grid','circle')), card_no text unique, card_level int default 0,
  avatar text, country text, city text, lang text default 'en', contact_email text, created_at timestamptz default now()
);
create table if not exists staff (
  id uuid primary key references auth.users(id) on delete cascade, email text not null unique, name text not null,
  role text not null check (role in ('owner','manager','accountant','sales','warehouse','technician','support','editor')),
  title text, photo text, phone text, branch text default 'Dubai · Deira', active boolean default true, perms text[] not null default '{}',
  bio text, created_at timestamptz default now(), last_seen timestamptz
);
create table if not exists companies (
  id uuid primary key default gen_random_uuid(), owner uuid not null references profiles(id) on delete cascade, name text not null, trade_licence text, trn text,
  kind text default 'repair-shop', phone text, email text, website text, locations jsonb default '[]', approved boolean default false, note text, created_at timestamptz default now()
);

-- what a staff member may do: owner/manager everything, others their perms list
create or replace function has_perm(p text) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff s where s.id = auth.uid() and s.active and (s.role in ('owner','manager') or p = any(s.perms)));
$$;
create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff s where s.id = auth.uid() and s.active);
$$;

-- every new sign-up gets a profile; "verified" follows the e-mail confirmation
create or replace function on_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, name, phone, kind, verified) values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone', coalesce(new.raw_user_meta_data->>'kind','customer'), new.email_confirmed_at is not null)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists t_new_user on auth.users;
create trigger t_new_user after insert on auth.users for each row execute function on_new_user();
create or replace function on_confirm_user() returns trigger language plpgsql security definer set search_path = public as $$
begin update profiles set verified = new.email_confirmed_at is not null where id = new.id; return new; end $$;
drop trigger if exists t_confirm_user on auth.users;
create trigger t_confirm_user after update of email_confirmed_at on auth.users for each row execute function on_confirm_user();

-- customers may not raise their own points, trade approval or card level
create or replace function guard_profile() returns trigger language plpgsql as $$
begin
  if not has_perm('customers') then
    new.points := old.points; new.trade_approved := old.trade_approved; new.kind := old.kind; new.card_level := old.card_level; new.verified := old.verified; new.email := old.email;
  end if;
  return new;
end $$;
drop trigger if exists t_guard_profile on profiles;
create trigger t_guard_profile before update on profiles for each row execute function guard_profile();

create or replace function link_card(p_kind text, p_no text) returns profiles language plpgsql security definer set search_path = public as $$
declare r profiles;
begin
  if auth.uid() is null then raise exception 'Please sign in.'; end if;
  if p_no !~ '^S[CGO] ?[0-9]{3} ?[0-9]{3} ?[0-9]{4}$' then raise exception 'Card numbers look like SC 123 456 2700.'; end if;
  update profiles set card_kind = p_kind, card_no = p_no where id = auth.uid() returning * into r;
  return r;
end $$;

-- staff editing their own profile cannot change their role, permissions or status
create or replace function guard_staff() returns trigger language plpgsql as $$
begin
  if not has_perm('staff') then new.role := old.role; new.perms := old.perms; new.active := old.active; new.email := old.email; end if;
  return new;
end $$;
drop trigger if exists t_guard_staff on staff;
create trigger t_guard_staff before update on staff for each row execute function guard_staff();

-- ── orders (VAT 5%, prices from the database) ─────────────────────────────────────────────────────────────
create sequence if not exists order_no start 1001;
create table if not exists orders (
  id uuid primary key default gen_random_uuid(), no text unique not null, user_id uuid references profiles(id) on delete set null, company_id uuid references companies(id) on delete set null,
  email text not null, name text not null, phone text not null, lines jsonb not null, sub numeric(12,2) not null, vat numeric(12,2) not null, ship numeric(12,2) not null default 0, total numeric(12,2) not null,
  delivery text not null check (delivery in ('pickup','uae','world')), address text, country text, note text, pay text default 'whatsapp',
  status text not null default 'New', history jsonb default '[]', created_at timestamptz default now()
);
create or replace function place_order(p jsonb) returns orders language plpgsql security definer set search_path = public as $$
declare l jsonb; pr products; trade boolean; unit numeric; lines jsonb := '[]'; sub numeric := 0; ship numeric := 0; r orders;
begin
  select coalesce(trade_approved,false) into trade from profiles where id = auth.uid();
  for l in select * from jsonb_array_elements(p->'lines') loop
    select * into pr from products where id = l->>'id' and visible;
    if pr.id is null then raise exception 'A part in your cart is no longer available.'; end if;
    unit := case when coalesce(trade,false) then pr.wholesale_price else pr.retail_price end;
    unit := round(unit * (1 - coalesce((select max(discount) from deals d where d.product_id = pr.id and now() between d.starts and d.ends),0) / 100.0), 2);
    lines := lines || jsonb_build_object('id', pr.id, 'title', pr.title, 'grade', pr.grade, 'qty', greatest(1,(l->>'qty')::int), 'unit', unit);
    sub := sub + unit * greatest(1,(l->>'qty')::int);
  end loop;
  ship := case p->>'delivery' when 'uae' then (case when sub >= 500 then 0 else 25 end) else 0 end; -- world: quoted by the team
  insert into orders (no, user_id, company_id, email, name, phone, lines, sub, vat, ship, total, delivery, address, country, note, pay, history)
  values ('SE-' || extract(year from now())::int || '-' || nextval('order_no'), auth.uid(), nullif(p->>'company_id','')::uuid, p->>'email', p->>'name', p->>'phone', lines, sub, round((sub + ship) * 0.05, 2), ship, round((sub + ship) * 1.05, 2),
          p->>'delivery', p->>'address', p->>'country', p->>'note', coalesce(p->>'pay','whatsapp'), jsonb_build_array(jsonb_build_object('at', extract(epoch from now())*1000, 'status', 'New')))
  returning * into r;
  insert into email_queue (to_email, template, data) values (r.email, 'order-received', to_jsonb(r));
  return r;
end $$;
create or replace function set_order_status(p_id uuid, p_status text) returns orders language plpgsql security definer set search_path = public as $$
declare r orders; who text;
begin
  if not has_perm('orders') then raise exception 'Not allowed.'; end if;
  select name into who from staff where id = auth.uid();
  update orders set status = p_status, history = history || jsonb_build_array(jsonb_build_object('at', extract(epoch from now())*1000, 'status', p_status, 'by', who)) where id = p_id returning * into r;
  insert into email_queue (to_email, template, data) values (r.email, 'order-status', to_jsonb(r));
  insert into audit_log (staff_id, staff_name, action, target, detail) values (auth.uid(), who, 'order.status', r.no, p_status);
  return r;
end $$;

-- ── reviews (account holders only; "verified" when they bought it) ───────────────────────────────────────────
create table if not exists reviews (id uuid primary key default gen_random_uuid(), product_id text references products(id) on delete cascade, user_id uuid references profiles(id) on delete cascade default auth.uid(), name text, stars int not null check (stars between 1 and 5), title text, text text, verified boolean default false, hidden boolean default false, created_at timestamptz default now());
create or replace function on_review() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.user_id := auth.uid(); select name into new.name from profiles where id = auth.uid();
  new.verified := exists (select 1 from orders o, jsonb_array_elements(o.lines) x where o.user_id = auth.uid() and x->>'id' = new.product_id);
  return new;
end $$;
drop trigger if exists t_review on reviews;
create trigger t_review before insert on reviews for each row execute function on_review();

-- ── live chat (visitors ↔ team) ───────────────────────────────────────────────────────────────────────────
create table if not exists threads (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete set null, name text, email text, topic text, status text default 'open', last text, unread int default 0, assigned uuid references staff(id), visitor_key text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists messages (id uuid primary key default gen_random_uuid(), thread_id uuid references threads(id) on delete cascade, sender text not null check (sender in ('visitor','staff','samsoom')), name text, text text not null, read boolean default false, created_at timestamptz default now());
create or replace function send_message(p_thread uuid, p_name text, p_email text, p_topic text, p_text text, p_from text) returns uuid language plpgsql security definer set search_path = public as $$
declare t uuid := p_thread;
begin
  if p_from = 'staff' and not has_perm('chat') then raise exception 'Not allowed.'; end if;
  if t is null then insert into threads (user_id, name, email, topic, last) values (auth.uid(), p_name, p_email, p_topic, p_text) returning id into t;
  elsif p_from = 'visitor' and not exists (select 1 from threads where id = t and (user_id = auth.uid() or user_id is null)) then raise exception 'Not allowed.'; end if;
  insert into messages (thread_id, sender, name, text) values (t, p_from, p_name, p_text);
  update threads set last = p_text, updated_at = now(), unread = case when p_from = 'visitor' then unread + 1 else 0 end, status = case when p_from = 'visitor' then 'open' else 'waiting' end where id = t;
  return t;
end $$;

-- ── applications, settings, audit, e-mail queue, saved things ────────────────────────────────────────────────
create table if not exists applications (id uuid primary key default gen_random_uuid(), type text not null check (type in ('job','wholesale','membership','circle')), name text not null, email text not null, phone text, data jsonb default '{}', status text default 'new', created_at timestamptz default now());
create table if not exists settings (key text primary key, value jsonb, updated_at timestamptz default now(), updated_by uuid default auth.uid());
create table if not exists audit_log (id uuid primary key default gen_random_uuid(), staff_id uuid default auth.uid(), staff_name text, action text not null, target text, detail text, created_at timestamptz default now());
create table if not exists email_queue (id uuid primary key default gen_random_uuid(), to_email text not null, template text not null, data jsonb, sent_at timestamptz, error text, created_at timestamptz default now());
create table if not exists saved_items (user_id uuid references profiles(id) on delete cascade default auth.uid(), kind text not null check (kind in ('cart','fav','later','alert','compare','device')), ref text not null, qty int default 1, created_at timestamptz default now(), primary key (user_id, kind, ref));
create table if not exists samsoom_chats (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade default auth.uid(), title text, messages jsonb default '[]', updated_at timestamptz default now());

create or replace function save_staff(p jsonb) returns staff language plpgsql security definer set search_path = public as $$
declare r staff;
begin
  if not has_perm('staff') then raise exception 'Only the owner and managers can change staff.'; end if;
  -- the person signs up (or is invited from Supabase → Authentication) first; this gives them a staff role
  insert into staff (id, email, name, role, title, photo, phone, branch, active, perms)
  select u.id, lower(p->>'email'), p->>'name', p->>'role', p->>'title', p->>'photo', p->>'phone', coalesce(p->>'branch','Dubai · Deira'), coalesce((p->>'active')::boolean, true), coalesce(array(select jsonb_array_elements_text(p->'perms')), '{}')
  from auth.users u where lower(u.email) = lower(p->>'email')
  on conflict (id) do update set name = excluded.name, role = excluded.role, title = excluded.title, photo = excluded.photo, phone = excluded.phone, branch = excluded.branch, active = excluded.active, perms = excluded.perms
  returning * into r;
  if r.id is null then raise exception 'Ask them to create an account with this e-mail first.'; end if;
  insert into audit_log (action, target, detail) values ('staff.save', r.email, r.role);
  return r;
end $$;

-- stock changes always go through here, so every unit is accounted for
alter table stock_moves add column if not exists staff_name text;
create or replace function stock_move(p_id text, p_delta int, p_reason text, p_ref text) returns void language plpgsql security definer set search_path = public as $$
declare who text;
begin
  if not has_perm('stock') then raise exception 'Not allowed.'; end if;
  select name into who from staff where id = auth.uid();
  update products set stock_qty = greatest(0, stock_qty + p_delta), updated_at = now() where id = p_id;
  insert into stock_moves (product_id, delta, reason, ref, staff_id, staff_name) values (p_id, p_delta, p_reason, p_ref, auth.uid(), who);
end $$;

-- ── row-level security ────────────────────────────────────────────────────────────────────────────────────
alter table brands enable row level security; alter table models enable row level security; alter table categories enable row level security;
alter table manufacturers enable row level security; alter table products enable row level security; alter table deals enable row level security;
alter table stock_moves enable row level security; alter table profiles enable row level security; alter table staff enable row level security;
alter table companies enable row level security; alter table orders enable row level security; alter table reviews enable row level security;
alter table threads enable row level security; alter table messages enable row level security; alter table applications enable row level security;
alter table settings enable row level security; alter table audit_log enable row level security; alter table email_queue enable row level security;
alter table saved_items enable row level security; alter table samsoom_chats enable row level security;

do $$ begin
  -- public catalogue (cost price stays hidden: read products through the products_public view)
  create policy "read brands" on brands for select using (true);
  create policy "read models" on models for select using (true);
  create policy "read categories" on categories for select using (true);
  create policy "read makers" on manufacturers for select using (true);
  create policy "read products" on products for select using (visible or has_perm('products'));
  create policy "read deals" on deals for select using (true);
  create policy "edit catalogue" on products for all using (has_perm('products') or has_perm('stock') or has_perm('prices')) with check (has_perm('products') or has_perm('stock') or has_perm('prices'));
  create policy "edit brands" on brands for all using (has_perm('products')) with check (has_perm('products'));
  create policy "edit models" on models for all using (has_perm('products')) with check (has_perm('products'));
  create policy "edit deals" on deals for all using (has_perm('prices')) with check (has_perm('prices'));
  create policy "stock moves" on stock_moves for all using (has_perm('stock')) with check (has_perm('stock'));
  -- people
  create policy "own profile" on profiles for select using (id = auth.uid() or has_perm('customers'));
  create policy "edit own profile" on profiles for update using (id = auth.uid() or has_perm('customers'));
  create policy "staff read" on staff for select using (is_staff());
  create policy "own staff profile" on staff for update using (id = auth.uid());
  create policy "own companies" on companies for all using (owner = auth.uid() or has_perm('customers')) with check (owner = auth.uid() or has_perm('customers'));
  create policy "own orders" on orders for select using (user_id = auth.uid() or has_perm('orders'));
  create policy "read reviews" on reviews for select using (not hidden or has_perm('content'));
  create policy "write review" on reviews for insert with check (auth.uid() is not null);
  create policy "moderate reviews" on reviews for update using (has_perm('content'));
  create policy "own threads" on threads for select using (user_id = auth.uid() or has_perm('chat'));
  create policy "assign threads" on threads for update using (has_perm('chat'));
  create policy "own messages" on messages for select using (has_perm('chat') or exists (select 1 from threads t where t.id = thread_id and t.user_id = auth.uid()));
  create policy "apply" on applications for insert with check (true);
  create policy "read applications" on applications for select using (has_perm('approvals') or has_perm('staff'));
  create policy "review applications" on applications for update using (has_perm('approvals') or has_perm('staff'));
  create policy "read settings" on settings for select using (true);
  create policy "edit settings" on settings for all using (has_perm('content') or has_perm('settings')) with check (has_perm('content') or has_perm('settings'));
  create policy "read audit" on audit_log for select using (has_perm('audit'));
  create policy "write audit" on audit_log for insert with check (is_staff());
  create policy "read email queue" on email_queue for select using (has_perm('emails'));
  create policy "own saved" on saved_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  create policy "own samsoom chats" on samsoom_chats for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

create or replace view products_public with (security_invoker = true) as
  select id, model_id, category, part, part_name, grade, quality, manufacturer, title, description, colour, shot, photos, retail_price,
         case when has_perm('prices') or exists (select 1 from profiles p where p.id = auth.uid() and p.trade_approved) then wholesale_price end as wholesale_price,
         stock_qty, low_stock_threshold, warranty, badges, visible, sample from products where visible;

-- live updates for the team inbox, orders and stock (Supabase Realtime)
do $$ begin alter publication supabase_realtime add table messages, threads, orders, products; exception when others then null; end $$;

-- after the owner signs up on the site, make them the owner (replace the e-mail):
-- insert into staff (id, email, name, role, title, perms) select id, email, 'Tarek', 'owner', 'Founder & owner', '{}' from auth.users where email = 'OWNER-EMAIL-HERE';
