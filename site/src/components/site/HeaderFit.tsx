'use client';
// Owner (R10): "some languages use such long phrases… that is not allowed to happen". The bar never overflows in any
// language: when the words don't fit, it tightens step by step (smaller status text → tighter links → the status pill
// keeps only its dot, the hours still show on hover → Find My Part keeps only its icon) until everything fits.
import { useEffect } from 'react';

const STEPS = ['hf1', 'hf2', 'hf3', 'hf4'];
export default function HeaderFit() {
  useEffect(() => {
    let raf = 0;
    const over = () => { const row = document.querySelector<HTMLElement>('header .se-nav-row'); if (!row) return false; const r = row.querySelector<HTMLElement>('.se-nav-right'); const last = r && Array.from(r.children).filter((c) => (c as HTMLElement).offsetWidth > 0).pop() as HTMLElement | undefined; const edge = last ? last.getBoundingClientRect().right : 0; return row.scrollWidth > row.clientWidth + 1 || edge > window.innerWidth - 8; };
    const fit = () => {
      raf = 0; const h = document.documentElement; STEPS.forEach((c) => h.classList.remove(c));
      for (const c of STEPS) { if (!over()) break; h.classList.add(c); }
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(fit); };
    ask(); const t1 = window.setTimeout(ask, 600), t2 = window.setTimeout(ask, 2000);
    window.addEventListener('resize', ask); window.addEventListener('se:lang', ask); document.fonts?.addEventListener?.('loadingdone', ask);
    const mo = new MutationObserver(ask); const hd = document.querySelector('header'); if (hd) mo.observe(hd, { childList: true, subtree: true, characterData: true });
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', ask); window.removeEventListener('se:lang', ask); mo.disconnect(); };
  }, []);
  return null;
}
