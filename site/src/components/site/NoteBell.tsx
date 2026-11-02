'use client';
// R9 · the bell in the nav: the visitor's notifications (orders, repairs, stock alerts, offers). Styles: dc-base.css (.nb-*).
import React, { useEffect, useRef, useState } from 'react';
import { notes, markRead, clearNotes, seedNotes, type Note } from '@/lib/notes';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
const ICON: Record<Note['kind'], string> = { order: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18', repair: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z', stock: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', offer: 'M20 12 12 20 4 12V4h8zM8 8h.01', info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01' };
const ago = (t: number) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? T('now') : m < 60 ? m + ' min' : m < 1440 ? Math.round(m / 60) + ' h' : Math.round(m / 1440) + ' d'; };

export default function NoteBell() {
  const [l, setL] = useState<Note[]>([]), [open, setOpen] = useState(false), box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    seedNotes(); const r = () => setL(notes()); r();
    const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('se:notes', r); window.addEventListener('se:lang', r); document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:notes', r); window.removeEventListener('se:lang', r); document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc); };
  }, []);
  const unread = l.filter((x) => !x.read).length;
  return (
    <span ref={box} className={'nb' + (open ? ' open' : '')}>
      <button type="button" className="se-ico nb-btn" title={T('Notifications')} aria-label={T('Notifications')} aria-expanded={open} data-sound={open ? 'close' : 'open'} onClick={() => setOpen(!open)}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>
        {unread ? <span className="nb-n">{unread}</span> : null}
      </button>
      {open ? (
        <span className="nb-list" role="dialog" aria-label={T('Notifications')}>
          <span className="nb-head"><b>{T('Notifications')}</b>{unread ? <button type="button" onClick={() => markRead()}>{T('Mark all as read')}</button> : l.length ? <button type="button" onClick={() => clearNotes()}>{T('Clear')}</button> : null}</span>
          {l.length ? l.map((n) => (
            <a key={n.id} href="/account#notifications" className={'nb-it k-' + n.kind + (n.read ? '' : ' new')} onClick={() => { markRead(n.id); setOpen(false); }}>
              <i><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICON[n.kind]} /></svg></i>
              <span><b>{T(n.t)}</b>{n.d ? <small>{T(n.d)}</small> : null}</span><em>{ago(n.at)}</em>
            </a>
          )) : <span className="nb-none">{T('No notifications yet.')}</span>}
          <a className="nb-all" href="/account#notifications" onClick={() => setOpen(false)}>{T('See all notifications')} →</a>
        </span>
      ) : null}
    </span>
  );
}
