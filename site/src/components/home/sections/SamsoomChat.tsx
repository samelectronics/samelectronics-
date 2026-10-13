// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "SamsoomChat". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t, val } from '@/dc/runtime';
import SESamsoom from '../../dc/SESamsoom';

export default function SamsoomChat({ v }: { v: Vals }) {
  return (
    <>
      {v.chat?.open ? (
        <>
          <aside
            style={{
              position: 'fixed',
              right: '24px',
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
                background: 'linear-gradient(140deg,#3D3E3F,#1A1B1D)',
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
                  <SESamsoom mood={v.chat?.mood} size={32} />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '16px' }}>Samsoom</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5FD49A' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2BB673' }}></span>Online
                  </span>
                </span>
              </span>
              {'\n    '}
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
              {'\n  '}
            </div>
            {'\n  '}
            <div
              ref={v.chatRef}
              style={{
                flex: '1',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '16px',
                background: '#F2F3F4',
              }}
            >
              {'\n    '}
              {(Array.isArray(v.chat?.msgs) ? v.chat?.msgs : []).map((__it: any, __i: number) => {
                const v2 = { ...v, m: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <div style={cssToObj(`display:flex;flex-direction:column;align-items:${s(v.m?.al)};gap:6px`)}>
                      <span
                        style={cssToObj(
                          `max-width:84%;padding:10px 14px;border-radius:16px;background:${s(v.m?.bg)};color:${s(v.m?.ink)};font-size:14px;line-height:1.45;white-space:pre-line;box-shadow:0 1px 2px rgba(0,0,0,.06)`,
                        )}
                      >
                        {t(v.m?.t)}
                      </span>
                      {v.m?.hasAct ? (
                        <>
                          <button
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
                              color: '#1A1B1D',
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
                            color: '#1A1B1D',
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
              onSubmit={v.chat?.send}
              style={{ display: 'flex', gap: '8px', padding: '12px 16px 16px', borderTop: '1px solid rgba(26,27,29,.06)' }}
            >
              {'\n    '}
              <input
                value={val(v.chat?.input)}
                onInput={v.chat?.setInput}
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
                  background: '#1A1B1D',
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
