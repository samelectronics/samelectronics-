'use client';
// Owner (17 Nov): every action confirms itself: a small tick message slides in under the header and goes away.
// toast('Added to your list') from anywhere (event 'se:toast').
import React, { useEffect, useState } from 'react';
import { play } from '@/lib/sound';

// owner (18 Nov, round 2): anything done shows a tick; anything removed or switched off shows a red ×
export const toast = (text: string, kind: 'ok' | 'off' = 'ok') => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('se:toast', { detail: { text, kind } })); };

export default function Toaster() {
  const [list, setList] = useState<{ id: number; text: string; kind: 'ok' | 'off' }[]>([]);
  useEffect(() => {
    let n = 0;
    const on = (e: Event) => { const d = (e as CustomEvent).detail; const text = String(typeof d === 'string' ? d : d?.text || ''); const kind: 'ok' | 'off' = typeof d === 'object' && d?.kind === 'off' ? 'off' : /^(removed|alert removed|deleted|cleared|unstarred)/i.test(text) ? 'off' : 'ok'; if (!text) return; const id = ++n; setList((l) => [...l.slice(-2), { id, text, kind }]); play(kind === 'off' ? 'close' : 'bell'); window.setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 2400); };
    window.addEventListener('se:toast', on); return () => window.removeEventListener('se:toast', on);
  }, []);
  const t = (s: string) => (typeof window !== 'undefined' && (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n?.t(s)) || s;
  return <div className="se-toasts" aria-live="polite">{list.map((x) => <div key={x.id} className={'se-toast ' + x.kind}><i aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">{x.kind === 'off' ? <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /> : <path d="M5 12.5l4.5 4.5L19 7.5" />}</svg></i>{t(x.text)}</div>)}</div>;
}
