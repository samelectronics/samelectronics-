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
import { LANGS, RANK, type Lang, langLabel } from '@/i18n/lang';
import Typed from '@/components/samsoom/Typed';
import { StoreCards, hasStore, setStore } from '@/components/site/StorePicker';
// R11g (owner): the store question only comes once, in the first welcome on the home page. Anywhere else (shop, etc.)
// Deira is set quietly; the store can be changed any time from the arrow by the logo or Settings.
// R12 (owner): Allo Madrid becomes its own website, so the welcome never asks for a store any more
const nextAfterLang = (): 'hello' | 'store' => { if (!hasStore()) setStore('dxb'); return 'hello'; };
import { typeMs } from '@/lib/voice';
import { babble, hush, tourStart, tourStep, tourEnd, tourStop, isMuted, setMuted } from '@/lib/voice';
import { siteRaw } from '@/lib/catalog';
// Control Room → Site & Samsoom: tour on/off, welcome message and emote
const cfg = () => siteRaw<{ tour?: boolean; greeting?: string; welcome?: string }>('samsoom', {});

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
type Step = { sel?: string; el?: HTMLElement; mood: string; t: string; d: string; open?: string };
const NAV: Step[] = [
  { sel: '[data-tour="fmp"]', mood: 'pt-smile', t: 'Find My Part', d: 'Brand, model, part: every grade in seconds.' },
  { sel: '[data-tour="nav"]', mood: 'pt-happy', t: 'Jump anywhere', d: 'Shop, repairs, trade prices and contact.' },
  { sel: '.se-lm', mood: 'pt-blush', t: 'Language and settings', d: 'Change the language, sounds and currency here.', open: '.se-lm-btn' },
  { sel: '.nb', mood: 'pt-wink', t: 'Your notifications', d: 'Orders, repairs and offers land here.' },
  { sel: '[data-tour="hours"]', mood: 'pt-wink', t: 'Open right now?', d: 'Live hours, in Dubai time.' },
  { sel: '[data-tour="cart"]', mood: 'pt-smile', t: 'Your cart', d: 'Add parts; we confirm on WhatsApp.' },
  { sel: '[data-tour="menu"]', mood: 'pt-think', t: 'The whole site', d: 'Every page, in one menu.' },
];
const END: Step[] = [
  { sel: '[data-tour="help"]', mood: 'pt-blush', t: 'Need me again?', d: 'Tap the ? on any page.' },
  { sel: '[data-tour="samsoom"]', mood: 'celebrate', t: 'And me!', d: 'Ask me anything, any time.' },
];
// "Choose your language" in each language, cycled so everyone recognises theirs (R9: all twenty-four)
const CHOOSE: [Lang, string][] = [["en", "Choose your language"], ["ar", "اختر لغتك"], ["fr", "Choisissez votre langue"], ["es", "Elige tu idioma"], ["zh", "选择您的语言"], ["hi", "अपनी भाषा चुनें"], ["ur", "اپنی زبان منتخب کریں"], ["fa", "زبان خود را انتخاب کنید"], ["ru", "Выберите язык"], ["de", "Sprache wählen"], ["pt", "Escolha o idioma"], ["it", "Scegli la lingua"], ["sw", "Chagua lugha yako"], ["tl", "Piliin ang wika mo"], ["ml", "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കൂ"], ["am", "ቋንቋዎን ይምረጡ"], ["ha", "Zaɓi harshenka"], ["yo", "Yan èdè rẹ"], ["ig", "Họrọ asụsụ gị"], ["om", "Afaan kee filadhu"], ["ro", "Alege limba"], ["ca", "Tria l’idioma"], ["gl", "Escolle o teu idioma"], ["eu", "Aukeratu zure hizkuntza"]];
const SCROLL: Record<string, string> = {"en": "Scroll for more languages", "de": "Für mehr Sprachen scrollen", "it": "Scorri per altre lingue", "pt": "Deslize para mais idiomas", "ca": "Llisca per a més idiomes", "gl": "Despraza para máis idiomas", "eu": "Irristatu hizkuntza gehiagorako", "ro": "Derulează pentru alte limbi", "tl": "Mag-scroll para sa iba pang wika", "zh": "滑动查看更多语言", "ml": "കൂടുതൽ ഭാഷകൾക്ക് സ്ക്രോൾ ചെയ്യൂ", "sw": "Sogeza kuona lugha zaidi", "am": "ለተጨማሪ ቋንቋዎች ያሸብልሉ", "ha": "Gungura don ƙarin harsuna", "yo": "Yí lọ fún èdè mìíràn", "om": "Afaanota dabalataaf gadi qabi", "ig": "Pịgharịa maka asụsụ ndị ọzọ", "ar": "مرّر لمزيد من اللغات", "es": "Desliza para más idiomas", "fr": "Faites défiler pour plus de langues", "fa": "برای زبان‌های بیشتر بکشید", "ru": "Прокрутите, чтобы увидеть ещё", "hi": "और भाषाओं के लिए स्क्रॉल करें", "ur": "مزید زبانوں کے لیے اسکرول کریں"};
const DETECTED: Record<string, string> = {"en": "Detected", "de": "Erkannt", "it": "Rilevata", "pt": "Detetado", "ca": "Detectat", "gl": "Detectado", "eu": "Detektatua", "ro": "Detectată", "tl": "Natukoy", "zh": "已检测", "ml": "കണ്ടെത്തിയത്", "sw": "Imegunduliwa", "am": "ተገኝቷል", "ha": "An gano", "yo": "A rí i", "om": "Argame", "ig": "Achọpụtara", "ar": "تم اكتشافها", "es": "Detectado", "fr": "Détectée", "fa": "شناسایی شد", "ru": "Определён", "hi": "पहचानी गई", "ur": "شناخت ہوئی"};
// R10 B1: English, Arabic, Spanish, French, then the rest by how likely our buyers speak them (detected one pinned on top)
const ranked = () => RANK.map((id) => LANGS.find((x) => x.id === id)!).filter(Boolean).concat(LANGS.filter((x) => !RANK.includes(x.id)));
const CHOOSE_R = () => RANK.map((id) => CHOOSE.find((c) => c[0] === id)).filter(Boolean) as [Lang, string][];
/** the visitor's own language, from the browser (shown first, marked "Detected") */
const detect = (): Lang | null => { try { for (const n of navigator.languages || [navigator.language]) { const c = (n || '').toLowerCase().slice(0, 2), f = c === 'fil' ? 'tl' : c; if (LANGS.some((x) => x.id === f)) return f as Lang; } } catch { /* */ } return null; };
// page steps name a mood; on the walk each one becomes a pointing pose with the matching face
const POSE: Record<string, string> = { happy: 'pt-happy', think: 'pt-think', wave: 'pt-smile', wink: 'pt-wink', blush: 'pt-blush', found: 'pt-wow', celebrate: 'pt-wow', idle: 'pt-smile' };
const RTL = (l: string) => l === 'ar' || l === 'fa' || l === 'ur';
const LANG_SET = new Set(['ar', 'fa', 'ur']);

