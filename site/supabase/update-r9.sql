-- Sam Electronics · update for a database set up with setup.sql before 2 Nov 2026. Run ONCE in the SQL Editor.
-- 1. price display settings per product (exact / range / from / whatsapp / call / trade) and the Daftra link
alter table products add column if not exists price_mode text not null default 'exact' check (price_mode in ('exact','range','from','whatsapp','call','trade'));
alter table products add column if not exists price_max numeric(10,2);
alter table products add column if not exists price_note text;
alter table products add column if not exists daftra_id text;
alter table orders add column if not exists pending boolean not null default false;

-- 2. cost and trade prices stay private: the public reads products only through products_public (no cost, trade price
--    only for approved trade accounts); the products table itself is readable by staff only
drop policy if exists "read products" on products;
create policy "read products" on products for select using (has_perm('products') or has_perm('prices') or has_perm('stock'));
drop view if exists products_public;
create view products_public as
  select id, model_id, category, part, part_name, grade, quality, manufacturer, title, description, colour, shot, photos, retail_price,
         case when has_perm('prices') or exists (select 1 from profiles p where p.id = auth.uid() and p.trade_approved) then wholesale_price end as wholesale_price,
         stock_qty, low_stock_threshold, warranty, badges, visible, sample, price_mode, price_max, price_note
  from products where visible and upper(title) not like '%CANCEL%';
grant select on products_public to anon, authenticated;

-- 3. orders: items without a fixed price (ask / call / range / from / trade-only for non-trade / out of stock / price 0)
--    are saved at 0 with "confirm": true and left out of the total; the order is marked pending (prices to confirm)
create or replace function place_order(p jsonb) returns orders language plpgsql security definer set search_path = public as $$
declare l jsonb; pr products; trade boolean; unit numeric; fixed boolean; lines jsonb := '[]'; sub numeric := 0; ship numeric := 0; pend boolean := false; r orders;
begin
  select coalesce(trade_approved,false) into trade from profiles where id = auth.uid();
  for l in select * from jsonb_array_elements(p->'lines') loop
    select * into pr from products where id = l->>'id' and visible;
    if pr.id is null then raise exception 'A part in your cart is no longer available.'; end if;
    unit := case when coalesce(trade,false) then pr.wholesale_price else pr.retail_price end;
    unit := round(unit * (1 - coalesce((select max(discount) from deals d where d.product_id = pr.id and now() between d.starts and d.ends),0) / 100.0), 2);
    fixed := (pr.price_mode = 'exact' or (pr.price_mode = 'trade' and coalesce(trade,false))) and unit > 0 and pr.stock_qty > 0;
    if not fixed then unit := 0; pend := true; end if;
    lines := lines || jsonb_build_object('id', pr.id, 'title', pr.title, 'grade', pr.grade, 'qty', greatest(1,(l->>'qty')::int), 'unit', unit) || case when fixed then '{}'::jsonb else '{"confirm": true}'::jsonb end;
    sub := sub + unit * greatest(1,(l->>'qty')::int);
  end loop;
  ship := case p->>'delivery' when 'uae' then (case when sub >= 500 then 0 else 25 end) else 0 end; -- world: quoted by the team
  insert into orders (no, user_id, company_id, email, name, phone, lines, sub, vat, ship, total, delivery, address, country, note, pay, pending, history)
  values ('SE-' || extract(year from now())::int || '-' || nextval('order_no'), auth.uid(), nullif(p->>'company_id','')::uuid, p->>'email', p->>'name', p->>'phone', lines, sub, round((sub + ship) * 0.05, 2), ship, round((sub + ship) * 1.05, 2),
          p->>'delivery', p->>'address', p->>'country', p->>'note', case when pend then 'whatsapp' else coalesce(p->>'pay','whatsapp') end, pend, jsonb_build_array(jsonb_build_object('at', extract(epoch from now())*1000, 'status', 'New')))
  returning * into r;
  insert into email_queue (to_email, template, data) values (r.email, 'order-received', to_jsonb(r));
  return r;
end $$;
