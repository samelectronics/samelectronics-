'use client';
// Owner (R10, a standing rule): nothing sends a visitor off the website without a preview first. Every phone call, map,
// e-mail, social-media and outside link opens this white pop-up: what it is, a live preview where possible (a real
// Google map you can move, the number, the address, the profile), a one-tap Copy, and only then "Open" (in a new tab,
// or the phone / e-mail app). WhatsApp and WeChat keep their own contact sheet (WeChatSheet). Staff pages are skipped.
import React, { useEffect, useState } from 'react';
import { play } from '@/lib/sound';
import { T as t } from '@/components/site/ui';
import { site } from '@/content/facts';
import LiveSam from '@/components/samsoom/LiveSam';

type Kind = 'map' | 'tel' | 'mail' | 'social' | 'web' | 'review';
type P = { kind: Kind; href: string; label: string; net?: string };
const SOC: [RegExp, string][] = [[/instagram\.com/i, 'Instagram'], [/facebook\.com|fb\.com/i, 'Facebook'], [/tiktok\.com/i, 'TikTok'], [/youtube\.com|youtu\.be/i, 'YouTube'], [/(^|\.)x\.com|twitter\.com/i, 'X'], [/snapchat\.com/i, 'Snapchat'], [/linkedin\.com/i, 'LinkedIn']];
const isMap = (u: URL) => /maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.|google\.[a-z.]+\/maps|maps\.apple\.com/i.test(u.href);

export const previewLink = (href: string) => window.dispatchEvent(new CustomEvent('se:preview', { detail: { href } }));

function classify(href: string): P | null {
  if (/^tel:/i.test(href)) return { kind: 'tel', href, label: decodeURIComponent(href.slice(4)) };
  if (/^mailto:/i.test(href)) return { kind: 'mail', href, label: decodeURIComponent(href.slice(7).split('?')[0]) };
  let u: URL; try { u = new URL(href, location.href); } catch { return null; }
  if (!/^https?:$/.test(u.protocol) || u.host === location.host) return null;
  if (/wa\.me|whatsapp\.com|weixin/i.test(u.host)) return null; // WhatsApp / WeChat have their own sheet
  if (/writereview|\/local\/reviews|g\.page\/r\/|review/i.test(u.href) && /google|g\.page/i.test(u.host)) return { kind: 'review', href: u.href, label: 'Google' };
  if (isMap(u)) return { kind: 'map', href: u.href, label: 'Google Maps' };
  for (const [rx, n] of SOC) if (rx.test(u.host)) return { kind: 'social', href: u.href, label: u.pathname.replace(/\/$/, '').split('/').filter(Boolean).pop() || u.host, net: n };
  return { kind: 'web', href: u.href, label: u.host.replace(/^www\./, '') };
}

