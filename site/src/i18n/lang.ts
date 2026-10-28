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
import { isolateNumbers, tr } from './translate';
import { LANG_KEY } from './prepaint';
import { loadDict, trOther, type Other } from './multi';

export type Lang = 'en' | 'ar' | 'es' | 'fr' | 'fa' | 'ru' | 'hi' | 'ur';
/** R8: the eight site languages, in menu order: English and Arabic first (the shop's own two), then the rest A to Z by
 *  their English name. Arabic, Persian and Urdu read right to left. */
export const LANGS: { id: Lang; name: string; en: string }[] = [
  { id: 'en', name: 'English', en: 'English' },
  { id: 'ar', name: 'العربية', en: 'Arabic' },
  { id: 'fr', name: 'Français', en: 'French' },
  { id: 'hi', name: 'हिन्दी', en: 'Hindi' },
  { id: 'fa', name: 'فارسی', en: 'Persian' },
  { id: 'ru', name: 'Русский', en: 'Russian' },
  { id: 'es', name: 'Español', en: 'Spanish' },
  { id: 'ur', name: 'اردو', en: 'Urdu' },
];
export const isRtl = (l: string) => l === 'ar' || l === 'fa' || l === 'ur';
const valid = (l: unknown): l is Lang => typeof l === 'string' && LANGS.some((x) => x.id === l);
/** The current language's translation of one English text. */
const trCur = (en: string) => (lang === 'en' ? en : lang === 'ar' ? tr(en) : trOther(lang as Other, en));
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
  const en = o && cur === o.out ? o.en : cur;
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
    const en = o && cur === o.out ? o.en : cur;
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
  if (next !== 'en' && next !== 'ar') { loadDict(next).then(() => apply(next)); return; }
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
  if (lang === 'ar') {
    startObserver();
    if (document.body) walk(document.body);
  } else if (lang !== 'en') {
    const l = lang;
    loadDict(l).then(() => { if (lang !== l) return; startObserver(); if (document.body) walk(document.body); window.dispatchEvent(new CustomEvent('se:lang', { detail: l })); });
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
