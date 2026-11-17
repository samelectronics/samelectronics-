'use client';
// R10 P10 · Story: our versions as a boot log (lines type in when the terminal scrolls into view) and the branches with a
// real map each and a live open/closed status from the opening hours (Dubai time).
import React, { useEffect, useRef, useState } from 'react';
import { T } from '@/components/site/ui';
import { shopStatus } from '@/lib/shopStatus';

type V = { v: string; years: string; title: string; d: string };
export function BootLog({ history }: { history: V[] }) {
  const ref = useRef<HTMLDivElement>(null), [n, setN] = useState(0), lines = history.length * 2 + 2;
  useEffect(() => {
    const el = ref.current; if (!el || !history.length) return; let iv = 0;
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(lines); return; } iv = window.setInterval(() => setN((k) => { if (k >= lines) { window.clearInterval(iv); return k; } return k + 1; }), 260); }, { threshold: 0.25 });
    io.observe(el); return () => { io.disconnect(); window.clearInterval(iv); };
  }, [history.length, lines]);
  let k = 0; const show = () => ++k <= n;
  return (
    <div className="bl" ref={ref}>
      <div className="bl-bar"><i /><i /><i /><span className="mono">sam-electronics · boot.log</span></div>
      <div className="bl-body mono" role="list">
        {show() ? <p className="bl-c">$ sam --boot --since 2003</p> : null}
        {history.map((h) => { const soon = h.years === 'Coming soon'; return (
          <React.Fragment key={h.v}>
            {show() ? <p role="listitem" className="bl-h"><span className="bl-t">[{soon ? ' ···· ' : ' ' + h.years.split(/[–-]/)[0].trim().slice(0, 4) + ' '}]</span> <b className="bl-v">{h.v}</b> <span className="bl-n">{T(h.title)}</span> <span className={'bl-s ' + (soon ? 'p' : 'ok')}>{soon ? T('PENDING') : 'OK'}</span></p> : null}
            {show() ? <p className="bl-d">  └ {T(h.d)} <span className="bl-y">({T(h.years)})</span></p> : null}
          </React.Fragment>); })}
        {show() ? <p className="bl-c">{T('System ready.')} <span className="bl-cur" /></p> : <p className="bl-c"><span className="bl-cur" /></p>}
      </div>
    </div>
  );
}

