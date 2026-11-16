'use client';
// Owner (17 Nov): every action confirms itself: a small tick message slides in under the header and goes away.
// toast('Added to your list') from anywhere (event 'se:toast').
import React, { useEffect, useState } from 'react';
import { play } from '@/lib/sound';

export const toast = (text: string) => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('se:toast', { detail: text })); };

export default function Toaster() {
  const [list, setList] = useState<{ id: number; text: string }[]>([]);
  useEffect(() => {
    let n = 0;
    const on = (e: Event) => { const text = String((e as CustomEvent).detail || ''); if (!text) return; const id = ++n; setList((l) => [...l.slice(-2), { id, text }]); play('bell'); window.setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 2400); };
    window.addEventListener('se:toast', on); return () => window.removeEventListener('se:toast', on);
  }, []);
  const t = (s: string) => (typeof window !== 'undefined' && (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n?.t(s)) || s;
  return <div className="se-toasts" aria-live="polite">{list.map((x) => <div key={x.id} className="se-toast"><i aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></i>{t(x.text)}</div>)}</div>;
}
