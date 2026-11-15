'use client';
// R6 Part C7 · the small "i" button next to a Quality or Manufacturer name. It opens a little card: what it is, the quality,
// the warranty, and "Learn more" (the G17 Coming soon card until the detailed page exists).
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { QUALITY_INFO, MAKER_INFO } from '@/content/specInfo';

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
  // R12 (owner): opens on hover and on tap, and always lands where it can be read: below when there is room, above
  // otherwise, never off the side of the screen
  const show = () => { const r = btn.current!.getBoundingClientRect(), half = Math.min(150, (window.innerWidth - 24) / 2), below = window.innerHeight - r.bottom, up = below < 250 && r.top > below; setAt({ x: Math.min(window.innerWidth - 12 - half, Math.max(12 + half, r.left + r.width / 2)), y: up ? r.top - 8 : r.bottom + 8, up }); };
  const open = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (at) return setAt(null); show(); };
  const hoverT = React.useRef(0);
  const enter = () => { window.clearTimeout(hoverT.current); if (!at && matchMedia('(hover: hover)').matches) show(); };
  const leave = () => { window.clearTimeout(hoverT.current); hoverT.current = window.setTimeout(() => setAt(null), 260); };
  return (
    <>
      <button ref={btn} type="button" className={'se-info' + (dark ? '' : ' light')} aria-label={T('About') + ' ' + T(name)} aria-expanded={!!at} onClick={open} onMouseEnter={enter} onMouseLeave={leave}>
        i
      </button>
      {at && typeof document !== 'undefined'
        ? createPortal(
            <div className={'se-info-card' + (at.up ? ' up' : '')} role="dialog" style={{ left: at.x, top: at.y }} onMouseEnter={() => window.clearTimeout(hoverT.current)} onMouseLeave={leave}>
              <b>{T(name)}</b>
              <p>{T(info.what)}</p>
              <dl>
                <dt>{T('Quality')}</dt>
                <dd>{T(info.quality)}</dd>
                <dt>{T('Warranty')}</dt>
                <dd>{T(info.warranty)}</dd>
              </dl>
              <button type="button" onClick={() => { setAt(null); location.href = '/brands#makers'; }}>
                {T('Learn more')}
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
