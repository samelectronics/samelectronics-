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
  cute: { f: 440, type: 'sine', lp: 4200, d: 0.085, bend: 0.45 },
  deep: { f: 250, type: 'triangle', lp: 2200, d: 0.1, bend: 0.3 },
  robot: { f: 330, type: 'triangle', lp: 2600, d: 0.07, bend: 0, robot: true },
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
export const CPS = 64;
export const charMs = (ch: string) => (/[.,;:!?…،؟。，]/.test(ch) ? 2000 / CPS : 1000 / CPS);
export const typeMs = (t: string) => Array.from(t || '').reduce((a, c) => a + charMs(c), 0);
const mouth = (o: boolean) => { const r = document.documentElement; if (o) r.setAttribute('data-sam-mouth', 'o'); else r.removeAttribute('data-sam-mouth'); };
/** R11f (owner): each word is one little melody, not separate notes. The whole line is planned up front on the audio
 *  clock: the pitch flows smoothly up and down through the syllables like "uowowowo", the vowel colour slides with it,
 *  the sound only softens between words and stops at full stops. Nothing runs on timers, so it never lags or drifts.
 *  Happy lines are brighter and end with a little "he-he"; questions end going up; statements settle down. */
const VOW: Record<string, [number, number]> = { a: [800, 1250], e: [520, 1900], i: [330, 2300], o: [520, 900], u: [360, 820], y: [330, 2200] };
const vowOf = (ch: string): [number, number] => { const k = ch.normalize('NFD').charAt(0).toLowerCase(); return VOW[k] || (/[اآ]/.test(ch) ? VOW.a : /[و]/.test(ch) ? VOW.u : /[ي]/.test(ch) ? VOW.i : VOW.a); };
const isV = (ch: string) => /[aeiouyáéíóúàèìòùâêîôûäëïöüаеёиоуыэюяاآوي]/i.test(ch);
const HAPPY = /\b(welcome|hi|hey|hello|yay|great|thanks|thank you|awesome|nice|love|ha+|bienvenid|hola|gracias|bienvenue|merci|salut)\b|أهلا|مرحب|شكرا|!/i;
const TUNE = [0, 4, 1, 5, 2, 6, 3, 5]; // gentle up-down wave in semitones, never a jump bigger than 4
const smooth = (a: number, b: number, k: number) => a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * k));
/** sample a smooth curve through [time, value] keys every `dt` seconds */
const curve = (keys: [number, number][], dur: number, dt: number) => { const n = Math.max(2, Math.ceil(dur / dt) + 1), out = new Float32Array(n); let j = 0;
  for (let q = 0; q < n; q++) { const t = q * dt; while (j < keys.length - 2 && keys[j + 1][0] <= t) j++; const [t0, v0] = keys[j], [t1, v1] = keys[Math.min(j + 1, keys.length - 1)]; out[q] = t1 > t0 ? smooth(v0, v1, Math.min(1, Math.max(0, (t - t0) / (t1 - t0)))) : v1; } return out; };

