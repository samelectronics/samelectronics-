'use client';
// Owner (16 Nov): "Chat with us" always lets the visitor choose: Samsoom (instant answers, any time) or a real person
// from the shop, right here on the website (the live chat; every message lands in the staff inbox with the full history).
// Opened by the 'se:chatwith' event from every "Chat with us" button.
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';
import SESamsoom from '@/components/dc/SESamsoom';
import { site } from '@/content/facts';

const LiveChat = dynamic(() => import('@/components/info/ContactPage').then((m) => m.LiveChat), { ssr: false });
export const openChatChoice = () => window.dispatchEvent(new CustomEvent('se:chatwith'));
/** Owner (16 Nov): ONE button to reach a real person; it opens every way to reach us. */
export const openPerson = () => window.dispatchEvent(new CustomEvent('se:person'));

export default function ChatChoice() {
  const [open, setOpen] = useState(false), [mode, setMode] = useState<'' | 'ways' | 'person'>('');
  useEffect(() => {
    const on = () => { setMode(''); setOpen(true); play('open'); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onP = () => { setMode('ways'); setOpen(true); play('open'); };
    window.addEventListener('se:chatwith', on); window.addEventListener('se:person', onP); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:chatwith', on); window.removeEventListener('se:person', onP); document.removeEventListener('keydown', esc); };
  }, []);
  if (!open) return null;
  return (
    <div className="wc-veil ct-veil cc-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className={'cc-card' + (mode === 'person' ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={T('Chat with us')}>
        <button type="button" className="wc-x" aria-label={T('Close')} onClick={() => setOpen(false)}>✕</button>
        {mode === 'person' ? (<>
          <button type="button" className="cc-back" onClick={() => setMode('ways')}>← {T('Back')}</button>
          <LiveChat />
        </>) : mode === 'ways' ? (<>
          <b className="cc-h">{T('Talk to a person')}</b>
          <p className="cc-p">{T('Pick the way that suits you. A real person from the shop answers.')}</p>
          <div className="cc-ways">
            <button type="button" className="cc-w wa" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wa' } })); }}><span className="cc-wi"><i className="ct-ic wa" /></span><b>WhatsApp</b></button>
            <button type="button" className="cc-w wc" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wc' } })); }}><span className="cc-wi"><i className="ct-ic wc" /></span><b>WeChat</b></button>
            <button type="button" className="cc-w" onClick={() => setMode('person')}><span className="cc-wi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z" /></svg></span><b>{T('Chat here')}</b></button>
            <a className="cc-w" href={'tel:' + site.contact.storeTel}><span className="cc-wi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg></span><b>{T('Call')}</b></a>
            <a className="cc-w" href={'mailto:' + site.contact.email}><span className="cc-wi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18v12H3zM3 7l9 6 9-6" /></svg></span><b>{T('E-mail')}</b></a>
            <a className="cc-w" href={site.contact.mapsLink} target="_blank" rel="noopener noreferrer"><span className="cc-wi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg></span><b>{T('Visit')}</b></a>
          </div>
        </>) : (<>
          <b className="cc-h">{T('Chat with us')}</b>
          <p className="cc-p">{T('Who would you like to talk to?')}</p>
          <div className="cc-opts">
            <button type="button" className="cc-o sam" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })); }}>
              <span className="cc-ic"><SESamsoom mood="idle" size={40} still={true} /></span>
              <span><b>{T('Samsoom')}</b><small>{T('Instant answers, any time: parts, grades, prices, hours.')}</small></span><i>→</i>
            </button>
            <button type="button" className="cc-o person" onClick={() => setMode('ways')}>
              <span className="cc-ic p"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg></span>
              <span><b>{T('A person from the shop')}</b><small>{T('WhatsApp, WeChat, chat here, call, e-mail or visit.')}</small></span><i>→</i>
            </button>
          </div>
        </>)}
      </div>
    </div>
  );
}
