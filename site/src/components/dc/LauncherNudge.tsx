'use client';
// Owner (16 Nov): no separate white message. Samsoom HOLDS A PAPER with the logo on it and asks.
// - once per visit, a few seconds after the welcome and the language are done: a note with both options
//   (WhatsApp us / WeChat us) and a close; it puts itself away after 12 s; closed = not again until the next visit
// - later (at most once more, after a few minutes): a small sign with one logo, "WhatsApp us?" or "WeChat us?", for 7 s
// Every button opens the contact sheet (open on this device, QR, the number to copy). Never over another card.
import React, { useEffect, useState } from 'react';
import { T as t } from '@/components/site/ui';
import { openContact } from '@/components/site/WeChatSheet';

type K = '' | 'note' | 'wa' | 'wc';
const busy = () => !!document.querySelector('.st-veil, .st-walk, .st-menu, .wc-veil, [aria-modal="true"], .sc2-banner, .sc2-veil, .st-offer2') || document.hidden;
const ss = (k: string, v?: string) => { try { if (v != null) sessionStorage.setItem(k, v); return sessionStorage.getItem(k); } catch { return null; } };

// owner (16 Nov, again): no white note or sign next to Samsoom at all. WhatsApp / WeChat live in the contact sheet
// (WhatsApp | WeChat switch), reached from every WhatsApp / WeChat button. This component now renders nothing.
export default function LauncherNudge() {
  return null;
}
export function LauncherNudgeOld() {
  const [k, setK] = useState<K>('');
  useEffect(() => {
    let hide = 0, later = 0, tries = 0;
    const set = (v: K) => { setK(v); if (v) document.documentElement.setAttribute('data-sam-hold', v); else document.documentElement.removeAttribute('data-sam-hold'); };
    const done = () => { try { return !!localStorage.getItem('se-tour2'); } catch { return false; } };
    const note = () => { if (ss('se-note-seen')) return true; if (!done() || busy()) return false; ss('se-note-seen', '1'); set('note'); clearTimeout(hide); hide = window.setTimeout(() => set(''), 12000); return true; };
    const sign = () => { if (ss('se-nudge-off') || Number(ss('se-sign-n') || 0) >= 1) return; if (busy()) { later = window.setTimeout(sign, 20000); return; } ss('se-sign-n', '1'); set(Math.random() < 0.5 ? 'wa' : 'wc'); clearTimeout(hide); hide = window.setTimeout(() => set(''), 7000); };
    // the note: a few seconds after the welcome is over (checked every 2 s until then, for up to 2 minutes)
    const iv = window.setInterval(() => { if (note() || ++tries > 60) { window.clearInterval(iv); later = window.setTimeout(sign, 240000); } }, 2000);
    (window as unknown as { seNudge?: (v?: K) => void }).seNudge = (v: K = 'wa') => set(v);
    return () => { clearInterval(iv); clearTimeout(hide); clearTimeout(later); document.documentElement.removeAttribute('data-sam-hold'); };
  }, []);
  if (!k) return null;
  const close = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setK(''); document.documentElement.removeAttribute('data-sam-hold'); ss('se-nudge-off', '1'); };
  const go = (m: 'wa' | 'wc') => (e: React.MouseEvent) => { e.preventDefault(); setK(''); document.documentElement.removeAttribute('data-sam-hold'); openContact(m); };
  if (k === 'note') return (
    <div className="ln-paper note" role="dialog" aria-label={t('Talk to a person')}>
      <button type="button" className="ln-x" aria-label={t('Close')} onClick={close}>✕</button>
      <small>{t('Need a person?')}</small>
      <b>{t('Talk to our team')}</b>
      <span className="ln-acts">
        <button type="button" className="ln-b wa" onClick={go('wa')}><i className="ct-ic wa" />{t('WhatsApp us')}</button>
        <button type="button" className="ln-b wc" onClick={go('wc')}><i className="ct-ic wc" />{t('WeChat us')}</button>
      </span>
      <i className="ln-hands" aria-hidden="true"><u /><u /></i>
    </div>
  );
  return (
    <button type="button" className={'ln-paper sign ' + k} onClick={go(k)}>
      <span className="ln-x" role="button" aria-label={t('Close')} onClick={close}>✕</span>
      <i className={'ct-ic big ' + k} aria-hidden="true" />
      <b>{t(k === 'wa' ? 'WhatsApp us?' : 'WeChat us?')}</b>
      <i className="ln-hands" aria-hidden="true"><u /><u /></i>
    </button>
  );
}
