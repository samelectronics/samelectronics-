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
import SoundSettings from './SoundSettings';
import SitePromo from './SitePromo';
import LiveSam from '@/components/samsoom/LiveSam';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
// R10 B4: familiar phone parts, with the plain legal type and a "Read more" (what it stores, how long, why, an example)
export type Cat = { k: 'core' | 'memory' | 'signal' | 'booster'; n: string; type: string; d: string; what: string; long: string; why: string; ex: string };
export const CATS: Cat[] = [
  { k: 'core', n: 'Battery', type: 'Essential · always on', d: 'Keeps the site running: your cart, language and sign-in.', what: 'Your cart, your language, your sign-in session and these privacy choices.', long: 'Until you clear them (sign-in: until you sign out).', why: 'Without them the cart would empty and the site would forget your language on every page.', ex: 'You add a screen to the cart, open another page, and it is still there.' },
  { k: 'memory', n: 'Memory Chip', type: 'Preferences', d: 'Remembers your preferences, saved searches and recent parts.', what: 'Currency, sounds, recent searches, starred parts and your devices.', long: '12 months, or until you clear them.', why: 'So you do not have to set things up again on every visit.', ex: 'You searched "A54 battery" yesterday; today it is first in your recent searches.' },
  { k: 'signal', n: 'Diagnostics', type: 'Anonymous statistics', d: 'Anonymous visit counts that help us improve the site.', what: 'Which pages are opened and how fast they load. Never your name or contact.', long: '13 months.', why: 'To see which pages are slow or confusing and fix them.', ex: 'We notice the Repair page loads slowly on phones and make it faster.' },
  { k: 'booster', n: 'Antenna', type: 'Marketing and offers', d: 'Offers and ads that match what you look for.', what: 'The kinds of parts you look at, to show matching offers.', long: '6 months.', why: 'So the offers you see are for your phones, not random ones.', ex: 'You look at iPhone 13 screens; the next deal we show you is for that screen.' },
];

