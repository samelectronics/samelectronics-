// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "FindMyPartPanel". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, hostPositionStyle, s, t, val } from '@/dc/runtime';
import SEBrandLogo from '../../dc/SEBrandLogo';
import SEPart from '../../dc/SEPart';

export default function FindMyPartPanel({ v }: { v: Vals }) {
  return (
    <>
      {v.fmp?.open ? (
        <>
          <div style={{ position: 'fixed', inset: '0', zIndex: '90', display: 'grid', placeItems: 'center', padding: '24px' }}>
            {'\n  '}
            <div
              onClick={v.fmp?.close}
              style={{
                position: 'absolute',
                inset: '0',
                background: 'rgba(38,40,43,.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: 'fmFade .25s both',
              }}
            ></div>
            {'\n  '}
            <div
              style={{
                position: 'relative',
                width: 'min(1080px,100%)',
                maxHeight: 'min(760px,calc(100vh - 48px))',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                overflow: 'hidden',
                background:
                  'radial-gradient(80% 60% at 50% 0%,rgba(255,255,255,.07),rgba(255,255,255,0)),linear-gradient(180deg,rgba(61,62,63,.96),rgba(38,40,43,.98))',
                color: '#FFFFFF',
                boxShadow: 'inset 0 2px 0 #F7C032,inset 0 0 0 1px rgba(255,255,255,.1),0 40px 100px rgba(0,0,0,.5)',
                animation: 'fmIn .35s cubic-bezier(.2,.8,.2,1) both',
              }}
            >
              {'\n    '}
              <div
                style={{
                  position: 'absolute',
                  inset: '0',
                  opacity: '.35',
                  backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px)',
                  backgroundSize: '3px 3px',
                  pointerEvents: 'none',
                }}
              ></div>
              {'\n    '}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  padding: '20px 24px',
                  borderBottom: '1px solid rgba(255,255,255,.08)',
                }}
              >
                {'\n      '}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: '600',
                    fontSize: '22px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.3">
                    <circle cx="11" cy="11" r="7"></circle>
                    <path d="m20 20-3.5-3.5"></path>
                  </svg>
                  Find My Part
                </span>
                {'\n      '}
                <div style={{ flex: '1', display: 'flex', alignItems: 'center', minWidth: '0' }}>
                  {'\n        '}
                  {(Array.isArray(v.fmp?.path) ? v.fmp?.path : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, p: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        {'\n          '}
                        <button
                          onClick={v.p?.go}
                          disabled={v.p?.off}
                          style={cssToObj(
                            `flex:none;display:flex;align-items:center;gap:8px;padding:0;border:none;background:none;color:${s(v.p?.ink)};cursor:${s(v.p?.cur)};font-family:'JetBrains Mono',monospace;font-size:12px;white-space:nowrap`,
                          )}
                        >
                          {'\n            '}
                          <span
                            style={cssToObj(
                              `position:relative;width:16px;height:16px;border-radius:50%;background:${s(v.p?.bg)};box-shadow:${s(v.p?.glow)};transition:background .3s,box-shadow .3s`,
                            )}
                          >
                            <span
                              style={cssToObj(
                                `position:absolute;left:5px;top:5px;width:6px;height:6px;border-radius:50%;background:${s(v.p?.dot)}`,
                              )}
                            ></span>
                          </span>
                          {t(v.p?.label)}
                          {'\n          '}
                        </button>
                        {'\n          '}
                        {v.p?.more ? (
                          <>
                            <span
                              style={{
                                position: 'relative',
                                flex: '1',
                                minWidth: '20px',
                                height: '2px',
                                margin: '0 10px',
                                background: 'rgba(255,255,255,.14)',
                                overflow: 'hidden',
                              }}
                            >
                              <span
                                style={cssToObj(
                                  `position:absolute;inset:0;background:linear-gradient(90deg,#F7C032,#FFDB6E);transform-origin:0 50%;transform:scaleX(${s(v.p?.fill)});transition:transform .35s cubic-bezier(.2,.8,.2,1)`,
                                )}
                              ></span>
                              {v.p?.flow ? (
                                <>
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: '0',
                                      left: '0',
                                      width: '40%',
                                      height: '2px',
                                      background: 'linear-gradient(90deg,rgba(255,244,209,0),#FFF4D1,rgba(255,244,209,0))',
                                      animation: 'fmFlow 1.4s linear infinite',
                                    }}
                                  ></span>
                                </>
                              ) : null}
                            </span>
                          </>
                        ) : null}
                        {'\n        '}
                      </React.Fragment>
                    ))(v2);
                  })}
                  {'\n      '}
                </div>
                {'\n      '}
                <button
                  onClick={v.fmp?.close}
                  aria-label="Close"
                  style={{
                    flex: 'none',
                    display: 'grid',
                    placeItems: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,.16)',
                    background: 'transparent',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                  className={cx(undefined, 'scp-71e4b6d9')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 6l12 12M18 6 6 18"></path>
                  </svg>
                </button>
                {'\n    '}
              </div>
              {'\n    '}
              <div
                style={cssToObj(
                  `position:relative;flex:1;overflow-y:auto;overflow-x:hidden;padding:22px 24px;animation:${s(v.fmp?.slide)}`,
                )}
              >
                {'\n      '}
                {v.fmp?.s1 ? (
                  <>
                    {'\n        '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,132px),1fr))', gap: '10px' }}>
                      {'\n          '}
                      {(Array.isArray(v.fmp?.brands) ? v.fmp?.brands : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, b: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            {'\n            '}
                            <button
                              onClick={v.b?.pick}
                              style={cssToObj(
                                `position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:8px;height:132px;padding:12px 14px 14px;min-width:0;border-radius:16px;border:none;text-align:left;cursor:pointer;color:#FFFFFF;background:${s(v.b?.bg)};box-shadow:inset 0 0 0 1px rgba(255,255,255,.1),0 6px 14px rgba(0,0,0,.2);animation:fmTile .35s ${s(v.b?.d)} cubic-bezier(.2,.8,.2,1) both;transition:transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s`,
                              )}
                              className={cx(undefined, 'scp-413b5d20')}
                            >
                              {'\n              '}
                              <span style={{ height: '16px', display: 'flex', alignItems: 'center' }}>
                                {v.b?.pop ? (
                                  <>
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        height: '16px',
                                        padding: '0 6px',
                                        borderRadius: '5px',
                                        background: '#F7C032',
                                        color: '#1A1B1D',
                                        fontFamily: "'JetBrains Mono',monospace",
                                        fontSize: '9px',
                                        fontWeight: '700',
                                        letterSpacing: '.1em',
                                      }}
                                    >
                                      POPULAR
                                    </span>
                                  </>
                                ) : null}
                              </span>
                              {'\n              '}
                              <span style={{ height: '22px', display: 'flex', alignItems: 'center' }}>
                                <SEBrandLogo brand={v.b?.id} color="#FFFFFF" h="18" />
                              </span>
                              {'\n              '}
                              <span
                                style={{
                                  marginTop: 'auto',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '3px',
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '11px',
                                  color: '#C9CBCE',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <span>{t(v.b?.models)}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                                  <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px' }}>
                                    {(Array.isArray(v.b?.bars) ? v.b?.bars : []).map((__it: any, __i: number) => {
                                      const v2 = { ...v, x: __it, $index: __i };
                                      return ((v: Vals) => (
                                        <React.Fragment key={__i}>
                                          <span
                                            style={cssToObj(`width:3px;height:${s(v.x?.h)}px;border-radius:1px;background:${s(v.x?.c)}`)}
                                          ></span>
                                        </React.Fragment>
                                      ))(v2);
                                    })}
                                  </span>
                                  {t(v.b?.parts)}
                                </span>
                              </span>
                              {'\n            '}
                            </button>
                            {'\n          '}
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n        '}
                    </div>
                    {'\n      '}
                  </>
                ) : null}
                {'\n      '}
                {v.fmp?.s2 ? (
                  <>
                    {'\n        '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {'\n          '}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {'\n            '}
                        <label
                          style={{
                            flex: '1',
                            minWidth: '240px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            height: '44px',
                            padding: '0 14px',
                            borderRadius: '10px',
                            background: 'rgba(0,0,0,.25)',
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.14)',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9CBCE" strokeWidth="2.2">
                            <circle cx="11" cy="11" r="7"></circle>
                            <path d="m20 20-3.5-3.5"></path>
                          </svg>
                          <input
                            value={val(v.fmp?.q)}
                            onInput={v.fmp?.setQ}
                            placeholder="Model name or number, e.g. A3084"
                            style={{
                              flex: '1',
                              minWidth: '0',
                              border: 'none',
                              outline: 'none',
                              background: 'transparent',
                              color: '#FFFFFF',
                              fontSize: '15px',
                              fontFamily: 'Inter,sans-serif',
                            }}
                          />
                        </label>
                        {'\n            '}
                        {(Array.isArray(v.fmp?.quick) ? v.fmp?.quick : []).map((__it: any, __i: number) => {
                          const v2 = { ...v, c: __it, $index: __i };
                          return ((v: Vals) => (
                            <React.Fragment key={__i}>
                              <button
                                onClick={v.c?.pick}
                                style={{
                                  height: '36px',
                                  padding: '0 12px',
                                  borderRadius: '10px',
                                  border: 'none',
                                  background: 'rgba(247,192,50,.12)',
                                  color: '#FFDB6E',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {t(v.c?.t)}
                              </button>
                            </React.Fragment>
                          ))(v2);
                        })}
                        {'\n          '}
                      </div>
                      {'\n          '}
                      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                        {(Array.isArray(v.fmp?.series) ? v.fmp?.series : []).map((__it: any, __i: number) => {
                          const v2 = { ...v, t: __it, $index: __i };
                          return ((v: Vals) => (
                            <React.Fragment key={__i}>
                              <button
                                onClick={v.t?.pick}
                                style={cssToObj(
                                  `flex:none;height:36px;padding:0 14px;border-radius:10px;border:none;background:${s(v.t?.bg)};color:${s(v.t?.ink)};font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .2s`,
                                )}
                              >
                                {t(v.t?.name)}
                              </button>
                            </React.Fragment>
                          ))(v2);
                        })}
                      </div>
                      {'\n          '}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '10px' }}>
                        {'\n            '}
                        {(Array.isArray(v.fmp?.models) ? v.fmp?.models : []).map((__it: any, __i: number) => {
                          const v2 = { ...v, m: __it, $index: __i };
                          return ((v: Vals) => (
                            <React.Fragment key={__i}>
                              {'\n              '}
                              <button
                                onClick={v.m?.pick}
                                style={cssToObj(
                                  `display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 10px;border-radius:16px;border:none;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);color:#FFFFFF;cursor:pointer;text-align:center;animation:fmTile .3s ${s(v.m?.d)} cubic-bezier(.2,.8,.2,1) both;transition:transform .2s,box-shadow .2s`,
                                )}
                                className={cx(undefined, 'scp-7304ea42')}
                              >
                                {'\n              '}
                                <span
                                  style={{
                                    position: 'relative',
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: '100%',
                                    height: '100px',
                                    borderRadius: '12px',
                                    background: 'radial-gradient(70% 70% at 50% 40%,rgba(255,255,255,.08),rgba(255,255,255,0))',
                                  }}
                                >
                                  <div
                                    className="sc-host-x"
                                    style={
                                      hostPositionStyle('position:absolute;inset:0;z-index:1;color:rgba(255,255,255,.35)') || {
                                        display: 'contents',
                                      }
                                    }
                                  >
                                    <image-slot data-quiet="1" id={v.m?.slot} placeholder="" shape="rounded" radius="12" fit="contain" />
                                  </div>
                                  <span
                                    style={{
                                      position: 'relative',
                                      display: 'block',
                                      width: '46px',
                                      height: '92px',
                                      borderRadius: '9px',
                                      background: 'linear-gradient(160deg,#4A4D52,#2E3033)',
                                      boxShadow: 'inset 0 0 0 1.5px #8C9096,0 6px 12px rgba(0,0,0,.35)',
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: 'absolute',
                                        inset: '3px',
                                        borderRadius: '7px',
                                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.12)',
                                      }}
                                    ></span>
                                    {'\n                '}
                                    {v.m?.cTri ? (
                                      <>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '5px',
                                            top: '5px',
                                            width: '18px',
                                            height: '19px',
                                            borderRadius: '5px',
                                            boxShadow: 'inset 0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '8px',
                                            top: '8px',
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '8px',
                                            top: '15px',
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '15px',
                                            top: '11px',
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                      </>
                                    ) : null}
                                    {'\n                '}
                                    {v.m?.cCol ? (
                                      <>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '7px',
                                            top: '7px',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '7px',
                                            top: '16px',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '7px',
                                            top: '25px',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                      </>
                                    ) : null}
                                    {'\n                '}
                                    {v.m?.cBar ? (
                                      <>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '3px',
                                            right: '3px',
                                            top: '14px',
                                            height: '9px',
                                            borderRadius: '5px',
                                            boxShadow: 'inset 0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                      </>
                                    ) : null}
                                    {'\n                '}
                                    {v.m?.cRing ? (
                                      <>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '7px',
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            boxShadow: 'inset 0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '17px',
                                            top: '12px',
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                        <span
                                          style={{
                                            position: 'absolute',
                                            left: '24px',
                                            top: '17px',
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1.2px #C9CBCE',
                                          }}
                                        ></span>
                                      </>
                                    ) : null}
                                    {'\n              '}
                                  </span>
                                </span>
                                {'\n              '}
                                <span
                                  style={{
                                    fontFamily: "'Space Grotesk',sans-serif",
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    lineHeight: '1.2',
                                  }}
                                >
                                  {t(v.m?.name)}
                                </span>
                                {'\n              '}
                                <span
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: '11px',
                                    color: '#C9CBCE',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <span>{t(v.m?.num)}</span>
                                  <span style={{ color: '#5FD49A' }}>{t(v.m?.parts)}</span>
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
                      {v.fmp?.none ? (
                        <>
                          <span style={{ fontSize: '14px', color: '#C9CBCE' }}>
                            No model matches. Try a model number like A2849, or ask Samsoom.
                          </span>
                        </>
                      ) : null}
                      {'\n        '}
                    </div>
                    {'\n      '}
                  </>
                ) : null}
                {'\n      '}
                {v.fmp?.s3 ? (
                  <>
                    {'\n        '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>
                      {'\n          '}
                      {(Array.isArray(v.fmp?.cats) ? v.fmp?.cats : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, c: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            {'\n            '}
                            <button
                              onClick={v.c?.pick}
                              style={cssToObj(
                                `display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px;border-radius:16px;border:none;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);color:#FFFFFF;cursor:pointer;opacity:${s(v.c?.o)};animation:fmTile .3s ${s(v.c?.d)} cubic-bezier(.2,.8,.2,1) both;transition:transform .2s,box-shadow .2s`,
                              )}
                              className={cx(undefined, 'scp-7304ea42')}
                            >
                              {'\n              '}
                              <span
                                style={{
                                  position: 'relative',
                                  display: 'grid',
                                  placeItems: 'center',
                                  width: '100%',
                                  height: '110px',
                                  borderRadius: '12px',
                                  background: 'radial-gradient(70% 70% at 50% 45%,rgba(255,255,255,.08),rgba(255,255,255,0))',
                                }}
                              >
                                <span style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,.45))' }}>
                                  <SEPart kind={v.c?.kind} size={100} tone="dark" still={true} />
                                </span>
                                <div
                                  className="sc-host-x"
                                  style={
                                    hostPositionStyle('position:absolute;inset:0;z-index:1;color:rgba(255,255,255,.35)') || {
                                      display: 'contents',
                                    }
                                  }
                                >
                                  <image-slot data-quiet="1" id={v.c?.slot} placeholder="" shape="rounded" radius="12" fit="contain" />
                                </div>
                              </span>
                              {'\n              '}
                              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '16px' }}>
                                {t(v.c?.name)}
                              </span>
                              {'\n              '}
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '11px',
                                  color: '#C9CBCE',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {t(v.c?.n)}
                              </span>
                              {'\n              '}
                              {v.c?.has ? (
                                <>
                                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#5FD49A', whiteSpace: 'nowrap' }}>
                                    {t(v.c?.tag)}
                                  </span>
                                </>
                              ) : null}
                              {v.c?.out ? (
                                <>
                                  <span
                                    onClick={v.c?.notify}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      height: '32px',
                                      padding: '0 12px',
                                      borderRadius: '10px',
                                      border: '1.5px solid #F7C032',
                                      color: '#FFDB6E',
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                                    </svg>
                                    Notify me
                                  </span>
                                </>
                              ) : null}
                              {'\n            '}
                            </button>
                            {'\n          '}
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n        '}
                    </div>
                    {'\n      '}
                  </>
                ) : null}
                {'\n      '}
                {v.fmp?.s4 ? (
                  <>
                    {'\n        '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px' }}>
                      {'\n          '}
                      {(Array.isArray(v.fmp?.grades) ? v.fmp?.grades : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, g: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            {'\n            '}
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={v.g?.shop}
                              style={cssToObj(
                                `display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:16px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px ${s(v.g?.bd)};opacity:${s(v.g?.o)};cursor:pointer;animation:fmTile .3s ${s(v.g?.d)} cubic-bezier(.2,.8,.2,1) both;transition:transform .2s,box-shadow .2s`,
                              )}
                              className={cx(undefined, 'scp-9e90b5b0')}
                            >
                              {'\n              '}
                              <span
                                style={{
                                  position: 'relative',
                                  display: 'grid',
                                  placeItems: 'center',
                                  height: '120px',
                                  borderRadius: '12px',
                                  background: 'radial-gradient(70% 70% at 50% 45%,rgba(255,255,255,.1),rgba(255,255,255,.02))',
                                }}
                              >
                                <span style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,.45))' }}>
                                  <SEPart kind={v.g?.kind} size={96} tone="dark" still={true} />
                                </span>
                                <div
                                  className="sc-host-x"
                                  style={
                                    hostPositionStyle('position:absolute;inset:0;z-index:1;color:rgba(255,255,255,.35)') || {
                                      display: 'contents',
                                    }
                                  }
                                >
                                  <image-slot data-quiet="1" id={v.g?.slot} placeholder="" shape="rounded" radius="12" fit="contain" />
                                </div>
                              </span>
                              {'\n              '}
                              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span
                                  style={{
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    background: '#26282B',
                                    color: '#F7C032',
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    whiteSpace: 'nowrap',
                                    boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.4)',
                                  }}
                                >
                                  {t(v.g?.code)}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#C9CBCE' }}>
                                  <span style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px' }}>
                                    {(Array.isArray(v.g?.bars) ? v.g?.bars : []).map((__it: any, __i: number) => {
                                      const v2 = { ...v, x: __it, $index: __i };
                                      return ((v: Vals) => (
                                        <React.Fragment key={__i}>
                                          <span
                                            style={cssToObj(`width:3px;height:${s(v.x?.h)}px;border-radius:1px;background:${s(v.x?.c)}`)}
                                          ></span>
                                        </React.Fragment>
                                      ))(v2);
                                    })}
                                  </span>
                                  {t(v.g?.stock)}
                                </span>
                              </span>
                              {'\n              '}
                              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: '600', fontSize: '18px' }}>
                                {t(v.g?.name)}
                              </span>
                              {'\n              '}
                              <span style={{ fontSize: '13px', lineHeight: '1.4', color: '#C9CBCE' }}>{t(v.g?.best)}</span>
                              {'\n              '}
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#C9CBCE' }}>
                                {t(v.g?.warranty)}
                              </span>
                              {'\n              '}
                              <span
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '22px', fontWeight: '700', color: '#F7C032' }}
                              >
                                {t(v.g?.price)}
                              </span>
                              {'\n              '}
                              <span
                                style={{
                                  marginTop: 'auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '8px',
                                }}
                              >
                                <span
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#FFDB6E',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  See in Shop
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                                  </svg>
                                </span>
                                {'\n                '}
                                {v.g?.inStock ? (
                                  <>
                                    <button
                                      onClick={v.g?.add}
                                      aria-label="Add to cart"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        height: '36px',
                                        padding: '0 12px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: '#F7C032',
                                        color: '#1A1B1D',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                        <path d="M12 5v14M5 12h14"></path>
                                      </svg>
                                      Add
                                    </button>
                                  </>
                                ) : null}
                                {'\n                '}
                                {v.g?.out ? (
                                  <>
                                    <button
                                      onClick={v.g?.add}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        height: '36px',
                                        padding: '0 12px',
                                        borderRadius: '10px',
                                        border: '1.5px solid #F7C032',
                                        background: 'transparent',
                                        color: '#FFDB6E',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                                      </svg>
                                      Notify me
                                    </button>
                                  </>
                                ) : null}
                              </span>
                              {'\n            '}
                            </div>
                            {'\n          '}
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n        '}
                    </div>
                    {'\n      '}
                  </>
                ) : null}
                {'\n    '}
              </div>
              {'\n    '}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '14px 24px',
                  borderTop: '1px solid rgba(255,255,255,.08)',
                  background: 'rgba(0,0,0,.15)',
                }}
              >
                {'\n      '}
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '600',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t(v.fmp?.summary)}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#C9CBCE' }}>{t(v.fmp?.foot)}</span>
                </span>
                {'\n      '}
                <button
                  onClick={v.fmp?.shop}
                  style={{
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: '44px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#F7C032',
                    color: '#1A1B1D',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {'See all '}
                  <span style={{ display: 'inline-flex', overflow: 'hidden', height: '18px', lineHeight: '18px' }}>
                    <span
                      key={v.fmp?.count}
                      style={cssToObj(
                        `display:inline-block;font-family:'JetBrains Mono',monospace;font-weight:700;animation:${s(v.fmp?.roll)}`,
                      )}
                    >
                      {t(v.fmp?.countF)}
                    </span>
                  </span>
                  {' results in Shop'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </button>
                {'\n    '}
              </div>
              {'\n  '}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
