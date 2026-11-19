'use client';
import { isEmbed } from '@/lib/embed';
// R9 · the site's own sound effects, synthesized live with Web Audio (nothing to download): short, quiet, "tech" blips,
// each kind of action with its own. Three packs (classic, soft, studio), a volume and an off switch in Settings; always
// silent in the Control Room and when the visitor asked the system for reduced motion.
import { prefs } from './prefs';

export type Snd = 'msg' | 'warn' | 'oops' | 'tada' | 'click' | 'add' | 'next' | 'back' | 'skip' | 'toggle' | 'open' | 'close' | 'error' | 'success' | 'send' | 'notify' | 'bell' | 'tab' | 'link' | 'menu' | 'cart';
// owner (16 Nov): every sound is one family. One instrument for all of them: a soft wooden mallet (a warm sine with a
// quick bright overtone and a tiny felt attack), like a small marimba. Each action is a short phrase on it; the click is
// one clear note (loud enough to feel), the others are 2–3 notes. Same body, same decay, similar loudness.
type Note = [freq: number, at: number, len: number, amp?: number];
const SHAPES: Record<Snd, Note[]> = {
  // owner (17 Nov): "the two-note click sounds like a game; I like the bell". Every click is ONE soft bell note with the
  // notification's ring; each action has its own note (open goes up, close comes down, menus lower, cart brighter).
  click: [[988, 0, 0.32, 0.75]],
  toggle: [[659, 0, 0.14, 0.8], [880, 0.06, 0.18, 0.8]],
  next: [[659, 0, 0.14, 0.75], [988, 0.06, 0.2, 0.8]],
  back: [[988, 0, 0.14, 0.75], [659, 0.06, 0.2, 0.8]],
  skip: [[784, 0, 0.12, 0.7], [659, 0.05, 0.12, 0.7], [523, 0.1, 0.2, 0.75]],
  open: [[880, 0, 0.3, 0.72], [1175, 0.05, 0.34, 0.38]],
  // owner (18 Nov): closing sounds different from opening/clicking: a lower, softer falling fifth that settles down
  close: [[784, 0, 0.16, 0.6], [523, 0.07, 0.34, 0.55]],
  add: [[659, 0, 0.14, 0.75], [784, 0.07, 0.14, 0.75], [1047, 0.14, 0.3, 0.9]],
  success: [[523, 0, 0.16, 0.7], [659, 0.08, 0.16, 0.75], [784, 0.16, 0.16, 0.8], [1047, 0.24, 0.36, 0.9]],
  send: [[587, 0, 0.12, 0.7], [880, 0.05, 0.12, 0.75], [1175, 0.1, 0.3, 0.8]],
  error: [[392, 0, 0.2, 0.85], [370, 0.12, 0.3, 0.85]],
  notify: [[880, 0, 0.3, 0.8], [1319, 0.12, 0.45, 0.75]],
  bell: [[1175, 0, 0.42, 0.8]],
  tab: [[880, 0, 0.28, 0.72]],
  link: [[932, 0, 0.3, 0.72]],
  menu: [[784, 0, 0.32, 0.75]],
  cart: [[1047, 0, 0.3, 0.75], [1568, 0.045, 0.34, 0.35]],
  // "ta TA!": a short pickup, then a bright bell chord that rings out (medals, finished tutorials)
  // owner (18 Nov): the end of a tutorial is a real "yay!": a quick rising run, then a big ringing chord with a sparkle on top
  // owner (18 Nov): "a warning sound for copyright or any serious alert, like the clicks but longer and warning-like;
  // for wifi issues or errors a softer error sound": warn is a two-tone alarm on the same mallet (high-low, twice, the
  // last one held); oops is a soft falling pair
  // owner (18 Nov night): any message received: ONE soft tone that rings on and fades slowly (with a faint overtone)
  msg: [[880, 0, 1.8, 0.62], [1760, 0, 0.9, 0.1]],
  warn: [[784, 0, 0.26, 0.9], [587, 0.17, 0.26, 0.9], [784, 0.34, 0.26, 0.9], [587, 0.51, 0.6, 0.9], [392, 0.51, 0.6, 0.45]],
  oops: [[587, 0, 0.24, 0.55], [494, 0.13, 0.26, 0.5], [392, 0.27, 0.5, 0.5]],
  tada: [[523, 0, 0.12, 0.6], [659, 0.08, 0.12, 0.65], [784, 0.16, 0.12, 0.7], [1047, 0.26, 1.1, 0.85], [1319, 0.26, 1.1, 0.6], [1568, 0.26, 1.15, 0.55], [2093, 0.3, 0.9, 0.32], [1047, 0.62, 0.9, 0.45], [1568, 0.66, 1.0, 0.4], [2637, 0.72, 0.6, 0.2], [3136, 0.8, 0.5, 0.15], [2093, 0.9, 0.7, 0.2]],
};
// Classic: as written. Soft: an octave-ish lower and quieter. Studio: brighter with a short room echo.
const PACK = { classic: { mul: 1, gain: 1, lp: 5200, echo: 0 }, soft: { mul: 0.75, gain: 0.7, lp: 3000, echo: 0 }, studio: { mul: 1.12, gain: 0.9, lp: 6500, echo: 0.2 } };
let ctx: AudioContext | null = null, last = 0;

