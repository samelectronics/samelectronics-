'use client';
// Owner (15 Nov): "WeChat us" next to WhatsApp. WeChat has no public chat link by number, so this sheet shows the
// number to add, a one-tap copy, and opens the WeChat app. For now the WeChat number is the WhatsApp number.
import React, { useEffect, useState } from 'react';
import { play } from '@/lib/sound';

export const WECHAT = { number: '+971 50 342 0015', raw: '971503420015' };

export default function WeChatSheet() {
  const [open, setOpen] = useState(false), [copied, setCopied] = useState(false);
  useEffect(() => {
    const on = () => { setCopied(false); setOpen(true); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('se:wechat', on); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:wechat', on); document.removeEventListener('keydown', esc); };
  }, []);
  if (!open) return null;
  const copy = async () => { try { await navigator.clipboard.writeText(WECHAT.number); } catch {} setCopied(true); play('success'); };
  return (
    <div className="wc-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="wc-card" role="dialog" aria-modal="true" aria-label="WeChat us">
        <button type="button" className="wc-x" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
        <span className="wc-ic" aria-hidden="true"><i /></span>
        <b className="wc-h">WeChat us</b>
        <p className="wc-p">Add our number in WeChat and send us a message. We reply in Arabic, English and Chinese.</p>
        <span className="wc-num" dir="ltr">{WECHAT.number}</span>
        <div className="wc-acts">
          <button type="button" className="wc-btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy number'}</button>
          <a className="wc-btn go" href="weixin://" onClick={copy}>Open WeChat</a>
        </div>
      </div>
    </div>
  );
}
