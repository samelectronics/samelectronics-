// Deals & arrivals (Issue 7): rebuilt 13 Oct 2026. Styles in src/styles/deals.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEHomeDeals.logic.js';

/** Shipment map: the offline world dots (public/se-globe-data.js) projected onto the Shenzhen → Dubai region. */
const MAP = { lon0: 38, lon1: 128, lat0: 6, lat1: 46, w: 520, h: 210 };
const px = (lon: number, lat: number): [number, number] => [((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.w, ((MAP.lat1 - lat) / (MAP.lat1 - MAP.lat0)) * MAP.h];
let dotsCache: [number, number][] | null = null;
function dots() {
  if (dotsCache) return dotsCache;
  const G = (window as unknown as { SE_GLOBE?: { land: number[] } }).SE_GLOBE;
  if (!G) return [];
  const out: [number, number][] = [];
  for (let i = 0; i < G.land.length; i += 2) {
    const lon = G.land[i], lat = G.land[i + 1];
    if (lon >= MAP.lon0 && lon <= MAP.lon1 && lat >= MAP.lat0 && lat <= MAP.lat1) out.push(px(lon, lat));
  }
  return (dotsCache = out);
}
const A = px(114.06, 22.54), B = px(55.3, 25.27), C: [number, number] = [(A[0] + B[0]) / 2, Math.min(A[1], B[1]) - 90];
const bez = (t: number): [number, number] => [(1 - t) * (1 - t) * A[0] + 2 * (1 - t) * t * C[0] + t * t * B[0], (1 - t) * (1 - t) * A[1] + 2 * (1 - t) * t * C[1] + t * t * B[1]];

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
  const [plx, ply] = bez(prog), [pnx, pny] = bez(Math.min(1, prog + 0.01));
  const ang = (Math.atan2(pny - ply, pnx - plx) * 180) / Math.PI;
  const trail = Array.from({ length: 24 }, (_, i) => bez((prog * i) / 23));
  return (
    <section id="deals" ref={v.secRef} className={'dl' + (v.seen ? ' dl-seen' : '')}>
      <div className="dl-in">
        <header className="dl-top">
          <div>
            <span className="dl-eb">
              DEALS & ARRIVALS · {v.live} LIVE · SAMPLE PRICES
            </span>
            <h2 className="dl-h">
              <span>
                <span>Prices drop. Clocks tick.</span>
              </span>
              <span>
                <span>Grab it before the next shop does.</span>
              </span>
            </h2>
          </div>
          <a href="#deals" className="dl-all" onClick={v.all}>
            See every deal
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
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
              <div
                className="dl-track"
                ref={v.trackRef}
                data-hscroll="1"
                onMouseEnter={v.hold}
                onMouseLeave={v.free}
                onPointerDown={v.down}
                onPointerMove={v.move}
                onPointerUp={v.up}
                onPointerCancel={v.up}
              >
                {(v.cards || []).map((c: any) => (
                  <article key={c.key} className="dl-card" data-deal="1" data-card="deal" style={{ animationDelay: c.dl }}>
                    <span className="dl-pct">{c.pct}</span>
                    <div className="dl-card-art">
                      <span className="dl-card-shadow" aria-hidden="true" />
                      {c.img ? <img src={c.img} alt="" draggable={false} /> : null}
                      <span className="dl-card-sheen" aria-hidden="true" />
                    </div>
                    <span className="dl-grade">{c.grade}</span>
                    <h4 data-no-i18n="">{c.title}</h4>
                    <div className="dl-card-p">
                      <b>{c.price}</b>
                      <s>{c.old}</s>
                    </div>
                    <div className="dl-ends">
                      <span>ENDS IN</span>
                      <b>{c.ends}</b>
                    </div>
                    <div className={'dl-card-st' + (c.low ? ' low' : '')}>{c.stock}</div>
                    <button type="button" className="dl-add" onClick={c.add}>
                      Add to cart
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </article>
                ))}
              </div>
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
              <svg className="dl-map" viewBox={`0 0 ${MAP.w} ${MAP.h}`} aria-hidden="true">
                <defs>
                  <linearGradient id="dlTrail" gradientUnits="userSpaceOnUse" x1={A[0]} y1={A[1]} x2={plx} y2={ply}>
                    <stop offset="0" stopColor="#F7C032" stopOpacity="0" />
                    <stop offset="1" stopColor="#FFDB6E" stopOpacity=".95" />
                  </linearGradient>
                </defs>
                {dots().map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="1.6" fill="rgba(255,255,255,.16)" />
                ))}
                <path d={`M${A[0]} ${A[1]} Q${C[0]} ${C[1]} ${B[0]} ${B[1]}`} fill="none" stroke="rgba(247,192,50,.28)" strokeWidth="1.5" strokeDasharray="3 5" />
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
                  <path d="M-9 0 L6 -1.6 L9 0 L6 1.6 Z M-2 0 L-6 -6 L-3 -6 L3 0 L-3 6 L-6 6 Z M-8 0 L-10 -3 L-8.5 -3 L-6 0 L-8.5 3 L-10 3 Z" fill="#FFFFFF" />
                </g>
              </svg>
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
            <ul>
              {(v.pre || []).map((p: any) => (
                <li key={p.k}>
                  <span className="dl-sil" aria-hidden="true" />
                  <span className="dl-pre-t">
                    <b data-no-i18n="">{p.model}</b>
                    <small>{p.parts}</small>
                  </span>
                  <button type="button" onClick={p.reserve}>
                    Reserve
                  </button>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

const SEHomeDeals = createDC('SE Home Deals', Logic, render);
export default SEHomeDeals;
