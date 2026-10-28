// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Teardown.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { comingSoon } from '@/components/g17/ComingSoon';
import { DCLogic, StreamableLogic } from '@/dc/runtime';
import { registerScene } from '@/dc/gl-budget';
import { jumping, jumpTo } from '@/lib/jumpScroll';

class Component extends DCLogic {
  state = { p: 0, data: window.SE_DATA || null, loading: true, vw: document.documentElement.clientWidth || 1440, vh: window.innerHeight || 900, fs: 1, ft: 0, fo: false, si: 0, ps: -1, cT: 1, ent: 0, thumbs: null, oT: 3.4, ck: 0, mag: [0, 0], fmpH: false, shopH: false, hov: -1, lib: null };
  secRef = React.createRef(); h2Ref = React.createRef(); opDone = false; opSp = 1; tl = null; hostRef = React.createRef(); finRef = React.createRef(); td = { p: 0.15, hover: null };
  T = { rise0: 0.10, rise1: 0.15, pwr0: 0.165, pwr1: 0.185, lay0: 0.19, lay1: 0.26, l0: 0.27, ls: 0.055, ld: 0.05, b8: 0.655, sh0: 0.68, sh1: 0.745, re0: 0.75, rs: 0.0143, st0: 0.852, st1: 0.89, fin0: 0.89 };
  L = [['Screen', 'SCR', 'GLASS + OLED ASSEMBLY', 'Shop screens', 'scr'], ['Frame', 'FRM', 'FRAMES & HOUSINGS', 'Shop frames', 'frm'], ['Flex cables', 'FLX', 'CHARGING & FLEX', 'Shop flex cables', 'flx'], ['Logic board', 'SML:0', 'BOARD COMPONENTS', 'Ask us', 'board'], ['Battery', 'BAT', 'BATTERIES', 'Shop batteries', 'bat'], ['Cameras', 'CAM', 'CAMERAS', 'Shop cameras', 'cam'], ['Small parts', 'SML:1', 'PORTS & BUTTONS', 'Shop small parts', 'sml'], ['Back glass', 'BCV', 'BACK COVERS', 'Shop back covers', 'bcv']];
  // desktop steps: Intro · 01–08 · Reassembly · Final call (p on the shared timeline)
  S = [0.15, 0.185, 0.32, 0.375, 0.43, 0.485, 0.54, 0.595, 0.65, 0.668, 0.85, 1];
  opBusy() { return !this.isMob() && this.state.oT < 3.4; }
  opFF() { /* opening is never skipped by scroll input: input is held until it finishes */ }
  opPlay(replay) { try { cancelAnimationFrame(this.oraf); clearTimeout(this.opWd); this.opRunning = true; this.opRun2 = false; this.opSp = 1; let last = performance.now(); this.td.op = 0; this.setState({ oT: 0 });
    const sched = (fn) => { let dn = false; this.oraf = requestAnimationFrame((x) => { if (!dn) { dn = true; fn(x); } }); setTimeout(() => { if (!dn) { dn = true; cancelAnimationFrame(this.oraf); fn(performance.now()); } }, 40); };
    const f = (t) => { if (!this.opRunning) return; this.opRun2 = true; const dt = Math.min(0.1, (t - last) / 1000); last = t; const oT = Math.min(3.4, this.state.oT + dt * this.opSp); this.td.oT = oT; this.td.lt = this.lightAt(oT); this.setState({ oT }); if (oT < 3.4) sched(f); else { this.opDone = true; this.opRunning = false; this.td.oT = null; this.td.lt = 1; if (this.mode === 'film' && (this.idx || 0) === 0 && !this.props.fw) { this.pend = 0; this.step(1); } /* 14 Oct §07 C: the turn follows the opening on its own */ } };
    sched(f); this.opWd = setTimeout(() => { if (this.state.oT < 3.4 && !this.opRun2) this.opShow('animation frames never ran'); }, 6000); } catch (e) { this.opShow('opPlay error: ' + (e && e.message)); } }
  raf(key, fn) { let dn = false; const go = (x) => { if (!dn) { dn = true; fn(x || performance.now()); } }; this[key] = requestAnimationFrame(go); setTimeout(go, 40); }
  tossStart(snap) { this.tossOn = true; this.revOn = false; cancelAnimationFrame(this.graf); if (snap) { this.td.tossAt = 9; this.setState({ gT: 1.1 }); return; } const t0 = performance.now(); let kicked = false; this.td.tossAt = 0;
    const f = () => { if (!this.tossOn) return; const el = (performance.now() - t0) / 1000; this.td.tossAt = el; const gT = Math.max(0, Math.min(1.1, el - 0.45)); /* 14 Oct §07 C: the title and card move AS the phone turns (was after it landed, 2.25s) */ if (!kicked && gT >= 0.6) { kicked = true; this.cardKick(); } if (gT !== this.state.gT) this.setState({ gT }); if (el < 3.5) this.raf('graf', f); }; this.raf('graf', f); }
  tossRev() { this.revOn = true; this.tossOn = false; cancelAnimationFrame(this.graf); const a0 = Math.min(2.15, this.td.tossAt == null ? 2.15 : this.td.tossAt), g0 = this.state.gT || 0, t0 = performance.now();
    const f = () => { if (!this.revOn) return; const el = (performance.now() - t0) / 1000, gT = Math.max(0, g0 * (1 - el / 0.5)), tA = Math.max(0, a0 - Math.max(0, el - 0.3)); this.td.tossAt = tA; if (gT !== this.state.gT) this.setState({ gT }); if (tA > 0) this.raf('graf', f); else { this.td.tossAt = null; this.revOn = false; } }; this.raf('graf', f); }
  tossEnd() { this.tossOn = false; this.revOn = false; cancelAnimationFrame(this.graf); this.td.tossAt = null; this.setState({ gT: 0 }); }
  opShow(why) { if (why) console.warn('[SE Teardown] opening safety net activated: ' + why); cancelAnimationFrame(this.oraf); this.opRunning = false; this.opArm = false; this.opDone = true; this.td.op = 1; this.td.oT = null; this.td.lt = 1; this.setState({ oT: 3.4 }); }
  lightAt(t) { return 1; }
  cardKick() { this.setState({ cT: 0, ck: (this.state.ck || 0) + 1 }); const t0 = performance.now(); cancelAnimationFrame(this.craf); const f = (t) => { const k = Math.min(1, (t - t0 - 120) / 700); this.setState({ cT: Math.max(0, k) }); if (k < 1) this.craf = requestAnimationFrame(f); }; this.craf = requestAnimationFrame(f); }
  // opening trigger: armed only when the section is fully below the viewport; plays when its top comes within 75% of the viewport (and only at the Intro step)
  // opening trigger: while the stage is not yet pinned only the empty lit studio shows; the opening starts the moment the stage is pinned (top at 0, i.e. under the nav) and the 3D is ready
  opReset() { if (this.failed3d && !this.ready3d && (!this._retry3d || performance.now() - this._retry3d > 8000)) { this._retry3d = performance.now(); this.failed3d = false; this.setup(); } // owner (27 Oct): a failed load is retried when the visitor comes back, so it can never stay skipped
    this.pend = 0; cancelAnimationFrame(this.twRaf); cancelAnimationFrame(this.sraf); this.anim = false; this.scrolling = false; this.idx = 0; this.waitOp = false; this.td.faceBack = true; this.opArm = true; this.filmOn = false; this.opDone = false; this.opRunning = false; cancelAnimationFrame(this.oraf); this.revOn = false; this.tossOn = false; cancelAnimationFrame(this.graf); clearTimeout(this.autoT); this.td.tossAt = null; this.td.oT = 0; this.td.lt = 1; this.busyUntil = 0; this.setState({ oT: 0, gT: 0 }); }
  // Entry (Issue 1 · D): the film starts only when the stage is fully pinned under the nav. From above it always
  // starts at step 0 (the page is held at the section top; the empty lit studio holds until the 3D is ready);
  // from below it enters at the final call. While the film runs, the engine owns every scroll input.
  opCheck() { try { if (this.isMob() || this.props.fw) return; const pin = this.pin(), sec = this.secRef.current; if (!pin || !sec) return; const r = pin.getBoundingClientRect(), rs = sec.getBoundingClientRect(), vh = window.innerHeight;
      if (this.passing) { const out = rs.bottom <= 0 || rs.top >= vh; if (out) { this.side = rs.top >= vh ? 'above' : 'below'; this.passing = 0; if (this.side === 'above') this.opReset(); } return; }
      // a jump that crosses the held stage passes through (direction from the scroll); one that only lands near it does nothing
      { const y = window.scrollY, d = y - (this._jy == null ? y : this._jy); this._jy = y; if (jumping() && this.mode !== 'film') { if (r.top <= 1 && r.bottom >= vh - 1) this.pass(d < 0 ? -1 : 1); return; } }
      if (this.mode === 'film') { if (this.waitOp && !this.ready3d && (this.failed3d || performance.now() - this.waitAt > 10000)) { this.waitOp = false; this.opShow('3D not ready'); return; } if (this.waitOp && this.ready3d) { this.waitOp = false; console.info('[SE Teardown] opening started (stage pinned, 3D ready)'); this.opPlay(false); } return; }
      if (rs.top > 1) { if (this.side !== 'above') { this.side = 'above'; this.opReset(); } return; }
      if (rs.bottom < vh - 1) { this.side = 'below'; return; }
      if (this.releasing && performance.now() - this.releasing < 900) return;
      const pinned = r.top <= 1 && r.bottom >= vh - 1; if (!pinned) return;
      if (this.side === 'below') { this.enterFilm(true); this.opShow(); this.td.tossAt = null; this.setState({ gT: 1.1 }); return; }
      this.opReset(); this.enterFilm(false); window.scrollTo(0, this.yFor(0));
      if (this.ready3d) { console.info('[SE Teardown] opening started (stage pinned, 3D ready)'); this.opPlay(false); } else if (this.failed3d) this.opShow('3D failed to load'); else { this.waitOp = true; this.waitAt = performance.now(); }
    } catch (e) { this.opShow('opCheck error: ' + (e && e.message)); } }
  measureTitle() { const h = this.h2Ref.current, pin = this.pin(); if (!h || !pin) return; const l1 = h.firstElementChild; if (!l1) return; let st = this._stage; if (!st || !st.contains(h)) { st = h.parentElement; while (st && st !== pin && !/sticky|fixed/.test(getComputedStyle(st).position)) st = st.parentElement; this._stage = st = st || pin; } const r = h.getBoundingClientRect(), pr = st.getBoundingClientRect(); const tl = { l: (document.documentElement.dir === 'rtl' ? r.right - l1.offsetWidth : r.left) - pr.left, t: r.top - pr.top, w: l1.offsetWidth, h: l1.offsetHeight }; /* owner (28 Oct): in Arabic the line starts at the RIGHT, so the centred title was off */ /* measured against the sticky stage the title lives in, not the tall scrolling wrapper: otherwise any page scroll during the toss threw the title off the top */ const o = this.tl; if (!o || Math.abs(o.l - tl.l) > 0.5 || Math.abs(o.t - tl.t) > 0.5 || Math.abs(o.w - tl.w) > 0.5) { this.tl = tl; this.forceUpdate(); } }
  isMob() { return !!this.props.mob || (this.props.fw || this.state.vw) < 768; }
  pin() { const el = this.secRef.current; return el && el.firstElementChild; }
  SH() { return Math.round(window.innerHeight * 0.6); }
  pFromF(f) { const S = this.S, i = Math.min(S.length - 2, Math.max(0, Math.floor(f))), k = Math.min(1, Math.max(0, f - i)); return S[i] + (S[i + 1] - S[i]) * k; }
  fNow() { const pin = this.pin(); if (!pin) return 0; return Math.min(this.S.length - 1, Math.max(0, -pin.getBoundingClientRect().top / this.SH())); }
  inside() { const pin = this.pin(); if (!pin) return false; const r = pin.getBoundingClientRect(); return r.top <= 2 && r.bottom >= window.innerHeight - 2; }
  // ── Issue 1 · the scroll engine ─────────────────────────────────────────────────────────────────────
  // A strict sequence of steps (FS, positions on the shared timeline p). The film is driven ONLY by this
  // engine: p never follows the raw page scroll, so a fast scroll, a stray nudge or trackpad momentum can
  // never jump, skip or reset it. One deliberate gesture (≥40px, after 250ms of quiet) = one step; input
  // during an animation is ignored, never queued; up = exactly one step back, played in reverse.
  //   FS: 0 back reveal (after the automatic opening) · 1 toss + interface · 2 burst · 3–10 layers 01–08 ·
  //       11 reassembled · 12 final call (automatic from 11)
  FS = [0.15, 0.185, 0.262, 0.32, 0.375, 0.43, 0.485, 0.54, 0.595, 0.65, 0.668, 0.85, 1];
  yFor(i) { const pin = this.pin(); if (!pin) return window.scrollY; const top = window.scrollY + pin.parentElement.getBoundingClientRect().top; return Math.round(top + Math.min(i, this.S.length - 1) * this.SH() * ((this.S.length - 1) / (this.FS.length - 1))); }
  goTo(i, ms) {
    const F = this.FS, last = F.length - 1; i = Math.max(0, Math.min(last, i)); this.idx = i; this.td.faceBack = i === 0;
    const dur = ms || 900; this.tween(F[i], dur);
    if (this.props.fw) { this.manual = true; return; }
    // keep the page scroll in step with the film (invisible while pinned) so the two ends release naturally
    const y0 = window.scrollY, y1 = this.yFor(i), t0 = performance.now(); cancelAnimationFrame(this.sraf); this.scrolling = true;
    window.__seOwnScroll = true; const f = (t) => { const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; window.scrollTo(0, y0 + (y1 - y0) * e); if (k < 1) this.sraf = requestAnimationFrame(f); else { this.scrolling = false; window.__seOwnScroll = false; } };
    this.sraf = requestAnimationFrame(f);
  }
  // R6 Part B: pass-through. A fast scroll (several gestures quickly, a long flick), a scrollbar drag or any jump (logo,
  // progress bar, Home/End) never holds the page: the film snaps silently to its end state (going down) or start state
  // (going up) and the page scrolls on. It replays normally the next time it is entered.
  pass(dir) {
    if (this.passing === dir) return; this.passing = dir; this.pend = 0; clearTimeout(this.autoT); cancelAnimationFrame(this.sraf); cancelAnimationFrame(this.twRaf); this.scrolling = false; this.anim = false; window.__seOwnScroll = false;
    this.mode = 'out'; this.waitOp = false; this.busyUntil = 0;
    if (dir > 0) { this.opShow(); this.tossEnd(); this.idx = this.FS.length - 1; this.td.faceBack = false; this.td.p = 1; this.setState({ gT: 1.1 }); }
    else { cancelAnimationFrame(this.oraf); this.opRunning = false; this.tossEnd(); this.idx = 0; this.td.faceBack = true; this.td.p = this.FS[0]; }
    this.td.snap = true; this.setState({ p: this.td.p });
  }
  // owner (28 Oct): a fast scroll no longer skips the teardown silently: the whole film plays super quickly (~1.3s, the same
  // animations), then the page is released past the section, so nobody has to scroll through a held final call
  quick(dir) {
    if (dir < 0 || jumping()) return this.pass(dir); if (this.quicking) return; this.quicking = true; this.q = []; clearTimeout(this.autoT);
    const last = this.FS.length - 1; if (this.opBusy()) this.opShow(); this.tossEnd(); this.td.faceBack = false; this.busyUntil = performance.now() + 1500;
    this.goTo(last, 1300); setTimeout(() => { this.quicking = false; this.busyUntil = 0; this.release(1); }, 1350);
  }
  busy() { return this.opBusy() || this.anim || performance.now() < (this.busyUntil || 0) || this.revOn; }
  /** Urgent 3: never freeze the page: end a stalled opening / tween and accept input again. */
  unstick() { console.warn('[teardown] unstick'); if (this.opBusy()) this.opShow('unstick'); cancelAnimationFrame(this.twRaf); this.anim = false; this.busyUntil = 0; this.revOn = false; this.pend = 0; }
  /** One deliberate gesture: a step, or at the two ends a release of the page. */
  gesture(dir) {
    const last = this.FS.length - 1, i = this.idx || 0;
    if (dir < 0 && i === 0) return this.release(-1);
    if (dir > 0 && i === last) return this.release(1);
    return this.step(dir);
  }
  release(dir) {
    const sec = this.secRef.current; if (!sec) return; this.mode = 'out'; this.releasing = performance.now();
    const r = sec.getBoundingClientRect(), y = dir < 0 ? window.scrollY + r.top - Math.round(window.innerHeight * 0.55) : window.scrollY + r.bottom - 72;
    jumpTo(Math.max(0, y));
  }
  step(dir) {
    const F = this.FS, last = F.length - 1, cur = this.idx || 0, nx = cur + dir; if (nx < 0 || nx > last) return false;
    const now = performance.now(), k = (this.q && this.q.length) ? 0.42 : 1; // owner (28 Oct): queued steps play quicker
    const goTo0 = this.goTo.bind(this), goTo = (i, ms) => goTo0(i, Math.round(ms * k));
    if (cur === 0 && nx === 1) { this.busyUntil = now + Math.round(2100 * k); this.tossStart(false); goTo(1, 1100); return true; } // step 3 + 3b (automatic)
    if (cur === 1 && nx === 0) { this.busyUntil = now + Math.round(2700 * k); this.tossRev(); goTo(0, 1300); return true; } // the phone flips back to show its back
    if (nx === last - 1 && dir > 0) { this.busyUntil = now + Math.round(2900 * k); goTo(nx, 1200); clearTimeout(this.autoT); this.autoT = setTimeout(() => { if (this.idx === last - 1 && this.mode === 'film') { this.busyUntil = performance.now() + 1500; goTo(last, 1400); } }, 1300); return true; } // step 13, then 14 automatically
    if (cur === last && dir < 0) { this.busyUntil = now + Math.round(1500 * k); goTo(last - 1, 1400); return true; }
    this.busyUntil = now + Math.round(700 * k); goTo(nx, 900); return true; // 14 Oct §07 A: input opens again once the step has visibly landed
  }
  /** Enter the film at step 0 (from above) or at the final call (from below). */
  enterFilm(atEnd) { this.mode = 'film'; this.gUsed = true; this.lastW = performance.now(); if (atEnd) { const last = this.FS.length - 1; this.idx = last; this.td.faceBack = false; this.td.p = 1; this.td.snap = true; this.setState({ p: 1 }); window.scrollTo(0, this.yFor(last)); } else { this.idx = 0; this.td.faceBack = true; this.td.p = this.FS[0]; this.td.snap = true; this.setState({ p: this.FS[0] }); } }
  componentDidMount() {
    // G16: the teardown keeps its WebGL context for the whole visit; the budget counts it (src/dc/gl-budget.ts).
    this.unregGL = registerScene({ id: 'teardown', fixed: true, el: () => null, mount: async () => {} });
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 60);
    this.on = () => { if (this.props.fw) { this.manual = true; return; } const vw = document.documentElement.clientWidth, vh = window.innerHeight; if (vw !== this.state.vw || vh !== this.state.vh) this.setState({ vw, vh }); if (this.isMob() || this.manual) return; const pin = this.pin(), sec = this.secRef.current; if (!pin || !sec) return; const r = pin.getBoundingClientRect(), rs = sec.getBoundingClientRect(), ent = Math.max(0, Math.min(1, r.top / vh));
      if (this.mode === 'film' && jumping() && (!this.scrolling || (window.__seJumpForced || 0) > performance.now())) { cancelAnimationFrame(this.sraf); this.scrolling = false; window.__seOwnScroll = false; this.pass(window.scrollY > this.yFor(this.idx || 0) ? 1 : -1); } /* owner (28 Oct): the logo / any jump passes at once, even mid-step */
      if (this.mode === 'film') { if (!this.inside() && !this.scrolling) { this.mode = 'out'; } else if (!this.scrolling && !this.anim) { const y = this.yFor(this.idx || 0); if (Math.abs(window.scrollY - y) > 2 && Math.abs(window.scrollY - y) < vh * 0.9) window.scrollTo(0, y); } }
      if (this.mode !== 'film' && !this.opRunning) { const p = this.passing ? (this.passing > 0 ? 1 : this.FS[0]) : rs.bottom < vh * 0.98 && rs.top < 0 ? 1 : this.FS[0]; if (p !== this.td.p && !this.anim) { this.td.p = p; this.td.snap = true; this.td.faceBack = p < 1; } }
      const q = Math.round(this.td.p * 1000) / 1000; if (q !== this.state.p || Math.abs(ent - this.state.ent) > 0.01) this.setState({ p: q, ent }); };
    // one gesture = one step; input while animating (and trackpad inertia) is swallowed; the two ends release the page
    this.gUsed = false; this.lastW = 0;
    this.onWheel = (e) => { if (this.isMob() || this.props.fw || !e.deltaY) return; if (this.mode !== 'film' || !this.inside()) return;
      const now = performance.now(), dy0 = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      // a short gap in a same-direction stream whose deltas are not growing is still the old gesture (decaying momentum,
      // or a main thread busy with the step delaying events) — only a real pause or a fresh, stronger push starts a new one
      const gap = now - (this.lastW || 0), prev = this.lastDy || 0, decaying = Math.sign(prev) === Math.sign(dy0) && Math.abs(dy0) <= Math.abs(prev) * 1.2;
      const quiet = gap >= 300 && !(decaying && gap < 600); this.lastDy = dy0;
      // R6 Part B: three gestures within 1.4s, a big flick or a jump → pass straight through
      if (quiet) { this.gSum = 0; (this.fresh = this.fresh || []).push(now); while (this.fresh.length && now - this.fresh[0] > 1400) this.fresh.shift(); }
      this.gSum = (this.gSum || 0) + Math.abs(dy0); const VW = (this.vw = this.vw || []); VW.push([now, Math.abs(dy0)]); while (VW.length && now - VW[0][0] > 600) VW.shift(); const v6 = VW.reduce((a2, x2) => a2 + x2[1], 0); /* owner (28 Oct): 'fast' = speed (px in the last 0.6s), not the total of a long steady scroll */
      if (jumping() || (this.fresh && this.fresh.length >= 6) || v6 > 2600 || Math.abs(dy0) > 700) /* Urgent 3: 3 unhurried wheel notches used to count as 'fast' and skip the whole film */ { this.lastW = now; e.preventDefault(); this.quick(Math.sign(dy0)); return; }
      e.preventDefault(); this.lastW = now; if (quiet) { this.gAcc = 0; this.gUsed = false; }
      // owner (28 Oct): the visitor drives it. Every ~260px of continuous scroll (the first push of a gesture: 40px) is one
      // step; steps asked for while one is playing are QUEUED (up to 3) and everything speeds up, so nobody waits for a
      // step to finish, and nobody has to pause before scrolling again. Trackpad momentum still counts, but slowly.
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1), dir = Math.sign(dy);
      if (Math.sign(this.gAcc || 0) !== dir) this.gAcc = 0; this.gAcc = (this.gAcc || 0) + dy;
      const need = this.gUsed ? (decaying ? 420 : 260) : 40; if (Math.abs(this.gAcc) < need) return;
      this.gUsed = true; this.gAcc = 0; this.ask(dir); };
    this.ask = (dir) => { const now = performance.now();
      if (this.busy()) { if (!this.blockedAt) this.blockedAt = now; if (now - this.blockedAt > 3000 && !this.opBusy()) { this.unstick(); this.blockedAt = 0; this.gesture(dir); return; }
        const Q = (this.q = this.q || []); if (Q.length && Q[Q.length - 1] !== dir) Q.length = 0; if (Q.length < 3) Q.push(dir); this.pendAt = now; return; }
      this.blockedAt = 0; this.gesture(dir); };
    // 14 Oct §07 A: root cause of 'scroll over and over': a gesture made during the opening or a step was dropped AND marked
    // its whole scroll stream as used, so it took a new pause + scroll to react. Now it is held (one deep) and played as soon as
    // the step lands; trackpad momentum still never counts twice.
    this.pendIv = setInterval(() => { if (this.pend) { this.q = (this.q || []).concat([this.pend]); this.pend = 0; } const Q = this.q || []; if (!Q.length) return; if (this.mode !== 'film' || performance.now() - this.pendAt > 4000) { Q.length = 0; return; } if (!this.busy()) { const d = Q.shift(); this.gesture(d); } }, 30);
    this.onKey = (e) => { if (this.isMob() || this.props.fw || this.mode !== 'film' || !this.inside()) return; const k = e.key, dir = k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey) ? 1 : k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey) ? -1 : 0; if (!dir) return; const tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA') return; e.preventDefault(); if (this.busy() || e.repeat) return; this.gesture(dir); };
    this.onTS = (e) => { this.ty = e.touches[0].clientY; this.tUsed = false; };
    this.onTM = (e) => { if (this.isMob() || this.props.fw || this.mode !== 'film' || !this.inside() || this.ty == null) return; e.preventDefault(); if (this.busy() || this.tUsed) return; const dy = this.ty - e.touches[0].clientY; if (Math.abs(dy) >= 40) { this.tUsed = true; this.gesture(Math.sign(dy)); } };
    // owner (28 Oct, lag): far from the teardown, its scroll work stops (one last update on leaving keeps its state right)
    this.tdNear = true; this.nearIO = new IntersectionObserver(([e]) => { const was = this.tdNear; this.tdNear = e.isIntersecting; if (was && !this.tdNear) { this.on(); this.opCheck(); } }, { rootMargin: '150% 0px 150% 0px' }); setTimeout(() => this.secRef.current && this.nearIO.observe(this.secRef.current), 60);
    this.onS = () => { if (this._onR || !this.tdNear) return; this._onR = requestAnimationFrame(() => { this._onR = 0; this.on(); }); }; /* R6 Part A: at most once per frame (it measures the page) */ window.addEventListener('scroll', this.onS, { passive: true }); window.addEventListener('resize', this.onS); window.addEventListener('wheel', this.onWheel, { passive: false }); window.addEventListener('keydown', this.onKey); window.addEventListener('touchstart', this.onTS, { passive: true }); window.addEventListener('touchmove', this.onTM, { passive: false }); this.on();
    this.onLogo = () => { const el = this.secRef.current, b = el && el.querySelector('[data-td-fmp]'); if (b && b.animate) b.animate([{ transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(247,192,50,.7)' }, { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(247,192,50,.28)', offset: 0.35 }, { transform: 'scale(1)', boxShadow: '0 0 0 22px rgba(247,192,50,0)' }], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' }); };
    window.addEventListener('se:td-logo', this.onLogo); this.onMM = () => { this.lastMM = performance.now(); }; window.addEventListener('mousemove', this.onMM, { passive: true });
    window.__tdDbg = () => ({ mode: this.mode, idx: this.idx, passing: this.passing, q: (this.q || []).length, busy: this.busy(), side: this.side, quick: !!this.quicking, p: this.td.p });
    window.seTd = (p) => { this.manual = true; this.stopAuto(); this.td.p = p; this.td.snap = true; this.setState({ p }); };
    this.onLib = (e) => this.setState({ lib: e.detail }); window.addEventListener('se:parts-lib', this.onLib); if (window.seParts) { const lb = window.seParts.peek(); if (lb) this.setState({ lib: lb }); } this.td.onThumbs = (u) => this.setState({ thumbs: u }); if (this.td.thumbs) this.setState({ thumbs: this.td.thumbs });
    window.seOp = (t) => { cancelAnimationFrame(this.oraf); const oT = Math.max(0, Math.min(3.4, t)); this.td.oT = oT >= 3.4 ? null : oT; this.td.lt = this.lightAt(oT); this.setState({ oT, cT: oT >= 3.0 ? Math.min(1, (oT - 3.0) / 0.35) : 0 }); const r = this.td.renderNow; if (r) for (let k = 0; k < 6; k++) r(); };
    this.td.op = 1; this.opScroll = () => { if (this._opR || !this.tdNear) return; this._opR = requestAnimationFrame(() => { this._opR = 0; this.opCheck(); }); }; window.addEventListener('scroll', this.opScroll, { passive: true }); this.opPoll = setInterval(() => { if (this.tdNear) this.opCheck(); }, 200); setTimeout(() => this.opCheck(), 120);
    window.seStep = (i) => { this.manual = true; this.goTo(i); };
    // capture: jump to an exact frame without animation (step i, finale text clock ft)
    window.__td = this.td; window.__tdc = this;
    window.seToss = (el) => { this.capToss = true; this.tossOn = true; cancelAnimationFrame(this.graf); this.td.tossAt = el; this.setState({ gT: Math.max(0, Math.min(1.1, el - 2.25)) }); const r = this.td.renderNow; if (r) for (let k = 0; k < 6; k++) r(); };
    window.seJump = (i, ft) => { this.manual = true; this.tossOn = false; cancelAnimationFrame(this.twRaf); cancelAnimationFrame(this.fraf); this.anim = false; const p = this.S[i]; this.td.p = p; this.td.snap = true; this.td.op = 1; const fin = p >= 0.91; this.td.oT = null; this.td.lt = 1; this.setState({ p, si: i, ps: -1, cT: 1, oT: 3.4, gT: i >= 1 ? 1.1 : 0, fo: fin, ft: fin ? (ft == null ? 6 : ft) : 0 }); if (fin) this.td.adGo = true; const r = this.td.renderNow; if (r) for (let k = 0; k < 90; k++) r(); };
    window.seAdT = (t) => { this.td.adGo = true; this.td.adT = t; }; window.seAdShot = (t) => (this.td.adShot ? this.td.adShot(t) : '');
    window.seTdShot = () => { this.td.renderNow && this.td.renderNow(); const c = this.hostRef.current && this.hostRef.current.querySelector('canvas:last-of-type'); return c ? c.toDataURL() : ''; };
    if (!this.isMob()) { this.td.p = this.S[0]; this.setState({ p: this.S[0] }); }
    this.setup(); this.measureCol();
  }
  measureCol() { const f = this.finRef.current; if (f && f.offsetHeight) { const sc = Math.min(1, ((this.props.fh || this.state.vh) - 152) / f.offsetHeight); if (Math.abs(sc - this.state.fs) > 0.01) this.setState({ fs: sc }); } }
  setup() {
    const mob = this.isMob(); this._mob = mob; this.td.mob = mob;
    this.dispose && this.dispose(); this.dispose = null; this.io && this.io.disconnect(); this.stopAuto();
    const tok = (this._tok = (this._tok || 0) + 1);
    const boot = (n) => { const host = this.hostRef.current; if (tok !== this._tok) return; if (!host) { if (n < 80) setTimeout(() => boot(n + 1), 100); else { this.setState({ loading: false }); this.opShow('3D host never mounted'); } return; } import(/* webpackIgnore: true */ new URL('./se-teardown-3d.js', document.baseURI).href).then((m) => m.mount(host, this.td)).then((d) => { if (tok !== this._tok) { d(); return; } this.dispose = d; this.ready3d = true; this.setState({ loading: false }); setTimeout(() => this.opCheck(), 30); }).catch((e) => { this.failed3d = true; this.setState({ loading: false }); this.opShow('3D failed to load: ' + (e && e.message)); }); }; setTimeout(() => boot(0), 60);
    if (mob) { this.at(0.02); setTimeout(() => { const el = this.secRef.current; if (!el) return; this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (!this.played) { this.played = true; this.play(); } } else if (this.played && e.boundingClientRect.top > 0) { this.played = false; this.stopAuto(); this.at(0.02); } }, { threshold: 0.3 }); this.io.observe(el); }, 80); }
  }
  stopAuto() { (this.tm || []).forEach(clearTimeout); this.tm = []; cancelAnimationFrame(this.twRaf); }
  at(p) { this.td.p = p; this.setState({ p }); }
  tween(to, ms) { cancelAnimationFrame(this.twRaf); const from = this.td.p, t0 = performance.now(); this.anim = true; const f = (t) => { const k = Math.min(1, (t - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, p = from + (to - from) * e; this.td.p = p; const q = Math.round(p * 1000) / 1000; if (q !== this.state.p) this.setState({ p: q }); if (k < 1) this.twRaf = requestAnimationFrame(f); else this.anim = false; }; this.twRaf = requestAnimationFrame(f); }
  stepP(k) { const T = this.T; return k < 0 ? 0.262 : k >= 7 ? 0.668 : T.l0 + k * T.ls + T.ld; }
  goStep(k) { this.stopAuto(); const to = this.stepP(k); this.tween(to, Math.max(500, Math.abs(to - this.td.p) * 9000)); }
  play() { this.stopAuto(); const q = [[0.12, 1800], [0.185, 1300], [0.262, 1400], [-1, 900]]; for (let k = 0; k < 8; k++) q.push([this.stepP(k), 750], [-1, 1500]); q.push([0.745, 1800], [-1, 400], [0.9, 3200], [1, 2600]); let t = 0; this.tm = []; q.forEach(([to, ms]) => { if (to >= 0) this.tm.push(setTimeout(() => this.tween(to, ms), t)); t += ms; }); }
  componentWillUnmount() { this.nearIO && this.nearIO.disconnect(); this._colRO && this._colRO.disconnect(); this.unregGL && this.unregGL(); clearInterval(this.opPoll); clearInterval(this.pendIv); this.opRunning = false; cancelAnimationFrame(this.oraf); clearTimeout(this.opWd); window.removeEventListener('scroll', this.opScroll); cancelAnimationFrame(this.fraf); cancelAnimationFrame(this.craf); cancelAnimationFrame(this.sraf); clearTimeout(this.adTm); clearTimeout(this.psTm); clearInterval(this.dIv); this.stopAuto(); this.io && this.io.disconnect(); window.removeEventListener('scroll', this.onS); window.removeEventListener('resize', this.onS); window.removeEventListener('wheel', this.onWheel); window.removeEventListener('keydown', this.onKey); window.removeEventListener('touchstart', this.onTS); window.removeEventListener('touchmove', this.onTM); window.removeEventListener('se:td-logo', this.onLogo); window.removeEventListener('se:parts-lib', this.onLib); this.dispose && this.dispose(); }
  tossCheck() { if (this.isMob() || this.anim || this.revOn || this.capToss || this.mode === 'film' || this.manual) return; const p = this.state.p; if (!this.tossOn && p > 0.178) this.tossStart(true); else if (this.tossOn && p < 0.1505) this.tossEnd(); }
  componentDidUpdate() { if (this.tdNear === false) return; this.tossCheck(); if (this.isMob() !== this._mob) { this.setState({ loading: true }); this.setup(); } if (!this._colRO && this.finRef.current && typeof ResizeObserver !== 'undefined') { this._colRO = new ResizeObserver(() => this.measureCol()); this._colRO.observe(this.finRef.current); } /* Urgent (speed): measureCol forced a layout on every update; now only when the column resizes */ this.measureTitle(); this.finTrig(); this.cardTrig(); }
  // part card: on a step change keep the old card for its exit and count the new numbers up
  cardTrig() { if (this.isMob()) return; const S = this.S, p = this.state.p; let si = 0, bd = 9; S.forEach((v, i) => { const d = Math.abs(v - p); if (d < bd) { bd = d; si = i; } }); if (p > 0.16 && p < 0.29) si = 1; if (si === this.state.si) return; this.td.act = si >= 2 && si <= 9 ? si - 2 : -1; const cm = (i) => Math.max(0, i - 1); if (cm(si) === cm(this.state.si)) { this.setState({ si }); return; } this.setState({ ps: this.state.si, si, cT: 0 }); clearTimeout(this.psTm); this.psTm = setTimeout(() => this.setState({ ps: -1 }), 240); const t0 = performance.now(); cancelAnimationFrame(this.craf); const f = (t) => { const k = Math.min(1, (t - t0 - 180) / 700); this.setState({ cT: Math.max(0, k) }); if (k < 1) this.craf = requestAnimationFrame(f); }; this.craf = requestAnimationFrame(f); }
  finTrig() { const p = this.state.p; if (!this.state.fo && p >= 0.91) { this.setState({ fo: true, ft: 0 }); this.inkHit = false; const t0 = performance.now(); cancelAnimationFrame(this.fraf); const f = (t) => { const ft = (t - t0) / 1000; if (!this.inkHit && ft >= 0.62) { this.inkHit = true; this.td.impact && this.td.impact(2); } this.setState({ ft: Math.min(ft, 2.6) }); if (ft < 2.6) this.fraf = requestAnimationFrame(f); }; this.fraf = requestAnimationFrame(f); clearTimeout(this.adTm); this.adTm = setTimeout(() => { this.td.adGo = true; }, 550); } else if (this.state.fo && p < 0.9) { cancelAnimationFrame(this.fraf); clearTimeout(this.adTm); this.td.adGo = false; this.setState({ fo: false, ft: 0 }); } }
  renderVals() {
    const s = this.state, D = s.data, P = D ? D.products : [], p = s.p, T = this.T, cl = (x) => Math.min(1, Math.max(0, x)), sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); }, lerp = (a, b, k) => a + (b - a) * k;
    const eoF = (x) => { x = cl(x); return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); };
    const fmt = (n) => Math.round(n).toLocaleString('en-US'), GN = ((typeof window !== 'undefined' && window.SE_DATA && window.SE_DATA.gradeNames) || {}) /* R6 Part E: Excel qualities */;
    if (this._D !== D) { this._D = D; this._st = {}; }
    const stat = (c) => this._st[c] || (this._st[c] = (() => { let ps; if (c === '*') ps = P.filter((x) => x.category !== 'TLS'); else { const [cat, part] = c.split(':'); ps = P.filter((x) => x.category === cat); if (part != null) ps = ps.filter((_, i) => i % 2 === Number(part)); } const g = ['OR', 'OL', 'IN', 'AQ'].filter((k) => ps.some((x) => x.grade === k)).map((k) => GN[k]); const MB = {}; (D ? D.models : []).forEach((m) => (MB[m.id] = m.brand_id || m.brand)); const bset = new Set(ps.map((x) => MB[x.model_id]).filter(Boolean)), br = bset.size, bl = (D ? D.brands : []).filter((b2) => bset.has(b2.id)).map((b2) => b2.name), bi = (D ? D.brands : []).filter((b2) => bset.has(b2.id)).map((b2) => b2.id); return { bl, bi, brands: br || 1, stock: Math.max(1, ps.reduce((a, x) => a + x.stock_qty, 0)), min: ps.length ? Math.min(...ps.map((x) => x.retail_price)) : 1, grades: g.length ? g : ['Original'] }; })());
    const mob = this.isMob(), vw = this.props.mob ? 390 : this.props.fw || s.vw, vh = this.props.fh || s.vh;
    const go = (id) => (ev) => { ev && ev.preventDefault && ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:go', { detail: { id } })); };
    let act = -1; for (let i = 0; i < 7; i++) if (p >= T.l0 + i * T.ls && p < T.l0 + (i + 1) * T.ls && p < T.re0) act = i; if (p >= T.b8 && p < T.sh0) act = 7;
    const allLit = p >= T.sh0, fin = sm((p - 0.82) / 0.07);
    { const mono = (v) => '<span style="font-family:JetBrains Mono,monospace;font-weight:600">' + v + '</span>', dot = '<span style="color:rgba(255,255,255,.4)">·</span>';
      const T_ = (x) => (window.seI18n ? window.seI18n.t(x) : x); // 14 Oct §04: hover tags in the page language
      this.td.tags = this.L.map(([t, c]) => { const ss = stat(c); return '<span style="font-weight:600">' + T_(t) + '</span>' + dot + mono(fmt(ss.stock)) + ' ' + T_('in stock') + dot + mono(ss.brands) + ' ' + T_('brands'); });
      const fl = stat('FLX'), sp = stat('SML'); this.td.adData = { N: this.L.map(([, c]) => stat(c).stock), B: this.L.map(([, c]) => stat(c).brands), brands: D && D.brands ? D.brands.length : 14 }; }
    this.td.spec = this.L.map(([, c], i) => { const ss = stat(c), n = ss.grades.length + (ss.grades.length === 1 ? ' GRADE' : ' GRADES'); return i === 0 ? ['OLED · INCELL', 'COVER GLASS', n] : i === 4 ? ['LI-ION', 'CHARGE LEVEL', n] : null; });
    const st = (k) => T.l0 + (k - 1) * T.ls;
    const floorK = cl((p - st(1)) / (2 * T.ls)), scanK = cl((p - st(5)) / (2 * T.ls));
    const bg = { g: (sm((p - T.rise0) / 0.1) * 0.9).toFixed(3), flood: '0', fin: fin.toFixed(3), floorO: (floorK > 0 ? 0.55 * (1 - fin) : 0).toFixed(3) };
    const mkFloor = (W0, H0, n) => { const out = [], vx = W0 / 2, vy = -H0 * 0.9; for (let i = 0; i < n; i++) { const bx = -W0 * 0.6 + (i / (n - 1)) * W0 * 2.2; out.push({ d: 'M' + bx.toFixed(0) + ' ' + H0 + ' L' + (vx + (bx - vx) * 0.32).toFixed(0) + ' 0' }); } [0.18, 0.4, 0.66, 0.95].forEach((y) => out.push({ d: 'M0 ' + (H0 * y).toFixed(0) + ' H' + W0 })); return out.map((l, i) => ({ ...l, off: (1 - cl(floorK * 1.6 - (i % 7) * 0.08)).toFixed(3), o: i >= n ? 0.7 : 0.45 })); };
    const floorM = mob ? mkFloor(390, 300, 9) : [];
    const words = ['Take', 'any', 'phone', 'apart.'].map((t, i) => { const k = sm((p - 0.004 - i * 0.009) / 0.014); return { t, o: k.toFixed(2), b: ((1 - k) * 14).toFixed(1), y: ((1 - k) * 12).toFixed(1) }; });
    const hd = { o2: (sm((p - 0.035) / 0.025) * (1 - sm((p - T.lay0) / (T.lay1 - T.lay0)))).toFixed(3) };
    const rowsM = this.L.map(([t], i) => { const on = !allLit && i === act, done = allLit || (act >= 0 && i < act); return { i: String(i + 1).padStart(2, '0'), t, sub: on ? '#F7C032' : done ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.45)', bg: on || done ? '#3D3E3F' : '#26282B', dot: on || done ? '#F7C032' : '#5E6064', glow: on ? '0 0 0 2px #F7C032,0 0 26px rgba(247,192,50,.95)' : done ? '0 0 0 1.5px #F7C032,0 0 14px rgba(247,192,50,.5)' : 'inset 0 0 0 1.5px #5E6064', pick: () => this.goStep(i) }; });
    const MW = ['Every', 'layer.', 'Every', 'brand.', 'In', 'stock', 'in', 'Deira.'];
    const msgWords = MW.map((t, i) => { const k = sm((p - 0.89 - i * 0.005) / 0.012); return { t, o: k.toFixed(2), b: ((1 - k) * 10).toFixed(1) }; });

    const cntK = mob ? sm((p - 0.93) / 0.04) : 1 - Math.pow(1 - cl((s.ft - 0.5) / 1.0), 3);
    const cIn = (k) => (mob ? 1 : sm((s.ft - 0.55 - k * 0.08) / 0.35));
    const counts = [[8, '', 'LAYERS IN STOCK'], [((this.state.data && this.state.data.brands) || []).length || 15, '', 'BRANDS'], [9000, '+', 'PARTS']].map(([n, plus, t], k) => { const rk = mob ? 1 : eoF((s.ft - 0.75 - k * 0.18) / 0.45); return { v: fmt(Math.max(1, n * rk)) + plus, t, o: cIn(k).toFixed(3), y: Math.round((1 - cIn(k)) * 12), ry: ((1 - rk) * 90).toFixed(1), rb: rk >= 0.99 ? 'none' : 'blur(' + ((1 - rk) * 3).toFixed(1) + 'px)', pl: k ? 22 : 0, dv: 'none' /* Urgent 3: no outlines or dividers around the stats */ }; });
    const thumbs = window.SE_SHOTS ? (this._poseTh = this._poseTh || [0, 1, 2, 3, 4, 5, 6, 7].map((i) => window.SE_SHOTS.byIndex(i, 240))) : (s.lib && s.lib.thumb) || s.thumbs, /* Urgent 1: the pose */ chIn = (i) => (mob ? 1 : sm((s.ft - 1.0 - i * 0.04) / 0.3));
    const mxS = Math.max(1, ...this.L.map(([, cd]) => stat(cd).stock));
    const chips = this.L.map(([t, cd, , , kind], i) => { const on = s.hov === i, k = chIn(i); return { t, kind, stock: fmt(stat(cd).stock) + ' in stock', img: thumbs ? thumbs[i] : '', hasImg: !!thumbs, noImg: !thumbs, o: k.toFixed(3), y: on ? -4 : Math.round((1 - k) * 14), rt: on ? 'perspective(240px) rotateY(-18deg) rotateZ(-3deg) scale(1.07)' : 'none', ln: on ? 1 : 0, sh: on ? '0 18px 36px rgba(0,0,0,.34)' : '0 10px 24px rgba(0,0,0,.18)', bd: on ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.1)', go: go('models'), enter: () => { if (performance.now() - (this.lastMM || 0) > 200) return; this.td.hover = i; this.setState({ hov: i }); }, leave: () => { if (this.td.hover === i) this.td.hover = null; if (this.state.hov === i) this.setState({ hov: -1 }); } }; });
    const ci = Math.max(0, Math.min(7, act < 0 ? (allLit ? 7 : 0) : act)), a = this.L[ci], cs = stat(a[1]);
    const msgM = { c: sm((p - 0.93) / 0.03).toFixed(2), ch: sm((p - 0.95) / 0.015).toFixed(2), b: sm((p - 0.962) / 0.015).toFixed(2) };
    const glowM = { o: ((sm((p - T.l0 - 4 * T.ls) / (2 * T.ls)) * 0.9 + sm((p - T.rise0) / 0.05) * 0.1) * (1 - fin * 0.5)).toFixed(2) };
    // desktop: three zones (30 · 45 · 25), whole stage pinned
    const si = s.si, NAV = 72, last = this.S.length - 1, finalCall = si === last;
    const z1x = Math.round(Math.max(40, vw * 0.035)), z1w = Math.round(vw * 0.3 - z1x - 8), hf = Math.round(Math.min(86, z1w / 11.4));
    const gone = finalCall || p > 0.875, chA = Math.round(vh - 112 - 40 - 28 - 31 - hf * 1.96), ch = Math.max(250, Math.min(452, chA)) /* R6 §05 C: room for the brand logos at 20px */, z1 = { x: z1x, w: z1w, hf, ch, cg: ch >= 340 ? 12 : ch >= 300 ? 8 : 5, nf: Math.round(Math.max(20, Math.min(30, (z1w - 96) / 8.5, (ch - 200) / 4.5))), cp: ch >= 300 ? 22 : 16, o: gone ? 0 : 1, pe: gone ? 'none' : 'auto' };
    const z3 = { x: Math.round(vw * 0.75 + 12), w: Math.round(vw * 0.25 - 52), o: gone ? 0 : 1, pe: gone ? 'none' : 'auto', gx: gone ? 32 : 0 }; z1.gx = gone ? -32 : 0;
    // R6 Part D: Arabic mirrors the stage with the same distances (title + card on the right, numbered list on the left); the
    // 3D phone's centre, its callouts and the list connector mirror too (public/se-teardown-3d.js), the phone itself is not flipped
    const rtl = document.documentElement.dir === 'rtl'; if (rtl) { z1.x = vw - z1.x - z1.w; z3.x = vw - z3.x - z3.w; z1.gx = -z1.gx; z3.gx = -z3.gx; }
    z1.sl = rtl ? 'auto' : z1.x + 'px'; z1.sr = rtl ? vw - z1.x - z1.w + 'px' : 'auto'; // the skip link sits at the zone's reading start
    const oT = mob ? 3.4 : s.oT == null ? 3.4 : s.oT, oc = (x) => Math.min(1, Math.max(0, x)), oe = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * oc(x))), tl = this.tl;
    const oU = mob ? 3.4 : oT < 3.4 ? Math.min(oT, 2.3) : 2.3 + (s.gT == null ? 0 : s.gT); this.td.koOn = !mob && oU < 3.4;
    const sc0 = tl ? Math.min(96 / hf, (vw * 0.82) / tl.w) : 1, gK = oe((oU - 2.3) / 0.7), gY = 1 - Math.pow(1 - gK, 2.2), scO = lerp(sc0, 1, gK);
    const tx0 = tl ? vw / 2 - (tl.w * sc0) / 2 - tl.l : 0, ty0 = tl ? vh * 0.42 - (tl.h * sc0) / 2 - tl.t : 0;
    const opWords = ['Take', 'any', 'phone', 'apart.'].map((w, i) => { const t0 = 0.4 + i * 0.09, x = oc((oT - t0) / 0.55), k = oe(x), v = oT > t0 && x < 1 ? Math.pow(2, -10 * x) : 0, sw = oc(((oT - 1.22) / 0.4) * 1.6 - i * 0.2); return { w, o: oc(k * 1.8).toFixed(3), y: ((1 - k) * 40 / scO).toFixed(2), sc: (1 + 0.04 * (1 - k)).toFixed(4), f: k >= 0.995 ? 'none' : 'blur(' + ((1 - k) * 6 / scO).toFixed(2) + 'px) drop-shadow(0 ' + (v * 14 / scO).toFixed(1) + 'px ' + (v * 6 / scO).toFixed(1) + 'px rgba(255,255,255,.3))', bp: (100 - sw * 100).toFixed(1), ks: (1.3 / scO).toFixed(2) }; });
    const ok2 = (a, dd) => oe((oU - a) / dd), rk = ok2(2.25, 0.4);
    const lt0 = this.lightAt(oT), cardIn = oU >= 3.0;
    const op = { tx: (tx0 * (1 - gK)).toFixed(1), ty: (ty0 * (1 - gY)).toFixed(1), sc: scO.toFixed(4), l2: ((1 - ok2(2.45, 0.45)) * (rtl ? 170 : 110)).toFixed(1) /* Arabic marks rise above the line box: hide the line further down */, e: ok2(2.65, 0.3).toFixed(3), ey: ((1 - ok2(2.7, 0.35)) * 100).toFixed(1), r: ok2(2.6, 0.35).toFixed(3), cy: ((1 - ok2(2.6, 0.4)) * 18).toFixed(1), cc: ((1 - ok2(2.85, 0.35)) * 100).toFixed(1), bd: (1 - ok2(2.6, 0.32)).toFixed(3), bo: (oU < 3.4 ? 1 - ok2(3.1, 0.3) : 0).toFixed(3), bw: Math.max(0, z1.w - 1.5), bh: Math.max(0, z1.ch - 1.5), pv: ((1 - lt0) * 0.85).toFixed(3), on: oU < 3.4, ko: oU < 3.4 ? 1 : 0 };
    const all = stat('*'), logosOf = (ss) => ({ ids: ss.bi || [], more: '' }) /* 14 Oct §07 E: all fitting brands, no '+N' */ /* G18: brands as logos */, fitsOf = (ss) => (ss.bl.length ? ss.bl.slice(0, 3).join(' · ') + (ss.bl.length > 3 ? ' · +' + (ss.bl.length - 3) : '') : 'All major brands');
    const cardFor = (k, live) => { const e = live ? 1 - Math.pow(1 - s.cT, 3) : 1, N = (v) => fmt(Math.max(1, v * e));
      const anim = (i) => (live ? 'tdCardIn .25s ' + (0.08 + i * 0.03).toFixed(2) + 's cubic-bezier(.16,1,.3,1) both' : 'none');
      let c;
      if (k >= 1 && k <= 8) { const [t, cd, cat, cta, kind] = this.L[k - 1], ss = stat(cd); c = { lab: String(k).padStart(2, '0') + ' / 08 · ' + cat, ng: ss.grades.length + (ss.grades.length === 1 ? ' GRADE' : ' GRADES'), name: t, kind, nums: [{ v: N(ss.stock), t: 'in stock', c: '#FFFFFF' }, { v: N(ss.brands), t: 'brands', c: '#FFFFFF' }, { v: N(ss.grades.length), t: ss.grades.length === 1 ? 'grade' : 'grades', c: '#F7C032' }], grades: ss.grades, fits: fitsOf(ss), fitsLogos: logosOf(ss), cta }; }
      else if (k === 9) c = { lab: 'ALL 8 LAYERS · BACK TOGETHER', ng: all.grades.length + ' GRADES', name: 'One complete phone', kind: 'board', nums: [{ v: N(8), t: 'layers', c: '#FFFFFF' }, { v: N(all.brands), t: 'brands', c: '#FFFFFF' }, { v: N(all.stock), t: 'parts', c: '#F7C032' }], grades: all.grades, fits: fitsOf(all), fitsLogos: logosOf(all), cta: 'Shop all parts' };
      else c = { lab: '8 LAYERS · EVERY MAJOR BRAND', ng: all.grades.length + ' GRADES', name: 'Every part on the shelf', kind: 'scr', nums: [{ v: N(8), t: 'layers', c: '#FFFFFF' }, { v: N(all.brands), t: 'brands', c: '#FFFFFF' }, { v: N(all.stock), t: 'parts', c: '#F7C032' }], grades: all.grades, fits: fitsOf(all), fitsLogos: logosOf(all), cta: 'Shop all parts' };
      // R6 §05 C: Shop opens that layer's part family (the Shop page is G17 "Coming soon"; Find My Part meanwhile); the
      // logic board is not in the owner's Excel, so it is "Ask us" on WhatsApp
      const fam = k >= 1 && k <= 8 ? this.L[k - 1] : null, catId = fam ? fam[1].split(':')[0] : null;
      const shopGo = (ev) => { ev && ev.preventDefault && ev.preventDefault();
        if (fam && fam[4] === 'board') { const D2 = this.state.data; window.open('https://wa.me/' + ((D2 && D2.contact && D2.contact.wa) || '971503420015') + '?text=' + encodeURIComponent('Hi Sam Electronics, do you have logic board parts for my phone?'), '_blank', 'noopener'); return; }
        const famName = catId && this.state.data ? (this.state.data.categories.find((x) => x.id === catId) || {}).name : '';
        comingSoon({ title: famName || 'Shop', text: 'The Shop page for ' + (famName ? famName.toLowerCase() : 'every part') + ' is coming soon. Use Find My Part in the meantime.', cta: 'Open Find My Part', act: () => window.dispatchEvent(new CustomEvent('se:fmp', { detail: {} })) }); };
      return { ...c, key: 'c' + k + (live ? 'L' : 'O'), go: shopGo, out: live ? 'none' : 'tdCardOut .2s cubic-bezier(.4,0,1,1) both', a0: anim(0), a1: anim(1), a2: anim(2), a3: anim(3), a4: anim(4) }; };
    const cmI = (i) => Math.max(0, i - 1), cards = (s.ps >= 0 && cmI(s.ps) !== cmI(si) && s.ps < last ? [cardFor(cmI(s.ps), false)] : []).concat(si < last && oT >= 3.0 ? [cardFor(cmI(si), true)] : []); if (cards.length) cards[cards.length - 1].key = cards[cards.length - 1].key + '-' + (s.ck || 0);
    const actR = si >= 2 && si <= 9 ? si - 2 : -1;
    const rowsD = this.L.map(([t], i) => { const on = i === actR, dn = si >= 10 || (actR >= 0 && i < actR);
      return { idx: i, i: String(i + 1).padStart(2, '0'), t, done: dn, tx: (rtl ? -1 : 1) * ((on ? -8 : 0) + (1 - oe((oU - 2.75 - i * 0.05) / 0.25)) * 12), o: Math.min(1, oe((oU - 2.75 - i * 0.05) / 0.25) * 1.6).toFixed(3), led: oU > 2.75 + i * 0.05 && oU < 2.87 + i * 0.05, tr: oT < 3.4 ? 'none' : 'transform .45s cubic-bezier(.2,.8,.2,1)', num: on ? '#F7C032' : dn ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.4)', ink: on ? '#FFFFFF' : dn ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.4)',
        bg: on || (oU > 2.75 + i * 0.05 && oU < 2.87 + i * 0.05) ? '#F7C032' : dn ? 'rgba(247,192,50,.65)' : '#3A3C40', glow: on || (oU > 2.75 + i * 0.05 && oU < 2.87 + i * 0.05) ? '0 0 0 3px rgba(247,192,50,.25),0 0 14px #F7C032' : dn ? '0 0 6px rgba(247,192,50,.35)' : 'inset 0 0 0 1px rgba(255,255,255,.35)', pick: () => this.goTo(i + 2) }; });
    const cur = mob ? (allLit ? 8 : act + 1) : si >= 2 && si <= 9 ? si - 1 : si >= 10 ? 8 : 1;
    const cnt = { n: String(Math.max(1, cur)).padStart(2, '0'), anim: (cur % 2 ? 'tdRollA' : 'tdRollB') + ' .4s cubic-bezier(.2,.8,.2,1) both', label: allLit ? 'ALL LAYERS IN STOCK' : 'LAYERS SEPARATED' };
    const top = NAV + 40, floorY = vh - 52, aH = floorY - top, sx = Math.round(lerp(vw * 0.525, vw * 0.66, sm((p - T.st0) / (T.st1 - T.st0)))), finK = sm((p - 0.895) / 0.03);
    const studio = { cx: rtl ? vw - sx : sx /* R6 Part D: the studio light follows the mirrored stage */, fy: floorY, prx: Math.round(aH * 0.95), pry: Math.round(aH * 0.3), wy: Math.round(floorY - aH * 0.48), wrx: Math.round(vw * 0.5), wry: Math.round(vh * 0.85), hy: Math.round(floorY - aH * 0.55), hrx: Math.round(aH * 0.36), hry: Math.round(aH * 0.55), fl0: Math.round(((floorY - aH * 0.2) / vh) * 100), fl1: Math.round((floorY / vh) * 100 + 2), br: '1', ent: (this.props.fh ? 0 : s.ent).toFixed(3), dim: (finK * 0.08).toFixed(3), vrx: Math.round(Math.max(380, vw * 0.3)), vry: Math.round(vh * 1.1), tgx: Math.round(Math.max(160, vw * 0.16)) };
    const ML = [['Every layer.', '#FFFFFF'], ['Every brand.', '#FFFFFF'], ['In stock in Deira.', '#F7C032']];
    const msgLines = ML.map(([t, c], i) => { const k = s.fo ? eoF((s.ft - 0.2 - i * 0.12) / 0.25) : 0; return { t, c, sh: i === 2 ? '#FFF2C2' : c, anim: i === 2 && s.ft > 1 ? 'tdSheen 5s 0.4s infinite' : 'none', o: cl(k * 2.5).toFixed(3), f: k >= 0.995 ? 'none' : 'blur(' + ((1 - k) * 8).toFixed(2) + 'px)', sc: (1 + 0.15 * (1 - k)).toFixed(4) }; });
    const lw = Math.round(Math.min(640, vw * 0.66 - vh * 0.2 - 140));
    const fe = (a0, d) => sm((s.ft - a0) / d), msg7 = { l: rtl ? vw - 80 - lw : 80, w: lw, fs: Math.round(Math.min(86, lw / 8.6)), pl: fe(0, 0.3).toFixed(2), plY: Math.round((1 - eoF(s.ft / 0.35)) * -48), plB: s.ft < 0.3 ? 'blur(' + ((1 - eoF(s.ft / 0.3)) * 6).toFixed(1) + 'px)' : 'none', s: s.fs.toFixed(3), o: s.fo ? 1 : 0, pe: s.fo && s.ft > 0.6 ? 'auto' : 'none', c: fe(0.5, 0.3).toFixed(2), ch: fe(1.2, 0.35).toFixed(2), chY: Math.round((1 - fe(1.2, 0.35)) * 10), b: fe(1.45, 0.3).toFixed(2), bY: Math.round((1 - fe(1.45, 0.3)) * 18), inv: (1 / s.fs).toFixed(4), bw: Math.round(lw * s.fs) };
    const skpOn = si < last, fx = !!this.props.fh;
    const tags = [];

    return { tags, secH: fx ? vh + 'px' : 'calc(100vh + ' + last * 60 + 'vh)', stageH: fx ? vh + 'px' : '100vh', z1, z3, cards, studio, fin: { o: (finK * 0.95).toFixed(3), cx: rtl ? 34 : 66 }, msgLines, secRef: this.secRef, hostRef: this.hostRef, finRef: this.finRef, loading: s.loading, desk: !mob, mob, bg, floorM, glow: glowM, hd, words, cnt, rows: mob ? rowsM : rowsD, msg: mob ? msgM : msg7, msgWords, counts, chips, chipH: Math.round(Math.min(78, Math.max(56, (lw - 30) / 4 * 0.55))), chipI: Math.round(Math.min(68, Math.max(48, (lw - 30) / 4 * 0.46))),
      hint: { o: si === 0 && s.oT != null && s.oT < 3.4 ? Math.max(0, Math.min(1, 1 - (oT - 0.4) / 0.2)) : 0 }, op, opWords, h2Ref: this.h2Ref,
      mag: { x: s.mag[0].toFixed(1), y: s.mag[1].toFixed(1), sh: s.fmpH ? '0 0 30px rgba(247,192,50,.45),0 10px 24px rgba(0,0,0,.25)' : '0 0 0 rgba(0,0,0,0)', ic: s.fmpH ? 'rotate(-14deg) scale(1.14)' : 'none' },
      fmpMove: (e) => { const r = e.currentTarget.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / (r.width / 2), dy = (e.clientY - r.top - r.height / 2) / (r.height / 2); this.setState({ mag: [Math.max(-1, Math.min(1, dx)) * 6, Math.max(-1, Math.min(1, dy)) * 4], fmpH: true }); },
      fmpLeave: () => this.setState({ mag: [0, 0], fmpH: false }),
      shop: { bd: s.shopH ? '#F7C032' : 'rgba(255,255,255,.32)', ty: s.shopH ? -2 : 0, sh: s.shopH ? '0 0 30px rgba(247,192,50,.35)' : '0 0 0 rgba(0,0,0,0)', ax: s.shopH ? 4 : 0 }, shopIn: () => this.setState({ shopH: true }), shopOut: () => this.setState({ shopH: false }), skp: { o: skpOn ? 1 : 0, pe: skpOn ? 'auto' : 'none' },
      skip: (ev) => { ev && ev.preventDefault && ev.preventDefault(); const el = this.secRef.current; if (!el) return; jumpTo(window.scrollY + el.getBoundingClientRect().bottom - NAV); },
      mt: { ink: fin > 0.5 ? '#26282B' : '#FFFFFF', sub: fin > 0.5 ? '#26282B' : '#F7C032' }, mRail: fin < 0.5, mFin: fin >= 0.5,
      railFill: (allLit ? 1 : Math.max(0, act) / 7).toFixed(3),
      prev: () => this.goStep(Math.max(-1, act - 1)), next: () => this.goStep(Math.min(7, act + 1)), replay: () => { this.stopAuto(); this.at(0.02); setTimeout(() => this.play(), 200); },
      openFmp: (ev) => { ev && ev.preventDefault && ev.preventDefault(); window.dispatchEvent(new CustomEvent('se:fmp', { detail: {} })); }, shopAll: go('models'),
      card: { cat: a[2], name: a[0], kind: a[4], stock: fmt(cs.stock), brands: fmt(cs.brands), grades: cs.grades, cta: a[3], go: go('models') } };
  }
}

export default Component;
