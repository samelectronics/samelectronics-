'use client';
/**
 * The EN / Arabic switch (G9).
 *
 * - The choice is stored in localStorage ('se-lang') and applied before the page paints (inline script in
 *   the layout sets <html lang dir>), so there is no flash of the other language.
 * - In Arabic, a DOM translator replaces every text node and the placeholder/title/aria-label/alt
 *   attributes with the Arabic from src/i18n/ar.ts, and keeps doing so as React updates the page
 *   (clocks, reels, chat). Switching back restores the original English exactly.
 * - Canvas engines and the map iframe use window.seI18n.t(text) and listen for the 'se:lang' event.
 */
import { isolateNumbers } from './isolate';
// R10: the Arabic translator (and its big dictionary) is its own file: fetched at once for Arabic visitors, otherwise
// preloaded in the background with Spanish and French once the page is idle. The other 20 languages load when picked.
let TR: ((s: string) => string) | null = null;
let arP: Promise<void> | null = null;
const loadAr = () => (arP = arP || import('./translate').then((m) => { TR = m.tr; }));
import { LANG_KEY } from './prepaint';
import { hasDict, loadDict, trOther, type Other } from './multi';

export type Lang = 'en' | 'ar' | 'es' | 'fr' | 'fa' | 'ru' | 'hi' | 'ur' | 'tl' | 'ml' | 'ca' | 'de' | 'it' | 'pt' | 'ro' | 'zh' | 'gl' | 'eu' | 'sw' | 'am' | 'ha' | 'yo' | 'om' | 'ig';
/** R9: twenty-four languages, in menu order: English and Arabic first (the shop's own two), then the rest A to Z by their
 *  English name. Arabic, Persian and Urdu read right to left. English and Arabic are built in; Spanish and French are
 *  fetched quietly once the page has loaded; every other language is fetched only when it is picked. */
/** R10 B1/B7: menu order by how likely our buyers speak them (the detected one is pinned on top where it applies). */
export const RANK: Lang[] = ['en', 'ar', 'es', 'fr', 'ru', 'hi', 'ur', 'fa', 'zh', 'pt', 'de', 'it', 'tl', 'ml', 'sw', 'am', 'ha', 'ro', 'yo', 'ig', 'om', 'ca', 'gl', 'eu'];
export const LANGS: { id: Lang; name: string; en: string }[] = [
  { id: 'en', name: 'English', en: 'English' },
  { id: 'ar', name: 'العربية', en: 'Arabic' },
  { id: 'am', name: 'አማርኛ', en: 'Amharic' },
  { id: 'eu', name: 'Euskara', en: 'Basque' },
  { id: 'ca', name: 'Català', en: 'Catalan' },
  { id: 'zh', name: '中文', en: 'Chinese' },
  { id: 'tl', name: 'Tagalog', en: 'Filipino' },
  { id: 'fr', name: 'Français', en: 'French' },
  { id: 'gl', name: 'Galego', en: 'Galician' },
  { id: 'de', name: 'Deutsch', en: 'German' },
  { id: 'ha', name: 'Hausa', en: 'Hausa' },
  { id: 'hi', name: 'हिन्दी', en: 'Hindi' },
  { id: 'ig', name: 'Igbo', en: 'Igbo' },
  { id: 'it', name: 'Italiano', en: 'Italian' },
  { id: 'ml', name: 'മലയാളം', en: 'Malayalam' },
  { id: 'om', name: 'Afaan Oromoo', en: 'Oromo' },
  { id: 'fa', name: 'فارسی', en: 'Persian' },
  { id: 'pt', name: 'Português', en: 'Portuguese' },
  { id: 'ro', name: 'Română', en: 'Romanian' },
  { id: 'ru', name: 'Русский', en: 'Russian' },
  { id: 'es', name: 'Español', en: 'Spanish' },
  { id: 'sw', name: 'Kiswahili', en: 'Swahili' },
  { id: 'ur', name: 'اردو', en: 'Urdu' },
  { id: 'yo', name: 'Yorùbá', en: 'Yoruba' },
];
export const isRtl = (l: string) => l === 'ar' || l === 'fa' || l === 'ur';
const valid = (l: unknown): l is Lang => typeof l === 'string' && LANGS.some((x) => x.id === l);
/** The current language's translation of one English text. */
const trRaw = (en: string) => (lang === 'en' ? en : lang === 'ar' ? (TR ? TR(en) : en) : trOther(lang as Other, en));
// R10: remember every translation handed out, so text a component rendered already translated (T() during render)
// can still be switched back to its English when the visitor changes language
const REV = new Map<string, string>();
const trCur = (en: string) => { const out = trRaw(en); if (out !== en && REV.size < 20000) REV.set(out, en); return out; };
const KEY = LANG_KEY;
const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'] as const;
/** Subtrees never translated: brand wordmarks, code, inputs the visitor types into. */
const SKIP_SEL = '[data-no-i18n], [data-sc-name="SE Brand Logo"], script, style, noscript, textarea, code';

