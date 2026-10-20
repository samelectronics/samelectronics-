// Deals & arrivals (Issue 7): rebuilt 13 Oct 2026. Styles in src/styles/deals.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEHomeDeals.logic.js';

/** R6 §10: the shipment map is real geography (Natural Earth coastlines and borders, scripts/maps/make-ship-map.mjs →
 *  public/se-ship-map.json, fetched when the section nears). The arc runs Shenzhen → Dubai; the plane sits at the real
 *  progress of the sample shipment. */
type ShipMap = { w: number; h: number; land: string; borders: string; shenzhen: [number, number]; dubai: [number, number] };
const FALLBACK: ShipMap = { w: 520, h: 230, land: '', borders: '', shenzhen: [430, 150], dubai: [70, 140] };
const arcOf = (m: ShipMap) => {
  const A = m.shenzhen, B = m.dubai, C: [number, number] = [(A[0] + B[0]) / 2, Math.min(A[1], B[1]) - 80];
  const bez = (t: number): [number, number] => [(1 - t) * (1 - t) * A[0] + 2 * (1 - t) * t * C[0] + t * t * B[0], (1 - t) * (1 - t) * A[1] + 2 * (1 - t) * t * C[1] + t * t * B[1]];
  return { A, B, C, bez };
};

function Tile({ d, k }: { d: string; k: string }) {
  return (
    <span className="dl-flap">
      <span key={k} className="dl-flap-in">
        {d}
      </span>
      <i />
    </span>
  );
}

