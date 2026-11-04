'use client';
// R11: Samsoom's words type out at the same pace his voice babbles (≈34 characters a second), then stay.
import React, { useEffect, useState } from 'react';
import { charMs } from '@/lib/voice';
export default function Typed({ text, delay = 0 }: { text: string; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => { setN(0); if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); return; } let i = 0, tm = 0; const go = () => { i += 1; setN(i); if (i < text.length) tm = window.setTimeout(go, charMs(text[i - 1])); }; tm = window.setTimeout(go, delay); return () => window.clearTimeout(tm); }, [text]);
  return <span className="sam-typed">{text.slice(0, n)}{n < text.length ? <i className="sam-caret" aria-hidden="true" /> : null}<span className="sam-ghost" aria-hidden="true">{text.slice(n)}</span></span>;
}
