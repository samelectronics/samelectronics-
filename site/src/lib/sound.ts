'use client';
// R9 · the site's own sound effects, synthesized live with Web Audio (nothing to download): short, quiet, "tech" blips,
// each kind of action with its own. Three packs (classic, soft, studio), a volume and an off switch in Settings; always
// silent in the Control Room and when the visitor asked the system for reduced motion.
import { prefs } from './prefs';

export type Snd = 'click' | 'add' | 'next' | 'back' | 'skip' | 'toggle' | 'open' | 'close' | 'error' | 'success' | 'send' | 'notify' | 'bell' | 'tab' | 'link' | 'menu' | 'cart';
// owner (16 Nov): every sound is one family. One instrument for all of them: a soft wooden mallet (a warm sine with a
// quick bright overtone and a tiny felt attack), like a small marimba. Each action is a short phrase on it; the click is
// one clear note (loud enough to feel), the others are 2–3 notes. Same body, same decay, similar loudness.
type Note = [freq: number, at: number, len: number, amp?: number];
const SHAPES: Record<Snd, Note[]> = {
  click: [[784, 0, 0.16, 1]],
  toggle: [[659, 0, 0.14, 0.8], [880, 0.06, 0.18, 0.8]],
  next: [[659, 0, 0.14, 0.75], [988, 0.06, 0.2, 0.8]],
  back: [[988, 0, 0.14, 0.75], [659, 0.06, 0.2, 0.8]],
  skip: [[784, 0, 0.12, 0.7], [659, 0.05, 0.12, 0.7], [523, 0.1, 0.2, 0.75]],
  open: [[523, 0, 0.18, 0.75], [784, 0.07, 0.26, 0.85]],
  close: [[784, 0, 0.18, 0.75], [523, 0.07, 0.26, 0.8]],
  add: [[659, 0, 0.14, 0.75], [784, 0.07, 0.14, 0.75], [1047, 0.14, 0.3, 0.9]],
  success: [[523, 0, 0.16, 0.7], [659, 0.08, 0.16, 0.75], [784, 0.16, 0.16, 0.8], [1047, 0.24, 0.36, 0.9]],
  send: [[587, 0, 0.12, 0.7], [880, 0.05, 0.12, 0.75], [1175, 0.1, 0.3, 0.8]],
  error: [[392, 0, 0.2, 0.85], [370, 0.12, 0.3, 0.85]],
  notify: [[880, 0, 0.3, 0.8], [1319, 0.12, 0.45, 0.75]],
  // owner (16 Nov): same family, a little different per function
  bell: [[1047, 0, 0.22, 0.75], [1568, 0.05, 0.4, 0.55]],
  tab: [[698, 0, 0.14, 0.85], [784, 0.035, 0.16, 0.6]],
  link: [[880, 0, 0.14, 0.8]],
  menu: [[587, 0, 0.16, 0.8], [880, 0.05, 0.22, 0.7]],
  cart: [[659, 0, 0.14, 0.8], [988, 0.05, 0.22, 0.75]],
};
// Classic: as written. Soft: an octave-ish lower and quieter. Studio: brighter with a short room echo.
const PACK = { classic: { mul: 1, gain: 1, lp: 5200, echo: 0 }, soft: { mul: 0.75, gain: 0.7, lp: 3000, echo: 0 }, studio: { mul: 1.12, gain: 0.9, lp: 6500, echo: 0.2 } };
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
    // owner (16 Nov): everyday clicks must feel physical, not like a toy note: a crisp tactile "tuck" (a tiny noise
    // transient through a narrow band + a short wooden body that drops in pitch). Each function has its own colour of it;
    // closing is a softer, lower "thock" going down. The musical phrases stay for next, success, add, send…
    const TACT: Partial<Record<Snd, [number, number, number, number]>> = { // [click band Hz, body Hz, body drop, length]
      click: [2600, 210, 0.55, 0.05], link: [3000, 240, 0.6, 0.045], tab: [2300, 260, 0.7, 0.05], menu: [2000, 180, 0.6, 0.06],
      cart: [2800, 230, 0.6, 0.05], bell: [3400, 300, 0.75, 0.05], toggle: [2400, 220, 0.6, 0.05], close: [1500, 150, 0.45, 0.08],
    };
    const tk = TACT[s];
    if (tk) {
      const [band, bodyF, drop, L] = tk, t = t0;
      const n = c.createBufferSource(), nb = c.createBuffer(1, Math.ceil(c.sampleRate * 0.012), c.sampleRate), nd = nb.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 4);
      n.buffer = nb; const bp = c.createBiquadFilter(), ng = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = band * pk.mul; bp.Q.value = 3.2; ng.gain.value = 1.5; n.connect(bp); bp.connect(ng); ng.connect(master); n.start(t);
      const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(bodyF * pk.mul, t); o.frequency.exponentialRampToValueAtTime(bodyF * pk.mul * drop, t + L);
      og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(1.05, t + 0.002); og.gain.exponentialRampToValueAtTime(0.0001, t + L); o.connect(og); og.connect(master); o.start(t); o.stop(t + L + 0.01);
      const h = c.createOscillator(), hg = c.createGain(); h.type = 'triangle'; h.frequency.value = bodyF * 4.1 * pk.mul; hg.gain.setValueAtTime(0.0001, t); hg.gain.exponentialRampToValueAtTime(0.22, t + 0.001); hg.gain.exponentialRampToValueAtTime(0.0001, t + 0.018); h.connect(hg); hg.connect(master); h.start(t); h.stop(t + 0.02);
      if (s === 'bell') mallet(1568 * pk.mul, 0.02, 0.35, 0.35);
      return;
    }
    for (const [f, at, len, amp = 0.8] of SHAPES[s]) mallet(f * pk.mul, at, len, amp);
  } catch { /* audio not available */ }
}
