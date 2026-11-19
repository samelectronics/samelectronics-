'use client';
// Owner (16 Nov): "Chat with us" always lets the visitor choose: Samsoom (instant answers, any time) or a real person
// from the shop, right here on the website (the live chat; every message lands in the staff inbox with the full history).
// Opened by the 'se:chatwith' event from every "Chat with us" button.
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';
import LiveSam from '@/components/samsoom/LiveSam';
import { site } from '@/content/facts';

const LiveChat = dynamic(() => import('@/components/info/ContactPage').then((m) => m.LiveChat), { ssr: false }) as React.ComponentType<{ initial?: string }>;
/** text (optional): a ready message (e.g. a bulk list) carried into whichever way the visitor picks */
export const openChatChoice = (text?: string, subject?: string) => window.dispatchEvent(new CustomEvent('se:chatwith', { detail: { text, subject } }));
/** Owner (16 Nov): ONE button to reach a real person; it opens every way to reach us. */
export const openPerson = () => window.dispatchEvent(new CustomEvent('se:person'));

/** owner (18 Nov): picking WhatsApp or WeChat shows a system message (what the team needs to know) and a place to add
 *  your own words. On the Samsoom page it carries the conversation; elsewhere the page and language you are on. */
const context = () => {
  const w = window as unknown as { seChatContext?: () => string; seI18n?: { lang: () => string } };
  const own = w.seChatContext ? w.seChatContext() : '';
  if (own) return own;
  return '*' + T('Website enquiry') + '*\n' + T('Page') + ': ' + (document.title.split('·')[0].trim() || location.pathname) + ' (' + location.pathname + ')\n' + T('Language') + ': ' + (w.seI18n ? w.seI18n.lang() : 'en');
};

const IC = (d: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
type Row = { k: string; b: string; s: string; ic: React.ReactNode; href?: string; ltr?: boolean };
const ROWS: Row[] = [
  { k: 'sam', b: 'Samsoom', s: 'Instant answers, any time of day', ic: <LiveSam size={40} pose="idle" /> },
  { k: 'here', b: 'A person, here', s: 'Live chat on the website', ic: IC('M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z') },
  { k: 'wa', b: 'WhatsApp', s: 'A person replies', ic: <i className="ct-ic wa" /> },
  { k: 'wc', b: 'WeChat', s: 'A person replies', ic: <i className="ct-ic wc" /> },
  { k: 'mail', b: 'E-mail', s: site.contact.email, ltr: true, href: 'mailto:' + site.contact.email, ic: IC('M3 6h18v12H3zM3 7l9 6 9-6') },
  { k: 'tel', b: 'Call the shop', s: '+971 4 273 3031', ltr: true, href: 'tel:' + site.contact.storeTel, ic: IC('M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2') },
  { k: 'map', b: 'Visit us', s: 'Al Murar, Deira, Dubai', href: site.contact.mapsLink, ic: IC('M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z') },
];

export default function ChatChoice() {
  const [open, setOpen] = useState(false), [mode, setMode] = useState<'' | 'person'>(''), [pre, setPre] = useState<{ text?: string; subject?: string }>({});
  useEffect(() => {
    const on = (e: Event) => { setPre(((e as CustomEvent).detail as { text?: string; subject?: string }) || {}); setMode(''); setOpen(true); play('open'); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onP = () => { setPre({}); setMode(''); setOpen(true); play('open'); };
    window.addEventListener('se:chatwith', on); window.addEventListener('se:person', onP); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:chatwith', on); window.removeEventListener('se:person', onP); document.removeEventListener('keydown', esc); };
  }, []);
  const go = (k: string) => {
    if (k === 'sam') { setOpen(false); if (location.pathname.startsWith('/samsoom')) { document.querySelector<HTMLTextAreaElement>('.ak-in textarea')?.focus(); return; } window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })); return; }
    if (k === 'here') { setMode('person'); return; }
    if (k === 'wa' || k === 'wc') { setOpen(false); window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: k, text: pre.text || context() } })); }
  };
  if (!open) return null;
  return (
    <div className="wc-veil ct-veil cc-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className={'cc-card' + (mode === 'person' ? ' wide' : ' cc2')} role="dialog" aria-modal="true" aria-label={T('Chat with us')}>
        <button type="button" className="wc-x" aria-label={T('Close')} onClick={() => setOpen(false)}>✕</button>
        {mode === 'person' ? (<>
          <button type="button" className="cc-back" onClick={() => setMode('')}>← {T('Back')}</button>
          <LiveChat initial={pre.text ? pre.text.replace(/\*/g, '') : ''} />
        </>) : (<>
          {/* owner (19 Nov): "contact us / chat with us is Samsoom talking with a list of all contacts one after the
              other, not the squared table": the same card as the system notices, Samsoom on top, every way in a list */}
          <span className="sn2-sam cc-sam" aria-hidden="true"><LiveSam size={92} pose="happy" /></span>
          <b className="cc-h">{T('How would you like to reach us?')}</b>
          <p className="cc-p">{T('Pick any way. A person from the shop replies, Samsoom answers straight away.')}</p>
          <div className="cc-list">
            {ROWS.map((r, k) => {
              const inner = (<><span className={'cc-li ' + r.k}>{r.ic}</span><span className="cc-lt"><b>{r.k === 'wa' ? 'WhatsApp' : r.k === 'wc' ? 'WeChat' : T(r.b)}</b><small dir={r.ltr ? 'ltr' : undefined}>{r.ltr ? r.s : T(r.s)}</small></span><i className="cc-la" aria-hidden="true">›</i></>);
              const st = { ['--k' as string]: k } as React.CSSProperties;
              const href = r.k === 'mail' && pre.text ? r.href + '?subject=' + encodeURIComponent(pre.subject || T('Website enquiry')) + '&body=' + encodeURIComponent(pre.text.replace(/\*/g, '')) : r.href;
              return href
                ? <a key={r.k} className="cc-row" style={st} href={href} target={r.k === 'map' ? '_blank' : undefined} rel="noopener noreferrer" onClick={() => setOpen(false)}>{inner}</a>
                : <button key={r.k} type="button" className="cc-row" style={st} onClick={() => go(r.k)}>{inner}</button>;
            })}
          </div>
        </>)}
      </div>
    </div>
  );
}
