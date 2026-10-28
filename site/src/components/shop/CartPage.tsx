'use client';
// P2 · The cart and checkout. Lines with quantity, save for later, 5% UAE VAT, delivery (pick-up · UAE · worldwide), the
// customer's details (filled from the account, or a company profile), then the order is placed (backend.placeOrder —
// on Supabase the server recomputes prices and VAT) and confirmed on WhatsApp. Saved-for-later and stars sit underneath.
import React, { useEffect, useState } from 'react';
import { type Product, aed, byId, data, VAT, waLink, fmt, siteSetting } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { backend, useMe, type Company, type Order } from '@/lib/backend';
import { T, PageHero, useRise } from '@/components/site/ui';
import LiveSam from '@/components/samsoom/LiveSam';

const DL = () => siteSetting('delivery', { uae: 25, freeOver: 500, pickupReady: '20 minutes' }); // set in the Control Room → Settings

export default function CartPage() {
  const st = useStore(), [me] = useMe(), [ready, setReady] = useState(false), [cos, setCos] = useState<Company[]>([]);
  const [del, setDel] = useState<'pickup' | 'uae' | 'world'>('pickup'), [pay, setPay] = useState<Order['pay']>('whatsapp');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', country: 'United Arab Emirates', note: '', company: '' });
  const [busy, setBusy] = useState(false), [err, setErr] = useState(''), [done, setDone] = useState<Order | null>(null), [code, setCode] = useState(''), [codeMsg, setCodeMsg] = useState('');
  useEffect(() => { const iv = window.setInterval(() => { if (data()) { window.clearInterval(iv); setReady(true); } }, 60); return () => window.clearInterval(iv); }, []);
  useEffect(() => { if (me) { setForm((f) => ({ ...f, name: f.name || me.name, email: f.email || me.email, phone: f.phone || me.phone || '' })); backend.companies().then(setCos); } }, [me]);
  useRise(ready);
  if (!ready) return <div className="shop-wait"><span /><span /><span /></div>;

  const trade = !!me?.tradeApproved, dl = DL(), SHIP = { pickup: 0, uae: dl.uae, world: 0 }, FREE = dl.freeOver;
  const lines = st.cart.map((l) => ({ l, p: byId(l.id) })).filter((x) => x.p) as { l: { id: string; qty: number }; p: Product }[];
  const unit = (p: Product) => (trade ? p.wholesale_price : p.price);
  const sub = lines.reduce((a, { l, p }) => a + unit(p) * l.qty, 0), save = lines.reduce((a, { l, p }) => a + (p.retail_price - unit(p)) * l.qty, 0);
  const ship = del === 'uae' ? (sub >= FREE ? 0 : SHIP.uae) : 0, vat = Math.round((sub + ship) * VAT * 100) / 100, total = sub + ship + vat;
  const saved = st.saved.map(byId).filter(Boolean) as Product[], favs = st.favs.map(byId).filter(Boolean) as Product[];
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });
  const place = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (!lines.length) return;
    if (del !== 'pickup' && !form.address.trim()) return setErr(T('Please add the delivery address.'));
    setBusy(true);
    const r = await backend.placeOrder({ email: form.email, name: form.name, phone: form.phone, lines: lines.map(({ l, p }) => ({ id: p.id, title: p.title, grade: p.gradeName, qty: l.qty, unit: unit(p) })), sub, vat, ship, total, delivery: del, address: form.address, country: form.country, note: form.note, pay, company: form.company || undefined });
    setBusy(false);
    if (!r.ok) return setErr(T(r.error));
    setDone(r.data); store.clear(); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const waMsg = (o: Order) => `Hi Sam Electronics, I placed order ${o.no} on the website.\n\n${o.lines.map((x) => `${x.qty} × ${x.title} · ${x.grade}`).join('\n')}\n\nTotal ${aed(o.total, false)} incl. VAT\nDelivery: ${o.delivery}\nPlease confirm stock and price.`;

  if (done) return (
    <>
      <PageHero eb={T('ORDER RECEIVED')} title={T('Thank you,') + ' ' + (done.name.split(' ')[0] || '') + '!'} accent={done.no} sub={T('We received your order. Our team confirms stock, delivery and the final price on WhatsApp, usually within minutes during opening hours.')} right={<LiveSam size={180} mood="idle" play="celebrate" />}>
        <div className="sp-acts"><a className="sp-btn wa" href={waLink(waMsg(done))} target="_blank" rel="noopener noreferrer">{T('Confirm on WhatsApp')}</a><a className="sp-btn ghost" href="/shop">{T('Keep shopping')}</a>{me ? <a className="sp-btn ghost" href="/account#orders">{T('My orders')}</a> : null}</div>
      </PageHero>
      <section className="sp-sec w"><div className="sp-wrap cart-done">
        <div className="sp-card"><h3 className="sp-h3">{T('Your order')}</h3>
          <table className="sp-table"><tbody>{done.lines.map((x) => <tr key={x.id}><td>{x.qty} ×</td><td>{x.title} · {x.grade}</td><td style={{ textAlign: 'end' }}>{aed(x.unit * x.qty, false)}</td></tr>)}</tbody></table>
          <div className="cart-sum"><span>{T('Subtotal')}<b>{aed(done.sub, false)}</b></span><span>{T('Delivery')}<b>{done.ship ? aed(done.ship, false) : T('Free')}</b></span><span>{T('VAT 5%')}<b>{aed(done.vat, false)}</b></span><span className="tot">{T('Total')}<b>{aed(done.total, false)}</b></span></div>
          <span className="sp-sample">{T('Sample prices · a copy is e-mailed to')} {done.email}</span>
        </div>
        <ol className="cart-steps">{['Order received', 'Stock & price confirmed on WhatsApp', 'Paid & packed', done.delivery === 'pickup' ? 'Ready to collect in Deira' : 'Shipped to you'].map((s, i) => <li key={s} className={i === 0 ? 'on' : ''}><i>{i + 1}</i>{T(s)}</li>)}</ol>
      </div></section>
    </>
  );

  return (
    <>
      <PageHero eb={T('YOUR CART')} title={T('Ready when')} accent={T('you are.')} crumb={[[T('Shop'), '/shop'], [T('Cart')]]} sub={lines.length ? `${lines.reduce((a, x) => a + x.l.qty, 0)} ${T('items')} · ${aed(total, false)} ${T('incl. 5% VAT')} · ${T('sample prices')}` : T('Your cart is empty. Every part you add, here or on the home page, waits here.')} seed={31} right={<LiveSam size={150} mood="idle" play={lines.length ? 'happy' : 'think'} />} />
      <section className="sp-sec g"><div className="sp-wrap cart">
        <div className="cart-l">
          {lines.length ? (
            <div className="sp-card cart-lines" data-rise>
              <div className="cart-h"><h3 className="sp-h3">{T('Cart')} · {lines.length}</h3><button type="button" className="shop-clear" onClick={() => store.clear()}>{T('Empty the cart')}</button></div>
              {lines.map(({ l, p }) => (
                <div key={p.id} className="cart-ln">
                  <a href={'/shop?p=' + p.id} className="cart-img"><img src={p.img} alt="" /></a>
                  <div className="cart-info">
                    <a href={'/shop?p=' + p.id}><b>{p.title}</b></a>
                    <span className="pc-meta"><span className={'pc-gr g-' + p.grade}>{p.gradeName}</span><span>{p.makerName}</span><span>{p.warranty} {T('warranty')}</span></span>
                    <span className="cart-acts"><button type="button" onClick={() => store.later(p.id)}>{T('Save for later')}</button><button type="button" onClick={() => store.fav(p.id)}>{st.favs.includes(p.id) ? '★ ' + T('Starred') : '☆ ' + T('Star it')}</button><button type="button" onClick={() => store.remove(p.id)}>{T('Remove')}</button></span>
                  </div>
                  <span className="pv-qty sm"><button type="button" onClick={() => store.qty(p.id, l.qty - 1)}>−</button><input value={l.qty} onChange={(e) => store.qty(p.id, Math.max(1, +e.target.value || 1))} aria-label={T('Quantity')} /><button type="button" onClick={() => store.qty(p.id, l.qty + 1)}>+</button></span>
                  <span className="cart-pr"><b>{aed(unit(p) * l.qty, false)}</b><small>{aed(unit(p), false)} {T('each')}{trade ? ' · ' + T('trade') : ''}</small></span>
                </div>
              ))}
              <span className="sp-sample">{T('All prices are samples until the owner’s prices are in.')}</span>
            </div>
          ) : (
            <div className="sp-card sp-empty" data-rise><LiveSam size={110} mood="think" /><b className="sp-h3">{T('Nothing here yet')}</b><span>{T('Find your part in seconds and it will wait here.')}</span><span className="sp-acts" style={{ justifyContent: 'center' }}><a className="sp-btn" href="/shop">{T('Go to the shop')}</a><button type="button" className="sp-btn ghost" onClick={() => window.dispatchEvent(new CustomEvent('se:fmp', { detail: {} }))}>Find My Part</button></span></div>
          )}

          {lines.length ? (
            <form className="sp-card cart-form" onSubmit={place} data-rise>
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
                <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('Note for the team (optional)')}<textarea value={form.note} onChange={set('note')} placeholder={T('Model number, colour, anything we should know')} /></label>
              </div>
              <h3 className="sp-h3">{T('Payment')}</h3>
              <div className="cart-del">
                {([['whatsapp', 'Confirm first, pay after', 'We confirm on WhatsApp, then send a payment link'], ['cash', 'Cash or card in the shop', 'When you collect'], ['transfer', 'Bank transfer', 'For trade and export orders'], ['card', 'Card online', 'Coming soon']] as const).map(([k, t, d]) => (
                  <label key={k} className={'cart-opt' + (pay === k ? ' on' : '') + (k === 'card' ? ' off' : '')}><input type="radio" name="pay" disabled={k === 'card'} checked={pay === k} onChange={() => setPay(k)} /><i /><span><b>{T(t)}</b><small>{T(d)}</small></span></label>
                ))}
              </div>
              {err ? <div className="sp-note" style={{ background: 'rgba(229,72,77,.1)', color: '#9B1C20' }}>{err}</div> : null}
              <button type="submit" className="sp-btn cart-place" disabled={busy}>{busy ? T('Placing your order…') : T('Place order') + ' · ' + aed(total, false)}</button>
              <small className="sp-muted">{T('By placing the order you agree to our')} <a href="/legal#terms">{T('terms')}</a>, <a href="/legal#returns">{T('returns')}</a> {T('and')} <a href="/legal#privacy">{T('privacy policy')}</a>.</small>
            </form>
          ) : null}
        </div>

        <aside className="cart-r">
          <div className="sp-card d cart-total" data-rise>
            <span className="sp-eb" style={{ color: '#F7C032' }}>{T('SUMMARY')}</span>
            <div className="cart-sum">
              <span>{T('Subtotal')}<b>{aed(sub, false)}</b></span>
              {save > 0 ? <span className="sv">{trade ? T('Trade savings') : T('You save')}<b>−{aed(save, false)}</b></span> : null}
              <span>{T('Delivery')}<b>{del === 'world' ? T('Quoted') : ship ? aed(ship, false) : T('Free')}</b></span>
              <span>{T('VAT 5%')}<b>{aed(vat, false)}</b></span>
              <span className="tot">{T('Total')}<b>{aed(total, false)}</b></span>
            </div>
            {del === 'uae' && sub < FREE && sub > 0 ? <div className="cart-free"><small>{T('Add')} {aed(FREE - sub, false)} {T('more for free UAE delivery')}</small><i><em style={{ width: Math.min(100, (sub / FREE) * 100) + '%' }} /></i></div> : null}
            <span className="sp-sample" style={{ color: '#9DA1A6' }}>{T('Sample prices · TRN shown on the invoice')}</span>
            {lines.length ? <a className="sp-btn wa" href={waLink('Hi Sam Electronics, I would like to order:\n' + lines.map(({ l, p }) => `${l.qty} × ${p.title} · ${p.gradeName} (${p.id})`).join('\n') + '\nPlease confirm stock and price.')} target="_blank" rel="noopener noreferrer">{T('Or send it on WhatsApp')}</a> : null}
          </div>
          <div className="sp-card cart-promo" data-rise>
            <b>{T('Promo or member code')}</b>
            <span className="cart-code"><input className="sp-in" value={code} onChange={(e) => setCode(e.target.value)} placeholder="SAMCIRCUIT" /><button type="button" className="sp-btn sm dark" onClick={() => setCodeMsg(code.trim() ? T('Codes open with the Control Room. We will apply it when we confirm.') : '')}>{T('Apply')}</button></span>
            {codeMsg ? <small className="sp-muted">{codeMsg}</small> : null}
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
            <div className="pv-row">{saved.map((p) => <div key={p.id} className="cart-saved"><img src={p.img} alt="" /><b>{p.title}</b><small>{p.gradeName} · {aed(p.price)}</small><button type="button" className="sp-btn sm" onClick={() => store.add(p.id)}>{T('Move to cart')}</button></div>)}</div></> : null}
          {favs.length ? <><div className="sp-head" style={{ marginTop: 40 }}><div><span className="sp-eb">{T('Your stars')}</span><h2 className="sp-h2">{T('Parts you starred')}</h2></div></div>
            <div className="pv-row">{favs.map((p) => <div key={p.id} className="cart-saved"><img src={p.img} alt="" /><b>{p.title}</b><small>{p.gradeName} · {aed(p.price)}</small><button type="button" className="sp-btn sm" onClick={() => store.add(p.id)}>{T('Add to cart')}</button></div>)}</div></> : null}
        </div></section>
      ) : null}
    </>
  );
}
