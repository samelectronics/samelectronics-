'use client';
// R9 · Control Room → Ads, pop-ups & events. Everything here is live on the site as soon as it is saved:
//  · Shop ads: the strips between product rows (up to 3 per page, each rotating), edit / reorder / add / remove
//  · Pop-up: one offer that opens once per visitor, with a delay, pages and dates
//  · Seasonal event: a ribbon for Ramadan, Eid, National Day, Diwali, Christmas… with dates and your own message
import React from 'react';
import { Panel, Badge, useSetting } from './kit';
import { ADS_DEFAULT, type Ad } from '@/components/shop/InlineAd';
import { POPUP_DEFAULT, EVENT_DEFAULT, EVENTS, type Popup, type EventCfg } from '@/lib/promo';

const IMGS = ['/assets/pose/samsung-sp-480.webp', '/assets/pose/apple-sp-480.webp', '/assets/pose/part-bat-480.webp', '/assets/pose/part-cam-480.webp', '/assets/pose/line-all-480.webp', '/assets/pose/rep-fixed-480.webp'];
export default function PromoMod() {
  const [ads, setAds] = useSetting<Ad[]>('shop-ads', ADS_DEFAULT), [pop, setPop] = useSetting<Popup>('popup', POPUP_DEFAULT), [ev, setEv] = useSetting<EventCfg>('event', EVENT_DEFAULT);
  const upd = (i: number, p: Partial<Ad>) => setAds(ads.map((a, k) => (k === i ? { ...a, ...p } : a)), 'Shop ad edited');
  const P = { ...POPUP_DEFAULT, ...pop }, E = { ...EVENT_DEFAULT, ...ev };
  return (
    <div className="cr-grid">
      <Panel t="Seasonal event" d="A small ribbon at the bottom of every page, in the event's colours." className="span2" right={<Badge t={E.on ? 'ON' : 'OFF'} tone={E.on ? 'g' : 'd'} />}>
        <div className="cr-evs">{Object.entries(EVENTS).map(([id, x]) => <button key={id} type="button" className={'cr-ev' + (E.id === id ? ' on' : '')} style={{ background: x.bg, color: x.ink }} onClick={() => setEv({ ...E, id, msg: '' }, 'Event set to ' + x.name)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={x.icon} /></svg>{x.name}</button>)}</div>
        <div className="cr-form"><label>Message (empty = the event's own)<input className="cr-in" value={E.msg} placeholder={EVENTS[E.id]?.msg} onChange={(e) => setEv({ ...E, msg: e.target.value })} /></label>
          <div className="cr-row3"><label>From<input className="cr-in" type="date" value={E.from} onChange={(e) => setEv({ ...E, from: e.target.value })} /></label><label>To<input className="cr-in" type="date" value={E.to} onChange={(e) => setEv({ ...E, to: e.target.value })} /></label><label className="cr-chk"><input type="checkbox" checked={E.on} onChange={(e) => setEv({ ...E, on: e.target.checked }, e.target.checked ? 'Event switched on' : 'Event switched off')} /> Show on the site</label></div></div>
      </Panel>
      <Panel t="Pop-up offer" d="Opens once per visitor for each campaign. Changing the title starts a new campaign." className="span2" right={<Badge t={P.on ? 'ON' : 'OFF'} tone={P.on ? 'g' : 'd'} />}>
        <div className="cr-form">
          <div className="cr-row2"><label>Title<input className="cr-in" value={P.title} onChange={(e) => setPop({ ...P, title: e.target.value, id: 'p' + Date.now().toString(36) })} /></label><label>Button<input className="cr-in" value={P.cta} onChange={(e) => setPop({ ...P, cta: e.target.value })} /></label></div>
          <label>Text<input className="cr-in" value={P.text} onChange={(e) => setPop({ ...P, text: e.target.value })} /></label>
          <div className="cr-row3"><label>Link<input className="cr-in" value={P.href} onChange={(e) => setPop({ ...P, href: e.target.value })} /></label><label>Show after (seconds)<input className="cr-in" type="number" min={2} value={P.delay} onChange={(e) => setPop({ ...P, delay: +e.target.value })} /></label>
            <label>Pages<select className="cr-in" value={P.pages} onChange={(e) => setPop({ ...P, pages: e.target.value as Popup['pages'] })}><option value="all">Every page</option><option value="home">Home only</option><option value="shop">Shop only</option></select></label></div>
          <div className="cr-row3"><label>From<input className="cr-in" type="date" value={P.from} onChange={(e) => setPop({ ...P, from: e.target.value })} /></label><label>To<input className="cr-in" type="date" value={P.to} onChange={(e) => setPop({ ...P, to: e.target.value })} /></label><label className="cr-chk"><input type="checkbox" checked={P.on} onChange={(e) => setPop({ ...P, on: e.target.checked }, e.target.checked ? 'Pop-up switched on' : 'Pop-up switched off')} /> Show on the site</label></div>
          <div className="cr-imgs">{IMGS.map((u) => <button key={u} type="button" className={P.img === u ? 'on' : ''} onClick={() => setPop({ ...P, img: u })}><img src={u} alt="" /></button>)}</div>
        </div>
      </Panel>
      <Panel t="Shop ads" d="Strips between the product rows. Up to three show on a page; each rotates through the list." className="span2" right={<button type="button" className="cr-btn sm" onClick={() => setAds([...ads, { id: 'a' + Date.now().toString(36), k: 'NEW', t: 'Your headline', d: 'One short line.', cta: 'Shop now', href: '/shop', img: IMGS[0], tone: 'y' }], 'Shop ad added')}>+ Add an ad</button>}>
        {ads.map((a, i) => (
          <div key={a.id} className="cr-ad">
            <span className={'cr-adprev t-' + a.tone}><small>{a.k}</small><b>{a.t}</b><img src={a.img} alt="" /></span>
            <div className="cr-form">
              <div className="cr-row3"><label>Label<input className="cr-in" value={a.k} onChange={(e) => upd(i, { k: e.target.value })} /></label><label>Headline<input className="cr-in" value={a.t} onChange={(e) => upd(i, { t: e.target.value })} /></label><label>Button<input className="cr-in" value={a.cta} onChange={(e) => upd(i, { cta: e.target.value })} /></label></div>
              <div className="cr-row3"><label>Line<input className="cr-in" value={a.d} onChange={(e) => upd(i, { d: e.target.value })} /></label><label>Link<input className="cr-in" value={a.href} onChange={(e) => upd(i, { href: e.target.value })} /></label><label>Colour<select className="cr-in" value={a.tone} onChange={(e) => upd(i, { tone: e.target.value as Ad['tone'] })}><option value="y">Yellow</option><option value="d">Graphite</option><option value="w">White</option></select></label></div>
              <div className="cr-acts"><span className="cr-imgs sm">{IMGS.map((u) => <button key={u} type="button" className={a.img === u ? 'on' : ''} onClick={() => upd(i, { img: u })}><img src={u} alt="" /></button>)}</span>
                <button type="button" className="cr-btn ghost sm" disabled={!i} onClick={() => { const l = [...ads]; [l[i - 1], l[i]] = [l[i], l[i - 1]]; setAds(l, 'Shop ads reordered'); }}>↑</button>
                <button type="button" className="cr-btn ghost sm" onClick={() => setAds(ads.filter((_, k) => k !== i), 'Shop ad removed')}>Remove</button></div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
