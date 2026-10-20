// @ts-nocheck
// R6 Part B · the shared scroll rules.
// 1. jumpTo(y): a fast programmatic scroll (logo, nav links, progress bar). While it runs the scroll-driven sections
//    (teardown, story) are in "jump" mode: they never hold the page, they snap silently to their end (going down) or
//    start (going up) state.
// 2. stepScroller(...): one deliberate wheel gesture = one step inside a held section; fast scrolling (a long flick, or
//    several gestures in quick succession) passes straight through without holding.
const EASE = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
let raf = 0;

/** True while a jump (programmatic fast scroll, scrollbar drag, Home/End keys…) is under way. */
export function jumping() { return typeof window !== 'undefined' && (window.__seJumpUntil || 0) > performance.now(); }
export function markJump(ms) { window.__seJumpUntil = Math.max(window.__seJumpUntil || 0, performance.now() + (ms || 900)); }

/** Scroll to y quickly (~600ms, instant with reduced motion); nothing on the way may stop it. */
export function jumpTo(y, ms = 600) {
  cancelAnimationFrame(raf);
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight), y1 = Math.max(0, Math.min(max, y)), y0 = window.scrollY;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  markJump(ms + 500);
  if (reduce || Math.abs(y1 - y0) < 2) { window.scrollTo(0, y1); return; }
  const t0 = performance.now();
  const f = (t) => { const k = Math.min(1, (t - t0) / ms); window.scrollTo(0, y0 + (y1 - y0) * EASE(k)); markJump(400); if (k < 1) raf = requestAnimationFrame(f); };
  raf = requestAnimationFrame(f);
}

// Any scroll that does not come from the wheel, touch or the arrow keys (scrollbar drag, Home/End/PageUp/PageDown,
// a find-in-page jump) counts as a jump.
if (typeof window !== 'undefined' && !window.__seJumpWatch) {
  window.__seJumpWatch = true; let lastIn = 0;
  const input = () => { lastIn = performance.now(); };
  window.addEventListener('wheel', input, { passive: true, capture: true });
  window.addEventListener('touchmove', input, { passive: true, capture: true });
  window.addEventListener('keydown', (e) => { if (/^(Home|End|PageUp|PageDown)$/.test(e.key)) markJump(1200); else input(); }, { capture: true });
  window.addEventListener('pointerdown', (e) => { if (e.clientX >= document.documentElement.clientWidth) markJump(1500); }, { capture: true }); // on the scrollbar
  let lastY = 0;
  window.addEventListener('scroll', () => { const y = window.scrollY, dy = Math.abs(y - lastY); lastY = y; if (performance.now() - lastIn > 250 && !window.__seOwnScroll && dy > 40) markJump(500); }, { passive: true });
  window.seJumpTo = jumpTo;
}

/**
 * Step mode / pass-through for a held, scroll-driven section.
 * o.region()  → { top, bottom } absolute scroll range in which the section is held (or null)
 * o.steps     → number of steps; o.yFor(i) → scroll position of step i; o.index() → current step
 * o.onStep(i) → optional callback when a step is played
 */
export function stepScroller(o) {
  let lastW = 0, gSum = 0, acc = 0, used = false, rel = false, busyUntil = 0, passUntil = 0, sraf = 0; const fresh = [];
  const go = (i) => { const y0 = window.scrollY, y1 = o.yFor(i), t0 = performance.now(), dur = o.ms || 700; busyUntil = t0 + dur; cancelAnimationFrame(sraf); window.__seOwnScroll = true;
    const f = (t) => { const k = Math.min(1, (t - t0) / dur); window.scrollTo(0, y0 + (y1 - y0) * EASE(k)); if (k < 1) sraf = requestAnimationFrame(f); else window.__seOwnScroll = false; }; sraf = requestAnimationFrame(f); o.onStep && o.onStep(i); };
  const onWheel = (e) => {
    const r = o.region(); if (!r || !e.deltaY) return; const y = window.scrollY; if (y < r.top - 2 || y > r.bottom + 2) return;
    const now = performance.now(); if (jumping() || now < passUntil) return; // jump / pass-through: never hold
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1), dir = Math.sign(dy);
    const quiet = now - lastW >= 250; lastW = now; if (quiet) { acc = 0; used = false; rel = false; gSum = 0; fresh.push(now); while (fresh.length && now - fresh[0] > 1400) fresh.shift(); }
    gSum += Math.abs(dy);
    // fast: three gestures within 1.4s, one gesture travelling > 3500px (a long flick or a fast wheel spin), or one huge event
    if (fresh.length >= 3 || gSum > 3500 || Math.abs(dy) > 600) { passUntil = now + 1200; return; }
    if (rel) return; const i = o.index(), last = o.steps - 1;
    if (!used && ((dir > 0 && i >= last) || (dir < 0 && i <= 0)) && now >= busyUntil) { rel = true; return; } // the ends release the page
    e.preventDefault(); if (used || now < busyUntil) return;
    if (Math.sign(acc) !== dir) acc = 0; acc += dy; if (Math.abs(acc) < 40) return;
    used = true; acc = 0; go(Math.max(0, Math.min(last, i + dir)));
  };
  window.addEventListener('wheel', onWheel, { passive: false });
  return () => { window.removeEventListener('wheel', onWheel); cancelAnimationFrame(sraf); };
}
