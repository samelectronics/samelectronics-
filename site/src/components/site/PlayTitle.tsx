'use client';
// Owner (16 Nov): "the title keeps changing like it plays, displays messages like a video, so techy". Every page header
// plays its own short reel: the page title first, then a few more lines, each one decoding in letter by letter from
// signal noise, with a live read-out (● LIVE · 02/04) and a progress line under it. The first title is what search
// engines and screen readers get; the rest is decoration. Reduced motion: the first title stays.
import React, { useEffect, useRef, useState } from 'react';
import { T } from './ui';

const NOISE = '01<>/\\_-=+*#░▒▓';
const HOLD = 3800, DECODE = 650;

function useDecode(target: string, run: number) {
  const [s, setS] = useState(target);
  useEffect(() => {
    if (!run) { setS(target); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => { const p = Math.min(1, (now - t0) / DECODE); const n = target.length;
      setS(target.split('').map((ch, i) => (ch === ' ' || p >= (i + 1) / n ? ch : p > i / n - 0.25 ? NOISE[(Math.random() * NOISE.length) | 0] : ' ')).join(''));
      if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return s;
}

// extra lines each page plays after its own title (keyed by the first part of the path)
export const HERO_MSGS: Record<string, [string, string?][]> = {
  shop: [['Tested.', 'Before it ships.'], ['In stock.', 'In Deira.'], ['Trade prices.', 'For repair shops.']],
  deals: [['New stock.', 'Every week.'], ['Limited.', 'Gone soon.']],
  repair: [['While you wait.', 'Most in an hour.'], ['Every fix.', 'Tested twice.']],
  wholesale: [['Both prices.', 'On every part.'], ['Invoiced.', 'To your company.']],
  worldwide: [['Packed in Deira.', 'Tracked to you.'], ['Four regions.', 'One counter.']],
  story: [['Syria Tell.', 'Since 2003.'], ['Same family.', 'Same street.']],
  membership: [['Points.', 'On every part.'], ['Circuit. Grid.', 'Circle.']],
  brands: [['Original.', 'Explained.'], ['Every grade.', 'Side by side.']],
  contact: [['WhatsApp.', 'WeChat. Or here.'], ['Real people.', 'In Deira.']],
  faq: [['Ask anything.', 'We answer.']],
};

export default function PlayTitle({ lines, className = 'sp-h1', live = true }: { lines: [string, string?][]; className?: string; live?: boolean }) {
  const [i, setI] = useState(0), [run, setRun] = useState(0), ref = useRef<HTMLHeadingElement>(null), vis = useRef(true);
  const n = lines.length;
  useEffect(() => {
    if (n < 2 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { vis.current = e.isIntersecting; }, { threshold: [0, 0.1] }); if (ref.current) io.observe(ref.current);
    const iv = window.setInterval(() => { if (!vis.current || document.hidden) return; setI((k) => (k + 1) % n); setRun((r) => r + 1); }, HOLD);
    return () => { window.clearInterval(iv); io.disconnect(); };
  }, [n]);
  const [a, b] = lines[i] || lines[0];
  const A = useDecode(T(a), run), B = useDecode(b ? T(b) : '', run);
  return (
    <>
      <h1 ref={ref} className={className + ' pt-h'} aria-label={T(lines[0][0]) + (lines[0][1] ? ' ' + T(lines[0][1]!) : '')}>
        <span aria-hidden="true" data-no-i18n="" className="pt-a">{A}</span>{b ? <><br /><em aria-hidden="true" data-no-i18n="" className="pt-b">{B}</em></> : null}
      </h1>
      {live && n > 1 ? (
        <span className="pt-hud" aria-hidden="true">
          <i className="pt-dot" /><b>LIVE</b><span data-no-i18n="">{String(i + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}</span>
          <span className="pt-bars">{lines.map((_, k) => <i key={k + (k === i ? '-' + run : '')} className={k === i ? 'on' : k < i ? 'done' : ''} style={{ ['--d' as string]: HOLD + 'ms' } as React.CSSProperties} />)}</span>
        </span>
      ) : null}
    </>
  );
}
