'use client';
// R9 · the site's own sound effects, synthesized live with Web Audio (nothing to download): short, quiet, "tech" blips,
// each kind of action with its own. Three packs (classic, soft, studio), a volume and an off switch in Settings; always
// silent in the Control Room and when the visitor asked the system for reduced motion.
import { prefs } from './prefs';

export type Snd = 'click' | 'add' | 'next' | 'back' | 'skip' | 'toggle' | 'open' | 'close' | 'error' | 'success' | 'send' | 'notify';
type Note = [freq: number, at: number, dur: number, type?: OscillatorType, glideTo?: number];
// R10 B8: one family built around the bell's "open" sound the owner likes: soft, low, rich. Sine and triangle only,
// everything under ~900 Hz and through a gentle low-pass, so nothing squeaks. Open and close keep their heavier sweep.
const SHAPES: Record<Snd, Note[]> = {
  click: [[520, 0, 0.045, 'sine', 430], [260, 0, 0.05, 'sine']],
  toggle: [[440, 0, 0.05, 'sine'], [587, 0.05, 0.06, 'sine']],
  next: [[392, 0, 0.07, 'triangle', 523]],
  back: [[523, 0, 0.07, 'triangle', 392]],
  skip: [[494, 0, 0.06, 'sine'], [370, 0.06, 0.08, 'sine']],
  open: [[330, 0, 0.11, 'sine', 660], [165, 0, 0.12, 'sine', 330]],
  close: [[660, 0, 0.11, 'sine', 330], [330, 0, 0.12, 'sine', 165]],
  add: [[392, 0, 0.07, 'triangle'], [523, 0.07, 0.07, 'triangle'], [659, 0.14, 0.13, 'sine']],
  success: [[440, 0, 0.08, 'sine'], [554, 0.08, 0.08, 'sine'], [659, 0.16, 0.18, 'sine']],
  send: [[300, 0, 0.16, 'sine', 720]],
  error: [[196, 0, 0.12, 'triangle'], [165, 0.13, 0.16, 'triangle']],
  // R11: a notification: two soft bell tones in the same family as 'open'
  notify: [[587, 0, 0.16, 'sine'], [880, 0.12, 0.32, 'sine'], [294, 0, 0.3, 'sine']],
};
// Classic: the set as written. Soft: lower and quieter. Studio: a touch brighter and warmer, with a short room echo.
const PACK = { classic: { mul: 1, gain: 1, type: null as OscillatorType | null, lp: 1800, echo: 0 }, soft: { mul: 0.8, gain: 0.65, type: 'sine' as OscillatorType, lp: 1200, echo: 0 }, studio: { mul: 1.12, gain: 0.85, type: null as OscillatorType | null, lp: 2400, echo: 0.18 } };
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
    const pk = PACK[(p.pack as string) === 'arcade' ? 'studio' : p.pack] || PACK.classic, t0 = ctx.currentTime + 0.005, master = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = pk.lp; lp.Q.value = 0.5;
    master.gain.value = Math.min(1, Math.max(0, p.vol)) * 0.26 * pk.gain; master.connect(lp); lp.connect(ctx.destination);
    if (pk.echo) { const dl = ctx.createDelay(), eg = ctx.createGain(); dl.delayTime.value = 0.07; eg.gain.value = pk.echo; lp.connect(dl); dl.connect(eg); eg.connect(ctx.destination); }
    // R12 (owner: "a coil sound"): the click is a real button click: a short low thump with body and a soft, felted
    // edge (no sliding pitch, no high tick). Rich and heavy, never plastic.
    // owner (16 Nov): a satisfying tick, not a barely-there blip: a crisp switch "tick" (bright transient + a small
    // resonant body), a soft low thump for weight, and the quieter release click a moment later. Bypasses the low-pass
    // so the tick stays crisp; still quiet.
    if (s === 'click') {
      const c = ctx, v = Math.min(1, Math.max(0, p.vol)) * 0.3 * pk.gain, bus = c.createGain(); bus.gain.value = v; bus.connect(c.destination);
      const nb = c.createBuffer(1, Math.ceil(c.sampleRate * 0.012), c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
      const tick = (t: number, amp: number, fr: number) => {
        const ns = c.createBufferSource(), hp = c.createBiquadFilter(), ng = c.createGain(); ns.buffer = nb; hp.type = 'bandpass'; hp.frequency.value = fr; hp.Q.value = 1.6; ng.gain.value = amp * 0.9; ns.connect(hp); hp.connect(ng); ng.connect(bus); ns.start(t);
        const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(fr * 0.62, t); o.frequency.exponentialRampToValueAtTime(fr * 0.45, t + 0.03); og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(amp * 0.5, t + 0.002); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.035); o.connect(og); og.connect(bus); o.start(t); o.stop(t + 0.045); };
      tick(t0, 1, 3200);
      const th = c.createOscillator(), tg = c.createGain(); th.type = 'sine'; th.frequency.setValueAtTime(150, t0); th.frequency.exponentialRampToValueAtTime(70, t0 + 0.06);
      tg.gain.setValueAtTime(0.0001, t0); tg.gain.exponentialRampToValueAtTime(0.7, t0 + 0.003); tg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08); th.connect(tg); tg.connect(bus); th.start(t0); th.stop(t0 + 0.09);
      tick(t0 + 0.055, 0.35, 2600);
      return;
    }
    for (const [f, at, d, type, to] of SHAPES[s]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = pk.type || type || 'sine'; o.frequency.setValueAtTime(f * pk.mul, t0 + at);
      if (to) o.frequency.exponentialRampToValueAtTime(to * pk.mul, t0 + at + d);
      g.gain.setValueAtTime(0.0001, t0 + at); g.gain.exponentialRampToValueAtTime(1, t0 + at + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + d);
      o.connect(g); g.connect(master); o.start(t0 + at); o.stop(t0 + at + d + 0.02);
    }
  } catch { /* audio not available */ }
}
