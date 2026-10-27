// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Footer". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';

export default function Footer({ v }: { v: Vals }) {
  return (
    <footer
      data-tone="dark"
      data-screen-label="20 Footer"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#1E1F22', /* owner (27 Oct): continues the finale's graphite, one ending */
        color: '#FFFFFF',
        padding: '72px clamp(20px,4vw,64px) 28px',
      }}
    >
      {'\n  '}
      <div style={{ position: 'absolute', left: '0', right: '0', top: '0', height: '2px', overflow: 'hidden' }}>
        <div
          style={{
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg,transparent,#F7C032,#F7C032,transparent)',
            animation: 'seRun 4s linear infinite',
          }}
        ></div>
      </div>
      {'\n  '}
      <div style={{ position: 'relative', maxWidth: '1312px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '44px' }}>
        {'\n    '}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,1.3fr) repeat(3,minmax(0,1fr))', gap: '36px' }}>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {'\n        '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
              <span
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 0 0 2px #F7C032,0 0 22px rgba(247,192,50,.4)',
                }}
              >
                <img src="assets/se-logo-128.webp" alt="Sam Electronics" style={{ width: '100%', height: '100%', display: 'block' }} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '17px', letterSpacing: '.16em' }}>
                  SAM ELECTRONICS
                </span>
                <span style={{ fontSize: '10px', letterSpacing: '.26em', color: '#9DA1A6' }}>QUALITY · WARRANTY · PRICE</span>
              </span>
            </span>
            {'\n        '}
            <span style={{ fontSize: '14px', lineHeight: '1.55', color: '#C9CBCE', maxWidth: '320px' }}>
              {'Mobile phone spare parts, wholesale and retail, from Al Murar, Deira since 2003. Formerly '}
              {String(v.$facts?.formerName ?? '')}: same management, new name.
            </span>
            {'\n        '}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(Array.isArray(v.socials) ? v.socials : []).map((__it: any, __i: number) => {
                const v2 = { ...v, x: __it, $index: __i };
                return ((v: Vals) => (
                  <React.Fragment key={__i}>
                    <a
                      href={v.x?.href}
                      target="_blank"
                      rel="noopener"
                      title={v.x?.name}
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: '42px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,.06)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
                        transition: 'box-shadow .2s',
                      }}
                      className={cx(undefined, 'scp-c7f2fba0')}
                    >
                      <span
                        style={cssToObj(
                          `display:block;width:17px;height:17px;background:#FFFFFF;-webkit-mask:${s(v.x?.mask)};mask:${s(v.x?.mask)}`,
                        )}
                      ></span>
                    </a>
                  </React.Fragment>
                ))(v2);
              })}
              <a
                href={v.googleReview}
                target="_blank"
                rel="noopener"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,.06)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}
                className={cx(undefined, 'scp-4cbed5d4')}
              >
                <svg width="15" height="15" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                </svg>
                Review us on Google
              </a>
            </div>
            {'\n      '}
          </div>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em', color: '#F7C032' }}>
              SYSTEM MAP
            </span>
            {(Array.isArray(v.sysMapShort) ? v.sysMapShort : []).map((__it: any, __i: number) => {
              const v2 = { ...v, m: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <a
                    href="#top"
                    onClick={v.m?.go}
                    style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#D5D7DA' }}
                    className={cx(undefined, 'scp-f2a4cf2e')}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#7E838A', width: '18px' }}>
                      {t(v.m?.n)}
                    </span>
                    {t(v.m?.t)}
                  </a>
                </React.Fragment>
              ))(v2);
            })}
          </div>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em', color: '#F7C032' }}>
              BRANCHES
            </span>
            {'\n        '}
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <span style={{ position: 'relative', display: 'inline-block', width: '7px', height: '7px', flex: 'none' }}>
                  {/* G7: same pulse in every state (the closed red dot is as alive as the open green one) */}
                  <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)}`)}></span>
                  <span style={cssToObj(`position:absolute;inset:0;border-radius:50%;background:${s(v.st?.dot)};animation:${s(v.st?.ping)}`)}></span>
                </span>
                Dubai · Deira
              </span>
              <span style={{ color: '#C9CBCE' }}>
                {'Al Murar, Deira · '}
                {String(v.$facts?.contact?.plusCode ?? '')}
              </span>
              <span style={{ color: '#C9CBCE' }}>{t(v.st?.short)}</span>
            </span>
            {'\n        '}
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F7C032' }}></span>
                {String(v.$facts?.madrid?.name ?? '')}
              </span>
              <span style={{ color: '#C9CBCE' }}>{String(v.$facts?.madrid?.opening ?? '')}</span>
            </span>
            {'\n        '}
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#C9CBCE' }}>
              <a href={`tel:${s(v.$facts?.contact?.storeTel)}`} style={{ color: '#C9CBCE' }} className={cx(undefined, 'scp-f2a4cf2e')}>
                {'Store '}
                {String(v.$facts?.contact?.storePhone ?? '')}
              </a>
              <a href={v.visit?.wa} target="_blank" rel="noopener" style={{ color: '#C9CBCE' }} className={cx(undefined, 'scp-f2a4cf2e')}>
                {'WhatsApp '}
                {String(v.$facts?.contact?.mobile ?? '')}
              </a>
              <a href={`mailto:${s(v.$facts?.contact?.email)}`} style={{ color: '#C9CBCE' }} className={cx(undefined, 'scp-f2a4cf2e')}>
                {String(v.$facts?.contact?.email ?? '')}
              </a>
            </span>
            {'\n      '}
          </div>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', letterSpacing: '.14em', color: '#F7C032' }}>
              HOURS · DUBAI TIME
            </span>
            {'\n        '}
            {(Array.isArray(v.visit?.days) ? v.visit?.days : []).map((__it: any, __i: number) => {
              const v2 = { ...v, d: __it, $index: __i };
              return ((v: Vals) => (
                <React.Fragment key={__i}>
                  <span style={cssToObj(`display:flex;justify-content:space-between;gap:10px;font-size:13px;color:${s(v.d?.fc)}`)}>
                    <span style={cssToObj(`font-weight:${s(v.d?.w)}`)}>{t(v.d?.short)}</span>
                    <span className="se-ltr" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', textAlign: 'right' }}>{t(v.d?.h)}</span>
                  </span>
                </React.Fragment>
              ))(v2);
            })}
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n    '}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            paddingTop: '22px',
            paddingInlineEnd: '76px', // R6 C6: room for the floating Samsoom button (bottom-right, bottom-left in Arabic)
            borderTop: '1px solid rgba(255,255,255,.08)',
            fontSize: '13px',
            color: '#9DA1A6',
          }}
        >
          {'\n      '}
          <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>
              {'© 2026 '}
              {String(v.$facts?.legalName ?? '')}
              {''}
            </span>
            {/* G18 */}
            <span style={{ opacity: 0.75 }}>Brand names and logos belong to their owners and are used only to show compatibility.</span>
          </span>
          {'\n      '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            {'\n        '}
            <span style={{ display: 'flex', gap: '14px' }}>
              <a href="#top" style={{ color: '#9DA1A6' }} className={cx(undefined, 'scp-f2a4cf2e')}>
                Warranty
              </a>
              <a href="#top" style={{ color: '#9DA1A6' }} className={cx(undefined, 'scp-f2a4cf2e')}>
                Shipping
              </a>
              <a href="#top" style={{ color: '#9DA1A6' }} className={cx(undefined, 'scp-f2a4cf2e')}>
                Privacy
              </a>
              <a href="#top" style={{ color: '#9DA1A6' }} className={cx(undefined, 'scp-f2a4cf2e')}>
                Terms
              </a>
            </span>
            {'\n        '}
            <span
              style={{
                display: 'flex',
                gap: '2px',
                padding: '3px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,.06)',
                fontSize: '12px',
              }}
            >
              {/* G9: same switch as the nav (src/i18n/lang.ts). */}
              <button data-no-i18n onClick={v.english} aria-pressed={!v.isAr} style={{ ...(v.isAr ? { padding: '4px 9px', border: 'none', borderRadius: '7px', background: 'none', color: '#FFFFFF', fontWeight: 400, cursor: 'pointer' } : { padding: '4px 9px', border: 'none', borderRadius: '7px', background: '#FFFFFF', color: '#26282B', fontWeight: 600, cursor: 'pointer' }), font: 'inherit', fontSize: '12px' }}>
                EN
              </button>
              <button
                data-no-i18n
                lang="ar"
                onClick={v.arabic}
                aria-pressed={!!v.isAr}
                style={{ ...(v.isAr ? { padding: '4px 9px', border: 'none', borderRadius: '7px', background: '#FFFFFF', color: '#26282B', fontWeight: 600, cursor: 'pointer' } : { padding: '4px 9px', border: 'none', borderRadius: '7px', background: 'none', color: '#FFFFFF', fontWeight: 400, cursor: 'pointer' }), fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: '12px' }}
              >
                عربي
              </button>
            </span>
            {'\n        '}
            <button
              onClick={v.staff}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 10px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,.14)',
                background: 'transparent',
                color: '#C9CBCE',
                fontSize: '13px',
                cursor: 'pointer',
              }}
              className={cx(undefined, 'scp-280e4324')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
              </svg>
              Staff · Control Room
            </button>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </footer>
  );
}
