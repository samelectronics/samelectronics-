// Wholesale, "The Trade Floor" (Issue 8): rebuilt 13 Oct 2026. Styles in src/styles/wholesale.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEWholesale.logic.js';

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

/** Who-we-supply scenes: small animated objects (CSS in wholesale.css). */
function Scene({ k }: { k: string }) {
  if (k === 'rep')
    return (
      <div className="wf-sc wf-sc-rep" aria-hidden="true">
        <span className="ph"><i className="scr" /></span>
        <span className="drv"><i /></span>
      </div>
    );
  if (k === 'trd')
    return (
      <div className="wf-sc wf-sc-trd" aria-hidden="true">
        <span className="tag"><i className="hole" /><b className="p1">AED 96</b><b className="p2">AED 84</b></span>
        <span className="str" />
      </div>
    );
  if (k === 'exp')
    return (
      <div className="wf-sc wf-sc-exp" aria-hidden="true">
        <svg viewBox="0 0 200 110">
          <path d="M20 92 Q100 -6 180 70" className="arc" />
          <g className="pl">
            <path d="M-8 0 L6 -1.5 L8 0 L6 1.5 Z M-2 0 L-6 -6 L-3 -6 L3 0 L-3 6 L-6 6 Z" />
            <animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto" path="M20 92 Q100 -6 180 70" />
          </g>
        </svg>
        <span className="box"><i /></span>
      </div>
    );
  return (
    <div className="wf-sc wf-sc-blk" aria-hidden="true">
      <span className="clip">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="ln" style={{ ['--i' as string]: i } as React.CSSProperties}>
            <i />
            <b />
          </span>
        ))}
      </span>
    </div>
  );
}

function Carton({ c }: { c: any }) {
  const x = c.col * 118 + (c.back ? 26 : 0), y = 312 - (c.layer + 1) * 86 - (c.back ? 18 : 0) - 18;
  return (
    <div className={'wf-ct' + (c.drop ? ' drop' : '')} style={{ left: x, top: y, zIndex: c.z, animationDelay: c.dl }}>
      <i className="t" />
      <i className="s" />
      <i className="f">
        {!c.back ? (
          <span className="lbl">
            <b>{c.code}</b>
            <em />
          </span>
        ) : null}
      </i>
      {c.drop ? <span className="dust" style={{ animationDelay: c.dl }} /> : null}
    </div>
  );
}

function render(v: Vals) {
  const tape = (
    <span className="wf-tape-t">
      {Array.from({ length: 6 }, (_, i) => (
        <React.Fragment key={i}>
          <b>{TAPE}</b>
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
              <span className="wf-k dim">SAMPLE TRADE PRICES</span>
            </div>
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
                {v.qty} <small>units</small>
              </b>
            </label>
            <input
              className="wf-range"
              type="range"
              min={10}
              max={500}
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
              <span>You keep</span>
              <b ref={v.keepRef}>{v.keepInit}</b>
            </div>
          </div>

          <div className="wf-floor">
            <span className="wf-pool" aria-hidden="true" />
            <div className="wf-stage" aria-label={v.n + ' cartons on the pallet'}>
              <div className="wf-pallet">
                <span className="wf-cshadow" aria-hidden="true" />
                <i className="deck" />
                <i className="deck2" />
                <i className="blk b1" />
                <i className="blk b2" />
                <i className="blk b3" />
              </div>
              <div className="wf-stack">
                {v.seen ? (v.cartons || []).map((c: any) => <Carton key={c.key} c={c} />) : null}
                {v.full ? (
                  <div className="wf-wrap" aria-hidden="true">
                    <i className="sp" />
                    <i className="sh" />
                  </div>
                ) : null}
                {v.full ? (
                  <div className="wf-label">
                    <b>SE-2611</b>
                    <span>Ready to ship from Deira.</span>
                    <em aria-hidden="true" />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="wf-floor-cap">
              <span>
                <b>{v.n}</b> cartons on the pallet
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
                <i className="node">{i + 1}</i>
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
          TRADE TICKER · SAMPLE
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
        <p className="wf-note">* Sample figures, to be confirmed. Trade prices shown are samples.</p>
      </div>
    </section>
  );
}

const SEWholesale = createDC('SE Wholesale', Logic, render);
export default SEWholesale;
