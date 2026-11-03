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
import { LANGS, RANK, type Lang } from '@/i18n/lang';
import { siteRaw } from '@/lib/catalog';
// Control Room → Site & Samsoom: tour on/off, welcome message and emote
const cfg = () => siteRaw<{ tour?: boolean; greeting?: string; welcome?: string }>('samsoom', {});

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
type Step = { sel?: string; el?: HTMLElement; mood: string; t: string; d: string; open?: string };
const NAV: Step[] = [
  { sel: '[data-tour="fmp"]', mood: 'pt-smile', t: 'Find My Part', d: 'Pick a brand, a model and a part: every grade we have, in seconds.' },
  { sel: '[data-tour="nav"]', mood: 'pt-happy', t: 'Jump anywhere', d: 'The shop, repairs, trade prices and how to reach us.' },
  { sel: '.se-lm', mood: 'pt-blush', t: 'Your language', d: 'Pick your language and the whole site follows.', open: '.se-lm-btn' },
  { sel: '[data-tour="hours"]', mood: 'pt-wink', t: 'Open right now?', d: 'Live opening hours, in Dubai time.' },
  { sel: '[data-tour="cart"]', mood: 'pt-smile', t: 'Your cart', d: 'Add parts as you browse; we confirm stock and price on WhatsApp.' },
  { sel: '[data-tour="menu"]', mood: 'pt-think', t: 'The whole site', d: 'Every page and section, in one menu.' },
];
const END: Step[] = [
  { sel: '[data-tour="help"]', mood: 'pt-blush', t: 'Need me again?', d: 'Tap the ? at the top, on any page, and I will show you around.' },
  { sel: '[data-tour="samsoom"]', mood: 'pt-wow', t: 'And me!', d: 'Ask me about any part, grade or delivery, any time. I am always here.' },
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
  const nav = (home ? NAV : NAV.filter((s) => s.sel === '[data-tour="fmp"]' || s.sel === '[data-tour="cart"]')).filter((s) => visible(document.querySelector(s.sel!)) && (s.sel !== '[data-tour="nav"]' || !!document.querySelector('[data-tour="nav"] > a')));
  const end = END.filter((s) => visible(document.querySelector(s.sel!)));
  return home ? [...nav, ...page, ...end] : [...page, ...nav, ...end];
}

