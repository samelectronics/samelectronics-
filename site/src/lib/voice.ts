'use client';
// R11 · Samsoom's voice and the page-tour sounds, generated live with Web Audio (no audio files, no licensed sounds).
//  - babble(text): while his bubble types, every syllable is a short soft blip with a little random pitch; questions rise at
//    the end, excited lines (!) are faster and higher, spaces and punctuation are short pauses. The mouth (data-sm-mouth in
//    any Samsoom inside a [data-sam-talk] holder) opens and closes in time, even with the sound off.
//  - three voices: cute, deeper, robot (Settings / My Bench).
//  - tour: a soft low pulse and a slowly rising tone that builds a little with each step, a whoosh when the spot moves,
//    a sparkle at the end.
// Only Samsoom and the tours make these sounds; never in the Control Room; follows Sounds on/off + volume; nothing plays
// before the visitor has interacted with the page (browsers require it); a mute button in the bubble.
import { prefs, type Voice } from './prefs';

let ctx: AudioContext | null = null, gest = false, muted = false;
if (typeof window !== 'undefined') {
  const g = () => { gest = true; }; ['pointerdown', 'keydown', 'touchstart'].forEach((e) => window.addEventListener(e, g, { once: true, capture: true, passive: true }));
  try { muted = localStorage.getItem('se-sam-mute') === '1'; } catch { /* */ }
}
export const isMuted = () => muted;
export function setMuted(v: boolean) { muted = v; try { localStorage.setItem('se-sam-mute', v ? '1' : '0'); } catch { /* */ } window.dispatchEvent(new CustomEvent('se:sam-mute')); }
const can = () => { if (typeof window === 'undefined' || !gest || muted) return false; if (location.pathname.startsWith('/staff')) return false; const p = prefs().sound; return p.on && p.vol > 0 && p.talk !== false; };
const ac = () => { ctx = ctx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; };
const vol = () => Math.min(1, Math.max(0, prefs().sound.vol));

// R11 (owner): cute and funny, never buzzy. Each syllable is a tiny "bloop": a soft sine/triangle that bends up or down
// (randomly, like a little creature talking), shaped by a gentle filter, with silence between syllables.
const V: Record<Voice, { f: number; type: OscillatorType; lp: number; d: number; bend: number; robot?: boolean }> = {
  cute: { f: 640, type: 'sine', lp: 3200, d: 0.085, bend: 0.45 },
  deep: { f: 300, type: 'triangle', lp: 1500, d: 0.1, bend: 0.3 },
  robot: { f: 460, type: 'square', lp: 1800, d: 0.07, bend: 0, robot: true },
};
let master: GainNode | null = null;
const out = () => { const c = ac(); if (!master) { master = c.createGain(); const comp = c.createDynamicsCompressor(); master.connect(comp); comp.connect(c.destination); } master.gain.value = vol() * 0.5; return master; };
function blip(f: number, d: number, v: Voice, up: boolean) {
  const c = ac(), cfg = V[v], t = c.currentTime + 0.005, o = c.createOscillator(), a = c.createGain(), lp = c.createBiquadFilter();
  o.type = cfg.type; lp.type = 'lowpass'; lp.frequency.value = cfg.lp; lp.Q.value = 0.7;
  const f2 = f * (1 + (up ? cfg.bend : -cfg.bend * 0.6));
  o.frequency.setValueAtTime(f, t);
  if (cfg.robot) { o.frequency.setValueAtTime(f * (up ? 1.25 : 0.8), t + d * 0.5); }
  else { o.frequency.exponentialRampToValueAtTime(Math.max(60, f2), t + d * 0.7); }
  const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 28; vg.gain.value = cfg.robot ? 0 : f * 0.03; vib.connect(vg); vg.connect(o.frequency);
  const peak = cfg.type === 'square' ? 0.05 : 0.16;
  a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(peak, t + 0.012); a.gain.setValueAtTime(peak, t + d * 0.45); a.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(lp); lp.connect(a); a.connect(out()); o.start(t); vib.start(t); o.stop(t + d + 0.03); vib.stop(t + d + 0.03);
}

let stopCur: (() => void) | null = null;
// R11c: ONE clock for his voice and his typing, so they always start and finish together
export const CPS = 40;
export const charMs = (ch: string) => (/[.,;:!?…،؟。，]/.test(ch) ? 3000 / CPS : 1000 / CPS);
export const typeMs = (t: string) => Array.from(t || '').reduce((a, c) => a + charMs(c), 0);
const mouth = (o: boolean) => { const r = document.documentElement; if (o) r.setAttribute('data-sam-mouth', 'o'); else r.removeAttribute('data-sam-mouth'); };
/** Babble a line in time with its typing. One continuous voice per line (no separate beeps): a single oscillator that
 *  glides from pitch to pitch, swelling on every syllable, dipping between them, silent only at spaces and punctuation. */
