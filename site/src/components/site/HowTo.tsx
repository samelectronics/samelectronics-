'use client';
// R11 (owner): real tutorials. Each step shows a small browser window with the site's own screen for that step (the nav,
// the form or card, the button to press) and a cursor that moves to the button and clicks it. The steps play one after the
// other, or the visitor picks one.
import React, { useEffect, useRef, useState } from 'react';
import { T } from './ui';

export type HowStep = { t: string; d: string; url: string; screen: { h: string; rows?: string[]; btn: string; card?: 'circuit' | 'grid' | 'circle'; done?: string } };

function Screen({ s, play }: { s: HowStep['screen']; play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // the cursor aims at the real button's centre
  useEffect(() => { const w = ref.current, b = w?.querySelector('.ht-btn') as HTMLElement | null; if (!w || !b) return; const r = w.getBoundingClientRect(), q = b.getBoundingClientRect(); w.style.setProperty('--cx', (q.left - r.left + q.width * 0.55).toFixed(0) + 'px'); w.style.setProperty('--cy', (q.top - r.top + q.height * 0.4).toFixed(0) + 'px'); });
  return (
    <div ref={ref} className={'ht-win' + (play ? ' play' : '')}>
      <span className="ht-bar"><i /><i /><i /><span className="ht-url" /></span>
      <span className="ht-nav"><img src="/assets/se-logo-128.webp" alt="" /><b /><b /><b /><em /></span>
      <span className="ht-body">
        <span className="ht-h">{T(s.h)}</span>
        {s.card ? <span className={'ht-card k-' + s.card}><img src="/assets/se-logo-128.webp" alt="" /><b>{s.card === 'grid' ? 'SAM GRID' : s.card === 'circle' ? 'SAM CIRCLE' : 'SAM CIRCUIT'}</b><small>{T('Your name here')}</small><i /></span> : null}
        {(s.rows || []).map((r) => <span key={r} className="ht-f"><small>{T(r)}</small><i /></span>)}
        <span className="ht-btn">{T(s.btn)}</span>
        {s.done ? <span className="ht-done">✓ {T(s.done)}</span> : null}
      </span>
      <span className="ht-cur" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#26282B" strokeWidth="1.6" strokeLinejoin="round" /></svg></span>
    </div>
  );
}

export default function HowTo({ steps, title = 'How it works', eb = 'STEP BY STEP' }: { steps: HowStep[]; title?: string; eb?: string }) {
  const [k, setK] = useState(0), [vis, setVis] = useState(false), box = useRef<HTMLDivElement>(null), auto = useRef(true);
  useEffect(() => { const el = box.current; if (!el) return; const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { threshold: 0.35 }); io.observe(el); return () => io.disconnect(); }, []);
  useEffect(() => { if (!vis || !auto.current) return; const t = window.setTimeout(() => setK((n) => (n + 1) % steps.length), 4200); return () => window.clearTimeout(t); }, [k, vis, steps.length]);
  return (
    <div className="ht" ref={box}>
      <div className="ht-l">
        <span className="sp-eb">{T(eb)}</span><h3 className="sp-h2">{T(title)}</h3>
        <ol className="ht-steps">{steps.map((s, i) => (
          <li key={s.t}><button type="button" className={i === k ? 'on' : ''} onClick={() => { auto.current = false; setK(i); }}>
            <span className="ht-n">{i + 1}</span><span><b>{T(s.t)}</b><small>{T(s.d)}</small></span>
            {i === k && vis && auto.current ? <i className="ht-prog" key={k} /> : null}
          </button></li>
        ))}</ol>
      </div>
      <div className="ht-r"><span className="ht-addr">samelectronics.vercel.app{steps[k].url}</span><Screen key={k} s={steps[k].screen} play={vis} /></div>
    </div>
  );
}
