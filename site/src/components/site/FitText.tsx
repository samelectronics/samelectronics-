'use client';
// R9 (owner: "in French, Russian and Spanish some text runs out of its box"): the translations are kept short, and this is
// the safety net. In every language other than English and Arabic, a label that still overflows its box (buttons, tabs,
// chips, headings) gets its text scaled down just enough to fit, never below 78%. Only what is on screen is checked, after
// a language change, a resize, or when scrolling stops.
import { useEffect } from 'react';

// R10 B11: big titles (h1, h2) are never scaled; they wrap. Scaling them shrank the hero headline after a language switch.
const SEL = 'button, a, [role="tab"], [role="radio"], label, h3, h4, .sp-chip, .sp-tag';
const MIN = 0.78;

function fit() {
  const l = document.documentElement.lang || 'en';
  // R10 B11: first undo every size set for another language (on or off screen), so nothing stays small after switching back
  document.querySelectorAll<HTMLElement>('[data-fit-l]').forEach((el) => { if (el.dataset.fitL !== l) { el.style.fontSize = ''; delete el.dataset.fitL; } });
  if (l === 'en' || l === 'ar') return;
  const vh = window.innerHeight;
  document.querySelectorAll<HTMLElement>(SEL).forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50 || r.width < 8) return;
    if (el.dataset.fitL === l && el.style.fontSize) return; // already fitted for this language: never shrink twice
    el.dataset.fitL = l;
    const over = el.scrollWidth - el.clientWidth;
    if (over <= 1 || el.clientWidth === 0) return;
    const cur = parseFloat(getComputedStyle(el).fontSize) || 14, k = Math.max(MIN, el.clientWidth / el.scrollWidth);
    el.style.fontSize = (cur * k).toFixed(2) + 'px';
  });
}

export default function FitText() {
  useEffect(() => {
    let t = 0;
    const later = (ms = 250) => { clearTimeout(t); t = window.setTimeout(fit, ms); };
    const onLang = () => later(500);
    window.addEventListener('se:lang', onLang); window.addEventListener('resize', () => later()); window.addEventListener('scroll', () => later(300), { passive: true });
    later(1200);
    return () => { clearTimeout(t); window.removeEventListener('se:lang', onLang); };
  }, []);
  return null;
}
