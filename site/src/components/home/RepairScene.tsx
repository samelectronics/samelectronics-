'use client';
// Owner (27 Oct): the Repair Lab's scene, at the hero / teardown quality (the same 3D renders): the cracked phone, then
// opened on the bench (screen off like a book, the insides showing, real tools), then repaired and booting. Under it, the
// four steps light up one by one with the scene, and the ticket shows what the visitor picked. Loops on its own clock.
import React, { useEffect, useState } from 'react';

const STEPS = [
  ['Diagnose', 'Free check on the bench'],
  ['Quote', 'Price confirmed before we start'],
  ['Repair', 'Original-grade part, fitted in Deira'],
  ['Test', 'Every function tested, then sealed'],
];
// what the empty half of the column holds (owner, 27 Oct): the bench promises and today's bench, filled as if live
const PROMISES = [
  ['M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z', 'Up to 6 months warranty', 'On every part we fit'],
  ['M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0M12 8v4l3 2', 'Most repairs same day', 'Wait in the shop or come back'],
  ['M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z', 'Your data stays yours', 'No reset unless you ask'],
  ['M4 7h16M4 12h16M4 17h10', 'No fix, no fee', 'Diagnosis is always free'],
];
const TODAY = [
  ['iPhone 13 Pro', 'Screen · Original', 'Ready'],
  ['Galaxy S23 Ultra', 'Back glass', 'Testing'],
  ['iPhone 12', 'Battery', 'Ready'],
  ['Redmi Note 12', 'Charging port', 'On the bench'],
  ['iPad 9th gen', 'Touch glass', 'Diagnose'],
];
const url = (id: string) => (typeof window !== 'undefined' && (window as unknown as { SE_SHOTS?: { url: (i: string, w: number) => string } }).SE_SHOTS ? (window as unknown as { SE_SHOTS: { url: (i: string, w: number) => string } }).SE_SHOTS.url(id, 960) : '');

export default function RepairScene({ ticket }: { ticket: { model: string; problems: string } }) {
  const [k, setK] = useState(0), [, setReady] = useState(0);
  // the image urls depend on window.SE_SHOTS (and the page language), so render them after mount and again on a language switch
  useEffect(() => { const r = () => setReady((n) => n + 1); r(); window.addEventListener('se:lang', r); const t = window.setTimeout(r, 1200); return () => { window.removeEventListener('se:lang', r); clearTimeout(t); }; }, []);
  useEffect(() => { const iv = window.setInterval(() => setK((n) => (n + 1) % 4), 2200); return () => clearInterval(iv); }, []);
  const img = ['rep-crack', 'rep-open', 'rep-open', 'rep-fixed'];
  return (
    <div className="rs">
      <div className="rs-stage" aria-hidden="true">
        {['rep-crack', 'rep-open', 'rep-fixed'].map((id) => (
          url(id) ? <img key={id} src={url(id)} alt="" className={img[k] === id ? 'on' : ''} /> : null
        ))}
        {k === 3 ? <span className="rs-sweep" key={'s' + k} /> : null}
        <span className="rs-tag" key={'t' + k}>{['Cracked screen', 'On the bench', 'New screen fitted', 'Tested · ready'][k]}</span>
      </div>
      <ol className="rs-steps">
        {STEPS.map(([t, d], i) => (
          <li key={t} className={i <= k ? 'on' : ''}>
            <i>{String(i + 1).padStart(2, '0')}</i>
            <b>{t}</b>
            <small>{d}</small>
          </li>
        ))}
      </ol>
      <div className="rs-prom">
        {PROMISES.map(([d, t, sub]) => (
          <div key={t}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
            <span><b>{t}</b><small>{sub}</small></span>
          </div>
        ))}
      </div>
      <div className="rs-today">
        <div className="rs-today-h"><span className="dot" />TODAY ON THE DEIRA BENCH</div>
        {TODAY.map(([m, j, st], i) => (
          <div key={m} className="rs-today-r" style={{ ['--i' as string]: i } as React.CSSProperties}>
            <b>{m}</b>
            <small>{j}</small>
            <em data-st={st === 'Ready' ? 'ok' : st === 'Testing' ? 'test' : undefined}>{st}</em>
          </div>
        ))}
      </div>
      <div className="rs-ticket">
        <span>YOUR TICKET</span>
        <b>{ticket.model || 'Choose your model'}</b>
        <small>{ticket.problems || 'Choose the problems'}</small>
      </div>
    </div>
  );
}
