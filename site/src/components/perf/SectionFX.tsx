'use client';
import { useEffect } from 'react';

/**
 * 14 Oct · H-G1 / H-G2: every section arrives, and replays every time.
 *  - When a section is ~25% in view it is marked `data-se-in` and, for the sections that had no entrance of their own,
 *    its titles, text, buttons and cards fade + rise in (WAAPI on the individual `translate` / `scale` properties, so it
 *    never fights a `transform` that a section's own code writes: no jumps, H-G3).
 *  - When a section fully leaves the view it is reset silently: its CSS animations are restarted on the way back, and
 *    a `se:replay` event tells the section's own logic to reset its state (window event, detail = the section element).
 * The hero and the teardown manage their own state (the teardown resets itself, §07).
 */
const SKIP = new Set(['top', 'teardown']);
/** Sections whose content had no entrance of its own: the generic one is applied there. */
const GENERIC = new Set(['repair', 'network', 'everyone', 'social', 'reviews', 'visit']);
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function animated(el: Element, stop: Element) {
  for (let e: Element | null = el; e && e !== stop; e = e.parentElement) if (getComputedStyle(e).animationName !== 'none') return true;
  return false;
}

function enter(sec: HTMLElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sel = 'h2, h3, p, [class*="eb"], [class*="btn"], [class*="cta"], article, figure, [class*="card"]';
  const els = Array.from(sec.querySelectorAll<HTMLElement>(sel)).filter((el) => {
    if (el.closest('[data-no-ge], [data-w="SV"], [data-w="A"], canvas, svg, .fm, iframe')) return false;
    if (el.parentElement && el.parentElement.closest(sel) && !/article|figure/i.test(el.tagName)) return false; // animate the outer block once
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.top > innerHeight * 1.6) return false;
    return !animated(el, sec);
  });
  els.slice(0, 40).forEach((el, i) => {
    const card = /article|figure/i.test(el.tagName) || /card/.test(String(el.className));
    const title = /^H[23]$/.test(el.tagName);
    const from: Keyframe = reduce ? { opacity: 0 } : { opacity: 0, translate: '0 ' + (card ? 40 : title ? 32 : 24) + 'px', scale: card ? '0.96' : title ? '0.97' : '1' };
    const to: Keyframe = reduce ? { opacity: 1 } : { opacity: 1, translate: '0 0', scale: '1' };
    try {
      el.animate([from, to], { duration: card ? 600 : title ? 650 : 500, delay: Math.min(i, 14) * (card ? 90 : 75), easing: EASE, fill: 'backwards' });
    } catch {}
  });
}

export default function SectionFX() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const state = new WeakMap<Element, { in: boolean; out: boolean }>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const sec = e.target as HTMLElement, st = state.get(sec) || { in: false, out: true };
          const enough = e.isIntersecting && (e.intersectionRatio >= 0.25 || e.intersectionRect.height >= innerHeight * 0.25);
          if (e.isIntersecting && st.out) {
            st.out = false;
            if (sec.hasAttribute('data-se-rp')) {
              sec.removeAttribute('data-se-rp');
              void sec.offsetWidth; // restart its CSS animations from the start
            }
          }
          if (enough && !st.in) {
            st.in = true;
            sec.setAttribute('data-se-in', '');
            if (GENERIC.has(sec.id)) enter(sec);
          } else if (!e.isIntersecting && !st.out) {
            // fully out of view: reset silently so it replays from the start next time
            st.in = false;
            st.out = true;
            sec.removeAttribute('data-se-in');
            if (!SKIP.has(sec.id)) sec.setAttribute('data-se-rp', '');
            window.dispatchEvent(new CustomEvent('se:replay', { detail: sec }));
          }
          state.set(sec, st);
        }
      },
      { threshold: [0, 0.05, 0.15, 0.25, 0.4] },
    );
    const scan = () => {
      document.querySelectorAll('#dc-root section, #dc-root footer').forEach((el) => {
        if (seen.has(el) || el.parentElement?.closest('section')) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    const iv = window.setInterval(scan, 2000);
    return () => {
      window.clearInterval(iv);
      io.disconnect();
    };
  }, []);
  return null;
}

/** For a section's own logic: run `fn` whenever its section fully left the view (so it can reset its state). */
export function onReplay(getEl: () => Element | null | undefined, fn: () => void) {
  const h = (e: Event) => {
    const el = getEl(), d = (e as CustomEvent).detail as Element;
    if (el && d && (d === el || d.contains(el) || el.contains(d))) fn();
  };
  window.addEventListener('se:replay', h);
  return () => window.removeEventListener('se:replay', h);
}
