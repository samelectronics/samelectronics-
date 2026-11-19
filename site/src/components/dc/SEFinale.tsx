// Finale. Owner (27 Oct): the ending rebuilt at higher quality, keeping the idea (current runs in, the emblem powers up):
// circuits from both edges run into a ring that draws itself around the logo exactly like the loading screen, the logo
// lights, the three promises light one after the other, then the line, the actions and the numbers. It flows straight
// into the footer (same graphite), so the page ends as one piece. Replays on every re-entry. Styles: src/styles/finale.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEFinale.logic.js';

// R11 (owner): the traces run closer together into the ring
// owner (15 Nov): never three lines starting/ending together: each trace starts at its own pad, at its own distance
const LEFT = ['M96 158 H250 L282 136 H468 L522 170 H608', 'M18 214 H190 L214 200 H602', 'M164 266 H240 L272 290 H468 L522 230 H608'];
const mirror = (d: string) => d.replace(/([MHL]) ?(\d+)/g, (m, c, x) => c + (1440 - Number(x)));
const RIGHT = LEFT.map(mirror);
const WORDS = ['QUALITY', 'WARRANTY', 'PRICE'];
const HEAD = ['A', 'phone', 'on', 'your', 'bench?', 'We', 'have', 'the', 'part.'];
const R = 118, C = 2 * Math.PI * R;
const start = (d: string) => { const m = d.match(/^M(\d+) (\d+)/)!; return [Number(m[1]), Number(m[2])]; };

// owner (16 Nov): "cheap: logo circuits, random buttons, too yellow". Rebuilt as a bright product studio: the real 3D
// pallet from Home on a turntable under a soft spotlight, a carton and a single boxed part floating either side, one
// clear headline, three buttons of one family, the stats. Colour order: reviews (graphite) → finale (white) → footer.
// owner (18 Nov): "the page before the footer: the idea is better now but still not professional". A calm white closing
// spread (the colour order is reviews: graphite → finale: white → footer: graphite): the promise on the left with three
// promise cards, the teardown film on the right in a framed studio stage, and a stats band underneath.
const PROMISES: [string, string, string][] = [
  ['01', 'Quality', 'Every part is tested on a bench before it leaves the counter.'],
  ['02', 'Warranty', 'Each grade carries its own warranty, written on the invoice.'],
  ['03', 'Price', 'Fair retail prices, and trade prices for repair shops.'],
];
function render(v: Vals) {
  const head = (v.head || HEAD) as string[], cut = Math.max(1, head.findIndex((w) => /[?؟？]$/.test(w)) + 1);
  return (
    <section ref={v.secRef} id="finale" data-tone="dark" data-screen-label="Finale" className={'fz4 fz5' + (v.on ? ' fz-on' : '')}>
      {/* owner (19 Nov, round 2): "I wanted the logo in the centre coming to life, not in a box": the circuits run in from
          both edges, the ring draws itself and flickers on, light blooms, the logo rises; then the words land, centred */}
      <div className="fz5-hero" aria-hidden="true">
        <svg className="fz5-tr" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid meet">
          {[...LEFT, ...RIGHT].map((d, k) => { const [x, y] = start(d); return (<g key={k} style={{ ['--k' as string]: k % 3 } as React.CSSProperties}><path className="bg" d={d} transform="translate(0 30)" /><path className="run" d={d} pathLength={100} transform="translate(0 30)" /><circle cx={x} cy={y + 30} r="5" /></g>); })}
        </svg>
        <span className="fz6-spot" /><span className="fz6-fog" /><span className="fz6-floor" /><span className="fz5-rays" /><span className="fz5-bloom" /><span className="fz4-flash" />
        <span className="fz5-logo">
          <svg className="fz4-ring fz5-ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" pathLength="100" /></svg>
          <img src="/assets/se-logo-metal-1024.webp" alt="" loading="lazy" decoding="async" />
          <span className="fz5-shine" />
        </span>
      </div>
      <div className="fz5-text">
        <span className="fz4-eb"><i />{WORDS.join(' · ')}<i /></span>
        <h2 className="fz4-h" data-no-i18n="">
          <span className="a">{head.slice(0, cut).map((w, i) => <React.Fragment key={i}><span style={{ ['--i' as string]: i } as React.CSSProperties}>{w}</span>{' '}</React.Fragment>)}</span>{' '}
          <span className="b">{head.slice(cut).map((w, i) => <React.Fragment key={i}><span style={{ ['--i' as string]: i + cut } as React.CSSProperties}>{w}</span>{' '}</React.Fragment>)}</span>
        </h2>
        <p className="fz4-p">Screens, batteries, flex cables and every small part, for every popular model. Tested, graded and ready at the counter in Deira, or shipped to your door.</p>
        <div className="fz4-acts">
          <a href="#offer" onClick={v.browse} className="fz4-btn y">Browse all parts<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
          <button type="button" className="fz4-btn duo" onClick={() => window.dispatchEvent(new CustomEvent('se:chatwith'))}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>Talk to us</button>
          <a href={v.dir} target="_blank" rel="noopener noreferrer" className="fz4-btn ghost">Visit Deira</a>
        </div>
        <div className="fz4-pro">{PROMISES.map(([n, t, d], i) => <span key={n} style={{ ['--i' as string]: i } as React.CSSProperties}><i className="fz6-ic" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={['M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6zM8.5 12l2.5 2.5 4.5-5', 'M12 2.5 14.6 8l5.9.6-4.4 4 1.3 5.8L12 15.4 6.6 18.4l1.3-5.8-4.4-4 5.9-.6z', 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01'][i] || ''} /></svg></i><em>{n}</em><b>{t}</b><small>{d}</small></span>)}</div>
      </div>
      <div className="fz4-stats">
        <span><b><em data-fn="20">20</em>+</b><small>years in Deira</small></span>
        <span><b><em data-fn={v.nB}>{v.nB}</em></b><small>brands</small></span>
        <span><b><em data-fn={v.nM}>{v.nM}</em>+</b><small>phone models</small></span>
        <span><b><em data-fn={v.nP}>{Number(v.nP).toLocaleString('en-US')}</em>+</b><small>parts in stock</small></span>
      </div>
    </section>
  );
}

const SEFinale = createDC('SE Finale', Logic, render);
export default SEFinale;
