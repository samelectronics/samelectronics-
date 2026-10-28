// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "SamsoomChat". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';
import SESamsoom from '../../dc/SESamsoom';
import { createScheduler } from '@/components/samsoom/scheduler';

type Msg = { t: string; me: boolean; emote: string | null; n: number; own: boolean; [k: string]: unknown };

/**
 * G8: the open chat keeps Samsoom alive. He waves when the chat opens, thinks while the answer is on its
 * way, "types" while the answer is written out, then plays the answer's context emote; in between, the
 * scheduler gives him a universal emote every 3s + 5s rest. The input lives here, so typing only
 * re-renders the chat.
 */
function useChatLife(open: boolean, typing: boolean, msgs: Msg[], listRef: React.RefObject<HTMLDivElement | null>) {
  const [mood, setMood] = useState('wave');
  const [reveal, setReveal] = useState<{ n: number; k: number } | null>(null);
  const sch = useRef<ReturnType<typeof createScheduler> | null>(null);
  const seen = useRef(0);
  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const x = createScheduler({ onMood: setMood, auto: !reduce });
    sch.current = x;
    x.play('wave');
    seen.current = Math.max(0, ...msgs.map((m) => m.n || 0)); // only new answers are written out
    return () => {
      x.stop();
      sch.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    sch.current?.base(typing ? 'think' : reveal ? 'type' : 'idle');
  }, [typing, reveal]);
  // a new answer: write it out, then play its emote
  const last = msgs[msgs.length - 1];
  useEffect(() => {
    if (!open || !last || last.me || !last.n || last.n <= seen.current) return;
    seen.current = last.n;
    const len = last.t.length, dur = Math.min(1600, Math.max(450, len * 14)), t0 = performance.now();
    let raf = 0;
    const step = () => {
      const k = Math.min(len, Math.ceil(((performance.now() - t0) / dur) * len));
      setReveal(k >= len ? null : { n: last.n, k });
      const el = listRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      if (k < len) raf = requestAnimationFrame(step);
      else sch.current?.play(last.emote || 'happy');
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, last?.n]);
  return { mood, reveal };
}

type Hist = { list: { id: string; title: string; at: number; n: number; on: boolean }[]; fresh: () => void; open: (id: string) => void; rename: (id: string, t: string) => void; del: (id: string) => void };
const T = (x: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(x) : x);
/** owner (R8): the ☰ menu of the chat: every conversation on this device, newest first; open, rename or delete one, or
 *  start a new chat. */