export function babble(text: string, opts: { onEnd?: () => void } = {}) {
  stopCur && stopCur();
  const voice = prefs().sound.voice || 'cute', cfg = V[voice], t = (text || '').trim();
  const ask = /\?\s*$/.test(t), happy = HAPPY.test(t), chars = Array.from(t);
  const base = cfg.f * (happy ? 1.1 : 1);
  // timeline (seconds), same clock as the typing
  const at: number[] = []; let acc = 0; for (const ch of chars) { at.push(acc); acc += charMs(ch) / 1000; } const total = acc;
  const syl: number[] = []; chars.forEach((c, k) => { if (isV(c) && (k === 0 || !isV(chars[k - 1]))) syl.push(k); });
  const P: [number, number][] = [], G: [number, number][] = [[0, 0]], F1: [number, number][] = [], F2: [number, number][] = [];
  syl.forEach((k, n) => { const pos = syl.length > 1 ? n / (syl.length - 1) : 0, last = n === syl.length - 1, near = n >= syl.length - 2;
    let semi = TUNE[n % TUNE.length] - pos * 3; if (ask && near) semi += last ? 8 : 4; else if (last) semi += happy ? 5 : -3; if (happy) semi += 1;
    const tc = at[k] + 0.5 / CPS * 1.0; P.push([tc, base * Math.pow(2, semi / 12)]); const [a, b] = vowOf(chars[k]); F1.push([tc, a]); F2.push([tc, b]); });
  if (!P.length) P.push([0, base]);
  // loudness: on through a word, a soft dip between words, silence at punctuation
  let on = false; chars.forEach((ch, k) => { const t0 = at[k];
    if (/[.,;:!?…،؟。，]/.test(ch)) { if (on) G.push([t0 + 0.01, 0]); on = false; }
    else if (/\s/.test(ch)) { if (on) G.push([t0 + 0.012, 0.35]); }
    else { if (!on || (G.length && G[G.length - 1][1] < 1)) G.push([t0 + 0.015, 1]); on = true; } });
  G.push([total, on ? 1 : 0], [total + 0.06, 0]);
  const pk = [[0, P[0][1]] as [number, number], ...P, [total + 0.1, P[P.length - 1][1]] as [number, number]];
  let o: OscillatorNode | null = null, g: GainNode | null = null, alive = true, raf = 0, endTm = 0;
  const peak = cfg.robot ? 0.12 : 0.5, DT = 0.01, len = total + 0.12;
  if (can()) { try { const c = ac(), now = c.currentTime + 0.02; o = c.createOscillator(); g = c.createGain(); const f1 = c.createBiquadFilter(), f2 = c.createBiquadFilter(), g2 = c.createGain(), lp = c.createBiquadFilter();
    o.type = cfg.robot ? 'square' : 'triangle'; f1.type = 'bandpass'; f1.Q.value = 2.5; f2.type = 'bandpass'; f2.Q.value = 4; g2.gain.value = 0.5; lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = 0.3;
    o.connect(f1); o.connect(f2); f1.connect(lp); f2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(out());
    o.frequency.setValueCurveAtTime(curve(pk, len, DT), now, len);
    const fk = (F: [number, number][]) => (F.length ? [[0, F[0][1]] as [number, number], ...F, [len, F[F.length - 1][1]] as [number, number]] : [[0, 700], [len, 700]] as [number, number][]);
    f1.frequency.setValueCurveAtTime(curve(fk(F1), len, DT), now, len); f2.frequency.setValueCurveAtTime(curve(fk(F2), len, DT), now, len);
    const gc = curve(G, len, DT).map((v) => Math.max(0.0001, v * peak)); g.gain.setValueAtTime(0.0001, now); g.gain.setValueCurveAtTime(gc, now + 0.001, len);
    o.start(now); o.stop(now + len + 0.05);
    if (happy) { // a tiny "he-he" right after the line
      const h = c.createOscillator(), hg = c.createGain(), hf = c.createBiquadFilter(); h.type = 'triangle'; hf.type = 'bandpass'; hf.frequency.value = 1700; hf.Q.value = 2; h.connect(hf); hf.connect(hg); hg.connect(out());
      const s0 = now + len + 0.03, top = base * 1.5; h.frequency.setValueAtTime(top, s0); h.frequency.linearRampToValueAtTime(top * 1.12, s0 + 0.09); h.frequency.setValueAtTime(top * 1.2, s0 + 0.13); h.frequency.linearRampToValueAtTime(top * 1.32, s0 + 0.22);
      hg.gain.setValueAtTime(0.0001, s0); hg.gain.linearRampToValueAtTime(0.3, s0 + 0.02); hg.gain.linearRampToValueAtTime(0.02, s0 + 0.09); hg.gain.linearRampToValueAtTime(0.3, s0 + 0.15); hg.gain.linearRampToValueAtTime(0.0001, s0 + 0.24);
      h.start(s0); h.stop(s0 + 0.26); }
  } catch { o = null; } }
  // mouth follows the same timeline
  const t0 = performance.now(), gk = G;
  const flap = () => { if (!alive) return; const el = (performance.now() - t0) / 1000; let j = 0; while (j < gk.length - 1 && gk[j + 1][0] <= el) j++;
    const loud = gk[j][1] > 0.6, wob = Math.sin(el * 2 * Math.PI * 7) > -0.2; if (loud && wob) mouth(true); else mouth(false); if (el < total) raf = requestAnimationFrame(flap); else mouth(false); };
  document.documentElement.removeAttribute('data-sam-done'); raf = requestAnimationFrame(flap);
  endTm = window.setTimeout(() => { if (!alive) return; alive = false; mouth(false); document.documentElement.setAttribute('data-sam-done', ''); window.setTimeout(() => document.documentElement.removeAttribute('data-sam-done'), 1400); opts.onEnd && opts.onEnd(); }, total * 1000);
  stopCur = () => { alive = false; cancelAnimationFrame(raf); window.clearTimeout(endTm); mouth(false); if (o && g) { const gg = g; try { const c = ac(), n = c.currentTime; (gg.gain as AudioParam & { cancelAndHoldAtTime?: (t: number) => void }).cancelAndHoldAtTime?.(n); gg.gain.setTargetAtTime(0.0001, n, 0.03); } catch { /* */ } window.setTimeout(() => { try { gg.disconnect(); } catch { /* */ } }, 150); } o = null; };
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
