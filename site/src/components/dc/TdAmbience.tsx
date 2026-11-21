'use client';
// Owner (R15): "the teardown music is meh at the beginning, then cheap and normal sounding, not cinematic, like in the
// distance. Something SUSPENSE, like cinema, like the movies, more a background sound effect than music."
// So this is sound design, not a song (no chords, no melody), generated live (no files), close and present:
//  · entry: a rising whoosh that pulls into an IMPACT: a deep sub drop, a "braam" (huge low brass) and a metal ring;
//  · bed: a sub drone you feel more than hear (two low tones slowly beating), a dark rumble and a thin airy shimmer;
//  · tension: a heartbeat pulse (boom-boom) that speeds up as the visitor scrolls deeper, a clock-like tick joins it,
//    and every few bars a reversed swell rises into another braam;
//  · exit: everything fades out over ~2.5 s when the section leaves the screen.
// Each step of the film still lands with a short whoosh. Follows Sounds on/off and volume, starts only after the visitor
// has touched the page (browsers require it), and stops completely off screen.
import { useEffect, useRef } from 'react';
import { prefs } from '@/lib/prefs';

export default function TdAmbience() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.closest('section'); if (!host || typeof window === 'undefined') return;
    let c: AudioContext | null = null, bus: GainNode | null = null, wet: ConvolverNode | null = null, dry: GainNode | null = null, air: BiquadFilterNode | null = null, airG: GainNode | null = null;
    let nodes: AudioScheduledSourceNode[] = [], sched = 0, nextBeat = 0, beat = 0, nextSwell = 0, prog = 0, entered = false;
    let inView = false, touched = false, raf = 0;
    const allowed = () => { const p = prefs().sound; return touched && p.on && p.vol > 0 && !location.pathname.startsWith('/staff'); };
    const level = () => 0.8 * Math.min(1, prefs().sound.vol * 1.8);
    const room = (ctx: AudioContext) => { const len = Math.floor(ctx.sampleRate * 1.6), b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5); } return b; };
    const noise = (ctx: AudioContext, sec: number, shape?: (x: number) => number) => { const b = ctx.createBuffer(1, Math.round(ctx.sampleRate * sec), ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (shape ? shape(i / d.length) : 1); return b; };
    const drive = (ctx: AudioContext, k: number) => { const s = ctx.createWaveShaper(), n = 1024, cv = new Float32Array(n); for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; cv[i] = Math.tanh(k * x) / Math.tanh(k); } s.curve = cv; return s; };
    const send = (g: AudioNode, w = 0.25) => { g.connect(dry!); const s = c!.createGain(); s.gain.value = w; g.connect(s); s.connect(wet!); };
    // the "braam": a huge low brass blast, detuned saws through a growling filter that closes
    const braam = (at: number, amp: number) => {
      if (!c) return; const out = c.createGain(), lp = c.createBiquadFilter(), sh = drive(c, 2.2); lp.type = 'lowpass'; lp.Q.value = 4;
      lp.frequency.setValueAtTime(180, at); lp.frequency.exponentialRampToValueAtTime(1400, at + 0.12); lp.frequency.exponentialRampToValueAtTime(220, at + 2.6);
      out.gain.setValueAtTime(0.0001, at); out.gain.exponentialRampToValueAtTime(amp, at + 0.06); out.gain.exponentialRampToValueAtTime(0.0001, at + 3.2);
      [41.2, 41.2, 61.7, 82.4].forEach((f, i) => { const o = c!.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = [-12, 10, -6, 7][i]; o.connect(sh); o.start(at); o.stop(at + 3.3); });
      sh.connect(lp); lp.connect(out); send(out, 0.3);
    };
    const boom = (at: number, amp: number, f0 = 70, f1 = 32, len = 1.2) => { if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f1, at + len * 0.7); g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(amp, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + len); o.connect(g); send(g, 0.12); o.start(at); o.stop(at + len + 0.05); };
    const metal = (at: number, amp: number) => { if (!c) return; const n = c.createBufferSource(), bp = c.createBiquadFilter(), bp2 = c.createBiquadFilter(), g = c.createGain(); n.buffer = noise(c, 2, (x) => Math.pow(1 - x, 6)); bp.type = 'bandpass'; bp.frequency.value = 860; bp.Q.value = 30; bp2.type = 'bandpass'; bp2.frequency.value = 2310; bp2.Q.value = 40; g.gain.value = amp; n.connect(bp); n.connect(bp2); bp.connect(g); bp2.connect(g); send(g, 0.45); n.start(at); };
    // a reversed swell: noise and a pitch that rise and suck in, ending exactly on `end`
    const swell = (end: number, len: number, amp: number) => { if (!c) return; const t = end - len, n = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); n.buffer = noise(c, len, (x) => Math.pow(x, 2.4)); bp.type = 'bandpass'; bp.Q.value = 1.2; bp.frequency.setValueAtTime(240, t); bp.frequency.exponentialRampToValueAtTime(4200, end); g.gain.value = amp; n.connect(bp); bp.connect(g); send(g, 0.2); n.start(t);
      const o = c.createOscillator(), o2 = c.createOscillator(), og = c.createGain(), lp = c.createBiquadFilter(); o.type = 'sawtooth'; o2.type = 'sawtooth'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(440, end); o2.frequency.setValueAtTime(111.5, t); o2.frequency.exponentialRampToValueAtTime(446, end); lp.type = 'lowpass'; lp.frequency.setValueAtTime(400, t); lp.frequency.exponentialRampToValueAtTime(3000, end);
      og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(amp * 0.28, end - 0.02); og.gain.linearRampToValueAtTime(0.0001, end + 0.03); o.connect(lp); o2.connect(lp); lp.connect(og); send(og, 0.2); o.start(t); o2.start(t); o.stop(end + 0.05); o2.stop(end + 0.05); };
    const entry = () => { if (!c) return; const hitAt = c.currentTime + 1.6; swell(hitAt, 1.55, 0.5); boom(hitAt, 1, 80, 28, 2.2); braam(hitAt, 0.42); metal(hitAt, 0.6); };
    const build = () => {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      c = c || new C(); if (c.state !== 'running') c.resume();
      bus = c.createGain(); bus.gain.value = 0.0001; bus.connect(c.destination);
      // close, not far away: a short tight room, mostly dry
      wet = c.createConvolver(); wet.buffer = room(c); const wg = c.createGain(); wg.gain.value = 0.5; wet.connect(wg); wg.connect(bus);
      dry = c.createGain(); dry.gain.value = 1; dry.connect(bus);
      // the drone: two low tones a fifth apart, slowly beating, felt more than heard
      [[41.2, -4], [41.2, 5], [61.7, 0]].forEach(([f, dt], i) => { const o = c!.createOscillator(), g = c!.createGain(); o.type = i === 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = dt; g.gain.value = i === 2 ? 0.07 : 0.16; o.connect(g); g.connect(dry!); o.start(); nodes.push(o); });
      // dark rumble
      const r = c.createBufferSource(), rl = c.createBiquadFilter(), rg = c.createGain(); r.buffer = noise(c, 4); r.loop = true; rl.type = 'lowpass'; rl.frequency.value = 160; rg.gain.value = 0.22; r.connect(rl); rl.connect(rg); rg.connect(dry); r.start(); nodes.push(r);
      // a thin airy shimmer that opens as you go deeper
      const a = c.createBufferSource(); a.buffer = noise(c, 4); a.loop = true; air = c.createBiquadFilter(); air.type = 'bandpass'; air.frequency.value = 4200; air.Q.value = 3; airG = c.createGain(); airG.gain.value = 0.004; a.connect(air); air.connect(airG); send(airG, 0.6); a.start(); nodes.push(a);
      nextBeat = c.currentTime + 2.2; beat = 0; nextSwell = c.currentTime + 7;
      const loop = () => {
        if (!c || !air || !airG) return; const ahead = c.currentTime + 0.3;
        // heartbeat: boom-boom, faster as the visitor scrolls deeper (1.5 s → 0.75 s)
        while (nextBeat < ahead) { const at = nextBeat, gap = 1.5 - prog * 0.75; boom(at, 0.55, 64, 38, 0.5); boom(at + 0.22, 0.32, 58, 36, 0.4);
          if (prog > 0.15) { const o = c.createOscillator(), g = c.createGain(), hp = c.createBiquadFilter(); o.type = 'square'; o.frequency.value = 2400; hp.type = 'highpass'; hp.frequency.value = 1800; g.gain.setValueAtTime(0.0001, at + gap / 2); g.gain.exponentialRampToValueAtTime(0.05, at + gap / 2 + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, at + gap / 2 + 0.04); o.connect(hp); hp.connect(g); send(g, 0.3); o.start(at + gap / 2); o.stop(at + gap / 2 + 0.06); }
          nextBeat += gap; beat++; }
        // every few bars, a swell into a braam (more often and bigger as the tension rises)
        if (nextSwell < c.currentTime + 2.6 && prog > 0.05) { const end = nextSwell + 2.4; swell(end, 2.3, 0.28 + prog * 0.25); braam(end, 0.16 + prog * 0.2); if (prog > 0.5) metal(end, 0.3); nextSwell = end + 7 - prog * 3; }
        air.frequency.setTargetAtTime(3000 + prog * 4000, c.currentTime, 0.8); airG.gain.setTargetAtTime(0.004 + prog * 0.03, c.currentTime, 0.8);
      };
      loop(); sched = window.setInterval(loop, 100);
    };
    const fade = (on: boolean) => { if (!c || !bus) return; const t = c.currentTime; bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), t); bus.gain.linearRampToValueAtTime(on ? level() : 0.0001, t + (on ? 0.8 : 2.5)); };
    const teardown = () => { window.clearInterval(sched); sched = 0; nodes.forEach((o) => { try { o.stop(); } catch { /* */ } }); nodes = []; try { bus?.disconnect(); } catch { /* */ } bus = null; wet = null; dry = null; air = null; airG = null; };
    let offTm = 0;
    const sync = () => {
      const want = inView && allowed() && !document.hidden;
      if (want) { window.clearTimeout(offTm); if (!bus) { build(); if (!entered) { entered = true; entry(); } } fade(true); }
      else if (bus) { fade(false); window.clearTimeout(offTm); offTm = window.setTimeout(() => { if (!(inView && allowed() && !document.hidden)) { teardown(); entered = false; } }, 2700); }
    };
    // each step of the film: a short tight whoosh (up when going down the page, down when coming back)
    const hit = (e: Event) => {
      if (!allowed() || !inView) return; if (!bus) { build(); fade(true); } if (!c) return;
      const d = (e as CustomEvent).detail || {}, t = c.currentTime + 0.01, vol = Math.min(1, prefs().sound.vol * 1.4), up = (d.dir || 1) > 0;
      const out = c.createGain(); out.gain.value = 0.45 * vol; out.connect(c.destination);
      const len = 0.38, n = c.createBufferSource(), bp = c.createBiquadFilter(); n.buffer = noise(c, len, (x) => Math.sin(Math.PI * x)); bp.type = 'bandpass'; bp.Q.value = 1.6;
      bp.frequency.setValueAtTime(up ? 400 : 2600, t); bp.frequency.exponentialRampToValueAtTime(up ? 2600 : 400, t + len); n.connect(bp); bp.connect(out); n.start(t);
      window.setTimeout(() => { try { out.disconnect(); } catch { /* */ } }, 1200);
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
