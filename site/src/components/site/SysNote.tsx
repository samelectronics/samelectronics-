'use client';
// Owner (17 Nov): "the VPN and screenshot notices don't match the other notifications, they look weird and not serious.
// The wifi ones too: they should all appear and look the same, in the same position." One system notice for every
// state: a white card under the header (where the medal notice appears), a small tile on the left (an icon, or Samsoom
// with a badge), a kicker, a title, one short line, the actions, × and a thin bar that runs down until it closes itself.
import React, { useEffect, useState } from 'react';
import LiveSam from '@/components/samsoom/LiveSam';

export type Tone = 'info' | 'ok' | 'warn' | 'stop';
type Act = { label: string; href?: string; on?: () => void; primary?: boolean };
export type SysNoteProps = { tone: Tone; kicker: string; title: string; text?: string; acts?: Act[]; onClose: () => void; ms?: number; icon?: 'wifi' | 'wifi-off' | 'wifi-slow'; sam?: { badge: 'whistle' | 'copy'; mood: string }; role?: 'status' | 'alert' };

const WIFI = (k: 'wifi' | 'wifi-off' | 'wifi-slow') => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {k !== 'wifi-slow' ? <path d="M2 8.8a15 15 0 0 1 20 0" opacity={k === 'wifi-off' ? 0.35 : 1} /> : <path d="M2 8.8a15 15 0 0 1 20 0" opacity=".25" />}
    <path d="M5.5 12.3a10 10 0 0 1 13 0" opacity={k === 'wifi-off' ? 0.35 : k === 'wifi-slow' ? 0.25 : 1} />
    <path d="M9 15.8a5 5 0 0 1 6 0" opacity={k === 'wifi-off' ? 0.35 : 1} /><circle cx="12" cy="19" r="1" fill="currentColor" />
    {k === 'wifi-off' ? <path d="M3 3l18 18" /> : null}
  </svg>
);

export default function SysNote({ tone, kicker, title, text, acts = [], onClose, ms = 12000, icon, sam, role = 'status' }: SysNoteProps) {
  const [out, setOut] = useState(false);
  const close = () => { setOut(true); window.setTimeout(onClose, 220); };
  useEffect(() => { if (!ms) return; const t = window.setTimeout(close, ms); return () => window.clearTimeout(t); }, [ms]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  return (
    <div className={'sn sn-' + tone + (out ? ' out' : '')} role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'}>
      <span className={'sn-tile' + (sam ? ' sam' : '')} aria-hidden="true">
        {sam ? <LiveSam size={40} mood="idle" play={sam.mood} /> : icon ? WIFI(icon) : null}
        {sam ? <i className={'sn-badge ' + sam.badge}>{sam.badge === 'copy' ? '©' : <svg viewBox="0 0 40 24" width="18" height="11"><path d="M2 10h16a9 9 0 1 1 0 6H2z" fill="#fff" /><circle cx="25" cy="13" r="3.2" fill="#E5484D" /></svg>}</i> : null}
      </span>
      <span className="sn-body">
        <small className="sn-k"><i className="sn-dot" />{kicker}</small>
        <b className="sn-h">{title}</b>
        {text ? <span className="sn-p">{text}</span> : null}
        {acts.length ? (
          <span className="sn-acts">
            {acts.map((a) => (a.href ? <a key={a.label} className={'sn-b' + (a.primary ? ' y' : '')} href={a.href} onClick={() => a.on?.()}>{a.label}</a> : <button key={a.label} type="button" className={'sn-b' + (a.primary ? ' y' : '')} onClick={() => { a.on?.(); close(); }}>{a.label}</button>))}
          </span>
        ) : null}
      </span>
      <button type="button" className="sn-x" aria-label="Close" onClick={close}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      {ms ? <em className="sn-t" style={{ animationDuration: ms + 'ms' }} aria-hidden="true" /> : null}
    </div>
  );
}
