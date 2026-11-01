'use client';
// R9 · one product's price as the owner chose to show it: exact, a range, "from", ask on WhatsApp, call, or trade only;
// with an optional note. Used by the product card and the product view.
import React from 'react';
import { aed, type Product } from '@/lib/catalog';
import { T } from '@/components/site/ui';

const WA = () => ((typeof window !== 'undefined' && (window as unknown as { SE_DATA?: { contact?: { wa?: string } } }).SE_DATA?.contact?.wa) || '971503420015').replace(/\D/g, '');
const TEL = () => ((typeof window !== 'undefined' && (window as unknown as { SE_DATA?: { contact?: { phone?: string } } }).SE_DATA?.contact?.phone) || '+97142222000').replace(/[^\d+]/g, '');

export default function PriceTag({ p, trade, big }: { p: Product; trade: boolean; big?: boolean }) {
  const m = p.price_mode || 'exact', note = p.price_note ? <small className="pt-note">{T(p.price_note)}</small> : null, S = <span className="sp-sample">· sample</span>;
  const ask = (txt: string) => encodeURIComponent('Hi Sam Electronics, what is the price of ' + p.title + ' (' + p.gradeName + ', ' + p.id + ')?' + txt);
  let body: React.ReactNode;
  if (m === 'whatsapp') body = <a className="pt-ask wa" href={'https://wa.me/' + WA() + '?text=' + ask('')} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.2.1.4.2.5.3 0 .1 0 .7-.2 1.3z" /></svg>{T('Ask for price on WhatsApp')}</a>;
  else if (m === 'call') body = <a className="pt-ask" href={'tel:' + TEL()} onClick={(e) => e.stopPropagation()}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>{T('Call for price')}</a>;
  else if (m === 'trade' && !trade) body = <span className="pt-trade"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>{T('Trade accounts only')} <a href="/wholesale#apply" onClick={(e) => e.stopPropagation()}>{T('Apply')}</a></span>;
  else if (m === 'trade') body = <><b>{aed(p.wholesale_price, false)}</b><span className="pt-tag">{T('Trade')}</span>{S}</>;
  else if (m === 'range') body = <><b>{aed(p.price, false)} – {aed(p.price_max || Math.round(p.price * 1.3), false).replace(/^AED /, '')}</b>{S}</>;
  else if (m === 'from') body = <><span className="pt-from">{T('From')}</span><b>{aed(p.price, false)}</b>{S}</>;
  else body = <><b>{aed(p.price, false)}</b>{p.deal ? <s>{aed(p.retail_price, false)}</s> : null}{S}</>;
  return <span className={'pt pt-' + m + (big ? ' big' : '')}>{body}{note}</span>;
}
