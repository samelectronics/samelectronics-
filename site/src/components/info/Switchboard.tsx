'use client';
// R10 P11 · the contact switchboard: every way to reach us as a line on a board, each with a live LED from the opening
// hours (Dubai time). Always-on lines (Samsoom, e-mail, WhatsApp messages) say when a person answers.
import React, { useEffect, useState } from 'react';
import { T } from '@/components/site/ui';
import { shopStatus, dubai } from '@/lib/shopStatus';

type Cn = { phone?: string; tel?: string; mobile?: string; wa?: string; email?: string };
const IC: Record<string, string> = {
  wa: 'M20.5 11.6A8.5 8.5 0 0 1 8 19l-4.5 1.3L4.8 16A8.5 8.5 0 1 1 20.5 11.6zM9 8.5c.3 2.8 3.2 5.7 6 6l1.2-1.4-2-1-1 .8a5 5 0 0 1-2.6-2.6l.8-1-1-2z',
  call: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  visit: 'M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  chat: 'M4 5h16v11H8l-4 4z M8 9h8M8 12h5',
  sam: 'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM10 9h.01M14 9h.01M10 13a3 3 0 0 0 4 0',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
};
export default function Switchboard({ c }: { c: Cn }) {
  const [now, setNow] = useState(() => Date.now()), [hours, setHours] = useState<Record<string, number[][]> | null>(null);
  useEffect(() => { const W = window as unknown as { SE_DATA?: { hours: Record<string, number[][]> } }; const tick = () => { setNow(Date.now()); if (W.SE_DATA) setHours(W.SE_DATA.hours); }; tick(); const iv = window.setInterval(tick, 15000); return () => window.clearInterval(iv); }, []);
  const s = hours ? shopStatus(hours, now) : null, open = !!s?.open, d = dubai(now), clock = String(Math.floor(d.m / 60)).padStart(2, '0') + ':' + String(d.m % 60).padStart(2, '0');
  const lines: { k: string; n: string; v: string; href: string; ext?: boolean; on: boolean; st: string; hint: string }[] = [
    { k: 'wa', n: 'WhatsApp', v: c.mobile || '+971 50 342 0015', href: 'https://wa.me/' + (c.wa || '971503420015'), ext: true, on: true, st: open ? 'Answering now' : 'Leave a message', hint: 'Fastest: stock, prices, orders' },
    { k: 'call', n: 'Call the shop', v: c.phone || '+971 4 273 3031', href: 'tel:' + (c.tel || '+97142733031'), on: open, st: open ? 'Line open' : 'Line closed', hint: 'During opening hours' },
    { k: 'visit', n: 'Visit the counter', v: 'Al Murar, Deira', href: '#visit', on: open, st: s ? s.short : '…', hint: 'Walk in, no appointment' },
    { k: 'chat', n: 'Live chat with the team', v: 'Right on this page', href: '#chat', on: open, st: open ? 'Team online' : 'Replies when we open', hint: 'Goes to the team inbox' },
    { k: 'sam', n: 'Ask Samsoom', v: 'Our assistant, any time', href: '/samsoom', on: true, st: 'Always on', hint: 'Parts, grades, repairs, prices' },
    { k: 'mail', n: 'E-mail', v: c.email || 'samelectronics.uae@gmail.com', href: 'mailto:' + (c.email || 'samelectronics.uae@gmail.com'), on: true, st: 'Read every working day', hint: 'Lists, invoices, documents' },
  ];
  return (
    <div className="sb" data-rise>
      <div className="sb-top"><span className="mono">{T('SWITCHBOARD')}</span><span className="sb-clock mono">DXB {clock}</span><span className={'sb-main' + (open ? ' on' : '')}><i />{open ? T('Shop open') : T('Shop closed')}</span></div>
      <div className="sb-grid">
        {lines.map((l) => (
          <a key={l.k} className={'sb-l k-' + l.k + (l.on ? ' on' : '')} href={l.href} {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <span className="sb-jack"><svg width="22" height="22" viewBox="0 0 24 24"><path d={IC[l.k]} /></svg></span>
            <span className="sb-t"><b>{T(l.n)}</b><span className={l.k === 'visit' || l.k === 'chat' || l.k === 'sam' ? '' : 'mono'}>{T(l.v)}</span><small>{T(l.hint)}</small></span>
            <span className="sb-led"><i />{T(l.st)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
