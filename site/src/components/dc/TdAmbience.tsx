'use client';
// Owner (16 Nov): "for teardown, how's that suspense? the swoosh is cheap; there is no background suspense playing like the
// Marvel theme park shows, or the slow faded studio sound".
// While the teardown is on screen a small film score plays, generated live (no files):
//  · strings: a slow, wide string pad moving through an epic minor progression (Dm → B♭ → F → C), each chord swelling in;
//  · pulse: a low ticking ostinato (the suspense engine), its filter opening as the phone comes apart;
//  · studio space: everything sits in a long, soft hall reverb.
// Each step of the film lands with a deep boom and a short string hit inside the reverb (no whoosh).
// Quiet, fades in over 2.5 s and out over 1.5 s, follows Sounds on/off and volume, starts only after the visitor has
// touched the page (browsers require it), and stops completely when the film leaves the screen.
import { useEffect, useRef } from 'react';
import { prefs } from '@/lib/prefs';

const CHORDS = [[73.4, 146.8, 174.6, 220.0, 293.7], [58.3, 116.5, 146.8, 174.6, 233.1], [87.3, 174.6, 220.0, 261.6, 349.2], [65.4, 130.8, 164.8, 196.0, 261.6]];
const ROOT = [73.4, 58.3, 87.3, 65.4];

