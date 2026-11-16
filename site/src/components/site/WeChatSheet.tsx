'use client';
// Owner (16 Nov): every WhatsApp or WeChat button on the site opens the same contact sheet, over a blurred page:
// - WhatsApp: open it on this device, or scan the code with your phone, and the number with a one-tap copy
// - WeChat: open WeChat, and the number to add with a one-tap copy (WeChat has no public chat link by number)
// The two are tabs of one sheet, so a visitor can switch. Any link to wa.me anywhere on the site lands here first.
import React, { useEffect, useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import { play } from '@/lib/sound';
import { T as t } from '@/components/site/ui';
import { backend, wasSent } from '@/lib/backend';
import { customerId, messageId } from '@/lib/ids';

// every tap on "Open WhatsApp" / "Open WeChat" also lands in the Control Room inbox with the page and the message,
// unless a form already sent that same card. Visitors stay anonymous unless they signed in.
const logTap = (mode: Mode, text: string) => {
  import('@/lib/achievements').then((a) => a.unlock('contact')).catch(() => {});
  if (wasSent(text)) return;
  backend.me().then((u) => backend.send({ name: u?.name || 'Website visitor', email: u?.email || undefined, topic: (mode === 'wa' ? 'WhatsApp' : 'WeChat') + ' · ' + location.pathname,
    text: '*' + (mode === 'wa' ? 'Opened WhatsApp' : 'Opened WeChat') + '*\n*Page:* ' + location.href + '\n\n' + text })).catch(() => { /* offline: WhatsApp still opens */ });
};

export const WECHAT = { number: '+971 50 342 0015', raw: '971503420015' };
export const WHATSAPP = { number: '+971 50 342 0015', raw: '971503420015' };
type Mode = 'wa' | 'wc';
const DEF_MSG = 'Hi Sam Electronics, I have a question.';

export const openContact = (mode: Mode, text?: string) => window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode, text } }));

