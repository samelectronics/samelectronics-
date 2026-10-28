'use client';
// Owner (R8): Samsoom's welcome tour. On a visitor's first visit, about 3 seconds after the loading screen, the site dims
// and Samsoom pops up in the centre to say hello and offer a quick walk around (or to skip). The walk lights up one thing
// at a time with a short line from him: Find My Part, the menu links, the language menu (he opens it to show it), the live
// hours, cart and account, the site map, and finally himself ("I'm always here"). Skipping ends with the same goodbye.
// Remembered on this device (localStorage 'se-tour'), so it runs once; window.seTour() replays it.
// Styles in src/styles/dc-base.css (.st-*).
import React, { useCallback, useEffect, useState } from 'react';
import SESamsoom from '../dc/SESamsoom';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
type Step = { sel: string; mood: string; t: string; d: string; open?: string };
const STEPS: Step[] = [
  { sel: '[data-tour="fmp"]', mood: 'think', t: 'Find My Part', d: 'Pick a brand, a model and a part: every grade we have, in seconds.' },
  { sel: '[data-tour="nav"]', mood: 'happy', t: 'Jump anywhere', d: 'The shop, repairs, trade prices and how to reach us.' },
  { sel: '.se-lm', mood: 'wave', t: 'Your language', d: 'Eight languages. Pick yours and the whole site follows.', open: '.se-lm-btn' },
  { sel: '[data-tour="hours"]', mood: 'wink', t: 'Open right now?', d: 'Live opening hours, in Dubai time.' },
  { sel: '[data-tour="cart"]', mood: 'happy', t: 'Your cart', d: 'Add parts as you browse; we confirm stock and price on WhatsApp.' },
  { sel: '[data-tour="menu"]', mood: 'think', t: 'The whole site', d: 'Every page and section, in one menu.' },
  { sel: '[data-tour="samsoom"]', mood: 'celebrate', t: 'And me!', d: 'Ask me about any part, grade or delivery, any time. I am always here.' },
];

