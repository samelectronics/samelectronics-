'use client';
import { useEffect } from 'react';

/**
 * G19: horizontal lists get small left/right arrow buttons in our style. Any element with
 * `data-hscroll` is enhanced: two round graphite buttons appear at its ends (only when there is more
 * to scroll that way), glow yellow on hover, and scroll the list by 80% of its width. Works in RTL.
 */
const ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>';

function enhance(list: HTMLElement) {
  const host = list.parentElement;
  if (!host || list.dataset.hscrollReady) return;
  list.dataset.hscrollReady = '1';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  const mk = (dir: 'start' | 'end') => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'se-hs-arrow se-hs-' + dir;
    b.setAttribute('aria-label', dir === 'start' ? 'Scroll back' : 'Scroll forward');
    b.innerHTML = ICON;
    b.addEventListener('click', () => {
      const rtl = getComputedStyle(list).direction === 'rtl';
      const step = list.clientWidth * 0.8 * (dir === 'end' ? 1 : -1) * (rtl ? -1 : 1);
      list.scrollBy({ left: step, behavior: 'smooth' });
    });
    host.appendChild(b);
    return b;
  };
  const a = mk('start');
  const z = mk('end');
  const sync = () => {
    const max = list.scrollWidth - list.clientWidth;
    const pos = Math.abs(list.scrollLeft); // RTL scrollLeft is negative in Chrome/Firefox
    // centre the arrows on the list itself (its parent may also hold other things, e.g. a search box)
    const top = list.offsetTop + list.offsetHeight / 2 + 'px';
    a.style.top = z.style.top = top;
    a.toggleAttribute('data-on', max > 2 && pos > 2);
    z.toggleAttribute('data-on', max > 2 && pos < max - 2);
  };
  list.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(list);
  sync();
}

export default function HScrollArrows() {
  useEffect(() => {
    const scan = () => document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach(enhance);
    scan();
    // the page updates constantly (clocks, reels): rescan at most every 500ms (G16)
    let q = 0;
    const mo = new MutationObserver(() => {
      if (!q) q = window.setTimeout(() => ((q = 0), scan()), 500);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      window.clearTimeout(q);
    };
  }, []);
  return null;
}