function Qr({ text }: { text: string }) {
  const svg = useMemo(() => { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }, [text]);
  return <span className="ct-qr" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function WeChatSheet() {
  const [open, setOpen] = useState(false), [mode, setMode] = useState<Mode>('wa'), [msg, setMsg] = useState(DEF_MSG), [copied, setCopied] = useState(false), [note, setNote] = useState(''), [mcopied, setMcopied] = useState(false), [mid, setMid] = useState('');
  useEffect(() => {
    const show = (m: Mode, text?: string) => { setCopied(false); setNote(''); setMcopied(false); setMid(messageId()); setMode(m); setMsg(text || DEF_MSG); setOpen(true); play('open'); };
    const onC = (e: Event) => { const d = (e as CustomEvent).detail || {}; show(d.mode === 'wc' ? 'wc' : 'wa', d.text); };
    const onWc = () => show('wc');
    // any WhatsApp link on the site opens the sheet first (the sheet's own "Open WhatsApp" goes straight through)
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href*="wa.me/"], a[href*="api.whatsapp.com"]') as HTMLAnchorElement | null;
      if (!a || a.closest('.ct-card') || location.pathname.startsWith('/staff')) return;
      e.preventDefault(); let text = DEF_MSG; try { text = new URL(a.href).searchParams.get('text') || DEF_MSG; } catch { /* */ } show('wa', text);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('se:contact', onC); window.addEventListener('se:wechat', onWc); document.addEventListener('click', click, true); document.addEventListener('keydown', esc);
    return () => { window.removeEventListener('se:contact', onC); window.removeEventListener('se:wechat', onWc); document.removeEventListener('click', click, true); document.removeEventListener('keydown', esc); };
  }, []);
  useEffect(() => { document.documentElement.toggleAttribute('data-contact-open', open); }, [open]);
  if (!open) return null;
  // owner (16 Nov): preview before sending: the system's details (read-only) + your own note, then one tap
  const sys = msg !== DEF_MSG, full0 = sys ? msg + (note.trim() ? '\n\n*' + t('Note') + ':* ' + note.trim() : '') : (note.trim() || DEF_MSG);
  const full = /\*Message ID:\*/.test(full0) ? full0 : full0.replace(/\s+$/, '') + '\n\n*Customer ID:* ' + customerId() + '\n*Message ID:* ' + mid;
  const C = mode === 'wa' ? WHATSAPP : WECHAT, waUrl = 'https://wa.me/' + WHATSAPP.raw + '?text=' + encodeURIComponent(full);
  const copyMsg = async () => { try { await navigator.clipboard.writeText(full); } catch { /* */ } setMcopied(true); };
  const fmt = (x: string) => x.split('\n').map((ln, i) => ln.trim() ? <span key={i} className="ct-pl">{ln.split(/(\*[^*]+\*)/g).map((p2, j) => p2.length > 2 && p2.startsWith('*') && p2.endsWith('*') ? <b key={j}>{p2.slice(1, -1)}</b> : p2)}</span> : <span key={i} className="ct-pg" />);
  const copy = async () => { try { await navigator.clipboard.writeText(C.number); } catch { /* */ } setCopied(true); play('success'); };
  return (
    <div className="wc-veil ct-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className={'wc-card ct-card ' + mode} role="dialog" aria-modal="true" aria-label={t(mode === 'wa' ? 'WhatsApp us' : 'WeChat us')}>
        <button type="button" className="wc-x" aria-label={t('Close')} onClick={() => setOpen(false)}>✕</button>
        <div className="ct-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'wa'} className={mode === 'wa' ? 'on wa' : 'wa'} onClick={() => { setMode('wa'); setCopied(false); }}><i className="ct-ic wa" />WhatsApp</button>
          <button type="button" role="tab" aria-selected={mode === 'wc'} className={mode === 'wc' ? 'on wc' : 'wc'} onClick={() => { setMode('wc'); setCopied(false); }}><i className="ct-ic wc" />WeChat</button>
        </div>
        <b className="wc-h">{t(mode === 'wa' ? 'WhatsApp us' : 'WeChat us')}</b>
        <p className="wc-p">{t(mode === 'wa' ? 'Chat with our team. Open WhatsApp on this device, or scan the code with your phone.' : 'Add our number in WeChat and send us a message. We reply in Arabic, English and Chinese.')}</p>
        <div className="ct-body">
          {mode === 'wa' ? <span className="ct-qrw"><Qr text={waUrl} /><small>{t('Scan with your phone')}</small></span> : null}
          <span className="ct-numw"><small>{t(mode === 'wa' ? 'WhatsApp number' : 'WeChat number')}</small><span className="wc-num" dir="ltr">{C.number}</span>
            <button type="button" className="ct-copy" onClick={copy}>{copied ? t('Copied') + ' ✓' : t('Copy number')}</button></span>
        </div>
        <div className="ct-compose">
          {sys ? <div className="ct-prev" aria-label={t('Your message')}><small>{t('YOUR MESSAGE')}</small><div className="ct-pv">{fmt(msg)}</div></div> : null}
          <textarea className="ct-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t(sys ? 'Add a personal note (optional)' : 'Write your message')} />
        </div>
        <div className="ct-acts">
          {mode === 'wa'
            ? <a className="wc-btn go wa" href={waUrl} target="_blank" rel="noopener" onClick={() => { logTap('wa', full); window.setTimeout(() => setOpen(false), 300); }}><i className="ct-ic wa" />{t('Open WhatsApp')}</a>
            : <><button type="button" className="wc-btn" onClick={copyMsg}>{mcopied ? t('Message copied') + ' ✓' : t('Copy message')}</button><a className="wc-btn go" href="weixin://" onClick={() => { logTap('wc', full); copyMsg(); }}><i className="ct-ic wc" />{t('Open WeChat')}</a></>}
        </div>
      </div>
    </div>
  );
}
