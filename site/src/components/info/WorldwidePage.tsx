'use client';
// P4 · WORLDWIDE (/worldwide): where we ship, how, and with whom. Every country we deliver to has a card with a photo
// frame (the owner's photo of each city goes in later), shipping partners (Sky Dragon, Emirates SkyCargo, UPS, DHL and
// more), door-to-door delivery, and customers' own shippers (we help them, but don't cover their costs). Then a quote form.
import React, { useEffect, useState } from 'react';
import { data, waLink } from '@/lib/catalog';
import { backend } from '@/lib/backend';
import { PageHero, T, useRise, CountUp } from '@/components/site/ui';
import DotGlobe from '@/components/home/DotGlobe';

const ISO: Record<string, string> = { UAE: 'AE', UK: 'GB', Spain: 'ES', Romania: 'RO', 'Türkiye': 'TR', Azerbaijan: 'AZ', Syria: 'SY', Lebanon: 'LB', Iraq: 'IQ', Iran: 'IR', Tunisia: 'TN', Algeria: 'DZ', Morocco: 'MA', Libya: 'LY', Egypt: 'EG', 'Saudi Arabia': 'SA', Oman: 'OM', Yemen: 'YE', Sudan: 'SD', Eritrea: 'ER', Ethiopia: 'ET', Nigeria: 'NG', Uganda: 'UG', Russia: 'RU', Ukraine: 'UA', India: 'IN', Pakistan: 'PK', 'Burkina Faso': 'BF', Senegal: 'SN' };
const flag = (n: string) => (ISO[n] ? String.fromCodePoint(...[...ISO[n]].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '🌍');
const REG: [string, string][] = [['all', 'All'], ['me', 'Middle East'], ['af', 'Africa'], ['eu', 'Europe'], ['as', 'Asia']];
const PARTNERS: [string, string, string][] = [['Sky Dragon', 'Air cargo · China, Middle East', '#C8102E'], ['Emirates SkyCargo', 'Air freight from Dubai', '#D71921'], ['UPS', 'Express door to door', '#5A3A1A'], ['DHL', 'Express worldwide', '#FFCC00'], ['Aramex', 'Middle East & Africa', '#E2231A'], ['FedEx', 'Express worldwide', '#4D148C']];

export default function WorldwidePage() {
  const [reg, setReg] = useState('all'), [ready, setReady] = useState(false), [f, setF] = useState({ name: '', phone: '', country: '', city: '', what: '', own: false }), [sent, setSent] = useState(false);
  useEffect(() => { const iv = window.setInterval(() => { if (data()) { window.clearInterval(iv); setReady(true); } }, 60); return () => window.clearInterval(iv); }, []);
  useRise(ready);
  const C = ((data() as unknown as { countries?: { name: string; region: string }[] })?.countries) || [];
  const shown = C.filter((c) => reg === 'all' || c.region === reg);
  const quote = async (e: React.FormEvent) => { e.preventDefault(); const text = `Shipping quote\nTo: ${f.city}, ${f.country}\nParts: ${f.what}\n${f.own ? 'I will use my own shipper.' : 'Please quote door to door.'}`; await backend.send({ name: f.name, topic: 'Shipping quote', text }); setSent(true); window.open(waLink('Hi Sam Electronics, ' + text + '\nName: ' + f.name + ' · ' + f.phone), '_blank', 'noopener'); };
  return (
    <>
      <PageHero eb={T('WORLDWIDE SHIPPING')} title={T('From Deira')} accent={T('to your door.')} crumb={[[T('Worldwide')]]} seed={83}
        sub={T('We ship parts every week to repair shops and traders across the Middle East, Africa, Europe and Asia: door to door with our partners, or with your own shipper.')}
        right={<div className="ww-globe"><DotGlobe size={300} speed={5} /></div>}>
        <div className="sp-acts"><a className="sp-btn" href="#quote">{T('Get a shipping quote')}</a><a className="sp-btn ghost" href="#countries">{T('Where we ship')}</a></div>
      </PageHero>

      <section className="sp-sec w"><div className="sp-wrap ww-stats" data-rise>
        <span><b><CountUp to={C.length || 28} /></b><small>{T('countries')}</small></span>
        <span><b>{T('Weekly')}</b><small>{T('departures')}</small></span>
        <span><b>{T('Door to door')}</b><small>{T('tracked and insured')}</small></span>
        <span><b>{T('Your shipper')}</b><small>{T('welcome too')}</small></span>
      </div></section>

      <section id="countries" className="sp-sec g"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('WHERE WE SHIP')}</span><h2 className="sp-h2">{T('Our customers, around the world.')}</h2></div>
          <div className="ww-tabs">{REG.map(([k, l]) => <button key={k} type="button" className={'sp-chip' + (reg === k ? ' on' : '')} onClick={() => setReg(k)}>{T(l)} <small>{k === 'all' ? C.length : C.filter((c) => c.region === k).length}</small></button>)}</div>
        </div>
        <div className="ww-grid">
          {shown.map((c, i) => (
            <div key={c.name} className="ww-c" style={{ animationDelay: (i % 12) * 0.04 + 's' }}>
              <span className="ww-photo"><span className="ww-flag">{flag(c.name)}</span><span className="ww-ph">{T('Photo coming')}</span><i /></span>
              <b>{T(c.name)}</b><small>{T(REG.find((r) => r[0] === c.region)?.[1] || '')}</small>
            </div>
          ))}
        </div>
        <small className="sp-muted">{T('Not on the list? We ship almost anywhere: ask us.')}</small>
      </div></section>

      <section className="sp-sec d"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('OUR SHIPPING PARTNERS')}</span><h2 className="sp-h2" style={{ color: '#fff' }}>{T('Air cargo and express, from Dubai.')}</h2><p className="sp-p">{T('We book the best route for your parcel: express for urgent parts, air cargo for bulk.')}</p></div></div>
        <div className="ww-partners" data-rise>{PARTNERS.map(([n, d, c]) => <div key={n} className="ww-p" style={{ ['--c' as string]: c }}><b>{n}</b><small>{T(d)}</small></div>)}<div className="ww-p more"><b>{T('and more')}</b><small>{T('Regional couriers on request')}</small></div></div>
        <span className="sp-sample" style={{ color: '#9DA1A6' }}>{T('Partner names as given by the owner; logos added once permission is confirmed.')}</span>
      </div></section>

      <section className="sp-sec w"><div className="sp-wrap ww-two">
        <div className="sp-card ww-opt" data-rise>
          <span className="sp-eb">{T('OPTION 1')}</span><h3 className="sp-h2" style={{ fontSize: 30 }}>{T('Door to door, by us')}</h3>
          <ol className="ms-how">{[['Order or send your list', 'In the shop or on WhatsApp.'], ['We quote shipping', 'Weight, route and time, before you pay.'], ['Packed and tested', 'Every part checked, packed for the trip.'], ['Delivered to your door', 'Tracked all the way, customs paperwork handled.']].map(([t, d], i) => <li key={t}><i>{i + 1}</i><span><b>{T(t)}</b><small>{T(d)}</small></span></li>)}</ol>
        </div>
        <div className="sp-card d ww-opt" data-rise>
          <span className="sp-eb" style={{ color: '#F7C032' }}>{T('OPTION 2')}</span><h3 className="sp-h2" style={{ fontSize: 30, color: '#fff' }}>{T('Your own shipper')}</h3>
          <p className="sp-p">{T('Already have a cargo agent or a courier account? Send them to us. We pack your order, hand it over and share the paperwork.')}</p>
          <div className="sp-note d">{T('We help with packing and paperwork, but the shipping cost and the shipper’s terms are between you and your shipper.')}</div>
        </div>
      </div></section>

      <section id="quote" className="sp-sec y"><div className="sp-wrap rp-book">
        <div data-rise><span className="sp-eb">{T('SHIPPING QUOTE')}</span><h2 className="sp-h2">{T('Where should it go?')}</h2><p className="sp-p" style={{ color: '#5A4200' }}>{T('Tell us where and what, and we quote the route and the price, usually the same day.')}</p></div>
        {sent ? <div className="sp-card" data-rise><b className="sp-h3">{T('Thank you!')}</b><p className="sp-p">{T('We opened WhatsApp with your request; the team replies there.')}</p></div> : (
          <form className="sp-card rp-form" onSubmit={quote} data-rise>
            <label className="sp-field">{T('Your name')}<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label className="sp-field">{T('Phone (WhatsApp)')}<input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
            <label className="sp-field">{T('Country')}<input required list="ww-c" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /><datalist id="ww-c">{C.map((c) => <option key={c.name} value={c.name} />)}</datalist></label>
            <label className="sp-field">{T('City')}<input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></label>
            <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('What are you sending for?')}<textarea value={f.what} onChange={(e) => setF({ ...f, what: e.target.value })} placeholder={T('e.g. 50 × iPhone 13 screens, 100 × A54 batteries')} /></label>
            <label className="au-agree" style={{ gridColumn: '1 / -1' }}><input type="checkbox" checked={f.own} onChange={(e) => setF({ ...f, own: e.target.checked })} /><span>{T('I will use my own shipper')}</span></label>
            <button type="submit" className="sp-btn dark" style={{ gridColumn: '1 / -1' }}>{T('Ask for a quote')}</button>
          </form>
        )}
      </div></section>
    </>
  );
}
