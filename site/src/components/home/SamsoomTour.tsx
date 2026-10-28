'use client';
// Owner (R8 → R9): Samsoom's welcome and help.
//  · First visit: the site dims and Samsoom asks for a LANGUAGE first ("Choose your language" cycles through all eight, so
//    someone who doesn't read English still understands), then welcomes the visitor in that language and offers a quick
//    walk around (or skip). Remembered on this device ('se-tour').
//  · The walk lights up one thing at a time with a short line from him. Only things that are really on screen are shown
//    (narrow screens hide the nav links, so that step is skipped instead of pointing at nothing).
//  · Every page can add its own steps: any element with data-tour-step="n" data-tour-title="…" data-tour-text="…" joins the
//    walk on that page, in order (scrolled into view when its turn comes).
//  · The ? button in the nav (event 'se:help') calls him back on any page: "You called me?" → tour this page, change the
//    language, chat with him, or close.
//  · He is always alive (LiveSam): blinking, emoting every few seconds, eyes following the pointer.
// Styles in src/styles/dc-base.css (.st-*).
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import LiveSam from '../samsoom/LiveSam';
import { LANGS, type Lang } from '@/i18n/lang';
import { siteRaw } from '@/lib/catalog';
// Control Room → Site & Samsoom: tour on/off, welcome message and emote
const cfg = () => siteRaw<{ tour?: boolean; greeting?: string; welcome?: string }>('samsoom', {});

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
type Step = { sel?: string; el?: HTMLElement; mood: string; t: string; d: string; open?: string };
const NAV: Step[] = [
  { sel: '[data-tour="fmp"]', mood: 'think', t: 'Find My Part', d: 'Pick a brand, a model and a part: every grade we have, in seconds.' },
  { sel: '[data-tour="nav"]', mood: 'happy', t: 'Jump anywhere', d: 'The shop, repairs, trade prices and how to reach us.' },
  { sel: '.se-lm', mood: 'wave', t: 'Your language', d: 'Eight languages. Pick yours and the whole site follows.', open: '.se-lm-btn' },
  { sel: '[data-tour="hours"]', mood: 'wink', t: 'Open right now?', d: 'Live opening hours, in Dubai time.' },
  { sel: '[data-tour="cart"]', mood: 'happy', t: 'Your cart', d: 'Add parts as you browse; we confirm stock and price on WhatsApp.' },
  { sel: '[data-tour="menu"]', mood: 'think', t: 'The whole site', d: 'Every page and section, in one menu.' },
];
const END: Step[] = [
  { sel: '[data-tour="help"]', mood: 'wave', t: 'Need me again?', d: 'Tap the ? at the top, on any page, and I will show you around.' },
  { sel: '[data-tour="samsoom"]', mood: 'celebrate', t: 'And me!', d: 'Ask me about any part, grade or delivery, any time. I am always here.' },
];
// "Choose your language" in each language, cycled so everyone recognises theirs
const CHOOSE: [Lang, string][] = [['en', 'Choose your language'], ['ar', 'اختر لغتك'], ['fr', 'Choisissez votre langue'], ['hi', 'अपनी भाषा चुनें'], ['fa', 'زبان خود را انتخاب کنید'], ['ru', 'Выберите язык'], ['es', 'Elige tu idioma'], ['ur', 'اپنی زبان منتخب کریں']];
const RTL = (l: string) => l === 'ar' || l === 'fa' || l === 'ur';

const visible = (el: Element | null): el is HTMLElement => {
  if (!el) return false; const r = (el as HTMLElement).getBoundingClientRect(), cs = getComputedStyle(el as HTMLElement);
  // on screen too: on phones the nav is wider than the screen, so items past the edge are skipped
  return r.width > 2 && r.height > 2 && r.right > 4 && r.left < innerWidth - 4 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05;
};
function buildSteps(): Step[] {
  const home = location.pathname === '/';
  const page = Array.from(document.querySelectorAll<HTMLElement>('[data-tour-step]'))
    .sort((a, b) => +(a.dataset.tourStep || 0) - +(b.dataset.tourStep || 0))
    .map((el) => ({ el, mood: el.dataset.tourMood || 'happy', t: el.dataset.tourTitle || '', d: el.dataset.tourText || '' }));
  const nav = (home ? NAV : NAV.filter((s) => s.sel === '[data-tour="fmp"]' || s.sel === '[data-tour="cart"]')).filter((s) => visible(document.querySelector(s.sel!)) && (s.sel !== '[data-tour="nav"]' || !!document.querySelector('[data-tour="nav"] > a')));
  const end = END.filter((s) => visible(document.querySelector(s.sel!)));
  return home ? [...nav, ...page, ...end] : [...page, ...nav, ...end];
}