function render(v: Vals) {
  const spot = v.spot;
  const ship = v.ship;
  const prog = ship ? ship.prog : 0;
  const M: ShipMap = v.map || FALLBACK, { A, B, C, bez } = arcOf(M);
  const [plx, ply] = bez(prog), [pnx, pny] = bez(Math.min(1, prog + 0.01));
  const ang = (Math.atan2(pny - ply, pnx - plx) * 180) / Math.PI;
  const trail = Array.from({ length: 24 }, (_, i) => bez((prog * i) / 23));
  return (
    <section id="deals" ref={v.secRef} className={'dl' + (v.seen ? ' dl-seen' : '')}>
      <div className="dl-in">
        <header className="dl-top">
          <div>
            <span className="dl-eb">DEALS & ARRIVALS · SAMPLE PRICES</span>
            <h2 className="dl-h">
              <span>
                <span>Prices drop. Clocks tick.</span>
              </span>
              <span>
                <span>Grab it before the next shop does.</span>
              </span>
            </h2>
          </div>
          <div className="dl-side">
          {/* R6 §10: the live count is live data at the side, not part of the title */}
          <span className="dl-live" aria-live="polite">
            <i />
            <b key={v.live}>{v.live}</b> live deals
          </span>
          <a href="#deals" className="dl-all" onClick={v.all}>
            See every deal
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          </div>
        </header>

        <div className="dl-main">
          {spot ? (
            <article className="dl-spot" data-deal="1">
              <span className="dl-spot-k">DEAL OF THE DAY</span>
              <div className="dl-spot-art">
                <span className="dl-spot-light" aria-hidden="true" />
                <span className="dl-spot-shadow" aria-hidden="true" />
                {spot.img ? <img src={spot.img} alt="" /> : null}
                <span className="dl-pct dl-stamp">{spot.pct}</span>
              </div>
              <div className="dl-spot-t">
                <span className="dl-grade">{spot.grade}</span>
                <h3 data-no-i18n="">{spot.title}</h3>
              </div>
              <div className="dl-price">
                <span className="dl-old">
                  {spot.old}
                  <i />
                </span>
                <span className="dl-new">
                  <em>AED</em>
                  {spot.price.map((x: any) => (
                    <span key={x.i} className="dl-digit" style={{ animationDelay: x.dl }}>
                      {x.d}
                    </span>
                  ))}
                </span>
              </div>
              <div className="dl-clock" aria-label="Ends in">
                <span className="dl-clock-l">ENDS IN</span>
                <span className="dl-flaps">
                  {spot.clock.map((c: any, i: number) => (
                    <React.Fragment key={i}>
                      {i === 2 || i === 4 ? <b className="dl-colon">:</b> : null}
                      <Tile d={c.d} k={c.k} />
                    </React.Fragment>
                  ))}
                </span>
              </div>
              <div className="dl-stock">
                <span className="dl-stock-bar">
                  <i style={{ ['--k' as string]: spot.bar } as React.CSSProperties} key={spot.left} />
                </span>
                <span className="dl-stock-t">
                  <b key={spot.left}>{spot.left}</b> of 50 left
                </span>
              </div>
              <button type="button" className="dl-add big" onClick={spot.add}>
                Add to cart
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </article>
          ) : (
            <div className="dl-spot" />
          )}

          <div className="dl-right">
            <div className="dl-tabs" role="tablist">
              {(v.tabs || []).map((t: any) => (
                <button key={t.id} type="button" role="tab" aria-selected={t.on} className={t.on ? 'on' : ''} onClick={t.pick}>
                  {t.t}
                </button>
              ))}
            </div>
            <div className="dl-carwrap">
              {/* R6 §10: the rail is a belt that drifts like the hero brand bar, looping seamlessly when there are more cards
                  than fit (static when they all fit); our own controls, no browser scrollbar; pauses on hover and drag */}
              <div
                className="dl-track"
                ref={v.trackRef}
                onMouseEnter={v.hold}
                onMouseLeave={v.free}
                onPointerDown={v.down}
                onPointerMove={v.move}
                onPointerUp={v.up}
                onPointerCancel={v.up}
              >
                <div className="dl-belt" ref={v.beltRef}>
                  {(v.belt || []).map((c: any) => (
                    <article key={c.key} className={'dl-card' + (c.dropping ? ' drop' : '')} data-deal="1" data-card="deal" aria-hidden={c.clone || undefined} style={{ animationDelay: c.dl }}>
                      <span className="dl-pct" key={'p' + c.pct}>
                        {c.pct}
                      </span>
                      <div className="dl-card-art">
                        <span className="dl-card-shadow" aria-hidden="true" />
                        {c.img ? <img src={c.img} alt="" draggable={false} /> : null}
                        <span className="dl-card-sheen" aria-hidden="true" />
                      </div>
                      <span className="dl-grade">{c.grade}</span>
                      <h4 data-no-i18n="">{c.title}</h4>
                      <div className="dl-card-p">
                        <b key={c.price}>{c.price}</b>
                        {c.was ? (
                          <s className="dl-was" key={'w' + c.was}>
                            {c.was}
                            <i />
                          </s>
                        ) : (
                          <s>{c.old}</s>
                        )}
                      </div>
                      <div className="dl-ends">
                        <span>ENDS IN</span>
                        <b>{c.ends}</b>
                      </div>
                      <div className={'dl-card-st' + (c.low ? ' low' : '')}>{c.stock}</div>
                      <button type="button" className="dl-add" tabIndex={c.clone ? -1 : undefined} onClick={c.add}>
                        Add to cart
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </article>
                  ))}
                </div>
              </div>
              {v.loop ? (
                <div className="dl-ctl">
                  <button type="button" aria-label="Previous deals" onClick={v.prev}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 6-6 6 6 6" />
                    </svg>
                  </button>
                  <button type="button" aria-label="Next deals" onClick={v.next}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="dl-below">
          {ship ? (
            <article className="dl-ship">
              <div className="dl-ship-h">
                <div>
                  <span className="dl-k">
                    INCOMING SHIPMENT · <span data-no-i18n="">{ship.id}</span> · SAMPLE
                  </span>
                  <h4>{ship.label}</h4>
                </div>
                <div className="dl-ship-clock">
                  {ship.clock.map((c: any) => (
                    <span key={c.u}>
                      <b>{c.v}</b>
                      <small>{c.u}</small>
                    </span>
                  ))}
                </div>
              </div>
              <div className="dl-mapwrap">
                <svg className="dl-map" viewBox={`0 0 ${M.w} ${M.h}`} aria-hidden="true">
                  <defs>
                    <linearGradient id="dlTrail" gradientUnits="userSpaceOnUse" x1={A[0]} y1={A[1]} x2={plx} y2={ply}>
                      <stop offset="0" stopColor="#F7C032" stopOpacity="0" />
                      <stop offset="1" stopColor="#F7C032" stopOpacity=".95" />
                    </linearGradient>
                  </defs>
                  <path d={M.land} className="dl-land" />
                  <path d={M.borders} className="dl-borders" />
                  <path d={`M${A[0]} ${A[1]} Q${C[0]} ${C[1]} ${B[0]} ${B[1]}`} className="dl-route" />
                  <path d={`M${A[0]} ${A[1]} Q${C[0]} ${C[1]} ${B[0]} ${B[1]}`} className="dl-route-flow" pathLength={1} style={{ ['--p' as string]: prog.toFixed(3) } as React.CSSProperties} />
                  <polyline points={trail.map(([x, y]) => x.toFixed(1) + ',' + y.toFixed(1)).join(' ')} fill="none" stroke="url(#dlTrail)" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx={A[0]} cy={A[1]} r="4" fill="#1F2023" stroke="#F7C032" strokeWidth="1.5" />
                  <circle cx={B[0]} cy={B[1]} r="5" fill="#F7C032" className="dl-dxb" />
                  <text x={A[0]} y={A[1] + 18} textAnchor="middle" className="dl-city">
                    SHENZHEN
                  </text>
                  <text x={B[0]} y={B[1] + 20} textAnchor="middle" className="dl-city">
                    DUBAI · DEIRA
                  </text>
                  <g transform={`translate(${plx.toFixed(1)} ${ply.toFixed(1)}) rotate(${ang.toFixed(1)})`}>
                    <g className="dl-plane">
                      <path d="M-9 0 L6 -1.6 L9 0 L6 1.6 Z M-2 0 L-6 -6 L-3 -6 L3 0 L-3 6 L-6 6 Z M-8 0 L-10 -3 L-8.5 -3 L-6 0 L-8.5 3 L-10 3 Z" fill="#FFFFFF" />
                    </g>
                  </g>
                </svg>
                <span className="dl-eta" style={{ left: ((plx / M.w) * 100).toFixed(2) + '%', top: ((ply / M.h) * 100).toFixed(2) + '%' }}>
                  ETA <b data-no-i18n="">{ship.eta}</b>
                </span>
              </div>
              <div className="dl-ship-bar">
                <i style={{ transform: `scaleX(${prog.toFixed(3)})` }} />
                <span>{ship.pct} of the way</span>
              </div>
              <ol className="dl-stages">
                {ship.stages.map((st: any) => (
                  <li key={st.t} className={(st.on ? 'on' : '') + (st.cur ? ' cur' : '')}>
                    <i />
                    {st.t}
                  </li>
                ))}
              </ol>
              <button type="button" className="dl-notify" onClick={ship.notify}>
                Notify me when it lands
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" />
                </svg>
              </button>
            </article>
          ) : null}
          <article className="dl-pre">
            <div className="dl-ship-h">
              <div>
                <span className="dl-k">PRE-ORDERS · NEXT GENERATION · SAMPLE</span>
                <h4>Reserve the parts before the phones land.</h4>
              </div>
              <span className="dl-wait">
                <b key={v.waiting}>{v.waiting}</b> shops waiting
              </span>
            </div>
            {/* R6 §10: a continuous top → bottom loop, paused on hover */}
            <div className="dl-pre-vp">
              <ul className={(v.pre || []).length > 2 ? 'roll' : ''}>
                {(v.pre || []).concat((v.pre || []).length > 2 ? (v.pre || []).map((p: any) => ({ ...p, k: 'c' + p.k, clone: true })) : []).map((p: any) => (
                  <li key={p.k} aria-hidden={p.clone || undefined}>
                    <span className="dl-sil" aria-hidden="true" />
                    <span className="dl-pre-t">
                      <b data-no-i18n="">{p.model}</b>
                      <small>{p.parts}</small>
                    </span>
                    <button type="button" tabIndex={p.clone ? -1 : undefined} onClick={p.reserve}>
                      Reserve
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const SEHomeDeals = createDC('SE Home Deals', Logic, render);
export default SEHomeDeals;