export default function TdAmbience() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.closest('section'); if (!host || typeof window === 'undefined') return;
    let c: AudioContext | null = null, bus: GainNode | null = null, wet: ConvolverNode | null = null, pulseF: BiquadFilterNode | null = null;
    let voices: OscillatorNode[] = [], nodes: AudioScheduledSourceNode[] = [], sched = 0, chordAt = 0, ci = 0, nextNote = 0, step = 0, prog = 0;
    let inView = false, touched = false, raf = 0;
    const allowed = () => { const p = prefs().sound; return touched && p.on && p.vol > 0 && !location.pathname.startsWith('/staff'); };
    const level = () => 0.32 * Math.min(1, prefs().sound.vol * 1.6);
    const hall = (ctx: AudioContext) => { const len = Math.floor(ctx.sampleRate * 3.2), b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); } return b; };
    const build = () => {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      c = c || new C(); if (c.state !== 'running') c.resume();
      bus = c.createGain(); bus.gain.value = 0.0001; bus.connect(c.destination);
      wet = c.createConvolver(); wet.buffer = hall(c); const wg = c.createGain(); wg.gain.value = 0.55; wet.connect(wg); wg.connect(bus);
      const dry = c.createGain(); dry.gain.value = 0.6; dry.connect(bus);
      // strings: two detuned saws per note through a warm low-pass, slow vibrato, wide in the reverb
      const sf = c.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = 1400; sf.Q.value = 0.4;
      const sg = c.createGain(); sg.gain.value = 0.0001; sf.connect(sg); sg.connect(dry); sg.connect(wet);
      const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 4.6; vg.gain.value = 4; vib.connect(vg); vib.start(); nodes.push(vib);
      CHORDS[0].forEach((f, i) => [-9, 9].forEach((dt) => { const o = c!.createOscillator(), g = c!.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt; vg.connect(o.detune);
        g.gain.value = i === 0 ? 0.05 : 0.035; o.connect(g); g.connect(sf); o.start(); voices.push(o); nodes.push(o); }));
      // pulse: short low notes, eighths at 96 bpm, accent on the beat
      pulseF = c.createBiquadFilter(); pulseF.type = 'lowpass'; pulseF.frequency.value = 380; pulseF.Q.value = 3; const pg = c.createGain(); pg.gain.value = 0.9; pulseF.connect(pg); pg.connect(dry); pg.connect(wet);
      const t0 = c.currentTime + 0.1; chordAt = t0; ci = 0; nextNote = t0; step = 0;
      const swell = (at: number) => { sg.gain.cancelScheduledValues(at); sg.gain.setValueAtTime(Math.max(0.0001, sg.gain.value), at); sg.gain.linearRampToValueAtTime(0.5, at + 0.12); sg.gain.linearRampToValueAtTime(0.85, at + 3.2); sg.gain.linearRampToValueAtTime(0.55, at + 7.6); };
      swell(t0);
      const loop = () => {
        if (!c || !pulseF) return; const ahead = c.currentTime + 0.25;
        while (nextNote < ahead) {
          const at = nextNote, acc = step % 2 === 0, f = ROOT[ci] * (step % 8 === 6 ? 2 : 1);
          const o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(acc ? 0.22 : 0.12, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
          o.connect(g); g.connect(pulseF); o.start(at); o.stop(at + 0.25);
          nextNote += 60 / 96 / 2; step++;
        }
        if (c.currentTime + 0.3 >= chordAt + 8) { chordAt += 8; ci = (ci + 1) % CHORDS.length; let k = 0; CHORDS[ci].forEach((f) => [0, 1].forEach(() => { voices[k++]?.frequency.setTargetAtTime(f, chordAt, 0.35); })); swell(chordAt); }
        pulseF.frequency.setTargetAtTime(320 + prog * 1500, c.currentTime, 0.5);
      };
      loop(); sched = window.setInterval(loop, 90);
    };
    const fade = (on: boolean) => { if (!c || !bus) return; const t = c.currentTime; bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), t); bus.gain.linearRampToValueAtTime(on ? level() : 0.0001, t + (on ? 2.5 : 1.5)); };
    const teardown = () => { window.clearInterval(sched); sched = 0; nodes.forEach((o) => { try { o.stop(); } catch { /* */ } }); nodes = []; voices = []; try { bus?.disconnect(); } catch { /* */ } bus = null; wet = null; pulseF = null; };
    let offTm = 0;
    const sync = () => {
      const want = inView && allowed() && !document.hidden;
      if (want) { window.clearTimeout(offTm); if (!bus) build(); fade(true); }
      else if (bus) { fade(false); window.clearTimeout(offTm); offTm = window.setTimeout(() => { if (!(inView && allowed() && !document.hidden)) teardown(); }, 1700); }
    };
    // owner (17 Nov): each step is the same soft swoosh as Samsoom's tutorial (no boom, no string hit), with a light
    // bell note that climbs as the phone comes apart
    const hit = (e: Event) => {
      if (!allowed() || !inView) return; if (!bus) { build(); fade(true); } if (!c || !wet) return;
      const d = (e as CustomEvent).detail || {}, k = Math.min(1, (d.idx || 0) / 11), t = c.currentTime + 0.01, vol = Math.min(1, prefs().sound.vol * 1.4), up = (d.dir || 1) > 0;
      const out = c.createGain(); out.gain.value = 0.55 * vol; out.connect(c.destination); const wg = c.createGain(); wg.gain.value = 0.35; out.connect(wg); wg.connect(wet);
      const len = 0.42, buf = c.createBuffer(1, Math.round(c.sampleRate * len), c.sampleRate), dd = buf.getChannelData(0);
      for (let j = 0; j < dd.length; j++) dd[j] = (Math.random() * 2 - 1) * Math.sin((Math.PI * j) / dd.length);
      const n = c.createBufferSource(), bp = c.createBiquadFilter(), ng = c.createGain(); n.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(up ? 500 : 2400, t); bp.frequency.exponentialRampToValueAtTime(up ? 2400 : 500, t + len); ng.gain.value = 0.22;
      n.connect(bp); bp.connect(ng); ng.connect(out); n.start(t);
      const f = 523.25 * Math.pow(2, Math.round(k * 12) / 12), o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.value = f;
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
    return () => { window.removeEventListener('se:td-step', hit); io.disconnect(); ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((ev) => window.removeEventListener(ev, touch)); window.removeEventListener('scroll', onScroll); window.removeEventListener('se:prefs', sync); document.removeEventListener('visibilitychange', sync); window.clearTimeout(offTm); teardown(); try { c?.close(); } catch { /* */ } };
  }, []);
  return <span ref={ref} hidden aria-hidden="true" />;
}