export default function SamsoomTour() {
  const [phase, setPhase] = useState<'off' | 'lang' | 'hello' | 'recall' | 'walk' | 'bye'>('off'), [i, setI] = useState(0), [box, setBox] = useState<DOMRect | null>(null);
  const [offer, setOffer] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]), [ci, setCi] = useState(0), [, force] = useReducer((n: number) => n + 1, 0);
  const done = () => { try { localStorage.setItem('se-tour2', '1'); } catch { /* private mode */ } };
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
        if (Date.now() - t >= 900) { window.clearInterval(iv); setPhase(chose ? 'hello' : 'lang'); }
      }, 250);
    }
    // on a page someone opens for the first time (after the first welcome), he offers a tour of that page once
    let ot = 0;
    if (seen && location.pathname !== '/' && !location.pathname.startsWith('/staff')) {
      const k = 'se-pt:' + location.pathname; let had = true; try { had = !!localStorage.getItem(k); localStorage.setItem(k, '1'); } catch { /* */ }
      if (!had) ot = window.setTimeout(() => { if (!document.querySelector('.sc2-banner, .sc2-veil, .st-veil')) setOffer(true); }, 3500);
    }
    (window as unknown as { seWalk?: () => void }).seWalk = () => { setOffer(false); walk(); };
    return () => { window.clearInterval(iv); window.clearTimeout(ot); window.removeEventListener('se:help', help); };
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

  const next = () => { if (i >= steps.length - 1) bye(3200); else setI(i + 1); };
  useEffect(() => {
    if (phase === 'off') return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (phase === 'lang') setPhase('hello'); else bye(); } if (phase === 'walk' && e.key === 'ArrowRight') next(); if (phase === 'walk' && e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1)); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });

  if (phase === 'off') return offer ? (
    <div className="st-offer" role="dialog" aria-label={T('Want a tour of this page?')}>
      <b>{T('Want a tour of this page?')}</b>
      <button type="button" className="st-btn st-go" data-sound="next" onClick={() => { setOffer(false); walk(); }}>{T('Yes')}</button>
      <button type="button" className="st-x" data-sound="skip" onClick={() => setOffer(false)} aria-label={T('Not now')}>✕</button>
    </div>
  ) : null;
  if (phase === 'lang') {
    const cr = CHOOSE_R(), [cl, ct] = cr[ci % cr.length], d = detect(), all = ranked(), list = d ? [all.find((x) => x.id === d)!, ...all.filter((x) => x.id !== d)] : all;
    const pick = (id: Lang) => { window.seI18n && window.seI18n.now(id); try { localStorage.setItem('se-lang', id); } catch { /* */ } setPhase('hello'); };
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
            <LangScroll list={list} d={d} cl={cl} pick={pick} />
            <span className="st-l2-more" lang={hint} aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>{SCROLL[hint] || SCROLL.en}</span>
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
                <button type="button" className="st-btn st-go" data-sound="next" onClick={walk}>{T('Show me around')}</button>
                <button type="button" className="st-btn st-grey" onClick={() => bye()}>{T('Skip')}</button>
              </span>
            </>
          ) : phase === 'recall' ? (
            <>
              <b>{T('You called me?')}</b>
              <p>{T('I’m here to help. What would you like?')}</p>
              <span className="st-acts st-acts4">
                <button type="button" className="st-btn st-go" onClick={walk}>{T('Show me this page')}</button>
                <button type="button" className="st-btn st-dark" onClick={() => { setPhase('off'); window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })); }}>{T('Chat with me')}</button>
                <button type="button" className="st-btn st-dark" onClick={() => setPhase('lang')}>{T('Change language')}</button>
                <button type="button" className="st-btn st-grey" onClick={() => bye()}>{T('Close')}</button>
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
        <button type="button" className="st-x" data-sound="skip" onClick={() => bye()}>{T('Skip')} <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
        <span className="st-bsam" style={flip ? { transform: 'scaleX(-1)' } : undefined}><LiveSam size={58} pose={s.mood} pointA={Math.round(ang)} /></span>
        <span className="st-btx" key={i}>
          <small>{i + 1} / {steps.length}</small>
          <b>{T(s.t)}</b>
          <span>{T(s.d)}</span>
        </span>
        <span className="st-bacts">
          <button type="button" className="st-btn st-grey" data-sound="back" disabled={i === 0} onClick={() => setI(Math.max(0, i - 1))}>{T('Back')}</button>
          <button type="button" className="st-btn st-dark" data-sound="next" onClick={next}>{i === steps.length - 1 ? T('Done') : T('Next')}</button>
        </span>
      </div>
    </div>
  );
}

/** R10 B1: the language list follows the bubble (smoothly scrolls the language being shown into the middle) until the
 *  visitor touches the list; soft fades at the top and bottom. */
function LangScroll({ list, d, cl, pick }: { list: { id: Lang; name: string; en: string }[]; d: Lang | null; cl: Lang; pick: (id: Lang) => void }) {
  const ref = React.useRef<HTMLDivElement>(null), touched = React.useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el || touched.current) return;
    const b = el.querySelector<HTMLElement>(`[data-l="${cl}"]`); if (!b) return;
    const top = cl === d ? 0 : b.offsetTop - el.clientHeight / 2 + b.offsetHeight / 2;
    el.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, [cl, d]);
  const stop = () => { touched.current = true; };
  return (
    <div ref={ref} className="st-l2-scroll" onWheel={stop} onTouchStart={stop} onMouseDown={stop} onKeyDown={stop}
      onScroll={(e) => { const el = e.currentTarget, p = el.parentElement!; p.classList.toggle('end', el.scrollTop + el.clientHeight >= el.scrollHeight - 6); p.classList.toggle('top', el.scrollTop > 4); }}>
      {list.map((l) => (
        <button key={l.id} data-l={l.id} type="button" lang={l.id} className={'st-l2-i' + (l.id === d ? ' det' : '') + (l.id === cl ? ' hint' : '')} onClick={() => pick(l.id)}>
          <b dir="auto">{l.name}</b>
          <small>{l.id === d ? (DETECTED[l.id] || DETECTED.en) + ' · ' : ''}{l.en}</small>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      ))}
    </div>
  );
}
