'use client';
// Owner (17 Nov):
//  1. VPN: if the connection's time zone and the device's clock disagree by 2 hours or more, the visitor is most likely on
//     a VPN. Samsoom pops in, blows his whistle and tells them (once per visit). Travellers can carry on with one tap.
//  2. Screenshots: browsers can only see the screenshot keys on computers (Print Screen, ⌘⇧3/4/5, Win+Shift+S), not
//     the phone buttons. When we see one, a copyright notice appears and the team gets a note in the inbox (at most
//     one a minute). Works on the website and in the Control Room.
import React, { useEffect, useState } from 'react';
import { isEmbed } from '@/lib/embed';
import { prefs } from '@/lib/prefs';
import LiveSam from '@/components/samsoom/LiveSam';
import { logWarning } from '@/lib/warnings';

const tr = (s: string) => (typeof window !== 'undefined' && (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n?.t(s)) || s;
const offsetOf = (tz: string) => { try { const d = new Date(), s = d.toLocaleString('en-US', { timeZone: tz, hour12: false }); return Math.round((new Date(s).getTime() - new Date(d.toLocaleString('en-US', { hour12: false })).getTime()) / 36e5) + -d.getTimezoneOffset() / 60; } catch { return null; } };

function whistle() {
  try {
    const p = prefs().sound; if (!p.on) return;
    const c = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(), t = c.currentTime, g = c.createGain(); g.gain.value = 0.0001; g.connect(c.destination);
    const o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(); o.type = 'sine'; lfo.frequency.value = 38; lg.gain.value = 70; lfo.connect(lg); lg.connect(o.frequency);
    o.frequency.setValueAtTime(2300, t); o.frequency.setValueAtTime(2300, t + 0.32); o.frequency.linearRampToValueAtTime(2900, t + 0.42); o.frequency.setValueAtTime(2900, t + 0.95);
    g.gain.exponentialRampToValueAtTime(0.12 * Math.max(0.3, p.vol), t + 0.03); g.gain.setValueAtTime(0.12 * Math.max(0.3, p.vol), t + 0.3); g.gain.exponentialRampToValueAtTime(0.02, t + 0.36); g.gain.exponentialRampToValueAtTime(0.14 * Math.max(0.3, p.vol), t + 0.42); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    o.connect(g); o.start(t); lfo.start(t); o.stop(t + 1.05); lfo.stop(t + 1.05); window.setTimeout(() => c.close(), 1400);
  } catch { /* no audio */ }
}

/** a short, soft system "error" double beep (screenshot notice) */
function errBeep() {
  try { const p = prefs().sound; if (!p.on) return; const c = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(), t = c.currentTime;
    [0, 0.16].forEach((d, i) => { const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter(); o.type = 'square'; o.frequency.value = i ? 392 : 523; f.type = 'lowpass'; f.frequency.value = 1800; g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.05 * Math.max(0.3, p.vol), t + d + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.14); o.connect(f); f.connect(g); g.connect(c.destination); o.start(t + d); o.stop(t + d + 0.16); });
    window.setTimeout(() => c.close(), 600); } catch { /* */ } }

/** Samsoom in a notice: blows his little red whistle (or raises the alarm), looks surprised, then keeps emoting */
function SamAlarm({ kind }: { kind: 'vpn' | 'copy' }) {
  const [ph, setPh] = useState(0);
  useEffect(() => { const a = window.setTimeout(() => setPh(1), 1100), b = window.setTimeout(() => setPh(2), 2600); return () => { window.clearTimeout(a); window.clearTimeout(b); }; }, []);
  return (
    <span className={'gd-sam ph' + ph + ' ' + kind} aria-hidden="true">
      <LiveSam size={86} mood={ph === 2 ? 'think' : 'idle'} play={ph === 0 ? 'blush' : ph === 1 ? 'wow' : 'happy'} />
      {kind === 'vpn'
        ? <i className="gd-whistle"><svg viewBox="0 0 40 24" width="34" height="20"><path d="M2 10h16a9 9 0 1 1 0 6H2z" fill="#E5484D" stroke="#9E1F23" strokeWidth="1.2" /><circle cx="25" cy="13" r="3.4" fill="#9E1F23" /><rect x="6" y="6" width="5" height="4" rx="1" fill="#E5484D" stroke="#9E1F23" strokeWidth="1" /></svg></i>
        : <i className="gd-alert">!</i>}
      <i className="gd-wv a" /><i className="gd-wv b" />
      {ph >= 1 ? <i className="gd-surprise">!?</i> : null}
    </span>
  );
}

