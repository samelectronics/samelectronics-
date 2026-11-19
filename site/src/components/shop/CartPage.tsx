'use client';
// P2 · The cart and checkout. Lines with quantity, save for later, 5% UAE VAT, delivery (pick-up · UAE · worldwide), the
// customer's details (filled from the account, or a company profile), then the order is placed (backend.placeOrder —
// on Supabase the server recomputes prices and VAT) and confirmed on WhatsApp. Saved-for-later and stars sit underneath.
import { PAY_DEFAULT } from '@/lib/payments';
import { siteRaw , priceText, ptitle } from '@/lib/catalog';
import { notify } from '@/lib/notes';
import React, { useEffect, useState } from 'react';
import { type Product, aed, byId, data, VAT, waLink, waCard, fmt, siteSetting, fixedPrice } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { backend, useMe, type Company, type Order } from '@/lib/backend';
import { T, useRise } from '@/components/site/ui';
import LiveSam from '@/components/samsoom/LiveSam';
type Coupon = { code: string; kind: 'pct' | 'aed'; value: number; min?: number; until?: number; trade?: boolean; active?: boolean; ids?: string[]; cats?: string[] };

type Via = 'wa' | 'wc' | 'mail' | 'web';
const VIA: [Via, string, string][] = [['wa', 'WhatsApp', 'Opens WhatsApp with your list'], ['wc', 'WeChat', 'Copy the list, send it in WeChat'], ['mail', 'E-mail', 'Your e-mail app, list included'], ['web', 'The website', 'We reply here and in My Bench']];
const DL = () => siteSetting('delivery', { uae: 25, freeOver: 500, pickupReady: '20 minutes' }); // set in the Control Room → Settings

