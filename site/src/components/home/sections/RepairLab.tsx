// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "RepairLab". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cssToObj, cx, s, t } from '@/dc/runtime';
import SEBrandLogo from '../../dc/SEBrandLogo';
import RepairScene from '../RepairScene';
import InfoTip from '../InfoTip';

/** Issue 4: fine film grain instead of grids, stripes and tiles. */
const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

export default function RepairLab({ v, full = false }: { v: Vals; full?: boolean }) {
  return (
    <section id={full ? 'repair-lab' : 'repair'} data-tone="light" data-screen-label="08 Repair Lab" className="rp" style={{ padding: 'clamp(80px,8vw,120px) clamp(20px,4vw,64px)' }}>
      {/* R6 §11: the bench itself: graphite ESD mat (faint grid), warm light from above, circuit traces in the gutters. No tiles. */}
      {/* owner (27 Oct): no flat lines; the section's own branching circuits come from SectionLife, in the gutters */}
      <div style={{ position: 'relative', maxWidth: '1312px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {'\n    '}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '620px' }}>
            {'\n        '}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '.14em',
                color: '#F7C032',
              }}
            >
              <span style={{ width: '28px', height: '2px', background: '#F7C032' }}></span>REPAIR LAB · DEIRA BENCH
            </span>
            {'\n        '}
            <h2
              style={{
                margin: '0',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: 'clamp(34px,3.4vw,48px)',
                lineHeight: '1.08',
                letterSpacing: '-.03em',
                color: '#26282B',
              }}
            >
              <span>Fixed, tested,</span> <span style={{ color: '#F7C032' }}>guaranteed.</span>
            </h2>
            {'\n      '}
          </div>
          {'\n      \n    '}
        </div>
        {'\n    '}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: '20px' }}>
          {'\n      '}
          <RepairScene ticket={v.re?.ticket || { model: '', problems: '' }} full={full} />
          {'\n      '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '26px',
              borderRadius: '24px',
              background: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.06)',
            }}
          >
            {'\n        '}
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '.12em',
                color: '#5E6064',
              }}
            >
              <span>REPAIR ESTIMATOR</span>
              <span>TYPICAL PRICES</span>
            </span>
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#3D3E3F' }}>1 · Brand</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(Array.isArray(v.re?.brands) ? v.re?.brands : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, b: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <button
                        onClick={v.b?.pick}
                        title={v.b?.name}
                        style={cssToObj(
                          `display:grid;place-items:center;height:36px;min-width:56px;padding:0 12px;border-radius:10px;border:none;background:${s(v.b?.bg)};box-shadow:${s(v.b?.sh)};cursor:pointer;transition:background .2s`,
                        )}
                      >
                        <SEBrandLogo brand={v.b?.id} color={v.b?.ink} h="18" />
                      </button>
                    </React.Fragment>
                  ))(v2);
                })}
              </div>
            </div>
            {'\n        '}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {'\n          '}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3D3E3F' }}>2 · Device and model</span>
                <div className="rp-devs">
                  {(v.re?.devs || []).map((d: any) => (
                    <button key={d.id} type="button" className={'rp-chip lt' + (d.on ? ' on' : '')} aria-pressed={d.on} onClick={d.pick}>{d.n}</button>
                  ))}
                </div>
                <button
                  onClick={v.re?.mdd?.toggle}
                  style={cssToObj(
                    `display:flex;align-items:center;justify-content:space-between;gap:8px;height:44px;padding:0 12px;border-radius:10px;border:1.5px solid ${s(v.re?.mdd?.bd)};background:#FFFFFF;font-size:15px;font-weight:500;color:#26282B;cursor:pointer;text-align:left`,
                  )}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t(v.re?.mdd?.cur)}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#26282B"
                    strokeWidth="2.4"
                    style={cssToObj(`flex:none;transform:rotate(${s(v.re?.mdd?.rot)}deg);transition:transform .2s`)}
                  >
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
                {v.re?.mdd?.open ? (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        right: '0',
                        top: '122px',
                        zIndex: '20',
                        maxHeight: '240px',
                        overflowY: 'auto',
                        padding: '6px',
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        boxShadow: '0 0 0 1px rgba(26,27,29,.08),0 20px 40px rgba(26,27,29,.18)',
                        animation: 'seRise .2s both',
                      }}
                    >
                      <input className="rp-search" value={v.re?.q || ''} onChange={v.re?.setQ} placeholder="Search your model…" autoFocus aria-label="Search your model" />
                      {(Array.isArray(v.re?.mdd?.opts) ? v.re?.mdd?.opts : []).map((__it: any, __i: number) => {
                        const v2 = { ...v, o: __it, $index: __i };
                        return ((v: Vals) => (
                          <React.Fragment key={__i}>
                            <button
                              onClick={v.o?.pick}
                              style={cssToObj(
                                `display:flex;align-items:center;justify-content:space-between;width:100%;height:36px;padding:0 10px;border:none;border-radius:8px;background:${s(v.o?.bg)};font-size:14px;font-weight:500;color:#26282B;cursor:pointer;text-align:left`,
                              )}
                              className={cx(undefined, 'scp-9735d96e')}
                            >
                              {t(v.o?.name)}
                              {v.o?.on ? (
                                <>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="3">
                                    <path d="M5 12l5 5L20 7"></path>
                                  </svg>
                                </>
                              ) : null}
                            </button>
                          </React.Fragment>
                        ))(v2);
                      })}
                    </div>
                  </>
                ) : null}
              </div>
              {'\n        '}
            </div>
            {'\n        '}
            {/* R6 §11: problems are a multi-select (the film follows the first screen / battery / port choice) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#3D3E3F' }}>3 · What needs fixing? (choose all that apply)</span>
              {!full ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(v.re?.groups || []).flatMap((g: any) => g.items).slice(0, 9).map((p: any) => (
                    <button key={p.id} type="button" aria-pressed={p.on} onClick={p.pick} className={'rp-chip lt' + (p.on ? ' on' : '')}>{p.name}</button>
                  ))}
                  <button type="button" className="rp-chip lt rp-more" onClick={v.re?.more}>All repairs →</button>
                </div>
              ) : (
              <div className="rp-groups">
                {(v.re?.groups || []).map((g: any) => (
                  <div key={g.g} className="rp-grp">
                    <small>{g.g}</small>
                    <div>
                      {g.items.map((p: any) => (
                        <button key={p.id} type="button" aria-pressed={p.on} onClick={p.pick} className={'rp-chip lt' + (p.on ? ' on' : '')}>{p.name}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
            {full ? <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#3D3E3F' }}>4 · Quality</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(Array.isArray(v.re?.grades) ? v.re?.grades : []).map((__it: any, __i: number) => {
                  const v2 = { ...v, g: __it, $index: __i };
                  return ((v: Vals) => (
                    <React.Fragment key={__i}>
                      <button
                        onClick={v.g?.pick}
                        style={cssToObj(
                          `display:inline-flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:1px;height:44px;padding:0 14px;border-radius:10px;border:none;background:${s(v.g?.bg)};color:${s(v.g?.ink)};box-shadow:${s(v.g?.sh)};font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap`,
                        )}
                      >
                        {t(v.g?.name)}
                        <small className="rp-gsub">{v.g?.sub}</small>
                      </button>
                    </React.Fragment>
                  ))(v2);
                })}
              </div>
              {v.re?.maker ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#5E6064' }}>
                  <span>Manufacturer:</span>
                  <b style={{ color: '#26282B' }}>{v.re.maker}</b>
                  <InfoTip name={v.re.maker} kind="maker" dark={false} />
                  <span style={{ marginInlineStart: '8px' }}>Quality:</span>
                  <b style={{ color: '#26282B' }}>{v.re.grade}</b>
                  <InfoTip name={v.re.grade} kind="quality" dark={false} />
                </span>
              ) : !v.re?.hasParts ? (
                <span style={{ fontSize: '13px', color: '#5E6064' }}>Quoted after diagnosis.</span>
              ) : null}
            </div> : null}
            {'\n        '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '18px',
                borderRadius: '16px',
                background: 'linear-gradient(140deg,#3D3E3F,#26282B)',
                color: '#FFFFFF',
              }}
            >
              {'\n          '}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#9DA1A6' }}>
                  ESTIMATE
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: '700',
                    fontSize: '28px',
                    letterSpacing: '-.02em',
                    color: '#F7C032',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    height: '34px',
                  }}
                >
                  <span style={cssToObj(`display:inline-block;animation:${s(v.re?.rollAnim)}`)}>{t(v.re?.range)}</span>
                </span>
              </span>
              {'\n          '}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#9DA1A6' }}>
                  BENCH TIME
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: '700',
                    fontSize: '28px',
                    letterSpacing: '-.02em',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 12V7" style={{ transformOrigin: '12px 12px', animation: 'reHand 4s linear infinite' }}></path>
                    <path d="M12 12h3.5" style={{ transformOrigin: '12px 12px', animation: 'reHand 48s linear infinite' }}></path>
                  </svg>
                  {t(v.re?.time)}
                </span>
              </span>
              {'\n          '}
              <span style={{ gridColumn: 'span 2', display: 'flex', flexWrap: 'wrap', columnGap: '4px', fontSize: '13px', color: '#C9CBCE' }}>{(v.re?.note || []).map((n: string) => <span key={n}>{n}</span>)}</span>
              {'\n        '}
            </div>
            {'\n        '}
            {/* owner (27 Oct): the visit is optional; everything goes to WhatsApp as one tidy booking message */}
            {full ? <div className="rp-when">
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#3D3E3F" }}><span>5 · When can you come?</span> <em>optional</em></span>
              <div>
                <input type="date" value={v.re?.date || ''} onChange={v.re?.setDate} aria-label="Preferred day" />
                <select value={v.re?.time || 'any'} onChange={v.re?.setTime} aria-label="Preferred time">
                  {(v.re?.times || []).map(([k, l]: [string, string]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </div>
              <textarea defaultValue={v.re?.noteTxt || ''} onChange={v.re?.setNote} rows={2} placeholder="Anything else? (colour, password-free check, pickup…)" aria-label="Notes" />
            </div> : null}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {'\n          '}
              <a
                href={v.re?.wa}
                target="_blank"
                rel="noopener"
                style={{
                  flex: '1',
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '44px',
                  padding: '0 16px',
                  borderRadius: '10px',
                  background: '#F7C032',
                  color: '#26282B',
                  fontSize: '15px',
                  fontWeight: '600',
                }}
                className={cx(undefined, 'scp-fe3982c3')}
              >
                {full ? 'Send booking on WhatsApp' : 'Book on WhatsApp'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
              {'\n          '}
              <a
                href="#repair"
                onClick={full ? (e: React.MouseEvent) => { e.preventDefault(); v.re?.close(); } : v.re?.more}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '44px',
                  padding: '0 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #26282B',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#26282B',
                }}
                className={cx(undefined, 'scp-8a3ebd05')}
              >
                {full ? 'Close the Repair Lab' : 'Open the full Repair Lab'}
              </a>
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