type Orig = { en: string; out: string };
const textOrig = new WeakMap<Text, Orig>();
const attrOrig = new WeakMap<Element, Map<string, Orig>>();
let lang: Lang = 'en';
let observer: MutationObserver | null = null;

export function getLang(): Lang {
  return lang;
}

function skip(node: Node): boolean {
  const el = node.nodeType === 1 ? (node as Element) : node.parentElement;
  return !el || !!el.closest(SKIP_SEL);
}

function doText(n: Text) {
  if (skip(n)) return;
  const cur = n.data;
  const o = textOrig.get(n);
  // React (or a logic class) changed the text since we translated it: that new text is the English.
  const en = o && cur === o.out ? o.en : REV.get(cur) ?? REV.get(cur.replace(/[\u2066\u2069]/g, '')) ?? cur;
  const out = lang === 'en' ? en : isRtl(lang) ? isolateNumbers(trCur(en)) : trCur(en);
  if (out !== cur) n.data = out;
  if (lang !== 'en') textOrig.set(n, { en, out });
  else textOrig.delete(n);
}

function doAttrs(el: Element) {
  if (el.closest(SKIP_SEL)) return;
  let m = attrOrig.get(el);
  for (const a of ATTRS) {
    const cur = el.getAttribute(a);
    if (cur == null) continue;
    const o = m?.get(a);
    const en = o && cur === o.out ? o.en : REV.get(cur) ?? cur;
    const out = trCur(en);
    if (out !== cur) el.setAttribute(a, out);
    if (lang !== 'en') {
      if (!m) attrOrig.set(el, (m = new Map()));
      m.set(a, { en, out });
    } else m?.delete(a);
  }
}

function walk(root: Node) {
  if (root.nodeType === 3) return doText(root as Text);
  if (root.nodeType !== 1 && root.nodeType !== 11) return;
  if (root.nodeType === 1) {
    if ((root as Element).closest(SKIP_SEL)) return;
    doAttrs(root as Element);
  }
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => (n.nodeType === 1 && (n as Element).matches(SKIP_SEL) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  let n = w.nextNode();
  while (n) {
    if (n.nodeType === 3) doText(n as Text);
    else doAttrs(n as Element);
    n = w.nextNode();
  }
}

function startObserver() {
  if (observer) return;
  observer = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'characterData') doText(m.target as Text);
      else if (m.type === 'attributes') doAttrs(m.target as Element);
      else m.addedNodes.forEach(walk);
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] });
}

function applyDocument() {
  const h = document.documentElement;
  h.lang = lang;
  h.dir = isRtl(lang) ? 'rtl' : 'ltr';
}

/** Urgent · Plex for Arabic must be loaded before canvases (teardown ads, globes) draw Arabic, or they fall back to a
 *  stock font: load the Arabic faces of every family the site uses, then tell the canvases to redraw. */
export function loadArabicFonts() {
  if (typeof document === 'undefined' || !document.fonts) return;
  const fams = ['Space Grotesk', 'Inter', 'JetBrains Mono', 'Arabic UI'], ws = ['400', '500', '600', '700'];
  Promise.all(fams.flatMap((f) => ws.map((w) => document.fonts.load(`${w} 16px "${f}"`, 'بحث')))).then(() => window.dispatchEvent(new CustomEvent('se:fonts'))).catch(() => {});
}

