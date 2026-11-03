'use client';
// R6 Part D · while a menu, drawer or pop-over is open the page behind it does not scroll (EN and AR): the panel scrolls
// inside itself. Counted, so two open layers unlock only when both close. The scrollbar's width is kept as padding so
// nothing shifts sideways.
import { useEffect } from 'react';

let n = 0, off = null;
// owner (27 Oct): opening a panel (Find My Part…) must never move the page. Locking the root's overflow made this page
// jump to the top, so the page is no longer frozen by overflow: while a layer is open, wheel / touch / scroll keys that
// happen OUTSIDE the layer are cancelled (the layers stop their own events with stopWheel, so they still scroll inside).
const KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar']);
export function lockScroll() {
  if (typeof document === 'undefined') return () => {};
  if (n++ === 0) {
    // R11 (owner): any scrollable box inside the open layer (product view, device list, dropdowns) scrolls with the wheel
    // and touch; only the page behind stays still
    const canScroll = (e) => { const dy = e.type === 'wheel' ? e.deltaY : 0; for (let el = e.target; el && el !== document.body && el !== document.documentElement; el = el.parentElement) { if (!(el instanceof Element)) continue; const oy = getComputedStyle(el).overflowY; if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) { if (e.type !== 'wheel') return true; if ((dy < 0 && el.scrollTop > 0) || (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1)) return true; } } return false; };
    const block = (e) => { if (!canScroll(e)) e.preventDefault(); };
    const key = (e) => { const t = e.target; if (KEYS.has(e.key) && !(t && (t.closest && t.closest('input,textarea,select,[contenteditable]')))) e.preventDefault(); };
    window.addEventListener('wheel', block, { passive: false }); window.addEventListener('touchmove', block, { passive: false }); window.addEventListener('keydown', key);
    off = () => { window.removeEventListener('wheel', block); window.removeEventListener('touchmove', block); window.removeEventListener('keydown', key); };
  }
  let done = false;
  return () => { if (done) return; done = true; if (--n === 0 && off) { off(); off = null; } };
}
export function useScrollLock(open) {
  useEffect(() => (open ? lockScroll() : undefined), [open]);
}
// wheel/touch inside the layer never reach the page's own scroll handlers (teardown steps, story years)
export const stopWheel = { onWheel: (e) => e.stopPropagation(), onTouchMove: (e) => e.stopPropagation() };