export default function SamsoomTour() {
  const [phase, setPhase] = useState<'off' | 'lang' | 'hello' | 'recall' | 'walk' | 'bye'>('off'), [i, setI] = useState(0), [box, setBox] = useState<DOMRect | null>(null);
  const [steps, setSteps] = useState<Step[]>([]), [ci, setCi] = useState(0), [, force] = useReducer((n: number) => n + 1, 0);
  const done = () => { try { localStorage.setItem('se-tour', '1'); } catch { /* private mode */ } };
  const closeLang = () => { const m = document.querySelector('.se-lm.open .se-lm-btn') as HTMLElement | null; if (m) m.click(); };
  const bye = useCallback((ms = 2800) => { closeLang(); done(); setPhase('bye'); window.setTimeout(() => setPhase('off'), ms); }, []);
  const walk = () => { const s = buildSteps(); if (!s.length) return bye(); setSteps(s); setI(0); setPhase('walk'); };

  // re-render in the new language as soon as it is applied
  useEffect(() => { const on = () => force(); window.addEventListener('se:lang', on); return () => window.removeEventListener('se:lang', on); }, []);
  // first visit: language first (if none chosen yet), then the welcome; ~3s after the loading screen has gone. The ? button
  // calls him back on any page.
  useEffect(() => {
    const help = () => { closeLang(); setPhase('recall'); };
    window.addEventListener('se:help', help);
    (window as unknown as { seTour?: () => void }).seTour = () => setPhase('lang');
    let seen = true, chose = true; try { seen = !!localStorage.getItem('se-tour'); chose = !!localStorage.getItem('se-lang'); } catch { /* blocked */ }
    let iv = 0;
    if (new URLSearchParams(location.search).get('tour') === '1') seen = false; // the Control Room's preview
    else if (cfg().tour === false) seen = true;
    if (!seen) {
      let t = 0; iv = window.setInterval(() => {
        const busy = document.documentElement.classList.contains('se-boot') || document.querySelector('.lp, .se-net-veil, .rp-full, .vs-full') || !document.querySelector('[data-tour="cart"]');
        if (busy) { t = 0; return; }
        if ((t += 500) >= 3000) { window.clearInterval(iv); setPhase(chose ? 'hello' : 'lang'); }
      }, 500);
    }
    return () => { window.clearInterval(iv); window.removeEventListener('se:help', help); };
  }, []);
  // the language prompt cycles through every language
  useEffect(() => { if (phase !== 'lang') return; const iv = window.setInterval(() => setCi((n) => (n + 1) % CHOOSE.length), 1700); return () => window.clearInterval(iv); }, [phase]);

  // follow the highlighted element (it may move as the page lays out); page steps are scrolled into view first
  useEffect(() => {
    if (phase !== 'walk' || !steps[i]) return;
    const s = steps[i]; let raf = 0;
    const el = () => (s.el && s.el.isConnected ? s.el : s.sel ? (document.querySelector(s.sel) as HTMLElement | null) : null);
    const e0 = el();
    if (s.el && e0) { const r = e0.getBoundingClientRect(); if (r.top < 90 || r.bottom > innerHeight - 40) { (window as unknown as { __seJumpForced?: number }).__seJumpForced = performance.now() + 1500; window.scrollTo({ top: r.top + scrollY - innerHeight / 2 + r.height / 2, behavior: 'smooth' }); } }
    if (s.open) { const b = document.querySelector(s.open) as HTMLElement | null; if (b && !document.querySelector('.se-lm.open')) b.click(); } else closeLang();
    const tick = () => {
      const e = el(); let r: DOMRect | null = e ? e.getBoundingClientRect() : null;
      if (e && s.open) { const l = e.querySelector('.se-lm-list') as HTMLElement | null; if (l) { const a = r!, b = l.getBoundingClientRect(); r = new DOMRect(Math.min(a.left, b.left), Math.min(a.top, b.top), Math.max(a.right, b.right) - Math.min(a.left, b.left), Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top)); } }
      setBox((b) => (r && (!b || Math.abs(b.x - r.x) > 0.5 || Math.abs(b.y - r.y) > 0.5 || Math.abs(b.width - r.width) > 0.5 || Math.abs(b.height - r.height) > 0.5) ? r : b));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, i, steps]);

  const next = () => { if (i >= steps.length - 1) bye(3200); else setI(i + 1); };
  useEffect(() => {
    if (phase === 'off') return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (phase === 'lang') setPhase('hello'); else bye(); } if (phase === 'walk' && e.key === 'ArrowRight') next(); if (phase === 'walk' && e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1)); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });

  if (phase === 'off') return null;
  if (phase === 'lang') {
    const [cl, ct] = CHOOSE[ci];
    return (
      <div className="st-veil" role="dialog" aria-modal="true" aria-label="Choose your language" data-no-i18n="">
        <div className="st-hello st-lang">
          <span className="st-sam"><LiveSam size={120} mood="idle" play="wave" /></span>
          <b key={ci} className="st-cycle" lang={cl} dir={RTL(cl) ? 'rtl' : 'ltr'}>{ct}</b>
          <div className="st-langs">
            {LANGS.map((l) => (
              <button key={l.id} type="button" lang={l.id} className={'st-l' + (l.id === cl ? ' hint' : '')} onClick={() => { window.seI18n && window.seI18n.now(l.id); try { localStorage.setItem('se-lang', l.id); } catch { /* */ } setPhase('hello'); }}>
                <b dir="auto">{l.name}</b><small>{l.en}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (phase === 'hello' || phase === 'bye' || phase === 'recall') {
    return (
      <div className="st-veil" role="dialog" aria-modal="true" aria-label={T('Welcome')} onClick={(e) => { if (e.target === e.currentTarget && phase !== 'bye') bye(1); }}>
        <div className={'st-hello' + (phase === 'bye' ? ' bye' : '')}>
          <span className="st-sam"><LiveSam size={120} mood="idle" play={phase === 'bye' ? 'kiss' : phase === 'recall' ? 'happy' : cfg().welcome || 'wave'} /></span>
          {phase === 'hello' ? (
            <>
              <b>{T('Welcome to Sam Electronics!')}</b>
              <p>{cfg().greeting ? T(cfg().greeting!) : T('I’m Samsoom, your parts assistant. Want a quick walk around? It takes 20 seconds.')}</p>
              <span className="st-acts">
                <button type="button" className="st-go" onClick={walk}>{T('Show me around')}</button>
                <button type="button" className="st-skip" onClick={() => bye()}>{T('Skip')}</button>
              </span>
            </>
          ) : phase === 'recall' ? (
            <>
              <b>{T('You called me?')}</b>
              <p>{T('I’m here to help. What would you like?')}</p>
              <span className="st-acts st-acts4">
                <button type="button" className="st-go" onClick={walk}>{T('Show me this page')}</button>
                <button type="button" className="st-back" onClick={() => setPhase('lang')}>{T('Change language')}</button>
                <button type="button" className="st-back" onClick={() => { setPhase('off'); window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })); }}>{T('Chat with me')}</button>
                <button type="button" className="st-skip" onClick={() => setPhase('off')}>{T('Close')}</button>
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
  const s = steps[i]; if (!s) return null;
  const vw = window.innerWidth, vh = window.innerHeight;
  const pad = 8, r = box, hole = r ? { left: r.left - pad, top: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2 } : null;
  // the bubble sits under the spot (or above it near the bottom), kept inside the screen with a 16px margin
  const bw = Math.min(340, vw - 32), below = !r || r.bottom + 220 < vh, bx = r ? Math.min(vw - bw - 16, Math.max(16, r.left + r.width / 2 - bw / 2)) : (vw - bw) / 2, by = r ? (below ? r.bottom + pad + 16 : Math.max(16, r.top - pad - 16 - 190)) : vh / 2 - 90;
  return (
    <div className="st-walk" role="dialog" aria-modal="true" aria-label={T(s.t)}>
      {hole ? <span className="st-hole" style={hole} /> : <span className="st-dim" />}
      <div className="st-bub" style={{ left: bx, top: by, width: bw }}>
        <span className="st-bsam"><LiveSam size={54} mood="idle" play={s.mood} /></span>
        <span className="st-btx" key={i}>
          <small>{i + 1} / {steps.length}</small>
          <b>{T(s.t)}</b>
          <span>{T(s.d)}</span>
          <span className="st-bacts">
            <button type="button" className="st-skip" onClick={() => bye()}>{T('Skip')}</button>
            {i > 0 ? <button type="button" className="st-back" onClick={() => setI(i - 1)}>{T('Back')}</button> : null}
            <button type="button" className="st-go" onClick={next}>{i === steps.length - 1 ? T('Done') : T('Next')}</button>
          </span>
        </span>
      </div>
    </div>
  );
}