const visible = (el: Element | null): el is HTMLElement => {
  if (!el) return false; const r = (el as HTMLElement).getBoundingClientRect(), cs = getComputedStyle(el as HTMLElement);
  // on screen too: on phones the nav is wider than the screen, so items past the edge are skipped
  return r.width > 2 && r.height > 2 && r.right > 4 && r.left < innerWidth - 4 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05;
};
function buildSteps(): Step[] {
  const home = location.pathname === '/';
  const page = Array.from(document.querySelectorAll<HTMLElement>('[data-tour-step]'))
    .sort((a, b) => +(a.dataset.tourStep || 0) - +(b.dataset.tourStep || 0))
    .map((el) => ({ el, mood: POSE[el.dataset.tourMood || ''] || (el.dataset.tourMood?.startsWith('pt-') ? el.dataset.tourMood : 'pt-smile'), t: el.dataset.tourTitle || '', d: el.dataset.tourText || '' }));
  // pages without their own tour marks: walk through the page's sections by their headings
  if (!home && !page.length) {
    Array.from(document.querySelectorAll<HTMLElement>('main section, .sp-sec')).filter((sec) => sec.querySelector('h1, h2') && visible(sec)).slice(0, 5).forEach((el, k) => {
      const h = el.querySelector('h1, h2') as HTMLElement, eb = el.querySelector('.sp-eb') as HTMLElement | null, pp = el.querySelector('.sp-p, p') as HTMLElement | null;
      const d = (pp?.textContent || '').trim(); page.push({ el, mood: k ? 'pt-smile' : 'pt-happy', t: (h.innerText || h.textContent || '').replace(/\s+/g, ' ').trim(), d: d.length > 140 ? d.slice(0, d.lastIndexOf(' ', 136)) + '…' : d || (eb?.textContent || '') });
    });
  }
  const nav = (home ? NAV : NAV.filter((s) => s.sel === '[data-tour="fmp"]' || s.sel === '[data-tour="cart"]' || s.sel === '.se-lm' || s.sel === '.nb')).filter((s) => visible(document.querySelector(s.sel!)) && (s.sel !== '[data-tour="nav"]' || !!document.querySelector('[data-tour="nav"] > a')));
  const end = END.filter((s) => visible(document.querySelector(s.sel!)));
  // R12 (owner): on detail pages the tour shows only what is unique to that page, top to bottom; the nav, language and
  // help steps live in the home tour only
  return home ? [...nav, ...page, ...end] : page;
}