export function play(s: Snd, force = false) {
  if (typeof window === 'undefined' || isEmbed()) return;
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
    master.gain.value = Math.min(1, Math.max(0, p.vol)) * 0.42 * pk.gain; master.connect(lp); lp.connect(ctx.destination);
    if (pk.echo) { const dl = ctx.createDelay(), eg = ctx.createGain(); dl.delayTime.value = 0.07; eg.gain.value = pk.echo; lp.connect(dl); dl.connect(eg); eg.connect(ctx.destination); }
    const c = ctx, felt = c.createBuffer(1, Math.ceil(c.sampleRate * 0.008), c.sampleRate), fd = felt.getChannelData(0);
    for (let i = 0; i < fd.length; i++) fd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / fd.length, 3);
    const mallet = (f: number, at: number, len: number, amp: number) => {
      const t = t0 + at, body = c.createOscillator(), bg = c.createGain(), ov = c.createOscillator(), og = c.createGain();
      body.type = 'sine'; body.frequency.value = f; ov.type = 'sine'; ov.frequency.value = f * 3.98;
      bg.gain.setValueAtTime(0.0001, t); bg.gain.exponentialRampToValueAtTime(amp, t + 0.004); bg.gain.exponentialRampToValueAtTime(0.0001, t + len);
      og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(amp * 0.35, t + 0.002); og.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(0.05, len * 0.4));
      body.connect(bg); bg.connect(master); ov.connect(og); og.connect(master);
      // owner (16 Nov): richer, a fuller "tuck": a short wooden thump an octave below and a warm second partial
      const th = c.createOscillator(), tg = c.createGain(); th.type = 'sine'; th.frequency.setValueAtTime(f / 2, t); th.frequency.exponentialRampToValueAtTime(f / 2.6, t + 0.06);
      tg.gain.setValueAtTime(0.0001, t); tg.gain.exponentialRampToValueAtTime(amp * 0.55, t + 0.003); tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.07); th.connect(tg); tg.connect(master); th.start(t); th.stop(t + 0.08);
      const p2 = c.createOscillator(), pg = c.createGain(); p2.type = 'sine'; p2.frequency.value = f * 2.01; pg.gain.setValueAtTime(0.0001, t); pg.gain.exponentialRampToValueAtTime(amp * 0.18, t + 0.004); pg.gain.exponentialRampToValueAtTime(0.0001, t + len * 0.6); p2.connect(pg); pg.connect(master); p2.start(t); p2.stop(t + len);
      const n = c.createBufferSource(), nf = c.createBiquadFilter(), ng = c.createGain(); n.buffer = felt; nf.type = 'bandpass'; nf.frequency.value = f * 2; nf.Q.value = 1.2; ng.gain.value = amp * 0.25; n.connect(nf); nf.connect(ng); ng.connect(master);
      body.start(t); body.stop(t + len + 0.02); ov.start(t); ov.stop(t + len); n.start(t);
    };
    for (const [f, at, len, amp = 0.8] of SHAPES[s]) mallet(f * pk.mul, at, len, amp);
  } catch { /* audio not available */ }
}

/** Owner (17 Nov): tutorial steps "level up": each Next is one bell note higher (a major scale) and a little fuller,
 *  so the presses build up until the last one bursts into the "ta TA!". */
const SCALE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];
export function playStep(i: number, total: number) {
  if (i >= total - 1) { play('tada'); return; }
  const f = 523.25 * Math.pow(2, SCALE[Math.min(SCALE.length - 1, Math.max(0, i))] / 12);
  const k = total > 1 ? i / (total - 1) : 0;
  SHAPES.click = [[f, 0, 0.3 + k * 0.2, 0.62 + k * 0.25], [f * 1.5, 0.03, 0.26 + k * 0.2, 0.18 + k * 0.3]];
  play('click');
  SHAPES.click = [[988, 0, 0.32, 0.75]];
}
