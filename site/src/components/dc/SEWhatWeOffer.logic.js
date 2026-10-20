// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE What We Offer.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';
import { registerScene, loseContexts } from '@/dc/gl-budget';

class Component extends DCLogic {
  state = { data: window.SE_DATA || null };
  root = React.createRef(); host = React.createRef();
  hv = new Array(8).fill(0); hvT = new Array(8).fill(0); hvAt = new Array(8).fill(-9); ck = {}; ov = {}; _q = {}; lastT = 0;
  FAM = [['Screens', 'SCR', 0], ['Frames & housings', 'FRM', 1], ['Flex cables', 'FLX', 2], ['Logic boards', 'SML:0', 3], ['Batteries', 'BAT', 4], ['Cameras', 'CAM', 5], ['Small parts', 'SML:1', 6], ['Back glass', 'BCV', 7]];
  componentDidMount() {
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 60);
    this.alive = true; this.initDust();
    // G16: the 3D shelf holds a WebGL context only while the section is near the viewport (src/dc/gl-budget.ts);
    // when far away it is released and the cached library pictures stand in.
    this.unreg = registerScene({ id: 'offer-shelf', el: () => this.root.current || this.host.current, mount: async () => { await this.mountShelf(); return () => this.unmountShelf(); } });
    // R6 Part A: visibility comes from an IntersectionObserver; the loop used to measure the section every frame for the whole visit (a forced layout per frame: the biggest cost while scrolling)
    this.near = false; this.nearIO = new IntersectionObserver(([e]) => { this.near = e.isIntersecting; }, { rootMargin: '25% 0px 25% 0px' }); setTimeout(() => this.root.current && this.nearIO.observe(this.root.current), 50);
    const loop = () => { if (!this.alive) return; if (!this.near) { this._raf = requestAnimationFrame(loop); return; } try { this.frame(performance.now() / 1000); } catch (e) { if (!this._fe) { this._fe = 1; console.warn('[What we offer]', e); } } this._raf = requestAnimationFrame(loop); }; loop();
    window.seWwo = { at: (b, t) => { this.ov[b] = t; this.frame(performance.now() / 1000); }, hover: (i) => { this.hvT.fill(0); this.hv.fill(0); if (i != null && i >= 0) { this.hvT[i] = 1; this.hv[i] = 1; this.hvAt[i] = performance.now() / 1000 - 0.7; } this.frame(performance.now() / 1000); }, clear: () => { this.ov = {}; }, gl: () => this.glCanvas };
  }
  componentDidUpdate() { this._q = {}; }
  componentWillUnmount() { this.nearIO && this.nearIO.disconnect(); this.alive = false; cancelAnimationFrame(this._raf); clearInterval(this.dIv); clearTimeout(this.fbT); try { this.unreg && this.unreg(); } catch (e) {} }
  unmountShelf() { clearTimeout(this.fbT); try { this.mo && this.mo.disconnect(); this.disp && this.disp(); } catch (e) {} const h = this.host.current; if (h) { loseContexts(h); h.querySelectorAll('canvas').forEach((c) => c.remove()); } this.mo = null; this.disp = null; this.api = null; this.glCanvas = null; this.scr = null; this.fallback(); }
  q(k) { const c = this._q[k]; if (c && c.isConnected) return c; const R = this.root.current; return (this._q[k] = R ? R.querySelector('[data-w="' + k + '"]') : null); }
  async mountShelf() {
    const h = this.host.current; if (!h) return; const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'; h.appendChild(cv);
    this.fbT = setTimeout(() => { if (!this.api) this.fallback(); }, 30000);
    try { const mod = await import(/* webpackIgnore: true */ new URL('./se-teardown-3d.js', location.href).href); const st = { shelf: true, p: 0.185, snap: true, mob: false, oT: null, lib: true }; st.onShelf = (api) => { this.api = api; };
      this.disp = await mod.mount(h, st); this.api = this.api || st.shelfApi;
      const keep = () => { const cs = Array.from(h.querySelectorAll('canvas')); this.glCanvas = cs.find((c) => { try { return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }) || cv; Array.from(h.children).forEach((c) => { if (c !== this.glCanvas) c.style.display = 'none'; }); this.glCanvas.style.display = 'block'; };
      keep(); this.mo = new MutationObserver(keep); this.mo.observe(h, { childList: true });
      if (this.api) { this.scr = document.createElement('canvas'); this.scr.width = 600; this.scr.height = 1300; this.api.setScreen(this.scr); this.FAM.forEach((f, i) => { const im = this.q('fb' + i); if (im) im.style.display = 'none'; }); } else this.fallback();
    } catch (e) { console.warn('[What we offer] 3D shelf failed', e); this.fallback(); }
  }
  fallback() { const lib = window.seParts && window.seParts.peek && window.seParts.peek(); if (!lib || !lib.large) { if (window.seParts) window.seParts.get().then(() => this.fallback()); return; } this.FAM.forEach((f, i) => { const im = this.q('fb' + i); if (im) { im.src = lib.large[f[2]]; im.style.display = 'block'; } }); }
  initDust() { let sd = 9; const r = () => ((sd = (sd * 16807) % 2147483647) / 2147483647); this.dust = Array.from({ length: 70 }, () => ({ x: r(), y: r(), z: r(), s: 0.6 + r() * 1.1, a: 0.1 + r() * 0.2, vx: (r() - 0.5) * 6, vy: 2 + r() * 5, ph: r() * 6 }));
    sd = 21; this.cr = Array.from({ length: 11 }, (_, k) => { let a = (-110 + k * 22 + r() * 10) * Math.PI / 180, x = 0.24, y = 0.8; const pts = [[x, y]]; const n = 4 + Math.floor(r() * 4); for (let j = 0; j < n; j++) { a += (r() - 0.5) * 0.5; const l = 0.05 + r() * 0.09; x += Math.cos(a) * l * 0.9; y += Math.sin(a) * l * 0.42; pts.push([x, y]); if (x < 0 || x > 1 || y < 0 || y > 1) break; } return { pts, o: k / 10 }; }); }
  // 14 Oct (H-G3): the 3D canvas used to be sticky to the screen, so on every scroll the cards moved at once while the
  // parts waited for the next WebGL frame: they rode along with the scroll, then snapped back. The canvas now sits IN the
  // page over the region whose parts are on screen (the parts grid, or the Repair box's phone), so the browser scrolls
  // the rendered parts together with their cards. It only moves between regions while the other one is off-screen.
  placeHost(vh) { const h = this.host.current, R = this.root.current; if (!h || !R) return; const rr = R.getBoundingClientRect();
    const box = (els, pad) => { let t = 1e9, b = -1e9; els.forEach((e) => { if (!e) return; const r = e.getBoundingClientRect(); if (r.height) { t = Math.min(t, r.top); b = Math.max(b, r.bottom); } }); return t < b ? { t: t - pad, b: b + pad } : null; };
    const A = box(this.FAM.map((_, i) => this.q('slot' + i)), 60), Rb = box([this.q('Rslot')], 90);
    const vis = (g) => (g ? Math.max(0, Math.min(g.b, vh) - Math.max(g.t, 0)) : -1), g = vis(Rb) > vis(A) ? Rb : A; if (!g) return;
    const top = Math.round(g.t - rr.top), hh = Math.round(g.b - g.t);
    if (this._hostT !== top || this._hostH !== hh) { this._hostT = top; this._hostH = hh; h.style.top = top + 'px'; h.style.height = hh + 'px'; } }
  // ---------- per-frame engine ----------
  frame(T) {
    const R = this.root.current; if (!R) return; const dt = Math.min(0.05, Math.max(0, T - (this.lastT || T))); this.lastT = T; const vh = window.innerHeight;
    const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x), ex = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * cl(x))), eo = (x) => 1 - Math.pow(1 - cl(x), 3), eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }, PI = Math.PI;
    const clk = (b, frac) => { if (this.ov[b] != null) return this.ov[b]; const el = this.q(b); if (!el) return 0; const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) { this.ck[b] = null; return 0; } if (this.ck[b] == null && r.top < vh * frac) this.ck[b] = T; if (this.ck[b] != null && b.length === 1 && b !== 'A' && el.matches(':hover')) this.ck[b] -= dt * 0.3; /* Issue 2: a hovered box's scene runs a little faster */ return this.ck[b] == null ? 0 : T - this.ck[b]; };
    const set = (k, s) => { const e = this.q(k); if (e) Object.assign(e.style, s); return e; };
    this.placeHost(vh);
    const D = this.vals || {}; const items = [], hr = this.host.current ? this.host.current.getBoundingClientRect() : { left: 0, top: 0 };
    // ----- Part A -----
    const tA = clk('A', 0.75), aEl = this.q('A');
    { const eb = this.q('eb'), s = window.seI18n ? window.seI18n.t('WHAT WE OFFER') : 'WHAT WE OFFER', n = Math.round(cl(tA / 0.7) * s.length); if (eb && eb.textContent !== s.slice(0, n)) eb.textContent = s.slice(0, n);
      [0, 1].forEach((i) => set('hl' + i, { transform: 'translateY(' + ((1 - ex((tA - 0.1 * i) / 0.6)) * 110).toFixed(2) + '%)' }));
      const ik = ex((tA - 0.3) / 0.6); set('intro', { opacity: ik.toFixed(3), transform: 'translateY(' + ((1 - ik) * 14).toFixed(1) + 'px)', filter: ik < 1 ? 'blur(' + ((1 - ik) * 6).toFixed(1) + 'px)' : 'none' }); }
    for (let i = 0; i < 8; i++) {
      this.hv[i] = this.hvT[i] ? Math.min(1, this.hv[i] + dt / 0.5) : Math.max(0, this.hv[i] - dt / 0.4); const he = eio(this.hv[i]);
      const k = cl((tA - 0.4 - i * 0.06) / 0.7), e = ex(k), y = 24 * (1 - e) - 3 * Math.sin(PI * cl((k - 0.55) / 0.45)) - 6 * he, op = cl(k * 2.5).toFixed(3);
      set('cb' + i, { transform: 'translateY(' + y.toFixed(2) + 'px)', opacity: op, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6),0 1px 2px rgba(38,40,43,.06),0 ' + (16 + 14 * he).toFixed(1) + 'px ' + (32 + 24 * he).toFixed(1) + 'px -14px rgba(38,40,43,' + (0.24 + 0.04 * he).toFixed(3) + ')' });
      set('cf' + i, { transform: 'translateY(' + y.toFixed(2) + 'px)', opacity: op }); set('pr' + i, { opacity: (he * 0.9).toFixed(3) }); set('ar' + i, { transform: 'translateX(' + (4 * he).toFixed(1) + 'px)' });
      const l0 = 0.8 + i * 0.1, d = cl((tA - l0) / 0.45), fall = d * d, s2 = cl((tA - l0 - 0.45) / 0.25), dy = -30 * (1 - fall) - 2.5 * Math.sin(PI * s2);
      set('ps' + i, { opacity: cl((tA - l0 - 0.45) / 0.08).toFixed(3) });
      const nk = eo((tA - 1.4 - i * 0.08) / 0.8), nE = this.q('n' + i), st = (D.fam && D.fam[i] && D.fam[i].raw) || 0; if (nE) { const tx = Math.round(st * nk).toLocaleString('en-US'); if (nE.textContent !== tx) nE.textContent = tx; }
      const ch = this.q('ch' + i); if (ch) Array.from(ch.children).forEach((c, j) => { const p = cl((tA - 1.6 - i * 0.06 - j * 0.09) / 0.25), b = p >= 1 ? 1 : 0.6 + 0.4 * (1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2)); c.style.opacity = cl(p * 3).toFixed(3); c.style.transform = 'scale(' + b.toFixed(3) + ')'; });
      const slot = this.q('slot' + i); if (!slot || !this.api || d <= 0) continue; const r = slot.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue;
      const L = this.FAM[i][2], inf = this.api.info[L], hh = inf.hh, rxz = Math.hypot(inf.hw, inf.hd), w = r.width, hgt = r.height, kk = Math.min((2.7 * 0.84) / hh, (2.7 * (w / hgt) * 0.86) / rxz);
      let a = (2 * PI * T) / 30 + (40 * PI / 180) * (1 - fall); // 14 Oct §09: one shared clock and angle for every part (was offset per part) const tgt = -0.55 + 2 * PI * Math.round((a + 0.55) / (2 * PI)); a += (tgt - a) * he;
      const hs = cl((T - this.hvAt[i]) / 0.6), rs = ((T % 9) / 1.8) - (i % 4) * 0.25, rw = rs > 0 && rs < 1 ? Math.sin(PI * rs) * 0.7 : 0, hw2 = this.hvT[i] && hs < 1 ? Math.sin(PI * hs) : 0;
      const sw = Math.max(rw, hw2), sx = hw2 > rw ? -1 + 2 * hs : -1 + 2 * cl(rs), bot = hgt / 2 - ((hh * kk) / 2.7) * (hgt / 2);
      items.push({ L, x: r.left - hr.left, y: r.top - hr.top + bot + dy + y * 0, w, h: hgt, ry: a, rx: -0.06, el: 0.16, k: kk, sw, sx });
    }
    // ----- band wipes + text films -----
    const W0 = R.clientWidth; ['R', 'W', 'G'].forEach((b) => { const el = this.q(b), wp = this.q(b + 'wipe'); if (!el || !wp) return; const r = el.getBoundingClientRect(), H = r.height, k = this.ov[b] != null ? 1 : cl((vh - r.top) / (vh * 0.6)), o = H * 0.268, X = -o + k * (W0 + o * 2); wp.style.clipPath = 'none'; /* Issue 2: boxes, not full-width bands: no wipe across the page */ });
    const tR = clk('R', 0.6), tW = clk('W', 0.6), tG = clk('G', 0.6);
    const txt = (b, t) => { const k1 = ex((t - 0.4) / 0.5); set(b + 'eb', { transform: 'translateX(' + ((1 - k1) * -100).toFixed(1) + '%)' }); [0, 1].forEach((i) => set(b + 'h' + i, { transform: 'translateY(' + ((1 - ex((t - 0.55 - i * 0.1) / 0.6)) * 110).toFixed(2) + '%)' }));
      const pk = ex((t - 0.9) / 0.6); set(b + 'p', { opacity: pk.toFixed(3), transform: 'translateY(' + ((1 - pk) * 16).toFixed(1) + 'px)', filter: pk < 1 ? 'blur(' + ((1 - pk) * 6).toFixed(1) + 'px)' : 'none' });
      const sk = ex((t - 1.2) / 0.5); set(b + 's', { opacity: sk.toFixed(3), transform: 'translateY(' + ((1 - sk) * 14).toFixed(1) + 'px)' });
      ((D['st' + b]) || []).forEach((s, j) => { const e = this.q(s.id); if (!e) return; const c = eo((t - 1.2 - j * 0.12) / 1.0), v = Math.round(s.from + (s.n - s.from) * c), tx = s.n >= 1000 && s.n < 3000 ? String(v) : v.toLocaleString('en-US'); if (e.textContent !== tx) e.textContent = tx; });
      const bk = ex((t - 1.6) / 0.6); set(b + 'b', { opacity: bk.toFixed(3), transform: 'translateY(' + ((1 - bk) * 18).toFixed(1) + 'px) scale(' + (0.96 + 0.04 * bk).toFixed(3) + ')' }); };
    txt('R', tR); txt('W', tW); txt('G', tG);
    // ----- Ad 1 Repair -----
    { const t = tR, slot = this.q('Rslot');
      [0, 1, 2, 3].forEach((j) => { const re = t > 3.6 ? (t - 3.6) % 6 : -1, s0 = t < 3.6 ? 2.6 + j * 0.22 : 3.6 + Math.floor((t - 3.6) / 6) * 6 + (re < 0.06 ? 99 : 0.1 + j * 0.08), lt = t < 3.6 ? t - s0 : re - (0.1 + j * 0.08), p = cl(lt / 0.18), b = p >= 1 ? 1 : 0.4 + 0.6 * (1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2)); set('rc' + j, { opacity: cl(p * 2).toFixed(3), transform: 'scale(' + b.toFixed(3) + ')' }); });
      const ck = ex((t - 2.5) / 0.4); set('Rchk', { opacity: ck.toFixed(3), transform: 'translateX(' + ((1 - ck) * 30).toFixed(1) + 'px)' });
      const sk = cl((t - 3.45) / 0.16), shk = t > 3.6 && t < 3.8 ? Math.sin((t - 3.6) * 90) * 3 * (1 - (t - 3.6) / 0.2) : 0; set('Rseal', { opacity: cl(sk * 2).toFixed(3), transform: 'translateX(' + shk.toFixed(1) + 'px) rotate(-12deg) scale(' + (1.7 - 0.7 * eo(sk)).toFixed(3) + ')' });
      if (this.api && slot) { const r = slot.getBoundingClientRect(); if (r.bottom > 0 && r.top < vh) { const fk = cl(t / 0.65), fe = eio(fk), st2 = cl((t - 0.65) / 0.2), roll = PI * (1 - fe), lift = 0.32 * Math.sin(PI * fe) - 0.03 * Math.sin(PI * st2), yaw = -0.32 + (t > 3.6 ? 0.14 * Math.sin((2 * PI * (t - 3.6)) / 7) : 0), inf = this.api.info[8], kk = (2.7 * 0.86) / inf.hh, sp = (T % 5) / 1.6;
          items.push({ L: 8, x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height, lay: { roll, yaw }, el: 0.9, k: kk, py: lift, sw: sp < 1 ? Math.sin(PI * sp) * 0.8 : 0, sx: -1 + 2 * cl(sp) });
          if (this.scr) { this.drawScreen(t); this.api.screenDirty(); } } }
      const dc = this.q('Rdust'); if (dc) this.drawDust(dc, dt, tR > 0 || this.ov.R != null); }
    // ----- Ad 2 Wholesale -----
    { const t = tW; (D.boxes || []).forEach((bx, j) => { const s0 = j < 6 ? 0.05 + j * 0.18 : j === 6 ? 3.2 : 3.55, f = cl((t - s0) / 0.28), land = s0 + 0.28, a = t - land, sq = a > 0 && a < 0.22 ? Math.sin(PI * cl(a / 0.22)) : 0, reb = a > 0.22 && a < 0.4 ? Math.sin(PI * cl((a - 0.22) / 0.18)) * 0.25 : 0;
        set(bx.id, { opacity: t > s0 ? 1 : 0, transform: 'translateY(' + (-260 * (1 - f * f)).toFixed(1) + 'px) scale3d(' + (1 + 0.05 * sq - 0.01 * reb).toFixed(3) + ',' + (1 - 0.1 * sq + 0.02 * reb).toFixed(3) + ',' + (1 + 0.05 * sq).toFixed(3) + ')' });
        set(bx.sid, { opacity: t > land ? cl(a / 0.05).toFixed(3) : (0.25 * f * f).toFixed(3) }); const pk = cl(a / 0.45); set(bx.pid, { opacity: a > 0 ? ((1 - pk) * 0.7).toFixed(3) : 0, transform: 'translateZ(60px) scale(' + (0.5 + pk * 0.9).toFixed(3) + ')' }); });
      const wk = cl((t - 1.6) / 0.6), we = eio(wk), wrap = this.q('wrap'); if (wrap) Array.from(wrap.children).forEach((f, j) => { const k2 = eio(cl((t - 1.6 - j * 0.12) / 0.48)); f.style.clipPath = 'inset(' + ((1 - k2) * 100).toFixed(1) + '% 0 0 0)'; f.style.opacity = k2 > 0 ? 1 : 0; });
      const ws = t < 2.2 ? we : ((T % 7) / 1.2); set('wsh', { transform: 'translateY(' + ((t < 2.2 ? 1 - we : 0) * -60).toFixed(1) + '%) translateX(' + ((ws < 1 ? -120 + ws * 460 : 400)).toFixed(1) + '%) rotate(25deg)' });
      const ta = t - 2.2, ang = ta < 0 ? -70 : 55 * Math.exp(-ta * 3.4) * Math.cos(ta * 8.5) + 3 * Math.sin(T * 1.3) * cl(ta); set('tag', { opacity: cl(ta / 0.12).toFixed(3), transform: 'rotate(' + ang.toFixed(2) + 'deg)' });
      set('tagf', { transform: 'rotateY(' + (180 * eio((t - 2.6) / 0.25)).toFixed(1) + 'deg)' }); const bk = cl((t - 2.85) / 0.15); set('badge', { opacity: cl(bk * 2).toFixed(3), transform: 'rotate(-12deg) scale(' + (1.8 - 0.8 * eo(bk)).toFixed(3) + ')' });
      const ck = ex((t - 2.95) / 0.3); set('cnt', { opacity: ck.toFixed(3), transform: 'translateY(' + ((1 - ck) * 14).toFixed(1) + 'px)' });
      const n = t < 3.2 ? 10 : t < 3.55 ? Math.round(10 + 40 * eo((t - 3.2) / 0.25)) : Math.round(50 + 50 * eo((t - 3.55) / 0.25)), cn = this.q('cntN'); if (cn && cn.textContent !== String(n)) cn.textContent = String(n); }
    // ----- Ad 3 Worldwide -----
    { const g = this.q('glb'); if (g) this.drawGlobe(g, tG, T); }
    const hz = this.host.current && hr.width ? this.host.current.clientWidth / hr.width : 1; if (hz !== 1) items.forEach((it) => { it.x *= hz; it.y *= hz; it.w *= hz; it.h *= hz; });
    if (this.api) { try { this.api.draw(items); } catch (e) { if (!this._de) { this._de = 1; console.warn('[What we offer] draw', e); } } }
  }
  drawDust(c, dt, on) { const x = c.getContext('2d'), W = c.width, H = c.height; x.clearRect(0, 0, W, H); if (!on) return; const lim = window.seQuality ? window.seQuality.count(this.dust.length) : this.dust.length; this.dust.forEach((p, pi) => { if (pi >= lim) return; p.x += (p.vx * dt) / W; p.y += (p.vy * dt) / H; if (p.y > 1) { p.y = 0; p.x = Math.random(); } if (p.x < 0) p.x += 1; if (p.x > 1) p.x -= 1; const cx = W * 0.62, cy = H * 0.25, dx = (p.x * W - cx) / (W * 0.45), dy = (p.y * H - cy) / (H * 0.7), inL = Math.max(0, 1 - dx * dx - dy * dy); if (inL <= 0.02) return; const tw = 0.7 + 0.3 * Math.sin(performance.now() / 700 + p.ph); x.globalAlpha = p.a * inL * tw; x.fillStyle = '#F4EEE2'; x.beginPath(); x.arc(p.x * W, p.y * H, p.s, 0, 7); x.fill(); }); x.globalAlpha = 1; }
  drawScreen(t) {
    const c = this.scr, x = c.getContext('2d'), W = c.width, H = c.height, cl = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), eo = (v) => 1 - Math.pow(1 - cl(v), 3);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; const boot = cl((t - 2.0) / 0.2), home = cl((t - 2.45) / 0.15);
    x.fillStyle = '#050607'; x.fillRect(0, 0, W, H);
    if (home > 0) { const g = x.createLinearGradient(0, 0, W * 0.4, H); g.addColorStop(0, '#3E4044'); g.addColorStop(0.55, '#26282B'); g.addColorStop(1, '#26282B'); x.globalAlpha = home; x.fillStyle = g; x.fillRect(0, 0, W, H); const gl = x.createRadialGradient(W * 0.75, H * 0.12, 0, W * 0.75, H * 0.12, W * 0.8); gl.addColorStop(0, 'rgba(247,192,50,.35)'); gl.addColorStop(1, 'rgba(247,192,50,0)'); x.fillStyle = gl; x.fillRect(0, 0, W, H);
      x.fillStyle = '#FFFFFF'; x.font = '600 120px "Space Grotesk",sans-serif'; x.textAlign = 'center'; x.fillText('10:24', W / 2, H * 0.2); x.font = '500 30px Inter,sans-serif'; x.fillStyle = 'rgba(255,255,255,.75)'; x.fillText('Repaired · Sam Electronics', W / 2, H * 0.245);
      const C = ['#F7C032', '#F2F3F4', '#5E6064', '#8C9096', '#3D3E3F', '#D5D7DA']; for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { const s = 100, gx = W * 0.14 + k * (W * 0.72 - s) / 3, gy = H * 0.36 + r * 150; x.fillStyle = C[(r * 4 + k) % C.length]; x.beginPath(); x.roundRect(gx, gy, s, s, 26); x.fill(); }
      x.fillStyle = 'rgba(255,255,255,.12)'; x.beginPath(); x.roundRect(W * 0.08, H * 0.86, W * 0.84, 130, 44); x.fill(); x.textAlign = 'left'; x.globalAlpha = 1; }
    if (boot > 0 && home < 1) { x.globalAlpha = boot * (1 - home); const g = x.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, H * 0.6); g.addColorStop(0, '#2E3034'); g.addColorStop(1, '#0B0C0E'); x.fillStyle = g; x.fillRect(0, 0, W, H); const im = this._logo || (this._logo = Object.assign(new Image(), { src: 'assets/se-logo.png' })); if (im.complete && im.naturalWidth) { const lw = W * 0.5 * (0.94 + 0.06 * eo((t - 2.0) / 0.25)); x.save(); x.beginPath(); x.arc(W / 2, H * 0.45, lw / 2, 0, 7); x.clip(); x.drawImage(im, W / 2 - lw / 2, H * 0.45 - lw / 2, lw, lw); const sk = cl((t - 2.15) / 0.3); if (sk > 0 && sk < 1) { const bx = W / 2 - lw + sk * lw * 2, sg = x.createLinearGradient(bx - lw * 0.25, 0, bx + lw * 0.25, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,.7)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = sg; x.fillRect(0, 0, W, H); } x.restore(); } x.globalAlpha = 1; }
    if (boot < 1) { x.lineCap = 'round'; x.lineJoin = 'round'; const ix = 0.24 * W, iy = 0.8 * H;
      this.cr.forEach((cr) => { const P = cr.pts.map(([a, b]) => [a * W, b * H]); const path = () => { x.beginPath(); x.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) x.lineTo(P[i][0], P[i][1]); };
        const ys = 0.85 + cr.o * 0.75, yk = cl((t - ys) / 0.32), fade = 1 - cl((t - ys - 0.32) / 0.25);
        if (fade > 0) { x.globalAlpha = 0.85 * fade; x.strokeStyle = '#FFFFFF'; x.lineWidth = 3; path(); x.stroke(); x.globalAlpha = 0.18 * fade; x.lineWidth = 12; path(); x.stroke(); }
        if (yk > 0) { let Ltot = 0; const seg = []; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); Ltot += l; } let rem = Ltot * yk; x.save(); x.shadowColor = '#F7C032'; x.shadowBlur = 18; x.strokeStyle = 'rgba(255,219,110,' + (0.95 * (1 - cl((t - 1.95) / 0.1))).toFixed(3) + ')'; x.lineWidth = 6; x.beginPath(); x.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length && rem > 0; i++) { const f = Math.min(1, rem / seg[i - 1]); x.lineTo(P[i - 1][0] + (P[i][0] - P[i - 1][0]) * f, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * f); rem -= seg[i - 1]; } x.stroke(); x.restore(); } });
      const fl = t > 0.6 && t < 1.0 ? Math.sin(Math.PI * cl((t - 0.6) / 0.4)) : 0; if (fl > 0) { const g = x.createRadialGradient(ix, iy, 0, ix, iy, W * 0.4); g.addColorStop(0, 'rgba(255,240,200,' + (0.35 * fl).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,240,200,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
      const sc = cl((t - 1.7) / 0.3); if (sc > 0 && sc < 1) { const yy = H * (0.95 - sc * 1.0), g = x.createLinearGradient(0, yy - 60, 0, yy + 60); g.addColorStop(0, 'rgba(255,248,225,0)'); g.addColorStop(0.5, 'rgba(255,248,225,.5)'); g.addColorStop(1, 'rgba(255,248,225,0)'); x.fillStyle = g; x.fillRect(0, yy - 60, W, 120); }
      x.globalAlpha = 1; }
  }
  drawGlobe(cv, t, T) {
    const G = window.SE_GLOBE; if (!G) return; const x = cv.getContext('2d'), N = cv.width, R = N / 2 - 16, C = N / 2, Dg = Math.PI / 180, cl = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), eo = (v) => 1 - Math.pow(1 - cl(v), 3);
    const fin = eo(t / 1.0), p0 = 20 * Dg, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
    // 14 Oct §09: starts on the UAE; with each route the globe turns smoothly toward the destination, then back home
    const DLON = [44.4, 28.98, 3.38, -3.7], eio2 = (v) => { v = cl(v); return v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2; };
    let lonC = 55.27; if (t >= 1) { const cy0 = Math.floor((t - 1) / 4), c0 = (t - 1) % 4, dl = DLON[cy0 % 4]; lonC = 55.27 + (dl - 55.27) * 0.6 * eio2(c0 / 1.3) * (1 - eio2((c0 - 2.9) / 1.1)); }
    const lc = lonC * Dg;
    const pj = (lon, lat, h) => { const l = lon * Dg - lc, f = lat * Dg, cf = Math.cos(f), sf = Math.sin(f), cL = Math.cos(l), r = R * (h || 1); return [C + r * cf * Math.sin(l), C - r * (cp0 * sf - sp0 * cf * cL), sp0 * sf + cp0 * cf * cL]; };
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, N, N); if (fin <= 0) { cv.style.opacity = 0; return; } cv.style.opacity = fin.toFixed(3); cv.style.transform = 'scale(' + (0.9 + 0.1 * fin).toFixed(3) + ')'; cv.style.filter = fin < 1 ? 'blur(' + ((1 - fin) * 8).toFixed(1) + 'px)' : 'none';
    const bg = x.createRadialGradient(C - R * 0.35, C - R * 0.4, R * 0.05, C, C, R); bg.addColorStop(0, '#FFFFFF'); bg.addColorStop(0.6, '#F2F3F4'); bg.addColorStop(1, '#DCDDDF'); x.beginPath(); x.arc(C, C, R, 0, 7); x.fillStyle = bg; x.fill();
    // 14 Oct §09: the hero globe's crisp square dots (same colours as before), pixel-snapped, depth-faded toward the rim
    const dots = (arr, col, sz) => { x.fillStyle = col; for (let i = 0; i < arr.length; i += 2) { const q = pj(arr[i], arr[i + 1]); if (q[2] <= 0.02) continue; x.globalAlpha = Math.min(1, 0.15 + q[2] * 1.1); const z = Math.max(1.5, sz * (0.55 + 0.45 * q[2])); x.fillRect(Math.round(q[0] - z / 2), Math.round(q[1] - z / 2), z, z); } x.globalAlpha = 1; };
    dots(G.land, '#3D3E3F', 5.6); dots(G.hi, '#E9B12A', 6);
    const v3 = (lo, la) => [Math.cos(la * Dg) * Math.cos(lo * Dg), Math.cos(la * Dg) * Math.sin(lo * Dg), Math.sin(la * Dg)], ll = (v) => [Math.atan2(v[1], v[0]) / Dg, Math.asin(Math.max(-1, Math.min(1, v[2]))) / Dg];
    const slerp = (a, b, f) => { const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(d); if (om < 1e-4) return a; const s1 = Math.sin((1 - f) * om) / Math.sin(om), s2 = Math.sin(f * om) / Math.sin(om); return [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2]; };
    const DST = [['BAGHDAD', 44.4, 33.3], ['ISTANBUL', 28.98, 41.0], ['LAGOS', 3.38, 6.52], ['MADRID', -3.7, 40.4]], O = v3(G.dxb[0], G.dxb[1]), cyc = t < 1 ? -1 : Math.floor((t - 1) / 4), ct = t < 1 ? -1 : (t - 1) % 4;
    const arc = (d, prog, col, wd, al) => { const B = v3(d[1], d[2]), H = 0.06 + 0.12 * Math.min(1, Math.acos(Math.max(-1, Math.min(1, O[0] * B[0] + O[1] * B[1] + O[2] * B[2]))) / 1.0); x.strokeStyle = col; x.lineWidth = wd; x.lineCap = 'round'; for (let i = 1; i <= 40; i++) { const f0 = ((i - 1) / 40) * prog, f1 = (i / 40) * prog, g0 = ll(slerp(O, B, f0)), g1 = ll(slerp(O, B, f1)), a = pj(g0[0], g0[1], 1 + H * Math.sin(Math.PI * f0)), b = pj(g1[0], g1[1], 1 + H * Math.sin(Math.PI * f1)); if (Math.min(a[2], b[2]) < -0.05) continue; x.globalAlpha = al * cl(0.3 + Math.min(a[2], b[2]) * 1.4); x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); } x.globalAlpha = 1; return (f) => { const g = ll(slerp(O, B, f)); return pj(g[0], g[1], 1 + H * Math.sin(Math.PI * f)); }; };
    for (let k = 0; k < Math.min(cyc, 3); k++) arc(DST[(cyc - 1 - k + 400) % 4], 1, '#3D3E3F', 2, 0.35);
    if (cyc >= 0) { const d = DST[cyc % 4], pr = eo(ct / 0.8); x.save(); x.shadowColor = '#F7C032'; x.shadowBlur = 14; const at = arc(d, pr, '#F7C032', 4.5, 1); x.restore();
      const pk = cl((ct - 0.5) / 0.9), bo = ct > 1.4 && ct < 1.7 ? Math.sin(Math.PI * cl((ct - 1.4) / 0.3)) * 10 : 0; if (pk > 0) { const q = at(eo(pk) * 0.999 + (pk >= 1 ? 0.001 : 0)); if (q[2] > -0.05) { x.save(); x.translate(q[0], q[1] - bo); x.fillStyle = '#C9A16B'; x.strokeStyle = '#7F5A30'; x.lineWidth = 1.5; x.beginPath(); x.roundRect(-11, -9, 22, 18, 3); x.fill(); x.stroke(); x.fillStyle = '#F7C032'; x.fillRect(-2.5, -9, 5, 18); x.restore(); } }
      const e = pj(d[1], d[2]); if (e[2] > 0 && ct > 1.4) { const pu = cl((ct - 1.4) / 0.8); x.globalAlpha = 1 - pu; x.strokeStyle = '#F7C032'; x.lineWidth = 3; x.beginPath(); x.arc(e[0], e[1], 6 + pu * 26, 0, 7); x.stroke(); x.globalAlpha = 1; }
      const lb = this.q('gdst'), tx = 'DXB → ' + d[0]; if (lb && lb.textContent !== tx) lb.textContent = tx; }
    { const q = pj(G.dxb[0], G.dxb[1]); if (q[2] > 0) { const pu = (T % 2.2) / 2.2, hg = x.createRadialGradient(q[0], q[1], 0, q[0], q[1], 40); hg.addColorStop(0, 'rgba(247,192,50,.55)'); hg.addColorStop(1, 'rgba(247,192,50,0)'); x.fillStyle = hg; x.beginPath(); x.arc(q[0], q[1], 40, 0, 7); x.fill(); x.globalAlpha = 1 - pu; x.strokeStyle = '#F7C032'; x.lineWidth = 3; x.beginPath(); x.arc(q[0], q[1], 10 + pu * 30, 0, 7); x.stroke(); x.globalAlpha = 1; x.fillStyle = '#F7C032'; x.beginPath(); x.arc(q[0], q[1], 10, 0, 7); x.fill(); x.lineWidth = 3.5; x.strokeStyle = '#26282B'; x.stroke(); } }
    const hl = x.createRadialGradient(C - R * 0.42, C - R * 0.48, 0, C - R * 0.42, C - R * 0.48, R * 0.7); hl.addColorStop(0, 'rgba(255,255,255,.55)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); x.beginPath(); x.arc(C, C, R, 0, 7); x.fillStyle = hl; x.fill();
    const rim = x.createRadialGradient(C, C, R * 0.86, C, C, R); rim.addColorStop(0, 'rgba(38,40,43,0)'); rim.addColorStop(1, 'rgba(38,40,43,.16)'); x.fillStyle = rim; x.fill(); x.lineWidth = 2; x.strokeStyle = 'rgba(38,40,43,.12)'; x.stroke();
    const st = ct < 0 ? -1 : ct < 1.4 ? 0 : ct < 1.9 ? 1 : 2; [0, 1, 2].forEach((k) => { const on = (k === 0 && ct >= 1.4) || (k === 1 && ct >= 1.9) || (k === 2 && ct >= 2.4), e2 = this.q('gs' + k), c2 = this.q('gc' + k); if (e2) { e2.style.background = on ? '#F7C032' : '#F2F3F4'; e2.style.color = on ? '#26282B' : '#5E6064'; } if (c2) c2.style.opacity = on ? 1 : 0; });
  }
  renderVals() {
    const D = this.state.data, P = (D && D.products) || [], GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    const MB = {}; ((D && D.models) || []).forEach((m) => (MB[m.id] = m.brand_id || m.brand));
    const stat = (c) => { const [cat, part] = c.split(':'); let ps = P.filter((x) => x.category === cat); if (part != null) ps = ps.filter((_, i) => i % 2 === Number(part)); const g = ['OR', 'OL', 'IN', 'AQ'].filter((k) => ps.some((x) => x.grade === k)).map((k) => GN[k]); const br = new Set(ps.map((x) => MB[x.model_id]).filter(Boolean)).size; return { stock: Math.max(1, ps.reduce((a, x) => a + x.stock_qty, 0)), brands: br || 1, min: ps.length ? Math.min(...ps.map((x) => x.retail_price)) : 35, grades: g.length ? g : ['Original'] }; };
    const fam = this.FAM.map(([name, cat], i) => { const s = stat(cat), chips = s.grades.length > 3 ? s.grades.slice(0, 2).concat(['+' + (s.grades.length - 2)]) : s.grades; return { i, name, raw: s.stock, stock: s.stock.toLocaleString('en-US'), brands: s.brands, min: s.min, chips,
      go: (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('se:fmp', { detail: { c: cat.split(':')[0] } })); },
      enter: () => { this.hvT[i] = 1; this.hvAt[i] = performance.now() / 1000; }, leave: () => { this.hvT[i] = 0; } }; });
    const SS = (D && D.serviceStats) || {}, col = (b, arr, bd) => arr.map((s, j) => ({ ...s, id: b + 'n' + j, v: s.n >= 1000 && s.n < 3000 ? String(s.n) : s.n.toLocaleString('en-US'), pl: j ? '16px' : '0', bl: j ? '1px solid ' + bd : 'none' }));
    const stR = col('R', [{ n: 24, from: 1, u: 'h', l: 'SAME-DAY REPAIRS' }, { n: 90, from: 1, u: ' days', l: 'WARRANTY ON EVERY REPAIR' }, { n: 2003, from: 1990, u: '', l: 'IN DEIRA SINCE' }], 'rgba(255,255,255,.14)');
    const stW = col('W', [{ n: SS.tradeMin || 10, from: 1, u: ' units', l: 'TRADE PRICES FROM' }, { n: 24, from: 1, u: 'h', l: 'SAME-DAY QUOTES' }, { n: 2003, from: 1990, u: '', l: 'TRADING SINCE' }], 'rgba(38,40,43,.2)');
    const stG = col('G', [{ n: SS.countries || 24, from: 1, u: '+', l: 'COUNTRIES SHIPPED TO' }, { n: 100, from: 1, u: '%', l: 'PARCELS TRACKED' }, { n: 24, from: 1, u: 'h', l: 'PACKED SAME DAY' }], 'rgba(38,40,43,.14)');
    const boxes = [[-134, 0], [0, 0], [134, 0], [-134, -92], [0, -92], [134, -92], [-67, -184], [67, -184]].map(([bx, by], j) => ({ x: bx, y: by, id: 'ct' + j, sid: 'cs' + j, pid: 'pf' + j }));
    const C = (D && D.contact) || {}, quoteHref = 'https://wa.me/' + (C.wa || '971503420015') + '?text=' + encodeURIComponent('Hi Sam Electronics, I would like a shipping quote. Destination: … · Parts and quantity: …'); // 14 Oct §09
    const v = { root: this.root, host: this.host, quoteHref, fam, stR, stW, stG, boxes, chk: ['Touch', 'Display', 'Face ID', 'Speaker'].map((t, j) => ({ t, id: 'rc' + j })), steps: ['Packed', 'In transit', 'Delivered'].map((t, j) => ({ t, id: 'gs' + j, cid: 'gc' + j })) };
    this.vals = v; return v;
  }
}

export default Component;
