'use client';
// Owner (R10): "make sure the mouse effect making the glow appear in the background, faded, always works everywhere like
// home hero". One soft light follows the cursor over whichever section (or the footer) it is on, on every page. It sits
// behind the section's content (never over text), only shows while the mouse is actually over that section, and fades
// out when it leaves, so no glow ever sits parked in a corner. Yellow light on graphite and white sections, a white
// light on yellow sections. The hero keeps its own glow. Touch screens have no cursor, so nothing runs there.
import { useEffect } from 'react';

const isYellow = (c: string) => { const m = c.match(/\d+(\.\d+)?/g); if (!m) return false; const [r, g, b, a] = m.map(Number); return (a === undefined || a > 0.5) && r > 200 && g > 140 && b < 120; };

export default function MouseGlow() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;
    let cur: HTMLElement | null = null, raf = 0, px = 0, py = 0;
    const own = (sec: HTMLElement) => sec.id === 'top' || !!sec.querySelector(':scope [data-hero-glow]');
    const ensure = (sec: HTMLElement) => {
      let g = sec.querySelector<HTMLElement>(':scope > .se-mglow');
      if (g) return g;
      const cs = getComputedStyle(sec);
      if (cs.position === 'static') sec.style.position = 'relative';
      sec.style.isolation = 'isolate';
      g = document.createElement('div'); g.className = 'se-mglow'; g.setAttribute('aria-hidden', 'true'); g.appendChild(document.createElement('i'));
      if (isYellow(cs.backgroundColor) || sec.dataset.tone === 'yellow') g.dataset.y = '1';
      sec.prepend(g); return g;
    };
    const place = () => { raf = 0; if (!cur) return; const r = cur.getBoundingClientRect(); cur.style.setProperty('--mgx', Math.round(px - r.left) + 'px'); cur.style.setProperty('--mgy', Math.round(py - r.top) + 'px'); };
    const off = () => { if (cur) cur.classList.remove('se-mg-on'); cur = null; };
    const move = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      px = e.clientX; py = e.clientY;
      const t = e.target as Element | null, sec = (t && t.closest ? (t.closest('section, footer') as HTMLElement | null) : null);
      if (sec !== cur) { off(); if (!sec || own(sec)) return; ensure(sec); place(); cur = sec; place(); requestAnimationFrame(() => sec.classList.add('se-mg-on')); }
      if (!raf) raf = requestAnimationFrame(place);
    };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) off(); };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('mouseout', out);
    window.addEventListener('blur', off);
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('mouseout', out); window.removeEventListener('blur', off); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