/** Switch the whole site's language and remember it. */
export function setLang(next: Lang) {
  if (next === lang || !valid(next)) return;
  // Spanish, French and Persian load their dictionary first, then switch (a few kB, once)
  if (next === 'ar' && !TR) {
    window.dispatchEvent(new CustomEvent('se:lang-loading', { detail: next }));
    loadAr().then(() => { window.dispatchEvent(new CustomEvent('se:lang-loading', { detail: null })); apply(next); }).catch(() => window.dispatchEvent(new CustomEvent('se:lang-loading', { detail: null })));
    return;
  }
  if (next !== 'en' && next !== 'ar') {
    // R9: languages not yet on this device show "Switching language…" while their words arrive
    if (!hasDict(next as Other)) window.dispatchEvent(new CustomEvent('se:lang-loading', { detail: next }));
    loadDict(next as Other).then(() => { window.dispatchEvent(new CustomEvent('se:lang-loading', { detail: null })); apply(next); }).catch(() => window.dispatchEvent(new CustomEvent('se:lang-loading', { detail: null })));
    return;
  }
  apply(next);
}
function apply(next: Lang) {
  const prev = lang;
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode */
  }
  applyDocument();
  if (next !== 'en') startObserver();
  if (isRtl(next)) loadArabicFonts();
  // from one translation to another: back to the English first, so every node is re-translated from its source text
  if (prev !== 'en' && next !== 'en') { lang = 'en'; walk(document.body); lang = next; }
  walk(document.body);
  if (next === 'en' && observer) {
    observer.disconnect();
    observer = null;
  }
  window.dispatchEvent(new CustomEvent('se:lang', { detail: next }));
}

/** Translate a string for the current language (used by canvas engines, the map, logic classes). */
export function t(en: string): string {
  return trCur(en);
}

declare global {
  interface Window {
    seI18n?: { lang: () => Lang; rtl: () => boolean; t: (s: string) => string; tr: (s: string) => string; set: (l: Lang) => void; now: (l: Lang) => void; toggle: () => void };
  }
}

/** Install once on the client, as early as possible (before the home page renders). */
export function installI18n() {
  if (typeof window === 'undefined' || window.seI18n) return;
  let saved: Lang = 'en';
  try {
    const v = localStorage.getItem(KEY);
    saved = valid(v) ? v : 'en';
  } catch {
    /* ignore */
  }
  lang = saved;
  applyDocument();
  // 14 Oct §03: switching from the site goes through the "Mission accomplished" pop-up (src/components/home/LangPop.tsx);
  // it calls setLang itself once its card is up. Without the pop-up mounted, switch directly.
  const sw = (l: Lang) => {
    if (l === lang) return;
    if ((window as unknown as { __seLangPop?: boolean }).__seLangPop) window.dispatchEvent(new CustomEvent('se:lang-pop', { detail: l }));
    else setLang(l);
  };
  window.seI18n = { lang: () => lang, rtl: () => isRtl(lang), t, tr: t, set: sw, now: setLang, toggle: () => sw(lang === 'en' ? 'ar' : 'en') };
  patchCanvasText();
  if (isRtl(lang)) loadArabicFonts();
  // R9: Spanish and French are ready before anyone asks (fetched once the page is idle); the rest load when picked
  const pre = () => { loadAr().catch(() => {}); (['es', 'fr'] as Other[]).forEach((l) => { loadDict(l).catch(() => {}); }); };
  if (document.readyState === 'complete') setTimeout(pre, 2500); else window.addEventListener('load', () => setTimeout(pre, 2500), { once: true });
  if (lang === 'ar') {
    loadAr().then(() => { if (lang !== 'ar') return; startObserver(); if (document.body) walk(document.body); window.dispatchEvent(new CustomEvent('se:lang', { detail: 'ar' })); });
  } else if (lang !== 'en') {
    const l = lang;
    loadDict(l as Other).then(() => { if (lang !== l) return; startObserver(); if (document.body) walk(document.body); window.dispatchEvent(new CustomEvent('se:lang', { detail: l })); });
  }
}

/** Text drawn on canvases (ads, labels) goes through the same dictionary while Arabic is on. */
function patchCanvasText() {
  const P = CanvasRenderingContext2D.prototype as any;
  if (P.__seI18n) return;
  P.__seI18n = true;
  for (const fn of ['fillText', 'strokeText', 'measureText'] as const) {
    const orig = P[fn];
    P[fn] = function (text: unknown, ...rest: unknown[]) {
      return orig.call(this, lang !== 'en' && typeof text === 'string' ? trCur(text) : text, ...rest);
    };
  }
}
