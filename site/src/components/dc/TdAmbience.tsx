'use client';
// Owner (R12b): "the teardown music is a piano?? make it cinematic and exciting like the Marvel shows, not scary, continuous,
// and audible: an ENTRY sound, then it BUILDS as you scroll down, then it slowly fades away once the teardown is gone".
// A small film score, generated live (no files), in a heroic major key:
//  · entry: a rising swell into a big warm brass hit with a low boom, the moment the teardown fills the screen;
//  · bed: a brass + strings pad on a heroic progression (D – Bm – G – A), each chord swelling in;
//  · build: as the visitor scrolls through the film, staccato strings (8ths), then timpani-style drums, then a high brass
//    line join in; the filter opens with the progress;
//  · exit: everything fades out over ~2.5 s when the section leaves the screen.
// Each step of the film still lands with a soft swoosh and a climbing bell. Follows Sounds on/off and volume, starts only
// after the visitor has touched the page (browsers require it), and stops completely off screen.
import { useEffect, useRef } from 'react';
import { prefs } from '@/lib/prefs';

const PROG = [[73.42, 146.83, 185.0, 220.0, 293.66], [61.74, 123.47, 146.83, 185.0, 246.94], [49.0, 98.0, 146.83, 196.0, 246.94], [55.0, 110.0, 138.59, 164.81, 220.0]]; // D, Bm, G, A
const OST = [[293.66, 369.99, 440.0], [246.94, 293.66, 369.99], [196.0, 246.94, 293.66], [220.0, 277.18, 329.63]];
const HI = [587.33, 493.88, 587.33, 659.25];
const BPM = 112, Q = 60 / BPM, BAR = Q * 4, CH = BAR * 2;

