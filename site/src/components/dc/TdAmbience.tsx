'use client';
// Owner (16 Nov): "a background suspense music like sound effect, very cinematic, not something you can hear so loud".
// While the teardown is on screen: a low warm hum, a slow soft heartbeat, and a faint high shimmer that grows as the
// phone comes apart. All generated live (no files), very quiet, fades in over 2 s and out over 1.5 s, follows Sounds
// on/off and volume, and only starts after the visitor has touched the page (browsers require it).
import { useEffect, useRef } from 'react';
import { prefs } from '@/lib/prefs';

export default function TdAmbience() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.closest('section'); if (!host || typeof window === 'undefined') return;
    let c: AudioContext | null = null, bus: GainNode | null = null, shim: GainNode | null = null, nodes: AudioScheduledSourceNode[] = [], beat = 0, inView = false, touched = false, raf = 0;
    const allowed = () => { const p = prefs().sound; return touched && p.on && p.vol > 0 && !location.pathname.startsWith('/staff'); };
    const level = () => 0.07 * Math.min(1, prefs().sound.vol * 1.6);
    const build = () => {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      c = c || new C(); if (c.state !== 'running') c.resume();
      bus = c.createGain(); bus.gain.value = 0.0001; bus.connect(c.destination);
      // the hum: two low tones a fifth apart through a slowly breathing filter
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.Q.value = 0.6; lp.connect(bus);
      [55, 82.4, 110.2].forEach((f, i) => { const o = c!.createOscillator(), g = c!.createGain(); o.type = i === 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = (i - 1) * 4; g.gain.value = [0.5, 0.32, 0.08][i]; o.connect(g); g.connect(lp); o.start(); nodes.push(o); });
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 110; lfo.connect(lg); lg.connect(lp.frequency); lfo.start(); nodes.push(lfo);
      // air: soft filtered noise
      const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const n = c.createBufferSource(), nf = c.createBiquadFilter(), ng = c.createGain(); n.buffer = nb; n.loop = true; nf.type = 'bandpass'; nf.frequency.value = 420; nf.Q.value = 0.5; ng.gain.value = 0.05; n.connect(nf); nf.connect(ng); ng.connect(bus); n.start(); nodes.push(n);
      // shimmer: a high, trembling tone that rises with the teardown
      shim = c.createGain(); shim.gain.value = 0; shim.connect(bus);
      [1318.5, 1975.5].forEach((f) => { const o = c!.createOscillator(), tr = c!.createOscillator(), tg = c!.createGain(), og = c!.createGain(); o.type = 'sine'; o.frequency.value = f; tr.frequency.value = 5.5; tg.gain.value = 0.5; og.gain.value = 0.5; tr.connect(tg); tg.connect(og.gain); o.connect(og); og.connect(shim!); o.start(); tr.start(); nodes.push(o, tr); });
      // heartbeat: a soft double thump every 1.9 s
      const thump = (at: number, g0: number) => { const o = c!.createOscillator(), g = c!.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(70, at); o.frequency.exponentialRampToValueAtTime(42, at + 0.22); g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(g0, at + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.3); o.connect(g); g.connect(bus!); o.start(at); o.stop(at + 0.32); };
      const tick = () => { if (!c || !bus) return; const t = c.currentTime + 0.05; thump(t, 0.9); thump(t + 0.28, 0.5); };
      tick(); beat = window.setInterval(tick, 1900);
    };
    const fade = (on: boolean) => { if (!c || !bus) return; const t = c.currentTime; bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), t); bus.gain.linearRampToValueAtTime(on ? level() : 0.0001, t + (on ? 2 : 1.5)); };
    const teardown = () => { window.clearInterval(beat); beat = 0; nodes.forEach((o) => { try { o.stop(); } catch { /* */ } }); nodes = []; try { bus?.disconnect(); } catch { /* */ } bus = null; shim = null; };
    let offTm = 0;
    const sync = () => {
      const want = inView && allowed() && !document.hidden;
      if (want) { window.clearTimeout(offTm); if (!bus) build(); fade(true); }
      else if (bus) { fade(false); window.clearTimeout(offTm); offTm = window.setTimeout(() => { if (!(inView && allowed() && !document.hidden)) teardown(); }, 1700); }
    };
    // the shimmer follows how far through the teardown the visitor is
    const prog = () => { raf = 0; if (!c || !shim) return; const r = host.getBoundingClientRect(), k = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight))); shim.gain.setTargetAtTime(0.004 + k * 0.035, c.currentTime, 0.4); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(prog); };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting && e.intersectionRect.height > innerHeight * 0.5; sync(); }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }); io.observe(host);
    const touch = () => { touched = true; sync(); };
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((ev) => window.addEventListener(ev, touch, { passive: true }));
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('se:prefs', sync); document.addEventListener('visibilitychange', sync);
    return () => { io.disconnect(); ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((ev) => window.removeEventListener(ev, touch)); window.removeEventListener('scroll', onScroll); window.removeEventListener('se:prefs', sync); document.removeEventListener('visibilitychange', sync); window.clearTimeout(offTm); teardown(); try { c?.close(); } catch { /* */ } };
  }, []);
  return <span ref={ref} hidden aria-hidden="true" />;
}