export default function SamsoomTour() {
  const [phase, setPhase] = useState<'off' | 'lang' | 'store' | 'hello' | 'recall' | 'walk' | 'bye'>('off'), [i, setI] = useState(0), [box, setBox] = useState<DOMRect | null>(null);
  const [offer, setOffer] = useState(false), [jump, setJump] = useState(false), [mute, setMute] = useState(false);
  useEffect(() => { setMute(isMuted()); const f = () => setMute(isMuted()); window.addEventListener('se:sam-mute', f); return () => window.removeEventListener('se:sam-mute', f); }, []);
  useEffect(() => { if (phase !== 'walk') setJump(false); }, [phase]);
  const [steps, setSteps] = useState<Step[]>([]), [ci, setCi] = useState(0), [, force] = useReducer((n: number) => n + 1, 0);
  const done = () => { try { localStorage.setItem('se-tour2', '1'); } catch { /* private mode */ } };
  const closeLang = () => { const m = document.querySelector('.se-lm.open .se-lm-btn') as HTMLElement | null; if (m) m.click(); };
  const bye = useCallback((ms = 2800) => { closeLang(); done(); hush(); tourStop(); setPhase('bye'); window.setTimeout(() => setPhase('off'), ms); }, []);
  const walk = () => { const s = buildSteps(); if (!s.length) return bye(); setSteps(s); setI(0); setPhase('walk'); tourStart(); };
  // Bench → Medals & training: "Show me live" opens the real page with ?lesson=id; he walks it and the medal is earned
  const lesson = React.useRef<string | null>(null);

  // re-render in the new language as soon as it is applied
  useEffect(() => { const on = () => force(); window.addEventListener('se:lang', on); return () => window.removeEventListener('se:lang', on); }, []);
  // first visit: language first (if none chosen yet), then the welcome; ~3s after the loading screen has gone. The ? button
  // calls him back on any page.
  useEffect(() => {
    const help = () => { closeLang(); setPhase('recall'); };
    const ls = new URLSearchParams(location.search).get('lesson');
    if (ls) {
      lesson.current = ls; done(); (window as unknown as { __seTourIdle?: boolean }).__seTourIdle = true;
      try { history.replaceState(null, '', location.pathname + location.hash); } catch { /* */ }
      let lt = 0; const li = window.setInterval(() => {
        const busy = document.documentElement.classList.contains('se-boot') || document.querySelector('.se-bootv, .lp, .se-net-veil') || !document.querySelector('[data-tour="cart"]');
        if (busy) { lt = 0; return; } if (!lt) lt = Date.now(); if (Date.now() - lt >= 700) { window.clearInterval(li); walk(); }
      }, 250);
      window.addEventListener('se:help', help);
      return () => { window.clearInterval(li); window.removeEventListener('se:help', help); };
    }
    window.addEventListener('se:help', help);
    (window as unknown as { seTour?: () => void }).seTour = () => setPhase('lang');
    let seen = true, chose = true; try { seen = !!localStorage.getItem('se-tour2'); chose = !!localStorage.getItem('se-lang'); } catch { /* blocked */ }
    let iv = 0;
    if (new URLSearchParams(location.search).get('tour') === '1') seen = false; // the Control Room's preview
    else if (cfg().tour === false) seen = true;
    const W = window as unknown as { __seTourIdle?: boolean };
    W.__seTourIdle = seen; // R10 A4: the cookie banner waits for this
    if (!seen) {
      let t = 0; iv = window.setInterval(() => {  // ~1s after the page is ready
        const busy = document.documentElement.classList.contains('se-boot') || document.querySelector('.se-bootv, .lp, .se-net-veil, .rp-full, .vs-full') || !document.querySelector('[data-tour="cart"]');
        if (busy) { t = 0; return; }
        if (!t) t = Date.now();
        if (Date.now() - t >= 900) { window.clearInterval(iv); setPhase(chose ? nextAfterLang() : 'lang'); }
      }, 250);
    }
    // on a page someone opens for the first time (after the first welcome), he offers a tour of that page once
    let ot = 0;
    if (seen && location.pathname !== '/' && !location.pathname.startsWith('/staff')) {
      // owner (18 Nov): "I never got the 'want a tour of this page?' message". It now waits until nothing else is on
      // screen (cookie banner, pop-ups, notices) and only counts as seen once it has really been shown.
      const k = 'se-pt:' + location.pathname; let had = true; try { had = !!localStorage.getItem(k); } catch { /* */ }
      if (!had) { const t0 = Date.now(); ot = window.setInterval(() => {
        if (Date.now() - t0 < 2500) return;
        if (document.querySelector('.sc2-banner, .sc2-veil, .st-veil, .sn2, .lp, .se-net-veil, .pv-veil, [role="dialog"][aria-modal="true"]')) return;
        window.clearInterval(ot); try { localStorage.setItem(k, '1'); } catch { /* */ } setOffer(true);
      }, 600); }
    }
    (window as unknown as { seWalk?: () => void }).seWalk = () => { setOffer(false); walk(); };
    return () => { window.clearInterval(iv); window.clearInterval(ot); window.removeEventListener('se:help', help); };
  }, []);
  const wasOn = React.useRef(false);
  useEffect(() => { if (phase !== 'off') wasOn.current = true; else if (wasOn.current) (window as unknown as { __seTourIdle?: boolean }).__seTourIdle = true; }, [phase]);
  // the language prompt cycles through every language
  useEffect(() => { if (phase !== 'lang') return; const iv = window.setInterval(() => setCi((n) => (n + 1) % CHOOSE.length), 1900); return () => window.clearInterval(iv); }, [phase]);

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

  const next = () => { if (i >= steps.length - 1) { if (lesson.current) { const id = lesson.current; lesson.current = null; import('@/lib/achievements').then((a) => a.unlock('lesson-' + id)).catch(() => {}); } tourEnd(); setJump(true); window.setTimeout(() => bye(3200), 650); } else setI(i + 1); };
  // he talks on every step (and the tour builds a little); the bubble types along
  useEffect(() => { if (phase !== 'walk' || !steps[i]) return; tourStep(i, steps.length); const st = steps[i]; const stop = babble(T(st.t) + '. ' + T(st.d)); return () => stop(); }, [phase, i]);
  useEffect(() => { if (phase === 'hello') { const stop = babble(T('Welcome to Sam Electronics!') + ' ' + (cfg().greeting ? T(cfg().greeting!) : T('I’m Samsoom, your parts assistant. Want a quick walk around? It takes 20 seconds.'))); return () => stop(); } if (phase === 'recall') { const stop = babble(T('You called me?')); return () => stop(); } if (phase === 'store') { const stop = babble(T('Where are you shopping from today?') + ' ' + T('Our Deira store in Dubai is open now. Allo Madrid opens soon, and I can let you know the day it does.')); return () => stop(); } }, [phase]);
  useEffect(() => {
    if (phase === 'off') return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (phase === 'lang') setPhase('hello'); else bye(); } if (phase === 'walk' && e.key === 'ArrowRight') next(); if (phase === 'walk' && e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1)); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });

  if (phase === 'off') return offer ? (
    // owner (18 Nov night): a small, quick message (not a big Samsoom), with a countdown that closes it by itself
    <div className="tq-offer" role="status" aria-live="polite" onAnimationEnd={(e) => { if ((e.target as HTMLElement).classList.contains('tq-t')) setOffer(false); }}>
      <span className="tq-sam" aria-hidden="true"><LiveSam size={40} mood="idle" play="wave" /></span>
      <b>{T('Want a quick tour of this page?')}</b>
      <button type="button" className="tq-go" data-sound="next" onClick={() => { setOffer(false); walk(); }}>{T('Show me')}</button>
      <button type="button" className="tq-x" data-sound="skip" aria-label={T('Not now')} onClick={() => setOffer(false)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      <i className="tq-t" aria-hidden="true" />
    </div>
  ) : null;
  if (phase === 'lang') {
    const cr = CHOOSE_R(), [cl, ct] = cr[ci % cr.length], d = detect(), all = ranked(), list = d ? [all.find((x) => x.id === d)!, ...all.filter((x) => x.id !== d)] : all;
    const pick = (id: Lang) => { window.seI18n && window.seI18n.now(id); try { localStorage.setItem('se-lang', id); } catch { /* */ } setPhase(nextAfterLang()); };
    const hint = d || cl;
    return (
      <div className="st-veil st-veil-lang" role="dialog" aria-modal="true" aria-label="Choose your language" data-no-i18n="">
        <span className="st-cine" aria-hidden="true"><i /><i /><i /></span>
        <div className="st-lang2">
          <div className="st-l2-sam">
            <span className="st-l2-bubble" key={ci} lang={cl} dir={LANG_SET.has(cl) ? 'rtl' : 'ltr'}>{ct}</span>
            <span className="st-l2-spot" aria-hidden="true" />
            <span className="st-l2-av"><LiveSam size={150} mood="idle" play="wave" /><span className="st-l2-floor" aria-hidden="true" /></span>
          </div>
          <div className="st-l2-list">
            <LangPanel list={list} d={d} cl={cl} pick={pick} />
            <span className="st-l2-more" lang={hint} aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>{SCROLL[hint] || SCROLL.en}</span>
          </div>
        </div>
      </div>
    );
  }
  if (phase === 'store') return (
    <div className="st-veil" role="dialog" aria-modal="true" aria-label={T('Choose your store')}>
      <div className="st-hello st-store">
        <span className="st-sam" data-sam-talk=""><LiveSam size={96} mood="idle" play="happy" /></span>
        <b><Typed text={T('Where are you shopping from today?')} /></b>
        <p><Typed delay={Math.round(typeMs(T('Where are you shopping from today?') + ' '))} text={T('Our Deira store in Dubai is open now. Allo Madrid opens soon, and I can let you know the day it does.')} /></p>
        <StoreCards onPick={() => window.setTimeout(() => setPhase('hello'), 500)} />
      </div>
    </div>
  );
  if (phase === 'hello' || phase === 'bye' || phase === 'recall') {
    return (
      <div className="st-veil" role="dialog" aria-modal="true" aria-label={T('Welcome')} onClick={(e) => { if (e.target === e.currentTarget && phase !== 'bye') bye(1); }}>
        <div className={'st-hello' + (phase === 'bye' ? ' bye' : '')}>
          <span className="st-sam" data-sam-talk=""><LiveSam size={120} mood="idle" play={phase === 'bye' ? 'kiss' : phase === 'recall' ? 'happy' : cfg().welcome || 'kiss' /* owner (17 Nov): the welcome blows kisses with both hands */} /></span>
          {phase === 'hello' ? (
            <>
              <b><Typed text={T('Welcome to Sam Electronics!')} /></b>
              <p><Typed delay={Math.round(typeMs(T('Welcome to Sam Electronics!') + ' '))} text={cfg().greeting ? T(cfg().greeting!) : T('I’m Samsoom, your parts assistant. Want a quick walk around? It takes 20 seconds.')} /></p>
              <span className="st-acts">
                <button type="button" className="st-btn st-go" data-sound="next" onClick={walk}>{T('Show me around')}</button>
                <button type="button" className="st-btn st-grey" onClick={() => bye()}>{T('Skip')}</button>
              </span>
            </>
          ) : phase === 'recall' ? (
            <>
              <b>{T('You called me?')}</b>
              <p>{T('I’m here to help. What would you like?')}</p>
              {/* R12 (owner): one premium menu: a single yellow action, the rest as matching rows (no four colours) */}
              <span className="st-menu">
                <button type="button" className="st-btn st-go st-menu-main" onClick={walk}>{T('Show me this page')}</button>
                <button type="button" className="st-opt" onClick={() => { setPhase('off'); window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })); }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg><span>{T('Chat with me')}</span><i aria-hidden="true">›</i></button>
                <button type="button" className="st-opt st-opt-person" onClick={() => { setPhase('off'); window.dispatchEvent(new CustomEvent('se:person')); }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg><span>{T('Talk to a person')}</span><i aria-hidden="true">›</i></button>
                <button type="button" className="st-opt" onClick={() => setPhase('lang')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18" /></svg><span>{T('Change language')}</span><i aria-hidden="true">›</i></button>
                <button type="button" className="st-menu-close" onClick={() => bye()}>{T('Close')}</button>
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
  const vw = window.innerWidth, vh = window.innerHeight, rtl = document.documentElement.dir === 'rtl';
  const pad = 8, r = box, hole = r ? { left: r.left - pad, top: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2 } : null;
  // the bubble sits under the spot (or above it near the bottom), kept inside the screen with a 16px margin
  // R10 B3: the bubble (with Samsoom) goes to the FREE side of the spot: below, above, beside it (reading side first, flipped
  // in Arabic), never on top of it
  const bw = Math.min(360, vw - 32), BH = 230, G = pad + 16;
  let bx = (vw - bw) / 2, by = vh / 2 - 90;
  if (r) {
    const cx = Math.min(vw - bw - 16, Math.max(16, r.left + r.width / 2 - bw / 2)), cy = Math.min(vh - BH - 16, Math.max(16, r.top + r.height / 2 - BH / 2));
    const opts: [boolean, number, number][] = [
      [r.bottom + G + BH < vh, cx, r.bottom + G],
      [r.top - G - BH > 0, cx, r.top - G - BH],
      [rtl ? r.left - G - bw > 0 : r.right + G + bw < vw, rtl ? r.left - G - bw : r.right + G, cy],
      [rtl ? r.right + G + bw < vw : r.left - G - bw > 0, rtl ? r.right + G : r.left - G - bw, cy],
    ];
    const ok = opts.find((o) => o[0]) || opts[0]; bx = ok[1]; by = Math.max(16, Math.min(vh - BH - 16, ok[2]));
  }
  // he points at the spot: the arm angle comes from where the spot is, seen from him; if it is on his left he turns around
  const sx = rtl ? bx + bw - 50 : bx + 50, sy = by + 50, dx = r ? r.left + r.width / 2 - sx : 0, dy = r ? r.top + r.height / 2 - sy : -1, flip = dx < -20;
  const ang = Math.max(-172, Math.min(-35, (Math.atan2(-Math.abs(dx), dy) * 180) / Math.PI));
  return (
    <div className="st-walk" role="dialog" aria-modal="true" aria-label={T(s.t)}>
      {hole ? <span className="st-hole" style={hole} /> : <span className="st-dim" />}
      <div className="st-bub" style={{ left: bx, top: by, width: bw }}>
        <span className="st-tools"><button type="button" className="st-mute" data-no-sound="" aria-pressed={mute} title={mute ? T('Unmute Samsoom') : T('Mute Samsoom')} aria-label={mute ? T('Unmute Samsoom') : T('Mute Samsoom')} onClick={() => { setMuted(!mute); if (!mute) hush(); }}>{mute ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8M19.5 5.5a9 9 0 0 1 0 13" /></svg>}</button><button type="button" className="st-x" data-sound="skip" onClick={() => bye()}>{T('Skip')} <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button></span>
        <span className={'st-bsam' + (jump ? ' st-jump' : '')} data-sam-talk="" style={flip ? { transform: 'scaleX(-1)' } : undefined}><LiveSam size={58} pose={s.mood} pointA={Math.round(ang)} /></span>
        
        <span className="st-btx" key={i}>
          <small>{i + 1} / {steps.length}</small>
          <b><Typed text={T(s.t)} /></b>
          <span><Typed text={T(s.d)} delay={Math.round(typeMs(T(s.t) + '. '))} /></span>
        </span>
        <span className="st-bacts">
          <button type="button" className="st-btn st-grey" data-sound="back" disabled={i === 0} onClick={() => setI(Math.max(0, i - 1))}>{T('Back')}</button>
          <button type="button" className="st-btn st-dark" data-no-sound="" onClick={next}>{i === steps.length - 1 ? T('Done') : T('Next')}</button>
        </span>
      </div>
    </div>
  );
}

/** R10 B1: the language list follows the bubble (smoothly scrolls the language being shown into the middle) until the
 *  visitor touches the list; soft fades at the top and bottom. */
// owner (15 Nov, "something is missing"): the list gets a real header (title in the visitor's detected language + English)
// and a filter box, so 12+ languages are one keystroke away instead of a long scroll.
function LangPanel({ list, d, cl, pick }: { list: { id: Lang; name: string; en: string }[]; d: Lang | null; cl: Lang; pick: (id: Lang) => void }) {
  const [q, setQ] = useState('');
  const k = q.trim().toLowerCase(), shown = k ? list.filter((l) => l.name.toLowerCase().includes(k) || l.en.toLowerCase().includes(k) || l.id.startsWith(k)) : list;
  return (
    <>
      <div className="st-l2-head">
        <b>Choose your language</b>
        <label className="st-l2-q"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a language" aria-label="Filter languages" /></label>
      </div>
      {shown.length ? <LangScroll list={shown} d={d} cl={k ? shown[0].id : cl} pick={pick} /> : <p className="st-l2-none">No match. Try English or العربية.</p>}
    </>
  );
}
function LangScroll({ list, d, cl, pick }: { list: { id: Lang; name: string; en: string }[]; d: Lang | null; cl: Lang; pick: (id: Lang) => void }) {
  const ref = React.useRef<HTMLDivElement>(null), touched = React.useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el || touched.current) return;
    const b = el.querySelector<HTMLElement>(`[data-l="${cl}"]`); if (!b) return;
    const top = 0; // owner (15 Nov): the list stays at the top (the detected language first); the cycling highlight never scrolls it
    el.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [cl, d]);
  const stop = () => { touched.current = true; };
  return (
    <div ref={ref} className="st-l2-scroll" onWheel={stop} onTouchStart={stop} onMouseDown={stop} onKeyDown={stop}
      onScroll={(e) => { const el = e.currentTarget, p = el.parentElement!; p.classList.toggle('end', el.scrollTop + el.clientHeight >= el.scrollHeight - 6); p.classList.toggle('top', el.scrollTop > 4); }}>
      {list.map((l) => (
        <button key={l.id} data-l={l.id} type="button" lang={l.id} className={'st-l2-i' + (l.id === d ? ' det' : '') + (l.id === cl ? ' hint' : '')} onClick={() => pick(l.id)}>
          <b dir="auto">{l.name}</b>
          <small>{l.id === d ? (DETECTED[l.id] || DETECTED.en) + ' · ' : ''}{langLabel(l.id, ((typeof window !== 'undefined' && window.seI18n && window.seI18n.lang()) || d || 'en') as Lang)}</small>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      ))}
    </div>
  );
}
