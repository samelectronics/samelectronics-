// Wholesale, "The Trade Floor" (Issue 8): rebuilt 13 Oct 2026. Styles in src/styles/wholesale.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEWholesale.logic.js';
import DotGlobe from '@/components/home/DotGlobe';
import PalletDrop from '@/components/home/PalletDrop';
import RepairFlip from '@/components/home/RepairFlip';
import { PALLET_CELLS, PALLET_FRAME } from '@/content/palletCells';

const PL = (l: string) => `/assets/pallet/${l}-600.webp`;
const PL2 = (l: string) => `/assets/pallet/${l}-1200.webp`;

const TAPE = 'SAM ELECTRONICS · WHOLESALE · TRADE';

/** Partner card texture: the offline world dots (public/se-globe-data.js), equirectangular, very faint. */
let mapCache: React.ReactNode = null;
function WorldDots() {
  if (mapCache) return mapCache;
  const G = (typeof window !== 'undefined' ? (window as unknown as { SE_GLOBE?: { land: number[] } }).SE_GLOBE : null);
  if (!G) return null;
  const c: React.ReactNode[] = [];
  for (let i = 0; i < G.land.length; i += 2) {
    const lon = G.land[i], lat = G.land[i + 1];
    if (lat < -56) continue;
    c.push(<circle key={i} cx={(((lon + 180) / 360) * 720).toFixed(1)} cy={(((84 - lat) / 140) * 280).toFixed(1)} r="2.2" />);
  }
  return (mapCache = (
    <svg viewBox="0 0 720 280" preserveAspectRatio="xMidYMid slice">
      {c}
    </svg>
  ));
}

/** Small flags for the trade ticker (simplified, 18×12). */
const FLAGS: Record<string, React.ReactNode> = {
  NG: (<><rect width="6" height="12" fill="#008751" /><rect x="6" width="6" height="12" fill="#fff" /><rect x="12" width="6" height="12" fill="#008751" /></>),
  KE: (<><rect width="18" height="12" fill="#000" /><rect y="4" width="18" height="4" fill="#BB0000" /><rect y="3.4" width="18" height=".6" fill="#fff" /><rect y="8" width="18" height=".6" fill="#fff" /><rect y="8.6" width="18" height="3.4" fill="#006600" /><ellipse cx="9" cy="6" rx="1.6" ry="3.2" fill="#BB0000" stroke="#000" strokeWidth=".5" /></>),
  JO: (<><rect width="18" height="4" fill="#000" /><rect y="4" width="18" height="4" fill="#fff" /><rect y="8" width="18" height="4" fill="#007A3D" /><path d="M0 0 L8 6 L0 12Z" fill="#CE1126" /></>),
  IQ: (<><rect width="18" height="4" fill="#CE1126" /><rect y="4" width="18" height="4" fill="#fff" /><rect y="8" width="18" height="4" fill="#000" /><rect x="5" y="5.4" width="8" height="1.2" rx=".4" fill="#007A3D" /></>),
  OM: (<><rect width="18" height="12" fill="#fff" /><rect y="4" width="18" height="4" fill="#DB161B" /><rect y="8" width="18" height="4" fill="#008000" /><rect width="5" height="12" fill="#DB161B" /></>),
  UG: (<>{['#000', '#FCDC04', '#D90000', '#000', '#FCDC04', '#D90000'].map((c, i) => <rect key={i} y={i * 2} width="18" height="2" fill={c} />)}<circle cx="9" cy="6" r="2.4" fill="#fff" /></>),
  LB: (<><rect width="18" height="12" fill="#ED1C24" /><rect y="3" width="18" height="6" fill="#fff" /><path d="M9 3.6 L11.6 8.2 H6.4Z" fill="#00A651" /></>),
  GH: (<><rect width="18" height="4" fill="#CE1126" /><rect y="4" width="18" height="4" fill="#FCD116" /><rect y="8" width="18" height="4" fill="#006B3F" /><path d="M9 4.4 l.9 2.4 h-2.4 l1.9-1.5 -.7 2.4z" fill="#000" /></>),
};
const TICK: [string, string, string, string][] = [
  ['NG', 'Repair shop · Lagos', 'iPhone 13 Incell screens', '× 80'],
  ['KE', 'Trader · Nairobi', 'Galaxy A54 batteries', '× 120'],
  ['JO', 'Shop · Amman', 'Redmi Note 13 screens', '× 40'],
  ['IQ', 'Exporter · Baghdad', 'Charging flex mix', '× 300'],
  ['OM', 'Repair shop · Muscat', 'iPhone 15 back covers', '× 25'],
  ['UG', 'Trader · Kampala', 'Tecno Camon 30 screens', '× 60'],
  ['LB', 'Shop · Beirut', 'iPhone 11 batteries', '× 50'],
  ['GH', 'Distributor · Accra', 'Infinix Note 40 screens', '× 90'],
];