export default function LinkPreview() {
  const [p, setP] = useState<P | null>(null), [copied, setCopied] = useState(false);
  useEffect(() => {
    if (location.pathname.startsWith('/staff')) return;
    const show = (x: P) => { setCopied(false); setP(x); play('open'); };
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.closest('.lpv-card, [data-direct]')) return;
      const x = classify(a.getAttribute('href') || ''); if (!x) return;
      e.preventDefault(); e.stopPropagation(); show(x);
    };
    const on = (e: Event) => { const h = (e as CustomEvent).detail?.href; const x = h && classify(h); if (x) show(x); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setP(null); };
    document.addEventListener('click', click, true); window.addEventListener('se:preview', on); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', click, true); window.removeEventListener('se:preview', on); document.removeEventListener('keydown', esc); };
  }, []);
  useEffect(() => { document.documentElement.toggleAttribute('data-preview-open', !!p); }, [p]);
  if (!p) return null;
  const close = () => setP(null);
  // owner (R12): "Follow, Google Maps, directions and reviews should open like the WhatsApp sheet: a bar on top to switch to
  // the others, with their logos and names". Places: directions · reviews · call. Social: Instagram · TikTok · Facebook.
  const revHref = (Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[]).find((a) => /google/i.test(a.href) && /review/i.test(a.href + a.textContent))?.href || 'https://search.google.com/local/writereview?placeid=';
  const PLACE: P[] = [{ kind: 'map', href: site.contact.mapsLink, label: 'Google Maps' }, { kind: 'review', href: revHref, label: 'Google' }, { kind: 'tel', href: 'tel:' + site.contact.storeTel, label: site.contact.storeTel }];
  const SOCIAL: P[] = [['Instagram', 'https://instagram.com/samelectronics.uae'], ['TikTok', 'https://www.tiktok.com/@samelectronics.uae'], ['Facebook', 'https://facebook.com/samelectronics.uae']].map(([n, h]) => ({ kind: 'social' as Kind, href: h, label: 'samelectronics.uae', net: n }));
  const group = p.kind === 'social' ? SOCIAL : ['map', 'review', 'tel'].includes(p.kind) ? PLACE : null;
  const tabName = (x: P) => x.kind === 'social' ? x.net || '' : x.kind === 'map' ? t('Directions') : x.kind === 'review' ? t('Reviews') : t('Call');
  const tabOn = (x: P) => x.kind === p.kind && (x.kind !== 'social' || x.net === p.net);
  const copyTxt = p.kind === 'tel' || p.kind === 'mail' ? p.label : p.href;
  const copy = async () => { try { await navigator.clipboard.writeText(copyTxt); } catch { /* */ } setCopied(true); play('success'); };
  const open = () => { play('link'); if (p.kind === 'tel' || p.kind === 'mail') location.href = p.href; else window.open(p.href, '_blank', 'noopener'); window.setTimeout(close, 250); };
  const head = { review: t('Review Sam Electronics on Google'), map: t('Directions to Sam Electronics'), tel: t('Call Sam Electronics'), mail: t('E-mail Sam Electronics'), social: (p.net || '') + ' · @' + p.label, web: t('You are leaving Sam Electronics') }[p.kind];
  const sub = { review: t('Tell other shops how we did. Your review helps us keep every part honest.'), map: site.contact.address + ' · ' + site.contact.plusCode, tel: t('We answer during opening hours. Outside them, WhatsApp is fastest.'), mail: t('We reply to every e-mail, usually the same day.'), social: t('This opens our page on') + ' ' + (p.net || '') + ' ' + t('in a new tab.'), web: t('This opens in a new tab') + ': ' + p.label }[p.kind];
  const go = { review: t('Write a review'), map: t('Open in Google Maps'), tel: t('Call now'), mail: t('Open my e-mail app'), social: t('Open') + ' ' + (p.net || ''), web: t('Open the page') }[p.kind];
  const subj = p.kind === 'mail' ? new URLSearchParams(p.href.split('?')[1] || '').get('subject') || '' : '';
  return (
    <div className="lpv-veil" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className={'lpv-card k-' + p.kind} role="dialog" aria-modal="true" aria-label={head}>
        <button type="button" className="lpv-x" aria-label={t('Close')} onClick={close}>✕</button>
        {group ? <span className="ct-switch lpv-switch" role="tablist">{group.map((x) => <button key={x.kind + (x.net || '')} type="button" role="tab" aria-selected={tabOn(x)} className={'ct-swb' + (tabOn(x) ? ' on' : '')} onClick={() => { if (!tabOn(x)) { setCopied(false); setP(x); play('tab'); } }}><i className={'lpv-ti ' + (x.kind === 'social' ? 'n-' + (x.net || '').toLowerCase() : 't-' + x.kind)} aria-hidden="true" />{tabName(x)}</button>)}</span> : null}
        <div className="lpv-top"><span className="lpv-sam"><LiveSam fit mood={p.kind === 'web' ? 'think' : 'happy'} size={46} /></span><span className="lpv-tt"><small>{t('PREVIEW BEFORE YOU GO')}</small><b dir="auto">{head}</b></span></div>
        <p className="lpv-sub" dir="auto">{sub}</p>
        <div className="lpv-view">
          {p.kind === 'map' ? <iframe title="Map" src={'https://www.google.com/maps?q=' + site.contact.mapsQuery + '&z=17&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : null}
          {p.kind === 'review' ? <span className="lpv-rev"><b>4.9</b><span className="st" aria-hidden="true">★★★★★</span><small>{t('Google reviews')}</small></span> : null}
          {p.kind === 'tel' ? <span className="lpv-big" dir="ltr">{p.label.replace(/^\+971(\d)(\d{3})(\d{4})$/, '+971 $1 $2 $3')}</span> : null}
          {p.kind === 'mail' ? <span className="lpv-mail"><span className="lpv-big sm" dir="ltr">{p.label}</span>{subj ? <small dir="auto">{t('Subject')}: {subj}</small> : null}</span> : null}
          {p.kind === 'social' || p.kind === 'web' ? <span className="lpv-link"><i className={'lpv-net n-' + (p.net || 'web').toLowerCase()} aria-hidden="true">{(p.net || p.label).slice(0, 1)}</i><span dir="ltr">{p.href.replace(/^https?:\/\//, '').slice(0, 60)}</span></span> : null}
        </div>
        <div className="lpv-acts">
          <button type="button" className="lpv-btn" onClick={copy}>{copied ? t('Copied') + ' ✓' : p.kind === 'tel' ? t('Copy number') : p.kind === 'mail' ? t('Copy address') : t('Copy link')}</button>
          <button type="button" className="lpv-btn go" onClick={open}>{go} <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </div>
  );
}
