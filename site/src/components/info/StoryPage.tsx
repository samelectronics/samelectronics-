'use client';
// P4 · OUR STORY (/story): who we are, why we do it (motive), the slogan, mission, vision and objectives, the timeline
// (Syria Tell 2003 → Sam Electronics → Madrid), the team, the branches, and careers with a job application (#careers).
// Wording is a first draft for the owner to confirm; facts (years, branches, founder) come from the company facts.
import React, { useEffect, useState } from 'react';
import { data } from '@/lib/catalog';
import { backend } from '@/lib/backend';
import { PageHero, T, useRise } from '@/components/site/ui';
import LiveSam from '@/components/samsoom/LiveSam';

const JOBS: [string, string, string, string][] = [
  ['Repair technician', 'Full time · Deira', 'Board-level and module repairs on phones and tablets. Two years’ bench experience.', 'Repairs'],
  ['Parts specialist', 'Full time · Deira', 'Knows grades and manufacturers by heart; advises trade customers at the counter and on WhatsApp.', 'Sales'],
  ['Sales & WhatsApp desk', 'Full time · Deira', 'Answers customers in Arabic and English, quotes lists, follows orders to the door.', 'Sales'],
  ['Dispatch & warehouse', 'Full time · Deira', 'Checks, packs and ships parts worldwide; keeps the stock exact.', 'Operations'],
];

