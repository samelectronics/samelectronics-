'use client';
// R7-G: the quick language menu (nav and footer). One button with the current language; it opens a short list of all
// five, each in its own script. Picking one goes through the language pop-up like before (window.seI18n.set).
// Styles in src/styles/dc-base.css (.se-lm).
import React, { useEffect, useRef, useState } from 'react';
import { LANGS, RANK, type Lang } from '@/i18n/lang';
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
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.6 5.6 3.6 9s-1 6.4-3.6 9M12 3C9.4 5.6 8.4 8.6 8.4 12s1 6.4 3.6 9" /></svg>
        <b lang={cur}>{CODE[cur]}</b>
        <svg className="gear" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></svg>
        <svg className="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
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
                  <small>{l.en}</small>
                </button>
              ))}
            </span>
          ) : (
            <span className="se-qs-set">
              <span className="se-qs-row"><span>{tr('Sounds')}</span><button type="button" className={'se-qs-sw' + (P.sound.on ? ' on' : '')} aria-pressed={P.sound.on} onClick={() => { setPrefs({ sound: { ...P.sound, on: !P.sound.on } }); bump((n) => n + 1); }}><i /></button></span>
              <span className="se-qs-row"><span>{tr('Currency')}</span><span className="se-qs-seg">{(['AED', 'USD', 'EUR'] as Currency[]).map((c) => <button key={c} type="button" className={P.currency === c ? 'on' : ''} onClick={() => { setPrefs({ currency: c }); bump((n) => n + 1); }}>{c}</button>)}</span></span>
              <button type="button" className="se-qs-link" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:settings', { detail: 'privacy' })); }}>{tr('Privacy choices')} <em>→</em></button>
              <button type="button" className="se-qs-link" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('se:settings')); }}>{tr('All settings')} <em>→</em></button>
            </span>
          )}
        </span>
      ) : null}
    </span>
  );
}
