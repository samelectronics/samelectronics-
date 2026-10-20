'use client';
// R6 Part B3 · the header progress line is a scrubber. Click anywhere to go to that point of the page, drag to scrub,
// hover to see the section name there. Section starts carry tiny solder pads that light as you pass them. Every move is a
// "jump" (src/lib/jumpScroll.js), so the teardown and story never hold it. In Arabic the line runs right → left.
import React, { useEffect, useRef, useState } from 'react';
import { jumpTo, markJump } from '@/lib/jumpScroll';

const NAMES: [string, string][] = [
  ['top', 'Home'], ['teardown', 'Teardown'], ['families', 'What we offer'], ['board', 'Live parts board'], ['quality', 'Bench test'],
  ['showcase', 'Showcase'], ['deals', 'Deals & arrivals'], ['repair', 'Repair Lab'], ['wholesale', 'Wholesale'], ['network', 'Worldwide'],
  ['story', 'Our story'], ['team', 'Team'], ['everyone', 'Who are you?'], ['circuit', 'Sam Circuit'], ['samsoom', 'Meet Samsoom'],
  ['social', 'The feed'], ['reviews', 'Reviews'], ['visit', 'Visit us'], ['finale', 'Quality · Warranty · Price'],
];
const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);

export default function ProgressScrub() {
  const ref = useRef<HTMLDivElement>(null);
  const [pads, setPads] = useState<{ id: string; name: string; f: number }[]>([]);
  const [hover, setHover] = useState<{ x: number; name: string } | null>(null);
  const drag = useRef(false);

  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setPads(NAMES.map(([id, name]) => { const el = document.getElementById(id); return el ? { id, name, f: Math.min(1, Math.max(0, (window.scrollY + el.getBoundingClientRect().top) / max)) } : null; }).filter(Boolean) as { id: string; name: string; f: number }[]);
    };
    const t = window.setTimeout(measure, 1500), iv = window.setInterval(measure, 5000);
    window.addEventListener('resize', measure); window.addEventListener('se:lang', measure);
    // light the pads already passed (one read per frame at most)
    let raf = 0;
    const lit = () => { raf = 0; const el = ref.current; if (!el) return; const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight), p = window.scrollY / max; el.querySelectorAll<HTMLElement>('[data-pad]').forEach((d) => d.classList.toggle('on', +d.dataset.pad! <= p + 0.002)); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(lit); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.clearTimeout(t); window.clearInterval(iv); window.removeEventListener('resize', measure); window.removeEventListener('se:lang', measure); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const frac = (clientX: number) => { const r = ref.current!.getBoundingClientRect(); const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width)); return document.documentElement.dir === 'rtl' ? 1 - f : f; };
  const nameAt = (f: number) => { let n = pads[0]?.name || 'Home'; pads.forEach((p) => { if (p.f <= f + 0.001) n = p.name; }); return n; };
  const yAt = (f: number) => f * Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  return (
    <div
      ref={ref}
      className="se-scrub"
      role="slider"
      aria-label={T('Page position')}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={-1}
      onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); jumpTo(yAt(frac(e.clientX)), 450); }}
      onPointerMove={(e) => {
        const f = frac(e.clientX), r = ref.current!.getBoundingClientRect();
        setHover({ x: e.clientX - r.left, name: T(nameAt(f)) });
        if (drag.current && e.buttons) { markJump(800); window.scrollTo(0, yAt(f)); }
      }}
      onPointerUp={() => { drag.current = false; }}
      onPointerLeave={() => { if (!drag.current) setHover(null); }}
    >
      {pads.map((p) => (
        <i key={p.id} data-pad={p.f} style={{ insetInlineStart: p.f * 100 + '%' }} />
      ))}
      {hover ? (
        <span className="se-scrub-tip" style={{ left: hover.x }}>
          {hover.name}
        </span>
      ) : null}
    </div>
  );
}
