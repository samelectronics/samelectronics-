'use client';
// R9 · the visitor's controls, on every page:
//  · the cookie banner on the first visit (Accept all · Deny all · Choose), with the four friendly categories
//  · one Settings panel (event 'se:settings'): sound effects (on/off, volume, pack, preview), privacy choices, display
//    currency and a language shortcut
//  · the site's click sounds: every button and link gives a quiet blip; actions name their own sound with data-sound
//    ("add", "next", "back", "skip", "send"…); adding to the cart plays "add"
// Styles in src/styles/dc-base.css (.sc2-*).
import React, { useEffect, useState } from 'react';
import { prefs, setPrefs, type Currency, type Pack, type Prefs } from '@/lib/prefs';
import { play, type Snd } from '@/lib/sound';
import { installBrandSelects } from '@/lib/brandSelect';
import SitePromo from './SitePromo';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
const CATS: ['memory' | 'signal' | 'booster', string, string][] = [
  ['memory', 'Memory Chip', 'Remembers your preferences, saved searches and recent parts.'],
  ['signal', 'Signal Meter', 'Anonymous visit counts that help us improve the site.'],
  ['booster', 'Booster', 'Offers and ads that match what you look for.'],
];

function Switch({ on, set, label, locked }: { on: boolean; set?: (v: boolean) => void; label: string; locked?: boolean }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={'sc2-sw' + (on ? ' on' : '') + (locked ? ' lock' : '')} data-sound="toggle" onClick={() => !locked && set && set(!on)}><i /></button>;
}