type B = { id: string; name: string; address: string; status: string; since?: number };
const MAP: Record<string, [string, string]> = { dxb: ['78G4+3H2 Dubai', 'https://maps.app.goo.gl/EsZiUQy8HmzfJg6QA'], mad: ['Plaza Mayor, Madrid', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Plaza Mayor, Madrid')] };
export function Branches({ branches }: { branches: B[] }) {
  const [now, setNow] = useState(() => Date.now()), [hours, setHours] = useState<Record<string, number[][]> | null>(null);
  useEffect(() => { const W = window as unknown as { SE_DATA?: { hours: Record<string, number[][]> } }; const tick = () => { setNow(Date.now()); if (W.SE_DATA) setHours(W.SE_DATA.hours); }; tick(); const iv = window.setInterval(tick, 30000); return () => window.clearInterval(iv); }, []);
  return (
    <div className="br2" data-rise>
      {branches.map((b) => { const live = b.status === 'live', key = /mad/i.test(b.id + b.name) ? 'mad' : 'dxb', m = MAP[key], s = live && hours ? shopStatus(hours, now) : null; return (
        <div key={b.id} className={'br2-c' + (live ? ' live' : '')}>
          <div className="br2-map"><iframe title={b.name} src={'https://www.google.com/maps?q=' + encodeURIComponent(m[0]) + '&z=' + (live ? 17 : 16) + '&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />{!live ? <span className="br2-soon">{T('Coming soon')}</span> : null}</div>
          <div className="br2-in">
            <span className="br2-st" style={s ? { ['--d' as string]: s.dot } : undefined}><i />{s ? T(s.short) : live ? T('Open') : T('Opening date to be announced')}</span>
            <b className="sp-h3">{T(b.name)}</b><span className="sp-p">{T(b.address)}</span>
            <div className="br2-acts"><a className="sp-btn sm" href={m[1]} target="_blank" rel="noopener noreferrer">{T('Directions')}</a>{live ? <a className="sp-btn sm ghost" href="/contact#visit">{T('Hours & contact')}</a> : null}</div>
          </div>
        </div>); })}
    </div>
  );
}

// R11 (owner): the change of name, told as a scene. The old shop sign ("Syria Tell", 2003) hangs lit on a graphite wall;
// as the visitor scrolls, its light flickers out, the sign turns, and the Sam Electronics emblem powers up in its place,
// with the years running underneath. Same family, same street.
export function BrandShift() {
  const ref = React.useRef<HTMLDivElement>(null), [k, setK] = React.useState(0);
  React.useEffect(() => { const el = ref.current; if (!el) return; let rq = 0; const on = () => { if (rq) return; rq = requestAnimationFrame(() => { rq = 0; const r = el.getBoundingClientRect(); setK(Math.max(0, Math.min(1, (innerHeight * 0.8 - r.top) / (r.height * 0.9)))); }); }; on(); addEventListener('scroll', on, { passive: true }); return () => { removeEventListener('scroll', on); cancelAnimationFrame(rq); }; }, []);
  const yr = Math.round(2003 + k * 23), turned = k > 0.5;
  return (
    <div className="bs" ref={ref} style={{ ['--k' as string]: k } as React.CSSProperties}>
      <div className={'bs-sign' + (turned ? ' new' : '')}>
        <div className="bs-face old"><span className="bs-bulbs" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</span><b data-no-i18n="">SYRIA TELL</b><small data-no-i18n="">سوريا تل · MOBILE</small></div>
        <div className="bs-face new"><img loading="lazy" decoding="async" src="/assets/se-logo-320.webp" alt="Sam Electronics" /><b data-no-i18n="">SAM ELECTRONICS</b><small>QUALITY · WARRANTY · PRICE</small></div>
      </div>
      <div className="bs-year"><b data-no-i18n="">{yr > 2026 ? 2026 : yr}</b><span>{turned ? T('Sam Electronics: same management, new name.') : T('Syria Tell opens in Deira.')}</span></div>
      <div className="bs-rail" aria-hidden="true"><i style={{ width: k * 100 + '%' }} />{[2003, 2011, 2015, 2020, 2026].map((y) => <span key={y} style={{ left: ((y - 2003) / 23) * 100 + '%' }} className={2003 + k * 23 >= y ? 'on' : ''}><em>{y}</em></span>)}</div>
    </div>
  );
}

// ===== Owner (16 Nov): the story page is told like Home: pictures, movement, things to touch. No document, no boxes. =====

/** WHO WE ARE: a pinned photo wall (frames ready for the owner's pictures) with short handwritten captions. */
const SHOTS: [string, string, string][] = [
  ['2003', 'The first Syria Tell counter, Deira', 'r1'],
  ['2011', 'Moving to Al Murar', 'r2'],
  ['Today', 'The bench, every day', 'r3'],
  ['Next', 'Plaza Mayor, Madrid', 'r4'],
];
export function PhotoWall() {
  return (
    <div className="pw" aria-label={T('Photos of our shops over the years')}>
      {SHOTS.map(([y, c, k], i) => (
        <figure key={k} className={'pw-f ' + k} style={{ ['--i' as string]: i }}>
          <span className="pw-tape" aria-hidden="true" />
          <span className="pw-img">
            {i === 2 ? <img loading="lazy" decoding="async" src="/assets/se-logo-320.webp" alt="" className="pw-logo" /> : <svg viewBox="0 0 64 48" aria-hidden="true"><rect x="2" y="6" width="60" height="40" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="22" cy="20" r="5" fill="currentColor" /><path d="M4 42 22 28l10 8 10-12 20 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /></svg>}
            <em className="mono">{T('Photo arrives with the owner’s pictures')}</em>
          </span>
          <figcaption><b className="mono">{T(y)}</b>{T(c)}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** THE SLOGAN: three words that light up one after another; hover or tap one to read what it means for you. */
const SL: [string, string, string][] = [
  ['Quality', 'Every part is labelled by grade and maker, and tested before it leaves the shop.', 'Tested'],
  ['Warranty', 'If a part fails, we stand behind it. The warranty is written on the label, not hidden.', 'Covered'],
  ['Price', 'Fair prices for repair shops and traders, with trade prices for bulk.', 'Fair'],
];
export function SloganDial() {
  const [on, setOn] = useState(0), [hold, setHold] = useState(false);
  useEffect(() => { if (hold) return; const iv = window.setInterval(() => setOn((v) => (v + 1) % 3), 3200); return () => window.clearInterval(iv); }, [hold]);
  return (
    <div className="sd" onMouseLeave={() => setHold(false)}>
      <div className="sd-words">
        {SL.map(([w], i) => (
          <React.Fragment key={w}>
            {i ? <i className="sd-dot" aria-hidden="true" /> : null}
            <button type="button" className={'sd-w' + (on === i ? ' on' : '')} onMouseEnter={() => { setHold(true); setOn(i); }} onFocus={() => { setHold(true); setOn(i); }} onClick={() => { setHold(true); setOn(i); }}><span className="mono">0{i + 1}</span>{T(w)}</button>
          </React.Fragment>
        ))}
      </div>
      <div className="sd-say" key={on}><b className="sd-stamp">{T(SL[on][2])}</b><p>{T(SL[on][1])}</p></div>
      <div className="sd-bar" aria-hidden="true"><i key={on + (hold ? 'h' : '')} className={hold ? 'hold' : ''} style={{ ['--x' as string]: on }} /></div>
    </div>
  );
}

/** WHY WE DO IT: motive, mission and vision on one dial; the objectives tick themselves off as you read. */
const MV: [string, string][] = [
  ['OUR MOTIVE', 'Every repaired phone is one less in a drawer. We exist so that repair shops can fix phones properly, quickly and at a fair price, everywhere we can reach.'],
  ['MISSION', 'Give every repair shop the right part, in the right grade, with an honest label and a real warranty, the same day.'],
  ['VISION', 'To be the parts counter repair shops trust most, from Dubai to Madrid and beyond.'],
];
const OBJ = ['Label every part by quality and manufacturer, never by guesswork.', 'Test every part before it leaves the shop.', 'Answer every customer the same day, in their language.', 'Ship anywhere, door to door, with a price agreed upfront.', 'Open in Madrid and serve Europe from there.'];
export function WhyDial() {
  const [t, setT] = useState(1), [n, setN] = useState(0), ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; let iv = 0; const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); iv = window.setInterval(() => setN((k) => { if (k >= OBJ.length) { window.clearInterval(iv); return k; } return k + 1; }), 520); }, { threshold: 0.35 }); io.observe(el); return () => { io.disconnect(); window.clearInterval(iv); }; }, []);
  return (
    <div className="wd" ref={ref}>
      <div className="wd-dial">
        <div className="wd-tabs" role="tablist">{MV.map(([k], i) => <button key={k} type="button" role="tab" aria-selected={t === i} className={t === i ? 'on' : ''} onClick={() => setT(i)}>{T(k)}</button>)}</div>
        <blockquote className="wd-q" key={t}><span aria-hidden="true">“</span>{T(MV[t][1])}</blockquote>
        <div className="wd-pips" aria-hidden="true">{MV.map((_, i) => <i key={i} className={t === i ? 'on' : ''} />)}</div>
      </div>
      <div className="wd-obj">
        <span className="sp-eb">{T('OBJECTIVES')}</span>
        <ul>{OBJ.map((o, i) => { const done = i < n, pend = i === OBJ.length - 1; return (
          <li key={o} className={(done ? 'done' : '') + (pend ? ' pend' : '')}><i aria-hidden="true">{done ? (pend ? '…' : '✓') : ''}</i><span>{T(o)}</span>{pend && done ? <em className="mono">{T('In progress')}</em> : null}</li>); })}</ul>
      </div>
    </div>
  );
}

/** CAREERS: an arrivals board, not boxes. Rows flip in; pick one to open its details and apply. */
export function JobBoard({ jobs, pick, on }: { jobs: [string, string, string, string][]; pick: (t: string) => void; on: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="jb" role="table" aria-label={T('Open positions')}>
      <div className="jb-hd mono" role="row"><span>{T('ROLE')}</span><span>{T('TEAM')}</span><span>{T('WHERE')}</span><span>{T('STATUS')}</span></div>
      {jobs.map(([t, w, d, tag], i) => { const op = open === t; return (
        <div key={t} className={'jb-row' + (op ? ' op' : '') + (on === t ? ' sel' : '')} role="row" style={{ ['--i' as string]: i }}>
          <button type="button" className="jb-main" onClick={() => setOpen(op ? null : t)} aria-expanded={op}>
            <b className="jb-flip">{T(t)}</b><span className="jb-tag">{T(tag)}</span><span className="mono">{T(w)}</span><span className="jb-st"><i />{T('Hiring')}</span>
          </button>
          {op ? <div className="jb-more"><p>{T(d)}</p><button type="button" className="sp-btn sm jb-go" onClick={() => pick(t)}>{T('Apply for this role')} <i>→</i></button></div> : null}
        </div>); })}
      <button type="button" className="jb-row jb-open" onClick={() => pick('')}><span className="jb-main"><b>{T('Open application')}</b><span className="jb-tag">{T('Any team')}</span><span className="mono">Deira</span><span className="jb-st"><i />{T('Always open')}</span></span></button>
    </div>
  );
}
