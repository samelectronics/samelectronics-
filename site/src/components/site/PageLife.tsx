'use client';
// R11 (owner): the detail pages get the home page's materials. Every section gets the same quiet texture as on home
// (graphite: diamond plate + drifting yellow LED glow + grain; light: brushed grain + soft studio light; yellow: scan lines),
// a shine that follows the pointer, and the moving glow line on its top edge. Styles: dc-base.css (.se-tex) + cine.css.
import { useEffect } from 'react';

export default function PageLife() {
  useEffect(() => {
    if (location.pathname === '/' || location.pathname.startsWith('/staff')) return;
    const done = new WeakSet<Element>();
    const run = () => {
      document.querySelectorAll<HTMLElement>('#dc-root .sp-sec, #dc-root main > section').forEach((sec, k) => {
        if (done.has(sec) || sec.classList.contains('sp-cine') || sec.closest('.sp-cine')) return; done.add(sec);
        const t = sec.classList.contains('d') || sec.dataset.tone === 'dark' ? 'dark' : sec.classList.contains('y') ? 'yel' : 'light';
        if (!sec.querySelector(':scope > .se-tex')) {
          const d = document.createElement('div'); d.className = 'se-tex se-tex-' + t + (k % 2 ? ' r' : ''); d.setAttribute('aria-hidden', 'true');
          d.innerHTML = t === 'dark' ? '<i class="pl"></i><i class="st"></i><i class="led"></i><i class="gr"></i><i class="sh"></i>' : '<i class="gr"></i><i class="lt"></i><i class="sh"></i>';
          if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
          sec.style.isolation = 'isolate'; sec.prepend(d);
        }
        if (!sec.querySelector(':scope > .se-edge')) { const e = document.createElement('i'); e.className = 'se-edge'; e.setAttribute('aria-hidden', 'true'); e.style.setProperty('--ed', (-(k * 1.7) % 7).toFixed(1) + 's'); sec.prepend(e); }
      });
    };
    run(); let n = 0; const iv = window.setInterval(() => { run(); if (++n > 12) window.clearInterval(iv); }, 1000);
    let pend: PointerEvent | null = null, rq = 0, cur: HTMLElement | null = null;
    const mv = (e: PointerEvent) => { pend = e; if (rq) return; rq = requestAnimationFrame(() => { rq = 0; const ev = pend; if (!ev) return; const sec = (ev.target as Element | null)?.closest?.('.sp-sec, main > section') as HTMLElement | null, tex = sec?.querySelector(':scope > .se-tex') as HTMLElement | null;
      if (cur && cur !== tex) cur.classList.remove('lit'); cur = tex; if (!tex || !sec) return; const b = sec.getBoundingClientRect(); tex.style.setProperty('--mx', (ev.clientX - b.left).toFixed(0) + 'px'); tex.style.setProperty('--my', (ev.clientY - b.top).toFixed(0) + 'px'); tex.classList.add('lit'); }); };
    window.addEventListener('pointermove', mv, { passive: true });
    return () => { window.clearInterval(iv); window.removeEventListener('pointermove', mv); cancelAnimationFrame(rq); };
  }, []);
  return null;
}
