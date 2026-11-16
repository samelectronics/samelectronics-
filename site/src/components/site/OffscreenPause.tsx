'use client';
// Owner (16 Nov): "my simple website is lagging". Every looping CSS animation in a section that is off screen is paused
// (the browser stops repainting it); it carries on the moment the section comes back into view.
import { useEffect } from 'react';

export default function OffscreenPause() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { const el = e.target as HTMLElement; if (e.isIntersecting) el.removeAttribute('data-off'); else el.setAttribute('data-off', ''); }), { rootMargin: '200px 0px' });
    const seen = new WeakSet<Element>();
    const scan = () => document.querySelectorAll('main section, body > div section, footer, .iad2, .ad').forEach((el) => { if (!seen.has(el) && !el.parentElement?.closest('section')) { seen.add(el); io.observe(el); } });
    scan(); let tm = 0; const mo = new MutationObserver(() => { if (!tm) tm = window.setTimeout(() => { tm = 0; scan(); }, 800); }); mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); window.clearTimeout(tm); };
  }, []);
  return null;
}
