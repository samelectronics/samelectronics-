'use client';
// R6 Part C7 · the small "i" button next to a Quality or Manufacturer name. It opens a little card: what it is, the quality,
// the warranty, and "Learn more" (the G17 Coming soon card until the detailed page exists).
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { QUALITY_INFO, MAKER_INFO } from '@/content/specInfo';
import { comingSoon } from '@/components/g17/ComingSoon';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);

export default function InfoTip({ name, kind = 'quality', dark = true }: { name: string; kind?: 'quality' | 'maker'; dark?: boolean }) {
  const info = (kind === 'maker' ? MAKER_INFO : QUALITY_INFO)[name];
  const btn = useRef<HTMLButtonElement>(null);
  const [at, setAt] = useState<{ x: number; y: number; up: boolean } | null>(null);
  useEffect(() => {
    if (!at) return;
    const close = (e: Event) => { if (e.type === 'keydown' && (e as KeyboardEvent).key !== 'Escape') return; if (e.type === 'pointerdown' && (e.target as HTMLElement).closest('.se-info-card,.se-info')) return; setAt(null); };
    window.addEventListener('pointerdown', close); window.addEventListener('keydown', close); window.addEventListener('scroll', close, { passive: true });
    return () => { window.removeEventListener('pointerdown', close); window.removeEventListener('keydown', close); window.removeEventListener('scroll', close); };
  }, [at]);
  if (!info) return null;
  const open = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (at) return setAt(null); const r = btn.current!.getBoundingClientRect(); const up = r.top > window.innerHeight * 0.55; setAt({ x: Math.min(window.innerWidth - 150, Math.max(150, r.left + r.width / 2)), y: up ? r.top - 8 : r.bottom + 8, up }); };
  return (
    <>
      <button ref={btn} type="button" className={'se-info' + (dark ? '' : ' light')} aria-label={T('About') + ' ' + T(name)} aria-expanded={!!at} onClick={open}>
        i
      </button>
      {at && typeof document !== 'undefined'
        ? createPortal(
            <div className={'se-info-card' + (at.up ? ' up' : '')} role="dialog" style={{ left: at.x, top: at.y }}>
              <b>{T(name)}</b>
              <p>{T(info.what)}</p>
              <dl>
                <dt>{T('Quality')}</dt>
                <dd>{T(info.quality)}</dd>
                <dt>{T('Warranty')}</dt>
                <dd>{T(info.warranty)}</dd>
              </dl>
              <button type="button" onClick={() => { setAt(null); comingSoon({ text: T('A detailed page about each quality and maker is coming soon.') }); }}>
                {T('Learn more')}
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
