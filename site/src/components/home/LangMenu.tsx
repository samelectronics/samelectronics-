'use client';
// R7-G: the quick language menu (nav and footer). One button with the current language; it opens a short list of all
// five, each in its own script. Picking one goes through the language pop-up like before (window.seI18n.set).
// Styles in src/styles/dc-base.css (.se-lm).
import React, { useEffect, useRef, useState } from 'react';
import { LANGS, type Lang } from '@/i18n/lang';

const CODE: Record<Lang, string> = { en: 'EN', ar: 'ع', es: 'ES', fr: 'FR', fa: 'فا' };

export default function LangMenu({ up = false, dark = false }: { up?: boolean; dark?: boolean }) {
  const [cur, setCur] = useState<Lang>('en'), [open, setOpen] = useState(false), box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const read = () => setCur(((window.seI18n && window.seI18n.lang()) || 'en') as Lang);
    read();
    const on = (e: Event) => setCur(((e as CustomEvent).detail || 'en') as Lang);
    const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('se:lang', on); document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:lang', on); document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc); };
  }, []);
  const pick = (l: Lang) => { setOpen(false); if (l !== cur && window.seI18n) window.seI18n.set(l); };
  return (
    <span ref={box} className={'se-lm' + (up ? ' up' : '') + (dark ? ' dark' : '') + (open ? ' open' : '')} data-no-i18n="">
      <button type="button" className="se-lm-btn" aria-haspopup="listbox" aria-expanded={open} aria-label="Language" onClick={() => setOpen((o) => !o)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.6 5.6 3.6 9s-1 6.4-3.6 9M12 3C9.4 5.6 8.4 8.6 8.4 12s1 6.4 3.6 9" /></svg>
        <b lang={cur}>{CODE[cur]}</b>
        <svg className="chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open ? (
        <span className="se-lm-list" role="listbox" aria-label="Language">
          {LANGS.map((l) => (
            <button key={l.id} type="button" role="option" aria-selected={l.id === cur} className={l.id === cur ? 'on' : ''} lang={l.id} onClick={() => pick(l.id)}>
              <b dir="auto">{l.name}</b>
              <small>{l.en}</small>
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}