function History({ h, close }: { h: Hist; close: () => void }) {
  const [edit, setEdit] = useState<string | null>(null), [val, setVal] = useState('');
  const when = (t: number) => { const d = new Date(t), now = new Date(); return d.toDateString() === now.toDateString() ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString([], { day: 'numeric', month: 'short' }); };
  return (
    <div className="sc-hist" role="dialog" aria-label={T('Your chats')}>
      <div className="sc-hist-h"><b>{T('Your chats')}</b><button type="button" onClick={close} aria-label={T('Close')}>×</button></div>
      <button type="button" className="sc-hist-new" onClick={() => { h.fresh(); close(); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>{T('New chat')}
      </button>
      <div className="sc-hist-l">
        {h.list.length === 0 ? <p className="sc-hist-e">{T('Your conversations with Samsoom will be kept here, on this device.')}</p> : null}
        {h.list.map((c) => (
          <div key={c.id} className={'sc-hist-i' + (c.on ? ' on' : '')}>
            {edit === c.id ? (
              <form onSubmit={(e) => { e.preventDefault(); h.rename(c.id, val); setEdit(null); }}>
                <input autoFocus value={val} maxLength={60} onChange={(e) => setVal(e.target.value)} onBlur={() => { h.rename(c.id, val); setEdit(null); }} aria-label={T('Rename chat')} />
              </form>
            ) : (
              <button type="button" className="t" onClick={() => { h.open(c.id); close(); }}>
                <b data-no-i18n="">{c.title}</b><small>{when(c.at)} · {c.n} {T(c.n === 1 ? 'message' : 'messages')}</small>
              </button>
            )}
            <span className="a">
              <button type="button" aria-label={T('Rename chat')} title={T('Rename chat')} onClick={() => { setEdit(c.id); setVal(c.title); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" /></svg></button>
              <button type="button" aria-label={T('Delete chat')} title={T('Delete chat')} onClick={() => h.del(c.id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" /></svg></button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SamsoomChat({ v }: { v: Vals }) {
  const [menu, setMenu] = useState(false);
  const [input, setInput] = useState('');
  const listRef = v.chatRef as React.RefObject<HTMLDivElement | null>;
  const msgs: Msg[] = Array.isArray(v.chat?.msgs) ? v.chat.msgs : [];
  const { mood, reveal } = useChatLife(!!v.chat?.open, !!v.chat?.typing, msgs, listRef);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    v.chat?.ask(input);
    setInput('');
  };
  return (
    <>
      {v.chat?.open ? (
        <>
          <aside
            style={{
              position: 'fixed',
              insetInlineEnd: '24px', // R6 Part D: bottom-left in Arabic, with the floating button
              bottom: '24px',
              zIndex: '95',
              width: 'min(390px,calc(100vw - 48px))',
              height: 'min(580px,calc(100vh - 120px))',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: '0 0 0 1px rgba(26,27,29,.08),0 30px 80px rgba(26,27,29,.35)',
              animation: 'seRise .3s cubic-bezier(.2,.8,.2,1)',
            }}
          >
            {'\n  '}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                height: '68px',
                padding: '0 16px',
                background: 'linear-gradient(140deg,#3D3E3F,#26282B)',
                color: '#FFFFFF',
              }}
            >
              {'\n    '}
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#F7C032',
                    overflow: 'hidden',
                  }}
                >
                  <SESamsoom mood={mood} size={30} />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '16px' }}>Samsoom</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5FD49A' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2BB673' }}></span>Online
                  </span>
                </span>
              </span>
              {'\n    '}
              <span style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="sc-menu-btn" onClick={() => setMenu((m) => !m)} aria-label={T('Your chats')} aria-expanded={menu}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </button>
              <button
                onClick={v.closeChat}
                aria-label="Close"
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '38px',
                  height: '36px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,.16)',
                  background: 'transparent',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6 6 18"></path>
                </svg>
              </button>
              </span>
              {'\n  '}
            </div>
            {'\n  '}
            {menu && v.chat?.hist ? <History h={v.chat.hist as Hist} close={() => setMenu(false)} /> : null}
            <div
              ref={v.chatRef}
              style={{
                flex: '1',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '16px',
                background: '#F2F3F4',
              }}
            >
              {'\n    '}
              {msgs.map((__it: any, __i: number) => {
                const v2 = { ...v, m: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <div style={cssToObj(`display:flex;flex-direction:column;align-items:${s(v.m?.al)};gap:6px`)}>
                      <span
                        style={cssToObj(
                          `max-width:84%;padding:10px 14px;border-radius:16px;background:${s(v.m?.bg)};color:${s(v.m?.ink)};font-size:14px;line-height:1.45;white-space:pre-line;box-shadow:0 1px 2px rgba(0,0,0,.06)`,
                        )}
                        {...(v.m?.own ? { 'data-no-i18n': '', dir: 'auto' } : {})}
                      >
                        {reveal && reveal.n === v.m?.n ? String(v.m?.t).slice(0, reveal.k) : t(v.m?.t)}
                      </span>
                      {v.m?.hasAct && !(reveal && reveal.n === v.m?.n) ? (
                        <>
                          <button
                            {...(v.m?.own ? { 'data-no-i18n': '' } : {})}
                            onClick={v.m?.act}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              height: '34px',
                              padding: '0 12px',
                              borderRadius: '10px',
                              border: 'none',
                              background: '#F7C032',
                              color: '#26282B',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            {t(v.m?.actLbl)}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                              <path d="M5 12h14M13 6l6 6-6 6"></path>
                            </svg>
                          </button>
                        </>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))(v2);
              })}
              {'\n    '}
              {v.chat?.typing ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      alignSelf: 'flex-start',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: '#FFFFFF',
                    }}
                  >
                    <span
                      style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#5E6064', animation: 'seBob .9s infinite' }}
                    ></span>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#5E6064',
                        animation: 'seBob .9s .15s infinite',
                      }}
                    ></span>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#5E6064',
                        animation: 'seBob .9s .3s infinite',
                      }}
                    ></span>
                  </div>
                </>
              ) : null}
              {'\n  '}
            </div>
            {'\n  '}
            {v.chat?.showChips ? (
              <>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '12px 16px', borderTop: '1px solid rgba(26,27,29,.06)' }}
                >
                  {(Array.isArray(v.chat?.chips) ? v.chat?.chips : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, c: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        <button
                          onClick={v.c?.ask}
                          style={{
                            height: '32px',
                            padding: '0 11px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#FFF4D1',
                            color: '#26282B',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          className={cx(undefined, 'scp-bc9ab66b')}
                        >
                          {t(v.c?.q)}
                        </button>
                      </React.Fragment>
                    ))(v2);
                  })}
                </div>
              </>
            ) : null}
            {'\n  '}
            <form
              onSubmit={send}
              style={{ display: 'flex', gap: '8px', padding: '12px 16px 16px', borderTop: '1px solid rgba(26,27,29,.06)' }}
            >
              {'\n    '}
              <input
                value={input}
                dir="auto"
                onChange={(e) => {
                  setInput(e.target.value);
                  v.chat?.touch();
                }}
                placeholder="Ask about a part, a grade, our hours…"
                style={{
                  flex: '1',
                  minWidth: '0',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(26,27,29,.14)',
                  fontSize: '14px',
                  outline: 'none',
                }}
                className={cx(undefined, 'scp-baa4ae77')}
              />
              {'\n    '}
              <button
                type="submit"
                aria-label="Send"
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#26282B',
                  cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </button>
              {'\n  '}
            </form>
          </aside>
        </>
      ) : null}
    </>
  );
}
