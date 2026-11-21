'use client';
import InfoTip from '@/components/site/InfoTip';
// Owner (16 Nov): every WhatsApp or WeChat button on the site opens the same contact sheet, over a blurred page:
// - WhatsApp: open it on this device, or scan the code with your phone, and the number with a one-tap copy
// - WeChat: open WeChat, and the number to add with a one-tap copy (WeChat has no public chat link by number)
// owner (19 Nov): each opens on its own (no switching); the all-contacts list is ChatChoice. Any link to wa.me anywhere on the site lands here first.
import React, { useEffect, useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import { play } from '@/lib/sound';
import { T as t } from '@/components/site/ui';
import { backend, wasSent } from '@/lib/backend';
import { messageId, withSys, sysBlock } from '@/lib/ids';
import { site } from '@/content/facts';

// every tap on "Open WhatsApp" / "Open WeChat" also lands in the Control Room inbox with the page and the message,
// unless a form already sent that same card. Visitors stay anonymous unless they signed in.
// owner (19 Nov): staff see how loyal a visitor is: their website level and points travel with every contact
const lvl = () => { try { const w = window as unknown as { __seLvl?: () => { name: string; xp: number } }; const L = w.__seLvl?.(); return L ? '\n*Website level:* ' + L.name + ' (' + L.xp + ' points)' : ''; } catch { return ''; } };
const logTap = (mode: Mode, text: string) => {
  // owner (R12): every action has its sound: a message or order going out plays the "send" phrase
  import('@/lib/sound').then((m) => m.play('send')).catch(() => {});
  import('@/lib/achievements').then((a) => a.unlock('contact')).catch(() => {});
  if (wasSent(text)) return;
  backend.me().then((u) => backend.send({ name: u?.name || 'Website visitor', email: u?.email || undefined, topic: CH[mode] + ' · ' + location.pathname,
    text: '*Opened ' + CH[mode] + '*\n*Page:* ' + location.href + lvl() + '\n\n' + text })).catch(() => { /* offline: WhatsApp still opens */ });
};

export const WECHAT = { number: '+971 50 342 0015', raw: '971503420015' };
export const WHATSAPP = { number: '+971 50 342 0015', raw: '971503420015' };
type Mode = 'wa' | 'wc' | 'mail' | 'web';
const CH: Record<Mode, 'WhatsApp' | 'WeChat' | 'E-mail' | 'Website'> = { wa: 'WhatsApp', wc: 'WeChat', mail: 'E-mail', web: 'Website' };
const DEF_MSG = 'Hi Sam Electronics, I have a question.';

export const openContact = (mode: Mode, text?: string) => window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode, text } }));

