'use client';
// Owner (28 Oct): the story's circuits, like the hero's (thin traces from the edges, pads, a short light), and they MOVE
// WITH THE SCROLL: scrolling through the years pushes the light along them, so it feels like travelling through time.
import React, { useEffect, useRef } from 'react';

const L = ['M0 110 H70 L100 140 H170', 'M0 190 H40 L66 216 V300 L90 324 H140', 'M0 420 H90 L120 450 H190', 'M0 560 H50 L80 530 H150', 'M0 700 H110 L140 730 H200'];
const R = L.map((d) => d.replace(/([MHL]) ?(\d+)/g, (m, c, x) => c + (220 - Number(x))));

const endOf = (d: string): [number, number] => { let x = 0, y = 0; const re = /([MHVL])\s?([\d.]+)(?:\s([\d.]+))?/g; let m: RegExpExecArray | null; while ((m = re.exec(d))) { if (m[1] === 'H') x = +m[2]; else if (m[1] === 'V') y = +m[2]; else { x = +m[2]; y = +(m[3] || 0); } } return [x, y]; };

export default function StoryCircuits() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return; let raf = 0;
    const wrap = el.closest('.st-pin-wrap') as HTMLElement | null;
    const upd = () => { raf = 0; if (!wrap) return; const r = wrap.getBoundingClientRect(), range = Math.max(1, r.height - innerHeight), p = Math.max(0, Math.min(1, -r.top / range)); el.style.setProperty('--sp', p.toFixed(4)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', on, { passive: true }); upd();
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);
  const side = (paths: string[], cls: string) => (
    <svg className={'stc ' + cls} viewBox="0 0 220 800" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {paths.map((d, i) => <path key={'b' + i} d={d} className="b" />)}
      {paths.map((d, i) => <path key={'f' + i} d={d} className="f" pathLength={1000} style={{ ['--k' as string]: i } as React.CSSProperties} />)}
      {paths.map((d, i) => { const [x, y] = endOf(d); return <circle key={'c' + i} cx={x} cy={y} r="4" className="n" />; })}
    </svg>
  );
  return <div ref={ref} className="st-circ" aria-hidden="true">{side(L, 'l')}{side(R, 'r')}</div>;
}
