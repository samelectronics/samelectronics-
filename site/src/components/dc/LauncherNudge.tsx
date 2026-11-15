'use client';
// Owner (15 Nov): no extra WhatsApp/WeChat buttons in the bar. Instead Samsoom, now and then, holds up the WhatsApp or the
// WeChat tile in his hand and says so, alternating. Quiet: first after 35 s, then every 2 minutes, 7 s each, never
// while a Samsoom card, the chat or a dialog is open, and never again once the visitor closes it this session.
import React, { useEffect, useState } from 'react';
import { t } from '@/dc/runtime';

const WA = 'https://wa.me/971503420015?text=' + encodeURIComponent('Hi Sam Electronics, I have a question.');

export default function LauncherNudge() {
  const [k, setK] = useState<'' | 'wa' | 'wc'>('');
  useEffect(() => {
    let off = false; try { off = sessionStorage.getItem('se-nudge-off') === '1'; } catch {}
    if (off) return;
    let n = 0, hide = 0;
    const busy = () => !!document.querySelector('.st-veil, .st-menu, .wc-veil, [aria-modal="true"], .sc2-banner, .sc2-veil') || document.hidden;
    const show = () => { if (busy()) return; const kk = n++ % 2 ? 'wc' : 'wa'; setK(kk); document.documentElement.setAttribute('data-sam-hold', kk); clearTimeout(hide); hide = window.setTimeout(() => { setK(''); document.documentElement.removeAttribute('data-sam-hold'); }, 7000); };
    (window as unknown as { seNudge?: () => void }).seNudge = show; // also lets the team preview it from the console
    const first = window.setTimeout(show, 35000), iv = window.setInterval(show, 120000);
    return () => { clearTimeout(first); clearInterval(iv); clearTimeout(hide); document.documentElement.removeAttribute('data-sam-hold'); };
  }, []);
  if (!k) return null;
  const close = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setK(''); document.documentElement.removeAttribute('data-sam-hold'); try { sessionStorage.setItem('se-nudge-off', '1'); } catch {} };
  const body = <><i className={'st-brand ' + k} aria-hidden="true" /><span><small>{t('Need a person?')}</small><b>{t(k === 'wa' ? 'WhatsApp us!' : 'WeChat us!')}</b></span><button type="button" className="ln-x" aria-label="Close" onClick={close}>✕</button></>;
  return k === 'wa'
    ? <a className="ln-bubble" href={WA} target="_blank" rel="noopener">{body}</a>
    : <button type="button" className="ln-bubble" onClick={() => window.dispatchEvent(new CustomEvent('se:wechat'))}>{body}</button>;
}
