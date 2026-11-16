'use client';
// Owner (16 Nov): headers are typography, colour and tech, like the teardown ("Take any [phone] apart."): bold words,
// one key word drawn as an outline, the second line in yellow. Entrance: each word slams in from its own side (scale
// 1.3 → 1, blur → sharp), the outlined word gets a light running through its outline, and the line lands with a tiny
// shake. Behind it: two rows of giant outlined words drifting in opposite directions over slow colour glows.
import React, { useEffect, useState } from 'react';

/** which word of the first line is drawn as an outline: the longest one (ties: the last) */
const keyWord = (ws: string[]) => { let k = ws.length - 1, best = -1; ws.forEach((w, i) => { const n = w.replace(/[^\p{L}\p{N}]/gu, '').length; if (n >= best) { best = n; k = i; } }); return k; };

export function HeroTitle({ a, b, className = 'sp-h1' }: { a: string; b?: string; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setOn(true), 60); return () => window.clearTimeout(t); }, []);
  const A = a.split(' '), k = keyWord(A), B = (b || '').split(' ').filter(Boolean);
  let n = 0;
  const word = (w: string, cls: string) => { const i = n++; return <span key={i} className={'ht2-w ' + cls} style={{ ['--i' as string]: i, ['--s' as string]: i % 2 ? 1 : -1 } as React.CSSProperties}><span>{w}</span></span>; };
  return (
    <h1 className={className + ' ht2' + (on ? ' on' : '')} aria-label={a + (b ? ' ' + b : '')}>
      <span className="ht2-l a" aria-hidden="true">{A.map((w, i) => word(w, i === k ? 'o' : ''))}</span>
      {B.length ? <span className="ht2-l b" aria-hidden="true">{B.map((w) => word(w, 'y'))}</span> : null}
    </h1>
  );
}

export function HeroBack({ word }: { word: string }) {
  const W = (word || '').toUpperCase(), row = Array.from({ length: 6 }, () => W).join(' · ');
  return (
    <div className="ht2-bg" aria-hidden="true" data-no-i18n="">
      <i className="ht2-glow g1" /><i className="ht2-glow g2" /><i className="ht2-glow g3" />
      <span className="ht2-mq r1"><span>{row} · {row}</span></span>
      <span className="ht2-mq r2"><span>{row} · {row}</span></span>
    </div>
  );
}
