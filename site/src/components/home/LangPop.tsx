'use client';
// R6 §03 F · the language switch moment, the same every time: the page blurs, a compact card (380×140) shows a tiny
// circuit trace drawing the new language's first letter (A / ع) for 2.0s while the switch runs under it, then the
// letter flashes yellow with "Mission accomplished!" for 1.2s, and it closes. No Samsoom. The choice is remembered
// by setLang (localStorage).
import React, { useEffect, useRef, useState } from 'react';

type Lang = 'en' | 'ar';
type Phase = 'off' | 'load' | 'done' | 'out';
const TXT = {
  en: { eb: 'LANGUAGE · ENGLISH', load: 'Translating every screen and battery…', done: 'Mission accomplished!', sub: 'The whole shop now speaks English.', close: 'Close' },
  ar: { eb: 'اللغة · العربية', load: 'نترجم كل شاشة وكل بطارية…', done: 'تمت المهمة!', sub: 'المتجر كله يتحدث العربية الآن.', close: 'إغلاق' },
};

export default function LangPop() {
  const [phase, setPhase] = useState<Phase>('off');
  const [to, setTo] = useState<Lang>('ar');
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms));

  useEffect(() => {
    const W = window as unknown as { __seLangPop?: boolean };
    W.__seLangPop = true;
    const close = () => { clear(); setPhase('out'); later(260, () => setPhase('off')); };
    const onPop = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      clear(); setTo(l); setPhase('load');
      later(320, () => window.seI18n && window.seI18n.now(l)); // the switch runs under the card
      later(2000, () => setPhase('done')); // fixed: loader 2.0s
      later(3200, close); // then "Mission accomplished!" 1.2s
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('se:lang-pop', onPop);
    window.addEventListener('keydown', onKey);
    return () => { W.__seLangPop = false; clear(); window.removeEventListener('se:lang-pop', onPop); window.removeEventListener('keydown', onKey); };
  }, []);

  if (phase === 'off') return null;
  const T = TXT[to], done = phase === 'done' || phase === 'out';
  return (
    <div className={'lp' + (phase === 'out' ? ' lp-out' : '')} data-no-i18n="" role="dialog" aria-modal="true" aria-live="polite" aria-label={done ? T.done : T.load}>
      <div className={'lp-card' + (done ? ' lp-done' : '')} dir={to === 'ar' ? 'rtl' : 'ltr'} lang={to}>
        <span className="lp-ic" aria-hidden="true">
          {/* a circuit trace draws the new language's first letter, with solder pads at its ends */}
          <svg viewBox="0 0 40 40" width="40" height="40">
            <rect x="1" y="1" width="38" height="38" rx="10" className="lp-plate" />
            {to === 'ar' ? (
              <path d="M27 11c-3-3-10-3-11 2-1 4 4 6 9 5-7 1-12 4-12 10 0 5 6 7 13 4" className="lp-trace" pathLength={1} />
            ) : (
              <path d="M10 31 20 9l10 22M14 24h12" className="lp-trace" pathLength={1} />
            )}
            {to === 'ar' ? (<><circle cx="27" cy="11" r="2" className="lp-pad" /><circle cx="26" cy="32" r="2" className="lp-pad" /></>) : (<><circle cx="10" cy="31" r="2" className="lp-pad" /><circle cx="30" cy="31" r="2" className="lp-pad" /></>)}
          </svg>
        </span>
        <span className="lp-txt">
          <span className="lp-eb">{T.eb}</span>
          <b>{done ? T.done : T.load}</b>
        </span>
      </div>
    </div>
  );
}
