// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Brand Logo.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';
import LM from '@/content/logoMetrics.json';

// Logo slot: drop a monochrome SVG at assets/brands/<brand>.svg (it is re-coloured to `color`).
// Until official files arrive, each brand is a typographic stand-in approximating its own wordmark
// (one colour, normalised to the same cap/x-height so all sit at the same visual size and baseline).
const WM = {
  apple: { t: 'Apple', f: "'Inter',sans-serif", w: 600, fs: 0.9, ls: '-.02em' },
  samsung: { t: 'SAMSUNG', f: "'Syncopate',sans-serif", w: 700, fs: 0.74, ls: '.06em' },
  xiaomi: { t: 'Xiaomi', f: "'Nunito',sans-serif", w: 800, fs: 0.92, ls: '-.01em' },
  redmi: { t: 'Redmi', f: "'Poppins',sans-serif", w: 700, fs: 0.86, ls: '-.02em' },
  poco: { t: 'POCO', f: "'Rubik',sans-serif", w: 900, fs: 0.84, ls: '.01em' },
  realme: { t: 'realme', f: "'Comfortaa',sans-serif", w: 700, fs: 1.06, ls: '-.01em' },
  oppo: { t: 'oppo', f: "'Varela Round',sans-serif", w: 400, fs: 1.12, ls: '.03em' },
  vivo: { t: 'vivo', f: "'Quicksand',sans-serif", w: 700, fs: 1.14, ls: '.01em' },
  huawei: { t: 'HUAWEI', f: "'Montserrat',sans-serif", w: 600, fs: 0.8, ls: '.1em' },
  honor: { t: 'HONOR', f: "'Josefin Sans',sans-serif", w: 600, fs: 0.86, ls: '.2em', dy: 0.06 },
  google: { t: 'Google', f: "'Outfit',sans-serif", w: 500, fs: 0.92, ls: '-.01em' },
  tecno: { t: 'TECNO', f: "'Exo 2',sans-serif", w: 800, fs: 0.84, ls: '.03em', st: 'italic' },
  infinix: { t: 'Infinix', f: "'Audiowide',sans-serif", w: 400, fs: 0.82, ls: '.01em' },
  oneplus: { t: 'OnePlus', f: "'Space Grotesk',sans-serif", w: 700, fs: 0.8, ls: '.02em' },
  nokia: { t: 'NOKIA', f: "'Space Grotesk',sans-serif", w: 500, fs: 0.8, ls: '.12em' }
};
class Component extends DCLogic {
  state = { ok: null, ar: 3.2 };
  componentDidMount() { this.check(); }
  componentDidUpdate(pp) { if (pp.brand !== this.props.brand) this.check(); }
  check() {
    const b = this.props.brand || 'apple', C = (window.__seLogo = window.__seLogo || {});
    const url = 'assets/brands/' + b + '.svg';
    if (!C[b]) C[b] = fetch(url).then((r) => (r.ok ? r.text() : null)).then((t) => { if (!t || !/<svg/i.test(t)) return null; const m = t.match(/viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"/); return { ar: m ? Number(m[1]) / Number(m[2]) : 3.2 }; }).catch(() => null);
    C[b].then((v) => { if (this.props.brand === b || !this.props.brand) this.setState({ ok: !!v, ar: v ? v.ar : 3.2 }); });
  }
  renderVals() {
    const b = this.props.brand || 'apple', h = Number(this.props.h) || 26, ok = !!this.state.ok, d = WM[b] || { t: b, f: "'Space Grotesk',sans-serif", w: 600, fs: 0.8, ls: '.04em' };
    const wm = { t: d.t, f: d.f, w: d.w, st: d.st || 'normal', ls: d.ls, fs: Math.round(h * d.fs * 0.82 * 10) / 10, dy: Math.round(h * (d.dy || 0) * 10) / 10 };
    // Urgent 2 · fit="W×H": every logo gets the same visual AREA inside the same invisible box, so a long wordmark (HONOR,
    // HUAWEI) and a short one (OPPO, vivo) carry equal optical weight, and nothing is ever cut off
    // Hero 4 (owner): logos were still different sizes. The SVGs are now trimmed to their ink (scripts/qa/logo-metrics.mjs)
    // and every logo gets the same optical size: equal AREA in its box, then heavier marks (POCO, Samsung) a touch smaller
    // and lighter ones (realme, vivo) a touch larger, by their measured ink density. Same rule everywhere a logo appears.
    const M = LM[b], ar = M ? M.ar : this.state.ar;
    let boxH = h, logoW = Math.round(h * ar);
    { const [FW, FH] = String(this.props.fit || Math.round(h * 4.3) + 'x' + h).split('x').map(Number), A = FW * FH * 0.38, k = 1; /* measured ink density misleads on all-caps marks (SAMSUNG fills its box): equal area on the trimmed ink only */ let w = Math.sqrt(A * ar) * k, hh = w / ar; if (w > FW) { w = FW; hh = w / ar; } if (hh > FH) { hh = FH; w = hh * ar; } boxH = Math.round(hh * 10) / 10; logoW = Math.round(w); }
    return { boxH, label: d.t, color: this.props.color || '#FFFFFF', hasLogo: ok, noLogo: !ok, wm, logoW, mask: "url('/assets/brands/" + b + ".svg') center / 100% 100% no-repeat" };
  }
}

export default Component;
