'use client';
// Owner (16 Nov): "Chat with us" always lets the visitor choose: Samsoom (instant answers, any time) or a real person
// from the shop, right here on the website (the live chat; every message lands in the staff inbox with the full history).
// Opened by the 'se:chatwith' event from every "Chat with us" button.
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';
import SESamsoom from '@/components/dc/SESamsoom';

const LiveChat = dynamic(() => import('@/components/info/ContactPage').then((m) => m.LiveChat), { ssr: false });
export const openChatChoice = () => window.dispatchEvent(new CustomEvent('se:chatwith'));

export default function ChatChoice() {
  const [open, setOpen] = useState(false), [mode, setMode] = useState<'' | 'person'>('');
  useEffect(() => {
    const on = () => { setMode(''); setOpen(true); play('open'); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('se:chatwith', on); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:chatwith', on); document.removeEventListener('keydown', esc); };
  }, []);
  if (!open) return null;
  return (
    <div className="wc-veil ct-veil cc-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className={'cc-card' + (mode ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={T('Chat with us')}>
        <button type="button" className="wc-x" aria-label={T('Close')} onClick={() => setOpen(false)}>✕</button>
        {mode === 'person' ? (<>
          <button type="button" className="cc-back" onClick={() => setMode('')}>← {T('Back')}</button>
          <LiveChat />
        </>) : (<>
          <b className="cc-h">{T('Chat with us')}</b>
          <p className="cc-p">{T('Who would you like to talk to?')}</p>
          <div className="cc-opts">
            <button type="button" className="cc-o sam" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:chat', { detail: {} })); }}>
              <span className="cc-ic"><SESamsoom mood="idle" size={40} still={true} /></span>
              <span><b>{T('Samsoom')}</b><small>{T('Instant answers, any time: parts, grades, prices, hours.')}</small></span><i>→</i>
            </button>
            <button type="button" className="cc-o person" onClick={() => setMode('person')}>
              <span className="cc-ic p"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg></span>
              <span><b>{T('A person from the shop')}</b><small>{T('Chat here with our team. We reply during opening hours.')}</small></span><i>→</i>
            </button>
          </div>
        </>)}
      </div>
    </div>
  );
}
