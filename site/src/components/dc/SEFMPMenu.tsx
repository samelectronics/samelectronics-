// Converted from design/project/SE FMP Menu.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SEFMPMenu.logic.js';
const DEV: Record<string, string> = { phone: 'M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM10.5 5h3', tablet: 'M5 2.5h14a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM11 18.5h2', watch: 'M8.5 6h7a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 15.5v-7A2.5 2.5 0 0 1 8.5 6zM9 6l.8-3.5h4.4L15 6M9 18l.8 3.5h4.4L15 18' };
const DevIcon = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={DEV[d] || DEV.phone} /></svg>
);
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
            color: '#26282B',
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
          <div className="fmq" role="menu" data-no-i18n="">
            <div className="fmq-brands">
              <span className="fmq-k">{v.brandsK}</span>
              {(v.brands || []).map((b: any) => (
                <button key={b.id} type="button" className={'fmq-b' + (b.on ? ' on' : '')} onMouseEnter={b.hover} onFocus={b.hover} onClick={b.pick}>
                  <span className="fmq-logo"><SEBrandLogo brand={b.id} color={b.on ? '#F7C032' : '#FFFFFF'} h="18" fit="92x18" /></span>
                  <small>{b.q}</small>
                </button>
              ))}
            </div>
            <div className="fmq-models">
              <div className="fmq-h">
                <b>{v.cur?.name}</b>
                <small>{v.cur?.n}</small>
              </div>
              <div className="fmq-devs" role="tablist">
                {(v.devs || []).map((d: any) => (
                  <button key={d.id} type="button" role="tab" aria-selected={d.on} className={d.on ? 'on' : ''} onMouseEnter={d.pick} onClick={d.pick}>
                    <DevIcon d={d.id} />
                    {d.name}
                    <em>{d.n}</em>
                  </button>
                ))}
              </div>
              <div className="fmq-grid">
                {(v.models || []).map((m: any) => (
                  <button key={m.id} type="button" className="fmq-m" onClick={m.pick}>
                    <span className="fmq-mi"><DevIcon d={m.dev} /></span>
                    <span>
                      <b data-no-i18n="">{m.name}</b>
                      <small className={m.in ? 'in' : ''}>{m.q}</small>
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className="fmq-all" onClick={v.cur?.all}>
                <span>{v.cur?.see}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

const SEFMPMenu = createDC('SE FMP Menu', Logic, render);
export default SEFMPMenu;
