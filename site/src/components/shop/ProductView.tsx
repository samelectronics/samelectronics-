'use client';
// P2 · A product, opened inside the shop (owner: "the product page belongs in the shop"): a full sheet over the results,
// with its own link (?p=ID) so it can be shared. Gallery with zoom, every grade of the same part, price ("· sample") and the
// trade price (locked until approved), quantity, add to cart / buy on WhatsApp, star, compare, stock alert, share,
// "fits my devices", estimated stock (confirm on WhatsApp), delivery estimate, then the tabs (description, specifications,
// manufacturer, warranty & quality, reviews by account holders), the repair kit for this model, similar parts and recently viewed.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type Product, aed, alsoFor, byId, data, grades, similar, waLink, fmt, VAT } from '@/lib/catalog';
import { store, useStore } from '@/lib/store';
import { backend, type Review, type User } from '@/lib/backend';
import { useScrollLock } from '@/lib/scrollLock';
import { Stars, T, flyToCart } from '@/components/site/ui';
import ProductCard, { stockLabel } from './ProductCard';

const GRADE_INFO: Record<string, [string, string]> = {
  OR: ['Original · Service Pack', 'The part the brand itself fits, in its service box. Same colours, brightness, touch and battery life as new. Our longest warranty.'],
  OL: ['OLED Soft', 'A flexible OLED panel made to the original spec: deep blacks and true colours, close to original at a lower price.'],
  IN: ['Incell', 'An LCD with the touch layer built in. Bright and reliable for everyday use, at a budget price.'],
  AQ: ['AAA', 'A good, tested aftermarket part for the best price. Ideal when cost matters most.'],
};
const TABS = ['Description', 'Specifications', 'Manufacturer', 'Warranty & quality', 'Reviews'] as const;

function Countdown({ to }: { to: number }) {
  const [n, setN] = useState(Date.now());
  useEffect(() => { const iv = window.setInterval(() => setN(Date.now()), 1000); return () => window.clearInterval(iv); }, []);
  const s = Math.max(0, Math.floor((to - n) / 1000)), p = (x: number) => String(x).padStart(2, '0');
  return <span className="pv-cd">{T('Ends in')} <b>{Math.floor(s / 86400)}{T('d')} {p(Math.floor((s % 86400) / 3600))}:{p(Math.floor((s % 3600) / 60))}:{p(s % 60)}</b></span>;
}

