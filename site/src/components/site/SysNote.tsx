'use client';
// Owner (17 Nov): "the VPN and screenshot notices don't match the other notifications, they look weird and not serious.
// The wifi ones too: they should all appear and look the same, in the same position." One system notice for every
// state: a white card under the header (where the medal notice appears), a small tile on the left (an icon, or Samsoom
// with a badge), a kicker, a title, one short line, the actions, × and a thin bar that runs down until it closes itself.
import React, { useEffect, useState } from 'react';
import LiveSam from '@/components/samsoom/LiveSam';

export type Tone = 'info' | 'ok' | 'warn' | 'stop';
type Act = { label: string; href?: string; on?: () => void; primary?: boolean };
export type SysNoteProps = { tone: Tone; kicker: string; title: string; text?: string; acts?: Act[]; onClose: () => void; ms?: number; icon?: 'wifi' | 'wifi-off' | 'wifi-slow'; sam?: { mood: string; badge?: string }; role?: 'status' | 'alert'; snd?: 'warn' | 'oops' | 'success' | 'notify' | 'none' };

const WIFI = (k: 'wifi' | 'wifi-off' | 'wifi-slow') => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {k !== 'wifi-slow' ? <path d="M2 8.8a15 15 0 0 1 20 0" opacity={k === 'wifi-off' ? 0.35 : 1} /> : <path d="M2 8.8a15 15 0 0 1 20 0" opacity=".25" />}
    <path d="M5.5 12.3a10 10 0 0 1 13 0" opacity={k === 'wifi-off' ? 0.35 : k === 'wifi-slow' ? 0.25 : 1} />
    <path d="M9 15.8a5 5 0 0 1 6 0" opacity={k === 'wifi-off' ? 0.35 : 1} /><circle cx="12" cy="19" r="1" fill="currentColor" />
    {k === 'wifi-off' ? <path d="M3 3l18 18" /> : null}
  </svg>
);

export default function SysNote({ tone, kicker, title, text, acts = [], onClose, ms = 12000, icon, sam, role = 'status', snd }: SysNoteProps) {
  const [out, setOut] = useState(false);
  // owner (18 Nov): serious alerts sound like a warning, connection problems like a soft error
  useEffect(() => { const k = snd || (tone === 'stop' ? 'warn' : icon === 'wifi-off' || icon === 'wifi-slow' ? 'oops' : tone === 'ok' ? 'success' : 'notify'); if (k !== 'none') import('@/lib/sound').then((m) => m.play(k)).catch(() => {}); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const close = () => { setOut(true); window.setTimeout(onClose, 220); };
  useEffect(() => { if (!ms) return; const t = window.setTimeout(close, ms); return () => window.clearTimeout(t); }, [ms]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  // owner (18 Nov, round 2): "look how simple and nice the Samsoom tutorial is". Every system notice is now that card:
  // Samsoom in his yellow circle sitting on top, one clear title, one line, the buttons. No kicker label, no tiny logo,
  // no hazard stripe. Serious notices (copyright, VPN) sit in the middle over a soft veil; connection notices float
  // at the bottom without blocking the page.
  const serious = tone === 'stop' || tone === 'warn';
  const pose = sam?.mood || (icon === 'wifi-off' ? 'sad' : icon === 'wifi-slow' ? 'think' : tone === 'ok' ? 'happy' : 'idle');
  const card = (
    <div className={'sn2 sn2-' + tone + (out ? ' out' : '')} role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'} aria-label={kicker}>
      <span className="sn2-sam" aria-hidden="true"><LiveSam size={92} pose={pose} />{icon ? <i className={'sn2-badge ' + icon}>{WIFI(icon)}</i> : null}</span>
      <b className="sn2-h">{title}</b>
      {text ? <p className="sn2-p">{text}</p> : null}
      {acts.length ? (
        <span className="sn2-acts">
          {acts.map((a) => (a.href ? <a key={a.label} className={'sn2-b' + (a.primary ? ' y' : '')} href={a.href} onClick={() => a.on?.()}>{a.label}</a> : <button key={a.label} type="button" className={'sn2-b' + (a.primary ? ' y' : '')} onClick={() => { a.on?.(); close(); }}>{a.label}</button>))}
        </span>
      ) : null}
      <button type="button" className="sn2-x" aria-label="Close" onClick={close}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      {ms ? <em className="sn2-t" style={{ animationDuration: ms + 'ms' }} aria-hidden="true" /> : null}
    </div>
  );
  return serious ? <div className={'sn2-veil' + (out ? ' out' : '')} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>{card}</div> : <div className="sn2-dock">{card}</div>;
}
