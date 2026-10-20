'use client';
// R6 §01 · the browser tab: "Sam Electronics - <page>" in the visitor's language. While the visitor is on another tab it
// reads "Sam Electronics - Your part is waiting" and the favicon's ring dims; both come back when they return.
import { useEffect } from 'react';

const NAME = { en: 'Sam Electronics', ar: 'سام للإلكترونيات' };
const WAIT = { en: 'Your part is waiting', ar: 'قطعتك بانتظارك' };

export default function TabTitle({ page, ar }: { page: string; ar: string }) {
  useEffect(() => {
    let cur: 'en' | 'ar' = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const set = (e?: Event) => { const d = e && (e as CustomEvent).detail; if (d === 'ar' || d === 'en') cur = d; else { const L = window.seI18n && window.seI18n.lang(); if (L) cur = L; } const l = cur; document.title = NAME[l] + ' - ' + (document.hidden ? WAIT[l] : l === 'ar' ? ar : page); };
    const icons = () => [...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')];
    const dim = () => icons().forEach((l) => { if (!l.dataset.on) l.dataset.on = l.href; l.href = document.hidden ? '/favicon-dim-32.png' : l.dataset.on; });
    const vis = () => { set(); dim(); };
    set(); const t0 = window.setTimeout(() => set(), 600); // after the language layer is up
    document.addEventListener('visibilitychange', vis);
    window.addEventListener('se:lang', set);
    return () => { window.clearTimeout(t0); document.removeEventListener('visibilitychange', vis); window.removeEventListener('se:lang', set); };
  }, [page, ar]);
  return null;
}