export default function ProductView({ id, me, onClose, onOpen }: { id: string | null; me: User | null | undefined; onClose: () => void; onOpen: (p: Product) => void }) {
  const p = id ? byId(id) : null, st = useStore(), trade = !!me?.tradeApproved;
  const [qty, setQty] = useState(1), [tab, setTab] = useState<(typeof TABS)[number]>('Description'), [zoom, setZoom] = useState<{ x: number; y: number } | null>(null), [shot, setShot] = useState(0);
  const [rv, setRv] = useState<Review[]>([]), [form, setForm] = useState({ stars: 5, title: '', text: '' }), [msg, setMsg] = useState(''), [kit, setKit] = useState<string[]>([]), [copied, setCopied] = useState(false);
  const img = useRef<HTMLImageElement>(null), sheet = useRef<HTMLDivElement>(null);
  useScrollLock(!!p);
  useEffect(() => { if (!p) return; store.view(p.id); setQty(1); setShot(0); setTab('Description'); setMsg(''); setKit([]); sheet.current?.scrollTo({ top: 0 }); backend.reviews(p.id).then(setRv); }, [p?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!p) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [p, onClose]);
  const D = data();
  const sib = useMemo(() => (p ? grades(p) : []), [p]), also = useMemo(() => (p ? alsoFor(p) : []), [p]), sim = useMemo(() => (p ? similar(p, 8) : []), [p]);
  if (!p || !D) return null;
  const model = D.models.find((m) => m.id === p.model_id), [sl, sk] = stockLabel(p.stock_qty), fits = st.devices.find((d) => d.model_id === p.model_id);
  // three views: in its box, the part on its own, and the other side
  const SOLO: Record<string, string> = { SCR: 'scr', BAT: 'bat', FLX: 'flx', BCV: 'bcv', FRM: 'frm', CAM: 'cam', SML: 'sml' };
  const shots = p.imgBig ? [p.imgBig, '/assets/pose/solo-' + (SOLO[p.category] || 'sml') + '-960.webp', p.imgBig.includes('-ar-') ? p.imgBig.replace('-ar-', '-') : p.imgBig.replace(/-960\.webp$/, '-ar-960.webp')] : [];
  const viewed = st.viewed.filter((x) => x !== p.id).map(byId).filter(Boolean).slice(0, 6) as Product[];
  const avg = rv.length ? rv.reduce((a, r) => a + r.stars, 0) / rv.length : p.rating, nRev = rv.length || p.reviews;
  const hist = [5, 4, 3, 2, 1].map((s) => (rv.length ? rv.filter((r) => r.stars === s).length / rv.length : [0.62, 0.24, 0.08, 0.04, 0.02][5 - s]));
  const link = typeof location !== 'undefined' ? location.origin + '/shop?p=' + encodeURIComponent(p.id) : '';
  const wa = waLink(`Hi Sam Electronics, I would like to order:\n${qty} × ${p.title} · ${p.gradeName} (${p.makerName})\nRef: ${p.id}\nPlease confirm stock and price.\n${link}`);
  const kitIds = [p.id, ...kit], kitSum = kitIds.reduce((a, k) => a + (byId(k)?.price || 0), 0);
  const share = async () => { try { if (navigator.share) await navigator.share({ title: p.title, url: link }); else { await navigator.clipboard.writeText(link); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } } catch { /* cancelled */ } };
  const submit = async (e: React.FormEvent) => { e.preventDefault(); const r = await backend.addReview({ product: p.id, ...form }); if (r.ok) { setRv([r.data, ...rv]); setForm({ stars: 5, title: '', text: '' }); setMsg(T('Thank you! Your review is live.')); } else setMsg(T(r.error)); };

  return (
    <div className="pv-veil" role="dialog" aria-modal="true" aria-label={p.title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pv" ref={sheet}>
        <div className="pv-bar">
          <nav className="sp-crumb dark"><a href="/shop" onClick={(e) => { e.preventDefault(); onClose(); }}>{T('Shop')}</a><i /><a href={'/brands#' + p.brand}>{p.brandName}</a><i /><span>{p.modelName}</span><i /><span>{p.catName}</span></nav>
          <button type="button" className="sp-x" style={{ position: 'static' }} onClick={onClose} aria-label={T('Close')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        </div>

        <div className="pv-top">
          <div className="pv-gal">
            <div className="pv-stage" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }} onPointerLeave={() => setZoom(null)}>
              <img ref={img} src={shots[shot] || p.img} alt={p.title} style={zoom ? { transform: 'scale(1.9)', transformOrigin: zoom.x + '% ' + zoom.y + '%' } : undefined} />
              <span className="pc-badges">{p.deal ? <span className="sp-tag r">−{p.deal}%</span> : null}{p.isNew ? <span className="sp-tag y">NEW</span> : null}{p.best ? <span className="sp-tag d">BEST SELLER</span> : null}</span>
              <span className="pv-zoomhint">{T('Hover to zoom')}</span>
            </div>
            <div className="pv-thumbs">{shots.map((s, i) => <button key={i} type="button" className={shot === i ? 'on' : ''} onClick={() => setShot(i)}><img src={s} alt="" /></button>)}<span className="pv-photo">{T('Real photos of this exact part arrive with the owner’s pictures.')}</span></div>
          </div>

          <div className="pv-info">
            <span className="pv-meta"><span className={'pc-gr g-' + p.grade}>{p.gradeName}</span><a href={'/brands#maker-' + p.manufacturer}>{p.makerName}</a><span className="sp-tag">{p.id}</span></span>
            <h2 className="pv-t">{p.title}</h2>
            <span className="pv-rate"><Stars v={avg} n={nRev} /><button type="button" onClick={() => setTab('Reviews')}>{T('Read reviews')}</button><span className="sp-sample">{rv.length ? '' : 'sample rating'}</span></span>
            {fits ? <span className="pv-fits ok">✓ {T('Fits your')} {fits.nick || fits.name}</span> : model ? <button type="button" className="pv-fits" onClick={() => store.device({ model_id: model.id, name: model.name })}>+ {T('Add')} {model.name} {T('to My devices')}</button> : null}

            <div className="pv-price">
              <span className="pv-now"><b>{aed(p.price, false)}</b>{p.deal ? <s>{aed(p.retail_price, false)}</s> : null}<span className="sp-sample">· sample</span></span>
              <small>{T('Includes 5% VAT at checkout:')} {aed(p.price * (1 + VAT), false)} · {T('price for everyone')}</small>
              {p.deal ? <Countdown to={p.dealEnds} /> : null}
              <div className={'pv-trade' + (trade ? ' on' : '')}>
                {trade ? <><span>{T('Your trade price')}</span><b>{aed(p.wholesale_price, false)}</b><span className="sp-sample">· sample</span></> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg><span>{T('Trade price unlocks when your trade account is approved.')}</span><a href={me ? '/wholesale#apply' : '/account?next=trade'}>{me ? T('Apply') : T('Sign in')}</a></>}
              </div>
            </div>

            {sib.length > 1 ? (
              <div className="pv-grades"><small>{T('Choose the grade')}</small>
                <div>{sib.map((g) => <button key={g.id} type="button" className={'pv-g g-' + g.grade + (g.id === p.id ? ' on' : '')} onClick={() => onOpen(g)}><b>{g.gradeName}</b><small>{g.makerName}</small><span>{aed(g.price, false)}</span></button>)}</div>
              </div>
            ) : null}

            <div className={'pv-stock s-' + sk}><i /><span><b>{T(sl)}</b><small>{T('Stock is an estimate: we confirm it on WhatsApp before you pay.')}</small></span></div>

            <div className="pv-buy">
              <span className="pv-qty"><button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="−">−</button><input value={qty} inputMode="numeric" onChange={(e) => setQty(Math.max(1, Math.min(999, +e.target.value || 1)))} aria-label={T('Quantity')} /><button type="button" onClick={() => setQty(qty + 1)} aria-label="+">+</button></span>
              <button type="button" className="sp-btn pv-add" disabled={p.stock_qty <= 0} onClick={(e) => { flyToCart(img.current, p.id, e); if (qty > 1) store.add(p.id, qty - 1); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></svg>{T('Add to cart')}
              </button>
              <a className="sp-btn wa" href={wa} target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" /></svg>{T('Order on WhatsApp')}</a>
            </div>
            <div className="pv-tools">
              <button type="button" className={st.favs.includes(p.id) ? 'on' : ''} onClick={() => store.fav(p.id)}>★ {st.favs.includes(p.id) ? T('Starred') : T('Star it')}</button>
              <button type="button" className={st.compare.includes(p.id) ? 'on' : ''} onClick={() => store.cmp(p.id)}>⇆ {T('Compare')}</button>
              <button type="button" onClick={() => { store.later(p.id); }}>⏱ {T('Save for later')}</button>
              <button type="button" className={st.alerts.includes(p.id) ? 'on' : ''} onClick={() => store.alert(p.id)}>🔔 {st.alerts.includes(p.id) ? T('Alert on') : T('Price & stock alert')}</button>
              <button type="button" onClick={share}>↗ {copied ? T('Link copied') : T('Share')}</button>
            </div>
            <ul className="pv-promise">
              <li><b>{T('Pick up today')}</b><span>{T('Al Murar, Deira · ready in 20 minutes')}</span></li>
              <li><b>{T('UAE delivery')}</b><span>{T('Next working day · free over AED 500 (sample)')}</span></li>
              <li><b>{T('Worldwide')}</b><span>{T('Door to door with our partners, or your own shipper')}</span></li>
              <li><b>{p.warranty} {T('warranty')}</b><span>{T('Tested before it ships')}</span></li>
            </ul>
          </div>
        </div>

        <div className="pv-tabs" role="tablist">{TABS.map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{T(t)}{t === 'Reviews' ? ' · ' + nRev : ''}</button>)}</div>
        <div className="pv-tab">
          {tab === 'Description' ? (
            <div className="pv-desc">
              <p>{T('The')} {p.part_name.toLowerCase()} {T('for the')} {p.brandName} {p.modelName}, {T('in')} {p.gradeName} {T('grade from')} {p.makerName}. {T(GRADE_INFO[p.grade]?.[1] || '')}</p>
              <p>{T('Every part is checked on our bench before it leaves the shop, and comes with a')} {p.warranty} {T('warranty')}. {T('Not sure it is the right one? Send us your model number on WhatsApp and we will check it for you.')}</p>
              <span className="sp-sample">{T('Descriptions are written per product once the owner’s details arrive.')}</span>
            </div>
          ) : tab === 'Specifications' ? (
            <table className="sp-table pv-spec"><tbody>
              {([['Brand', p.brandName], ['Model', p.modelName], ['Model numbers', (model as unknown as { model_numbers?: string[] })?.model_numbers?.join(', ') || '—'], ['Part', p.part_name], ['Category', p.catName], ['Grade', p.gradeName], ['Quality', p.qualityName], ['Manufacturer', p.makerName], ['Warranty', p.warranty], ['Colour', p.colour || '—'], ['Reference', p.id]] as [string, string][]).map(([k, v]) => <tr key={k}><th>{T(k)}</th><td>{v}</td></tr>)}
            </tbody></table>
          ) : tab === 'Manufacturer' ? (
            <div className="pv-maker">
              <span className="pv-mk">{p.makerName.slice(0, 2).toUpperCase()}</span>
              <div><h3 className="sp-h3">{p.makerName}</h3><p className="sp-p">{T('Who makes this part, where it comes from and how it compares: every manufacturer we stock has its own page.')}</p><a className="sp-btn sm dark" href={'/brands#maker-' + p.manufacturer}>{T('About')} {p.makerName}</a></div>
            </div>
          ) : tab === 'Warranty & quality' ? (
            <div className="pv-wq">
              {Object.entries(GRADE_INFO).map(([g, [t, d]]) => <div key={g} className={'pv-wqi g-' + g + (g === p.grade ? ' on' : '')}><b>{T(t)}</b><span>{T(d)}</span><small>{T(D.gradeNames[g] || g)} · {['6 months', '3 months', '1 month', '1 month'][['OR', 'OL', 'IN', 'AQ'].indexOf(g)]} {T('warranty')}</small></div>)}
              <p className="sp-p">{T('Warranty covers faults from the part itself. It does not cover physical or water damage, or parts fitted elsewhere that were damaged while fitting.')} <a href="/legal#warranty">{T('Full warranty terms')}</a></p>
            </div>
          ) : (
            <div className="pv-rev">
              <div className="pv-rsum"><b>{avg.toFixed(1)}</b><Stars v={avg} /><small>{nRev} {T('ratings')}{rv.length ? '' : ' · sample'}</small>
                {hist.map((h, i) => <span key={i} className="pv-hb"><small>{5 - i}★</small><i><em style={{ width: Math.round(h * 100) + '%' }} /></i><small>{Math.round(h * 100)}%</small></span>)}
              </div>
              <div className="pv-rlist">
                {me ? (
                  <form className="pv-rform" onSubmit={submit}>
                    <b>{T('Rate this part')}</b>
                    <span className="pv-rst">{[1, 2, 3, 4, 5].map((s) => <button key={s} type="button" className={s <= form.stars ? 'on' : ''} onClick={() => setForm({ ...form, stars: s })} aria-label={s + ' stars'}>★</button>)}</span>
                    <input className="sp-in" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={T('Title')} required />
                    <textarea className="sp-in" style={{ height: 90, padding: 12 }} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder={T('What was it like?')} required />
                    <button type="submit" className="sp-btn sm">{T('Post review')}</button>{msg ? <small>{msg}</small> : null}
                  </form>
                ) : <div className="sp-note">{T('Only account holders can rate parts, so every review is from a real customer.')} <a href="/account">{T('Sign in or create an account')}</a></div>}
                {rv.length ? rv.map((r) => <div key={r.id} className="pv-r"><span><Stars v={r.stars} /><b>{r.title}</b>{r.verified ? <span className="sp-tag ok">{T('Verified purchase')}</span> : null}</span><p>{r.text}</p><small>{r.name} · {new Date(r.at).toLocaleDateString()}</small></div>) : <div className="sp-empty"><b>{T('No reviews yet')}</b><span>{T('Be the first to rate this part.')}</span></div>}
              </div>
            </div>
          )}
        </div>

        {also.length ? (
          <section className="pv-kit">
            <div className="sp-head"><div><span className="sp-eb">{T('Repair kit builder')}</span><h3 className="sp-h2" style={{ fontSize: 28 }}>{T('Everything else for the')} {p.modelName}</h3></div>
              <div className="pv-kitsum"><span>{kitIds.length} {T('parts')} · <b>{aed(kitSum, false)}</b> <span className="sp-sample">· sample</span></span><button type="button" className="sp-btn sm" onClick={(e) => { kitIds.forEach((k, i) => (i === 0 ? flyToCart(img.current, k, e) : store.add(k))); store.kit(p.modelName + ' kit', kitIds); }}>{T('Add the kit to cart')}</button></div>
            </div>
            <div className="pv-kitrow">{also.filter((a, i, l) => l.findIndex((b) => b.category === a.category) === i).map((a) => (
              <label key={a.id} className={'pv-ki' + (kit.includes(a.id) ? ' on' : '')}><input type="checkbox" checked={kit.includes(a.id)} onChange={() => setKit(kit.includes(a.id) ? kit.filter((k) => k !== a.id) : [...kit, a.id])} /><img src={a.img} alt="" loading="lazy" /><span><b>{a.part_name}</b><small>{a.gradeName} · {aed(a.price, false)}</small></span></label>
            ))}</div>
          </section>
        ) : null}

        <section className="pv-more"><div className="sp-head"><div><span className="sp-eb">{T('Similar parts')}</span><h3 className="sp-h2" style={{ fontSize: 28 }}>{T('You may also need')}</h3></div></div>
          <div className="pv-row">{sim.map((s) => <ProductCard key={s.id} p={s} st={st} trade={trade} open={onOpen} />)}</div></section>
        {viewed.length ? <section className="pv-more"><div className="sp-head"><div><span className="sp-eb">{T('Recently viewed')}</span></div></div><div className="pv-row">{viewed.map((s) => <ProductCard key={s.id} p={s} st={st} trade={trade} open={onOpen} />)}</div></section> : null}
        <p className="pv-foot sp-sample">{fmt(p.stock_qty)} {T('units (estimate)')} · {T('all prices and ratings are samples until the owner’s data arrives')}</p>
      </div>
    </div>
  );
}
