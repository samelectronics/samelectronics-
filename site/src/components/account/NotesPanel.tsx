'use client';
// R10 B9 · My Bench → Notifications: the full history of the bell (orders, repairs, stock alerts, offers, info),
// with filters, mark read and clear. Opened from every item in the bell. Works signed in or not (notes live on this device).
import React, { useEffect, useState } from 'react';
import { notes, markRead, clearNotes, type Note } from '@/lib/notes';
import { T } from '@/components/site/ui';

const KINDS: [Note['kind'] | 'all' | 'unread', string][] = [['all', 'All'], ['unread', 'Unread'], ['order', 'Orders'], ['repair', 'Repairs'], ['stock', 'Stock alerts'], ['offer', 'Offers'], ['info', 'News']];
const when = (t: number) => new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function NotesPanel() {
  const [l, setL] = useState<Note[]>([]), [f, setF] = useState<(typeof KINDS)[number][0]>('all');
  useEffect(() => { const r = () => setL(notes()); r(); window.addEventListener('se:notes', r); return () => window.removeEventListener('se:notes', r); }, []);
  const shown = l.filter((n) => (f === 'all' ? true : f === 'unread' ? !n.read : n.kind === f));
  const unread = l.filter((n) => !n.read).length;
  return (
    <div className="nt-panel">
      <div className="nt-bar">
        <div className="nt-f" role="tablist">{KINDS.map(([k, t]) => <button key={k} type="button" role="tab" aria-selected={f === k} className={'sp-chip' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{T(t)}{k === 'unread' && unread ? ' · ' + unread : ''}</button>)}</div>
        <div className="nt-acts">
          {unread ? <button type="button" className="shop-clear" onClick={() => markRead()}>{T('Mark all as read')}</button> : null}
          {l.length ? <button type="button" className="shop-clear" onClick={() => clearNotes()}>{T('Clear')}</button> : null}
        </div>
      </div>
      {shown.length ? (
        <ul className="nt-list">
          {shown.map((n) => (
            <li key={n.id} className={'nt-it k-' + n.kind + (n.read ? '' : ' new')}>
              <i aria-hidden="true" />
              <div><b>{T(n.t)}</b>{n.d ? <p>{T(n.d)}</p> : null}<small>{when(n.at)}</small></div>
              <div className="nt-go">
                {!n.read ? <button type="button" className="shop-clear" onClick={() => markRead(n.id)}>{T('Mark read')}</button> : null}
                {n.href && !n.href.startsWith('/account#notifications') ? <a className="sp-btn" href={n.href} onClick={() => markRead(n.id)}>{T('Open')}</a> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="sp-p nt-none">{T('No notifications yet.')}</p>}
    </div>
  );
}
