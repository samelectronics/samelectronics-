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
  const [wm, setWm] = useState<{ ref: string; at: number } | null>(null), [refId, setRefId] = useState('');
  const [now, setNow] = useState('');
  useEffect(() => { import('@/lib/ids').then((m) => setRefId(m.customerId())).catch(() => {}); const tick = () => setNow(new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })); tick(); const iv = window.setInterval(tick, 30000); return () => window.clearInterval(iv); }, []);
  useEffect(() => { try { const v = JSON.parse(sessionStorage.getItem('se-shot-ok') || 'null'); if (v && v.ref) setWm(v); } catch { /* */ } }, []);
  // owner (R10): the agreement lasts 10 minutes; after that the next screenshot asks for it again (one tap)
  const okNow = () => { try { const v = JSON.parse(sessionStorage.getItem('se-shot-ok') || 'null'); return !!(v && v.at && Date.now() - v.at < 10 * 60e3); } catch { return false; } };
  const allow = () => { const ref = 'SC-' + Date.now().toString(36).toUpperCase().slice(-6); const v = { ref, at: Date.now() }; try { sessionStorage.setItem('se-shot-ok', JSON.stringify(v)); } catch { /* */ } setWm(v); setTerms(false); setAgree(false); logWarning('screenshot', 'screenshot terms accepted · agreement ' + ref); import('./Toaster').then((m) => m.toast(tr('Screenshots allowed. Each one carries our watermark.'))).catch(() => {}); };
  useEffect(() => {
    if (isEmbed()) return;
    // 1. VPN check (owner, 19 Nov: "not detected, not instantly and not even after a long wait"). It runs ~1s after load,
    //    again whenever the visitor comes back to the tab or the connection returns, and every 45s, so switching a VPN
    //    on mid-visit is caught too. Any real gap of an hour or more between the connection's time zone and the device's
    //    clock counts. One notice per detected location; "I am travelling" silences it for the visit. Never in the Control Room.
    let vpnTimer = 0, busy = false;
    const offAt = (tz: string) => { try { const v = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date()).find((x) => x.type === 'timeZoneName')?.value || ''; if (v === 'GMT') return 0; const m = v.match(/GMT([+-]\d+)(?::(\d+))?/); return m ? +m[1] + (m[2] ? Math.sign(+m[1]) * +m[2] / 60 : 0) : null; } catch { return null; } };
    const check = () => {
      if (busy || location.pathname.startsWith('/staff') || document.visibilityState === 'hidden') return;
      let quiet = false; try { quiet = sessionStorage.getItem('se-vpn-ok') === '1'; } catch { /* */ } if (quiet) return;
      busy = true;
      fetch('/api/geo', { cache: 'no-store' }).then((r) => r.json()).then((g: { tz: string | null; cc?: string | null }) => {
        if (!g || !g.tz) return; const here = Intl.DateTimeFormat().resolvedOptions().timeZone; if (!here || here === g.tz) return;
        const ipOff = offAt(g.tz), dev = -new Date().getTimezoneOffset() / 60; if (ipOff == null) return;
        if (Math.abs(ipOff - dev) < 1) return; // same clock, a neighbouring zone name: not a VPN
        let last = ''; try { last = sessionStorage.getItem('se-vpn-tz') || ''; } catch { /* */ } if (last === g.tz) return;
        try { sessionStorage.setItem('se-vpn-tz', g.tz); } catch { /* */ }
        setVpn(true); whistle(); logWarning('vpn', 'connection ' + g.tz + (g.cc ? ' (' + g.cc + ')' : '') + ' · device ' + here + ' · gap ' + Math.abs(ipOff - dev) + 'h');
      }).catch(() => { /* offline or not on Vercel */ }).finally(() => { busy = false; });
    };
    const vis = () => { if (document.visibilityState === 'visible') check(); };
    if (!location.pathname.startsWith('/staff')) {
      window.setTimeout(check, 1200); vpnTimer = window.setInterval(check, 45000);
      document.addEventListener('visibilitychange', vis); window.addEventListener('online', check); window.addEventListener('focus', check);
    }
    // 2. screenshot keys
    // owner (19 Nov): once screenshots are allowed the watermark is NOT on screen all the time; it appears only when a
    // screenshot is being taken. The moment the screenshot shortcut starts (Cmd+Shift on a Mac, Win+Shift on Windows) it
    // is already showing, before the capture key; a snipping tool taking focus shows it too. It fades after a few seconds.
    // owner (R10): the watermark must ALWAYS be on the capture. It is always in the page (allowed or not) and switches on
    // synchronously in the very first key handler (a class on <html>, no React render in between); a "hang tight" card
    // covers the page for a moment while it settles, and the warning sound always plays.
    // owner (R11): "the hang-tight card should only be a back-up, now it appears all the time and the laptop freezes on it".
    // The watermark (always in the page) switches on instantly and alone; the covering card only appears when the
    // visitor has NOT agreed to the screenshot terms (it protects the page), and it always clears itself.
    let ft = 0, ht = 0, holdAt = 0;
    const clearHold = (e?: Event) => { if (e && performance.now() - holdAt < 450) return; document.documentElement.classList.remove('shot-hold'); window.clearTimeout(ht); };
    const flashWm = (hold = false) => { const h = document.documentElement; h.classList.add('shot-on'); if (hold) { holdAt = performance.now(); h.classList.add('shot-hold'); window.clearTimeout(ht); ht = window.setTimeout(clearHold, 900); } window.clearTimeout(ft); ft = window.setTimeout(() => h.classList.remove('shot-on'), 5000); };
    const pre = (e: KeyboardEvent) => { if ((e.metaKey && e.shiftKey && (e.key === 'Meta' || e.key === 'Shift' || /^[345s]$/i.test(e.key))) || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') || e.key === 'PrintScreen' || e.code === 'PrintScreen') flashWm(true); };
    ['pointermove', 'focus', 'keyup'].forEach((ev) => window.addEventListener(ev, clearHold, { passive: true }));
    // owner (R11): "I took two screenshots and nothing showed". On Windows, Win+Shift+S opens the snipping tool, which takes
    // the focus before the page ever sees the S. So: the shortcut's first keys (Win/⌘ + Shift), then the page losing focus
    // within 1.5 s, IS a screenshot. A plain window switch (no shortcut keys first) never counts.
    let combo = 0;
    const arm = (e: KeyboardEvent) => { if ((e.metaKey || e.key === 'Meta' || e.key === 'OS') && (e.shiftKey || e.key === 'Shift')) combo = performance.now(); };
    const lost = () => { if (combo && performance.now() - combo < 1500) { combo = 0; seen(); } };
    window.addEventListener('keydown', arm, true); window.addEventListener('blur', lost);
    window.addEventListener('keydown', pre, true);
    const seen = () => {
      flashWm(true); import('@/lib/sound').then((m) => m.play('warn', true)).catch(() => {});
      if (okNow()) { logWarning('screenshot', 'screenshot taken under the screenshot terms'); return; }
      setShot(true);
      logWarning('screenshot', 'keys pressed on ' + (navigator.platform || 'computer'));
    };
    const down = (e: KeyboardEvent) => { if (e.key === 'Escape') { setShot(false); setVpn(false); return; } const k = e.key.toLowerCase(); if ((e.metaKey && e.shiftKey && ['3', '4', '5', 's'].includes(k)) || (e.ctrlKey && e.shiftKey && k === 's' && navigator.platform.startsWith('Win'))) seen(); };
    const up = (e: KeyboardEvent) => { if (e.key === 'PrintScreen' || e.code === 'PrintScreen') seen(); };
    window.addEventListener('keydown', down, true); window.addEventListener('keyup', up, true);
    return () => { window.removeEventListener('keydown', pre, true); ['pointermove', 'focus', 'keyup'].forEach((ev) => window.removeEventListener(ev, clearHold)); window.removeEventListener('keydown', arm, true); window.removeEventListener('blur', lost); window.clearTimeout(ft); window.clearTimeout(ht); window.removeEventListener('keydown', down, true); window.removeEventListener('keyup', up, true); window.clearInterval(vpnTimer); document.removeEventListener('visibilitychange', vis); window.removeEventListener('online', check); window.removeEventListener('focus', check); };
  }, []);
  return (
    <>
      {vpn ? <SysNote tone="warn" snd="none" role="alert" sam={{ mood: 'stop' }} kicker={tr('SAMSOOM · HOLD ON')} title={tr('Hey! Is that a VPN?')} text={tr('Prices and delivery depend on where you really are. Please switch the VPN off.')} ms={20000} onClose={() => setVpn(false)}
        acts={[{ label: tr('OK, I will switch it off'), primary: true }, { label: tr('I am travelling, carry on'), on: () => { try { sessionStorage.setItem('se-vpn-ok', '1'); } catch { /* */ } } }, { label: tr('Why am I seeing this?'), href: '/notices#vpn', link: true }]} /> : null}
      {shot ? <SysNote tone="stop" role="alert" sam={{ mood: 'nono' }} kicker={tr('COPYRIGHT NOTICE')} title={tr('This content is protected.')} text={tr('Keeping it for yourself is fine; sharing or publishing it needs our permission.')} ms={30000} onClose={() => setShot(false)}
        acts={[{ label: tr('I understand'), primary: true }, { label: tr('Allow screenshots'), on: () => setTerms(true) }, { label: tr('Read the full notice'), href: '/notices#copyright', link: true }]} /> : null}
      {terms ? (
        <div className="sn2-veil" onClick={(e) => { if (e.target === e.currentTarget) setTerms(false); }}>
          <div className="sn2 sn2-warn shot-terms" role="dialog" aria-modal="true" aria-label={tr('Screenshot terms')}>
            <span className="sn2-sam" aria-hidden="true"><LiveSam fit size={92} pose="think" /></span>
            <b className="sn2-h">{tr('Screenshot terms')}</b>
            {/* owner (19 Nov): a short overview; the full terms are one small yellow link away */}
            <p className="sn2-p st-sum">{tr('Screenshots are for your own use, and every one carries our watermark. Sharing or publishing them needs our permission.')} <a className="sn2-ln y" href="/notices#copyright" target="_blank" rel="noopener">{tr('Read the full terms')}</a></p>
            <label className="st-agree"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>{tr('I agree to the screenshot terms')}</span></label>
            <span className="sn2-acts"><button type="button" className="sn2-b y" disabled={!agree} onClick={allow}>{tr('Allow screenshots')}</button><button type="button" className="sn2-b" onClick={() => setTerms(false)}>{tr('Cancel')}</button></span>
          </div>
        </div>
      ) : null}
      {/* always in the page; shown only while a screenshot is being taken (html.shot-on) */}
      <div className="shot-wm" aria-hidden="true" data-no-i18n="">
        <span className="tile" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='360' height='200'><text x='20' y='110' transform='rotate(-24 180 100)' font-family='Inter,Arial' font-size='16' font-weight='700' fill='%23808080'>© Sam Electronics</text></svg>`).replace(/%2523/g, '%23')}")` }} />
        <span className="foot"><img src="/assets/se-logo-metal-128.webp" alt="" /><b>© Sam Electronics</b><span>{tr('All rights reserved')} · {tr('Captured on')} {now}</span><em>{wm ? tr('Agreement') + ' ' + wm.ref : tr('Not agreed')}</em><em>Ref {refId}</em></span>
      </div>
      <div className="shot-holdc" aria-hidden="true"><span className="shc"><span className="lg"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" pathLength="100" /></svg><img src="/assets/se-logo-metal-128.webp" alt="" /></span><small className="k">{tr('COPYRIGHT NOTICE')}</small><b>{tr('Hang tight…')}</b><small>{tr('This page is protected by Sam Electronics.')}</small><i className="bar" /></span></div>
    </>
  );
}
