'use client';
// R7-G: the quick language menu (nav and footer). One button with the current language; it opens a short list of all
// five, each in its own script. Picking one goes through the language pop-up like before (window.seI18n.set).
// Styles in src/styles/dc-base.css (.se-lm).
import React, { useEffect, useRef, useState } from 'react';
import { LANGS, RANK, langLabel, type Lang } from '@/i18n/lang';
import { prefs, setPrefs, type Currency } from '@/lib/prefs';

const CODE: Record<Lang, string> = { en: 'EN', ar: 'ع', es: 'ES', fr: 'FR', fa: 'فا', ru: 'RU', hi: 'हि', ur: 'اُر', tl: 'TL', ml: 'മ', ca: 'CA', de: 'DE', it: 'IT', pt: 'PT', ro: 'RO', zh: '中', gl: 'GL', eu: 'EU', sw: 'SW', am: 'አ', ha: 'HA', yo: 'YO', om: 'OM', ig: 'IG' };

export default function LangMenu({ up = false, dark = false }: { up?: boolean; dark?: boolean }) {
  const [cur, setCur] = useState<Lang>('en'), [open, setOpen] = useState(false), [tab, setTab] = useState<'lang' | 'set'>('lang'), [, bump] = useState(0), box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const read = () => setCur(((window.seI18n && window.seI18n.lang()) || 'en') as Lang);
    read();
    const on = (e: Event) => setCur(((e as CustomEvent).detail || 'en') as Lang);
    const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('se:lang', on); document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:lang', on); document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc); };
  }, []);
  const tr = (x: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(x) : x);
  const P = typeof window !== 'undefined' ? prefs() : { sound: { on: false, vol: 0.3, pack: 'classic' as const }, currency: 'AED' as Currency };
  const ranked = RANK.map((id) => LANGS.find((x) => x.id === id)!).filter(Boolean);
  const pick = (l: Lang) => { setOpen(false); if (l !== cur && window.seI18n) window.seI18n.set(l); };
  return (
    <span ref={box} className={'se-lm' + (up ? ' up' : '') + (dark ? ' dark' : '') + (open ? ' open' : '')} data-no-i18n="">
      <button type="button" className="se-lm-btn" aria-haspopup="dialog" aria-expanded={open} aria-label="Language" onClick={() => { setOpen((o) => !o); setTab('lang'); }}>
        {/* R12 (owner): language has its own clean globe; settings got their own gear button next to it */}
        <svg className="se-lm-ic se-lm-ic2" width="22" height="20" viewBox="0 0 26 24" fill="none" aria-hidden="true">{/* R12 (owner): "a new language icon, a mix of letters, not the typical globe": two chat tiles, an A and an ع */}<path d="M10 2.8h11.4a2.6 2.6 0 0 1 2.6 2.6v7.2a2.6 2.6 0 0 1-2.6 2.6h-1.2l.2 3.3-3.6-3.3H10a2.6 2.6 0 0 1-2.6-2.6V5.4A2.6 2.6 0 0 1 10 2.8z" fill="#F7C032" /><text x="15.7" y="12.2" textAnchor="middle" fontSize="8.6" fontWeight="700" fill="#26282B" fontFamily="'IBM Plex Sans Arabic', 'Noto Naskh Arabic', sans-serif">ع</text><path d="M4.6 8.4h9.2a2.6 2.6 0 0 1 2.6 2.6v6.4a2.6 2.6 0 0 1-2.6 2.6H8.6L5 23v-3H4.6A2.6 2.6 0 0 1 2 17.4V11a2.6 2.6 0 0 1 2.6-2.6z" fill="#3A3C40" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><text x="9.2" y="17.6" textAnchor="middle" fontSize="8.4" fontWeight="800" fill="currentColor" fontFamily="'Space Grotesk', sans-serif">A</text></svg>
        <b lang={cur}>{CODE[cur]}</b>
        <svg className="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <button type="button" className="se-lm-gear" aria-label="Settings" title="Settings" onClick={() => { setOpen((o) => !(o && tab === 'set')); setTab('set'); }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
      </button>
      {open ? (
        <span className="se-lm-list se-qs" role="dialog" aria-label="Quick settings">
          {/* R10 B7: one smart button, two tabs. No half-cut settings box under the list any more. */}
          <span className="se-qs-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'lang'} className={tab === 'lang' ? 'on' : ''} onClick={() => setTab('lang')}>{tr('Language')}</button>
            <button type="button" role="tab" aria-selected={tab === 'set'} className={tab === 'set' ? 'on' : ''} onClick={() => setTab('set')}>{tr('Settings')}</button>
          </span>
          {tab === 'lang' ? (
            <span className="se-qs-langs" role="listbox" aria-label="Language">
              {ranked.map((l) => (
                <button key={l.id} type="button" role="option" aria-selected={l.id === cur} className={l.id === cur ? 'on' : ''} lang={l.id} onClick={() => pick(l.id)}>
                  <b dir="auto">{l.name}</b>
                  <small lang={cur}>{langLabel(l.id, cur)}</small>
                </button>
              ))}
            </span>
          ) : (
            <span className="se-qs-set">
              <span className="se-qs-row"><span>{tr('Sounds')}</span><button type="button" className={'se-qs-sw' + (P.sound.on ? ' on' : '')} aria-pressed={P.sound.on} onClick={() => { setPrefs({ sound: { ...P.sound, on: !P.sound.on } }); bump((n) => n + 1); }}><i /></button></span>
              {/* owner (16 Nov): pop-ups are white; anyone who prefers them dark can switch here */}
              <span className="se-qs-row"><span>{tr('Pop-ups')}</span><span className="se-qs-seg">{(['light', 'dark'] as const).map((m) => <button key={m} type="button" className={(typeof document !== 'undefined' && (document.documentElement.dataset.theme || 'light') === m) ? 'on' : ''} onClick={() => { document.documentElement.dataset.theme = m; try { localStorage.setItem('se-theme', m); } catch { /* */ } bump((n) => n + 1); }}>{tr(m === 'light' ? 'Light' : 'Dark')}</button>)}</span></span>
              <span className="se-qs-row"><span>{tr('Currency')}</span><span className="se-qs-seg">{(['AED', 'USD', 'EUR'] as Currency[]).map((c) => <button key={c} type="button" className={P.currency === c ? 'on' : ''} onClick={() => { setPrefs({ currency: c }); bump((n) => n + 1); }}>{c}</button>)}</span></span>
              <button type="button" className="se-qs-link" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:settings')); }}>{tr('More settings')} <em>→</em></button>
            </span>
          )}
        </span>
      ) : null}
    </span>
  );
}
