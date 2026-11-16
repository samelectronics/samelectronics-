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
  const [open, setOpen] = useState(false), [mode, setMode] = useState<'' | 'person'>('');
  useEffect(() => {
    const on = () => { setMode(''); setOpen(true); play('open'); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onP = () => { setMode(''); setOpen(true); play('open'); };
    window.addEventListener('se:chatwith', on); window.addEventListener('se:person', onP); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:chatwith', on); window.removeEventListener('se:person', onP); document.removeEventListener('keydown', esc); };
  }, []);
  if (!open) return null;
  return (
    <div className="wc-veil ct-veil cc-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className={'cc-card' + (mode === 'person' ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={T('Chat with us')}>
        <button type="button" className="wc-x" aria-label={T('Close')} onClick={() => setOpen(false)}>✕</button>
        {mode === 'person' ? (<>
          <button type="button" className="cc-back" onClick={() => setMode('')}>← {T('Back')}</button>
          <LiveChat />
        </>) : (<>
          {/* owner (17 Nov): every chat starts here: Samsoom, a person on the website, WhatsApp or WeChat; the next step
              shows what will be sent (system details + a personal note) */}
          <b className="cc-h">{T('Chat with us')}</b>
          <p className="cc-p">{T('Who would you like to talk to?')}</p>
          <div className="cc-ways four">
            <button type="button" className="cc-w" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })); }}><span className="cc-wi sam"><SESamsoom mood="idle" size={34} still={true} /></span><b>{T('Samsoom')}</b><small>{T('Instant answers')}</small></button>
            <button type="button" className="cc-w" onClick={() => setMode('person')}><span className="cc-wi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg></span><b>{T('A person, here')}</b><small>{T('Chat on the website')}</small></button>
            <button type="button" className="cc-w wa" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wa' } })); }}><span className="cc-wi"><i className="ct-ic wa" /></span><b>WhatsApp</b><small>{T('A person replies')}</small></button>
            <button type="button" className="cc-w wc" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wc' } })); }}><span className="cc-wi"><i className="ct-ic wc" /></span><b>WeChat</b><small>{T('A person replies')}</small></button>
          </div>
          <div className="cc-more">
            <a href={'tel:' + site.contact.storeTel}>{T('Call')}</a><i />
            <a href={'mailto:' + site.contact.email}>{T('E-mail')}</a><i />
            <a href={site.contact.mapsLink} target="_blank" rel="noopener noreferrer">{T('Visit')}</a>
          </div>
        </>)}
      </div>
    </div>
  );
}
