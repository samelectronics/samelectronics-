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
import SysNote from './SysNote';
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

export default function Guard() {
  const [vpn, setVpn] = useState(false), [shot, setShot] = useState(false), [terms, setTerms] = useState(false), [agree, setAgree] = useState(false);
  // owner (18 Nov night): screenshots can be allowed once the visitor agrees to the terms; from then on the page carries a
  // faint watermark (© Sam Electronics, all rights reserved, the date and the agreement number) on every screenshot
  const [wm, setWm] = useState<{ ref: string; at: number } | null>(null);
  useEffect(() => { try { const v = JSON.parse(sessionStorage.getItem('se-shot-ok') || 'null'); if (v && v.ref) setWm(v); } catch { /* */ } }, []);
  const allow = () => { const ref = 'SC-' + Date.now().toString(36).toUpperCase().slice(-6); const v = { ref, at: Date.now() }; try { sessionStorage.setItem('se-shot-ok', JSON.stringify(v)); } catch { /* */ } setWm(v); setTerms(false); setAgree(false); logWarning('screenshot', 'screenshot terms accepted · agreement ' + ref); import('./Toaster').then((m) => m.toast(tr('Screenshots allowed. Each one carries our watermark.'))).catch(() => {}); };
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
      let ok = false; try { ok = !!sessionStorage.getItem('se-shot-ok'); } catch { /* */ }
      if (ok) { logWarning('screenshot', 'screenshot taken under the screenshot terms'); return; }
      setShot(true);
      logWarning('screenshot', 'keys pressed on ' + (navigator.platform || 'computer'));
    };
    const down = (e: KeyboardEvent) => { if (e.key === 'Escape') { setShot(false); setVpn(false); return; } const k = e.key.toLowerCase(); if ((e.metaKey && e.shiftKey && ['3', '4', '5', 's'].includes(k)) || (e.ctrlKey && e.shiftKey && k === 's' && navigator.platform.startsWith('Win'))) seen(); };
    const up = (e: KeyboardEvent) => { if (e.key === 'PrintScreen' || e.code === 'PrintScreen') seen(); };
    window.addEventListener('keydown', down, true); window.addEventListener('keyup', up, true);
    return () => { window.removeEventListener('keydown', down, true); window.removeEventListener('keyup', up, true); };
  }, []);
  return (
    <>
      {vpn ? <SysNote tone="warn" snd="none" role="alert" sam={{ mood: 'stop' }} kicker={tr('SAMSOOM · HOLD ON')} title={tr('Hey! Is that a VPN?')} text={tr('Prices and delivery depend on where you really are. Please switch the VPN off.')} ms={20000} onClose={() => setVpn(false)}
        acts={[{ label: tr('OK, I will switch it off'), primary: true }, { label: tr('I am travelling, carry on') }, { label: tr('Why am I seeing this?'), href: '/notices#vpn' }]} /> : null}
      {shot ? <SysNote tone="stop" role="alert" sam={{ mood: 'nono' }} kicker={tr('COPYRIGHT NOTICE')} title={tr('This content is protected.')} text={tr('Keeping it for yourself is fine; sharing or publishing it needs our permission.')} ms={15000} onClose={() => setShot(false)}
        acts={[{ label: tr('I understand'), primary: true }, { label: tr('Allow screenshots'), on: () => setTerms(true) }, { label: tr('Read the full notice'), href: '/notices#copyright' }]} /> : null}
      {terms ? (
        <div className="sn2-veil" onClick={(e) => { if (e.target === e.currentTarget) setTerms(false); }}>
          <div className="sn2 sn2-warn shot-terms" role="dialog" aria-modal="true" aria-label={tr('Screenshot terms')}>
            <span className="sn2-sam" aria-hidden="true"><LiveSam size={92} pose="think" /></span>
            <b className="sn2-h">{tr('Screenshot terms')}</b>
            <ul className="st-list">
              <li>{tr('Screenshots are for your own use only, for example to remember a part or to send it to your technician.')}</li>
              <li>{tr('Publishing, reselling or editing them, or using our photos and prices elsewhere, needs our written permission.')}</li>
              <li>{tr('Every screenshot carries our watermark with the date and your agreement number.')}</li>
            </ul>
            <label className="st-agree"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>{tr('I agree to the screenshot terms')}</span></label>
            <span className="sn2-acts"><button type="button" className="sn2-b y" disabled={!agree} onClick={allow}>{tr('Allow screenshots')}</button><button type="button" className="sn2-b" onClick={() => setTerms(false)}>{tr('Cancel')}</button></span>
          </div>
        </div>
      ) : null}
      {wm ? (
        <div className="shot-wm" aria-hidden="true" data-no-i18n="">
          <span className="tile" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='420' height='220'><text x='10' y='120' transform='rotate(-24 210 110)' font-family='Inter,Arial' font-size='15' font-weight='600' fill='%23808080'>© Sam Electronics · ${wm.ref}</text></svg>`).replace(/%2523/g, '%23')}")` }} />
          <span className="side">© Sam Electronics · {tr('All rights reserved')} · {tr('Captured on')} {new Date().toLocaleDateString()} · {tr('Agreement')} {wm.ref}</span>
        </div>
      ) : null}
    </>
  );
}