export default function SiteControls() {
  const [p, setP] = useState<Prefs | null>(null), [banner, setBanner] = useState(false), [panel, setPanel] = useState<false | 'all' | 'privacy'>(false), [, force] = useState(0);
  const [inst, setInst] = useState<null | { prompt: () => void }>(null);
  const [draft, setDraft] = useState({ memory: true, signal: false, booster: false });
  useEffect(() => {
    installBrandSelects();
    const cur = prefs(); setP(cur); let iv = 0; if (!cur.consent) {
      // A4: loader → welcome/language → fully closed → only then the cookie banner. Never overlap.
      let calm = 0; iv = window.setInterval(() => {
        const busy = (window as unknown as { __seTourIdle?: boolean }).__seTourIdle === false || document.documentElement.classList.contains('se-boot') || document.querySelector('.se-bootv, .st-veil, .lp, .se-net-veil, .sc2-veil, .rp-full, .vs-full');
        calm = busy ? 0 : calm + 1; if (calm >= 3) { window.clearInterval(iv); setBanner(true); }
      }, 400);
    }
    const onP = (e: Event) => setP({ ...(e as CustomEvent).detail });
    const onOpen = (e: Event) => { const d = (e as CustomEvent).detail; setPanel(d === 'privacy' ? 'privacy' : 'all'); const c = prefs().consent; setDraft(c ? { memory: c.memory, signal: c.signal, booster: c.booster } : { memory: true, signal: false, booster: false }); play('open'); };
    const onLang = () => force((n) => n + 1);
    // PWA: the service worker (production only) and the install offer shown in Settings
    if ('serviceWorker' in navigator && location.hostname !== 'localhost') navigator.serviceWorker.register('/sw.js').catch(() => {});
    const bip = (e: Event) => { e.preventDefault(); setInst(e as unknown as { prompt: () => void }); }; window.addEventListener('beforeinstallprompt', bip);
    // every click gives its own quiet sound (buttons and links; the element can name one with data-sound)
    const click = (e: MouseEvent) => { const el = (e.target as Element | null)?.closest?.('button, a, [role="button"], [role="tab"], [role="option"]') as HTMLElement | null; if (!el || el.closest('[data-no-sound]')) return; const s = (el.closest('[data-sound]') as HTMLElement | null)?.dataset.sound as Snd | undefined; play(s || 'click'); };
    const cart = () => play('add');
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(false); }; document.addEventListener('keydown', esc);
    window.addEventListener('se:prefs', onP); window.addEventListener('se:settings', onOpen); window.addEventListener('se:lang', onLang); document.addEventListener('click', click, true); window.addEventListener('se:cart', cart);
    return () => { window.clearInterval(iv); window.removeEventListener('se:prefs', onP); window.removeEventListener('se:settings', onOpen); window.removeEventListener('se:lang', onLang); document.removeEventListener('click', click, true); window.removeEventListener('se:cart', cart); window.removeEventListener('beforeinstallprompt', bip); document.removeEventListener('keydown', esc); };
  }, []);
  if (!p) return null;
  const save = (c: { memory: boolean; signal: boolean; booster: boolean }) => { setPrefs({ consent: { ...c, at: Date.now() } }); setBanner(false); };
  const snd = p.sound;
  return (
    <>
      <SitePromo />
      {banner && !panel ? (
        <div className="sc2-banner" role="dialog" aria-label={T('Your privacy, your choice')}>
          <span className="sc2-chip" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg></span>
          <div className="sc2-btxt"><b>{T('Your privacy, your choice')}</b><span>{T('We use a few small files to make the site work. Pick what you allow.')} <a href="/legal#cookies">{T('Cookies')}</a></span></div>
          <div className="sc2-bacts">
            <button type="button" className="st-btn st-grey" onClick={() => save({ memory: false, signal: false, booster: false })}>{T('Deny all')}</button>
            <button type="button" className="st-btn st-dark" onClick={() => window.dispatchEvent(new CustomEvent('se:settings', { detail: 'privacy' }))}>{T('Choose')}</button>
            <button type="button" className="st-btn st-go" data-sound="success" onClick={() => save({ memory: true, signal: true, booster: true })}>{T('Accept all')}</button>
          </div>
        </div>
      ) : null}
      {panel ? (
        <div className="sc2-veil" onClick={(e) => { if (e.target === e.currentTarget) { setPanel(false); play('close'); } }}>
          <div className="sc2-panel" role="dialog" aria-modal="true" aria-label={T('Settings')}>
            <header><b>{T('Settings')}</b><button type="button" className="st-x" data-sound="close" onClick={() => setPanel(false)}>{T('Close')} ✕</button></header>
            {panel === 'all' ? (
              <section>
                <h4>{T('Sound effects')}</h4>
                <div className="sc2-row"><span>{T('Sounds')}</span><Switch on={snd.on} label={T('Sounds')} set={(v) => setPrefs({ sound: { ...snd, on: v } })} /></div>
                <div className="sc2-row"><span>{T('Volume')}</span><input type="range" min={0} max={1} step={0.05} value={snd.vol} onChange={(e) => setPrefs({ sound: { ...snd, vol: +e.target.value } })} onPointerUp={() => play('click', true)} aria-label={T('Volume')} /></div>
                <div className="sc2-row"><span>{T('Sound pack')}</span><span className="sc2-seg">{(['classic', 'soft', 'studio'] as Pack[]).map((k) => <button key={k} type="button" className={snd.pack === k ? 'on' : ''} data-no-sound="" onClick={() => { setPrefs({ sound: { ...snd, pack: k } }); window.setTimeout(() => play('success', true), 30); }}>{T(k[0].toUpperCase() + k.slice(1))}</button>)}</span></div>
              </section>
            ) : null}
            <section>
              <h4>{T('Your privacy, your choice')}</h4>
              <div className="sc2-cat"><div><b>{T('Core Circuit')}</b><small>{T('Needed for the cart, language and sign-in. Always on.')}</small></div><Switch on locked label={T('Core Circuit')} /></div>
              {CATS.map(([k, n, d]) => <div key={k} className="sc2-cat"><div><b>{T(n)}</b><small>{T(d)}</small></div><Switch on={draft[k]} label={T(n)} set={(v) => setDraft({ ...draft, [k]: v })} /></div>)}
              <div className="sc2-pacts"><button type="button" className="st-btn st-grey" onClick={() => { save({ memory: false, signal: false, booster: false }); setPanel(false); }}>{T('Deny all')}</button><button type="button" className="st-btn st-go" data-sound="success" onClick={() => { save(draft); setPanel(false); }}>{T('Save my choice')}</button></div>
            </section>
            {panel === 'all' ? (
              <section>
                <h4>{T('Price')}</h4>
                <div className="sc2-row"><span>AED · USD · EUR</span><span className="sc2-seg">{(['AED', 'USD', 'EUR'] as Currency[]).map((c) => <button key={c} type="button" className={p.currency === c ? 'on' : ''} onClick={() => { setPrefs({ currency: c }); window.dispatchEvent(new CustomEvent('se:catalog')); }}>{c}</button>)}</span></div>
                <div className="sc2-row"><span>{T('Language')}</span><button type="button" className="st-btn st-dark sc2-small" onClick={() => { setPanel(false); (window as unknown as { seTour?: () => void }).seTour?.(); }}>{T('Change language')}</button></div>
                {inst ? <div className="sc2-row"><span>{T('Install the app')}</span><button type="button" className="st-btn st-go sc2-small" onClick={() => { inst.prompt(); setInst(null); }}>{T('Install')}</button></div> : null}
              </section>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
