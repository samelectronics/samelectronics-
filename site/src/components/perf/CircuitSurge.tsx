'use client';
/**
 * Issue 4 · surges: when something happens nearby (add to cart, a new board row, a card hover), one streak of
 * current in the visible circuits brightens and speeds up for 400ms, as if the shop reacts to you.
 * Streaks are the stroked, dash-animated circuit paths in each section (the hero's style: short glowing dashes).
 */
import { useEffect } from 'react';

const isStreak = (p: SVGElement) => {
  const cs = getComputedStyle(p);
  return cs.strokeDasharray !== 'none' && cs.animationName !== 'none' && /Pulse|Flow|Circ|Cur/i.test(cs.animationName);
};

function surge(near?: Element | null) {
  const vh = innerHeight;
  const scope = (near && near.closest('section, footer')) || document;
  const cands = [...scope.querySelectorAll<SVGElement>('svg path, svg line')].filter((p) => {
    const r = p.getBoundingClientRect();
    return r.bottom > 0 && r.top < vh && (r.width > 40 || r.height > 40) && isStreak(p);
  });
  if (!cands.length) return;
  const p = cands[Math.floor(Math.random() * cands.length)];
  if (p.classList.contains('se-surge')) return;
  p.classList.add('se-surge');
  const anims = p.getAnimations();
  anims.forEach((a) => (a.playbackRate = 2.4));
  setTimeout(() => {
    p.classList.remove('se-surge');
    anims.forEach((a) => (a.playbackRate = 1));
  }, 400);
}

export default function CircuitSurge() {
  useEffect(() => {
    let last = 0;
    const go = (el?: Element | null) => {
      const n = performance.now();
      if (n - last < 300) return;
      last = n;
      surge(el);
    };
    const onEvt = (e: Event) => go((e as CustomEvent).detail?.el || null);
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const card = t && t.closest && t.closest('[data-card], [data-w^="cf"], .lb-tile, .wwo-boxes > [data-w], [data-ipcard]');
      if (card && !card.contains(e.relatedTarget as Node)) go(card);
    };
    ['se:cart', 'se:surge'].forEach((n) => window.addEventListener(n, onEvt));
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      ['se:cart', 'se:surge'].forEach((n) => window.removeEventListener(n, onEvt));
      document.removeEventListener('mouseover', onOver);
    };
  }, []);
  return null;
}
