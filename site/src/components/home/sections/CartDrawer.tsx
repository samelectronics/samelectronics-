// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "CartDrawer". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cx, t } from '@/dc/runtime';
import SEPart from '../../dc/SEPart';
import SESamsoom from '../../dc/SESamsoom';

export default function CartDrawer({ v }: { v: Vals }) {
  return (
    <>
      {v.drawer?.cart ? (
        <>
          <div style={{ position: 'fixed', inset: '0', zIndex: '90', display: 'flex', justifyContent: 'flex-end' }}>
            {'\n  '}
            <div
              onClick={v.drawer?.close}
              style={{
                position: 'absolute',
                inset: '0',
                background: 'rgba(26,27,29,.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            ></div>
            {'\n  '}
            <aside
              style={{
                position: 'relative',
                width: 'min(440px,100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#FFFFFF',
                color: '#1A1B1D',
                boxShadow: '-30px 0 80px rgba(0,0,0,.3)',
                animation: 'seSlideIn .35s cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {'\n    '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '72px',
                  padding: '0 24px',
                  borderBottom: '1px solid rgba(26,27,29,.08)',
                }}
              >
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '20px' }}>
                  {'Cart · '}
                  {t(v.cartCount)}
                </span>
                <button
                  onClick={v.drawer?.close}
                  aria-label="Close"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '40px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1px solid rgba(26,27,29,.14)',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1B1D" strokeWidth="2.2">
                    <path d="M6 6l12 12M18 6 6 18"></path>
                  </svg>
                </button>
              </div>
              {'\n    '}
              <div style={{ flex: '1', overflowY: 'auto', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {'\n      '}
                {v.cartEmpty ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '40px 0',
                        textAlign: 'center',
                      }}
                    >
                      <SESamsoom mood="low" size={90} />
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '700', fontSize: '20px' }}>
                        Your cart is empty.
                      </span>
                      <span style={{ fontSize: '14px', color: '#5E6064' }}>
                        Find your part and add it here. We confirm stock and delivery before you pay.
                      </span>
                    </div>
                  </>
                ) : null}
                {'\n      '}
                {(Array.isArray(v.cartItems) ? v.cartItems : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, c: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '64px minmax(0,1fr) auto',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '10px',
                          borderRadius: '16px',
                          background: '#F2F3F4',
                        }}
                      >
                        <span
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '64px',
                            height: '64px',
                            borderRadius: '12px',
                            background: '#FFFFFF',
                          }}
                        >
                          <SEPart kind={v.c?.kind} size={58} />
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
                          <span style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.3' }}>{t(v.c?.title)}</span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#5E6064' }}>
                            {t(v.c?.grade)}
                            {' · '}
                            {t(v.c?.unit)}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <button
                              onClick={v.c?.dec}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                border: '1px solid rgba(26,27,29,.14)',
                                background: '#FFFFFF',
                                cursor: 'pointer',
                                fontWeight: '700',
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{ width: '24px', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '13px' }}
                            >
                              {t(v.c?.qty)}
                            </span>
                            <button
                              onClick={v.c?.inc}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#F7C032',
                                cursor: 'pointer',
                                fontWeight: '700',
                              }}
                            >
                              +
                            </button>
                          </span>
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '14px', fontWeight: '600' }}>
                          {t(v.c?.line)}
                        </span>
                      </div>
                    </React.Fragment>
                  ))(v2);
                })}
                {'\n    '}
              </div>
              {'\n    '}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '18px 24px 22px',
                  borderTop: '1px solid rgba(26,27,29,.08)',
                }}
              >
                {'\n      '}
                <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <span>Subtotal</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: '600' }}>{t(v.cartSub)}</span>
                </span>
                {'\n      '}
                <span style={{ fontSize: '12px', color: '#5E6064' }}>
                  Sample prices. Our team confirms stock, delivery and final price on WhatsApp.
                </span>
                {'\n      '}
                <a
                  href={v.cartWa}
                  target="_blank"
                  rel="noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '44px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    background: '#1A1B1D',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                  className={cx(undefined, 'scp-b327c115')}
                >
                  Send order on WhatsApp
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                {'\n    '}
              </div>
              {'\n  '}
            </aside>
          </div>
        </>
      ) : null}
    </>
  );
}