export default function TdAmbience() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.closest('section'); if (!host || typeof window === 'undefined') return;
    let c: AudioContext | null = null, bus: GainNode | null = null, wet: ConvolverNode | null = null, padF: BiquadFilterNode | null = null, padG: GainNode | null = null;
    let voices: OscillatorNode[] = [], nodes: AudioScheduledSourceNode[] = [], sched = 0, chordAt = 0, ci = 0, next = 0, step = 0, prog = 0, entered = false;
    let inView = false, touched = false, raf = 0;
    const allowed = () => { const p = prefs().sound; return touched && p.on && p.vol > 0 && !location.pathname.startsWith('/staff'); };
    const level = () => 0.55 * Math.min(1, prefs().sound.vol * 1.8);
    const hall = (ctx: AudioContext) => { const len = Math.floor(ctx.sampleRate * 2.6), b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); } return b; };
    const env = (g: GainNode, at: number, peak: number, a: number, d: number) => { g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(peak, at + a); g.gain.exponentialRampToValueAtTime(0.0001, at + a + d); };
    // the opening: a rising noise swell + pitch riser into a brass hit and a boom
    const entry = () => {
      if (!c || !bus || !wet) return; const t = c.currentTime + 0.05, out = c.createGain(); out.gain.value = 1; out.connect(bus); const wg = c.createGain(); wg.gain.value = 0.5; out.connect(wg); wg.connect(wet!);
      const len = 1.4, nb = c.createBuffer(1, Math.round(c.sampleRate * len), c.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(i / nd.length, 2);
      const n = c.createBufferSource(), bp = c.createBiquadFilter(), ng = c.createGain(); n.buffer = nb; bp.type = 'bandpass'; bp.Q.value = 0.8; bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(5000, t + len); ng.gain.value = 0.35; n.connect(bp); bp.connect(ng); ng.connect(out); n.start(t);
      const hit = t + len; PROG[0].forEach((f, i) => [-7, 7].forEach((dt) => { const o = c!.createOscillator(), g = c!.createGain(), lp = c!.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f * (i ? 1 : 0.5); o.detune.value = dt; lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, hit); lp.frequency.exponentialRampToValueAtTime(700, hit + 2.2); env(g, hit, i ? 0.07 : 0.1, 0.02, 2.4); o.connect(lp); lp.connect(g); g.connect(out); o.start(hit); o.stop(hit + 2.6); }));
      const b = c.createOscillator(), bg = c.createGain(); b.type = 'sine'; b.frequency.setValueAtTime(90, hit); b.frequency.exponentialRampToValueAtTime(38, hit + 0.9); env(bg, hit, 0.9, 0.005, 1.2); b.connect(bg); bg.connect(out); b.start(hit); b.stop(hit + 1.4);
    };
    const build = () => {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      c = c || new C(); if (c.state !== 'running') c.resume();
      bus = c.createGain(); bus.gain.value = 0.0001; bus.connect(c.destination);
      wet = c.createConvolver(); wet.buffer = hall(c); const wg = c.createGain(); wg.gain.value = 0.42; wet.connect(wg); wg.connect(bus);
      const dry = c.createGain(); dry.gain.value = 0.75; dry.connect(bus);
      // the pad: brass-like saws + soft strings through a warm filter that opens with the progress
      padF = c.createBiquadFilter(); padF.type = 'lowpass'; padF.frequency.value = 900; padF.Q.value = 0.6;
      padG = c.createGain(); padG.gain.value = 0.0001; padF.connect(padG); padG.connect(dry); padG.connect(wet!);
      const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 5; vg.gain.value = 3; vib.connect(vg); vib.start(); nodes.push(vib);
      PROG[0].forEach((f, i) => [-8, 8].forEach((dt) => { const o = c!.createOscillator(), g = c!.createGain(); o.type = i < 2 ? 'sawtooth' : 'triangle'; o.frequency.value = f; o.detune.value = dt; vg.connect(o.detune);
        g.gain.value = i === 0 ? 0.05 : 0.032; o.connect(g); g.connect(padF!); o.start(); voices.push(o); nodes.push(o); }));
      const t0 = c.currentTime + 0.1; chordAt = t0; ci = 0; next = t0; step = 0;
      const swell = (at: number) => { if (!padG) return; padG.gain.cancelScheduledValues(at); padG.gain.setValueAtTime(Math.max(0.0001, padG.gain.value), at); padG.gain.linearRampToValueAtTime(0.55, at + 0.25); padG.gain.linearRampToValueAtTime(0.85, at + CH * 0.6); padG.gain.linearRampToValueAtTime(0.6, at + CH); };
      swell(t0);
      const loop = () => {
        if (!c || !padF) return; const ahead = c.currentTime + 0.25;
        while (next < ahead) {
          const at = next, s8 = step % 8, lv1 = prog > 0.12, lv2 = prog > 0.38, lv3 = prog > 0.66;
          // staccato strings (8ths)
          if (lv1) { const f = OST[ci][[0, 1, 2, 1, 0, 1, 2, 1][s8]], o = c.createOscillator(), g = c.createGain(), bp = c.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f; bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.9; env(g, at, s8 % 2 ? 0.05 : 0.075, 0.004, 0.16); o.connect(bp); bp.connect(g); g.connect(dry); g.connect(wet!); o.start(at); o.stop(at + 0.25); }
          // timpani-style drums on 1 and 3, a lighter hit on the off-beat before 3
          if (lv2 && (s8 === 0 || s8 === 4 || s8 === 3)) { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(s8 === 3 ? 110 : 82, at); o.frequency.exponentialRampToValueAtTime(48, at + 0.35); env(g, at, s8 === 3 ? 0.25 : 0.5, 0.004, 0.45); o.connect(g); g.connect(dry); g.connect(wet!); o.start(at); o.stop(at + 0.55); }
          // the high brass line: one long heroic note per bar
          if (lv3 && s8 === 0) { const f = HI[ci], o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(); o.type = 'sawtooth'; o2.type = 'sawtooth'; o.frequency.value = f; o2.frequency.value = f; o2.detune.value = 9; lp.type = 'lowpass'; lp.frequency.value = 2400; g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(0.05, at + 0.18); g.gain.linearRampToValueAtTime(0.0001, at + BAR * 0.95); o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(dry); g.connect(wet!); o.start(at); o2.start(at); o.stop(at + BAR); o2.stop(at + BAR); }
          next += Q / 2; step++;
        }
        if (c.currentTime + 0.3 >= chordAt + CH) { chordAt += CH; ci = (ci + 1) % PROG.length; let k = 0; PROG[ci].forEach((f) => [0, 1].forEach(() => { voices[k++]?.frequency.setTargetAtTime(f, chordAt, 0.25); })); swell(chordAt); }
        padF.frequency.setTargetAtTime(900 + prog * 2600, c.currentTime, 0.6);
      };
      loop(); sched = window.setInterval(loop, 90);
    };
    const fade = (on: boolean) => { if (!c || !bus) return; const t = c.currentTime; bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), t); bus.gain.linearRampToValueAtTime(on ? level() : 0.0001, t + (on ? 1.2 : 2.5)); };
    const teardown = () => { window.clearInterval(sched); sched = 0; nodes.forEach((o) => { try { o.stop(); } catch { /* */ } }); nodes = []; voices = []; try { bus?.disconnect(); } catch { /* */ } bus = null; wet = null; padF = null; padG = null; };
    let offTm = 0;
    const sync = () => {
      const want = inView && allowed() && !document.hidden;
      if (want) { window.clearTimeout(offTm); if (!bus) { build(); if (!entered) { entered = true; entry(); } } fade(true); }
      else if (bus) { fade(false); window.clearTimeout(offTm); offTm = window.setTimeout(() => { if (!(inView && allowed() && !document.hidden)) { teardown(); entered = false; } }, 2700); }
    };
    // each step of the film: a soft swoosh and a bell note that climbs as the phone comes apart
    const hit = (e: Event) => {
      if (!allowed() || !inView) return; if (!bus) { build(); fade(true); } if (!c || !wet) return;
      const d = (e as CustomEvent).detail || {}, k = Math.min(1, (d.idx || 0) / 11), t = c.currentTime + 0.01, vol = Math.min(1, prefs().sound.vol * 1.4), up = (d.dir || 1) > 0;
      const out = c.createGain(); out.gain.value = 0.5 * vol; out.connect(c.destination); const wg = c.createGain(); wg.gain.value = 0.35; out.connect(wg); wg.connect(wet!);
      const len = 0.42, buf = c.createBuffer(1, Math.round(c.sampleRate * len), c.sampleRate), dd = buf.getChannelData(0);
      for (let j = 0; j < dd.length; j++) dd[j] = (Math.random() * 2 - 1) * Math.sin((Math.PI * j) / dd.length);
      const n = c.createBufferSource(), bp = c.createBiquadFilter(), ng = c.createGain(); n.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(up ? 500 : 2400, t); bp.frequency.exponentialRampToValueAtTime(up ? 2400 : 500, t + len); ng.gain.value = 0.2;
      n.connect(bp); bp.connect(ng); ng.connect(out); n.start(t);
      const f = 587.33 * Math.pow(2, Math.round(k * 12) / 12), o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.value = f;
      og.gain.setValueAtTime(0.0001, t + 0.18); og.gain.exponentialRampToValueAtTime(0.07, t + 0.2); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.9); o.connect(og); og.connect(out); o.start(t + 0.18); o.stop(t + 1);
      window.setTimeout(() => { try { out.disconnect(); } catch { /* */ } }, 2500);
    };
    window.addEventListener('se:td-step', hit);
    const progF = () => { raf = 0; const r = host.getBoundingClientRect(); prog = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(progF); };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting && e.intersectionRect.height > innerHeight * 0.5; sync(); }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }); io.observe(host);
    const touch = () => { touched = true; sync(); };
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((ev) => window.addEventListener(ev, touch, { passive: true }));
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('se:prefs', sync); document.addEventListener('visibilitychange', sync);
    return () => { window.removeEventListener('se:td-step', hit); io.disconnect(); ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((ev) => window.removeEventListener(ev, touch)); window.removeEventListener('scroll', onScroll); window.removeEventListener('se:prefs', sync); document.removeEventListener('visibilitychange', sync); window.clearTimeout(offTm); teardown(); };
  }, []);
  return <span ref={ref} hidden aria-hidden="true" />;
}
