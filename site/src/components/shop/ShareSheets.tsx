'use client';
// Owner (18 Nov, round 2): "the list pop-up isn't professional; Share should be a clear, clean pop-up like the other
// messages, with the WhatsApp/WeChat idea: a preview of the system message first, your own message, and the link in
// case you want to copy it". Two clean sheets in the Samsoom-card family: Share and Save to a list.
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { type Product, aed, ptitle, byId } from '@/lib/catalog';
import { store } from '@/lib/store';
import { toast } from '@/components/site/Toaster';
import { T } from '@/components/site/ui';
import { GradeTag } from './Tags';

function Sheet({ title, sub, onClose, children }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }; window.addEventListener('keydown', k, true); return () => window.removeEventListener('keydown', k, true); }, [onClose]);
  // rendered on the page itself (the product view scrolls and animates, which would trap a fixed layer inside it)
  return createPortal(
    <div className="shs-veil" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="shs">
        <div className="shs-h"><span><b>{title}</b>{sub ? <small>{sub}</small> : null}</span>
          <button type="button" className="shs-x" aria-label={T('Close')} onClick={onClose}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

const Ic = ({ d }: { d: string }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

export function ShareSheet({ p, link, onClose }: { p: Product; link: string; onClose: () => void }) {
  const sys = p.title + '\n' + p.gradeName + ' · ' + aed(p.price, false) + '\n' + link;
  const [own, setOwn] = useState(''), [copied, setCopied] = useState(false);
  const text = (own.trim() ? own.trim() + '\n\n' : '') + sys;
  const copy = async (s: string, msg: string) => { try { await navigator.clipboard.writeText(s); } catch { /* */ } toast(msg); };
  return (
    <Sheet title={T('Share this part')} onClose={onClose}>
      <div className="shs-card"><img src={p.img} alt="" /><span><GradeTag g={p.grade} name={p.gradeName} /><b>{ptitle(p)}</b><small>{aed(p.price, false)}</small></span></div>
      <label className="shs-l">{T('The message')}</label>
      <div className="shs-msg">
        {own.trim() ? <p className="own">{own.trim()}</p> : null}
        <p className="sys">{p.title}<br />{p.gradeName} · {aed(p.price, false)}<br /><span dir="ltr">{link}</span></p>
      </div>
      <label className="shs-l" htmlFor="shs-own">{T('Add your own message (optional)')}</label>
      <textarea id="shs-own" className="shs-in" rows={2} maxLength={300} value={own} onChange={(e) => setOwn(e.target.value)} placeholder={T('e.g. This is the screen we need for the shop')} />
      <label className="shs-l">{T('Link')}</label>
      <div className="shs-link"><input readOnly dir="ltr" value={link} onFocus={(e) => e.currentTarget.select()} /><button type="button" className={copied ? 'ok' : ''} onClick={async () => { await copy(link, T('Link copied')); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }}>{copied ? '✓ ' + T('Copied') : T('Copy')}</button></div>
      <div className="shs-acts">
        <a className="shs-b wa" href={'https://wa.me/?text=' + encodeURIComponent(text)} target="_blank" rel="noopener noreferrer" onClick={onClose}><i className="ct-ic wa" />WhatsApp</a>
        <button type="button" className="shs-b wc" onClick={async () => { await copy(text, T('Copied for WeChat')); onClose(); }}><i className="ct-ic wc" />WeChat</button>
      </div>
      <div className="shs-more">
        <a href={'mailto:?subject=' + encodeURIComponent(p.title) + '&body=' + encodeURIComponent(text)} onClick={onClose}><Ic d="M4 6h16v12H4zM4 7l8 6 8-6" />{T('E-mail')}</a>
        {typeof navigator !== 'undefined' && 'share' in navigator ? <button type="button" onClick={async () => { try { await navigator.share({ title: p.title, text: own.trim() || p.title, url: link }); } catch { /* cancelled */ } onClose(); }}><Ic d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5" />{T('More…')}</button> : null}
      </div>
    </Sheet>
  );
}

export function ListSheet({ p, kits, onClose }: { p: Product; kits: { name: string; ids: string[] }[]; onClose: () => void }) {
  const [nm, setNm] = useState(''), [sh, setSh] = useState<string | null>(null);
  const shk = sh ? kits.find((k) => k.name === sh) : null;
  if (shk) return <ListShareSheet name={shk.name} ids={shk.ids} onClose={() => setSh(null)} />;
  const flip = (name: string) => { const had = kits.find((k) => k.name === name)?.ids.includes(p.id); store.toList(name, p.id); toast((had ? T('Removed from') : T('Added to')) + ' ' + name, had ? 'off' : 'ok'); };
  return (
    <Sheet title={T('Save to a list')} sub={ptitle(p)} onClose={onClose}>
      {kits.length ? (
        <div className="shs-lists">
          {kits.map((k) => { const on = k.ids.includes(p.id); return (
            <button type="button" key={k.name} className={'shs-row' + (on ? ' on' : '')} aria-pressed={on} onClick={() => flip(k.name)}>
              <i aria-hidden="true">{on ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : null}</i>
              <span><b>{k.name}</b><small>{k.ids.length} {T(k.ids.length === 1 ? 'part' : 'parts')}</small></span>
              {k.ids.length ? <span role="button" tabIndex={0} className="shs-rsh" aria-label={T('Share this list')} title={T('Share this list')} onClick={(e) => { e.stopPropagation(); setSh(k.name); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setSh(k.name); } }}><Ic d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5" /></span> : null}
            </button>
          ); })}
        </div>
      ) : <p className="shs-none">{T('No lists yet. Make one for each job or order, e.g. “Shop order June”.')}</p>}
      <form className="shs-new" onSubmit={(e) => { e.preventDefault(); const n = nm.trim(); if (!n) return; store.toList(n, p.id); toast(T('Added to') + ' ' + n); setNm(''); }}>
        <input className="shs-in" value={nm} onChange={(e) => setNm(e.target.value)} placeholder={T('New list name')} maxLength={40} />
        <button type="submit" className="shs-b y" disabled={!nm.trim()}>{T('Create')}</button>
      </form>
      <a className="shs-all" href="/account#saved">{T('See my lists')} →</a>
    </Sheet>
  );
}

// owner (18 Nov): "share a whole list": the same sheet for a list, so a shop can send a full order on WhatsApp in one tap
export function ListShareSheet({ name, ids, onClose }: { name: string; ids: string[]; onClose: () => void }) {
  const ps = ids.map(byId).filter(Boolean) as Product[];
  const total = ps.reduce((a, p) => a + p.price, 0);
  // owner (19 Nov): "the system message should show full details": every part with model, part, grade, maker, colour,
  // price, reference and link, numbered like an order, then the total and the date
  const host = typeof location !== 'undefined' ? location.origin : '';
  const lines = ps.map((p, i) => `*${i + 1}. ${ptitle(p)}*\n   ${T('Model')}: ${p.modelName || '—'} · ${T('Part')}: ${p.catName}\n   ${T('Grade')}: ${p.gradeName} · ${T('Maker')}: ${p.makerName}${p.colour ? ' · ' + T('Color') + ': ' + p.colour : ''}\n   ${T('Price')}: ${aed(p.price, false)} · ${T('Ref')}: ${p.id}\n   ${host}/shop?p=${p.id}`);
  const [own, setOwn] = useState('');
  const text = (own.trim() ? own.trim() + '\n\n' : '') + '*' + T('PARTS LIST') + ': ' + name + '*\n━━━━━━━━━━━━\n' + lines.join('\n\n') + '\n\n*' + T('Total') + ': ' + aed(total, false) + '* (' + ps.length + ' ' + T(ps.length === 1 ? 'part' : 'parts') + ')\n_' + new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dubai' }) + ' · Sam Electronics_';
  return (
    <Sheet title={T('Share this list')} sub={name + ' · ' + ps.length + ' ' + T(ps.length === 1 ? 'part' : 'parts')} onClose={onClose}>
      <label className="shs-l">{T('The message')}</label>
      <div className="shs-msg">
        {own.trim() ? <p className="own">{own.trim()}</p> : null}
        <div className="sys shs-full"><b className="h">{T('PARTS LIST')} · {name}</b>{ps.map((p, i) => <span key={p.id} className="it"><img src={p.img} alt="" /><span><b>{i + 1}. {ptitle(p)}</b><small>{p.modelName} · {p.catName} · {p.gradeName} · {p.makerName}{p.colour ? ' · ' + p.colour : ''}</small><small dir="ltr">{aed(p.price, false)} · {T('Ref')} {p.id}</small></span></span>)}<b className="t">{T('Total')}: {aed(total, false)} · {ps.length} {T(ps.length === 1 ? 'part' : 'parts')}</b></div>
      </div>
      <label className="shs-l" htmlFor="shs-own2">{T('Add your own message (optional)')}</label>
      <textarea id="shs-own2" className="shs-in" rows={2} maxLength={300} value={own} onChange={(e) => setOwn(e.target.value)} placeholder={T('e.g. Please confirm stock and price')} />
      <div className="shs-acts">
        <a className="shs-b wa" href={'https://wa.me/?text=' + encodeURIComponent(text)} target="_blank" rel="noopener noreferrer" onClick={onClose}><i className="ct-ic wa" />WhatsApp</a>
        <button type="button" className="shs-b wc" onClick={async () => { try { await navigator.clipboard.writeText(text); } catch { /* */ } toast(T('Copied for WeChat')); onClose(); }}><i className="ct-ic wc" />WeChat</button>
        <a className="shs-b ml" href={'mailto:?subject=' + encodeURIComponent(T('Parts list') + ': ' + name) + '&body=' + encodeURIComponent(text.replace(/[*_]/g, ''))}><Ic d="M3 6h18v12H3zM3 7l9 6 9-6" />{T('E-mail')}</a>
        <button type="button" className="shs-b wb" onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('se:livechat', { detail: { text } })); }}><Ic d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />{T('Website chat')}</button>
      </div>
      <div className="shs-more">
        <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); } catch { /* */ } toast(T('Copied')); }}><Ic d="M9 9h10v12H9zM5 15V3h10" />{T('Copy')}</button>
        <button type="button" onClick={() => { ps.forEach((p) => store.add(p.id)); toast(T('Added to cart') + ' · ' + ps.length); onClose(); }}><Ic d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />{T('Add all to cart')}</button>
      </div>
    </Sheet>
  );
}