export function CatIcon({ k }: { k: Cat['k'] }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return <svg viewBox="0 0 24 24" width="22" height="22">{k === 'core' ? <><rect x="3" y="7" width="16" height="10" rx="2" {...p} /><path d="M21 10.5v3M11.5 9 9.5 12h3l-2 3" {...p} /></> : k === 'memory' ? <><rect x="6" y="6" width="12" height="12" rx="2" {...p} /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" {...p} /></> : k === 'signal' ? <><path d="M3 12h4l2-5 4 10 2-5h6" {...p} /></> : <><path d="M12 13v8M8 21h8M12 13a2 2 0 1 0 0-.01M7.5 8.5a6.4 6.4 0 0 1 9 0M4.6 5.6a10.5 10.5 0 0 1 14.8 0" {...p} /></>}</svg>;
}
/** a real-looking cookie with a bite out of it and crumbs that fall once */
// R10 (owner, 3 Nov): one calm mark, not two characters: a yellow line cookie with a bite, in a graphite circle
function CookieBite() {
  return (
    <svg className="sc2-ck" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#F7C032" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 1 0 9 9 2.6 2.6 0 0 1-3-2.6 2.6 2.6 0 0 1-3-2.9A2.6 2.6 0 0 1 12 3z" />
      <circle cx="8.5" cy="10.5" r=".9" fill="#F7C032" /><circle cx="13" cy="15.5" r=".9" fill="#F7C032" /><circle cx="8.8" cy="15.6" r=".7" fill="#F7C032" />
      <circle className="crumb" cx="19.5" cy="5" r=".8" fill="#F7C032" stroke="none" />
    </svg>
  );
}

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
        const tourOn = (window as unknown as { __seTourIdle?: boolean }).__seTourIdle === false && !(() => { try { return !!localStorage.getItem('se-tour2'); } catch { return true; } })();
        const busy = tourOn || !!document.querySelector('.st-walk, .st-hello') || document.documentElement.classList.contains('se-boot') || document.querySelector('.se-bootv, .st-veil, .lp, .se-net-veil, .sc2-veil, .rp-full, .vs-full');
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
    // R11b: every WhatsApp message a visitor starts from the website is also saved in the Control Room inbox (topic
    // "WhatsApp"), with the page it came from, so the team keeps each customer's requests and history in one place
    const waLog = (e: MouseEvent) => { const a = (e.target as Element | null)?.closest?.('a[href*="wa.me/"]') as HTMLAnchorElement | null; if (!a || location.pathname.startsWith('/staff')) return;
      try { const u = new URL(a.href), txt = u.searchParams.get('text') || ''; import('@/lib/backend').then(async ({ backend }) => { const me = await backend.me().catch(() => null); await backend.send({ name: me?.name || 'Website visitor', email: me?.email, topic: 'WhatsApp', text: (txt || '(opened WhatsApp)') + '\n\n— from ' + location.pathname + (me ? '' : ' · not signed in') }); }).catch(() => {}); } catch { /* */ } };
    document.addEventListener('click', waLog, true);
    const cart = () => play('add');
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(false); }; document.addEventListener('keydown', esc);
    window.addEventListener('se:prefs', onP); window.addEventListener('se:settings', onOpen); window.addEventListener('se:lang', onLang); document.addEventListener('click', click, true); window.addEventListener('se:cart', cart);
    return () => { window.clearInterval(iv); window.removeEventListener('se:prefs', onP); window.removeEventListener('se:settings', onOpen); window.removeEventListener('se:lang', onLang); document.removeEventListener('click', click, true); document.removeEventListener('click', waLog, true); window.removeEventListener('se:cart', cart); window.removeEventListener('beforeinstallprompt', bip); document.removeEventListener('keydown', esc); };
  }, []);
  if (!p) return null;
  const save = (c: { memory: boolean; signal: boolean; booster: boolean }) => { setPrefs({ consent: { ...c, at: Date.now() } }); setBanner(false); };
  const snd = p.sound;
  return (
    <>
      <SitePromo />
      {banner && !panel ? (
        <div className="sc2-banner" role="dialog" aria-label={T('Your privacy, your choice')}>
          <span className="sc2-cookie" aria-hidden="true"><CookieBite /></span>
          <div className="sc2-btxt"><b>{T('Your privacy, your choice')}</b><span>{T('We use a few small files to make the site work. Pick what you allow.')} <a href="/cookies">{T('Cookies')}</a></span></div>
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
                <SoundSettings currency={false} />
              </section>
            ) : null}
            <section>
              <h4>{T('Your privacy, your choice')}</h4>
              {CATS.map((c) => (
                <details key={c.k} className="sc2-cat sc2-cat2">
                  <summary>
                    <span className="sc2-cic" aria-hidden="true"><CatIcon k={c.k} /></span>
                    <span className="sc2-ct"><b>{T(c.n)}</b><em>{T(c.type)}</em><small>{T(c.d)}</small><u>{T('Read more')}</u></span>
                    <span onClick={(e) => e.preventDefault()}>{c.k === 'core' ? <Switch on locked label={T(c.n)} /> : <Switch on={draft[c.k as 'memory']} label={T(c.n)} set={(v) => setDraft({ ...draft, [c.k]: v })} />}</span>
                  </summary>
                  <dl><dt>{T('What it stores')}</dt><dd>{T(c.what)}</dd><dt>{T('How long')}</dt><dd>{T(c.long)}</dd><dt>{T('Why')}</dt><dd>{T(c.why)}</dd><dt>{T('Example')}</dt><dd>{T(c.ex)}</dd></dl>
                </details>
              ))}
              <a className="sc2-more" href="/cookies">{T('The full cookies page')} →</a>
              <div className="sc2-pacts"><button type="button" className="st-btn st-grey" onClick={() => { save({ memory: false, signal: false, booster: false }); setPanel(false); }}>{T('Deny all')}</button><button type="button" className="st-btn st-go" data-sound="success" onClick={() => { save(draft); setPanel(false); }}>{T('Save my choice')}</button></div>
            </section>
            {panel === 'all' ? (
              <section>
                <h4>{T('Price')}</h4>
                <div className="sc2-row"><span>AED · USD · EUR</span><span className="sc2-seg">{(['AED', 'USD', 'EUR'] as Currency[]).map((c) => <button key={c} type="button" className={p.currency === c ? 'on' : ''} onClick={() => { setPrefs({ currency: c }); window.dispatchEvent(new CustomEvent('se:catalog')); }}>{c}</button>)}</span></div>
                <div className="sc2-row"><span>{T('Language')}</span><button type="button" className="st-btn st-dark sc2-small" onClick={() => { setPanel(false); (window as unknown as { seTour?: () => void }).seTour?.(); }}>{T('Change language')}</button></div>
                <div className="sc2-row"><span>{T('More settings')}</span><a className="st-btn st-go sc2-small" href="/account#profile">{T('Open My Bench')}</a></div>
                {inst ? <div className="sc2-row"><span>{T('Install the app')}</span><button type="button" className="st-btn st-go sc2-small" onClick={() => { inst.prompt(); setInst(null); }}>{T('Install')}</button></div> : null}
              </section>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
