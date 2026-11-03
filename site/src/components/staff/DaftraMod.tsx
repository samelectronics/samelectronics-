'use client';
// R9 · Control Room → Daftra. Daftra is the brain (stock, prices, clients, quotations, invoices); the website reads it.
//  · Status: connected? writing allowed? how the link is protected
//  · Products: browse and search Daftra's products (name, code, price, stock)
//  · Match: link each website product to its Daftra product by name (suggestions with a score, change or unlink), saved as
//    the 'daftra-map' setting; then "Pull prices & stock" copies Daftra's price and stock onto the linked website products
//  · Clients, Quotations, Invoices: read-only lists
// Nothing from Daftra is stored in the code: it is fetched live through /api/daftra (staff only).
import React, { useEffect, useMemo, useState } from 'react';
import { backend, staffToken, type Staff } from '@/lib/backend';
import { rawProducts, invalidate, norm } from '@/lib/catalog';
import { Panel, Badge, useSetting, money, can } from './kit';

type Row = Record<string, unknown>;
const KEY = 'cr-daftra-key';
export async function api(path: string, q = '', post?: unknown) {
  const h: Record<string, string> = {}; try { const k = sessionStorage.getItem(KEY); if (k) h['x-cr-key'] = k; } catch { /* */ }
  const t = await staffToken(); if (t) h.Authorization = 'Bearer ' + t;
  if (post) h['Content-Type'] = 'application/json';
  const r = await fetch('/api/daftra/' + path + (q ? '?' + q : ''), { method: post ? 'POST' : 'GET', headers: h, cache: 'no-store', body: post ? JSON.stringify(post) : undefined }); const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
  // R11b: Daftra sometimes wraps each row ({ Invoice: {...} }) or sends an object instead of a list: always hand back a flat list
  const raw = (j as { rows?: unknown }).rows, list = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw as object) : [];
  (j as { rows: unknown }).rows = list.map((x) => { if (x && typeof x === 'object') { const v = Object.values(x as object); if (v.length === 1 && v[0] && typeof v[0] === 'object' && !Array.isArray(v[0])) return v[0]; } return x; }).filter((x) => x && typeof x === 'object');
  return j as { id?: string; no?: string; type?: string; rows: Row[]; pagination: { page_count?: number; total_results?: number } | null; connected?: boolean; write?: boolean; subdomain?: string; protectedBy?: string };
}
const s = (v: unknown) => (v == null ? '' : String(v)), n = (v: unknown) => +s(v) || 0;
const toks = (x: string) => new Set(norm(x).split(' ').filter((t) => t.length > 1));
const score = (a: Set<string>, b: Set<string>) => { let i = 0; a.forEach((t) => { if (b.has(t)) i++; }); return a.size && b.size ? (2 * i) / (a.size + b.size) : 0; };