export default function StoryPage() {
  const [ready, setReady] = useState(false), [job, setJob] = useState(''), [f, setF] = useState({ name: '', email: '', phone: '', cv: '', note: '' }), [sent, setSent] = useState(false);
  useEffect(() => { const iv = window.setInterval(() => { if (data()) { window.clearInterval(iv); setReady(true); } }, 60); return () => window.clearInterval(iv); }, []);
  useRise(ready);
  const D = data() as unknown as { history?: { v: string; years: string; title: string; d: string }[]; team?: { role: string; name?: string; since?: number }[]; branches?: { id: string; name: string; address: string; status: string; since?: number }[] } | null;
  const apply = async (e: React.FormEvent) => { e.preventDefault(); await backend.apply({ type: 'job', name: f.name, email: f.email, phone: f.phone, data: { job: job || 'Open application', cv: f.cv, note: f.note } }); setSent(true); };
  return (
    <>
      <PageHero eb={T('OUR STORY · SINCE 2003')} title={T('Twenty years.')} accent={T('One counter.')} crumb={[[T('Our story')]]} seed={91}
        sub={T('From a small shop called Syria Tell in Deira to Sam Electronics: the same family, the same street, the same promise. Quality, warranty, price.')}
        right={<div className="st-year"><b>2003</b><small>{T('Deira, Dubai')}</small><LiveSam size={90} mood="idle" play="wave" /></div>} />

      <section className="sp-sec w"><div className="sp-wrap story-about">
        <div data-rise><span className="sp-eb">{T('WHO WE ARE')}</span><h2 className="sp-h2">{T('A parts shop that grew up with the smartphone.')}</h2></div>
        <div data-rise><p className="sp-p">{T('Sam Electronics L.L.C sells mobile phone spare parts, wholesale and retail, from Al Murar in Deira, Dubai. We supply repair shops, traders and exporters across the Middle East, Africa, Europe and Asia, and we fix phones at our own bench.')}</p><p className="sp-p" style={{ marginTop: 14 }}>{T('We started in 2003 as Syria Tell. In 2020 the shop took the name Sam Electronics, with the same management and the same people behind the counter.')}</p></div>
      </div></section>

      <section className="sp-sec y"><div className="sp-wrap story-slogan" data-rise>
        <span className="sp-eb">{T('OUR SLOGAN')}</span>
        <b className="story-sl">{T('Quality')}<i />{T('Warranty')}<i />{T('Price')}</b>
        <p className="sp-p" style={{ color: '#5A4200' }}>{T('In that order. A cheap part that fails costs the repair shop its customer. We would rather tell you the truth about a grade than sell you the wrong one.')}</p>
      </div></section>

      <section className="sp-sec g"><div className="sp-wrap">
        <div className="sp-grid sp-g3 story-mvo" data-rise>
          <div className="sp-card"><span className="sp-eb">{T('OUR MOTIVE')}</span><p className="sp-p">{T('Every repaired phone is one less in a drawer. We exist so that repair shops can fix phones properly, quickly and at a fair price, everywhere we can reach.')}</p></div>
          <div className="sp-card d"><span className="sp-eb" style={{ color: '#F7C032' }}>{T('MISSION')}</span><p className="sp-p">{T('Give every repair shop the right part, in the right grade, with an honest label and a real warranty, the same day.')}</p></div>
          <div className="sp-card"><span className="sp-eb">{T('VISION')}</span><p className="sp-p">{T('To be the parts counter repair shops trust most, from Dubai to Madrid and beyond.')}</p></div>
        </div>
        <div className="story-obj" data-rise>
          <span className="sp-eb">{T('OBJECTIVES')}</span>
          <ol>{['Label every part by quality and manufacturer, never by guesswork.', 'Test every part before it leaves the shop.', 'Answer every customer the same day, in their language.', 'Ship anywhere, door to door, with a price agreed upfront.', 'Open in Madrid and serve Europe from there.'].map((o, i) => <li key={o}><i>{i + 1}</i>{T(o)}</li>)}</ol>
        </div>
      </div></section>

      <section className="sp-sec d"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('OUR VERSIONS')}</span><h2 className="sp-h2" style={{ color: '#fff' }}>{T('Every version of us.')}</h2></div></div>
        <div className="story-tl">{(D?.history || []).map((h, i) => (
          <div key={h.v} className={'story-v' + (h.years === 'Coming soon' ? ' soon' : '')} data-rise style={{ ['--i' as string]: i }}>
            <span className="story-vn">{h.v}</span><b>{T(h.title)}</b><small>{T(h.years)}</small><p>{T(h.d)}</p>
          </div>
        ))}</div>
      </div></section>

      <section id="team" className="sp-sec w"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('THE TEAM')}</span><h2 className="sp-h2">{T('The people behind the counter.')}</h2><p className="sp-p">{T('Photos and names arrive with the owner’s team list.')}</p></div></div>
        <div className="story-team" data-rise>{(D?.team || []).map((t) => (
          <div key={t.role} className="story-m"><span className="story-ph">{t.name ? t.name.split(' ').map((x) => x[0]).join('').slice(0, 2) : '?'}</span><b>{t.name || T('Name to come')}</b><small>{T(t.role)}</small>{t.since ? <span className="sp-tag y">{T('Since')} {t.since}</span> : null}</div>
        ))}</div>
      </div></section>

      <section className="sp-sec g"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('BRANCHES')}</span><h2 className="sp-h2">{T('Where to find us.')}</h2></div></div>
        <div className="sp-grid sp-g2" data-rise>{(D?.branches || []).map((b) => (
          <div key={b.id} className={'sp-card story-br' + (b.status === 'live' ? ' d' : '')}>
            <span className={'sp-tag' + (b.status === 'live' ? ' ok' : ' y')}>{b.status === 'live' ? T('Open') : T('Coming soon')}</span>
            <b className="sp-h2" style={{ fontSize: 30, color: b.status === 'live' ? '#fff' : undefined }}>{T(b.name)}</b><span className="sp-p">{T(b.address)}</span>
            {b.status === 'live' ? <a className="sp-btn sm" href="/contact#visit">{T('Hours & directions')}</a> : null}
          </div>
        ))}</div>
      </div></section>

      <section id="careers" className="sp-sec w"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('CAREERS')}</span><h2 className="sp-h2">{T('Work with us.')}</h2><p className="sp-p">{T('We hire people who like phones, people and getting things exactly right. Openings are samples until the owner publishes real ones.')}</p></div></div>
        <div className="story-jobs" data-rise>{JOBS.map(([t, w, d, tag]) => (
          <div key={t} className={'sp-card story-job' + (job === t ? ' on' : '')}><span className="sp-tag">{T(tag)}</span><b className="sp-h3">{T(t)}</b><small className="sp-muted">{T(w)}</small><p className="sp-p">{T(d)}</p><button type="button" className="sp-btn sm" onClick={() => { setJob(t); document.getElementById('apply-job')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>{T('Apply')}</button></div>
        ))}</div>
        <div id="apply-job" className="rp-book" style={{ marginTop: 40 }}>
          <div data-rise><span className="sp-eb">{T('APPLY')}</span><h3 className="sp-h2" style={{ fontSize: 30 }}>{job ? T(job) : T('Open application')}</h3><p className="sp-p">{T('Tell us about you. We read every application and reply to everyone.')}</p></div>
          {sent ? <div className="sp-card"><b className="sp-h3">{T('Thank you!')}</b><p className="sp-p">{T('We received your application and will be in touch.')}</p></div> : (
            <form className="sp-card rp-form" onSubmit={apply} data-rise>
              <label className="sp-field">{T('Full name')}<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
              <label className="sp-field">{T('E-mail')}<input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
              <label className="sp-field">{T('Phone')}<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              <label className="sp-field">{T('Link to your CV (Drive, Dropbox, LinkedIn)')}<input value={f.cv} onChange={(e) => setF({ ...f, cv: e.target.value })} /></label>
              <label className="sp-field" style={{ gridColumn: '1 / -1' }}>{T('Why you?')}<textarea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></label>
              <small className="sp-muted" style={{ gridColumn: '1 / -1' }}>{T('CV upload opens when the database is connected; a link works today.')}</small>
              <button type="submit" className="sp-btn dark" style={{ gridColumn: '1 / -1' }}>{T('Send application')}</button>
            </form>
          )}
        </div>
      </div></section>
    </>
  );
}
