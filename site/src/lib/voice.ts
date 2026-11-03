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

const V: Record<Voice, { f: number; spread: number; type: OscillatorType; lp: number; d: number; q?: number; robot?: boolean }> = {
  cute: { f: 560, spread: 0.22, type: 'triangle', lp: 2600, d: 0.06 },
  deep: { f: 210, spread: 0.14, type: 'sawtooth', lp: 900, d: 0.075 },
  robot: { f: 340, spread: 0, type: 'square', lp: 1500, d: 0.05, robot: true },
};
function blip(f: number, d: number, v: Voice, g = 1) {
  const c = ac(), cfg = V[v], t = c.currentTime + 0.003, o = c.createOscillator(), a = c.createGain(), lp = c.createBiquadFilter();
  o.type = cfg.type; lp.type = 'lowpass'; lp.frequency.value = cfg.lp; lp.Q.value = 2;
  o.frequency.setValueAtTime(f, t); if (!cfg.robot) o.frequency.exponentialRampToValueAtTime(f * 1.08, t + d * 0.5);
  const peak = vol() * 0.16 * g * (cfg.type === 'sawtooth' || cfg.type === 'square' ? 0.55 : 1);
  a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.008); a.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(lp); lp.connect(a);
  if (cfg.robot) { const rm = c.createOscillator(), rg = c.createGain(); rm.frequency.value = 70; rg.gain.value = 0.5; rm.connect(rg.gain); a.connect(rg); rg.connect(c.destination); rm.start(t); rm.stop(t + d + 0.02); } else a.connect(c.destination);
  o.start(t); o.stop(t + d + 0.02);
}

let stopCur: (() => void) | null = null;
const mouth = (o: boolean) => { const r = document.documentElement; if (o) r.setAttribute('data-sam-mouth', 'o'); else r.removeAttribute('data-sam-mouth'); };
/** Babble a line in time with its typing (≈ cps characters a second). Returns a stop function. */
export function babble(text: string, opts: { cps?: number; onEnd?: () => void } = {}) {
  stopCur && stopCur();
  const voice = prefs().sound.voice || 'cute', cfg = V[voice], t = (text || '').trim(), ask = /\?\s*$/.test(t), hype = /!\s*$/.test(t);
  const cps = (opts.cps || 32) * (hype ? 1.25 : 1), base = cfg.f * (hype ? 1.15 : 1), chars = Array.from(t);
  let i = 0, tm = 0, alive = true, sinceBlip = 9;
  const tick = () => {
    if (!alive) return; if (i >= chars.length) { mouth(false); document.documentElement.setAttribute('data-sam-done', ''); window.setTimeout(() => document.documentElement.removeAttribute('data-sam-done'), 1400); opts.onEnd && opts.onEnd(); alive = false; return; }
    const ch = chars[i++], letter = /[\p{L}\p{N}]/u.test(ch); let wait = 1000 / cps;
    if (/[.,;:!?…،؟]/.test(ch)) { mouth(false); wait *= 3.2; sinceBlip = 9; }
    else if (/\s/.test(ch)) { mouth(false); wait *= 1.3; }
    else if (letter) {
      sinceBlip++;
      if (sinceBlip >= 2) { // one blip per syllable-ish (every second letter)
        sinceBlip = 0; mouth(true); window.setTimeout(() => alive && mouth(false), wait * 0.9);
        if (can()) { const left = chars.length - i, rise = ask && left < 6 ? 1 + (6 - left) * 0.07 : 1, jit = cfg.spread ? 1 + (Math.random() * 2 - 1) * cfg.spread : [1, 1.12, 0.9][i % 3]; try { blip(base * jit * rise, cfg.d, voice); } catch { /* */ } }
      }
    }
    tm = window.setTimeout(tick, wait);
  };
  document.documentElement.removeAttribute('data-sam-done'); tick();
  stopCur = () => { alive = false; window.clearTimeout(tm); mouth(false); };
  return stopCur;
}
export function hush() { stopCur && stopCur(); }
/** A short sample of a voice (Settings). */
export function preview(v: Voice) { if (!gest) gest = true; const p = prefs().sound; if (!p.on) return; const save = p.voice; p.voice = v; babble('Hi! I am Samsoom. Need a part?', { cps: 30 }); p.voice = save; }

// ── tour sounds ──
let pulse: { o: OscillatorNode; lfo: OscillatorNode; g: GainNode; tone: OscillatorNode; tg: GainNode } | null = null;
export function tourStart() {
  if (!can()) return; tourStop(); const c = ac(), t = c.currentTime, v = vol();
  const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
  o.type = 'sine'; o.frequency.value = 62; lfo.frequency.value = 1.1; lg.gain.value = 0.05 * v; lfo.connect(lg); lg.connect(g.gain);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06 * v, t + 1.2); o.connect(g); g.connect(c.destination);
  const tone = c.createOscillator(), tg = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
  tone.type = 'triangle'; tone.frequency.setValueAtTime(196, t); tone.frequency.linearRampToValueAtTime(247, t + 6);
  tg.gain.setValueAtTime(0.0001, t); tg.gain.linearRampToValueAtTime(0.025 * v, t + 2.5); tone.connect(lp); lp.connect(tg); tg.connect(c.destination);
  o.start(t); lfo.start(t); tone.start(t); pulse = { o, lfo, g, tone, tg };
}
/** each step builds the tension a little: the tone climbs, the pulse quickens */
export function tourStep(i: number, n: number) {
  if (!can()) return; const c = ac(), t = c.currentTime, k = n > 1 ? i / (n - 1) : 1;
  if (pulse) { pulse.tone.frequency.cancelScheduledValues(t); pulse.tone.frequency.linearRampToValueAtTime(196 * Math.pow(2, (k * 7) / 12), t + 0.8); pulse.lfo.frequency.linearRampToValueAtTime(1.1 + k * 1.4, t + 0.8); }
  whoosh();
}
export function whoosh() {
  if (!can()) return; const c = ac(), t = c.currentTime, len = 0.42, buf = c.createBuffer(1, Math.round(c.sampleRate * len), c.sampleRate), d = buf.getChannelData(0);
  for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.sin((Math.PI * j) / d.length);
  const s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); s.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(380, t); bp.frequency.exponentialRampToValueAtTime(2600, t + len); g.gain.value = 0.11 * vol();
  s.connect(bp); bp.connect(g); g.connect(c.destination); s.start(t);
}
export function tourEnd() {
  const ok = can(); tourStop(); if (!ok) return; const c = ac(), t = c.currentTime;
  [1047, 1319, 1568, 2093, 2637].forEach((f, j) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f; const at = t + j * 0.07; g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.09 * vol(), at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.5); o.connect(g); g.connect(c.destination); o.start(at); o.stop(at + 0.55); });
}
export function tourStop() { if (!pulse || !ctx) { pulse = null; return; } const t = ctx.currentTime, p = pulse; pulse = null; try { p.g.gain.cancelScheduledValues(t); p.g.gain.setTargetAtTime(0.0001, t, 0.15); p.tg.gain.cancelScheduledValues(t); p.tg.gain.setTargetAtTime(0.0001, t, 0.15); [p.o, p.lfo, p.tone].forEach((x) => x.stop(t + 0.8)); } catch { /* */ } }