export default function CartPage() {
  const st = useStore(), [me] = useMe(), [ready, setReady] = useState(false), [cos, setCos] = useState<Company[]>([]);
  const [del, setDel] = useState<'pickup' | 'uae' | 'world'>('pickup'), [pay, setPay] = useState<Order['pay']>('whatsapp');
  const [cpCode, setCpCode] = useState(''), [cpIn, setCpIn] = useState('');
  // owner (16 Nov): a code entered on a product page is carried to checkout
  useEffect(() => { try { const c = localStorage.getItem('se-coupon'); if (c) { setCpIn(c); setCpCode(c); } } catch { /* */ } }, []);
  useEffect(() => { try { if (cpCode) localStorage.setItem('se-coupon', cpCode); } catch { /* */ } }, [cpCode]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', country: 'United Arab Emirates', note: '', company: '' });
  const [busy, setBusy] = useState(false), [err, setErr] = useState(''), [done, setDone] = useState<Order | null>(null), [code, setCode] = useState(''), [codeMsg, setCodeMsg] = useState('');
  // owner (19 Nov): send it any way (WhatsApp, WeChat, e-mail, the website), always after a preview laid out like an invoice
  const [via, setVia] = useState<Via>('wa'), [pv, setPv] = useState(false), [sentVia, setSentVia] = useState<Via>('wa');
  useEffect(() => { const iv = window.setInterval(() => { if (data()) { window.clearInterval(iv); setReady(true); } }, 60); return () => window.clearInterval(iv); }, []);
  useEffect(() => { if (me) { setForm((f) => ({ ...f, name: f.name || me.name, email: f.email || me.email, phone: f.phone || me.phone || '' })); backend.companies().then(setCos); } }, [me]);
  useRise(ready);
  if (!ready) return <div className="shop-wait"><span /><span /><span /></div>;

  const trade = !!me?.tradeApproved, dl = DL(), SHIP = { pickup: 0, uae: dl.uae, world: 0 }, FREE = dl.freeOver;
  const lines = st.cart.map((l) => ({ l, p: byId(l.id) })).filter((x) => x.p) as { l: { id: string; qty: number }; p: Product }[];
  const fixed = (p: Product) => fixedPrice(p, trade);
  const unit = (p: Product) => (!fixed(p) ? 0 : trade ? p.wholesale_price : p.price);
  const toConfirm = lines.filter(({ p }) => !fixed(p)).length;
  const sub = lines.reduce((a, { l, p }) => a + unit(p) * l.qty, 0), save = lines.reduce((a, { l, p }) => a + (fixed(p) ? (p.retail_price - unit(p)) * l.qty : 0), 0);
  // R9: what the customer sees for a price that is confirmed on WhatsApp
  const hint = (p: Product) => (p.price <= 0 ? '' : (!p.price_mode || p.price_mode === 'exact') && p.stock_qty <= 0 ? aed(trade ? p.wholesale_price : p.price, false) : p.price_mode === 'from' ? T('From') + ' ' + aed(p.price, false) : p.price_mode === 'range' ? aed(p.price, false) + ' – ' + aed(p.price_max || p.price, false).replace(/^AED /, '') : '');
  // R10 4.9: coupons made in the Control Room (Pricing). The team still confirms every order, so the code also goes in the note.
  const cps = siteRaw<Coupon[]>('coupons', []) || [];
  const cp = cpCode ? cps.find((c) => c.active !== false && c.code.toUpperCase() === cpCode.toUpperCase() && (!c.until || c.until > Date.now()) && (!c.min || sub >= c.min) && (!c.trade || trade)) : undefined;
  // a code can be limited to some parts or categories: then only those lines count
  const base = cp ? lines.reduce((a, { l, p }) => a + ((!cp.ids || !cp.ids.length || cp.ids.includes(p.id)) && (!cp.cats || !cp.cats.length || cp.cats.includes(p.category)) ? unit(p) * l.qty : 0), 0) : 0;
  const disc = cp ? Math.min(base, Math.round((cp.kind === 'pct' ? (base * cp.value) / 100 : cp.value) * 100) / 100) : 0;
  const ship = del === 'uae' ? (sub >= FREE ? 0 : SHIP.uae) : 0, vat = Math.round((sub - disc + ship) * VAT * 100) / 100, total = sub - disc + ship + vat;
  const saved = st.saved.map(byId).filter(Boolean) as Product[], favs = st.favs.map(byId).filter(Boolean) as Product[];
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });
  const check = (e: React.FormEvent) => { e.preventDefault(); setErr(''); if (!lines.length) return; if (del !== 'pickup' && !form.address.trim()) return setErr(T('Please add the delivery address.')); setPv(true); };
  const place = async () => {
    if (!lines.length) return;
    setBusy(true);
    // WhatsApp opens right away (a tab opened before the wait is not blocked) and gets the list after
    const tab = via === 'wa' ? window.open('', '_blank') : null;
    const r = await backend.placeOrder({ email: form.email, name: form.name, phone: form.phone, lines: lines.map(({ l, p }) => ({ id: p.id, title: p.title, grade: p.gradeName, qty: l.qty, unit: unit(p), ...(fixed(p) ? {} : { confirm: true }) })), sub: sub - disc, vat, ship, total, delivery: del, address: form.address, country: form.country, note: '[Sent by ' + ({ wa: 'WhatsApp', wc: 'WeChat', mail: 'e-mail', web: 'website' } as const)[via] + '] ' + (toConfirm ? '[Prices to confirm: ' + toConfirm + '] ' : '') + (cp ? '[Coupon ' + cp.code + ' −' + disc.toFixed(2) + '] ' : '') + form.note, pay: toConfirm ? 'whatsapp' : pay, company: form.company || undefined, ...(toConfirm ? { pending: true } : {}) });
    setBusy(false);
    if (!r.ok) { tab?.close(); setPv(false); return setErr(T(r.error)); }
    const msg = listMsg(r.data);
    if (via === 'wa') { const link = waLink(msg); if (tab) tab.location.href = link; else window.open(link, '_blank', 'noopener'); }
    if (via === 'wc') window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wc', text: msg } }));
    if (via === 'mail') location.href = 'mailto:' + (data()?.contact.email || 'samelectronics.uae@gmail.com') + '?subject=' + encodeURIComponent(T('Order') + ' ' + r.data.no) + '&body=' + encodeURIComponent(msg.replace(/\*/g, '').replace(/_/g, ''));
    setSentVia(via); setPv(false); setDone(r.data); store.clear(); notify({ kind: 'order', t: 'Order received', d: 'We will confirm stock and message you shortly.', href: '/account#orders' }); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // R9: the full list for WhatsApp: name, model, part, grade/quality, color, quantity, price if known; then name + reference
  const listMsg = (o: Order) => {
    const rows = lines.map(({ l, p }, i) => [`*${i + 1}. ${p.title}*`, `   ${T('Model')}: ${p.modelName || '—'} · ${T('Part')}: ${p.part_name}`, `   ${T('Grade')}: ${p.gradeName} · ${T('Quality')}: ${p.qualityName}${p.colour ? ' · ' + T('Color') + ': ' + p.colour : ''}`, `   ${T('Quantity')}: ${l.qty}${p.stock_qty <= 0 ? ' · ' + T('out of stock: please check') : ''} · ${fixed(p) ? T('Price') + ': ' + aed(unit(p), false) + ' ' + T('each') : T('Price') + ': ' + T('please confirm') + (hint(p) ? ' (' + hint(p) + ')' : '')}`].join('\n'));
    return `*${T('PARTS LIST')}* · ${o.no}\n━━━━━━━━━━━━\n${rows.join('\n\n')}\n\n${sub ? T('Known total') + ': ' + aed(total, false) + ' ' + T('incl. VAT') + ' + ' : ''}${toConfirm} ${toConfirm === 1 ? T('item to confirm') : T('items to confirm')}\n${T('Delivery')}: ${T(({ pickup: 'Pick up in Deira', uae: 'Delivery in the UAE', world: 'Worldwide' } as const)[del])}\n\n*${T('From')}:* ${form.name}\n_${new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dubai' })} · ${location.host}/cart_`;
  };
  const waMsg = (o: Order) => waCard('Order ' + o.no, [['Parts', '\n' + o.lines.map((x) => `• ${x.qty} × ${x.title} · ${x.grade}`).join('\n')], ['Total', aed(o.total, false) + ' incl. VAT'], ['Delivery', o.delivery], ['Please', 'confirm stock and price']], { name: form.name });

  const steps = (n: number) => <ol className="ck-steps">{['Cart', 'Your details', 'Preview & send'].map((x, k) => <li key={x} className={k < n ? 'ok' : k === n ? 'on' : ''}><i>{k < n ? '✓' : k + 1}</i>{T(x)}</li>)}</ol>;
  const viaName = (v: Via) => (v === 'wa' ? 'WhatsApp' : v === 'wc' ? 'WeChat' : T(v === 'mail' ? 'E-mail' : 'The website'));
  if (done) return (
    <section className="ck"><div className="sp-wrap ck-done">
      {/* owner (19 Nov): a clean confirmation, not a page header */}
      <div className="ck-ok">
        <span className="ck-ok-sam"><LiveSam size={120} mood="idle" play="celebrate" /></span>
        <span className="ck-k">{T('ORDER RECEIVED')} · <span dir="ltr">{done.no}</span></span>
        <h1>{T('Thank you,') + ' ' + (done.name.split(' ')[0] || '') + '!'}</h1>
        <p>{sentVia === 'web' ? T('Your order is with our team. We confirm stock, delivery and the final price here and in My Bench.') : T('Your order is with our team, and we sent the list') + ' ' + T('by') + ' ' + viaName(sentVia) + '. ' + T('We confirm stock, delivery and the final price, usually within minutes during opening hours.')}</p>
        <div className="sp-acts"><a className="sp-btn" href="/shop">{T('Keep shopping')}</a>{me ? <a className="sp-btn ghost" href="/account#orders">{T('My orders')}</a> : null}</div>
        <ol className="cart-steps">{['Order received', 'Stock & price confirmed', 'Paid & packed', done.delivery === 'pickup' ? 'Ready to collect in Deira' : 'Shipped to you'].map((s2, k) => <li key={s2} className={k === 0 ? 'on' : ''}><i>{k + 1}</i>{T(s2)}</li>)}</ol>
      </div>
    </div></section>
  );

  return (
    <>
      {/* owner (19 Nov): "this is a checkout, it should be clean": a slim bar with the steps, no page header */}
      <section className="ck"><div className="sp-wrap">
        <div className="ck-top">
          <a className="ck-back" href="/shop">← {T('Keep shopping')}</a>
          <h1 className="ck-title">{T('Checkout')}{lines.length ? <span className="ck-n">{lines.reduce((a, x) => a + x.l.qty, 0)} {T('items')}</span> : null}</h1>
          {lines.length ? steps(pv ? 2 : 1) : null}
        </div>
      </div></section>
      <section className="sp-sec g ck-body"><div className="sp-wrap cart">
        <div className="cart-l">
          {lines.length ? (
            <div className="sp-card cart-lines" data-rise>
              <div className="cart-h"><h3 className="sp-h3">{T('Cart')} · {lines.length}</h3><button type="button" className="shop-clear" onClick={() => store.clear()}>{T('Empty the cart')}</button></div>
              {lines.map(({ l, p }) => (
                <div key={p.id} className="cart-ln">
                  <a href={'/shop?p=' + p.id} className="cart-img"><img src={p.img} alt="" /></a>
                  <div className="cart-info">
                    <a href={'/shop?p=' + p.id}><b>{ptitle(p)}</b></a>
                    <span className="pc-meta"><span className={'pc-gr g-' + p.grade}>{p.gradeName}</span><span>{p.makerName}</span><span>{p.warranty} {T('warranty')}</span></span>
                    <span className="cart-acts"><button type="button" onClick={() => store.later(p.id)}>{T('Save for later')}</button><button type="button" onClick={() => store.fav(p.id)}>{st.favs.includes(p.id) ? '★ ' + T('Starred') : '☆ ' + T('Star it')}</button><button type="button" onClick={() => store.remove(p.id)}>{T('Remove')}</button></span>
                  </div>
                  <span className="pv-qty sm"><button type="button" onClick={() => store.qty(p.id, l.qty - 1)}>−</button><input value={l.qty} onChange={(e) => store.qty(p.id, Math.max(1, +e.target.value || 1))} aria-label={T('Quantity')} /><button type="button" onClick={() => store.qty(p.id, l.qty + 1)}>+</button></span>
                  {fixed(p) ? <span className="cart-pr"><b>{aed(unit(p) * l.qty, false)}</b><small>{aed(unit(p), false)} {T('each')}{trade ? ' · ' + T('trade') : ''}</small></span> : <span className="cart-pr cart-tbc"><b>{p.stock_qty <= 0 ? T('Requested: we check stock on WhatsApp') : T('Price confirmed on WhatsApp')}</b>{hint(p) ? <small>{hint(p)}</small> : null}</span>}
                </div>
              ))}
              <span className="sp-sample">{T('All prices are samples until the owner’s prices are in.')}</span>
            </div>
          ) : (
            <div className="sp-card sp-empty ck-empty" data-rise><span className="ck-empty-sam"><LiveSam size={150} mood="idle" play="wave" /></span><b className="sp-h3">{T('Nothing here yet')}</b><span>{T('Find your part in seconds and it will wait here.')}</span><span className="sp-acts" style={{ justifyContent: 'center' }}><a className="sp-btn" href="/shop">{T('Go to the shop')}</a><button type="button" className="sp-btn ghost" onClick={() => window.dispatchEvent(new CustomEvent('se:fmp', { detail: {} }))}>Find My Part</button></span></div>
          )}

          {lines.length ? (
            <form className="sp-card cart-form" onSubmit={check} data-rise>
              <h3 className="sp-h3">{T('Delivery')}</h3>
              <div className="cart-del">
                {([['pickup', 'Pick up in Deira', 'Ready in about 20 minutes · free'], ['uae', 'Delivery in the UAE', sub >= FREE ? 'Next working day · free' : 'Next working day · AED 25 (free over AED 500)'], ['world', 'Worldwide', 'Door to door with Sky Dragon, Emirates SkyCargo, UPS or DHL, or your own shipper: we quote it']] as const).map(([k, t, d]) => (
                  <label key={k} className={'cart-opt' + (del === k ? ' on' : '')}><input type="radio" name="del" checked={del === k} onChange={() => setDel(k)} /><i /><span><b>{T(t)}</b><small>{T(d)}</small></span></label>
                ))}
              </div>
              <h3 className="sp-h3">{T('Your details')}</h3>
              {!me ? <div className="sp-note">{T('Have an account? Sign in to fill this in, collect points and see your orders.')} <a href="/account?next=/cart">{T('Sign in')}</a></div> : null}
              <div className="sp-grid sp-g2">
                <label className="sp-field">{T('Full name')}<input required value={form.name} onChange={set('name')} autoComplete="name" /></label>
                <label className="sp-field">{T('Phone (WhatsApp)')}<input required value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="+971 5x xxx xxxx" /></label>
                <label className="sp-field">{T('E-mail')}<input required type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
                {cos.length ? <label className="sp-field">{T('Order for')}<select value={form.company} onChange={set('company')}><option value="">{T('Myself')}</option>{cos.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label> : <label className="sp-field">{T('Country')}<input value={form.country} onChange={set('country')} autoComplete="country-name" /></label>}
                {del !== 'pickup' ? <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('Delivery address')}<input value={form.address} onChange={set('address')} autoComplete="street-address" placeholder={T('Building, street, area, city')} /></label> : null}
                <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('Note for the team (optional)')}<textarea value={form.note} onChange={set('note')} placeholder={T('Model number, color, anything we should know')} /></label>
              </div>
              {toConfirm ? null : <><h3 className="sp-h3">{T('Payment')}</h3>
              <div className="cart-del">
                {([['whatsapp', 'Confirm first, pay after', 'We confirm on WhatsApp, then send a payment link'], ['cash', 'Cash or card in the shop', 'When you collect'], ['transfer', 'Bank transfer', 'For trade and export orders'], ['card', 'Card online', 'Coming soon']] as const).filter(([k]) => { const o = { ...PAY_DEFAULT, ...siteRaw<Record<string, boolean>>('payments', {}) }; return k === 'whatsapp' || (k === 'cash' ? o.cash || o['card-pos'] : k === 'transfer' ? o['bank-uae'] || o.swift : o.visa || o.mastercard); }).map(([k, t, d]) => (
                  <label key={k} className={'cart-opt' + (pay === k ? ' on' : '') + (k === 'card' ? ' off' : '')}><input type="radio" name="pay" disabled={k === 'card'} checked={pay === k} onChange={() => setPay(k)} /><i /><span><b>{T(t)}</b><small>{T(d)}</small></span></label>
                ))}
              </div>
              </>}
              <a className="cart-paylink" href="/payments" target="_blank" rel="noopener">{T('Every way to pay')} →</a>
              {err ? <div className="sp-note" style={{ background: 'rgba(229,72,77,.1)', color: '#9B1C20' }}>{err}</div> : null}
              <h3 className="sp-h3">{T('How should we receive it?')}</h3>
              <div className="ck-via" role="radiogroup">{VIA.map(([k, n, d]) => <button key={k} type="button" role="radio" aria-checked={via === k} className={'ck-v v-' + k + (via === k ? ' on' : '')} onClick={() => setVia(k)}><span className="ic">{k === 'wa' || k === 'wc' ? <i className={'ct-ic ' + k} /> : k === 'mail' ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 6h18v12H3zM3 7l9 6 9-6" /></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>}</span><b>{k === 'wa' || k === 'wc' ? n : T(n)}</b><small>{T(d)}</small></button>)}</div>
              {toConfirm ? <div className="sp-note">{toConfirm === 1 ? T('1 item has no fixed price.') : toConfirm + ' ' + T('items have no fixed price.')} {T('We confirm prices and stock with you first, then you pay.')}</div> : null}
              <button type="submit" className="sp-btn cart-place" disabled={busy}>{T('Review my order')} →</button>
              <small className="sp-muted">{T('By placing the order you agree to our')} <a href="/legal#terms">{T('terms')}</a>, <a href="/legal#returns">{T('returns')}</a> {T('and')} <a href="/legal#privacy">{T('privacy policy')}</a>.</small>
            </form>
          ) : null}
        </div>

        <aside className="cart-r">
          <div className="sp-card d cart-total" data-rise>
            <span className="sp-eb" style={{ color: '#F7C032' }}>{T('SUMMARY')}</span>
            {!lines.length ? <div className="cart-sum"><span>{T('Your cart is empty')}<b>·</b></span></div> : <div className="cart-sum">
              <span>{T('Subtotal')}<b>{sub > 0 || !toConfirm ? aed(sub, false) : T('To confirm')}</b></span>
              {save > 0 ? <span className="sv">{trade ? T('Trade savings') : T('You save')}<b>−{aed(save, false)}</b></span> : null}
              {disc > 0 ? <span className="sv">{T('Coupon')} {cp!.code}<b>−{aed(disc, false)}</b></span> : null}
              <span>{T('Delivery')}<b>{del === 'world' ? T('Quoted') : ship ? aed(ship, false) : T('Free')}</b></span>
              <span>{T('VAT 5%')}<b>{sub > 0 || !toConfirm ? aed(vat, false) : T('To confirm')}</b></span>
              <span className="tot">{T('Total')}<b>{sub > 0 || !toConfirm ? aed(total, false) : T('To confirm')}</b></span>
              <form className="cart-cp" onSubmit={(e) => { e.preventDefault(); setCpCode(cpIn.trim()); }}><input value={cpIn} onChange={(e) => setCpIn(e.target.value)} placeholder={T('Coupon code')} aria-label={T('Coupon code')} /><button type="submit">{T('Apply')}</button></form>
              {cpCode && !cp ? <small className="cart-cpx">{T('This code is not valid for this cart.')}</small> : null}
              {toConfirm ? <span className="cart-plus">+ {toConfirm} {toConfirm === 1 ? T('item to confirm') : T('items to confirm')}</span> : null}
            </div>}
            {del === 'uae' && sub < FREE && sub > 0 ? <div className="cart-free"><small>{T('Add')} {aed(FREE - sub, false)} {T('more for free UAE delivery')}</small><i><em style={{ width: Math.min(100, (sub / FREE) * 100) + '%' }} /></i></div> : null}
            <span className="sp-sample" style={{ color: '#9DA1A6' }}>{T('Sample prices · TRN shown on the invoice')}</span>
          </div>
          <ul className="cart-trust" data-rise>
            <li><b>{T('Tested before it ships')}</b><span>{T('Every part, on our bench')}</span></li>
            <li><b>{T('Warranty on every grade')}</b><span>{T('Up to 6 months')}</span></li>
            <li><b>{T('Since 2003')}</b><span>{T('Al Murar, Deira, Dubai')}</span></li>
          </ul>
        </aside>
      </div></section>

      {saved.length || favs.length ? (
        <section className="sp-sec w"><div className="sp-wrap">
          {saved.length ? <><div className="sp-head"><div><span className="sp-eb">{T('Saved for later')}</span><h2 className="sp-h2">{fmt(saved.length)} {T('parts waiting')}</h2></div></div>
            <div className="pv-row">{saved.map((p) => <div key={p.id} className="cart-saved"><img src={p.img} alt="" /><b>{p.title}</b><small>{p.gradeName} · {priceText(p.price)}</small><button type="button" className="sp-btn sm" onClick={() => store.add(p.id)}>{T('Move to cart')}</button></div>)}</div></> : null}
          {favs.length ? <><div className="sp-head" style={{ marginTop: 40 }}><div><span className="sp-eb">{T('Your stars')}</span><h2 className="sp-h2">{T('Parts you starred')}</h2></div></div>
            <div className="pv-row">{favs.map((p) => <div key={p.id} className="cart-saved"><img src={p.img} alt="" /><b>{p.title}</b><small>{p.gradeName} · {priceText(p.price)}</small><button type="button" className="sp-btn sm" onClick={() => store.add(p.id)}>{T('Add to cart')}</button></div>)}</div></> : null}
        </div></section>
      ) : null}
      {pv ? (
        <div className="ck-veil" onClick={(e) => { if (e.target === e.currentTarget) setPv(false); }}>
          {/* the preview, laid out like the invoice the team will issue (owner, 19 Nov: "the preview before anything is sent") */}
          <div className="ck-inv" role="dialog" aria-modal="true" aria-label={T('Preview your order')}>
            <div className="ck-inv-h"><img src="/assets/se-logo-metal-128.webp" alt="" /><span><b>SAM ELECTRONICS</b><small>{T('Al Murar, Deira, Dubai, UAE')}</small></span><span className="ck-inv-no"><small>{T('ORDER REQUEST')}</small><b>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</b></span></div>
            <div className="ck-inv-to"><span><small>{T('For')}</small><b>{form.name || '—'}</b><em dir="ltr">{form.phone}{form.email ? ' · ' + form.email : ''}</em></span><span><small>{T('Delivery')}</small><b>{T(({ pickup: 'Pick up in Deira', uae: 'Delivery in the UAE', world: 'Worldwide' } as const)[del])}</b>{del !== 'pickup' ? <em>{form.address}</em> : null}</span><span><small>{T('Sent by')}</small><b>{viaName(via)}</b></span></div>
            <table className="ck-inv-t"><thead><tr><th>#</th><th>{T('Part')}</th><th>{T('Qty')}</th><th>{T('Unit')}</th><th>{T('Total')}</th></tr></thead>
              <tbody>{lines.map(({ l, p }, n) => <tr key={p.id}><td>{n + 1}</td><td><b>{ptitle(p)}</b><small>{p.gradeName} · {p.makerName}{p.colour ? ' · ' + p.colour : ''}</small></td><td>{l.qty}</td><td>{fixed(p) ? aed(unit(p), false) : T('To confirm')}</td><td>{fixed(p) ? aed(unit(p) * l.qty, false) : '—'}</td></tr>)}</tbody></table>
            <div className="ck-inv-sum"><span>{T('Subtotal')}<b>{aed(sub, false)}</b></span>{disc > 0 ? <span>{T('Coupon')} {cp!.code}<b>−{aed(disc, false)}</b></span> : null}<span>{T('Delivery')}<b>{del === 'world' ? T('Quoted') : ship ? aed(ship, false) : T('Free')}</b></span><span>{T('VAT 5%')}<b>{aed(vat, false)}</b></span><span className="tot">{T('Total')}<b>{aed(total, false)}</b></span>{toConfirm ? <em>+ {toConfirm} {toConfirm === 1 ? T('item to confirm') : T('items to confirm')}</em> : null}</div>
            {form.note ? <p className="ck-inv-note"><small>{T('Note')}</small>{form.note}</p> : null}
            <p className="ck-inv-f">{T('Nothing is charged now. Our team confirms stock and the final price with you first.')}</p>
            <div className="ck-inv-acts"><button type="button" className="sp-btn ghost" onClick={() => setPv(false)}>← {T('Edit')}</button><button type="button" className={'sp-btn ck-send v-' + via} disabled={busy} onClick={place}>{busy ? T('Sending…') : T('Send by') + ' ' + viaName(via)}</button></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
