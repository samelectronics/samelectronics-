'use client';
// Page-header title: reads left to right (white line, yellow line) and slams in word by word.
import React, { useEffect, useState } from 'react';

export function HeroTitle({ a, b, className = 'sp-h1' }: { a: string; b?: string; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setOn(true), 60); return () => window.clearTimeout(t); }, []);
  let n = 0;
  const word = (w: string, cls: string) => { const i = n++; return <span key={i} className={'ht2-w ' + cls} style={{ ['--i' as string]: i, ['--s' as string]: i % 2 ? 1 : -1 } as React.CSSProperties}><span>{w}</span></span>; };
  return (
    <h1 className={className + ' ht2' + (on ? ' on' : '')} aria-label={a + (b ? ' ' + b : '')}>
      <span className="ht2-l a" aria-hidden="true">{a.split(' ').filter(Boolean).map((w) => word(w, ''))}</span>
      {b ? <span className="ht2-l b" aria-hidden="true">{b.split(' ').filter(Boolean).map((w) => word(w, 'y'))}</span> : null}
    </h1>
  );
}

// Owner (16 Nov): the tapes were removed ("you copied my example"). Kept as a no-op so callers stay simple.
export function HeroBack(_: { word: string }) { return null; }
