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

export type Lang = 'en' | 'ar';
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
  const out = lang === 'ar' ? isolateNumbers(tr(en)) : en;
  if (out !== cur) n.data = out;
  if (lang === 'ar') textOrig.set(n, { en, out });
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
    const out = lang === 'ar' ? tr(en) : en;
    if (out !== cur) el.setAttribute(a, out);
    if (lang === 'ar') {
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
  h.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

/** Switch the whole site's language and remember it. */
export function setLang(next: Lang) {
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode */
  }
  applyDocument();
  if (next === 'ar') startObserver();
  walk(document.body);
  if (next === 'en' && observer) {
    observer.disconnect();
    observer = null;
  }
  window.dispatchEvent(new CustomEvent('se:lang', { detail: next }));
}

/** Translate a string for the current language (used by canvas engines, the map, logic classes). */
export function t(en: string): string {
  return lang === 'ar' ? tr(en) : en;
}

declare global {
  interface Window {
    seI18n?: { lang: () => Lang; t: (s: string) => string; tr: (s: string) => string; set: (l: Lang) => void; now: (l: Lang) => void; toggle: () => void };
  }
}

/** Install once on the client, as early as possible (before the home page renders). */
export function installI18n() {
  if (typeof window === 'undefined' || window.seI18n) return;
  let saved: Lang = 'en';
  try {
    saved = localStorage.getItem(KEY) === 'ar' ? 'ar' : 'en';
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
  window.seI18n = { lang: () => lang, t, tr, set: sw, now: setLang, toggle: () => sw(lang === 'ar' ? 'en' : 'ar') };
  patchCanvasText();
  if (lang === 'ar') {
    startObserver();
    if (document.body) walk(document.body);
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
      return orig.call(this, lang === 'ar' && typeof text === 'string' ? tr(text) : text, ...rest);
    };
  }
}
