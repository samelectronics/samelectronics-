// GENERATED from design/project/SE FMP Menu.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SEFMPMenu.logic.js';
import SEBrandLogo from './SEBrandLogo';

function render(v: Vals) {
  return (
    <>
      <div onMouseEnter={v.enter} onMouseLeave={v.leave} style={{ position: 'relative', display: 'flex' }}>
        {'\n  '}
        <button
          onClick={v.openAll}
          onFocus={v.enter}
          aria-haspopup="true"
          aria-expanded={v.open}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            height: '36px',
            padding: '0 16px',
            border: 'none',
            borderRadius: '10px',
            background: '#F7C032',
            color: '#1A1B1D',
            fontWeight: '600',
            fontSize: '15px',
            fontFamily: 'Inter,sans-serif',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 22px rgba(247,192,50,.35)',
            transition: 'transform .2s,box-shadow .2s',
          }}
          className={cx(undefined, 'scp-90837cfd')}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-3.5-3.5"></path>
          </svg>
          Find My Part
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            style={cssToObj(`transform:rotate(${s(v.chevR)}deg);transition:transform .2s`)}
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
        {'\n  '}
        {v.open ? (
          <>
            {'\n    '}
            <div
              style={{ position: 'absolute', left: '50%', top: '100%', paddingTop: '10px', transform: 'translateX(-50%)', zIndex: '80' }}
            >
              {'\n      '}
              <div
                style={{
                  width: 'min(640px,calc(100vw - 32px))',
                  display: 'grid',
                  gridTemplateColumns: '220px minmax(0,1fr)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg,rgba(61,62,63,.97),rgba(38,40,43,.98))',
                  color: '#FFFFFF',
                  boxShadow: 'inset 0 2px 0 #F7C032,inset 0 0 0 1px rgba(255,255,255,.1),0 24px 60px rgba(0,0,0,.45)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  animation: 'fmmIn .2s cubic-bezier(.2,.8,.2,1) both',
                }}
              >
                {'\n        '}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px',
                    borderRight: '1px solid rgba(255,255,255,.08)',
                    maxHeight: '440px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  {'\n          '}
                  <span
                    style={{
                      padding: '6px 10px 8px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '11px',
                      letterSpacing: '.12em',
                      color: '#C9CBCE',
                    }}
                  >
                    BRANDS
                  </span>
                  {'\n          '}
                  {(Array.isArray(v.brands) ? v.brands : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, b: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        {'\n            '}
                        <button
                          onMouseEnter={v.b?.hover}
                          onClick={v.b?.pick}
                          style={cssToObj(
                            `display:flex;align-items:center;justify-content:space-between;gap:10px;height:36px;flex:none;padding:0 10px;border:none;border-radius:8px;background:${s(v.b?.bg)};color:#FFFFFF;cursor:pointer;text-align:left`,
                          )}
                        >
                          {'\n              '}
                          <SEBrandLogo brand={v.b?.id} color={v.b?.ink} h="14" />
                          {'\n              '}
                          <span
                            style={cssToObj(
                              `font-family:'JetBrains Mono',monospace;font-size:11px;color:${s(v.b?.sub)};white-space:nowrap`,
                            )}
                          >
                            {t(v.b?.q)}
                          </span>
                          {'\n            '}
                        </button>
                        {'\n          '}
                      </React.Fragment>
                    ))(v2);
                  })}
                  {'\n        '}
                </div>
                {'\n        '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px' }}>
                  {'\n          '}
                  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '18px' }}>
                      {t(v.cur?.name)}
                      {' models'}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#C9CBCE', whiteSpace: 'nowrap' }}>
                      {t(v.cur?.n)}
                    </span>
                  </span>
                  {'\n          '}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '4px' }}>
                    {'\n            '}
                    {(Array.isArray(v.models) ? v.models : []).map((__it: any, __i: number) => {
                      const v2 = { ...v, m: __it, $index: __i };
                      return ((v: Vals) => (
                        <React.Fragment key={__i}>
                          {'\n              '}
                          <button
                            onClick={v.m?.pick}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              gap: '2px',
                              padding: '8px 10px',
                              border: 'none',
                              borderRadius: '8px',
                              background: 'transparent',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'background .15s',
                            }}
                            className={cx(undefined, 'scp-4401c430')}
                          >
                            {'\n                '}
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                              }}
                            >
                              {t(v.m?.name)}
                            </span>
                            {'\n                '}
                            <span
                              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#C9CBCE', whiteSpace: 'nowrap' }}
                            >
                              {t(v.m?.q)}
                            </span>
                            {'\n              '}
                          </button>
                          {'\n            '}
                        </React.Fragment>
                      ))(v2);
                    })}
                    {'\n          '}
                  </div>
                  {'\n          '}
                  <button
                    onClick={v.cur?.all}
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(247,192,50,.6)',
                      background: 'transparent',
                      color: '#FFDB6E',
                      fontSize: '14px',
                      fontWeight: '600',
                      fontFamily: 'Inter,sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    <span>
                      {'All '}
                      {t(v.cur?.name)}
                      {' models in Find My Part'}
                    </span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6"></path>
                    </svg>
                  </button>
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </div>
            {'\n  '}
          </>
        ) : null}
      </div>
    </>
  );
}

const SEFMPMenu = createDC('SE FMP Menu', Logic, render);
export default SEFMPMenu;
