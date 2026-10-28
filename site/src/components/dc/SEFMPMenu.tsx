// Converted from design/project/SE FMP Menu.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SEFMPMenu.logic.js';
import DeviceIcon from '@/components/home/DeviceIcon';
const DevIcon = ({ d }: { d: string }) => <DeviceIcon kind={d} size={18} />;
import SEBrandLogo from './SEBrandLogo';

function render(v: Vals) {
  return (
    <>
      <div data-tour="fmp" onMouseEnter={v.enter} onMouseLeave={v.leave} style={{ position: 'relative', display: 'flex' }}>
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