const WHO: [string, string, string][] = [
  ['rep', 'Repair shops', 'Grade-labelled parts, tested before they ship.'],
  ['trd', 'Traders', 'Trade prices that drop as your order grows.'],
  ['exp', 'Exporters', 'Packed and invoiced for export from Deira.'],
  ['blk', 'Bulk buyers', 'Send a bulk list, get a quote the same day.'],
];

/** Who-we-supply scenes. Owner (27 Oct): ONE look for all four, the same real renders as the hero (standard stage),
 *  each the same size in its card, each with one small live motion. */
const pose = (id: string) => (typeof window !== 'undefined' && (window as unknown as { SE_SHOTS?: { url: (i: string, w: number) => string } }).SE_SHOTS ? (window as unknown as { SE_SHOTS: { url: (i: string, w: number) => string } }).SE_SHOTS.url(id, 480) : '');
function Scene({ k }: { k: string }) {
  if (k === 'rep')
    return (
      <div className="wf-sc wf-sc3" aria-hidden="true">
        <div className="wf-sc3-film"><RepairFlip w={480} zoom={1.5} /></div>
      </div>
    );
  if (k === 'trd')
    return (
      <div className="wf-sc wf-sc3 wf-sc3-trd" aria-hidden="true">
        <img className="wf-sc3-img" src="/assets/pallet/single-600.webp" alt="" />
        <span className="tag"><i className="hole" /><b className="p1">AED 96</b><b className="p2">AED 84</b></span>
        <span className="str" />
      </div>
    );
  if (k === 'exp')
    return (
      <div className="wf-sc wf-sc3 wf-sc3-exp" aria-hidden="true">
        <DotGlobe size={150} speed={9} />
        <svg viewBox="0 0 200 150" className="wf-sc3-fly">
          <path d="M18 120 Q100 -10 182 96" className="arc" />
          <g className="pl">
            <path d="M-8 0 L6 -1.5 L8 0 L6 1.5 Z M-2 0 L-6 -6 L-3 -6 L3 0 L-3 6 L-6 6 Z" />
            <animateMotion dur="4.2s" repeatCount="indefinite" rotate="auto" path="M18 120 Q100 -10 182 96" />
          </g>
        </svg>
      </div>
    );
  return (
    <div className="wf-sc wf-sc3" aria-hidden="true">
      <PalletDrop style={{ position: 'absolute', left: '50%', top: '50%', width: '190px', transform: 'translate(-50%, -50%)' }} />
      <em className="qstamp">QUOTED</em>
    </div>
  );
}

/** R6 §12: one real carton render, placed on its cell of the isometric pallet (scripts/palletfilm) */
function Carton({ c }: { c: any }) {
  const cell = PALLET_CELLS[c.i] || PALLET_CELLS[0];
  return (
    <img
      className={'wf-ct3' + (c.drop ? ' drop' : '')}
      src={PL('carton')}
      srcSet={PL('carton') + ' 1x, ' + PL2('carton') + ' 2x'}
      alt=""
      draggable={false}
      style={{ ['--x' as string]: ((cell.dx / PALLET_FRAME.w) * 100).toFixed(3) + '%', ['--y' as string]: ((cell.dy / PALLET_FRAME.h) * 100).toFixed(3) + '%', zIndex: 10 + cell.z, animationDelay: c.dl } as React.CSSProperties}
    />
  );
}