export function babble(text: string, opts: { onEnd?: () => void } = {}) {
  stopCur && stopCur();
  const voice = prefs().sound.voice || 'cute', cfg = V[voice], t = (text || '').trim(), ask = /\?\s*$/.test(t), hype = /!\s*$/.test(t);
  const base = cfg.f * (hype ? 1.1 : 1), chars = Array.from(t);
  let i = 0, tm = 0, alive = true, inVowel = false, n = 0;
  const VOW = /[aeiouyáéíóúàèìòùâêîôûäëïöüæøåаеёиоуыэюяاأإآويىةَُِऀ-ॿ一-鿿]/i;
  // the voice: oscillator → soft filter → gain (the "mouth"), plus a slow vibrato
  let o: OscillatorNode | null = null, g: GainNode | null = null, lfo: OscillatorNode | null = null;
  if (can()) { try { const c = ac(), lp = c.createBiquadFilter(), lg = c.createGain(); o = c.createOscillator(); g = c.createGain(); lfo = c.createOscillator();
    o.type = cfg.type === 'square' ? 'square' : cfg.type; lp.type = 'lowpass'; lp.frequency.value = cfg.lp; lp.Q.value = 0.8;
    lfo.frequency.value = 5.5; lg.gain.value = cfg.robot ? 0 : base * 0.025; lfo.connect(lg); lg.connect(o.frequency);
    o.frequency.value = base; g.gain.value = 0.0001; o.connect(lp); lp.connect(g); g.connect(out()); o.start(); lfo.start(); } catch { o = null; } }
  const peak = cfg.type === 'square' ? 0.045 : 0.14;
  const end = () => { if (g && o) { const c = ac(), now = c.currentTime; g.gain.cancelScheduledValues(now); g.gain.setTargetAtTime(0.0001, now, 0.04); try { o.stop(now + 0.3); lfo && lfo.stop(now + 0.3); } catch { /* */ } } o = null; };
  const tick = () => {
    if (!alive) return;
    if (i >= chars.length) { mouth(false); end(); document.documentElement.setAttribute('data-sam-done', ''); window.setTimeout(() => document.documentElement.removeAttribute('data-sam-done'), 1400); opts.onEnd && opts.onEnd(); alive = false; return; }
    const ch = chars[i++], wait = charMs(ch), now = o ? ac().currentTime : 0;
    if (/[.,;:!?…،؟。，\s]/.test(ch)) { mouth(false); inVowel = false; if (g) g.gain.setTargetAtTime(0.0001, now, 0.025); }
    else { const v = VOW.test(ch);
      if (v && !inVowel) { n++; mouth(true); window.setTimeout(() => alive && mouth(false), Math.min(120, wait * 2.5));
        if (o && g) { const left = chars.length - i, rise = ask && left < 8 ? 1 + (8 - left) * 0.05 : 1, f = base * rise * (1 + (Math.random() * 2 - 1) * 0.16 + (n % 4 === 1 ? 0.1 : 0));
          if (cfg.robot) o.frequency.setValueAtTime(f, now); else o.frequency.setTargetAtTime(f, now, 0.03); // a glide, not a jump
          g.gain.setTargetAtTime(peak, now, 0.012); g.gain.setTargetAtTime(peak * 0.35, now + 0.06, 0.04); } // swell, then settle (never fully off inside a word)
      } else if (!v && g && n) g.gain.setTargetAtTime(peak * 0.3, now, 0.03);
      inVowel = v; }
    tm = window.setTimeout(tick, wait);
  };
  document.documentElement.removeAttribute('data-sam-done'); tick();
  stopCur = () => { alive = false; window.clearTimeout(tm); mouth(false); end(); };
  return stopCur;
}
export function hush() { stopCur && stopCur(); }
/** A short sample of a voice (Settings). */
export function preview(v: Voice) { if (!gest) gest = true; const p = prefs().sound; if (!p.on) return; const save = p.voice; p.voice = v; babble('Hi! I am Samsoom. Need a part?'); p.voice = save; }

// ── tour sounds ── (R11: no continuous tone at all; short soft chimes that climb a little each step)
const chime = (f: number, at: number, d: number, g = 0.08) => { const c = ac(), t = c.currentTime + at, o = c.createOscillator(), a = c.createGain(); o.type = 'sine'; o.frequency.value = f; a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(g, t + 0.015); a.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(a); a.connect(out()); o.start(t); o.stop(t + d + 0.05); };
export function tourStart() { if (!can()) return; chime(392, 0, 0.5, 0.06); chime(523, 0.12, 0.6, 0.06); }
export function tourStep(i: number, n: number) { if (!can()) return; const k = n > 1 ? i / (n - 1) : 1, f = 440 * Math.pow(2, (k * 7) / 12); chime(f, 0, 0.35, 0.05); chime(f * 1.5, 0.08, 0.4, 0.035); whoosh(); }
export function whoosh() {
  if (!can()) return; const c = ac(), t = c.currentTime, len = 0.32, buf = c.createBuffer(1, Math.round(c.sampleRate * len), c.sampleRate), d = buf.getChannelData(0);
  for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.sin((Math.PI * j) / d.length);
  const s2 = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); s2.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.4;
  bp.frequency.setValueAtTime(500, t); bp.frequency.exponentialRampToValueAtTime(2400, t + len); g.gain.value = 0.06;
  s2.connect(bp); bp.connect(g); g.connect(out()); s2.start(t);
}
export function tourEnd() { if (!can()) return; [1047, 1319, 1568, 2093].forEach((f, j) => chime(f, j * 0.07, 0.45, 0.06)); }
export function tourStop() { /* nothing keeps playing between sounds any more */ }
