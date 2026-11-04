'use client';
// R11f: Samsoom's words type on the same clock as his voice. The letters shown come from the time passed since the line
// started (not from a chain of timers), so typing never lags behind or speeds up when the page is busy.
import React, { useEffect, useState } from 'react';
import { charMs } from '@/lib/voice';
export default function Typed({ text, delay = 0 }: { text: string; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0); if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); return; }
    const cum: number[] = []; let a = 0; for (const ch of text) { a += charMs(ch); cum.push(a); }
    const t0 = performance.now() + delay; let raf = 0, last = -1;
    const step = () => { const el = performance.now() - t0; let k = 0; while (k < cum.length && cum[k] <= el) k++; if (k !== last) { last = k; setN(k); } if (k < cum.length) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [text, delay]);
  return <span className="sam-typed">{text.slice(0, n)}{n < text.length ? <i className="sam-caret" aria-hidden="true" /> : null}<span className="sam-ghost" aria-hidden="true">{text.slice(n)}</span></span>;
}
