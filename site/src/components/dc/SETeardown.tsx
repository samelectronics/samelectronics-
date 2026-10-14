// Converted from design/project/SE Teardown.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SETeardown.logic.js';
import SEPart from './SEPart';
import SEBrandLogo from './SEBrandLogo';

function render(v: Vals) {
  return (
    <>
      <section
        id="teardown"
        data-tone="dark"
        data-screen-label="02 Teardown"
        ref={v.secRef}
        style={{ position: 'relative', background: '#2A2C2F', color: '#FFFFFF', fontFamily: 'Inter,sans-serif' }}
      >
        {v.desk ? (
          <>
            {'\n  '}
            <div style={cssToObj(`position:relative;height:${s(v.secH)}`)}>
              {'\n    '}
              <div style={cssToObj(`position:sticky;top:0;height:${s(v.stageH)};overflow:hidden;background:#2A2C2F`)}>
                {'\n      '}
                <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none' }}>
                  {'\n        '}
                  <div
                    style={cssToObj(
                      `position:absolute;inset:0;background:radial-gradient(${s(v.studio?.wrx)}px ${s(v.studio?.wry)}px at ${s(v.studio?.cx)}px ${s(v.studio?.wy)}px,#3E4044 0%,#393B3F 22%,#323438 46%,#2D2F32 70%,#2A2C2F 100%)`,
                    )}
                  ></div>
                  {'\n        '}
                  <div
                    style={cssToObj(
                      `position:absolute;inset:0;background:linear-gradient(180deg,rgba(31,32,35,0) 0%,rgba(31,32,35,0) ${s(v.studio?.fl0)}%,rgba(31,32,35,.7) ${s(v.studio?.fl1)}%,#1F2023 100%)`,
                    )}
                  ></div>
                  {'\n        '}
                  <div
                    style={cssToObj(
                      `position:absolute;inset:0;background:radial-gradient(${s(v.studio?.prx)}px ${s(v.studio?.pry)}px at ${s(v.studio?.cx)}px ${s(v.studio?.fy)}px,#58595D 0%,#505155 8%,#45464A 18%,#36373A 30%,#2E2F32 44%,#28292C 60%,rgba(36,37,40,.5) 78%,rgba(36,37,40,0) 100%);opacity:${s(v.studio?.br)}`,
                    )}
                  ></div>
                  {'\n        '}
                  {/* (a grain layer whose data URL was cut at its ';' never drew anything and logged a console error; removed 14 Oct 2026, no visual change) */}
                  {'\n        '}
                  <div
                    style={cssToObj(
                      `position:absolute;inset:0;background:radial-gradient(${s(v.studio?.hrx)}px ${s(v.studio?.hry)}px at ${s(v.studio?.cx)}px ${s(v.studio?.hy)}px,rgba(255,246,230,.06) 0%,rgba(255,246,230,.025) 45%,rgba(255,246,230,0) 100%);opacity:${s(v.studio?.br)}`,
                    )}
                  ></div>
                  {'\n        '}
                  <div
                    style={cssToObj(
                      `position:absolute;inset:0;background:radial-gradient(${s(v.studio?.vrx)}px ${s(v.studio?.vry)}px at ${s(v.studio?.cx)}px -6%,rgba(255,246,228,.13) 0%,rgba(255,246,228,.075) 30%,rgba(255,246,228,.03) 60%,rgba(255,246,228,0) 100%)`,
                    )}
                  ></div>
                  {'\n        '}
                  <div
                    style={cssToObj(
                      `position:absolute;left:0;right:0;top:0;height:140px;background:radial-gradient(${s(v.studio?.tgx)}px 70px at ${s(v.studio?.cx)}px 0,rgba(255,250,240,.3) 0%,rgba(255,250,240,.1) 45%,rgba(255,250,240,0) 100%)`,
                    )}
                  ></div>
                  {'\n        '}
                  <div
                    style={cssToObj(
                      `position:absolute;left:0;right:0;top:0;height:42%;background:linear-gradient(180deg,#26282B,rgba(26,27,29,0));opacity:${s(v.studio?.ent)}`,
                    )}
                  ></div>
                  {'\n        '}
                  <div style={cssToObj(`position:absolute;inset:0;background:#26282B;opacity:${s(v.studio?.dim)}`)}></div>
                  {'\n      '}
                </div>
                {'\n      '}
                <div style={cssToObj(`position:absolute;inset:0;opacity:${s(v.fin?.o)};pointer-events:none`)}>
                  <div
                    style={cssToObj(
                      `position:absolute;inset:0;background:radial-gradient(36% 56% at ${s(v.fin?.cx)}% 100%,#C98A12 0%,rgba(247,192,50,.74) 26%,rgba(247,192,50,.22) 56%,rgba(38,40,43,0) 100%);animation:tdBreath 6s ease-in-out infinite`,
                    )}
                  ></div>
                  <div
                    style={{
                      position: 'absolute',
                      inset: '0',
                      background:
                        'radial-gradient(44% 72% at 104% 36%,rgba(255,196,110,.2) 0%,rgba(255,196,110,.07) 48%,rgba(255,196,110,0) 80%)',
                    }}
                  ></div>
                </div>
                {'\n      '}
                <div style={cssToObj(`position:absolute;inset:0;pointer-events:none;background:#17181A;opacity:${s(v.op?.pv)}`)}></div>
                {'\n      '}
                <div ref={v.hostRef} style={{ position: 'absolute', inset: '0' }}>
                  {'\n        '}
                  <canvas style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></canvas>
                  {'\n        '}
                  {v.loading ? (
                    <>
                      <span
                        style={{
                          position: 'absolute',
                          left: '52.5%',
                          top: '50%',
                          width: '34px',
                          height: '34px',
                          margin: '-17px 0 0 -17px',
                          borderRadius: '50%',
                          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.12)',
                          borderTop: '2px solid #F7C032',
                          boxSizing: 'border-box',
                          animation: 'tdSpin 1s linear infinite',
                        }}
                      ></span>
                    </>
                  ) : null}
                  {'\n      '}
                </div>
                {'\n      '}
                <div
                  style={cssToObj(
                    `position:absolute;left:${s(v.z1?.x)}px;top:112px;bottom:40px;width:${s(v.z1?.w)}px;display:flex;flex-direction:column;justify-content:center;gap:28px;opacity:${s(v.z1?.o)};pointer-events:${s(v.z1?.pe)};transform:translateX(${s(v.z1?.gx)}px);transition:opacity .5s,transform .7s cubic-bezier(.16,1,.3,1)`,
                  )}
                >
                  {'\n        '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {'\n          '}
                    <span
                      style={cssToObj(
                        `display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;letter-spacing:.14em;color:#F7C032;white-space:nowrap;opacity:${s(v.op?.e)}`,
                      )}
                    >
                      <span>TEARDOWN</span>
                      <span style={{ width: '24px', height: '1px', background: 'rgba(247,192,50,.6)' }}></span>
                      <span style={{ display: 'inline-flex', overflow: 'hidden', height: '16px', lineHeight: '16px' }}>
                        <span style={cssToObj(`display:inline-block;transform:translateY(${s(v.op?.ey)}%)`)}>
                          <span key={v.cnt?.n} style={cssToObj(`display:inline-block;color:#FFFFFF;animation:${s(v.cnt?.anim)}`)}>
                            {t(v.cnt?.n)}
                          </span>
                        </span>
                      </span>
                      <span style={{ color: 'rgba(255,255,255,.55)' }}>/ 08</span>
                    </span>
                    {'\n          '}
                    <h2
                      ref={v.h2Ref}
                      style={cssToObj(
                        `position:relative;z-index:3;margin:0;display:flex;flex-direction:column;align-items:flex-start;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:${s(v.z1?.hf)}px;line-height:.98;letter-spacing:-.045em`,
                      )}
                    >
                      <span
                        style={cssToObj(
                          `position:relative;display:flex;white-space:nowrap;transform-origin:0 0;transform:translate(${s(v.op?.tx)}px,${s(v.op?.ty)}px) scale(${s(v.op?.sc)});will-change:transform`,
                        )}
                      >
                        <span data-ko="s" style={{ display: 'flex', columnGap: '.24em' }}>
                          {(Array.isArray(v.opWords) ? v.opWords : []).map((__it: any, __i: number) => {
                            const v2 = { ...v, w: __it, $index: __i };
                            return ((v: Vals) => (
                              <React.Fragment key={__i}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    overflow: 'hidden',
                                    padding: '.08em .05em .3em',
                                    margin: '-.08em -.05em -.3em',
                                  }}
                                >
                                  <span
                                    style={cssToObj(
                                      `display:inline-block;color:transparent;background-image:linear-gradient(100deg,#FFFFFF 0%,#FFFFFF 40%,#FFF3C4 50%,#FFFFFF 60%,#FFFFFF 100%);background-size:300% 100%;background-position:${s(v.w?.bp)}% 0;-webkit-background-clip:text;background-clip:text;opacity:${s(v.w?.o)};filter:${s(v.w?.f)};transform-origin:50% 100%;transform:translateY(${s(v.w?.y)}px) scale(${s(v.w?.sc)});will-change:transform,filter`,
                                    )}
                                  >
                                    {t(v.w?.w)}
                                  </span>
                                </span>
                              </React.Fragment>
                            ))(v2);
                          })}
                        </span>
                        <span
                          data-ko="o"
                          aria-hidden="true"
                          style={cssToObj(
                            `position:absolute;left:0;top:0;display:flex;column-gap:.24em;pointer-events:none;opacity:${s(v.op?.ko)}`,
                          )}
                        >
                          {(Array.isArray(v.opWords) ? v.opWords : []).map((__it: any, __i: number) => {
                            const v2 = { ...v, w: __it, $index: __i };
                            return ((v: Vals) => (
                              <React.Fragment key={__i}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    overflow: 'hidden',
                                    padding: '.08em .05em .3em',
                                    margin: '-.08em -.05em -.3em',
                                  }}
                                >
                                  <span
                                    style={cssToObj(
                                      `display:inline-block;color:transparent;-webkit-text-stroke:${s(v.w?.ks)}px #FFFFFF;opacity:${s(v.w?.o)};filter:${s(v.w?.f)};transform-origin:50% 100%;transform:translateY(${s(v.w?.y)}px) scale(${s(v.w?.sc)})`,
                                    )}
                                  >
                                    {t(v.w?.w)}
                                  </span>
                                </span>
                              </React.Fragment>
                            ))(v2);
                          })}
                        </span>
                      </span>
                      <span style={{ display: 'block', overflow: 'hidden', padding: '0 .04em .12em 0', marginBottom: '-.12em' }}>
                        <span style={cssToObj(`display:block;color:#F7C032;white-space:nowrap;transform:translateY(${s(v.op?.l2)}%)`)}>
                          We stock every layer.
                        </span>
                      </span>
                    </h2>
                    {'\n        '}
                  </div>
                  {'\n        '}
                  <div style={cssToObj(`position:relative;flex:none;transform:translateY(${s(v.op?.cy)}px)`)}>
                    <svg
                      width={v.z1?.w}
                      height={v.z1?.ch}
                      style={cssToObj(
                        `position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:2;opacity:${s(v.op?.bo)}`,
                      )}
                    >
                      <rect
                        x="0.75"
                        y="0.75"
                        width={v.op?.bw}
                        height={v.op?.bh}
                        rx="23.5"
                        fill="none"
                        stroke="#F7C032"
                        strokeWidth="1.5"
                        pathLength="1"
                        strokeDasharray="1"
                        strokeDashoffset={v.op?.bd}
                      ></rect>
                    </svg>
                    <div
                      style={cssToObj(
                        `position:relative;height:${s(v.z1?.ch)}px;clip-path:inset(0 0 ${s(v.op?.cc)}% 0 round 24px);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.035));backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 0 1px rgba(255,255,255,.1),0 24px 60px rgba(0,0,0,.28);overflow:hidden`,
                      )}
                    >
                      {'\n          '}
                      {(Array.isArray(v.cards) ? v.cards : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, c: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            {'\n            '}
                            <div
                              key={v.c?.key}
                              style={cssToObj(
                                `position:absolute;inset:0;padding:${s(v.z1?.cp)}px 22px ${s(v.z1?.cp)}px;display:flex;flex-direction:column;gap:${s(v.z1?.cg)}px;animation:${s(v.c?.out)}`,
                              )}
                            >
                              {'\n              '}
                              <span
                                style={cssToObj(
                                  `display:flex;justify-content:space-between;gap:10px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;letter-spacing:.12em;white-space:nowrap;animation:${s(v.c?.a0)}`,
                                )}
                              >
                                <span style={{ color: '#F7C032', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: '0' }}>
                                  {t(v.c?.lab)}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,.7)' }}>{t(v.c?.ng)}</span>
                              </span>
                              {'\n              '}
                              <span style={cssToObj(`display:flex;align-items:center;gap:14px;animation:${s(v.c?.a1)}`)}>
                                <span
                                  style={{
                                    width: '52px',
                                    height: '52px',
                                    flex: 'none',
                                    borderRadius: '12px',
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: 'rgba(26,27,29,.55)',
                                    boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.35)',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <SEPart kind={v.c?.kind} size={46} tone="dark" still={true} />
                                </span>
                                <span
                                  style={cssToObj(
                                    `font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:${s(v.z1?.nf)}px;letter-spacing:-.03em;line-height:1.02;color:#FFFFFF;text-wrap:balance;min-width:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden`,
                                  )}
                                >
                                  {t(v.c?.name)}
                                </span>
                              </span>
                              {'\n              '}
                              <span
                                style={cssToObj(
                                  `display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;animation:${s(v.c?.a2)}`,
                                )}
                              >
                                {(Array.isArray(v.c?.nums) ? v.c?.nums : []).map((__it: any, __i: number) => {
                                  const v2 = { ...v, n: __it, $index: __i };
                                  return ((v: Vals) => (
                                    <React.Fragment key={__i}>
                                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        <span
                                          style={cssToObj(
                                            `font-family:'JetBrains Mono',monospace;font-weight:700;font-size:20px;line-height:1;color:${s(v.n?.c)}`,
                                          )}
                                        >
                                          {t(v.n?.v)}
                                        </span>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.65)' }}>{t(v.n?.t)}</span>
                                      </span>
                                    </React.Fragment>
                                  ))(v2);
                                })}
                              </span>
                              {'\n              '}
                              <span
                                style={cssToObj(
                                  `display:flex;flex-wrap:nowrap;gap:4px;height:24px;overflow:hidden;flex:none;animation:${s(v.c?.a3)}`,
                                )}
                              >
                                {(Array.isArray(v.c?.grades) ? v.c?.grades : []).map((__it: any, __i: number) => {
                                  const v2 = { ...v, g: __it, $index: __i };
                                  return ((v: Vals) => (
                                    <React.Fragment key={__i}>
                                      <span
                                        style={{
                                          padding: '4px 8px',
                                          borderRadius: '6px',
                                          background: 'rgba(26,27,29,.5)',
                                          color: '#F7C032',
                                          fontFamily: "'JetBrains Mono',monospace",
                                          fontSize: '11px',
                                          fontWeight: '600',
                                          whiteSpace: 'nowrap',
                                          boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.4)',
                                        }}
                                      >
                                        {t(v.g)}
                                      </span>
                                    </React.Fragment>
                                  ))(v2);
                                })}
                              </span>
                              {'\n              '}
                              <span style={cssToObj(`display:flex;align-items:baseline;gap:8px;min-width:0;animation:${s(v.c?.a3)}`)}>
                                <span
                                  style={{
                                    flex: 'none',
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: '10.5px',
                                    fontWeight: '600',
                                    letterSpacing: '.12em',
                                    color: 'rgba(255,255,255,.5)',
                                  }}
                                >
                                  FITS
                                </span>
                                <span
                                  style={{
                                    minWidth: '0',
                                    fontSize: '14px',
                                    color: 'rgba(255,255,255,.6)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {v.c?.fitsLogos?.ids?.length ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', verticalAlign: 'middle' }} aria-label={v.c?.fits}>
                                      {v.c.fitsLogos.ids.map((id: string) => (
                                        <SEBrandLogo key={id} brand={id} h="13" color="rgba(255,255,255,.75)" />
                                      ))}
                                      {v.c.fitsLogos.more ? <span>{v.c.fitsLogos.more}</span> : null}
                                    </span>
                                  ) : (
                                    t(v.c?.fits)
                                  )}
                                </span>
                              </span>
                              {'\n              '}
                              <a
                                href="#models"
                                onClick={v.c?.go}
                                style={cssToObj(
                                  `margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;height:48px;box-sizing:border-box;padding:0 16px;border-radius:10px;background:#F7C032;color:#26282B;font-size:15px;font-weight:600;text-decoration:none;white-space:nowrap;transition:box-shadow .2s;animation:${s(v.c?.a4)}`,
                                )}
                                className={cx(undefined, 'scp-bd4aecc6')}
                              >
                                {t(v.c?.cta)}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                                </svg>
                              </a>
                              {'\n            '}
                            </div>
                            {'\n          '}
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n        '}
                    </div>
                  </div>
                  {'\n      '}
                </div>
                {'\n      '}
                <div
                  style={cssToObj(
                    `position:absolute;left:${s(v.z3?.x)}px;top:112px;bottom:40px;width:${s(v.z3?.w)}px;display:flex;flex-direction:column;justify-content:center;opacity:${s(v.z3?.o)};pointer-events:${s(v.z3?.pe)};transform:translateX(${s(v.z3?.gx)}px);transition:opacity .5s,transform .7s cubic-bezier(.16,1,.3,1)`,
                  )}
                >
                  {'\n        '}
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {'\n          '}
                    <span
                      style={cssToObj(
                        `position:absolute;left:5px;top:22px;bottom:22px;width:1px;background:rgba(255,255,255,.16);transform-origin:0 0;transform:scaleY(${s(v.op?.r)})`,
                      )}
                    ></span>
                    {'\n          '}
                    {(Array.isArray(v.rows) ? v.rows : []).map((__it: any, __i: number) => {
                      const v2 = { ...v, r: __it, $index: __i };
                      return ((v: Vals) => (
                        <React.Fragment key={__i}>
                          {'\n            '}
                          <button
                            onClick={v.r?.pick}
                            style={cssToObj(
                              `position:relative;display:grid;grid-template-columns:11px 28px minmax(0,1fr);column-gap:14px;align-items:center;height:44px;padding:0;border:none;background:none;cursor:pointer;text-align:left;font-family:Inter,sans-serif;opacity:${s(v.r?.o)};transform:translateX(${s(v.r?.tx)}px);transition:${s(v.r?.tr)}`,
                            )}
                          >
                            {'\n              '}
                            <span
                              data-td-dot={v.r?.idx}
                              style={cssToObj(
                                `position:relative;width:11px;height:11px;border-radius:50%;background:${s(v.r?.bg)};box-shadow:${s(v.r?.glow)};transition:background .3s,box-shadow .3s`,
                              )}
                            ></span>
                            {'\n              '}
                            <span
                              style={cssToObj(
                                `font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:${s(v.r?.num)};transition:color .3s`,
                              )}
                            >
                              {t(v.r?.i)}
                            </span>
                            {'\n              '}
                            <span
                              style={cssToObj(
                                `display:flex;align-items:center;gap:8px;font-size:16px;font-weight:500;color:${s(v.r?.ink)};white-space:nowrap;transition:color .3s`,
                              )}
                            >
                              {t(v.r?.t)}
                              {v.r?.done ? (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="3">
                                    <path d="M5 12l5 5 9-10"></path>
                                  </svg>
                                </>
                              ) : null}
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
                </div>
                {'\n      '}
                <div
                  style={cssToObj(
                    `position:absolute;left:${s(v.msg?.l)}px;top:112px;bottom:40px;width:${s(v.msg?.w)}px;display:flex;flex-direction:column;justify-content:center;opacity:${s(v.msg?.o)};pointer-events:${s(v.msg?.pe)}`,
                  )}
                >
                  {'\n        '}
                  <div
                    id="offer"
                    ref={v.finRef}
                    style={cssToObj(
                      `display:flex;flex-direction:column;gap:22px;color:#FFFFFF;transform:scale(${s(v.msg?.s)});transform-origin:0 50%`,
                    )}
                  >
                    {'\n          '}
                    <span
                      style={cssToObj(
                        `align-self:flex-start;display:flex;align-items:center;gap:10px;height:34px;padding:0 14px 0 12px;border-radius:999px;background:rgba(255,255,255,.06);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;letter-spacing:.12em;color:#D5D7DA;white-space:nowrap;opacity:${s(v.msg?.pl)};transform:translateX(${s(v.msg?.plY)}px);filter:${s(v.msg?.plB)}`,
                      )}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#34C759',
                          animation: 'tdLive 1.8s ease-out infinite',
                        }}
                      ></span>
                      IN STOCK TODAY · DEIRA
                    </span>
                    {'\n          '}
                    <h2
                      style={cssToObj(
                        `margin:0;display:flex;flex-direction:column;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:${s(v.msg?.fs)}px;line-height:.98;letter-spacing:-.045em`,
                      )}
                    >
                      {(Array.isArray(v.msgLines) ? v.msgLines : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, w: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span style={{ display: 'block', overflow: 'hidden', padding: '0 .04em .1em 0', marginBottom: '-.1em' }}>
                              <span
                                style={cssToObj(
                                  `display:inline-block;white-space:nowrap;color:transparent;background-image:linear-gradient(100deg,${s(v.w?.c)} 0%,${s(v.w?.c)} 42%,${s(v.w?.sh)} 50%,${s(v.w?.c)} 58%,${s(v.w?.c)} 100%);background-size:250% 100%;background-position:120% 0;-webkit-background-clip:text;background-clip:text;transform-origin:0 70%;opacity:${s(v.w?.o)};filter:${s(v.w?.f)};transform:scale(${s(v.w?.sc)});animation:${s(v.w?.anim)}`,
                                )}
                              >
                                {t(v.w?.t)}
                              </span>
                            </span>
                          </React.Fragment>
                        ))(v2);
                      })}
                    </h2>
                    {'\n          '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', alignItems: 'end' }}>
                      {'\n            '}
                      {(Array.isArray(v.counts) ? v.counts : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, c: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span
                              style={cssToObj(
                                `display:flex;flex-direction:column;gap:8px;padding:0 0 0 ${s(v.c?.pl)}px;box-shadow:${s(v.c?.dv)};opacity:${s(v.c?.o)};transform:translateY(${s(v.c?.y)}px)`,
                              )}
                            >
                              <span style={{ display: 'block', height: '42px', overflow: 'hidden' }}>
                                <span
                                  style={cssToObj(
                                    `display:block;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:42px;line-height:42px;letter-spacing:-.03em;color:#FFFFFF;font-variant-numeric:tabular-nums;transform:translateY(${s(v.c?.ry)}%);filter:${s(v.c?.rb)}`,
                                  )}
                                >
                                  {t(v.c?.v)}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  letterSpacing: '.12em',
                                  lineHeight: '14px',
                                  color: '#C9CBCE',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {t(v.c?.t)}
                              </span>
                            </span>
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n          '}
                    </div>
                    {'\n          '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '10px' }}>
                      {'\n            '}
                      {(Array.isArray(v.chips) ? v.chips : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, c: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <a
                              href="#models"
                              onClick={v.c?.go}
                              onMouseEnter={v.c?.enter}
                              onMouseLeave={v.c?.leave}
                              style={cssToObj(
                                `position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:4px;box-sizing:border-box;padding:8px 8px 12px;border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.03));backdrop-filter:blur(14px) saturate(1.2);-webkit-backdrop-filter:blur(14px) saturate(1.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 0 1px ${s(v.c?.bd)},${s(v.c?.sh)};color:#FFFFFF;text-decoration:none;opacity:${s(v.c?.o)};transform:translateY(${s(v.c?.y)}px);transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s`,
                              )}
                            >
                              <span style={cssToObj(`position:relative;width:100%;height:${s(v.chipH)}px;display:grid;place-items:center`)}>
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '10%',
                                    right: '10%',
                                    top: '0',
                                    height: '70%',
                                    background: 'radial-gradient(closest-side,rgba(255,240,210,.16),rgba(255,240,210,0))',
                                    pointerEvents: 'none',
                                  }}
                                ></span>
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '24%',
                                    right: '24%',
                                    bottom: '2px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: 'radial-gradient(closest-side,rgba(10,10,12,.6),rgba(10,10,12,0))',
                                  }}
                                ></span>
                                <span
                                  style={{
                                    position: 'absolute',
                                    left: '20%',
                                    right: '20%',
                                    bottom: '5px',
                                    height: '9px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(180deg,rgba(255,255,255,.24),rgba(255,255,255,.05))',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.34)',
                                  }}
                                ></span>
                                {v.c?.hasImg ? (
                                  <>
                                    <img
                                      src={v.c?.img}
                                      alt=""
                                      style={cssToObj(
                                        `position:relative;width:${s(v.chipI)}px;height:${s(v.chipI)}px;display:block;object-fit:contain;margin-top:-8px;transform:${s(v.c?.rt)};transition:transform .45s cubic-bezier(.16,1,.3,1)`,
                                      )}
                                    />
                                  </>
                                ) : null}
                                {v.c?.noImg ? (
                                  <>
                                    <span style={{ position: 'relative', marginTop: '-8px' }}>
                                      <SEPart kind={v.c?.kind} size={56} tone="dark" still={true} />
                                    </span>
                                  </>
                                ) : null}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'Space Grotesk',sans-serif",
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  lineHeight: '1.15',
                                  letterSpacing: '-.01em',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100%',
                                }}
                              >
                                {t(v.c?.t)}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  color: '#C9CBCE',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {t(v.c?.stock)}
                              </span>
                              <span
                                style={cssToObj(
                                  `position:absolute;left:14px;right:14px;bottom:0;height:2px;border-radius:2px;background:#F7C032;box-shadow:0 0 10px rgba(247,192,50,.6);transform-origin:0 50%;transform:scaleX(${s(v.c?.ln)});transition:transform .35s cubic-bezier(.16,1,.3,1)`,
                                )}
                              ></span>
                            </a>
                          </React.Fragment>
                        ))(v2);
                      })}
                      {'\n          '}
                    </div>
                    {'\n          '}
                    <div
                      style={cssToObj(
                        `display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:${s(v.msg?.bw)}px;opacity:${s(v.msg?.b)};transform-origin:0 0;transform:translateY(${s(v.msg?.bY)}px) scale(${s(v.msg?.inv)})`,
                      )}
                    >
                      {'\n            '}
                      <a
                        href="#find"
                        data-td-fmp="1"
                        onClick={v.openFmp}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '52px',
                          boxSizing: 'border-box',
                          padding: '0 16px',
                          borderRadius: '10px',
                          background: '#F7C032',
                          border: '1.5px solid #F7C032',
                          color: '#26282B',
                          fontWeight: '600',
                          fontSize: '15px',
                          textDecoration: 'none',
                          transition: 'transform .2s,box-shadow .2s,border-color .2s',
                        }}
                        className={cx(undefined, 'scp-5861bbd1')}
                      >
                        <span
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            background: 'rgba(26,27,29,.12)',
                            flex: 'none',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                            <circle cx="11" cy="11" r="7"></circle>
                            <path d="m20 20-3.5-3.5"></path>
                          </svg>
                        </span>
                        <span style={{ flex: '1', whiteSpace: 'nowrap' }}>Find My Part</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <path d="M5 12h14M13 6l6 6-6 6"></path>
                        </svg>
                      </a>
                      {'\n            '}
                      <a
                        href="#models"
                        onClick={v.shopAll}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '52px',
                          boxSizing: 'border-box',
                          padding: '0 16px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,.04)',
                          border: '1.5px solid rgba(255,255,255,.32)',
                          color: '#FFFFFF',
                          fontWeight: '600',
                          fontSize: '15px',
                          textDecoration: 'none',
                          transition: 'transform .2s,box-shadow .2s,border-color .2s',
                        }}
                        className={cx(undefined, 'scp-5861bbd1')}
                      >
                        <span
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            background: 'rgba(247,192,50,.14)',
                            flex: 'none',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                            <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                          </svg>
                        </span>
                        <span style={{ flex: '1', whiteSpace: 'nowrap' }}>Shop all parts</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <path d="M5 12h14M13 6l6 6-6 6"></path>
                        </svg>
                      </a>
                      {'\n          '}
                    </div>
                    {'\n        '}
                  </div>
                  {'\n      '}
                </div>
                {'\n      '}
                <div
                  style={cssToObj(
                    `position:absolute;left:50%;bottom:28px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:${s(v.hint?.o)};pointer-events:none;transition:opacity .2s`,
                  )}
                >
                  {/* Issue 1: the scroll hint is our chevron motif: "SCROLL" with three chevrons lighting up going down */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '.18em',
                      color: 'rgba(255,255,255,.75)',
                    }}
                  >
                    SCROLL
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-2px' }}>
                    {[0, 1, 2].map((i) => (
                      <svg key={i} className="td-chev" width="16" height="9" viewBox="0 0 16 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: i ? '-1px' : 0, animationDelay: i * 0.18 + 's' }}>
                        <path d="M2 1.5 8 7.5 14 1.5" />
                      </svg>
                    ))}
                  </span>
                  {'\n      '}
                </div>
                {'\n      '}
                <a
                  href="#families"
                  onClick={v.skip}
                  style={cssToObj(
                    `position:absolute;left:${s(v.z1?.x)}px;bottom:40px;display:flex;align-items:center;gap:8px;height:32px;color:rgba(255,255,255,.8);font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;letter-spacing:.08em;text-decoration:none;white-space:nowrap;opacity:${s(v.skp?.o)};pointer-events:${s(v.skp?.pe)};transition:color .2s,opacity .3s`,
                  )}
                  className={cx(undefined, 'scp-f2a4cf2e')}
                >
                  Skip teardown
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 5v14M6 13l6 6 6-6"></path>
                  </svg>
                </a>
                {'\n    '}
              </div>
              {'\n  '}
            </div>
          </>
        ) : null}
        {v.mob ? (
          <>
            {'\n  '}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '64px 20px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {'\n    '}
              <div
                style={cssToObj(
                  `position:absolute;inset:0;background:linear-gradient(180deg,#26282B 0%,#26282B 70%,#141517 100%);opacity:${s(v.bg?.g)};pointer-events:none`,
                )}
              ></div>
              {'\n    \n    '}
              <div
                style={cssToObj(
                  `position:absolute;inset:0;background:linear-gradient(0deg,rgba(247,192,50,0) 0%,rgba(247,192,50,0) 30%,rgba(247,192,50,.85) 62%,rgba(247,192,50,.2) 75%,rgba(61,62,63,0) 90%);opacity:${s(v.bg?.flood)};pointer-events:none`,
                )}
              ></div>
              {'\n    '}
              <div
                style={cssToObj(
                  `position:absolute;inset:0;background:linear-gradient(180deg,#F2F3F4 0%,#FFE9A8 30%,#FFDB6E 55%,#F7C032 100%);opacity:${s(v.bg?.fin)};pointer-events:none`,
                )}
              ></div>
              {'\n    '}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  textAlign: 'center',
                }}
              >
                {'\n      '}
                <span
                  style={cssToObj(
                    `display:flex;flex-wrap:wrap;justify-content:center;column-gap:.24em;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:42px;line-height:1;letter-spacing:-.045em;color:${s(v.mt?.ink)}`,
                  )}
                >
                  {(Array.isArray(v.words) ? v.words : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, w: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        <span style={cssToObj(`opacity:${s(v.w?.o)};filter:blur(${s(v.w?.b)}px)`)}>{t(v.w?.t)}</span>
                      </React.Fragment>
                    ))(v2);
                  })}
                </span>
                {'\n      '}
                <span
                  style={cssToObj(
                    `font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:24px;line-height:1.1;letter-spacing:-.03em;color:${s(v.mt?.sub)};opacity:${s(v.hd?.o2)}`,
                  )}
                >
                  We stock every layer.
                </span>
                {'\n    '}
              </div>
              {'\n    '}
              <div ref={v.hostRef} style={{ position: 'relative', height: '480px', margin: '0 -20px' }}>
                {'\n      '}
                <span
                  style={cssToObj(
                    `position:absolute;left:50%;top:50%;width:440px;height:440px;margin:-220px 0 0 -220px;border-radius:50%;background:radial-gradient(closest-side,rgba(247,192,50,.42),rgba(247,192,50,0));opacity:${s(v.glow?.o)};pointer-events:none`,
                  )}
                ></span>
                {'\n      \n      '}
                <canvas style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></canvas>
                {'\n      '}
                {v.loading ? (
                  <>
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '34px',
                        height: '34px',
                        margin: '-17px 0 0 -17px',
                        borderRadius: '50%',
                        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.12)',
                        borderTop: '2px solid #F7C032',
                        boxSizing: 'border-box',
                        animation: 'tdSpin 1s linear infinite',
                      }}
                    ></span>
                  </>
                ) : null}
                {'\n    '}
              </div>
              {'\n    '}
              {v.mRail ? (
                <>
                  {'\n      '}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      lineHeight: '1',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        overflow: 'hidden',
                        height: '40px',
                        fontSize: '40px',
                        color: '#F7C032',
                        letterSpacing: '-.04em',
                      }}
                    >
                      <span key={v.cnt?.n} style={cssToObj(`display:inline-block;animation:${s(v.cnt?.anim)}`)}>
                        {t(v.cnt?.n)}
                      </span>
                    </span>
                    <span style={{ fontSize: '20px', color: 'rgba(255,255,255,.45)' }}>/ 08</span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontWeight: '600',
                        fontSize: '11px',
                        letterSpacing: '.12em',
                        color: 'rgba(255,255,255,.85)',
                      }}
                    >
                      {t(v.cnt?.label)}
                    </span>
                  </div>
                  {'\n      '}
                  <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(8,minmax(0,1fr))' }}>
                    {'\n        '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '6.25%',
                        right: '6.25%',
                        top: '15px',
                        height: '2px',
                        background: 'rgba(255,255,255,.12)',
                      }}
                    ></span>
                    {'\n        '}
                    <span
                      style={cssToObj(
                        `position:absolute;left:6.25%;top:15px;width:calc(87.5% * ${s(v.railFill)});height:2px;background:#F7C032;box-shadow:0 0 8px #F7C032;transition:width .4s cubic-bezier(.2,.8,.2,1);overflow:hidden`,
                      )}
                    ></span>
                    {'\n        '}
                    {(Array.isArray(v.rows) ? v.rows : []).map((__it: any, __i: number) => {
                      const v2 = { ...v, l: __it, $index: __i };
                      return ((v: Vals) => (
                        <React.Fragment key={__i}>
                          {'\n          '}
                          <button
                            onClick={v.l?.pick}
                            aria-label={v.l?.t}
                            style={{
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '6px',
                              height: '48px',
                              padding: '7px 0 0',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              fontFamily: 'Inter,sans-serif',
                            }}
                          >
                            <span
                              style={cssToObj(
                                `position:relative;width:18px;height:18px;border-radius:50%;background:${s(v.l?.bg)};box-shadow:${s(v.l?.glow)};transition:background .3s,box-shadow .3s`,
                              )}
                            >
                              <span
                                style={cssToObj(
                                  `position:absolute;left:6px;top:6px;width:6px;height:6px;border-radius:50%;background:${s(v.l?.dot)}`,
                                )}
                              ></span>
                            </span>
                            <span style={cssToObj(`font-family:'JetBrains Mono',monospace;font-size:10.5px;color:${s(v.l?.sub)}`)}>
                              {t(v.l?.i)}
                            </span>
                          </button>
                          {'\n        '}
                        </React.Fragment>
                      ))(v2);
                    })}
                    {'\n      '}
                  </div>
                  {'\n      '}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '20px',
                      background: 'rgba(38,40,43,.88)',
                      boxShadow: 'inset 0 2px 0 #F7C032,inset 0 0 0 1px rgba(255,255,255,.1),0 24px 50px rgba(0,0,0,.35)',
                      overflow: 'hidden',
                    }}
                  >
                    {'\n        '}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          flex: 'none',
                          borderRadius: '10px',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'rgba(247,192,50,.14)',
                          boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.5)',
                        }}
                      >
                        <SEPart kind={v.card?.kind} size={40} tone="dark" still={true} />
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span
                          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}
                        >
                          {t(v.card?.cat)}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk',sans-serif",
                            fontWeight: '700',
                            fontSize: '24px',
                            letterSpacing: '-.02em',
                            lineHeight: '1.1',
                          }}
                        >
                          {t(v.card?.name)}
                        </span>
                      </span>
                    </span>
                    {'\n        '}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px' }}>
                      {'\n          '}
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px', color: 'rgba(255,255,255,.85)' }}>
                          IN STOCK
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: '700', fontSize: '20px' }}>
                          {t(v.card?.stock)}
                        </span>
                      </span>
                      {'\n          '}
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px', color: 'rgba(255,255,255,.85)' }}>
                          BRANDS
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '18px', fontWeight: '700', color: '#F7C032' }}>
                          {t(v.card?.brands)}
                        </span>
                      </span>
                      {'\n        '}
                    </div>
                    {'\n        '}
                    <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(Array.isArray(v.card?.grades) ? v.card?.grades : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, g: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span
                              style={{
                                padding: '3px 7px',
                                borderRadius: '6px',
                                background: '#3D3E3F',
                                color: '#F7C032',
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: '11px',
                                fontWeight: '600',
                                boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.4)',
                              }}
                            >
                              {t(v.g)}
                            </span>
                          </React.Fragment>
                        ))(v2);
                      })}
                    </span>
                    {'\n        '}
                    <div style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 44px', gap: '8px' }}>
                      {'\n          '}
                      <button
                        onClick={v.prev}
                        aria-label="Previous layer"
                        style={{
                          display: 'grid',
                          placeItems: 'center',
                          height: '44px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,.2)',
                          background: 'transparent',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M15 6l-6 6 6 6"></path>
                        </svg>
                      </button>
                      {'\n          '}
                      <a
                        href="#models"
                        onClick={v.card?.go}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          height: '44px',
                          padding: '0 12px',
                          borderRadius: '10px',
                          background: '#F7C032',
                          color: '#26282B',
                          fontSize: '14px',
                          fontWeight: '600',
                          textDecoration: 'none',
                        }}
                      >
                        {t(v.card?.cta)}
                      </a>
                      {'\n          '}
                      <button
                        onClick={v.next}
                        aria-label="Next layer"
                        style={{
                          display: 'grid',
                          placeItems: 'center',
                          height: '44px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,.2)',
                          background: 'transparent',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M9 6l6 6-6 6"></path>
                        </svg>
                      </button>
                      {'\n        '}
                    </div>
                    {'\n      '}
                  </div>
                  {'\n    '}
                </>
              ) : null}
              {'\n    '}
              {v.mFin ? (
                <>
                  {'\n      '}
                  <div id="offer" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '18px', color: '#26282B' }}>
                    {'\n        '}
                    <span
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        columnGap: '.24em',
                        fontFamily: "'Space Grotesk',sans-serif",
                        fontWeight: '700',
                        fontSize: '34px',
                        lineHeight: '1.04',
                        letterSpacing: '-.04em',
                      }}
                    >
                      {(Array.isArray(v.msgWords) ? v.msgWords : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, w: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span style={cssToObj(`opacity:${s(v.w?.o)};filter:blur(${s(v.w?.b)}px)`)}>{t(v.w?.t)}</span>
                          </React.Fragment>
                        ))(v2);
                      })}
                    </span>
                    {'\n        '}
                    <div style={cssToObj(`display:flex;flex-wrap:wrap;gap:20px;opacity:${s(v.msg?.c)}`)}>
                      {(Array.isArray(v.counts) ? v.counts : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, c: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span
                                style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: '700', fontSize: '28px', lineHeight: '1' }}
                              >
                                {t(v.c?.v)}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: '500', color: '#3D3E3F' }}>{t(v.c?.t)}</span>
                            </span>
                          </React.Fragment>
                        ))(v2);
                      })}
                    </div>
                    {'\n        '}
                    <div
                      style={cssToObj(
                        `display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -20px;padding:0 20px;opacity:${s(v.msg?.ch)}`,
                      )}
                    >
                      {(Array.isArray(v.chips) ? v.chips : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, c: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <a
                              href="#models"
                              onClick={v.c?.go}
                              style={{
                                flex: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '44px',
                                padding: '0 12px 0 6px',
                                borderRadius: '10px',
                                background: '#3D3E3F',
                                color: '#F7C032',
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: '12px',
                                fontWeight: '600',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                boxShadow: 'inset 0 0 0 1px rgba(247,192,50,.4)',
                              }}
                            >
                              <span
                                style={{
                                  display: 'grid',
                                  placeItems: 'center',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  background: '#26282B',
                                  overflow: 'hidden',
                                }}
                              >
                                <SEPart kind={v.c?.kind} size={30} tone="dark" still={true} />
                              </span>
                              {t(v.c?.t)}
                            </a>
                          </React.Fragment>
                        ))(v2);
                      })}
                    </div>
                    {'\n        '}
                    <div style={cssToObj(`display:grid;gap:10px;opacity:${s(v.msg?.b)}`)}>
                      {'\n          '}
                      <a
                        href="#find"
                        onClick={v.openFmp}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '52px',
                          boxSizing: 'border-box',
                          padding: '0 16px 0 11px',
                          borderRadius: '10px',
                          background: '#26282B',
                          border: '1.5px solid #26282B',
                          color: '#FFFFFF',
                          fontWeight: '600',
                          fontSize: '15px',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 10px 24px rgba(26,27,29,.25)',
                        }}
                      >
                        <span
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            background: 'rgba(247,192,50,.18)',
                            color: '#F7C032',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                            <circle cx="11" cy="11" r="7"></circle>
                            <path d="M20 20l-3.5-3.5"></path>
                          </svg>
                        </span>
                        Find My Part
                      </a>
                      {'\n          '}
                      <a
                        href="#models"
                        onClick={v.shopAll}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '52px',
                          boxSizing: 'border-box',
                          padding: '0 16px 0 11px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,.35)',
                          border: '1.5px solid #26282B',
                          color: '#26282B',
                          fontWeight: '600',
                          fontSize: '15px',
                          textDecoration: 'none',
                        }}
                      >
                        <span
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            background: 'rgba(26,27,29,.08)',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                            <path d="M5 12h14M13 6l6 6-6 6"></path>
                          </svg>
                        </span>
                        Shop all parts
                      </a>
                      {'\n        '}
                    </div>
                    {'\n        '}
                    <button
                      onClick={v.replay}
                      style={{
                        alignSelf: 'flex-start',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '44px',
                        padding: '0 4px',
                        border: 'none',
                        background: 'none',
                        color: '#26282B',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v5h5"></path>
                      </svg>
                      Replay teardown
                    </button>
                    {'\n      '}
                  </div>
                  {'\n    '}
                </>
              ) : null}
              {'\n  '}
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}

const SETeardown = createDC('SE Teardown', Logic, render);
export default SETeardown;
