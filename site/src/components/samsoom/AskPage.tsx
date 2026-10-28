'use client';
// P3 · ASK SAMSOOM (/samsoom): a full-page chat, like ChatGPT, only with Samsoom. Conversations on the left (new, open,
// rename, delete; shared with the chat bubble's history — localStorage 'se-chats'), the conversation in the middle with
// Samsoom reacting to every answer, suggestions to start, and parts he finds shown as cards you can add to the cart.
// Answers come from Claude (/api/samsoom) when the key is set; otherwise from his built-in brain + the catalogue.
import React, { useEffect, useRef, useState } from 'react';
import { search, aed, data, byId, type Product } from '@/lib/catalog';
import { fallbackAnswer, emoteFor } from './brain';
import { T, flyToCart } from '@/components/site/ui';
import LiveSam from './LiveSam';

type Msg = { t: string; me: boolean; emote?: string | null; own?: boolean; n?: number; parts?: string[] };
type Chat = { id: string; title: string; named: boolean; msgs: Msg[]; at: number };
const KEY = 'se-chats';
const read = (): Chat[] => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const write = (l: Chat[]) => { try { localStorage.setItem(KEY, JSON.stringify(l.slice(0, 30))); } catch { /* */ } };
const START = [['Find my part', 'Do you have the Galaxy A54 screen in Service Pack?'], ['Which grade?', 'What is the difference between Original, OLED and Incell?'], ['Are you open?', 'Are you open right now?'], ['Shipping', 'Do you ship to Nigeria?'], ['Repairs', 'How much to fit an iPhone 13 battery?'], ['Trade', 'How do I get trade prices for my shop?']];
const ACT: Record<string, [string, string]> = { visit: ['Opening hours & directions', '/contact#visit'], repair: ['Repair Lab', '/repair'], wholesale: ['Wholesale', '/wholesale'], network: ['Worldwide shipping', '/worldwide'], models: ['Brands & grades', '/brands'], fmp: ['Open the shop', '/shop'], story: ['Our story', '/story'], circuit: ['Sam Circuit', '/membership'], whatsapp: ['WhatsApp the team', 'https://wa.me/971503420015'] };

