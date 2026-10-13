// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Launcher.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';
import { createScheduler } from '@/components/samsoom/scheduler';
import { UNIVERSAL } from '@/components/samsoom/brain';

class Component extends DCLogic {
  state = { mood: 'idle', mi: 0, open: false, tw: 0, lx: 0, ly: 0, cycles: 0 };
  rootRef = React.createRef(); txtRef = React.createRef();
  componentDidMount() {
    this.rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.tm = []; window.__seLauncher = this; this.ign = 0; this.alt = 0;
    if (this.rm) this.setState({ mood: 'happy', open: true });
    else {
      // G8: every face change goes through the emote scheduler (3s emotes, never cut off, no repeats)
      this.sch = createScheduler({ onMood: (mood) => !this.dead && this.setState({ mood }), emotes: UNIVERSAL.filter((e) => e !== 'wave') });
      this.later(1200, () => this.cycle());
      this.mm = (e) => { if (this.state.mood !== 'idle') return; const n = performance.now(); if (n - (this._t || 0) < 90) return; this._t = n; const r = this.rootRef.current && this.rootRef.current.getBoundingClientRect(); if (!r) return; const cl = (v) => Math.max(-1, Math.min(1, v)); const lx = Math.round(cl((e.clientX - (r.left + 28)) / 420) * 10) / 10, ly = Math.round(cl((e.clientY - (r.top + 28)) / 420) * 10) / 10; if (lx !== this.state.lx || ly !== this.state.ly) this.setState({ lx, ly }); };
      window.addEventListener('mousemove', this.mm, { passive: true });
    }
    this.measure();
  }
  componentWillUnmount() { this.dead = true; this.sch && this.sch.stop(); this.tm.forEach(clearTimeout); window.removeEventListener('mousemove', this.mm); }
  componentDidUpdate() { this.measure(); }
  later(d, f) { this.tm.push(setTimeout(f, d)); }
  msgs() { const p = this.props; return [p.m0 || 'Ask Samsoom', p.m1 || 'Open till 22:00', p.m2 || 'Need a screen?', p.m3 || 'Trade prices? Ask me', p.m4 || 'Track my order']; }
  // G8 cycle, 16s: wave + smile (circle, 3s) → "Ask Samsoom" → collapse + blink → a page message while he
  // plays the next emote from the bag (3s) → collapse → repeat. Each emote is followed by a 5s rest.
  // After 3 ignored cycles he yawns once and rests (still blinking and following the cursor).
  cycle() {
    if (this.ign >= 3) { this.setState({ open: false }); this.sch.play('yawn'); return; }
    const sub = 1 + (this.alt++ % 4);
    this.setState({ open: false });
    this.sch.play('wave');
    this.later(3000, () => this.setState({ mi: 0, open: true }));
    this.later(6600, () => { this.setState({ open: false }); this.sch.base('blink'); });
    this.later(7900, () => this.sch.base('idle'));
    this.later(8000, () => { this.sch.play(this.sch.next()); this.setState({ mi: sub, open: true }); });
    this.later(13200, () => this.setState({ open: false }));
    this.later(16000, () => { this.ign++; this.cycle(); });
  }
  wake() { if (this.ign >= 3) { this.ign = 0; this.tm.forEach(clearTimeout); this.tm = []; this.cycle(); } else this.ign = 0; }
  measure() { const el = this.txtRef.current; if (!el) return; const w = Math.ceil(el.scrollWidth); if (w && w !== this.state.tw) this.setState({ tw: w }); }
  renderVals() {
    const s = this.state, MAXT = 280 - 60 - 16, msg = this.msgs()[s.mi], tw = s.tw || msg.length * 8.2, over = tw > MAXT;
    const w = s.open ? Math.round(60 + Math.min(tw, MAXT) + 18) : 56;
    const dur = Math.max(4, (tw - MAXT) / 28 + 3);
    return {
      rootRef: this.rootRef, txtRef: this.txtRef, click: () => { this.wake(); this.props.onOpen && this.props.onOpen(); }, poke: () => this.wake(), jc: over ? 'flex-start' : 'center', mood: s.mood, still: !!this.rm, lx: s.lx, ly: s.ly,
      w, msg, mi: s.mi, txtO: s.open ? 1 : 0,
      padL: over ? 10 : 0, padR: over ? 14 : 0, tx: over ? -(tw - MAXT) : 0, tick: over && s.open && !this.rm ? 'lnTick ' + dur.toFixed(1) + 's linear .6s infinite' : 'lnIn .3s cubic-bezier(.2,.8,.2,1) both',
      mask: over ? 'linear-gradient(90deg,transparent 0,#000 10px,#000 calc(100% - 14px),transparent)' : 'none',
      dotAnim: this.rm ? 'none' : 'lnDot 2.2s cubic-bezier(.45,0,.55,1) infinite'
    };
  }
}

export default Component;
