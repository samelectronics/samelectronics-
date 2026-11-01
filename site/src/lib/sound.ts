'use client';
// R9 · the site's own sound effects, synthesized live with Web Audio (nothing to download): short, quiet, "tech" blips,
// each kind of action with its own. Three packs (classic, soft, arcade), a volume and an off switch in Settings; always
// silent in the Control Room and when the visitor asked the system for reduced motion.
import { prefs } from './prefs';

export type Snd = 'click' | 'add' | 'next' | 'back' | 'skip' | 'toggle' | 'open' | 'close' | 'error' | 'success' | 'send';
type Note = [freq: number, at: number, dur: number, type?: OscillatorType, glideTo?: number];
const SHAPES: Record<Snd, Note[]> = {
  click: [[1800, 0, 0.03, 'square']],
  toggle: [[900, 0, 0.04, 'square'], [1350, 0.045, 0.04, 'square']],
  next: [[660, 0, 0.06, 'triangle', 990]],
  back: [[990, 0, 0.06, 'triangle', 660]],
  skip: [[700, 0, 0.05, 'sine'], [520, 0.05, 0.07, 'sine']],
  open: [[440, 0, 0.09, 'sine', 880]],
  close: [[880, 0, 0.09, 'sine', 440]],
  add: [[523, 0, 0.07, 'triangle'], [784, 0.07, 0.07, 'triangle'], [1046, 0.14, 0.12, 'triangle']],
  success: [[660, 0, 0.08, 'sine'], [880, 0.08, 0.08, 'sine'], [1320, 0.16, 0.16, 'sine']],
  send: [[600, 0, 0.14, 'sawtooth', 1800]],
  error: [[220, 0, 0.12, 'square'], [180, 0.13, 0.16, 'square']],
};
const PACK = { classic: { mul: 1, gain: 1, type: null as OscillatorType | null }, soft: { mul: 0.75, gain: 0.7, type: 'sine' as OscillatorType }, arcade: { mul: 1.25, gain: 0.8, type: 'square' as OscillatorType } };
let ctx: AudioContext | null = null, last = 0;

export function play(s: Snd, force = false) {
  if (typeof window === 'undefined') return;
  const p = prefs().sound;
  if (!force && (!p.on || p.vol <= 0)) return;
  if (location.pathname.startsWith('/staff')) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches && !force) return;
  const now = performance.now(); if (now - last < 35) return; last = now; // never a burst of clicks
  try {
    ctx = ctx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const pk = PACK[p.pack] || PACK.classic, t0 = ctx.currentTime + 0.005, master = ctx.createGain();
    master.gain.value = Math.min(1, Math.max(0, p.vol)) * 0.22 * pk.gain; master.connect(ctx.destination);
    for (const [f, at, d, type, to] of SHAPES[s]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = pk.type || type || 'sine'; o.frequency.setValueAtTime(f * pk.mul, t0 + at);
      if (to) o.frequency.exponentialRampToValueAtTime(to * pk.mul, t0 + at + d);
      g.gain.setValueAtTime(0.0001, t0 + at); g.gain.exponentialRampToValueAtTime(1, t0 + at + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + d);
      o.connect(g); g.connect(master); o.start(t0 + at); o.stop(t0 + at + d + 0.02);
    }
  } catch { /* audio not available */ }
}
