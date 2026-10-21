'use client';
// R6 §03 F · the language switch moment, the same every time: the page blurs, a compact card (380×140) shows a tiny
// circuit trace drawing the new language's first letter (A / ع) for 2.0s while the switch runs under it, then the
// letter flashes yellow with "Mission accomplished!" for 1.2s, and it closes. No Samsoom. The choice is remembered
// by setLang (localStorage).
import React, { useEffect, useRef, useState } from 'react';
// Hero 3 (owner): the battery charges with a percentage counting up, the end is a drawn tick, the card fits its text
// (nothing centred awkwardly) and has real colour and detail: graphite case, segmented green charge, yellow accents.

type Lang = 'en' | 'ar';
type Phase = 'off' | 'load' | 'done' | 'out';
const TXT = {
  en: { eb: 'LANGUAGE · ENGLISH', load: 'Translating every screen and battery…', done: 'Mission accomplished!', sub: 'The whole shop now speaks English.', close: 'Close' },
  ar: { eb: 'اللغة · العربية', load: 'نترجم كل شاشة وكل بطارية…', done: 'تمت المهمة!', sub: 'المتجر كله يتحدث العربية الآن.', close: 'إغلاق' },
};

export default function LangPop() {
  const [phase, setPhase] = useState<Phase>('off');
  const [to, setTo] = useState<Lang>('ar');
  const [pct, setPct] = useState(0);
  const raf = useRef(0);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms));

  useEffect(() => {
    const W = window as unknown as { __seLangPop?: boolean };
    W.__seLangPop = true;
    const close = () => { clear(); setPhase('out'); later(260, () => setPhase('off')); };
    const onPop = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      clear(); setTo(l); setPhase('load'); setPct(0);
      cancelAnimationFrame(raf.current); const t0 = performance.now(); const step = (n: number) => { const k = Math.min(1, (n - t0) / 1850), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; setPct(Math.round(e * 100)); if (k < 1) raf.current = requestAnimationFrame(step); }; raf.current = requestAnimationFrame(step);
      later(320, () => window.seI18n && window.seI18n.now(l)); // the switch runs under the card
      later(2000, () => setPhase('done')); // fixed: loader 2.0s
      later(3200, close); // then "Mission accomplished!" 1.2s
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('se:lang-pop', onPop);
    window.addEventListener('keydown', onKey);
    return () => { W.__seLangPop = false; clear(); cancelAnimationFrame(raf.current); window.removeEventListener('se:lang-pop', onPop); window.removeEventListener('keydown', onKey); };
  }, []);

  if (phase === 'off') return null;
  const T = TXT[to], done = phase === 'done' || phase === 'out';
  const segs = [0, 1, 2, 3, 4];
  return (
    <div className={'lp' + (phase === 'out' ? ' lp-out' : '')} data-no-i18n="" role="dialog" aria-modal="true" aria-live="polite" aria-label={done ? T.done : T.load}>
      <div className={'lp-card lp2' + (done ? ' lp-done' : '')} dir={to === 'ar' ? 'rtl' : 'ltr'} lang={to}>
        <span className="lp2-ic" aria-hidden="true">
          <span className="lp2-bat">
            <span className="lp2-cell">
              {segs.map((i) => (
                <i key={i} className={pct >= (i + 1) * 20 - 10 ? 'on' : ''} style={{ ['--k' as string]: Math.max(0, Math.min(1, (pct - i * 20) / 20)) } as React.CSSProperties} />
              ))}
              <svg className="lp2-bolt" viewBox="0 0 24 24" width="16" height="16"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
            </span>
            <span className="lp2-nub" />
          </span>
          <svg className="lp2-ok" viewBox="0 0 48 48" width="48" height="48">
            <circle cx="24" cy="24" r="22" className="lp2-okc" />
            <path d="M14 24.5l7 7 13-14" className="lp2-okt" pathLength={1} />
          </svg>
        </span>
        <span className="lp-txt lp2-txt">
          <span className="lp-eb">{T.eb}</span>
          <b>{done ? T.done : T.load}</b>
          <span className="lp2-meta">
            <span className="lp2-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></span>
            <em dir="ltr">{pct}%</em>
          </span>
        </span>
      </div>
    </div>
  );
}