function render(v: Vals) {
  const tape = (
    <span className="wf-tape-t">
      {Array.from({ length: 12 }, (_, i) => (
        <React.Fragment key={i}>
          <b>{v.tape || TAPE}</b>
          <i>◆</i>
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <section id="wholesale" ref={v.secRef} data-tone="light" data-screen-label="09 Wholesale" className={'wf' + (v.seen ? ' wf-seen' : '')}>
      <div className="wf-grain" aria-hidden="true" />
      <div className="wf-vig" aria-hidden="true" />
      <svg className="wf-circ" viewBox="0 0 1440 2000" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M22 700 V980 L40 998 V1300" />
        <path d="M1418 640 V880 L1400 898 V1160" />
        <circle cx="40" cy="1300" r="3.5" />
        <circle cx="1400" cy="1160" r="3.5" />
      </svg>

      {/* tape across the top edge */}
      <div className="wf-tape" aria-hidden="true" data-no-i18n="">
        <div className="wf-tape-in">
          {tape}
          <span className="wf-glint" />
        </div>
      </div>

      <div className="wf-in">
        <header className="wf-top">
          <div className="wf-tl">
            <span className="wf-eb">WHOLESALE & TRADE</span>
            <div className="wf-hrow">
              <h2 className="wf-h">
                <span>
                  <span>Stock up.</span>
                </span>
                <span>
                  <span>Cost down.</span>
                </span>
              </h2>
              <span className="wf-stamp">TRADE ONLY</span>
            </div>
          </div>
          <div className="wf-tr">
            <p>Repair shops, traders and exporters buy at trade prices once their account is approved. Send a bulk list and we quote it the same day.</p>
            <div className="wf-ctas">
              <a href="#wholesale" className="wf-btn dark" onClick={v.apply}>
                Apply for a trade account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a href={v.wa} target="_blank" rel="noopener noreferrer" className="wf-btn line">
                Send a bulk list
              </a>
            </div>
          </div>
        </header>

        <div className="wf-nums">
          <div>
            <small>SINCE</small>
            <b data-n="2003" data-from="1980">{v.seen ? '1980' : '2003'}</b>
            <span>Trading in Deira</span>
          </div>
          <div>
            <small>COUNTRIES*</small>
            <b>
              <span data-n={v.countries}>{v.seen ? '0' : v.countries}</span>+
            </b>
            <span>Shipped from Dubai</span>
          </div>
          <div>
            <small>QUOTES</small>
            <b className="wf-sd">Same-day</b>
            <span>On every bulk list</span>
          </div>
          <div>
            <small>MIN. ORDER*</small>
            <b>
              <span data-n={v.tradeMin}>{v.seen ? '0' : v.tradeMin}</span>
            </b>
            <span>Units per part</span>
          </div>
        </div>

        {/* ---------- the Pallet Builder ---------- */}
        <div className="wf-pb">
          <div className="wf-ctl">
            <div className="wf-ctl-h">
              <span className="wf-k">PALLET BUILDER</span>
              <span className="wf-k dim">TRADE PRICES</span>
            </div>
            {/* R6 §12: search the whole catalogue */}
            <div className="wf-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input type="search" value={v.search?.q || ''} onChange={v.search?.on} onFocus={v.search?.focus} onBlur={v.search?.blur} placeholder="Search any part: model, part, quality" aria-label="Search any part" />
              {v.search?.open ? (
                <ul className="wf-hits" role="listbox">
                  {(v.search.hits || []).length ? (
                    v.search.hits.map((h: any) => (
                      <li key={h.id}>
                        <button type="button" onMouseDown={h.pick}>
                          <span className="th">{h.img ? <img src={h.img} alt="" /> : null}</span>
                          <b data-no-i18n="">{h.name}</b>
                          <small>{h.grade}</small>
                          <em>{h.price}</em>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="none">No match. Ask us on WhatsApp.</li>
                  )}
                </ul>
              ) : null}
            </div>
            {v.hasRecent ? <span className="wf-recent-h">Your recent searches</span> : <span className="wf-recent-h">Search a model above to build your pallet</span>}
            <div className="wf-chips" role="radiogroup" aria-label="Part">
              {(v.parts || []).map((p: any) => (
                <button key={p.id} type="button" role="radio" aria-checked={p.on} className={p.on ? 'on' : ''} onClick={p.pick}>
                  <span className="th">{p.img ? <img src={p.img} alt="" /> : null}</span>
                  <span className="nm">
                    <b data-no-i18n="">{p.name}</b>
                    <small>{p.grade}</small>
                  </span>
                </button>
              ))}
            </div>
            <label className="wf-qty">
              <span>Quantity</span>
              <b>
                {v.qtyTxt} <small>units</small>
              </b>
            </label>
            <input
              className="wf-range"
              type="range"
              min={10}
              max={v.maxQ}
              step={10}
              value={v.qty}
              onChange={v.setQty}
              aria-label="Quantity"
              style={{ ['--f' as string]: v.fill } as React.CSSProperties}
            />
            <ol className="wf-tiers">
              {(v.tiers || []).map((t: any) => (
                <li key={t.key} className={(t.on ? 'on' : '') + (t.past ? ' past' : '')}>
                  <b>{t.k}</b>
                  <span>{t.unit}</span>
                  <small>per unit</small>
                </li>
              ))}
            </ol>
            <div className="wf-unit">
              <span>Your unit price</span>
              <b>
                <em>AED</em>
                {(v.unitDigits || []).map((d: any, i: number) => (
                  <span key={d.k} className="wf-dg" style={{ animationDelay: i * 0.05 + 's' }}>
                    {d.d}
                  </span>
                ))}
              </b>
            </div>
            <div className="wf-tot">
              <div>
                <small>RETAIL TOTAL</small>
                <b>{v.retail}</b>
              </div>
              <div className="tr">
                <small>TRADE TOTAL</small>
                <b>{v.trade}</b>
              </div>
            </div>
            <div className="wf-keep">
              {/* reviewer's idea: the savings meter swings into the green as the order grows */}
              {/* owner (27 Oct): a proper savings gauge (graded scale, tick marks, a machined needle), not a flat grey half-circle */}
              <svg className="wf-meter" viewBox="0 0 120 70" aria-hidden="true">
                <defs>
                  <linearGradient id="wfMg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#E5484D" /><stop offset=".45" stopColor="#F7C032" /><stop offset="1" stopColor="#2BB673" /></linearGradient>
                  <linearGradient id="wfNd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8E939A" /><stop offset=".5" stopColor="#F2F3F5" /><stop offset="1" stopColor="#8E939A" /></linearGradient>
                </defs>
                <path d="M12 62 A48 48 0 0 1 108 62" className="trk" />
                <path d="M12 62 A48 48 0 0 1 108 62" stroke="url(#wfMg)" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".9" />
                {Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (1 - i / 8), r0 = 36, r1 = i % 2 ? 39 : 41; return <path key={i} d={`M${(60 + Math.cos(a) * r0).toFixed(1)} ${(62 - Math.sin(a) * r0).toFixed(1)} L${(60 + Math.cos(a) * r1).toFixed(1)} ${(62 - Math.sin(a) * r1).toFixed(1)}`} className="tk" />; })}
                <g style={{ transform: `rotate(${v.meter?.ang || -80}deg)` }} className="ndl">
                  <path d="M58.6 62 L60 22 L61.4 62 Z" fill="url(#wfNd)" stroke="#26282B" strokeWidth=".6" />
                  <circle cx="60" cy="62" r="6" fill="#26282B" />
                  <circle cx="60" cy="62" r="2.4" fill="#F7C032" />
                </g>
              </svg>
              <span>You keep</span>
              <b ref={v.keepRef}>{v.keepInit}</b>
            </div>
            {/* owner (27 Oct): several models in one request, sent to WhatsApp as one message; above 1,000 units it is a quote */}
            {v.enq ? <p className="wf-enq">Above 1,000 units we quote you directly: send the request on WhatsApp.</p> : null}
            <div className="wf-list">
              {(v.list || []).map((it: any) => (
                <span key={it.k} className="wf-li"><b data-no-i18n="">{it.name}</b><small>{it.grade} · × {it.qty}</small><button type="button" onClick={it.del} aria-label="Remove">×</button></span>
              ))}
              <div className="wf-li-acts">
                <button type="button" className="wf-add" onClick={v.addLine}>+ Add to request</button>
                <a className="wf-send" href={v.send} target="_blank" rel="noopener">Send request on WhatsApp</a>
              </div>
              <p className="wf-acct">This is a preview of our trade tools. For the full trade catalogue and live trade prices, <a href="#wholesale" onClick={v.apply}>apply for an approved trade account</a>.</p>
            </div>
          </div>

          <div className="wf-floor">
            <span className="wf-pool" aria-hidden="true" />
            {/* the warehouse row: every full pallet glides back here */}
            <div className="wf-row" aria-hidden="true">
              {(v.row || []).map((i: number) => (
                <img key={(v.rowN || 0) - i} src={PL('full')} alt="" style={{ ['--i' as string]: i } as React.CSSProperties} />
              ))}
            </div>
            <div className="wf-stage3" key={'p' + v.rowN} data-roll={v.roll ? '1' : undefined} aria-label={v.n + ' cartons on the pallet'}>
              <img className="wf-pal3" src={PL('pallet')} srcSet={PL('pallet') + ' 1x, ' + PL2('pallet') + ' 2x'} alt="" draggable={false} />
              {v.seen && !v.full ? (v.cartons || []).map((c: any) => <Carton key={c.key} c={c} />) : null}
              {v.full ? (
                <>
                  <img className="wf-full3" src={PL('full')} srcSet={PL('full') + ' 1x, ' + PL2('full') + ' 2x'} alt="" draggable={false} />
                  <span className="wf-filmshine" aria-hidden="true" />
                </>
              ) : null}
            </div>
            {v.roll ? <span className="wf-fork" key={'f' + v.roll} aria-hidden="true" /> : null}
            {v.roll ? <img className="wf-going" key={'g' + v.roll} src={PL('full')} alt="" aria-hidden="true" /> : null}
            <div className="wf-floor-cap">
              <span>
                <b>{v.n}</b> cartons on the pallet · <b>{v.pallets}</b> pallets
              </span>
              <span>{v.full ? 'Pallet full · wrapped · ready to ship' : 'Packed in Deira'}</span>
            </div>
          </div>
        </div>

        {/* ---------- who we supply ---------- */}
        <div className="wf-who">
          <span className="wf-eb">WHO WE SUPPLY</span>
          <div className="wf-who-g">
            {WHO.map(([k, t, d]) => (
              <article key={k} className="wf-card">
                <Scene k={k} />
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>

        {/* ---------- how trade works ---------- */}
        <div className="wf-how">
          <span className="wf-eb">HOW TRADE WORKS</span>
          <ol className="wf-steps">
            {['Apply', 'Get approved', 'Order at trade prices'].map((t, i) => (
              <li key={t} style={{ ['--i' as string]: i } as React.CSSProperties}>
                <i className="node">
                  {i + 1}
                  <span className="ring" aria-hidden="true" />
                </i>
                <b>{t}</b>
                {i < 2 ? <span className="wire" /> : null}
              </li>
            ))}
            <li className="end" style={{ ['--i' as string]: 3 } as React.CSSProperties}>
              <a href="#wholesale" className="wf-btn dark" onClick={v.apply}>
                Apply for a trade account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </li>
          </ol>
        </div>
      </div>

      {/* ---------- trade ticker (full width) ---------- */}
      <div className="wf-tick">
        <span className="wf-tick-k">
          <i />
          TRADE TICKER
        </span>
        <div className="wf-tick-vp">
          <div className="wf-tick-row">
            {[0, 1].map((r) => (
              <React.Fragment key={r}>
                {TICK.map(([cc, who, what, q]) => (
                  <span key={r + cc} className="wf-tick-i" aria-hidden={r === 1 ? true : undefined}>
                    <svg width="18" height="12" viewBox="0 0 18 12" className="flag" aria-hidden="true">
                      {FLAGS[cc]}
                    </svg>
                    <small>{who}</small>
                    <span data-no-i18n="">{what}</span>
                    <b>{q}</b>
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
          <span className="wf-fade l" aria-hidden="true" />
          <span className="wf-fade r" aria-hidden="true" />
        </div>
      </div>

      <div className="wf-in">
        <div className="wf-partner">
          <div className="wf-map" aria-hidden="true">
            <WorldDots />
          </div>
          <div className="wf-partner-t">
            <span className="wf-k">PARTNER WITH US</span>
            <h3>Your country. Our parts.</h3>
            <p>Distributors and resellers abroad: become a Sam Electronics partner in your country.</p>
          </div>
          <a href="#wholesale" className="wf-btn yel" onClick={v.partner}>
            Become a partner
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

const SEWholesale = createDC('SE Wholesale', Logic, render);
export default SEWholesale;
