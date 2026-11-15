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
  cute: { f: 400, type: 'sine', lp: 4200, d: 0.085, bend: 0.45 },
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
export const CPS = 30; // owner (15 Nov): typing not slow, not too fast; voice and typing share this clock
export const charMs = (ch: string) => (/[.,;:!?…،؟。，]/.test(ch) ? 2000 / CPS : 1000 / CPS);
export const typeMs = (t: string) => Array.from(t || '').reduce((a, c) => a + charMs(c), 0);
const speaking = (on: boolean) => { try { document.documentElement.toggleAttribute('data-sam-speaking', on); } catch { /* */ } };
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

function babbleSynth(text: string, opts: { onEnd?: () => void } = {}) {
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
  // R11g: articulation so he speaks words, not "ooooo": every consonant is a quick soft dip, every vowel opens up again
  const ticks: number[] = []; let on = false; chars.forEach((ch, k) => { const t0 = at[k];
    if (/[.,;:!?…،؟。，]/.test(ch)) { if (on) G.push([t0 + 0.01, 0]); on = false; }
    else if (/\s/.test(ch)) { if (on) G.push([t0 + 0.01, 0.12]); on = false; }
    else if (isV(ch)) { G.push([t0 + 0.012, 1]); on = true; }
    else { G.push([t0 + 0.01, on ? 0.5 : 0.35]); on = true; if (/[tkpsczfxشسصتكقث]/i.test(ch)) ticks.push(t0); } });
  G.push([total, on ? 1 : 0], [total + 0.06, 0]);
  const pk = [[0, P[0][1]] as [number, number], ...P, [total + 0.1, P[P.length - 1][1]] as [number, number]];
  let o: OscillatorNode | null = null, g: GainNode | null = null, alive = true, raf = 0, endTm = 0;
  let coreRef = {} as { core: OscillatorNode; vib: OscillatorNode };
  const peak = cfg.robot ? 0.12 : 0.21, DT = 0.008, len = total + 0.12;
  if (can()) { try { const c = ac(), now = c.currentTime + 0.02; o = c.createOscillator(); g = c.createGain(); const f1 = c.createBiquadFilter(), f2 = c.createBiquadFilter(), g2 = c.createGain(), lp = c.createBiquadFilter();
    o.type = cfg.robot ? 'square' : 'triangle'; f1.type = 'bandpass'; f1.Q.value = 0.9; f2.type = 'bandpass'; f2.Q.value = 1.4; g2.gain.value = 0.35; lp.type = 'lowpass'; lp.frequency.value = 2200; lp.Q.value = 0.2;
    // R11j (owner: "mosquito with a closed nose"): a warm round core (pure tone at his pitch) carries the voice, the vowel
    // colour sits on top, wide and soft; the buzzy top end is trimmed. A light, slow wobble keeps him alive and friendly.
    const core = c.createOscillator(), cg = c.createGain(); core.type = 'sine'; cg.gain.value = 0.55; core.connect(cg); cg.connect(lp);
    const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 5.2; vg.gain.value = 6; vib.connect(vg); vg.connect(o.frequency); vg.connect(core.frequency);
    const fg = c.createGain(); fg.gain.value = 0.6; o.connect(f1); o.connect(f2); f1.connect(fg); f2.connect(g2); g2.connect(fg); fg.connect(lp); lp.connect(g); g.connect(out());
    coreRef = { core, vib };
    const pc = curve(pk, len, DT); o.frequency.setValueCurveAtTime(pc, now, len); coreRef.core.frequency.setValueCurveAtTime(pc, now, len);
    const fk = (F: [number, number][]) => (F.length ? [[0, F[0][1]] as [number, number], ...F, [len, F[F.length - 1][1]] as [number, number]] : [[0, 700], [len, 700]] as [number, number][]);
    f1.frequency.setValueCurveAtTime(curve(fk(F1), len, DT), now, len); f2.frequency.setValueCurveAtTime(curve(fk(F2), len, DT), now, len);
    const gc = curve(G, len, DT).map((v) => Math.max(0.0001, v * peak)); g.gain.setValueAtTime(0.0001, now); g.gain.setValueCurveAtTime(gc, now + 0.001, len);
    o.start(now); o.stop(now + len + 0.05); coreRef.core.start(now); coreRef.core.stop(now + len + 0.05); coreRef.vib.start(now); coreRef.vib.stop(now + len + 0.05);
    if (false && ticks.length) { // R11h (owner): no clicks, they sounded like plastic // tiny breathy clicks on t, k, p, s: the "speech" texture
      const nb = c.createBuffer(1, Math.ceil(c.sampleRate * 0.03), c.sampleRate), d = nb.getChannelData(0); for (let q = 0; q < d.length; q++) d[q] = (Math.random() * 2 - 1) * (1 - q / d.length);
      ticks.forEach((tt) => { const src = c.createBufferSource(), hp = c.createBiquadFilter(), tg = c.createGain(); src.buffer = nb; hp.type = 'highpass'; hp.frequency.value = 3500; tg.gain.value = 0.05; src.connect(hp); hp.connect(tg); tg.connect(out()); src.start(now + tt); }); }
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
  document.documentElement.removeAttribute('data-sam-done'); speaking(true); raf = requestAnimationFrame(flap);
  endTm = window.setTimeout(() => { if (!alive) return; alive = false; speaking(false); mouth(false); document.documentElement.setAttribute('data-sam-done', ''); window.setTimeout(() => document.documentElement.removeAttribute('data-sam-done'), 1400); opts.onEnd && opts.onEnd(); }, total * 1000);
  stopCur = () => { alive = false; speaking(false); cancelAnimationFrame(raf); window.clearTimeout(endTm); mouth(false); if (o && g) { const gg = g; try { const c = ac(), n = c.currentTime; (gg.gain as AudioParam & { cancelAndHoldAtTime?: (t: number) => void }).cancelAndHoldAtTime?.(n); gg.gain.setTargetAtTime(0.0001, n, 0.03); } catch { /* */ } window.setTimeout(() => { try { gg.disconnect(); } catch { /* */ } }, 150); } o = null; };
  return stopCur;
}
// ── R12 (owner): Samsoom really speaks ───────────────────────────────────────────────────────────────────────────────
// He says the actual words with the browser's own voice (free, no files), pitched up to sound like a small friendly robot.
// The typing and his mouth follow the speech itself: every word the voice reaches is revealed (word-boundary events), with a
// gentle clock in between, so text never runs ahead of him or lags behind. "Robot" voice style keeps the old synth sound.
// Muted, sound off, no gesture yet, or no speech engine: the text types on its own clock and the mouth still moves.
type Spoken = { text: string; idx: number; word: number; t0: number; cps: number; pending: boolean; active: boolean; done: boolean };
export const spoken: Spoken = { text: '', idx: 0, word: 0, t0: 0, cps: 15, pending: false, active: false, done: false };
/** How many characters of `text` Samsoom has said so far, or null when he is not speaking it (then type on your own clock). */
export function spokenProgress(text: string): number | null {
  if (!text || !(spoken.pending || spoken.active || spoken.done)) return null;
  const off = spoken.text.indexOf(text); if (off < 0) return null;
  if (spoken.done) return text.length;
  if (!spoken.active) return 0;
  const clock = Math.floor(((performance.now() - spoken.t0) / 1000) * spoken.cps);
  const reach = spoken.word > 0 ? Math.max(spoken.idx, Math.min(clock, spoken.idx + 14)) : clock; // follow the words; the clock only bridges gaps
  return Math.max(0, Math.min(text.length, reach - off));
}
const VOICE_STYLE: Record<string, { pitch: number; rate: number }> = { cute: { pitch: 1.75, rate: 1.06 }, deep: { pitch: 0.95, rate: 1.0 } };
let pickedVoice: SpeechSynthesisVoice | null = null, pickedLang = '';
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (pickedVoice && pickedLang === lang) return pickedVoice;
  const all = window.speechSynthesis.getVoices(); if (!all.length) return null;
  const pre = lang.toLowerCase().slice(0, 2), mine = all.filter((v) => v.lang.toLowerCase().startsWith(pre));
  const pool = mine.length ? mine : all.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const fav = /samantha|zira|aria|jenny|karen|moira|tessa|female|google uk english female|google us english|hoda|laila|monica|paulina|amelie|helena/i;
  pickedVoice = pool.find((v) => v.localService && fav.test(v.name)) || pool.find((v) => v.localService) || pool.find((v) => fav.test(v.name)) || pool[0] || null; pickedLang = lang;
  return pickedVoice;
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) { try { window.speechSynthesis.getVoices(); window.speechSynthesis.addEventListener?.('voiceschanged', () => { pickedVoice = null; }); } catch { /* */ } }

// owner (16 Nov): "a nice cute soft voice, not a monkey, not a ghost, not a robot, not repetitive".
// He still says no real words. Each WORD is one soft, connected little phrase (legato, no separate blips): a warm voice
// source shaped by two vowel resonances (the real "ah / oh / ee" of a small child's voice), sliding smoothly from vowel
// to vowel, with a gentle melody that is different for every word (taken from its letters), a breath of air, and a
// soft start and end. Same clock as the typing. Everything of one line goes through ONE gain, so Skip / Next stop it
// instantly.
const FORM: Record<string, [number, number]> = { a: [850, 1400], e: [560, 2100], i: [380, 2600], o: [560, 1000], u: [420, 950], y: [380, 2500] };
const formOf = (ch: string): [number, number] => { const k = ch.normalize('NFD').charAt(0).toLowerCase(); return FORM[k] || (/[اآ]/.test(ch) ? FORM.a : /[و]/.test(ch) ? FORM.u : /[ي]/.test(ch) ? FORM.i : /[一-鿿]/.test(ch) ? [FORM.a, FORM.o, FORM.e, FORM.i][ch.charCodeAt(0) % 4] : FORM.a); };
const hash = (w: string) => { let h = 7; for (const c of w) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
let noiseBuf: AudioBuffer | null = null;
export function babble(text: string, opts: { onEnd?: () => void } = {}) {
  stopCur && stopCur();
  spoken.pending = false; spoken.active = false; spoken.done = false; spoken.text = '';
  const t = (text || '').trim(), chars = Array.from(t), voice = prefs().sound.voice || 'cute';
  const ask = /\?\s*$/.test(t), happy = HAPPY.test(t), base = voice === 'deep' ? 230 : 330;
  const at: number[] = []; let acc = 0; for (const ch of chars) { at.push(acc); acc += charMs(ch) / 1000; } const total = acc;
  // words: runs of letters; each gets its syllables (vowel starts; CJK: every character)
  const words: { s: number; e: number; syl: number[] }[] = []; { let s = -1; chars.forEach((c, k) => { const L = /[\p{L}\p{N}]/u.test(c); if (L && s < 0) s = k; if ((!L || k === chars.length - 1) && s >= 0) { const e = L ? k : k - 1, syl: number[] = []; for (let q = s; q <= e; q++) if (/[一-鿿]/.test(chars[q]) || (isV(chars[q]) && (q === s || !isV(chars[q - 1])))) syl.push(q); if (!syl.length) syl.push(s); words.push({ s, e, syl }); s = -1; } }); }
  const opens: number[] = []; let line: GainNode | null = null;
  if (can() && words.length) { try { const c = ac(), now = c.currentTime + 0.03; line = c.createGain(); line.gain.value = 1; line.connect(out());
    if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    words.forEach((w, wi) => { const h = hash(chars.slice(w.s, w.e + 1).join('')), st = now + at[w.s], en = now + (at[w.e + 1] ?? total) - 0.015, dur = Math.max(0.09, en - st), lastW = wi === words.length - 1;
      // this word's melody: 2–3 gentle steps chosen from its letters (never the same tune twice in a row)
      const steps = [0, 2, 4, 5, 7, 4, 2, -1], s0 = steps[h % 8] - 2, s1 = steps[(h >> 3) % 8] - 2;
      const fBase = base * Math.pow(2, ((wi % 2 ? 1 : 0) + (happy ? 1.5 : 0)) / 12);
      const src = c.createOscillator(), src2 = c.createOscillator(), mix = c.createGain(), f1 = c.createBiquadFilter(), f2 = c.createBiquadFilter(), body = c.createBiquadFilter(), g1 = c.createGain(), g2 = c.createGain(), gb = c.createGain(), env = c.createGain();
      src.type = 'triangle'; src2.type = 'sine'; src2.detune.value = 6; mix.gain.value = 0.5;
      f1.type = 'bandpass'; f1.Q.value = 5; f2.type = 'bandpass'; f2.Q.value = 7; body.type = 'lowpass'; body.frequency.value = 650;
      g1.gain.value = 1.3; g2.gain.value = 0.55; gb.gain.value = 0.35;
      src.connect(mix); src2.connect(mix); mix.connect(f1); mix.connect(f2); mix.connect(body); f1.connect(g1); f2.connect(g2); body.connect(gb); g1.connect(env); g2.connect(env); gb.connect(env); env.connect(line!);
      // pitch: smooth glide through the syllables; a question lifts the last word, a statement settles it
      const pts = w.syl.map((q, j) => [now + at[q], fBase * Math.pow(2, ((j === 0 ? s0 : j === w.syl.length - 1 ? s1 : (s0 + s1) / 2 + 1)) / 12)] as [number, number]);
      const endF = lastW ? (ask ? pts[pts.length - 1][1] * 1.26 : pts[pts.length - 1][1] * (happy ? 1.06 : 0.9)) : pts[pts.length - 1][1];
      [src, src2].forEach((o) => { o.frequency.setValueAtTime(pts[0][1] * 0.97, st); pts.forEach(([tt, f]) => o.frequency.linearRampToValueAtTime(f, Math.max(st + 0.01, tt + 0.03))); o.frequency.linearRampToValueAtTime(endF, en); });
      // vowels: the resonances slide from vowel to vowel (scaled up for a small voice)
      w.syl.forEach((q, j) => { const [a1, a2] = formOf(chars[q]), tt = Math.max(st, now + at[q]); if (j === 0) { f1.frequency.setValueAtTime(a1 * 1.12, st); f2.frequency.setValueAtTime(a2 * 1.12, st); } f1.frequency.linearRampToValueAtTime(a1 * 1.12, tt + 0.04); f2.frequency.linearRampToValueAtTime(a2 * 1.12, tt + 0.04); opens.push(at[q]); });
      // loudness: soft "m"-like start, each syllable swells a little, gentle dip between them, soft end
      env.gain.setValueAtTime(0.0001, st); env.gain.linearRampToValueAtTime(0.22, st + Math.min(0.05, dur * 0.3));
      w.syl.forEach((q, j) => { if (!j) return; const tt = now + at[q]; if (tt > st + 0.04 && tt < en - 0.03) { env.gain.linearRampToValueAtTime(0.13, tt - 0.015); env.gain.linearRampToValueAtTime(0.22, tt + 0.03); } });
      env.gain.setValueAtTime(0.2, Math.max(st + 0.05, en - 0.05)); env.gain.exponentialRampToValueAtTime(0.0001, en + 0.04);
      // a breath of air on the word (very quiet), so it sounds alive and soft, not electronic
      const n = c.createBufferSource(), nf = c.createBiquadFilter(), ng = c.createGain(); n.buffer = noiseBuf; nf.type = 'bandpass'; nf.frequency.value = 1800; nf.Q.value = 0.8; ng.gain.setValueAtTime(0.0001, st); ng.gain.linearRampToValueAtTime(0.012, st + 0.03); ng.gain.exponentialRampToValueAtTime(0.0001, en + 0.03); n.connect(nf); nf.connect(ng); ng.connect(line!);
      // a slow, small vibrato only on longer words
      const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 5.2; vg.gain.value = dur > 0.25 ? fBase * 0.012 : 0; vib.connect(vg); vg.connect(src.frequency); vg.connect(src2.frequency);
      [src, src2, vib].forEach((o) => { o.start(st); o.stop(en + 0.08); }); n.start(st, (h % 900) / 1000); n.stop(en + 0.06);
    });
  } catch { /* silent */ } } else words.forEach((w) => w.syl.forEach((q) => opens.push(at[q])));
  // the mouth opens on each syllable and closes between them, on the same clock
  let alive = true, raf = 0; const t0 = performance.now();
  const flap = () => { if (!alive) return; const el = (performance.now() - t0) / 1000; const open = opens.some((o) => el >= o && el < o + 0.08); mouth(open); if (el < total) raf = requestAnimationFrame(flap); else mouth(false); };
  document.documentElement.removeAttribute('data-sam-done'); speaking(true); raf = requestAnimationFrame(flap);
  const endTm = window.setTimeout(() => { if (!alive) return; alive = false; speaking(false); mouth(false); document.documentElement.setAttribute('data-sam-done', ''); window.setTimeout(() => document.documentElement.removeAttribute('data-sam-done'), 1400); opts.onEnd && opts.onEnd(); }, total * 1000);
  const ln = line as GainNode | null;
  stopCur = () => { alive = false; speaking(false); cancelAnimationFrame(raf); window.clearTimeout(endTm); mouth(false);
    // owner: Skip / Next stop him at once: fade this line out in 40 ms and cut it off
    if (ln) { try { const c = ac(), n0 = c.currentTime; ln.gain.cancelScheduledValues(n0); ln.gain.setValueAtTime(ln.gain.value, n0); ln.gain.linearRampToValueAtTime(0, n0 + 0.04); window.setTimeout(() => { try { ln.disconnect(); } catch { /* */ } }, 80); } catch { /* */ } }
    stopCur = null; };
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
