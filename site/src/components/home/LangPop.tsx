'use client';
// 14 Oct §03 · the language switch moment. Click EN / AR → the page blurs (8px, 20% graphite), a small card in the hero
// ad style scales in with a yellow charging loader and a fun line; the switch runs under it; the loader turns into a
// yellow tick + "Mission accomplished!" in the new language; it closes itself 1.2s later. If it isn't done after 4s an
// X appears. The choice is remembered by setLang (localStorage).
import React, { useEffect, useRef, useState } from 'react';
import SESamsoom from '@/components/dc/SESamsoom';

type Lang = 'en' | 'ar';
type Phase = 'off' | 'load' | 'done' | 'out';
const TXT = {
  en: { eb: 'LANGUAGE · ENGLISH', load: 'Translating every screen and battery…', done: 'Mission accomplished!', sub: 'The whole shop now speaks English.', close: 'Close' },
  ar: { eb: 'اللغة · العربية', load: 'نترجم كل شاشة وكل بطارية…', done: 'تمت المهمة!', sub: 'المتجر كله يتحدث العربية الآن.', close: 'إغلاق' },
};

export default function LangPop() {
  const [phase, setPhase] = useState<Phase>('off');
  const [to, setTo] = useState<Lang>('ar');
  const [x, setX] = useState(false);
  const [ok, setOk] = useState(false);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms));

  useEffect(() => {
    const W = window as unknown as { __seLangPop?: boolean };
    W.__seLangPop = true;
    const onPop = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      clear();
      setTo(l); setX(false); setOk(false); setPhase('load');
      const t0 = performance.now();
      later(4000, () => setX(true)); // still busy after 4s → the customer can close it
      later(320, async () => {
        // the switch runs under the card; done = the page re-rendered and the new script's font is ready
        window.seI18n && window.seI18n.now(l);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        // every font the re-rendered page asked for (Arabic weights load on first use)
        try { await Promise.race([document.fonts ? document.fonts.ready : null, new Promise((r) => setTimeout(r, 15000))]); } catch {}
        const wait = Math.max(0, 1100 - (performance.now() - t0)); // long enough to read the fun line
        later(wait, () => { clear(); setOk(true); setPhase('done'); later(1200, close); });
      });
    };
    const close = () => { clear(); setPhase('out'); later(260, () => setPhase('off')); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    (window as unknown as { seLangPopClose?: () => void }).seLangPopClose = close;
    window.addEventListener('se:lang-pop', onPop);
    window.addEventListener('keydown', onKey);
    return () => { W.__seLangPop = false; clear(); window.removeEventListener('se:lang-pop', onPop); window.removeEventListener('keydown', onKey); };
  }, []);

  if (phase === 'off') return null;
  const T = TXT[to], done = ok;
  return (
    <div className={'lp' + (phase === 'out' ? ' lp-out' : '')} data-no-i18n="" role="dialog" aria-modal="true" aria-live="polite" aria-label={done ? T.done : T.load}>
      <div className={'lp-card' + (done ? ' lp-done' : '')} dir={to === 'ar' ? 'rtl' : 'ltr'} lang={to}>
        <span className="lp-sam" aria-hidden="true">
          <SESamsoom mood={done ? 'happy' : 'think'} size={30} still={!done} />
        </span>
        {x && !done ? (
          <button type="button" className="lp-x" aria-label={T.close} onClick={() => (window as unknown as { seLangPopClose: () => void }).seLangPopClose()}>
            <svg viewBox="0 0 14 14" width="14" height="14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        ) : null}
        <span className="lp-eb">{T.eb}</span>
        <div className="lp-row">
          <span className="lp-ic" aria-hidden="true">
            {/* a small charging battery that fills, then becomes a tick */}
            <svg viewBox="0 0 44 44" width="44" height="44">
              <circle cx="22" cy="22" r="20" className="lp-ring" />
              <g className="lp-bat">
                <rect x="12" y="15" width="18" height="14" rx="2.6" fill="none" stroke="#F7C032" strokeWidth="2" />
                <rect x="31" y="19.5" width="2.4" height="5" rx="1" fill="#F7C032" />
                <rect x="14.5" y="17.5" width="13" height="9" rx="1.2" fill="#F7C032" className="lp-fill" />
              </g>
              <path d="M13 22.5l6 6 12-13" className="lp-tick" pathLength={1} />
            </svg>
          </span>
          <span className="lp-txt">
            <b>{done ? T.done : T.load}</b>
            {done ? <span>{T.sub}</span> : null}
          </span>
        </div>
      </div>
    </div>
  );
}
