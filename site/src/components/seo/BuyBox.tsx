'use client';
// R9 · the live part of the SEO part page: price in the visitor's currency, add to cart, ask on WhatsApp, open in the shop.
import React, { useEffect, useState } from 'react';
import { aed, waCard } from '@/lib/catalog';
import { openContact } from '@/components/site/WeChatSheet';
import { store } from '@/lib/store';
import { T } from '@/components/site/ui';

export default function BuyBox({ id, price, stock, title, wa }: { id: string; price: number; stock: number; title: string; wa: string }) {
  const [, f] = useState(0), [added, setAdded] = useState(false);
  useEffect(() => { const r = () => f((n) => n + 1); window.addEventListener('se:prefs', r); window.addEventListener('se:lang', r); return () => { window.removeEventListener('se:prefs', r); window.removeEventListener('se:lang', r); }; }, []);
  return (
    <div className="sx-buy">
      <b className="sx-price">{price > 0 ? aed(price) : T('Ask for price on WhatsApp')}</b>
      <span className={'sx-stock' + (stock > 0 ? ' in' : '')}><i />{stock > 0 ? (stock < 5 ? T('Only a few left') : T('In stock')) + ' · ' + T('estimate') : T('Out of stock')}</span>
      <div className="sx-acts">
        <button type="button" className="sp-btn" data-sound="add" onClick={() => { store.add(id); window.dispatchEvent(new CustomEvent('se:cart')); setAdded(true); }}>{added ? '✓ ' + T('Added to cart') : stock <= 0 || price <= 0 ? T('Request it') : T('Add to cart')}</button>
        <button type="button" className="sp-btn wa" onClick={() => openContact('wa', waCard('Is this available?', [['Part', title], ['Ref', id], ['Link', location.href]]))}><i className="ct-ic wa" aria-hidden="true" />WhatsApp</button>
        <button type="button" className="sp-btn wc" onClick={() => openContact('wc', waCard('Is this available?', [['Part', title], ['Ref', id], ['Link', location.href]]))}><i className="ct-ic wc" aria-hidden="true" />WeChat</button>
      </div>
      <a className="sx-open" href={'/shop?p=' + encodeURIComponent(id)}>{T('Open in the shop')} →</a>
    </div>
  );
}