function Qr({ text }: { text: string }) {
  const svg = useMemo(() => { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }, [text]);
  return <span className="ct-qr" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function WeChatSheet() {
  const [open, setOpen] = useState(false), [mode, setMode] = useState<Mode>('wa'), [msg, setMsg] = useState(DEF_MSG), [copied, setCopied] = useState(false), [note, setNote] = useState(''), [mcopied, setMcopied] = useState(false), [mid, setMid] = useState(''), [sent, setSent] = useState(false);
  useEffect(() => {
    const show = (m: Mode, text?: string) => { setSent(false); setCopied(false); setNote(''); setMcopied(false); setMid(messageId()); setMode(m); setMsg(text || DEF_MSG); setOpen(true); play('open'); };
    const onC = (e: Event) => { const d = (e as CustomEvent).detail || {}; show((['wa', 'wc', 'mail', 'web'].includes(d.mode) ? d.mode : 'wa') as Mode, d.text); };
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
  // owner (R11): the customer writes only their own words; the system details are added by the site, shown in full in
  // every channel (e-mail too) and cannot be edited. Switching channel keeps everything they wrote.
  const sys = msg !== DEF_MSG, full0 = sys ? msg + (note.trim() ? '\n\n*' + t('Note') + ':* ' + note.trim() : '') : (note.trim() || DEF_MSG);
  const has = /\*Message ID:\*|\*SYSTEM DETAILS\*/.test(full0), lock = has ? '' : sysBlock(CH[mode], mid);
  const full = has ? full0 : withSys(full0, CH[mode], mid);
  const C = mode === 'wc' ? WECHAT : WHATSAPP, waUrl = 'https://wa.me/' + WHATSAPP.raw + '?text=' + encodeURIComponent(full);
  const mailUrl = 'mailto:' + site.contact.email + '?subject=' + encodeURIComponent('Sam Electronics · ' + (mid || 'Inquiry')) + '&body=' + encodeURIComponent(full.replace(/\*/g, ''));
  const sendWeb = () => { backend.me().then((u) => backend.send({ name: u?.name || 'Website visitor', email: u?.email || undefined, topic: 'Website · ' + location.pathname, text: full })).catch(() => { /* offline */ }).finally(() => { setSent(true); play('success'); }); };
  const copyMsg = async () => { try { await navigator.clipboard.writeText(full); } catch { /* */ } setMcopied(true); };
  const fmt = (x: string) => x.split('\n').map((ln, i) => ln.trim() ? <span key={i} className="ct-pl">{ln.split(/(\*[^*]+\*)/g).map((p2, j) => p2.length > 2 && p2.startsWith('*') && p2.endsWith('*') ? <b key={j}>{p2.slice(1, -1)}</b> : p2.length > 2 && /^_[^_]+_$/.test(p2.trim()) ? <i key={j}>{p2.trim().slice(1, -1)}</i> : p2)}</span> : <span key={i} className="ct-pg" />);
  const copy = async () => { try { await navigator.clipboard.writeText(C.number); } catch { /* */ } setCopied(true); play('success'); };
  return (
    <div className="wc-veil ct-veil" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className={'wc-card ct-card ' + mode} role="dialog" aria-modal="true" aria-label={t(mode === 'wa' ? 'WhatsApp us' : 'WeChat us')}>
        <button type="button" className="wc-x" aria-label={t('Close')} onClick={() => setOpen(false)}>✕</button>
        <div className="ct-cols"><div className="ct-l">
        {/* owner (R11): every way to reach us sits on one bar at the top; switching keeps what the customer wrote */}
        <span className="ct-switch" role="tablist">{(['wa', 'wc', 'mail', 'web'] as Mode[]).map((m) => <button key={m} type="button" role="tab" aria-selected={m === mode} className={'ct-swb ' + m + (m === mode ? ' on' : '')} onClick={() => { if (m !== mode) { setMode(m); setSent(false); setCopied(false); setMcopied(false); play('tab'); } }}><i className={'ct-ic ' + m} />{t(CH[m])}</button>)}</span>
        <b className="wc-h">{t(mode === 'wa' ? 'WhatsApp us' : mode === 'wc' ? 'WeChat us' : mode === 'mail' ? 'E-mail us' : 'Send it on the website')}</b>
        <p className="wc-p">{t(mode === 'wa' ? 'Chat with our team. Open WhatsApp on this device, or scan the code with your phone.' : mode === 'wc' ? 'Add our number in WeChat and send us a message. We reply in Arabic, English and Chinese.' : mode === 'mail' ? 'We reply to every e-mail, usually the same day.' : 'It goes straight to our team’s inbox. We answer on the channel you prefer.')}</p>
        <div className="ct-body">
          {mode === 'wa' ? <span className="ct-qrw"><Qr text={waUrl} /><small>{t('Scan with your phone')}</small></span> : null}
          {mode === 'wa' || mode === 'wc' ? <span className="ct-numw"><small>{t(mode === 'wa' ? 'WhatsApp number' : 'WeChat number')}</small><span className="wc-num" dir="ltr">{C.number}</span>
            <button type="button" className="ct-copy" onClick={copy}>{copied ? t('Copied') + ' ✓' : t('Copy number')}</button></span> : null}
          {mode === 'mail' ? <span className="ct-numw"><small>{t('E-mail')}</small><span className="wc-num sm" dir="ltr">{site.contact.email}</span>
            <button type="button" className="ct-copy" onClick={async () => { try { await navigator.clipboard.writeText(site.contact.email); } catch { /* */ } setCopied(true); play('success'); }}>{copied ? t('Copied') + ' ✓' : t('Copy address')}</button></span> : null}
          {mode === 'web' ? <span className="ct-numw"><small>{t('Inquiry ID')}</small><span className="wc-num sm" dir="ltr">{mid}</span><small className="ct-hint">{t('given when sent')}</small></span> : null}
        </div>
        </div><div className="ct-r">
        <div className="ct-compose">
          {/* owner (R12): an order is part of the SYSTEM message (locked, the team receives the complete order); the customer
              only writes their own note below */}
          {/* R15 (owner: "one automatic message wherever you are carries the details: not an automatic system block AND an order
              block"): the customer writes on top; ONE locked block below holds everything the site adds (the order or
              enquiry, then the system details) */}
          <textarea className="ct-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t(sys ? 'Add a personal note (optional)' : 'Write your message')} />
          {sys || lock ? <div className="ct-lock" aria-label={t('The message our team receives')}><small><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>{t('Added automatically · cannot be edited')}<InfoTip k="system" side="top" /></small><div className="ct-pv">{sys ? fmt(msg) : null}{sys && lock ? <span className="ct-pg" /> : null}{lock ? fmt(lock) : null}</div></div> : null}
        </div>
        <div className="ct-acts">
          {mode === 'mail' ? <><button type="button" className="wc-btn" onClick={copyMsg}>{mcopied ? t('Message copied') + ' ✓' : t('Copy message')}</button><a className="wc-btn go ml" href={mailUrl} data-direct="" onClick={() => { logTap('mail', full); }}><i className="ct-ic mail" />{t('Open my e-mail app')}</a></>
            : mode === 'web' ? (sent ? <span className="ct-sent">✓ {t('Sent. Our team will reply soon.')}</span> : <button type="button" className="wc-btn go web" onClick={sendWeb}><i className="ct-ic web" />{t('Send on the website')}</button>)
            : mode === 'wa'
            ? <a className="wc-btn go wa" href={waUrl} target="_blank" rel="noopener" onClick={() => { logTap('wa', full); window.setTimeout(() => setOpen(false), 300); }}><i className="ct-ic wa" />{t('Open WhatsApp')}</a>
            : <><button type="button" className="wc-btn" onClick={copyMsg}>{mcopied ? t('Message copied') + ' ✓' : t('Copy message')}</button><a className="wc-btn go" href="weixin://" onClick={() => { logTap('wc', full); copyMsg(); }}><i className="ct-ic wc" />{t('Open WeChat')}</a></>}
        </div>
        </div></div>
      </div>
    </div>
  );
}
