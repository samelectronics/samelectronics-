'use client';
// Owner (17 Nov): every action confirms itself with a small message. toast('Added to your list') from anywhere ('se:toast').
// Owner (R10): it drops in from the top under the header in the site's own look (white card, graphite text, a green tick
// or a red ×), always with a sound and a timer bar that runs out. Hovering it, or holding it with a finger, pauses the
// timer so it can be read; the × closes it at once.
import React, { useEffect, useState } from 'react';
import { play } from '@/lib/sound';

export const toast = (text: string, kind: 'ok' | 'off' = 'ok') => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('se:toast', { detail: { text, kind } })); };

type Item = { id: number; text: string; kind: 'ok' | 'off'; out?: boolean };
export default function Toaster() {
  const [list, setList] = useState<Item[]>([]), [hold, setHold] = useState<number | null>(null);
  useEffect(() => {
    let n = 0;
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail; const text = String(typeof d === 'string' ? d : d?.text || '');
      const kind: 'ok' | 'off' = typeof d === 'object' && d?.kind === 'off' ? 'off' : /^(removed|alert removed|deleted|cleared|unstarred)/i.test(text) ? 'off' : 'ok';
      if (!text) return; const id = ++n; setList((l) => [...l.filter((x) => !x.out).slice(-2), { id, text, kind }]); play(kind === 'off' ? 'close' : 'bell');
    };
    window.addEventListener('se:toast', on); return () => window.removeEventListener('se:toast', on);
  }, []);
  const close = (id: number) => { setList((l) => l.map((x) => (x.id === id ? { ...x, out: true } : x))); window.setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 260); };
  const t = (s: string) => (typeof window !== 'undefined' && (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n?.t(s)) || s;
  return (
    <div className="se-toasts" aria-live="polite">
      {list.map((x) => (
        <div key={x.id} className={'se-toast ' + x.kind + (x.out ? ' out' : '') + (hold === x.id ? ' hold' : '')}
          onPointerDown={() => setHold(x.id)} onPointerUp={() => setHold(null)} onPointerCancel={() => setHold(null)} onPointerLeave={() => setHold((h) => (h === x.id ? null : h))}>
          <i aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">{x.kind === 'off' ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="m5 12.5 4.5 4.5L19 7.5" />}</svg></i>
          <span dir="auto">{t(x.text)}</span>
          <button type="button" className="se-toast-x" aria-label={t('Close')} onClick={() => close(x.id)}>✕</button>
          <b className="se-toast-t" aria-hidden="true" onAnimationEnd={() => close(x.id)} />
        </div>
      ))}
    </div>
  );
}
