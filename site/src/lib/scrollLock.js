'use client';
// R6 Part D · while a menu, drawer or pop-over is open the page behind it does not scroll (EN and AR): the panel scrolls
// inside itself. Counted, so two open layers unlock only when both close. The scrollbar's width is kept as padding so
// nothing shifts sideways.
import { useEffect } from 'react';

let n = 0;
export function lockScroll() {
  if (typeof document === 'undefined') return () => {};
  const h = document.documentElement;
  if (n++ === 0) { const sb = window.innerWidth - h.clientWidth; h.style.overflow = 'hidden'; if (sb > 0) h.style.paddingInlineEnd = sb + 'px'; }
  let done = false;
  return () => { if (done) return; done = true; if (--n === 0) { h.style.overflow = ''; h.style.paddingInlineEnd = ''; } };
}
export function useScrollLock(open) {
  useEffect(() => (open ? lockScroll() : undefined), [open]);
}
// wheel/touch inside the layer never reach the page's own scroll handlers (teardown steps, story years)
export const stopWheel = { onWheel: (e) => e.stopPropagation(), onTouchMove: (e) => e.stopPropagation() };
