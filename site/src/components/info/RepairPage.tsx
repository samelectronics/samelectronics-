'use client';
// P4 · REPAIR LAB (/repair). Pick any model and see every repair for it: the part in each grade we stock, its price, the
// fitting fee and the total. Owner's fee rule: AED 25 when the part is under AED 100, AED 35 from 100 to 500, AED 45 above
// 500; the bench may adjust it up or down for the part and the work (the final price is confirmed before we start).
// Repairs without a stocked part (water damage, buttons, software…) are "diagnosis first". Then how it works and booking.
import React, { useEffect, useMemo, useState } from 'react';
import { data, products, repairFee, aed, waLink, type Product } from '@/lib/catalog';
import { backend, useMe } from '@/lib/backend';
import { PageHero, T, useRise, flyToCart } from '@/components/site/ui';
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import RepairFlip from '@/components/home/RepairFlip';

type Rep = { id: string; g: string; name: string; cat: string | null; labour?: number; time?: string };

export default function RepairPage() {
  const [ready, setReady] = useState(false), [brand, setBrand] = useState('apple'), [model, setModel] = useState<string | null>(null), [q, setQ] = useState(''), [pick, setPick] = useState<{ rep: Rep; p?: Product } | null>(null);
  const [me] = useMe(), [f, setF] = useState({ name: '', phone: '', when: '', mode: 'walk-in', note: '' }), [sent, setSent] = useState(false);
  useEffect(() => { const iv = window.setInterval(() => { if (data() && products().length) { window.clearInterval(iv); setReady(true); const u = new URLSearchParams(location.search); if (u.get('model')) { const m = data()!.models.find((x) => x.id === u.get('model')); if (m) { setBrand(m.brand_id); setModel(m.id); } } } }, 60); return () => window.clearInterval(iv); }, []);
  useEffect(() => { if (me) setF((x) => ({ ...x, name: x.name || me.name, phone: x.phone || me.phone || '' })); }, [me]);
  useRise(ready);
  const D = data();
  const stocked = useMemo(() => new Set(products().map((p) => p.model_id)), [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!ready || !D) return <div className="shop-wait"><span /><span /><span /></div>;
  const R = ((D as unknown as { repairs: Rep[] }).repairs || []);
  const models = D.models.filter((m) => m.brand_id === brand && (!q || (m.name + ' ' + (m.model_numbers || []).join(' ')).toLowerCase().includes(q.toLowerCase()))).sort((a, b) => +stocked.has(b.id) - +stocked.has(a.id));
  const M = model ? D.models.find((m) => m.id === model) : null;
  const parts = (cat: string | null) => (M && cat ? products().filter((p) => p.model_id === M.id && p.category === cat).sort((a, b) => a.price - b.price) : []);
  const groups = [...new Set(R.map((r) => r.g))];
  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    const what = pick ? pick.rep.name + (pick.p ? ' · ' + pick.p.gradeName + ' (' + aed(pick.p.price + repairFee(pick.p.price), false) + ' est.)' : '') : 'Repair';
    const text = `Repair booking\nModel: ${M?.name || '—'}\nRepair: ${what}\nWhen: ${f.when || 'as soon as possible'} · ${f.mode}\n${f.note}`;
    await backend.send({ name: f.name, topic: 'Repair booking', text });
    setSent(true); window.open(waLink('Hi Sam Electronics, ' + text + '\nName: ' + f.name + ' · ' + f.phone), '_blank', 'noopener');
  };

  return (
    <>
      <PageHero eb={T('REPAIR LAB · AL MURAR, DEIRA')} title={T('Fixed, tested,')} accent={T('guaranteed.')} crumb={[[T('Repair Lab')]]} seed={63}
        sub={T('Pick your phone and see every repair we do for it: the part in each grade, the fitting fee and the total, before you come in.')}
        right={<div className="rp-film"><RepairFlip w={480} fit="contain" zoom={1.25} /></div>}>
        <div className="sp-acts"><a className="sp-btn" href="#pick">{T('Find my repair')}</a><a className="sp-btn ghost" href="#fees">{T('How fees work')}</a></div>
      </PageHero>

      <section id="pick" className="sp-sec g">
        <div className="sp-wrap">
          <div className="sp-head" data-rise><div><span className="sp-eb">{T('STEP 1 · YOUR PHONE')}</span><h2 className="sp-h2">{T('Which phone needs fixing?')}</h2></div></div>
          <div className="rp-brands" data-rise data-tour-step="1" data-tour-title="Pick your phone" data-tour-text="Choose the brand, then the model: every repair for it appears below.">
            {D.brands.map((b) => <button key={b.id} type="button" className={'rp-b' + (brand === b.id ? ' on' : '')} onClick={() => { setBrand(b.id); setModel(null); setQ(''); }}><SEBrandLogo brand={b.id} h={18} fit="80x20" color="currentColor" /></button>)}
          </div>
          <div className="rp-models" data-rise>
            <input className="sp-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Search a model or model number')} />
            <div className="rp-ml">{models.slice(0, 48).map((m) => <button key={m.id} type="button" className={'rp-m' + (model === m.id ? ' on' : '') + (stocked.has(m.id) ? '' : ' dim')} onClick={() => { setModel(m.id); setPick(null); window.setTimeout(() => document.getElementById('list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }}>{m.name}{stocked.has(m.id) ? <i /> : null}</button>)}</div>
            {models.length > 48 ? <small className="sp-muted">+{models.length - 48} {T('more: type to narrow')}</small> : null}
          </div>
        </div>
      </section>

      <section id="list" className="sp-sec w">
        <div className="sp-wrap">
          {M ? (
            <>
              <div className="sp-head" data-rise><div><span className="sp-eb">{T('STEP 2 · THE REPAIR')}</span><h2 className="sp-h2">{T('Every repair for the')} {M.name}</h2><p className="sp-p">{T('Part price + fitting fee = your total. Prices are samples; the bench confirms the final price before starting.')}</p></div></div>
              {groups.map((g) => (
                <div key={g} className="rp-g" data-rise>
                  <h3 className="rp-gh">{T(g)}</h3>
                  <div className="rp-rows">
                    {R.filter((r) => r.g === g).map((r) => {
                      const ps = parts(r.cat);
                      return (
                        <div key={r.id} className={'rp-r' + (pick?.rep.id === r.id ? ' on' : '')}>
                          <div className="rp-rh"><b>{T(r.name)}</b>{r.time ? <small>⏱ {T(r.time)}</small> : null}</div>
                          {ps.length ? (
                            <div className="rp-opts">{ps.map((p) => { const fee = repairFee(p.price); return (
                              <button key={p.id} type="button" className={'rp-o' + (pick?.p?.id === p.id ? ' on' : '')} onClick={() => setPick({ rep: r, p })}>
                                <span className={'pc-gr g-' + p.grade}>{p.gradeName}</span><small>{p.makerName} · {p.warranty}</small>
                                <span className="rp-sum"><span>{T('Part')} {aed(p.price, false)}</span><span>+ {T('fitting')} {aed(fee, false)}</span></span>
                                <b>{aed(p.price + fee, false)}</b><span className="sp-sample">sample</span>
                              </button>
                            ); })}</div>
                          ) : (
                            <div className="rp-diag"><span>{r.cat ? T('No part in stock for this model right now: we can order it.') : T('Diagnosis first: we check it, then quote. Diagnosis is free when you repair with us.')}</span><button type="button" className="sp-btn sm ghost" onClick={() => setPick({ rep: r })}>{T('Book a check')}</button></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : <div className="sp-empty rp-none" data-rise><b className="sp-h3">{T('Choose your model above')}</b><span>{T('Every repair, part and price for it will appear here.')}</span></div>}
        </div>
      </section>

      <section id="fees" className="sp-sec d">
        <div className="sp-wrap">
          <div className="sp-head" data-rise><div><span className="sp-eb">{T('HOW FEES WORK')}</span><h2 className="sp-h2" style={{ color: '#fff' }}>{T('One simple fitting fee.')}</h2><p className="sp-p">{T('The fee follows the price of the part. Our technician may adjust it up or down for the part and the work involved, and always tells you before starting.')}</p></div></div>
          <div className="rp-tiers" data-rise>
            {[['Part under AED 100', 25], ['Part AED 100 – 500', 35], ['Part above AED 500', 45]].map(([l, n], i) => <div key={String(l)} className="rp-tier" style={{ ['--i' as string]: i }}><small>{T(String(l))}</small><b>AED {n}</b><span>{T('fitting fee')}</span></div>)}
          </div>
          <ol className="rp-steps" data-rise>
            {[['Diagnose', 'We check the phone in front of you.'], ['Quote', 'Part + fee, agreed before we touch it.'], ['Repair', 'Most repairs while you wait.'], ['Test', 'Screen, touch, cameras, charging, calls.'], ['Warranty', 'Up to 6 months, by grade.']].map(([t, d], i) => <li key={t}><i>{i + 1}</i><b>{T(t)}</b><small>{T(d)}</small></li>)}
          </ol>
        </div>
      </section>

      <section id="book" className="sp-sec y">
        <div className="sp-wrap rp-book">
          <div data-rise><span className="sp-eb">{T('STEP 3 · BOOK IT')}</span><h2 className="sp-h2">{T('Book your repair')}</h2><p className="sp-p" style={{ color: '#5A4200' }}>{T('Walk in any time we are open, or book a time and skip the queue. We confirm on WhatsApp.')}</p>
            {pick ? <div className="rp-chosen"><b>{M?.name}</b><span>{T(pick.rep.name)}{pick.p ? ' · ' + pick.p.gradeName : ''}</span>{pick.p ? <b>{aed(pick.p.price + repairFee(pick.p.price))}</b> : <span>{T('Free check')}</span>}{pick.p ? <button type="button" className="sp-btn sm dark" onClick={(e) => flyToCart(null, pick.p!.id, e)}>{T('Just the part, to cart')}</button> : null}</div> : <small>{T('Pick a repair above, or just describe the problem.')}</small>}
          </div>
          {sent ? <div className="sp-card" data-rise><b className="sp-h3">{T('Booked. See you soon!')}</b><p className="sp-p">{T('We opened WhatsApp with your booking; the team confirms the time there.')}</p></div> : (
            <form className="sp-card rp-form" onSubmit={book} data-rise>
              <label className="sp-field">{T('Your name')}<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
              <label className="sp-field">{T('Phone (WhatsApp)')}<input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              <label className="sp-field">{T('When')}<input type="datetime-local" value={f.when} onChange={(e) => setF({ ...f, when: e.target.value })} /></label>
              <label className="sp-field">{T('How')}<select value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value })}><option value="walk-in">{T('I will bring it to the shop')}</option><option value="courier">{T('Courier pick-up (UAE)')}</option><option value="ship">{T('I will ship it from abroad')}</option></select></label>
              <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('What happened?')}<textarea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder={T('Dropped it, no picture, battery drains fast…')} /></label>
              <button type="submit" className="sp-btn dark" style={{ gridColumn: '1 / -1' }}>{T('Book on WhatsApp')}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
