// Finale. Owner (27 Oct): the ending rebuilt at higher quality, keeping the idea (current runs in, the emblem powers up):
// circuits from both edges run into a ring that draws itself around the logo exactly like the loading screen, the logo
// lights, the three promises light one after the other, then the line, the actions and the numbers. It flows straight
// into the footer (same graphite), so the page ends as one piece. Replays on every re-entry. Styles: src/styles/finale.css.
'use client';
import React from 'react';
import { type Vals, createDC } from '@/dc/runtime';
import Logic from './SEFinale.logic.js';
import FinaleRoom from './FinaleRoom';

const FR = Array.from({ length: 24 }, (_, i) => '/assets/pose/film-' + String(i * 2).padStart(2, '0') + '-480.webp');
/** the teardown film, slowly opening and closing while the finale is on screen */
function FinaleFilm({ on }: { on: boolean }) {
  const [f, setF] = React.useState(0);
  React.useEffect(() => { if (!on) return; FR.forEach((x) => { const i = new Image(); i.src = x; }); let t = 0; const id = window.setInterval(() => { t++; const n = FR.length, cyc = n * 2 + 24, p = t % cyc; setF(p < n ? p : p < n + 12 ? n - 1 : p < n * 2 + 12 ? n * 2 + 11 - p : 0); }, 90); return () => window.clearInterval(id); }, [on]);
  return <img className="fz3-film" src={FR[f]} alt="" />;
}

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
function render(v: Vals) {
  const head = (v.head || HEAD) as string[], cut = Math.max(1, head.findIndex((w) => /[?؟？]$/.test(w)) + 1);
  return (
    <section ref={v.secRef} id="finale" data-tone="dark" data-screen-label="Finale" className={'fz2 fz3s' + (v.on ? ' fz-on' : '')}>
      <div className="fz2-light" aria-hidden="true" />
      <div className="fz2-in">
        <span className="fz2-eb">{WORDS.join(' · ')}</span>
        <h2 className="fz2-h" data-no-i18n="">
          <span className="a">{head.slice(0, cut).map((w, i) => <span key={i} style={{ ['--i' as string]: i } as React.CSSProperties}>{w} </span>)}</span>
          <span className="b">{head.slice(cut).map((w, i) => <span key={i} style={{ ['--i' as string]: i + cut } as React.CSSProperties}>{w} </span>)}</span>
        </h2>
        {/* owner (17 Nov): "what the hell is this footer": the ending is a graphite film stage now: the teardown film plays
            on a glowing floor with light beams crossing, like the teardown ad */}
        <div className="fz2-stage fz3" aria-hidden="true">
          <i className="fz3-ray a" /><i className="fz3-ray b" /><i className="fz3-ray c" />
          <span className="fz2-floor" />
          <FinaleFilm on={!!v.on} />
        </div>
        <div className="fz2-acts">
          <a href="#offer" onClick={v.browse} className="fz2-btn y">Browse all parts<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
          <button type="button" className="fz2-btn duo" onClick={() => window.dispatchEvent(new CustomEvent('se:chatwith'))}><span className="duo-ic" aria-hidden="true"><i className="ct-ic wa" /><i className="ct-ic wc" /></span>Talk to us</button>
          <a href={v.dir} target="_blank" rel="noopener noreferrer" className="fz2-btn">Visit Deira</a>
        </div>
        <div className="fz2-stats">
          <span><b><em data-fn="20">20</em>+</b><small>years in Deira</small></span>
          <span><b><em data-fn="14">14</em></b><small>brands</small></span>
          <span><b><em data-fn="9000">9,000</em>+</b><small>parts in stock</small></span>
        </div>
      </div>
    </section>
  );
}

const SEFinale = createDC('SE Finale', Logic, render);
export default SEFinale;