export default function Guard() {
  const [vpn, setVpn] = useState(false), [shot, setShot] = useState(false);
  useEffect(() => {
    if (isEmbed()) return;
    // 1. VPN check, once per visit, never in the Control Room
    if (!location.pathname.startsWith('/staff')) {
      let done = false; try { done = sessionStorage.getItem('se-geo') === '1'; } catch { /* */ }
      if (!done) {
        try { sessionStorage.setItem('se-geo', '1'); } catch { /* */ }
        window.setTimeout(() => {
          fetch('/api/geo', { cache: 'no-store' }).then((r) => r.json()).then((g: { tz: string | null }) => {
            if (!g || !g.tz) return; const here = Intl.DateTimeFormat().resolvedOptions().timeZone; if (!here || here === g.tz) return;
            const a = offsetOf(g.tz), b = -new Date().getTimezoneOffset() / 60; if (a == null) return;
            const ipOff = (() => { try { const d = new Date(); const s = new Intl.DateTimeFormat('en-US', { timeZone: g.tz!, timeZoneName: 'shortOffset' }).formatToParts(d).find((x) => x.type === 'timeZoneName')?.value || ''; const m = s.match(/GMT([+-]\d+)(?::(\d+))?/); return m ? +m[1] + (m[2] ? Math.sign(+m[1]) * +m[2] / 60 : 0) : s === 'GMT' ? 0 : null; } catch { return null; } })();
            if (ipOff == null) return; if (Math.abs(ipOff - b) >= 2) { setVpn(true); whistle(); logWarning('vpn', 'connection ' + g.tz + ' · device ' + here); }
          }).catch(() => { /* offline or not on Vercel */ });
        }, 4000);
      }
    }
    // 2. screenshot keys
    const seen = () => {
      setShot(true);
      logWarning('screenshot', 'keys pressed on ' + (navigator.platform || 'computer')); errBeep();
    };
    const down = (e: KeyboardEvent) => { if (e.key === 'Escape') { setShot(false); setVpn(false); return; } const k = e.key.toLowerCase(); if ((e.metaKey && e.shiftKey && ['3', '4', '5', 's'].includes(k)) || (e.ctrlKey && e.shiftKey && k === 's' && navigator.platform.startsWith('Win'))) seen(); };
    const up = (e: KeyboardEvent) => { if (e.key === 'PrintScreen' || e.code === 'PrintScreen') seen(); };
    window.addEventListener('keydown', down, true); window.addEventListener('keyup', up, true);
    return () => { window.removeEventListener('keydown', down, true); window.removeEventListener('keyup', up, true); };
  }, []);
  return (
    <>
      {vpn ? (
        <div className="gd-veil" role="dialog" aria-modal="true" aria-label={tr('VPN detected')}>
          <div className="gd-card">
            <SamAlarm kind="vpn" />
            <span className="gd-k">{tr('SAMSOOM · HOLD ON')}</span>
            <b className="gd-h">{tr('Hey! Is that a VPN?')}</b>
            <p className="gd-p">{tr('Prices and delivery depend on where you really are. Please switch the VPN off.')}</p>
            <a className="gd-more" href="/notices#vpn">{tr('Why am I seeing this?')} →</a>
            <div className="gd-acts">
              <button type="button" className="gd-b y" onClick={() => setVpn(false)}>{tr('OK, I will switch it off')}</button>
              <button type="button" className="gd-b" onClick={() => setVpn(false)}>{tr('I am travelling, carry on')}</button>
            </div>
          </div>
        </div>
      ) : null}
      {shot ? (
        <div className="gd-veil" role="alertdialog" aria-modal="true" aria-label={tr('Copyright notice')} onClick={(e) => { if (e.target === e.currentTarget) setShot(false); }}>
          <div className="gd-card">
            <SamAlarm kind="copy" />
            <span className="gd-k">{tr('COPYRIGHT NOTICE')}</span>
            <b className="gd-h">{tr('This content is protected.')}</b>
            <p className="gd-p">{tr('Keeping it for yourself is fine; sharing or publishing it needs our permission.')}</p>
            <p className="gd-s">{tr('If you took it for another reason, you can safely ignore this message.')}</p>
            <a className="gd-more" href="/notices#copyright">{tr('Read the full notice')} →</a>
            <div className="gd-acts"><button type="button" className="gd-b y" onClick={() => setShot(false)}>{tr('I understand')}</button></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
