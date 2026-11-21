'use client';
// R15 (owner: "an info button on everything that needs it: the system message, the qualities, the manufacturers. A short
// note beside it with the look of our pop-ups, close to the thing, like a bubble, with a read-more; maybe Samsoom explains
// it, light or dark with the system"). A small ⓘ; tapping (or hovering on a computer) opens a bubble right next to it:
// Samsoom in his circle, one short note, and "Read more" when there is a page about it.
import React, { useEffect, useRef, useState } from 'react';
import { T } from '@/components/site/ui';
import LiveSam from '@/components/samsoom/LiveSam';
import { play } from '@/lib/sound';

export const INFO: Record<string, { t: string; more?: string }> = {
  grade: { t: 'The grade is the quality of the part. Original is the maker’s own part; OLED and Incell are strong replacements; AAA and below are budget options. Every grade has its own warranty.', more: '/brands#grades' },
  maker: { t: 'The manufacturer is the factory that made the part. Some make the original parts for the brands, others make replacements. We list each one by name so you always know what you get.', more: '/brands#makers' },
  quality: { t: 'Quality groups the grades: Original, high-quality replacements and budget parts. Pick one to see only those.', more: '/brands#grades' },
  warranty: { t: 'Each grade carries its own warranty, written on your invoice. Keep the part in its original state to claim it.', more: '/notices' },
  system: { t: 'The site adds these details for our team (your reference, the page, the time and your device), so we can answer fast. You cannot change them; your own words go in the box above.', more: '/notices' },
};

export default function InfoTip({ k, side = 'bottom' }: { k: keyof typeof INFO | string; side?: 'bottom' | 'top' }) {
  const [open, setOpen] = useState(false), box = useRef<HTMLSpanElement>(null), hov = useRef(0);
  const it = INFO[k]; useEffect(() => {
    if (!open) return; const off = (e: Event) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', off, true); document.addEventListener('keydown', esc); return () => { document.removeEventListener('pointerdown', off, true); document.removeEventListener('keydown', esc); };
  }, [open]);
  if (!it) return null;
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
  return (
    <span ref={box} className={'se-it' + (open ? ' open' : '') + ' s-' + side} onMouseEnter={() => { if (!fine) return; window.clearTimeout(hov.current); hov.current = window.setTimeout(() => setOpen(true), 180); }} onMouseLeave={() => { if (!fine) return; window.clearTimeout(hov.current); hov.current = window.setTimeout(() => setOpen(false), 220); }}>
      <button type="button" className="se-it-b" aria-expanded={open} aria-label={T('What does this mean?') as string} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); play(open ? 'close' : 'open'); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5" /><path d="M12 11v6" /><circle cx="12" cy="7.6" r=".6" fill="currentColor" /></svg>
      </button>
      {open ? (
        <span className="se-it-pop" role="tooltip">
          <span className="se-it-sam" aria-hidden="true"><LiveSam fit size={40} pose="happy" /></span>
          <span className="se-it-tx">{T(it.t)}{it.more ? <> <a href={it.more} onClick={(e) => e.stopPropagation()}>{T('Read more')} →</a></> : null}</span>
        </span>
      ) : null}
    </span>
  );
}