export default function AskPage() {
  const [chats, setChats] = useState<Chat[]>([]), [id, setId] = useState<string | null>(null), [q, setQ] = useState(''), [typing, setTyping] = useState(false), [mood, setMood] = useState<string | undefined>('wave');
  const [ren, setRen] = useState<string | null>(null), [rname, setRname] = useState(''), [side, setSide] = useState(false);
  const box = useRef<HTMLDivElement>(null), inp = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const l = read(); setChats(l); const c = new URLSearchParams(location.search).get('c'); if (c && l.some((x) => x.id === c)) setId(c); }, []);
  const cur = chats.find((c) => c.id === id) || null, msgs = cur ? cur.msgs : [];
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [msgs.length, typing]);
  const save = (fn: (l: Chat[]) => Chat[]) => { const next = fn(read()); write(next); setChats(next); };
  const local = (text: string): { t: string; act?: string; emote?: string; parts?: string[] } => {
    const found = search(text).filter((p) => p.stock_qty > 0).slice(0, 4);
    const D = data();
    if (found.length && /\d|screen|battery|lcd|flex|camera|cover|frame|شاش|بطار/i.test(text)) return { t: T('Here is what I found in stock') + ':', parts: found.map((p) => p.id), emote: 'found', act: 'fmp' };
    const fb = fallbackAnswer(text, { D, H: {}, tr: (s: string) => T(s) });
    return fb ? { t: fb.t, act: fb.act || undefined, emote: fb.emote } : { t: T('I didn’t catch that one. Try a model and a part, like “A54 battery”, or ask about grades, hours or shipping.'), emote: 'think' };
  };
  const ask = async (text: string) => {
    text = text.trim(); if (!text) return; setQ('');
    let cid = id;
    if (!cid) { cid = 'c' + Date.now().toString(36); const c: Chat = { id: cid, title: text.length > 42 ? text.slice(0, 40) + '…' : text, named: false, msgs: [], at: Date.now() }; save((l) => [c, ...l]); setId(cid); history.replaceState(null, '', '/samsoom?c=' + cid); }
    const me: Msg = { t: text, me: true };
    save((l) => l.map((c) => (c.id === cid ? { ...c, msgs: [...c.msgs, me], at: Date.now() } : c)));
    setTyping(true); setMood('think');
    const hist = [...(read().find((c) => c.id === cid)?.msgs || [])].map((m) => ({ role: m.me ? 'user' : 'assistant', text: m.t })).slice(-12);
    let ans: { t: string; act?: string; emote?: string; parts?: string[] };
    try {
      const r = await fetch('/api/samsoom', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: hist, lang: window.seI18n ? window.seI18n.lang() : 'en' }) });
      const j = r.ok ? await r.json() : { fallback: true };
      const lk = local(text);
      ans = j && !j.fallback && j.text ? (lk.parts ? { ...lk, t: j.text } : { t: j.text, act: j.action, emote: emoteFor(text, j.text) || 'happy' }) : lk;
    } catch { ans = local(text); }
    await new Promise((r) => setTimeout(r, 500));
    setTyping(false); setMood(ans.emote || 'happy');
    const bot: Msg & { act?: string } = { t: ans.t, me: false, emote: ans.emote || null, own: true, parts: ans.parts, ...(ans.act ? { act: ans.act } : {}) };
    save((l) => l.map((c) => (c.id === cid ? { ...c, msgs: [...c.msgs, bot], at: Date.now() } : c)));
  };
  const fresh = () => { setId(null); setMood('wave'); history.replaceState(null, '', '/samsoom'); inp.current?.focus(); setSide(false); };

  return (
    <div className="ak">
      <aside className={'ak-side' + (side ? ' open' : '')}>
        <button type="button" className="ak-new" onClick={fresh}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>{T('New chat')}</button>
        <span className="ak-h">{T('Your chats')}</span>
        <div className="ak-list">
          {chats.length ? chats.map((c) => (
            <div key={c.id} className={'ak-it' + (c.id === id ? ' on' : '')}>
              {ren === c.id ? (
                <form onSubmit={(e) => { e.preventDefault(); save((l) => l.map((x) => (x.id === c.id ? { ...x, title: rname.trim() || x.title, named: true } : x))); setRen(null); }}><input autoFocus value={rname} onChange={(e) => setRname(e.target.value)} onBlur={() => setRen(null)} /></form>
              ) : (
                <button type="button" className="ak-open" onClick={() => { setId(c.id); setSide(false); history.replaceState(null, '', '/samsoom?c=' + c.id); }}><b>{c.title}</b><small>{new Date(c.at).toLocaleDateString()} · {c.msgs.length}</small></button>
              )}
              <span className="ak-tools">
                <button type="button" onClick={() => { setRen(c.id); setRname(c.title); }} aria-label={T('Rename')} title={T('Rename')}>✎</button>
                <button type="button" onClick={() => { save((l) => l.filter((x) => x.id !== c.id)); if (id === c.id) fresh(); }} aria-label={T('Delete')} title={T('Delete')}>🗑</button>
              </span>
            </div>
          )) : <small className="ak-none">{T('Your conversations will appear here.')}</small>}
        </div>
        <small className="ak-foot">{T('Kept on this device. Sign in to keep them with your account once the database is connected.')}</small>
      </aside>

      <section className="ak-main">
        <header className="ak-top">
          <button type="button" className="ak-menu" onClick={() => setSide(!side)} aria-label={T('Chats')}>☰</button>
          <span className="ak-who"><span className="ak-av"><LiveSam size={34} mood="idle" /></span><span><b>Samsoom</b><small><i />{T('Online · parts assistant')}</small></span></span>
          <span className="ak-title">{cur ? cur.title : T('New chat')}</span>
        </header>
        <div className="ak-msgs" ref={box}>
          {!msgs.length ? (
            <div className="ak-hello">
              <span className="ak-big"><LiveSam size={170} mood="idle" play={mood} /></span>
              <h1 className="sp-h2">{T('Ask me anything.')}</h1>
              <p className="sp-p">{T('Parts, grades, prices, repairs, shipping, opening hours: I know the shop inside out. Spelling mistakes are fine, and I speak your language.')}</p>
              <div className="ak-start">{START.map(([t, qq]) => <button key={t} type="button" onClick={() => ask(T(qq))}><b>{T(t)}</b><small>{T(qq)}</small></button>)}</div>
            </div>
          ) : msgs.map((m, i) => (
            <div key={i} className={'ak-m' + (m.me ? ' me' : '')}>
              {!m.me ? <span className="ak-mav"><LiveSam size={30} mood="idle" play={i === msgs.length - 1 ? m.emote || undefined : undefined} /></span> : null}
              <div className="ak-bub">
                <p>{m.t}</p>
                {m.parts ? <div className="ak-parts">{m.parts.map((pid) => { const p = byId(pid); return p ? <PartCard key={pid} p={p} /> : null; })}</div> : null}
                {(m as Msg & { act?: string }).act && ACT[(m as Msg & { act?: string }).act!] ? <a className="sp-btn sm dark" href={ACT[(m as Msg & { act?: string }).act!][1]} target={ACT[(m as Msg & { act?: string }).act!][1].startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{T(ACT[(m as Msg & { act?: string }).act!][0])} →</a> : null}
              </div>
            </div>
          ))}
          {typing ? <div className="ak-m"><span className="ak-mav"><LiveSam size={30} mood="think" /></span><div className="ak-bub ak-typing"><i /><i /><i /></div></div> : null}
        </div>
        <form className="ak-in" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
          <textarea ref={inp} rows={1} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(q); } }} placeholder={T('Message Samsoom…')} aria-label={T('Message Samsoom')} />
          <button type="submit" className="ak-send" disabled={!q.trim() || typing} aria-label={T('Send')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
        </form>
        <small className="ak-note">{T('Samsoom can make mistakes. Prices and stock are confirmed by the team on WhatsApp.')}</small>
      </section>
    </div>
  );
}

function PartCard({ p }: { p: Product }) {
  const img = useRef<HTMLImageElement>(null);
  return (
    <div className="ak-part">
      <a href={'/shop?p=' + p.id}><img ref={img} src={p.img} alt="" /></a>
      <span><a href={'/shop?p=' + p.id}><b>{p.title}</b></a><small>{p.gradeName} · {p.makerName}</small><b className="ak-pr">{aed(p.price)}</b></span>
      <button type="button" className="sp-btn sm" onClick={(e) => flyToCart(img.current, p.id, e)}>+</button>
    </div>
  );
}
