'use client';
// Owner (18 Nov): "the rules that stop the page so an animation can play don't work on phone and tablet".
// holdAt(section) settles a section under the header and holds the page there (touch, wheel and keys) while its animation
// plays. Each swipe is handed to the section (next step / previous), a small "Skip" chip releases at once, and three quick
// swipes in a row also let the visitor through. Returns release().
import { T } from '@/components/site/ui';

let active = null;
export function holdAt(el, { onSwipe, onRelease } = {}) {
  if (typeof window === 'undefined' || !el) return () => {};
  if (active) active();
  const head = document.querySelector('header, .se-nav, [data-sc-name="SE Nav"]');
  const off = head ? Math.min(90, head.getBoundingClientRect().height) : 64;
  const target = () => Math.max(0, el.getBoundingClientRect().top + window.scrollY - off);
  let goal = target();
  window.scrollTo({ top: goal, behavior: 'smooth' });
  // Momentum scrolling on phones and tablets can carry the page past the section after the hold starts: pull it back.
  let settling = performance.now();
  const sc = () => { if (performance.now() - settling < 700) return; if (Math.abs(window.scrollY - goal) > 4) window.scrollTo({ top: goal }); };
  const fix = setTimeout(() => { goal = target(); window.scrollTo({ top: goal }); settling = 0; }, 750);
  let y0 = null, x0 = null, used = false, taps = [];
  const fast = () => { const n = performance.now(); taps = taps.filter((t) => n - t < 1200); taps.push(n); return taps.length >= 3; };
  const swipe = (dir) => { if (fast()) { release(); return; } onSwipe && onSwipe(dir); };
  const ts = (e) => { y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; used = false; };
  const tm = (e) => {
    if (e.target && e.target.closest && e.target.closest('.sh-skip')) return;
    e.preventDefault();
    if (used || y0 == null) return;
    const dy = y0 - e.touches[0].clientY, dx = x0 - e.touches[0].clientX;
    if (Math.abs(dy) > 36 && Math.abs(dy) > Math.abs(dx)) { used = true; swipe(Math.sign(dy)); }
  };
  let lastW = 0;
  const wh = (e) => { e.preventDefault(); const n = performance.now(); if (n - lastW < 450) { lastW = n; return; } lastW = n; swipe(Math.sign(e.deltaY)); };
  const key = (e) => { const d = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? 1 : ['ArrowUp', 'PageUp'].includes(e.key) ? -1 : 0; if (!d) return; e.preventDefault(); swipe(d); };
  const chip = document.createElement('button');
  chip.type = 'button'; chip.className = 'sh-skip'; chip.textContent = T('Skip') + ' ›';
  chip.addEventListener('click', () => release());
  document.body.appendChild(chip);
  window.addEventListener('touchstart', ts, { passive: true });
  window.addEventListener('touchmove', tm, { passive: false });
  window.addEventListener('wheel', wh, { passive: false });
  window.addEventListener('keydown', key);
  window.addEventListener('scroll', sc, { passive: true });
  document.documentElement.classList.add('sh-on');
  let done = false;
  function release() {
    if (done) return; done = true; active = null; 
    window.removeEventListener('touchstart', ts); window.removeEventListener('touchmove', tm); window.removeEventListener('wheel', wh); window.removeEventListener('keydown', key); window.removeEventListener('scroll', sc); clearTimeout(fix);
    chip.classList.add('out'); setTimeout(() => chip.remove(), 250);
    document.documentElement.classList.remove('sh-on');
    onRelease && onRelease();
  }
  active = release;
  return release;
}
