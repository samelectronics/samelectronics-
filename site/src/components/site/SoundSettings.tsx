'use client';
// R11 · the sound settings shared by the Settings panel and My Bench › Profile & settings: site sounds, volume, pack,
// Samsoom's voice (on/off and the voice style, with a preview) and the currency.
import React, { useEffect, useState } from 'react';
import { prefs, setPrefs, type Pack, type Voice, type Currency } from '@/lib/prefs';
import { play } from '@/lib/sound';
import { T } from './ui';

export default function SoundSettings({ currency = true }: { currency?: boolean }) {
  const [p, setP] = useState(prefs());
  useEffect(() => { const f = () => setP({ ...prefs() }); window.addEventListener('se:prefs', f); return () => window.removeEventListener('se:prefs', f); }, []);
  const snd = p.sound, set = (x: Partial<typeof snd>) => setPrefs({ sound: { ...snd, ...x } });
  const sw = (on: boolean, f: (v: boolean) => void, l: string) => <button type="button" role="switch" aria-checked={on} aria-label={l} className={'ss-sw' + (on ? ' on' : '')} onClick={() => f(!on)}><i /></button>;
  return (
    <div className="ss-set">
      <div className="ss-row"><span><b>{T('Sounds')}</b><small>{T('Soft clicks and chimes on buttons and notifications.')}</small></span>{sw(snd.on, (v) => set({ on: v }), T('Sounds'))}</div>
      <div className="ss-row"><span><b>{T('Volume')}</b></span><input type="range" min={0} max={1} step={0.05} value={snd.vol} onChange={(e) => set({ vol: +e.target.value })} onPointerUp={() => play('click', true)} aria-label={T('Volume')} /></div>
      <div className="ss-row"><span><b>{T('Sound pack')}</b></span><span className="ss-seg">{(['classic', 'soft', 'studio'] as Pack[]).map((k) => <button key={k} type="button" className={snd.pack === k ? 'on' : ''} data-no-sound="" onClick={() => { set({ pack: k }); window.setTimeout(() => play('success', true), 30); }}>{T(k[0].toUpperCase() + k.slice(1))}</button>)}</span></div>
      <div className="ss-row"><span><b>{T('Samsoom’s voice')}</b><small>{T('He babbles softly while he talks and during page tours.')}</small></span>{sw(snd.talk !== false, (v) => set({ talk: v }), T('Samsoom’s voice'))}</div>
      <div className="ss-row"><span><b>{T('Voice style')}</b></span><span className="ss-seg">{([['cute', 'Cute'], ['deep', 'Deeper'], ['robot', 'Robot']] as [Voice, string][]).map(([k, l]) => <button key={k} type="button" className={(snd.voice || 'cute') === k ? 'on' : ''} data-no-sound="" onClick={() => { set({ voice: k, talk: true }); window.setTimeout(() => import('@/lib/voice').then((m) => m.preview(k)), 30); }}>{T(l)}</button>)}</span></div>
      {currency ? <div className="ss-row"><span><b>{T('Currency')}</b></span><span className="ss-seg">{(['AED', 'USD', 'EUR'] as Currency[]).map((c) => <button key={c} type="button" className={p.currency === c ? 'on' : ''} onClick={() => { setPrefs({ currency: c }); window.dispatchEvent(new CustomEvent('se:catalog')); }}>{c}</button>)}</span></div> : null}
    </div>
  );
}
