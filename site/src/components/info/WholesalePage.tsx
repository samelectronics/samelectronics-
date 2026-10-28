'use client';
// P4 · WHOLESALE (/wholesale): information and invitation only (owner). Buying happens in the shop: approved trade
// accounts simply see both prices on every part. This page explains who it is for, what you get, how approval works,
// the Sam Grid card, bulk quotes and export, and takes the application (#apply → backend.apply, reviewed in the Control Room).
import React, { useEffect, useState } from 'react';
import { backend, useMe } from '@/lib/backend';
import { products, aed, waLink } from '@/lib/catalog';
import { PageHero, T, useRise, CountUp } from '@/components/site/ui';
import PalletDrop from '@/components/home/PalletDrop';

export default function WholesalePage() {
  const [me] = useMe(), [done, setDone] = useState(false), [err, setErr] = useState('');
  const [f, setF] = useState({ company: '', name: '', email: '', phone: '', country: 'United Arab Emirates', kind: 'Repair shop', volume: 'AED 10,000 – 50,000', licence: '', cats: [] as string[], note: '' });
  const [ex, setEx] = useState<{ title: string; grade: string; r: number; w: number }[]>([]);
  useEffect(() => { if (me) setF((x) => ({ ...x, name: x.name || me.name, email: x.email || me.email, phone: x.phone || me.phone || '' })); }, [me]);
  useEffect(() => { const iv = window.setInterval(() => { const l = products(); if (l.length) { window.clearInterval(iv); setEx(l.filter((p) => p.category === 'SCR' && p.grade === 'OR').slice(0, 4).map((p) => ({ title: p.title, grade: p.gradeName, r: p.retail_price, w: p.wholesale_price }))); } }, 80); return () => window.clearInterval(iv); }, []);
  useRise();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: React.FormEvent) => { e.preventDefault(); const r = await backend.apply({ type: 'wholesale', name: f.name, email: f.email, phone: f.phone, data: { company: f.company, country: f.country, kind: f.kind, volume: f.volume, licence: f.licence, categories: f.cats.join(', '), note: f.note } }); if (r.ok) setDone(true); else setErr(T(r.error)); };
  return (
    <>
      <PageHero eb={T('WHOLESALE · TRADE ACCOUNTS')} title={T('Stock up.')} accent={T('Cost down.')} crumb={[[T('Wholesale')]]} seed={71}
        sub={T('For repair shops, traders and exporters. Get approved once and the shop shows you two prices on every part: the price for everyone, and yours.')}
        right={<div className="wh-pallet"><PalletDrop n={16} /></div>}>
        <div className="sp-acts"><a className="sp-btn" href="#apply">{T('Apply for a trade account')}</a><a className="sp-btn ghost" href="/shop">{T('Browse the shop')}</a></div>
      </PageHero>

      <section className="sp-sec w"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('WHO IT IS FOR')}</span><h2 className="sp-h2">{T('Built for the trade.')}</h2></div></div>
        <div className="sp-grid sp-g4" data-rise>
          {[['Repair shops', 'Every grade for every model, fitted the same day you buy.'], ['Traders', 'Bulk lists quoted the same day, stock reserved for you.'], ['Exporters', 'Packed for export, paperwork handled, shipped worldwide.'], ['Corporate & fleets', 'Parts for your own devices, invoiced to your company.']].map(([t, d], i) => <div key={t} className="sp-card wh-who" style={{ ['--i' as string]: i }}><span className="wh-n">0{i + 1}</span><b className="sp-h3">{T(t)}</b><p className="sp-p">{T(d)}</p></div>)}
        </div>
      </div></section>

      <section className="sp-sec d"><div className="sp-wrap wh-two">
        <div data-rise><span className="sp-eb">{T('TWO PRICES, ONE SHOP')}</span><h2 className="sp-h2" style={{ color: '#fff' }}>{T('Approved? Every part shows your price.')}</h2><p className="sp-p">{T('No separate catalogue, no price lists to ask for. Sign in and the shop shows the trade price next to the retail price on every part, in every grade.')}</p></div>
        <div className="wh-cmp" data-rise>
          <div className="wh-cmph"><span>{T('Part')}</span><span>{T('Everyone')}</span><span>{T('Trade')}</span></div>
          {ex.map((x) => <div key={x.title} className="wh-row"><span><b>{x.title}</b><small>{x.grade}</small></span><span>{aed(x.r, false)}</span><span className="t">{aed(x.w, false)}<small>−{Math.round((1 - x.w / x.r) * 100)}%</small></span></div>)}
          <span className="sp-sample" style={{ color: '#9DA1A6' }}>{T('Sample prices')}</span>
        </div>
      </div></section>

      <section className="sp-sec g"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('WHAT YOU GET')}</span><h2 className="sp-h2">{T('More than a price list.')}</h2></div></div>
        <div className="sp-grid sp-g3" data-rise>
          {[['Trade prices on every grade', 'Original, OLED, Incell and AAA, side by side.'], ['Same-day bulk quotes', 'Send a list on WhatsApp or upload it; we price it the same day.'], ['Credit on approved orders', 'For established accounts (Hub level and above).'], ['A dedicated account manager', 'One person who knows your shop.'], ['First pick of shipments', 'See what lands before it hits the shop.'], ['Export ready', 'Packed, labelled and shipped door to door.']].map(([t, d]) => <div key={t} className="sp-card wh-get"><i /><b>{T(t)}</b><span className="sp-p">{T(d)}</span></div>)}
        </div>
        <div className="wh-stats" data-rise>
          <span><b><CountUp to={28} /></b><small>{T('countries we ship to')}</small></span>
          <span><b>{T('Same day')}</b><small>{T('bulk quotes')}</small></span>
          <span><b><CountUp to={20} />+</b><small>{T('years in the trade')}</small></span>
          <span><b>SAM GRID</b><small>{T('your trade card')} · <a href="/membership#grid">{T('levels')}</a></small></span>
        </div>
      </div></section>

      <section className="sp-sec w"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('HOW IT WORKS')}</span><h2 className="sp-h2">{T('Three steps to trade prices.')}</h2></div></div>
        <ol className="rp-steps light" data-rise>
          {[['Create your account', 'In My Bench, with your company profile.'], ['Apply here', 'Trade licence and a few details.'], ['We verify and approve', 'Usually within one working day.'], ['Shop with your price', 'Both prices on every part, and your Sam Grid card.']].map(([t, d], i) => <li key={t}><i>{i + 1}</i><b>{T(t)}</b><small>{T(d)}</small></li>)}
        </ol>
      </div></section>

      <section id="apply" className="sp-sec y"><div className="sp-wrap wh-apply">
        <div data-rise>
          <span className="sp-eb">{T('APPLY')}</span><h2 className="sp-h2">{T('Apply for a trade account')}</h2>
          <p className="sp-p" style={{ color: '#5A4200' }}>{T('Our management team reviews every application by hand. We reply by e-mail and WhatsApp.')}</p>
          {!me ? <div className="sp-note" style={{ background: 'rgba(255,255,255,.55)' }}>{T('Tip: create your account first so the approval is linked to it.')} <a href="/account?next=trade">{T('Create account')}</a></div> : null}
          <a className="sp-btn wa" style={{ marginTop: 14 }} href={waLink('Hi Sam Electronics, I would like a bulk quote. My list:')} target="_blank" rel="noopener noreferrer">{T('Just need a bulk quote? WhatsApp us')}</a>
        </div>
        {done ? <div className="sp-card" data-rise><b className="sp-h3">{T('Application received.')}</b><p className="sp-p">{T('Thank you. We will review it and reply within one working day.')}</p></div> : (
          <form className="sp-card wh-form" onSubmit={submit} data-rise>
            <label className="sp-field">{T('Company name')}<input required value={f.company} onChange={set('company')} /></label>
            <label className="sp-field">{T('Your name')}<input required value={f.name} onChange={set('name')} /></label>
            <label className="sp-field">{T('E-mail')}<input required type="email" value={f.email} onChange={set('email')} /></label>
            <label className="sp-field">{T('Phone (WhatsApp)')}<input required value={f.phone} onChange={set('phone')} /></label>
            <label className="sp-field">{T('Country')}<input value={f.country} onChange={set('country')} /></label>
            <label className="sp-field">{T('Business type')}<select value={f.kind} onChange={set('kind')}>{['Repair shop', 'Trader', 'Exporter', 'Retailer', 'Corporate'].map((k) => <option key={k}>{T(k)}</option>)}</select></label>
            <label className="sp-field">{T('Trade licence number')}<input value={f.licence} onChange={set('licence')} /></label>
            <label className="sp-field">{T('Monthly volume (estimate)')}<select value={f.volume} onChange={set('volume')}>{['Under AED 10,000', 'AED 10,000 – 50,000', 'AED 50,000 – 150,000', 'AED 150,000 – 400,000', 'Above AED 400,000'].map((k) => <option key={k}>{k}</option>)}</select></label>
            <div className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('What do you buy most?')}<span className="wh-cats">{['Screens', 'Batteries', 'Flex cables', 'Back covers', 'Frames', 'Cameras', 'Small parts', 'Tools'].map((c) => <button key={c} type="button" className={'sp-chip' + (f.cats.includes(c) ? ' on' : '')} onClick={() => setF({ ...f, cats: f.cats.includes(c) ? f.cats.filter((x) => x !== c) : [...f.cats, c] })}>{T(c)}</button>)}</span></div>
            <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('Anything else?')}<textarea value={f.note} onChange={set('note')} /></label>
            {err ? <small style={{ color: '#9B1C20' }}>{err}</small> : null}
            <button type="submit" className="sp-btn dark" style={{ gridColumn: '1 / -1' }}>{T('Send application')}</button>
          </form>
        )}
      </div></section>
    </>
  );
}
