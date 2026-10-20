'use client';
// R6 §11 · the Repair Lab film: one continuous macro shot of the Deira bench, built from real 3D renders
// (scripts/repairfilm: one fixed camera, one layer per render, so the layers register exactly). The film follows the
// estimator: a screen, battery or charging-port swap. Intake 1.5s · Heat 1.5s · Open 2s · Swap 2s · Boot 1s · Tested 2s.
import React, { useEffect, useRef } from 'react';

export type RepairKind = 'scr' | 'bat' | 'port';
const SRC = (l: string) => `/assets/repair/${l}-640.webp`;
const SRC2 = (l: string) => `/assets/repair/${l}-1280.webp`;
import ANCH from '@/content/repairAnchors.json';
// Urgent 4: no overlay boxes on the render any more. The temperature shows on the heat plate's own LCD (placed with the
// anchors the renderer projects), the checks run on the phone's own screen (test0–4 layers, icons only), the warranty
// seal is a real decal; the job line and the live status sit in a caption bar under the film.
const DUR = 11.5;
const lcdBox = (() => { const xs = ANCH.lcd.map((p) => p[0]), ys = ANCH.lcd.map((p) => p[1]); const l = Math.min(...xs), t = Math.min(...ys); return { left: l + '%', top: t + '%', width: Math.max(...xs) - l + '%', height: Math.max(...ys) - t + '%' }; })();

const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x), seg = (t: number, a: number, d: number) => cl((t - a) / d);
const eio = (x: number) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);

function Layer({ l, k }: { l: string; k?: string }) {
  return <img className="rf-l" data-rf={k || l} src={SRC(l)} srcSet={`${SRC(l)} 640w, ${SRC2(l)} 1280w`} sizes="(max-width: 900px) 100vw, 640px" alt="" draggable={false} />;
}

