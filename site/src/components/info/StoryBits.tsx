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
