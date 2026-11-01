'use client';
// R9 · themed FAQ. A page shows its topic (<Faq topic="repair" />); /faq shows every topic with tabs and a search. Each topic
// has its own look: a part label, a repair ticket, a pallet tag, a shipping label, a payment card, a chip, a bench drawer.
// Styles in src/styles/dc-base.css (.fq-*).
import React, { useMemo, useState } from 'react';
import { FAQ, TOPICS, type Topic } from '@/lib/faq';
import { siteRaw } from '@/lib/catalog';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
const data = (): Record<Topic, [string, string][]> => ({ ...FAQ, ...(siteRaw<Partial<Record<Topic, [string, string][]>> | null>('faq', null) || {}) });

function List({ topic, items }: { topic: Topic; items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0); const tp = TOPICS.find((x) => x.id === topic)!;
  return (
    <div className={'fq-list fq-' + tp.theme}>
      {items.map(([q, a], i) => (
        <div key={q} className={'fq-q' + (open === i ? ' open' : '')}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} data-sound="toggle">
            <span className="fq-n">{String(i + 1).padStart(2, '0')}</span><b>{T(q)}</b><i />
          </button>
          <div className="fq-a"><p>{T(a)}</p></div>
        </div>
      ))}
    </div>
  );
}

export default function Faq({ topic, all = false }: { topic?: Topic; all?: boolean }) {
  const D = useMemo(data, []); const [tab, setTab] = useState<Topic>(topic || 'shop'), [q, setQ] = useState('');
  if (!all && topic) {
    const tp = TOPICS.find((x) => x.id === topic)!;
    return (
      <section className="sp-sec w fq-sec" id="faq">
        <div className="sp-wrap fq-wrap">
          <div className="fq-head"><span className={'fq-ico fq-' + tp.theme}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={tp.icon} /></svg></span><div><span className="sp-eb">{T('QUESTIONS')} · {T(tp.name)}</span><h2 className="sp-h2">{T('Good to know')}</h2></div><a className="fq-all" href={'/faq#' + topic}>{T('All questions')} →</a></div>
          <List topic={topic} items={D[topic]} />
        </div>
      </section>
    );
  }
  const s = q.trim().toLowerCase();
  const hits = s ? TOPICS.flatMap((tp) => D[tp.id].filter(([a, b]) => (T(a) + ' ' + T(b)).toLowerCase().includes(s)).map((x) => [tp.id, x] as [Topic, [string, string]])) : [];
  return (
    <section className="sp-sec w fq-sec">
      <div className="sp-wrap fq-wrap">
        <label className="fq-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('Search the questions')} /></label>
        {s ? (hits.length ? <List topic={hits[0][0]} items={hits.map((h) => h[1])} /> : <p className="fq-none">{T('No question matches. Ask Samsoom instead.')} <button type="button" className="sp-btn sm" onClick={() => window.dispatchEvent(new CustomEvent('se:chat', { detail: { q } }))}>{T('Ask Samsoom')}</button></p>) : (
          <>
            <div className="fq-tabs" role="tablist">{TOPICS.map((tp) => <button key={tp.id} id={tp.id} role="tab" type="button" aria-selected={tab === tp.id} className={'fq-tab fq-' + tp.theme + (tab === tp.id ? ' on' : '')} onClick={() => setTab(tp.id)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={tp.icon} /></svg>{T(tp.name)}<small>{D[tp.id].length}</small></button>)}</div>
            <List key={tab} topic={tab} items={D[tab]} />
          </>
        )}
      </div>
    </section>
  );
}