export default function RepairFilm({ kind, ticket }: { kind: RepairKind; ticket: { model: string; problems: string } }) {
  const root = useRef<HTMLDivElement>(null);
  const t0 = useRef<number | null>(null);
  useEffect(() => { t0.current = null; }, [kind]); // a new problem restarts the film
  useEffect(() => {
    const R = root.current; if (!R) return;
    let vis = false, raf = 0;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (!vis) t0.current = null; }, { threshold: 0.35 });
    io.observe(R);
    const q = (k: string) => R.querySelector<HTMLElement>(`[data-rf="${k}"]`);
    const set = (k: string, s: Partial<CSSStyleDeclaration>) => { const e = q(k); if (e) Object.assign(e.style, s); };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!vis || document.hidden) return;
      if (t0.current == null) t0.current = now;
      let t = (now - t0.current) / 1000; if (t > DUR) { t0.current = now; t = 0; }
      const K = R.dataset.kind as RepairKind;
      // 01 intake: the phone slides onto the plate from the side (solid, no ghosting); at the end it rests, then the loop
      const sin = eio(seg(t, 0, 1.1)), out = eio(seg(t, DUR - 0.5, 0.5));
      set('phone', { transform: `translateX(${((1 - sin) * 70).toFixed(2)}%)`, opacity: String(1 - out) });
      // 02 heat: the plate's LED and LCD come on and the temperature climbs to 80°C on the plate's own display, then cools
      const heat = seg(t, 1.4, 1.2), cool = seg(t, 4.4, 1.4), hv = cl(seg(t, 1.3, 0.25) * (1 - seg(t, 6.2, 0.5)));
      set('hot', { opacity: hv.toFixed(3) });
      const deg = Math.round(24 + 56 * eo(heat) - 30 * eo(cool)), th = q('temp'); if (th && th.textContent !== deg + '°C') th.textContent = deg + '°C';
      set('temp', { opacity: (0.25 + 0.75 * hv).toFixed(3) });
      // 03 open: the suction cup lands, the pick runs along the seam, the screen lifts away
      const cupIn = eo(seg(t, 3.0, 0.4)), pk = seg(t, 3.3, 0.9), lift = eio(seg(t, 4.2, 0.8));
      set('pick', { opacity: String(pk > 0 && pk < 1 ? 1 : 0), transform: `translateX(${(-18 + pk * 40).toFixed(2)}%)` });
      const scrUp = `translateY(${(-lift * 16).toFixed(2)}%) scale(${(1 + lift * 0.04).toFixed(3)})`;
      set('scr-old', { opacity: String(1 - seg(t, 4.6, 0.4)), transform: scrUp });
      set('cup', { opacity: String(cupIn * (1 - seg(t, 4.6, 0.4))), transform: `translateY(${((1 - cupIn) * -10 - lift * 16).toFixed(2)}%) scale(${(1 + lift * 0.04).toFixed(3)})` });
      // 04 swap: the old part lifts away, the new one lowers in and seats
      const outP = eio(seg(t, 5.0, 0.6)), inP = eio(seg(t, 5.6, 0.9));
      const back = K === 'scr' ? 0 : eio(seg(t, 6.6, 0.4)); // battery / port: the original screen goes back on
      const newScr = K === 'scr' ? inP : back;
      set('scr-new', { opacity: String(newScr), transform: `translateY(${((1 - newScr) * -16).toFixed(2)}%) scale(${(1 + (1 - newScr) * 0.04).toFixed(3)})` });
      set('bat-old', { opacity: String(K === 'bat' ? 1 - outP : 1), transform: K === 'bat' ? `translateY(${(-outP * 12).toFixed(2)}%)` : '' });
      set('bat-new', { opacity: String(K === 'bat' ? inP : 0), transform: `translateY(${((1 - inP) * -12).toFixed(2)}%)` });
      set('port-old', { opacity: String(K === 'port' ? 1 - outP : 1), transform: K === 'port' ? `translateY(${(-outP * 10).toFixed(2)}%)` : '' });
      set('port-new', { opacity: String(K === 'port' ? inP : 0), transform: `translateY(${((1 - inP) * -10).toFixed(2)}%)` });
      // 05 boot: the SE mark on the new screen
      set('boot', { opacity: String(eo(seg(t, 7.1, 0.5))) });
      // 06 tested: the QC app on the phone's own screen ticks touch, display, face, speaker; then the seal goes on
      for (let n = 0; n <= 4; n++) set('test' + n, { opacity: String(cl(seg(t, 8.0 + n * 0.32, 0.12))) });
      const st = seg(t, 9.75, 0.28); set('sticker', { opacity: String(st > 0 ? 1 : 0), transform: `scale(${(st < 1 ? 1.5 - 0.5 * eo(st) : 1).toFixed(3)})` });
      // the camera dollies in slowly through the whole shot
      set('dolly', { transform: `scale(${(1 + 0.05 * eio(t / 10)).toFixed(4)})` });
      const ph = t < 1.5 ? 0 : t < 3 ? 1 : t < 5 ? 2 : t < 7 ? 3 : t < 8 ? 4 : 5;
      R.querySelectorAll<HTMLElement>('.rf-steps li').forEach((li, j) => li.classList.toggle('on', j === ph));
      R.querySelectorAll<HTMLElement>('[data-rf="now"] > span').forEach((sp, j) => sp.classList.toggle('on', j === ph));
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  const STEP = ['Intake', 'Heat', 'Opening', 'Swap', 'Boot', 'Tested'];
  const NOW = ['On the bench', 'Heating the seal', 'Opening the phone', kind === 'scr' ? 'New screen fitted' : kind === 'bat' ? 'New battery fitted' : 'New port fitted', 'First start', 'Every check passed'];
  return (
    <div className="rf" ref={root} data-kind={kind}>
      <div className="rf-stage">
        <div className="rf-dolly" data-rf="dolly">
          <Layer l="mat" />
          <Layer l="mat-hot" k="hot" />
          <b className="rf-lcd" data-rf="temp" data-no-i18n="" style={lcdBox}>24°C</b>
          <div className="rf-phone" data-rf="phone">
            <Layer l="body" />
            <Layer l="bat-old" />
            <Layer l="bat-new" />
            <Layer l="port-old" />
            <Layer l="port-new" />
            <Layer l={kind === 'scr' ? 'screen-crack' : 'screen-new'} k="scr-old" />
            <Layer l="screen-new" k="scr-new" />
            <Layer l="screen-boot" k="boot" />
            {[0, 1, 2, 3, 4].map((n) => <Layer key={n} l={'test' + n} />)}
            <span className="rf-seal" data-rf="sticker" style={{ transformOrigin: `${ANCH.sticker[0]}% ${ANCH.sticker[1]}%` }}>
              <Layer l="sticker" k="sticker-img" />
            </span>
            <Layer l="cup" />
            <Layer l="pick" />
          </div>
        </div>
      </div>
      <div className="rf-cap">
        <span className="rf-job">
          <b data-no-i18n="">#4821</b>
          <span data-no-i18n="">{ticket.model}</span>
          <span>{ticket.problems}</span>
        </span>
        <span className="rf-now" data-rf="now">
          {NOW.map((n) => <span key={n}>{n}</span>)}
        </span>
      </div>
      <ol className="rf-steps" aria-hidden="true">
        {STEP.map((s, i) => (
          <li key={s}>
            <small>0{i + 1}</small> {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