const cancelled = (r: Row) => /CANCEL/i.test(s(r.name));
export default function DaftraMod({ me }: { me: Staff }) {
  const seeCost = can(me, 'prices') || can(me, 'accounting'), [showCx, setShowCx] = useState(false);
  const [st, setSt] = useState<{ connected?: boolean; write?: boolean; subdomain?: string | null; protectedBy?: string } | null>(null), [err, setErr] = useState(''), [tab, setTab] = useState<'products' | 'match' | 'clients' | 'estimates' | 'invoices'>('products');
  const [key, setKey] = useState(''), [list, setList] = useState<Row[]>([]), [busy, setBusy] = useState(false), [q, setQ] = useState(''), [page, setPage] = useState(1), [pages, setPages] = useState(1);
  const [all, setAll] = useState<Row[]>([]), [map, setMap] = useSetting<Record<string, { id: string; name: string }>>('daftra-map', {}), [msg, setMsg] = useState('');
  useEffect(() => { api('status').then(setSt).catch((e) => setErr(e.message)); try { setKey(sessionStorage.getItem(KEY) || ''); } catch { /* */ } }, []);
  const load = async (t = tab, p = page) => {
    if (t === 'match') return; setBusy(true); setErr('');
    try { const r = await api(t + '.json', new URLSearchParams({ page: String(p), limit: '50', ...(q ? { keyword: q } : {}) }).toString()); setList(t === 'products' && !showCx ? r.rows.filter((x) => !cancelled(x)) : r.rows); setPages(r.pagination?.page_count || 1); } catch (e) { setErr((e as Error).message); setList([]); }
    setBusy(false);
  };
  useEffect(() => { if (st?.connected) load(); }, [tab, page, st?.connected, showCx]); // eslint-disable-line react-hooks/exhaustive-deps
  // every Daftra product, for matching (pages of 100)
  const loadAll = async () => { setBusy(true); setErr(''); const out: Row[] = []; try { for (let p = 1; p <= 40; p++) { const r = await api('products.json', 'limit=100&page=' + p); out.push(...r.rows.filter((x) => !cancelled(x))); if (p >= (r.pagination?.page_count || 1)) break; } setAll(out); } catch (e) { setErr((e as Error).message); } setBusy(false); };
  const site = useMemo(() => rawProducts().map((p) => ({ p, t: toks(p.title + ' ' + p.part_name + ' ' + p.grade) })), [all.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const sugg = useMemo(() => { const D = all.map((d) => ({ d, t: toks(s(d.name) + ' ' + s(d.product_code)) })); return site.map(({ p, t }) => { let best: { d: Row; sc: number } | null = null; for (const x of D) { const sc = score(t, x.t); if (!best || sc > best.sc) best = { d: x.d, sc }; } return { p, best }; }); }, [all, site]);
  const pull = async () => {
    // only price (when it is above 0) and stock are copied; Daftra's names and cost never reach the website.
    // A website product linked to a Daftra item that is now marked CANCEL is hidden.
    let k = 0, hid = 0, kept = 0;     for (const [sid, d] of Object.entries(map)) {
      const row = all.find((x) => s(x.id) === d.id);
      if (!row) { if (/CANCEL/i.test(d.name)) { await backend.saveProduct(sid, { visible: false }); hid++; } continue; }
      const price = n(row.unit_price); if (price <= 0) kept++;
      await backend.saveProduct(sid, { ...(price > 0 ? { retail_price: price } : {}), stock_qty: Math.max(0, Math.round(n(row.stock_balance))), daftra_id: d.id }); k++;
    }
    invalidate(); setMsg(k + ' website products updated from Daftra (price and stock).' + (kept ? ' ' + kept + ' have no price in Daftra: the website keeps its own price, or shows “Ask for price”.' : '') + (hid ? ' ' + hid + ' linked to cancelled items were hidden.' : ''));
  };
  const cols: Record<string, [string, (r: Row) => React.ReactNode][]> = {
    products: [['Name', (r) => s(r.name)], ['Code', (r) => s(r.product_code) || s(r.barcode)], ['Price', (r) => (n(r.unit_price) > 0 ? money(n(r.unit_price)) : '—')], ...(seeCost ? [['Cost', (r: Row) => (r.buy_price != null ? money(n(r.buy_price)) : '')] as [string, (r: Row) => React.ReactNode]] : []), ['Stock', (r) => s(r.stock_balance)]],
    clients: [['Name', (r) => s(r.business_name) || [s(r.first_name), s(r.last_name)].join(' ')], ['Phone', (r) => s(r.phone1) || s(r.phone2)], ['E-mail', (r) => s(r.email)], ['Country', (r) => s(r.country_code)]],
    estimates: [['No.', (r) => s(r.no)], ['Client', (r) => s(r.client_business_name) || s(r.client_first_name)], ['Date', (r) => s(r.date)], ['Total', (r) => money(n(r.summary_total))]],
    invoices: [['No.', (r) => s(r.no)], ['Client', (r) => s(r.client_business_name) || s(r.client_first_name)], ['Date', (r) => s(r.date)], ['Total', (r) => money(n(r.summary_total))], ['Paid', (r) => money(n(r.summary_paid))]],
  };
  return (
    <div className="cr-grid">
      <Panel t="Daftra connection" d="Daftra is the brain: stock, prices, clients, quotations and invoices. The website reads it live; nothing is copied into the code." className="span2"
        right={st ? <span className="cr-acts"><Badge t={st.connected ? 'CONNECTED' : 'NOT CONNECTED'} tone={st.connected ? 'g' : 'r'} /><Badge t={st.write ? 'CAN CREATE QUOTES/INVOICES' : 'READ ONLY'} tone={st.write ? 'y' : 'd'} /></span> : null}>
        {!st ? <div className="cr-muted">Checking…</div> : !st.connected ? <div className="cr-note">Add <b>DAFTRA_API_KEY</b> and <b>DAFTRA_SUBDOMAIN</b> (samelectronics) in Vercel → Settings → Environment Variables, then redeploy.</div> : (
          <div className="cr-form">
            <div className="cr-li"><span>Account: <b>{st.subdomain}.daftra.com</b> · protected by <b>{st.protectedBy === 'key' ? 'the Control Room key' : st.protectedBy === 'supabase' ? 'staff sign-in (Supabase)' : 'nothing yet: set CONTROL_ROOM_KEY in Vercel'}</b></span></div>
            {st.protectedBy === 'key' ? <div className="cr-row2"><label>Control Room key (kept for this browser tab only)<input className="cr-in" type="password" value={key} onChange={(e) => setKey(e.target.value)} /></label><button type="button" className="cr-btn" onClick={() => { try { sessionStorage.setItem(KEY, key); } catch { /* */ } load(); }}>Unlock</button></div> : null}
          </div>
        )}
        {err ? <div className="cr-err">{err}</div> : null}
      </Panel>
      {st?.connected ? (
        <Panel t="Daftra data" className="span2" right={<span className="cr-tabs">{(['products', 'match', 'clients', 'estimates', 'invoices'] as const).map((t) => <button key={t} type="button" className={tab === t ? 'on' : ''} onClick={() => { setTab(t); setPage(1); }}>{t === 'estimates' ? 'Quotations' : t === 'match' ? 'Match to website' : t[0].toUpperCase() + t.slice(1)}</button>)}</span>}>
          {tab === 'match' ? (
            <div className="cr-form">
              <div className="cr-note">Link each website product to its Daftra product. Suggestions come from the names; check them, change any that are wrong, then pull prices and stock. {Object.keys(map).length} linked.</div>
              <div className="cr-acts"><button type="button" className="cr-btn" disabled={busy} onClick={loadAll}>{busy ? 'Loading Daftra products…' : all.length ? 'Reload Daftra products (' + all.length + ')' : 'Load Daftra products'}</button>
                <button type="button" className="cr-btn ghost" disabled={!all.length} onClick={() => { const m = { ...map }; sugg.forEach(({ p, best }) => { if (best && best.sc >= 0.6 && !m[p.id]) m[p.id] = { id: s(best.d.id), name: s(best.d.name) }; }); setMap(m, 'Linked strong name matches to Daftra'); }}>Link all strong matches (60%+)</button>
                <button type="button" className="cr-btn ghost" disabled={!all.length || !Object.keys(map).length} onClick={pull}>Pull prices & stock</button></div>
              {msg ? <div className="cr-ok">{msg}</div> : null}
              {all.length ? (
                <div className="cr-tbl"><table><thead><tr><th>Website product</th><th>Daftra product</th><th>Match</th><th /></tr></thead><tbody>
                  {sugg.slice(0, 400).map(({ p, best }) => { const linked = map[p.id]; return (
                    <tr key={p.id}><td><b>{p.title}</b><br /><small className="cr-muted">{p.id}</small></td>
                      <td><select className="cr-in" value={linked?.id || ''} onChange={(e) => { const d = all.find((x) => s(x.id) === e.target.value); const m = { ...map }; if (d) m[p.id] = { id: s(d.id), name: s(d.name) }; else delete m[p.id]; setMap(m, 'Daftra link changed for ' + p.id); }}>
                        <option value="">{best ? '— suggested: ' + s(best.d.name) : '— not linked'}</option>{all.map((d) => <option key={s(d.id)} value={s(d.id)}>{s(d.name)}{d.product_code ? ' · ' + s(d.product_code) : ''}</option>)}</select></td>
                      <td>{linked ? <Badge t="LINKED" tone="g" /> : best ? <Badge t={Math.round(best.sc * 100) + '%'} tone={best.sc >= 0.6 ? 'y' : 'd'} /> : null}</td>
                      <td>{!linked && best ? <button type="button" className="cr-btn sm" onClick={() => setMap({ ...map, [p.id]: { id: s(best!.d.id), name: s(best!.d.name) } }, 'Linked ' + p.id + ' to Daftra')}>Link</button> : null}</td></tr>); })}
                </tbody></table></div>
              ) : null}
            </div>
          ) : (
            <>
              <div className="cr-acts"><input className="cr-in" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); load(tab, 1); } }} placeholder="Search Daftra…" /><button type="button" className="cr-btn ghost" onClick={() => { setPage(1); load(tab, 1); }}>Search</button>{tab === 'products' ? <label className="cr-chk" style={{ paddingTop: 0 }}><input type="checkbox" checked={showCx} onChange={(e) => setShowCx(e.target.checked)} /> Show items marked CANCEL</label> : null}</div>
              {busy ? <div className="cr-muted">Loading…</div> : (
                <div className="cr-tbl"><table><thead><tr>{cols[tab].map(([h]) => <th key={h}>{h}</th>)}</tr></thead><tbody>{list.map((r, i) => <tr key={s(r.id) || i}>{cols[tab].map(([h, f]) => <td key={h}>{f(r)}</td>)}</tr>)}</tbody></table>{!list.length ? <div className="cr-muted">Nothing found.</div> : null}</div>
              )}
              <div className="cr-acts"><button type="button" className="cr-btn ghost sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Previous</button><span className="cr-muted">Page {page} of {pages}</span><button type="button" className="cr-btn ghost sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next →</button></div>
            </>
          )}
        </Panel>
      ) : null}
    </div>
  );
}