export default function SamsoomTour() {
  const [phase, setPhase] = useState<'off' | 'hello' | 'walk' | 'bye'>('off'), [i, setI] = useState(0), [box, setBox] = useState<DOMRect | null>(null);
  const done = () => { try { localStorage.setItem('se-tour', '1'); } catch { /* private mode */ } };
  const closeLang = () => { const m = document.querySelector('.se-lm.open .se-lm-btn') as HTMLElement | null; if (m) m.click(); };
  const end = useCallback(() => { closeLang(); done(); setPhase('bye'); window.setTimeout(() => setPhase('off'), 2600); }, []);

  // start: first visit only, ~3s after the loading screen and any language pop-up have gone
  useEffect(() => {
    (window as unknown as { seTour?: () => void }).seTour = () => { setI(0); setPhase('hello'); };
    let seen = false; try { seen = !!localStorage.getItem('se-tour'); } catch { seen = true; }
    if (seen || location.pathname !== '/') return;
    let t = 0; const iv = window.setInterval(() => {
      const busy = document.documentElement.classList.contains('se-boot') || document.querySelector('.lp, .se-net-veil, .rp-full');
      if (busy) { t = 0; return; }
      if ((t += 500) >= 3000) { window.clearInterval(iv); setPhase('hello'); }
    }, 500);
    return () => window.clearInterval(iv);
  }, []);

  // follow the highlighted element (it may move as the page lays out)
  useEffect(() => {
    if (phase !== 'walk') return;
    const s = STEPS[i]; let raf = 0;
    if (s.open) { const b = document.querySelector(s.open) as HTMLElement | null; if (b && !document.querySelector('.se-lm.open')) b.click(); } else closeLang();
    const tick = () => { const el = document.querySelector(s.sel) as HTMLElement | null; const r = el ? (el.closest('.se-lm.open') ? (el.querySelector('.se-lm-list') as HTMLElement | null)?.getBoundingClientRect() || el.getBoundingClientRect() : el.getBoundingClientRect()) : null;
      if (r && el && s.open) { const a = el.getBoundingClientRect(); const u = new DOMRect(Math.min(a.left, r.left), Math.min(a.top, r.top), Math.max(a.right, r.right) - Math.min(a.left, r.left), Math.max(a.bottom, r.bottom) - Math.min(a.top, r.top)); setBox((b) => (b && Math.abs(b.x - u.x) < 0.5 && Math.abs(b.y - u.y) < 0.5 && Math.abs(b.height - u.height) < 0.5 ? b : u)); }
      else setBox((b) => (r && (!b || Math.abs(b.x - r.x) > 0.5 || Math.abs(b.y - r.y) > 0.5 || Math.abs(b.width - r.width) > 0.5) ? r : b));
      raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, i]);

  useEffect(() => {
    if (phase === 'off') return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') end(); if (phase === 'walk' && e.key === 'ArrowRight') next(); if (phase === 'walk' && e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1)); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });
  const next = () => { if (i >= STEPS.length - 1) { closeLang(); done(); setPhase('bye'); window.setTimeout(() => setPhase('off'), 3200); } else setI(i + 1); };

  if (phase === 'off') return null;
  if (phase === 'hello' || phase === 'bye') {
    return (
      <div className="st-veil" role="dialog" aria-modal="true" aria-label={T('Welcome')}>
        <div className={'st-hello' + (phase === 'bye' ? ' bye' : '')}>
          <span className="st-sam"><SESamsoom mood={phase === 'bye' ? 'kiss' : 'wave'} size={120} /></span>
          {phase === 'hello' ? (
            <>
              <b>{T('Welcome to Sam Electronics!')}</b>
              <p>{T('I’m Samsoom, your parts assistant. Want a quick walk around? It takes 20 seconds.')}</p>
              <span className="st-acts">
                <button type="button" className="st-go" onClick={() => { setI(0); setPhase('walk'); }}>{T('Show me around')}</button>
                <button type="button" className="st-skip" onClick={end}>{T('Skip')}</button>
              </span>
            </>
          ) : (
            <>
              <b>{T('Welcome, once more!')}</b>
              <p>{T('I’m always here if you need me. Just tap me, bottom corner.')}</p>
            </>
          )}
        </div>
      </div>
    );
  }
  const s = STEPS[i], vw = typeof window !== 'undefined' ? window.innerWidth : 1440, vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const pad = 8, r = box, hole = r ? { left: r.left - pad, top: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2 } : null;
  // the bubble sits under the spot (or above it near the bottom), kept inside the screen with a 16px margin
  const bw = Math.min(340, vw - 32), below = !r || r.bottom + 220 < vh, bx = r ? Math.min(vw - bw - 16, Math.max(16, r.left + r.width / 2 - bw / 2)) : (vw - bw) / 2, by = r ? (below ? r.bottom + pad + 16 : Math.max(16, r.top - pad - 16 - 190)) : vh / 2 - 90;
  return (
    <div className="st-walk" role="dialog" aria-modal="true" aria-label={T(s.t)}>
      {hole ? <span className="st-hole" style={hole} /> : <span className="st-dim" />}
      <div className="st-bub" style={{ left: bx, top: by, width: bw }} key={i}>
        <span className="st-bsam"><SESamsoom mood={s.mood} size={54} /></span>
        <span className="st-btx">
          <small>{i + 1} / {STEPS.length}</small>
          <b>{T(s.t)}</b>
          <span>{T(s.d)}</span>
          <span className="st-bacts">
            <button type="button" className="st-skip" onClick={end}>{T('Skip')}</button>
            {i > 0 ? <button type="button" className="st-back" onClick={() => setI(i - 1)}>{T('Back')}</button> : null}
            <button type="button" className="st-go" onClick={next}>{i === STEPS.length - 1 ? T('Done') : T('Next')}</button>
          </span>
        </span>
      </div>
    </div>
  );
}
