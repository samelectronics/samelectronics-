'use client';
// P4 · REPAIR LAB (/repair). Pick any model and see every repair for it: the part in each grade we stock, its price, the
// fitting fee and the total. Owner's fee rule: AED 25 when the part is under AED 100, AED 35 from 100 to 500, AED 45 above
// 500; the bench may adjust it up or down for the part and the work (the final price is confirmed before we start).
// Repairs without a stocked part (water damage, buttons, software…) are "diagnosis first". Then how it works and booking.
import React, { useEffect, useMemo, useState } from 'react';
import { JobTicket } from './RepairBits';
import { saveJob } from '@/components/account/BenchTools';
import { data, products, repairFee, aed, waLink, waCard, type Product , priceText } from '@/lib/catalog';
import { backend, useMe } from '@/lib/backend';
import { PageHero, T, useRise } from '@/components/site/ui';
import PrintedForm from '@/components/site/PrintedForm';
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import { brandInk } from '@/lib/brandInk';
import RepairFlip from '@/components/home/RepairFlip';
import CodeLookup from './CodeLookup';

type Rep = { id: string; g: string; name: string; cat: string | null; labour?: number; time?: string };

export default function RepairPage() {
  const [ready, setReady] = useState(false), [brand, setBrand] = useState('apple'), [model, setModel] = useState<string | null>(null), [q, setQ] = useState(''), [pick, setPick] = useState<{ rep: Rep; p?: Product } | null>(null);
  const [me] = useMe(), [f, setF] = useState({ name: '', phone: '', when: '', mode: 'walk-in', note: '' }), [sent, setSent] = useState(false), [job, setJob] = useState(''), [tab, setTab] = useState(0), [all, setAll] = useState(false);
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
  const book = async (v: Record<string, string>) => {
    const what = pick ? pick.rep.name + (pick.p ? ' · ' + pick.p.gradeName + ' (' + aed(pick.p.price + repairFee(pick.p.price), false) + ' est.)' : '') : 'Repair';
    const jb = 'SE-R' + Date.now().toString(36).toUpperCase().slice(-6);
    const text = waCard('Repair booking', [['Job', jb], ['Model', M?.name || '—'], ['Repair', what], ['When', (v.when ? new Date(v.when).toLocaleString('en-GB') : 'As soon as possible') + ' · ' + v.mode], ['Note', v.note]], { name: v.name, phone: v.phone });
    window.open(waLink(text), '_blank', 'noopener');
    await backend.send({ name: v.name, topic: 'Repair booking', text });
    setJob(jb); saveJob({ job: jb, model: M?.name || '', repair: pick ? pick.rep.name + (pick.p ? ' · ' + pick.p.gradeName : '') : 'Check first', total: pick?.p ? aed(pick.p.price + repairFee(pick.p.price)) : 'After the free check', when: v.when, at: Date.now() }); setSent(true);
    return jb;
  };


  return (
    <>
      <PageHero eb={T('REPAIR LAB · AL MURAR, DEIRA')} title={T('Fixed, tested,')} accent={T('guaranteed.')} crumb={[[T('Repair Lab')]]} seed={63}
        sub={T('Pick your phone and see every repair we do for it: the part in each grade, the fitting fee and the total, before you come in.')}
        right={<div className="rp-film"><RepairFlip w={480} fit="contain" zoom={1.25} /></div>}>
        <div className="sp-acts"><a className="sp-btn" href="#pick">{T('Find my repair')}</a><a className="sp-btn ghost" href="#fees">{T('How fees work')}</a></div>
      </PageHero>

      <section id="pick" className="sp-sec w">
        <div className="sp-wrap">
          <div className="sp-head" data-rise><div><span className="sp-eb">{T('STEP 1 · YOUR PHONE')}</span><h2 className="sp-h2">{T('Which phone needs fixing?')}</h2></div></div>
          <div className="rp2-pick" data-rise data-tour-step="1" data-tour-title="Pick your phone" data-tour-text="Choose the brand, then the model: every repair for it appears below.">
            <div className="rp2-brands">{D.brands.map((b) => <button key={b.id} type="button" className={'rp2-b' + (brand === b.id ? ' on' : '')} onClick={() => { setBrand(b.id); setModel(null); setQ(''); setAll(false); }} aria-label={b.name}><SEBrandLogo brand={b.id} h={18} fit="80x20" color={brand === b.id ? '#FFFFFF' : brandInk(b.id)} /></button>)}</div>
            <label className="rp2-q"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Search a model or model number')} /><small className="mono">{models.length} {T('models')}</small></label>
            <div className="rp2-ml">{models.slice(0, all ? 400 : 24).map((m) => <button key={m.id} type="button" className={'rp2-m' + (model === m.id ? ' on' : '') + (stocked.has(m.id) ? ' has' : '')} onClick={() => { setModel(m.id); setPick(null); setTab(0); window.setTimeout(() => document.getElementById('list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }}>{m.name}{stocked.has(m.id) ? <i title={T('Parts in stock')} /> : null}</button>)}</div>
            {models.length > 24 && !all ? <button type="button" className="rp2-more" onClick={() => setAll(true)}>{T('Show all')} {models.length} <i>↓</i></button> : null}
          </div>
          <CodeLookup brand={brand} onModel={(id, b) => { setBrand(b); setModel(id); setPick(null); window.setTimeout(() => document.getElementById('list')?.scrollIntoView({ behavior: 'smooth' }), 60); }} />
        </div>
      </section>

      <section id="list" className="sp-sec g">
        <div className="sp-wrap">
          <div className="sp-head" data-rise><div><span className="sp-eb">{T('STEP 2 · THE REPAIR')}</span><h2 className="sp-h2">{M ? <>{T('Every repair for the')} {M.name}</> : T('Choose your model above')}</h2><p className="sp-p">{M ? T('Part price + fitting fee = your total. Prices are samples; the bench confirms the final price before starting.') : T('Every repair, part and price for it will appear here.')}</p></div></div>
          <div className="rp2">
            <aside className="rp2-bench" data-rise>
              <div className="rp2-film"><RepairFlip w={480} fit="contain" zoom={1.12} /></div>
              {pick ? (
                <div className="rp2-sel" key={pick.rep.id + (pick.p?.id || '')}>
                  <small className="mono">{M?.name}</small><b>{T(pick.rep.name)}</b>
                  {pick.p ? <><span className={'pc-gr g-' + pick.p.grade}>{pick.p.gradeName}</span><div className="rp2-sum"><span>{T('Part')} <em>{priceText(pick.p.price)}</em></span><span>+ {T('fitting')} <em>{aed(repairFee(pick.p.price), false)}</em></span><strong>{aed(pick.p.price + repairFee(pick.p.price), false)}</strong></div></> : <span className="rp2-free">{T('Free check first')}</span>}
                  <a className="sp-btn rp2-go" href="#book">{T('Book this repair')} <i>→</i></a>
                </div>
              ) : <div className="rp2-sel idle"><b>{M ? T('Pick a repair on the right') : T('Pick your phone first')}</b><small>{T('Your total appears here.')}</small></div>}
            </aside>
            <div className="rp2-list" data-rise>
              {M ? (<>
                <div className="rp2-tabs" role="tablist">{groups.map((g, i) => <button key={g} type="button" role="tab" aria-selected={tab === i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{T(g)}</button>)}</div>
                {R.filter((r) => r.g === groups[tab]).map((r) => {
                  const ps = parts(r.cat);
                  return (
                    <div key={r.id} id={'rp-' + r.id} className={'rp2-r' + (pick?.rep.id === r.id ? ' on' : '')}>
                      <div className="rp2-rh"><b>{T(r.name)}</b>{r.time ? <small className="mono">{T(r.time)}</small> : null}</div>
                      {ps.length ? <div className="rp2-opts">{ps.map((p) => <button key={p.id} type="button" className={'rp2-o' + (pick?.p?.id === p.id ? ' on' : '')} onClick={() => setPick({ rep: r, p })}><span className={'pc-gr g-' + p.grade}>{p.gradeName}</span><small>{p.warranty}</small><b>{p.price > 0 ? aed(p.price + repairFee(p.price), false) : priceText(0)}</b></button>)}</div>
                        : <div className="rp2-diag"><span>{r.cat ? T('No part in stock for this model right now: we can order it.') : T('Diagnosis first: we check it, then quote. Diagnosis is free when you repair with us.')}</span><button type="button" className="rp2-o" onClick={() => setPick({ rep: r })}><b>{T('Book a check')}</b></button></div>}
                    </div>
                  );
                })}
                <span className="sp-sample">{T('Sample prices while the shop is set up')}</span>
              </>) : <div className="rp2-empty"><span className="rp2-arrow" aria-hidden="true">↑</span><b>{T('Choose your model above')}</b><small>{T('Then tap what is broken: screen, battery, charging port, cameras…')}</small></div>}
            </div>
          </div>
        </div>
      </section>

      <section id="fees" className="sp-sec y">
        <div className="sp-wrap">
          <div className="sp-head" data-rise><div><span className="sp-eb">{T('HOW FEES WORK')}</span><h2 className="sp-h2">{T('One simple fitting fee.')}</h2><p className="sp-p">{T('The fee follows the price of the part. Our technician may adjust it up or down for the part and the work involved, and always tells you before starting.')}</p></div></div>
          <div className="rp2-ruler" data-rise>
            <div className="rp2-rl" aria-hidden="true"><i /></div>
            {[['Part under AED 100', 25, 'Batteries, flex cables, small parts'], ['Part AED 100 – 500', 35, 'Most screens, cameras, back glass'], ['Part above AED 500', 45, 'Original screens on flagship phones']].map(([l, n, ex], i) => (
              <div key={String(l)} className="rp2-tag" style={{ ['--i' as string]: i }}><span className="rp2-hole" aria-hidden="true" /><small>{T(String(l))}</small><b>AED {n}</b><em>{T('fitting fee')}</em><span className="rp2-ex">{T(String(ex))}</span></div>
            ))}
          </div>
          <ol className="rp2-flow" data-rise>
            {[['Diagnose', 'We check the phone in front of you.'], ['Quote', 'Part + fee, agreed before we touch it.'], ['Repair', 'Most repairs while you wait.'], ['Test', 'Screen, touch, cameras, charging, calls.'], ['Warranty', 'Up to 6 months, by grade.']].map(([t, d], i) => <li key={t} style={{ ['--i' as string]: i }}><i>{i + 1}</i><b>{T(t)}</b><small>{T(d)}</small></li>)}
          </ol>
        </div>
      </section>

      <section id="book" className="sp-sec w">
        <div className="sp-wrap rp2-book">
          <div className="sp-head" data-rise><div><span className="sp-eb">{T('STEP 3 · BOOK IT')}</span><h2 className="sp-h2">{T('Book your repair')}</h2><p className="sp-p">{T('Walk in any time we are open, or book a time and skip the queue. We confirm on WhatsApp.')}</p></div></div>
          <div data-rise>
            <PrintedForm eb="REPAIR BOOKING" title="Tell us when, we print your job card." doc="JOB CARD"
              init={{ name: f.name, phone: f.phone }}
              lines={[[T('MODEL'), M?.name || T('Not chosen yet')], [T('REPAIR'), pick ? T(pick.rep.name) + (pick.p ? ' · ' + pick.p.gradeName : '') : T('Check first')], [T('TOTAL'), pick?.p ? aed(pick.p.price + repairFee(pick.p.price), false) : T('After the free check')]]}
              fields={[
                { k: 'name', label: 'Your name', req: true, slip: 'Name' },
                { k: 'phone', label: 'Phone (WhatsApp)', kind: 'tel', req: true, slip: 'Phone' },
                { k: 'mode', label: 'How', kind: 'chips', opts: [['walk-in', 'I will bring it to the shop'], ['courier', 'Courier pick-up (UAE)'], ['ship', 'I will ship it from abroad']], slip: 'How' },
                { k: 'when', label: 'When', kind: 'datetime', slip: 'When' },
                { k: 'note', label: 'What happened?', kind: 'area', ph: 'Dropped it, no picture, battery drains fast…', slip: 'Note' },
              ]}
              cta="Book on WhatsApp"
              send={(v) => book(v)}
              done={(no, v) => <JobTicket job={no} name={v.name} model={M?.name || T('Not chosen yet')} repair={pick ? T(pick.rep.name) + (pick.p ? ' · ' + pick.p.gradeName : '') : T('Check first')} total={pick?.p ? aed(pick.p.price + repairFee(pick.p.price)) : T('After the free check')} when={v.when ? new Date(v.when).toLocaleString() : ''} mode={v.mode === 'walk-in' ? 'Walk-in' : v.mode === 'courier' ? 'Courier pick-up' : 'Shipping'} />}
            />
          </div>
        </div>
      </section>
    </>
  );
}
