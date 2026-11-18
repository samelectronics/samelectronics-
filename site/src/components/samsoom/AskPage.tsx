'use client';
// P3 · ASK SAMSOOM (/samsoom): a full-page chat with Samsoom. Conversations on the left (new, open, rename, delete;
// kept on this device in 'se-chats'), the conversation in the middle, and a composer with a photo button, voice typing
// and quick topics. Owner (17 Nov): "the chat looks unprofessional and boring and doesn't have many options".
// Answers come from Samsoom's own brain (brain2: free, no AI service). Photos are read in the browser (free).
// Every answer can be copied, rated and followed up with one tap; a person is always one tap away (WhatsApp, WeChat).
import '@/styles/ask.css';
import React, { useEffect, useRef, useState } from 'react';
import { search, data, byId, type Product, priceText } from '@/lib/catalog';
import { emoteFor } from './brain';
import { think, unknown, readPhoto, lookup } from './brain2';
import { store } from '@/lib/store';
import { backend } from '@/lib/backend';
import { T, flyToCart } from '@/components/site/ui';
import LiveSam from './LiveSam';
import Typed from './Typed';

type Msg = { cmp?: string[]; mode?: string; t: string; me: boolean; emote?: string | null; own?: boolean; parts?: string[]; img?: string; act?: string; at?: number; sug?: [string, string][]; rate?: 1 | -1 };
type Chat = { id: string; title: string; named: boolean; msgs: Msg[]; at: number; quote?: { id: string; qty: number }[] };
// owner (18 Nov): "add more useful tools: modes, tones (friendly by default, direct, …), search mode, comparison; settings"
type Tone = 'friendly' | 'direct' | 'detailed' | 'fun';
type Mode = 'chat' | 'search' | 'compare' | 'quote';
type Cfg = { tone: Tone; mode: Mode; voice: boolean; speak: boolean };
const CFG_KEY = 'se-sam-cfg';
const CFG0: Cfg = { tone: 'friendly', mode: 'chat', voice: true, speak: false };
const readCfg = (): Cfg => { try { return { ...CFG0, ...JSON.parse(localStorage.getItem(CFG_KEY) || '{}') }; } catch { return CFG0; } };
const TONES: [Tone, string, string][] = [['friendly', 'Friendly', 'Warm and helpful (default)'], ['direct', 'Direct', 'Short answers, straight to the point'], ['detailed', 'Detailed', 'Extra tips and the reasons why'], ['fun', 'Fun', 'Playful, with a bit of personality']];
const MODES: [Mode, string, string][] = [['chat', 'Chat', 'Ask anything'], ['search', 'Search', 'Every message searches the catalogue'], ['compare', 'Compare', 'Grades side by side for a model and part'], ['quote', 'Quote', 'Build a price list, then send or add it to the cart']];
const TIPS: Record<string, string> = { fmp: 'Tip: Original and Service Pack match the factory screen; OLED is the closest copy; Incell is the budget choice.', whatsapp: 'Tip: send the team a photo of the label on the old part and they will match it for you.', visit: 'Tip: the shop is busiest in the early evening; mornings are quieter.', repair: 'Tip: bring the phone with the battery above 20% so the team can test it straight away.', wholesale: 'Tip: trade accounts see trade prices on every part once approved.' };
const FUN = ['Ooh, good one!', 'Beep boop, on it!', 'Let me dig into my toolbox…', 'Say no more!'];
function styled(a: { t: string; act?: string; emote?: string; parts?: string[] }, tone: Tone) {
  let t = String(a.t || '');
  if (tone === 'direct') {
    t = t.replace(/^[^.!?\n:]{1,32}[!,]\s+/, '');
    const lines = t.split('\n'); if (lines.length > 6) t = lines.slice(0, 6).join('\n');
    t = t.replace(/\s*[^.!?\n]*\?\s*$/, (m) => (t.length - m.length > 20 ? '' : m));
  } else if (tone === 'detailed') { const tip = TIPS[a.act || ''] || (a.parts?.length ? TIPS.fmp : ''); if (tip) t += '\n\n' + T(tip); }
  else if (tone === 'fun') { t = T(FUN[Math.floor(Math.random() * FUN.length)]) + ' ' + t; }
  return { ...a, t, emote: tone === 'fun' && a.emote === 'happy' ? 'celebrate' : a.emote };
}
const KEY = 'se-chats';
const read = (): Chat[] => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const write = (l: Chat[]) => { try { localStorage.setItem(KEY, JSON.stringify(l.slice(0, 30))); } catch { /* */ } };
const START: [string, string, string][] = [
  ['01', 'Find my part', 'Do you have the Galaxy A54 screen in Service Pack?'],
  ['02', 'Which grade?', 'What is the difference between Original, OLED and Incell?'],
  ['03', 'Repair price', 'How much to fit an iPhone 13 battery?'],
  ['04', 'Are you open?', 'Are you open right now?'],
  ['05', 'Shipping', 'Do you ship to Nigeria?'],
  ['06', 'My phone won’t charge', 'My phone is not charging, what should I do?'],
];
const TOPICS: [string, string][] = [['Find a part', 'iPhone 13 screen'], ['Opening hours', 'Are you open right now?'], ['Repair price', 'How much to fit an iPhone 13 battery?'], ['Shipping', 'Do you ship worldwide?'], ['Grades', 'What is the difference between the grades?'], ['Wholesale', 'How do I get trade prices?']];
const shrink = (f: File, max: number, q = 0.82): Promise<string> => new Promise((res, rej) => { const u = URL.createObjectURL(f), im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d')!.drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', q)); }; im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('bad image')); }; im.src = u; });
const CAN: [string, string][] = [['Finds parts', 'Any model, any grade, with the price and stock'], ['Prices repairs', 'Part and fitting, with the time it takes'], ['Reads photos', 'A screenshot of Settings → About, or the box label'], ['Hands you to a person', 'The team on WhatsApp or WeChat, with your chat']];
const CODES: [string, string][] = [['iPhone', 'Settings → General → About → Model Number. Tap it once to see the A-number (e.g. A2633). Or read it on the SIM tray slot.'], ['Samsung', 'Settings → About phone → Model number (SM-A546B…). Also on the box label.'], ['Xiaomi / Redmi / POCO', 'Settings → About phone → All specs → Model.'], ['Huawei / Honor', 'Settings → About phone → Model.'], ['Google Pixel', 'Settings → About phone → Model (e.g. GD1YQ).'], ['Any phone', 'Dial *#06# for the IMEI and send it to us: we find the exact model.']];
const ACT: Record<string, [string, string]> = { visit: ['Opening hours & directions', '/contact#visit'], repair: ['Repair Lab', '/repair'], wholesale: ['Wholesale', '/wholesale'], network: ['Worldwide shipping', '/worldwide'], models: ['Brands & grades', '/brands'], fmp: ['Open the shop', '/shop'], story: ['Our story', '/story'], circuit: ['Sam Circuit', '/membership'], whatsapp: ['WhatsApp the team', 'https://wa.me/971503420015'] };
/** one-tap follow-ups that fit the answer */
function followUps(a: { act?: string; parts?: string[] }): [string, string][] {
  if (a.parts && a.parts.length) return [['Fitting price', 'How much with fitting?'], ['The cheapest one', 'Which is the cheapest?'], ['Compare the grades', 'What is the difference between the grades?']];
  switch (a.act) {
    case 'visit': return [['Where are you?', 'Where is the shop?'], ['Open on Friday?', 'Are you open on Friday?'], ['Call the shop', 'How can I contact you?']];
    case 'network': return [['Find my part', 'iPhone 13 screen'], ['Trade prices', 'How do I get trade prices?']];
    case 'repair': return [['iPhone 13 screen fitted', 'iPhone 13 screen repair price'], ['Are you open now?', 'Are you open right now?']];
    case 'whatsapp': return [['Find my part', 'Galaxy A54 screen'], ['Opening hours', 'Are you open right now?']];
    case 'models': return [['iPhone 13 screen', 'iPhone 13 screen'], ['Galaxy A54 battery', 'Galaxy A54 battery']];
    default: return [['Find my part', 'iPhone 13 screen'], ['Are you open now?', 'Are you open right now?'], ['Tell me a joke', 'Tell me a joke']];
  }
}
const hhmm = (t?: number) => (t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

/** an answer laid out like a receipt: a title line, then rows (label · value), then the closing line */
function Rich({ text }: { text: string }) {
  const lines = text.split('\n').filter(Boolean);
  return (
    <div className="ak-rich">
      {lines.map((l, i) => {
        if (l.startsWith('• ')) { const k = l.slice(2).indexOf(': '); return k > 0 ? <div key={i} className="ak-row" style={{ animationDelay: i * 70 + 'ms' }}><b>{l.slice(2, 2 + k)}</b><span>{l.slice(4 + k)}</span></div> : <div key={i} className="ak-row one" style={{ animationDelay: i * 70 + 'ms' }}><span>{l.slice(2)}</span></div>; }
        if (i === 0 && /:$/.test(l)) return <strong key={i} className="ak-rh">{l.slice(0, -1)}</strong>;
        return <p key={i} style={{ animationDelay: i * 70 + 'ms' }}>{l}</p>;
      })}
    </div>
  );
}

export default function AskPage() {
  const [chats, setChats] = useState<Chat[]>([]), [id, setId] = useState<string | null>(null), [q, setQ] = useState(''), [typing, setTyping] = useState<false | 'think' | 'photo'>(false), [mood, setMood] = useState<string | undefined>('wave');
  const [ren, setRen] = useState<string | null>(null), [rname, setRname] = useState(''), [side, setSide] = useState(false), [img, setImg] = useState<{ big: string; small: string } | null>(null), [codes, setCodes] = useState(false);
  const [cfg, setCfgS] = useState<Cfg>(CFG0), [menu, setMenu] = useState<'' | 'contact' | 'settings'>('');
  const setCfg = (c: Partial<Cfg>) => setCfgS((o) => { const n = { ...o, ...c }; try { localStorage.setItem(CFG_KEY, JSON.stringify(n)); } catch { /* */ } return n; });
  // owner (18 Nov): report an answer with a quick 'why?'; the team gets it in the Control Room inbox as a complaint
  const [find, setFind] = useState(''), [rep, setRep] = useState<number | null>(null), [why, setWhy] = useState(''), [repTxt, setRepTxt] = useState(''), [repDone, setRepDone] = useState<number[]>([]);
  const report = async (i: number) => {
    const m = msgs[i], prev = [...msgs.slice(0, i)].reverse().find((x) => x.me);
    const me = await backend.me().catch(() => null);
    await backend.send({ name: me?.name || T('Website visitor'), email: me?.email || undefined, topic: 'Complaint · Samsoom answer', text: '[' + (why || 'Other') + ']\n' + (repTxt.trim() ? repTxt.trim() + '\n\n' : '') + 'Q: ' + (prev?.t || '') + '\nA: ' + m.t + '\nPage: /samsoom' }).catch(() => null);
    setRepDone((l) => [...l, i]); setRep(null); setWhy(''); setRepTxt('');
  };
  const [listening, setListening] = useState(false), [canTalk, setCanTalk] = useState(false), [copied, setCopied] = useState<number | null>(null);
  const file = useRef<HTMLInputElement>(null), rec = useRef<{ stop: () => void } | null>(null);
  const pickImg = async (f?: File | null) => { if (!f || !/^image\//.test(f.type)) return; try { setImg({ big: await shrink(f, 1400), small: await shrink(f, 220, 0.7) }); } catch { /* unreadable */ } };
  const box = useRef<HTMLDivElement>(null), inp = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setCfgS(readCfg()); const l = read(); setChats(l); const c = new URLSearchParams(location.search).get('c'); if (c && l.some((x) => x.id === c)) setId(c);
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }; setCanTalk(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    document.documentElement.classList.add('ak-page'); return () => document.documentElement.classList.remove('ak-page');
  }, []);
  const cur = chats.find((c) => c.id === id) || null, msgs = cur ? cur.msgs : [];
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [msgs.length, typing]);
  const save = (fn: (l: Chat[]) => Chat[]) => { const next = fn(read()); write(next); setChats(next); };
  const local = (text: string): { t: string; act?: string; emote?: string; parts?: string[] } => {
    const found = search(text).filter((p) => p.stock_qty > 0).slice(0, 4);
    if (found.length && /\d|screen|battery|lcd|flex|camera|cover|frame|شاش|بطار/i.test(text)) return { t: T('Here is what I found in stock') + ':', parts: found.map((p) => p.id), emote: 'found', act: 'fmp' };
    void data; return unknown(text, { history: (read().find((c) => c.id === id)?.msgs || []).filter((m) => m.me).map((m) => m.t), tr: (s: string) => T(s) });
  };
  const ask = async (text: string) => {
    text = text.trim(); const pic = img; if (!text && !pic) return; if (!text) text = T('Here is a photo of my phone. What does it need?'); setQ(''); setImg(null);
    let cid = id;
    if (!cid) { cid = 'c' + Date.now().toString(36); const c: Chat = { id: cid, title: text.length > 42 ? text.slice(0, 40) + '…' : text, named: false, msgs: [], at: Date.now() }; save((l) => [c, ...l]); setId(cid); history.replaceState(null, '', '/samsoom?c=' + cid); }
    const me: Msg = { t: text, me: true, at: Date.now(), ...(pic ? { img: pic.small } : {}) };
    save((l) => l.map((c) => (c.id === cid ? { ...c, msgs: [...c.msgs.map((m) => ({ ...m, sug: undefined })), me], at: Date.now() } : c)));
    setTyping(pic ? 'photo' : 'think'); setMood('think');
    const hist: { role: string; text: string; image?: string }[] = [...(read().find((c) => c.id === cid)?.msgs || [])].map((m) => ({ role: m.me ? 'user' : 'assistant', text: m.t })).slice(-12);
    let ans: { t: string; act?: string; emote?: string; parts?: string[] };
    const ctx = { history: hist.filter((h) => h.role === 'user').slice(0, -1).map((h) => h.text), tr: (x: string) => T(x) };
    const own = pic ? await readPhoto(pic.big, ctx, text === T('Here is a photo of my phone. What does it need?') ? '' : text) : think(text, ctx);
    if (own) { ans = own; } else try {
      const r = await fetch('/api/samsoom', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: hist, lang: window.seI18n ? window.seI18n.lang() : 'en' }) });
      const j = r.ok ? await r.json() : { fallback: true };
      const lk = local(text);
      ans = j && !j.fallback && j.text ? (lk.parts ? { ...lk, t: j.text } : { t: j.text, act: j.action, emote: emoteFor(text, j.text) || 'happy' }) : lk;
    } catch { ans = local(text); }
    ans = styled(ans, cfg.tone);
    // modes: search shows the catalogue for every message, compare lines the grades up, quote collects a price list
    let cmp: string[] | undefined;
    if (!pic && cfg.mode !== 'chat') {
      const lk = lookup(text);
      if (cfg.mode === 'search') { if (lk.list.length) ans = { ...ans, t: (lk.model ? lk.model + ' · ' : '') + lk.list.length + ' ' + T('matching parts') + '. ' + T('Here are the best ones') + ':', parts: lk.list.slice(0, 8).map((p) => p.id), emote: 'found' }; }
      else if (cfg.mode === 'compare') { if (lk.list.length > 1) { cmp = lk.list.slice(0, 8).map((p) => p.id); ans = { ...ans, t: (lk.model || '') + ' · ' + T('every grade side by side') + ':', parts: undefined, emote: 'found' }; } else ans = { ...ans, t: T('Tell me a model and a part to compare, for example: iPhone 13 screen.'), parts: undefined }; }
      else if (cfg.mode === 'quote') { const pick = lk.list.find((p) => p.stock_qty > 0) || lk.list[0]; if (pick) { save((l) => l.map((c) => (c.id === cid ? { ...c, quote: [...(c.quote || []).filter((x) => x.id !== pick.id), { id: pick.id, qty: ((c.quote || []).find((x) => x.id === pick.id)?.qty || 0) + 1 }] } : c))); ans = { ...ans, t: T('Added to your quote') + ': ' + pick.modelName + ' · ' + pick.gradeName + '. ' + T('Ask for the next part, or send the quote below.'), parts: lk.list.slice(0, 3).map((p) => p.id), emote: 'happy' }; } else ans = { ...ans, t: T('Tell me the model and the part to add, for example: Galaxy A54 battery.'), parts: undefined }; }
    }
    await new Promise((r) => setTimeout(r, 450));
    setTyping(false); setMood(ans.emote || 'happy'); if (cfg.voice) import('@/lib/voice').then((m) => m.babble(String(ans.t || ''))).catch(() => {});
    if (cfg.speak && 'speechSynthesis' in window) { try { const u = new SpeechSynthesisUtterance(String(ans.t || '').replace(/[•\n]+/g, '. ')); u.lang = window.seI18n ? window.seI18n.lang() : 'en'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch { /* */ } }
    const bot: Msg = { ...(cmp ? { cmp } : {}), mode: cfg.mode, t: ans.t, me: false, emote: ans.emote || null, own: true, parts: ans.parts, at: Date.now(), sug: followUps(ans), ...(ans.act ? { act: ans.act } : {}) };
    save((l) => l.map((c) => (c.id === cid ? { ...c, msgs: [...c.msgs, bot], at: Date.now() } : c)));
  };
  const fresh = () => { setId(null); setMood('wave'); history.replaceState(null, '', '/samsoom'); inp.current?.focus(); setSide(false); };
  const rate = (i: number, v: 1 | -1) => save((l) => l.map((c) => (c.id === id ? { ...c, msgs: c.msgs.map((m, k) => (k === i ? { ...m, rate: m.rate === v ? undefined : v } : m)) } : c)));
  const copy = (i: number, t: string) => { navigator.clipboard?.writeText(t).then(() => { setCopied(i); setTimeout(() => setCopied(null), 1400); }).catch(() => {}); };
  const talk = () => {
    if (listening) { rec.current?.stop(); return; }
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    type SR = { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void; stop: () => void };
    const C = w.SpeechRecognition || w.webkitSpeechRecognition; if (!C) return;
    const r = new C(); r.lang = window.seI18n ? window.seI18n.lang() : 'en'; r.interimResults = true;
    r.onresult = (e) => { let s = ''; for (let k = 0; k < e.results.length; k++) s += e.results[k][0].transcript; setQ(s); };
    r.onend = () => setListening(false); r.onerror = () => setListening(false);
    rec.current = r; setListening(true); try { r.start(); } catch { setListening(false); }
  };
  const person = () => window.dispatchEvent(new CustomEvent('se:person'));
  const contact = (mode: 'wa' | 'wc') => window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode, text: msgs.length ? msgs.slice(-6).map((m) => (m.me ? 'Me: ' : 'Samsoom: ') + m.t).join('\n') : '' } }));
  const info = (data() as unknown as { contact?: { phone?: string; email?: string } } | null)?.contact || {};
  const CONTACT: [string, string, () => void][] = [
    ['Live chat with the team', 'A real person, right on the website', () => { location.href = '/contact#chat'; }],
    ['WhatsApp', 'Fastest for stock, prices and orders', () => contact('wa')],
    ['WeChat', 'Add our number and send a message', () => contact('wc')],
    ['Call the shop', info.phone || '+971 4 273 3031', () => { location.href = 'tel:' + String(info.phone || '+97142733031').replace(/\s/g, ''); }],
    ['E-mail', info.email || 'samelectronics.uae@gmail.com', () => { location.href = 'mailto:' + (info.email || 'samelectronics.uae@gmail.com'); }],
    ['Visit the counter', 'Al Murar, Deira, Dubai', () => { location.href = '/contact#visit'; }],
  ];
  const cq = cur?.quote || [], qItems = cq.map((x) => ({ ...x, p: byId(x.id) })).filter((x) => x.p) as { id: string; qty: number; p: Product }[];
  const qTotal = qItems.reduce((a, x) => a + x.p.price * x.qty, 0);
  const setQty = (pid: string, d: number) => save((l) => l.map((c) => (c.id === id ? { ...c, quote: (c.quote || []).map((x) => (x.id === pid ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0) } : c)));
  const sendQuote = () => window.dispatchEvent(new CustomEvent('se:contact', { detail: { mode: 'wa', text: T('Quote request') + ':\n' + qItems.map((x) => '• ' + x.qty + ' × ' + x.p.modelName + ' ' + x.p.catName + ' (' + x.p.gradeName + ') · ' + priceText(x.p.price)).join('\n') + '\n' + T('Total') + ': ' + priceText(qTotal) } }));
  const lastBot = msgs.length && !msgs[msgs.length - 1].me ? msgs.length - 1 : -1;

  return (
    <div className="ak">
      <aside className={'ak-side' + (side ? ' open' : '')}>
        <button type="button" className="ak-new" onClick={fresh}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>{T('New chat')}</button>
        <label className="ak-find"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg><input value={find} onChange={(e) => setFind(e.target.value)} placeholder={T('Search chats')} aria-label={T('Search chats')} /></label>
        <span className="ak-h">{T('Recents')}</span>
        <div className="ak-list">
          {chats.length ? chats.filter((c) => !find.trim() || (c.title + ' ' + c.msgs.map((m) => m.t).join(' ')).toLowerCase().includes(find.trim().toLowerCase())).map((c) => (
            <div key={c.id} className={'ak-it' + (c.id === id ? ' on' : '')}>
              {ren === c.id ? (
                <form onSubmit={(e) => { e.preventDefault(); save((l) => l.map((x) => (x.id === c.id ? { ...x, title: rname.trim() || x.title, named: true } : x))); setRen(null); }}><input autoFocus value={rname} onChange={(e) => setRname(e.target.value)} onBlur={() => setRen(null)} /></form>
              ) : (
                <button type="button" className="ak-open" onClick={() => { setId(c.id); setSide(false); history.replaceState(null, '', '/samsoom?c=' + c.id); }}><b>{c.title}</b><small>{new Date(c.at).toLocaleDateString()} · {c.msgs.length} {T('messages')}</small></button>
              )}
              <span className="ak-tools">
                <button type="button" onClick={() => { setRen(c.id); setRname(c.title); }} aria-label={T('Rename')} title={T('Rename')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z" /></svg></button>
                <button type="button" onClick={() => { save((l) => l.filter((x) => x.id !== c.id)); if (id === c.id) fresh(); }} aria-label={T('Delete')} title={T('Delete')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg></button>
              </span>
            </div>
          )) : <small className="ak-none">{T('Your conversations will appear here.')}</small>}
        </div>
        <div className="ak-people">
          <span className="ak-h">{T('Prefer a person?')}</span>
          <button type="button" className="ak-contact" onClick={() => setMenu(menu === 'contact' ? '' : 'contact')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>{T('Contact us')}</button>
          <small className="ak-foot">{T('Chats are kept on this device only.')}</small>
        </div>
      </aside>

      <section className="ak-main">
        <header className="ak-top">
          <button type="button" className="ak-menu" onClick={() => setSide(!side)} aria-label={T('Chats')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg></button>
          <span className="ak-who"><span className="ak-av" data-sam-talk=""><LiveSam size={34} mood="idle" /></span><span><b>Samsoom</b><small><i />{typing ? (typing === 'photo' ? T('Reading your photo…') : T('Typing…')) : T('Online · replies instantly')}</small></span></span>
          <span className="ak-title">{cur ? cur.title : T('New chat')}</span>
          <span className="ak-acts">
            <button type="button" className={'ak-ic' + (menu === 'settings' ? ' on' : '')} onClick={() => setMenu(menu === 'settings' ? '' : 'settings')} aria-label={T('Samsoom settings')} title={T('Samsoom settings')} aria-expanded={menu === 'settings'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg></button>
            <button type="button" className="ak-human" onClick={() => setMenu(menu === 'contact' ? '' : 'contact')} aria-expanded={menu === 'contact'}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg><span>{T('Contact us')}</span></button>
          </span>
        </header>
        {menu ? <button type="button" className="ak-veil" aria-label={T('Close')} data-close="" onClick={() => setMenu('')} /> : null}
        {menu === 'contact' ? (
          <div className="ak-pop" role="dialog" aria-label={T('Contact us')}>
            <b className="ak-pop-h">{T('Contact us')}</b><small className="ak-pop-s">{T('Reach the team the way you like. Your chat with Samsoom can come along.')}</small>
            {CONTACT.map(([l, d, go], k) => <button key={l} type="button" className="ak-pop-i" onClick={() => { setMenu(''); go(); }}><em>{String(k + 1).padStart(2, '0')}</em><span><b>{T(l)}</b><small>{l === 'Call the shop' || l === 'E-mail' ? d : T(d)}</small></span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg></button>)}
          </div>
        ) : null}
        {menu === 'settings' ? (
          <div className="ak-pop wide" role="dialog" aria-label={T('Samsoom settings')}>
            <b className="ak-pop-h">{T('Samsoom settings')}</b>
            <span className="ak-pop-l">{T('Tone')}</span>
            <div className="ak-seg">{TONES.map(([k, l, d]) => <button key={k} type="button" className={cfg.tone === k ? 'on' : ''} onClick={() => setCfg({ tone: k })}><b>{T(l)}</b><small>{T(d)}</small></button>)}</div>
            <span className="ak-pop-l">{T('Mode')}</span>
            <div className="ak-seg">{MODES.map(([k, l, d]) => <button key={k} type="button" className={cfg.mode === k ? 'on' : ''} onClick={() => setCfg({ mode: k })}><b>{T(l)}</b><small>{T(d)}</small></button>)}</div>
            <span className="ak-pop-l">{T('Sound')}</span>
            <label className="ak-tg"><input type="checkbox" checked={cfg.voice} onChange={(e) => setCfg({ voice: e.target.checked })} /><span>{T('Samsoom babbles while he answers')}</span></label>
            <label className="ak-tg"><input type="checkbox" checked={cfg.speak} onChange={(e) => setCfg({ speak: e.target.checked })} /><span>{T('Read answers aloud')}</span></label>
            <button type="button" className="ak-pop-del" onClick={() => { if (confirm(T('Delete every chat on this device?'))) { write([]); setChats([]); fresh(); setMenu(''); } }}>{T('Delete all chats')}</button>
          </div>
        ) : null}
        <div className="ak-msgs" ref={box}>
          {!msgs.length ? (
            <div className="ak-hello">
              <div className="ak-card">
                <span className="ak-big"><LiveSam size={130} mood="idle" play={mood} /></span>
                <div>
                  <span className="ak-kick">{T('Samsoom · Sam Electronics assistant')}</span>
                  <h1 className="sp-h2">{T('Ask me anything.')}</h1>
                  <p className="sp-p">{T('Parts, grades, prices, repairs, shipping, opening hours: I know the shop inside out. Spelling mistakes are fine, and I speak your language.')}</p>
                </div>
              </div>
              <div className="ak-can">{CAN.map(([t, d]) => <span key={t}><b>{T(t)}</b><small>{T(d)}</small></span>)}</div>
              <span className="ak-sub">{T('Popular questions')}</span>
              <div className="ak-start">{START.map(([n, t, qq]) => <button key={t} type="button" onClick={() => ask(T(qq))}><em>{n}</em><span><b>{T(t)}</b><small>{T(qq)}</small></span></button>)}</div>
              <button type="button" className="ak-codebtn" onClick={() => setCodes(!codes)} aria-expanded={codes}>{T('Where do I find my model code?')}</button>
              {codes ? <div className="ak-codes">{CODES.map(([b, d]) => <div key={b}><b>{b}</b><span>{T(d)}</span></div>)}<button type="button" className="sp-btn sm" onClick={() => { setCodes(false); file.current?.click(); }}>{T('Send Samsoom a screenshot')}</button></div> : null}
            </div>
          ) : msgs.map((m, i) => (
            <div key={i} className={'ak-m' + (m.me ? ' me' : '')}>
              {!m.me ? <span className="ak-mav" data-sam-talk=""><LiveSam size={30} mood="idle" play={i === msgs.length - 1 ? m.emote || undefined : undefined} /></span> : null}
              <div className="ak-col">
                <span className="ak-meta">{m.me ? T('You') : 'Samsoom'}{m.at ? ' · ' + hhmm(m.at) : ''}</span>
                <div className="ak-bub">
                  {m.img ? <img className="ak-img" src={m.img} alt={T('Your photo')} /> : null}
                  {m.me ? <p>{m.t}</p> : /\n•/.test(m.t) ? <Rich text={m.t} /> : <p>{i === msgs.length - 1 && m.own ? <Typed text={m.t} /> : m.t}</p>}
                  {m.cmp ? <div className="ak-cmp" role="table">{[['Grade', 'Maker', 'Warranty', 'Stock', 'Price']].map((h) => <div key="h" className="ak-cmp-r h" role="row">{h.map((x) => <span key={x} role="columnheader">{T(x)}</span>)}<span /></div>)}{m.cmp.map((pid) => { const p = byId(pid); return p ? <div key={pid} className="ak-cmp-r" role="row"><span><b>{p.gradeName}</b></span><span>{p.makerName}</span><span>{T(p.warranty || '')}</span><span className={p.stock_qty > 0 ? 'in' : 'out'}>{p.stock_qty > 0 ? T('in stock') : T('ask us')}</span><span><b>{priceText(p.price)}</b></span><button type="button" onClick={(e) => flyToCart(null, p.id, e)} aria-label={T('Add to cart')}>+</button></div> : null; })}</div> : null}
                  {m.parts ? <div className="ak-parts">{m.parts.map((pid) => { const p = byId(pid); return p ? <PartCard key={pid} p={p} /> : null; })}</div> : null}
                  {m.act && ACT[m.act] ? <a className={'ak-go' + (m.act === 'whatsapp' ? ' wa' : '')} href={ACT[m.act][1]} target={ACT[m.act][1].startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{T(ACT[m.act][0])}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a> : null}
                </div>
                {!m.me ? (
                  <span className="ak-tools2">
                    <button type="button" onClick={() => copy(i, m.t)} aria-label={T('Copy')} title={T('Copy')}>{copied === i ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12l5 5 9-10" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>}</button>
                    <button type="button" className={m.rate === 1 ? 'on' : ''} onClick={() => rate(i, 1)} aria-label={T('Helpful')} title={T('Helpful')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v10H4V10zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 1H7" /></svg></button>
                    <button type="button" className={m.rate === -1 ? 'on' : ''} onClick={() => { rate(i, -1); if (m.rate !== -1) setRep(i); }} aria-label={T('Not helpful')} title={T('Not helpful')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleY(-1)' }}><path d="M7 10v10H4V10zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 1H7" /></svg></button>
                    <button type="button" className={rep === i || repDone.includes(i) ? 'on' : ''} disabled={repDone.includes(i)} onClick={() => setRep(rep === i ? null : i)} aria-label={T('Report this answer')} title={T('Report this answer')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V4h11l-1.5 4L16 12H5" /></svg></button>
                  </span>
                ) : null}
                {rep === i ? (
                  <form className="ak-rep" onSubmit={(e) => { e.preventDefault(); report(i); }}>
                    <b>{T('What went wrong?')}</b>
                    <span className="ak-rep-c">{['Wrong answer', 'Wrong price or stock', 'Did not understand me', 'Not helpful', 'Something else'].map((r) => <button key={r} type="button" className={why === r ? 'on' : ''} onClick={() => setWhy(r)}>{T(r)}</button>)}</span>
                    <textarea rows={2} value={repTxt} onChange={(e) => setRepTxt(e.target.value)} placeholder={T('Tell us more (optional)')} />
                    <span className="ak-rep-a"><button type="button" onClick={() => setRep(null)}>{T('Cancel')}</button><button type="submit" className="y" disabled={!why}>{T('Send report')}</button></span>
                  </form>
                ) : repDone.includes(i) ? <small className="ak-rep-ok">{T('Thanks. The team has your report and will look at it.')}</small> : null}
                {i === lastBot && m.sug && !typing ? <div className="ak-sug">{m.sug.map(([l, qq]) => <button key={l} type="button" onClick={() => ask(T(qq))}>{T(l)}</button>)}<button type="button" className="p" onClick={() => setMenu('contact')}>{T('Contact us')}</button></div> : null}
              </div>
            </div>
          ))}
          {typing ? <div className="ak-m"><span className="ak-mav"><LiveSam size={30} mood="think" /></span><div className="ak-col"><span className="ak-meta">Samsoom</span><div className="ak-bub ak-typing">{typing === 'photo' ? <span className="ak-reading">{T('Reading your photo…')}</span> : null}<i /><i /><i /></div></div></div> : null}
        </div>
        <div className="ak-dock">
          {cfg.mode === 'quote' && qItems.length ? (
            <div className="ak-quote">
              <span className="ak-quote-h"><b>{T('Your quote')}</b><small>{qItems.length} {T('items')} · {T('Total')} <strong>{priceText(qTotal)}</strong></small></span>
              <div className="ak-quote-l">{qItems.map((x) => <span key={x.id}><em>{x.p.modelName} · {T(x.p.catName)} · {x.p.gradeName}</em><i><button type="button" onClick={() => setQty(x.id, -1)} aria-label="-">−</button>{x.qty}<button type="button" onClick={() => setQty(x.id, 1)} aria-label="+">+</button></i><b>{priceText(x.p.price * x.qty)}</b></span>)}</div>
              <span className="ak-quote-a"><button type="button" onClick={() => { qItems.forEach((x) => store.add(x.id, x.qty)); window.dispatchEvent(new CustomEvent('se:cart', { detail: { id: qItems[0].id } })); }}>{T('Add all to cart')}</button><button type="button" className="y" onClick={sendQuote}>{T('Send the quote on WhatsApp')}</button></span>
            </div>
          ) : null}
          <div className="ak-modes" role="tablist" aria-label={T('Mode')}>{MODES.map(([k, l, d]) => <button key={k} type="button" role="tab" aria-selected={cfg.mode === k} className={cfg.mode === k ? 'on' : ''} title={T(d)} onClick={() => setCfg({ mode: k })}>{T(l)}</button>)}<span className="ak-tone">{T('Tone')}: <button type="button" onClick={() => setMenu('settings')}>{T(TONES.find((x) => x[0] === cfg.tone)![1])}</button></span></div>
          {msgs.length && !(lastBot >= 0 && msgs[lastBot].sug && !typing) ? <div className="ak-topics">{TOPICS.map(([l, qq]) => <button key={l} type="button" onClick={() => ask(T(qq))}>{T(l)}</button>)}</div> : null}
          {img ? <div className="ak-att"><img src={img.small} alt="" /><span>{T('Photo ready: Samsoom will read the model on it')}</span><button type="button" onClick={() => setImg(null)} aria-label={T('Remove the photo')}>×</button></div> : null}
          <form className="ak-in" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
            <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { pickImg(e.target.files?.[0]); e.target.value = ''; }} />
            <button type="button" className="ak-clip" onClick={() => file.current?.click()} aria-label={T('Send a photo')} title={T('Send a photo')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg></button>
            <textarea ref={inp} rows={1} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(q); } }} placeholder={listening ? T('Listening…') : cfg.mode === 'search' ? T('Search the catalogue: model and part…') : cfg.mode === 'compare' ? T('Compare grades: model and part…') : cfg.mode === 'quote' ? T('Add to the quote: model and part…') : T('Message Samsoom…')} aria-label={T('Message Samsoom')} />
            {canTalk ? <button type="button" className={'ak-clip' + (listening ? ' rec' : '')} onClick={talk} aria-label={T('Speak your question')} title={T('Speak your question')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg></button> : null}
            <button type="submit" className="ak-send" disabled={(!q.trim() && !img) || !!typing} aria-label={T('Send')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
          </form>
          <small className="ak-note">{T('Samsoom can make mistakes. Prices and stock are confirmed by the team on WhatsApp.')}</small>
        </div>
      </section>
    </div>
  );
}

function PartCard({ p }: { p: Product }) {
  const img = useRef<HTMLImageElement>(null);
  return (
    <div className="ak-part">
      <a href={'/shop?p=' + p.id}><img ref={img} src={p.img} alt="" /></a>
      <span><a href={'/shop?p=' + p.id}><b>{T(((data()?.categories || []) as { id: string; one?: string }[]).find((c) => c.id === p.category)?.one || p.catName) + ' ' + p.modelName}</b></a><small>{p.gradeName} · {p.makerName} · {p.stock_qty > 0 ? T('in stock') : T('ask us')}</small><b className="ak-pr">{priceText(p.price)}</b></span>
      <button type="button" className="ak-add" onClick={(e) => flyToCart(img.current, p.id, e)} aria-label={T('Add to cart')} title={T('Add to cart')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></button>
    </div>
  );
}
