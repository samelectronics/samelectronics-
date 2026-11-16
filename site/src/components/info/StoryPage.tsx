'use client';
// P4 · OUR STORY (/story): who we are, why we do it (motive), the slogan, mission, vision and objectives, the timeline
// (Syria Tell 2003 → Sam Electronics → Madrid), the team, the branches, and careers with a job application (#careers).
// Wording is a first draft for the owner to confirm; facts (years, branches, founder) come from the company facts.
import React, { useEffect, useState } from 'react';
import { data } from '@/lib/catalog';
import { backend } from '@/lib/backend';
import { PageHero, T, useRise } from '@/components/site/ui';
import { BootLog, PhotoWall, SloganDial, WhyDial, JobBoard } from './StoryBits';
import SEStory from '@/components/dc/SEStory';
import SETeam from '@/components/dc/SETeam';
import { site } from '@/content/facts';
import { WHATSAPP, openContact } from '@/components/site/WeChatSheet';

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
  const D = data() as unknown as { countries?: unknown[]; hours?: Record<string, number[][]>; history?: { v: string; years: string; title: string; d: string }[]; team?: { role: string; name?: string; since?: number }[]; branches?: { id: string; name: string; address: string; status: string; since?: number }[] } | null;
  const pad = (x: number) => String(x).padStart(2, '0'), hm = (x: number) => pad(Math.floor(x / 60)) + ':' + pad(x % 60);
  const today = (() => { if (!D?.hours) return ''; const d = new Date(), g = new Date(d.getTime() + d.getTimezoneOffset() * 6e4 + 4 * 36e5); return (D.hours[g.getDay()] || []).map(([a, b]) => hm(a) + '–' + hm(b)).join(' · ') || 'Closed'; })();
  const apply = async (e: React.FormEvent) => { e.preventDefault(); await backend.apply({ type: 'job', name: f.name, email: f.email, phone: f.phone, data: { job: job || 'Open application', cv: f.cv, note: f.note } }); setSent(true); };
  return (
    <>
      <PageHero eb={T('OUR STORY · SINCE 2003')} title={T('Twenty years.')} accent={T('One counter.')} crumb={[[T('Our story')]]} seed={91}
        sub={T('From a small shop called Syria Tell in Deira to Sam Electronics: the same family, the same street, the same promise. Quality, warranty, price.')}
      />
      <section className="sp-sec w"><div className="sp-wrap stx-who">
        <div data-rise>
          <span className="sp-eb">{T('WHO WE ARE')}</span><h2 className="sp-h2">{T('A parts shop that grew up with the smartphone.')}</h2>
          <p className="sp-p">{T('Sam Electronics L.L.C sells mobile phone spare parts, wholesale and retail, from Al Murar in Deira, Dubai. We supply repair shops, traders and exporters across the Middle East, Africa, Europe and Asia, and we fix phones at our own bench.')}</p>
          <p className="sp-p" style={{ marginTop: 14 }}>{T('We started in 2003 as Syria Tell. In 2020 the shop took the name Sam Electronics, with the same management and the same people behind the counter.')}</p>
          <div className="stx-facts">{[['2003', 'First counter in Deira'], ['4', 'Versions of the shop'], [String(D?.countries?.length || 29), 'Countries we ship to'], ['1', 'Family, same management']].map(([n, l]) => <span key={l}><b>{n}</b><small>{T(l)}</small></span>)}</div>
        </div>
        <div data-rise><PhotoWall /></div>
      </div></section>

      <section className="sp-sec g"><div className="sp-wrap stx-slogan">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('OUR SLOGAN')}</span><h2 className="sp-h2">{T('Three words, in this order.')}</h2><p className="sp-p">{T('In that order. A cheap part that fails costs the repair shop its customer. We would rather tell you the truth about a grade than sell you the wrong one.')}</p></div></div>
        <div data-rise><SloganDial /></div>
      </div></section>

      <div className="stx-home">
        <SEStory todayHours={today} dirLink={site.contact.mapsLink} wa={'https://wa.me/' + WHATSAPP.raw} notify={() => openContact('wa', 'Hi Sam Electronics, please tell me when the Madrid branch opens.')} />
        <SETeam />
      </div>

      <section className="sp-sec g"><div className="sp-wrap stx-ver">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('OUR VERSIONS')}</span><h2 className="sp-h2">{T('Every version of us.')}</h2><p className="sp-p">{T('Like a phone, we got updates. Here is the log.')}</p></div></div>
        <div data-rise><BootLog history={D?.history || []} /></div>
      </div></section>

      <section className="sp-sec y"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('WHY WE DO IT')}</span><h2 className="sp-h2">{T('Why the counter opens every morning.')}</h2></div></div>
        <div data-rise><WhyDial /></div>
      </div></section>

      <section id="careers" className="sp-sec w stx-careers"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('CAREERS')}</span><h2 className="sp-h2">{T('Work with us.')}</h2><p className="sp-p">{T('We hire people who like phones, people and getting things exactly right. Openings are samples until the owner publishes real ones.')}</p></div></div>
        <div data-rise><JobBoard jobs={JOBS} on={job} pick={(t) => { setJob(t); document.getElementById('apply-job')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} /></div>
        <div id="apply-job" className="rp-book" style={{ marginTop: 40 }}>
          <div data-rise><span className="sp-eb">{T('APPLY')}</span><h3 className="sp-h2" style={{ fontSize: 30 }}>{job ? T(job) : T('Open application')}</h3><p className="sp-p">{T('Tell us about you. We read every application and reply to everyone.')}</p></div>
          {sent ? <div className="sp-card"><b className="sp-h3">{T('Thank you!')}</b><p className="sp-p">{T('We received your application and will be in touch.')}</p></div> : (
            <form className="sp-card rp-form wf2-console" onSubmit={apply} data-rise>
              <span className="wf2-con-h" style={{ gridColumn: '1 / -1' }}><b>{T('APPLICATION')}</b><small className="mono">{job ? T(job) : T('Open application')}</small></span>
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
