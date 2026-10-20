'use client';
// R6 §11 · the Repair Lab film: one continuous macro shot of the Deira bench, built from real 3D renders
// (scripts/repairfilm: one fixed camera, one layer per render, so the layers register exactly). The film follows the
// estimator: a screen, battery or charging-port swap. Intake 1.5s · Heat 1.5s · Open 2s · Swap 2s · Boot 1s · Tested 1.5s.
import React, { useEffect, useRef } from 'react';

export type RepairKind = 'scr' | 'bat' | 'port';
const SRC = (l: string) => `/assets/repair/${l}-640.webp`;
const SRC2 = (l: string) => `/assets/repair/${l}-1280.webp`;
const CHECKS = ['Touch', 'Display', 'Face ID', 'Speaker'];
// where the flex clicks home, per swap (percent of the frame)
const SPARK: Record<RepairKind, [number, number]> = { scr: [37, 44], bat: [37.5, 57], port: [77, 66] };
const DUR = 11; // 9.5s of film + a short hold

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
      // 01 intake: the phone slides onto the mat; the job ticket prints
      const sin = eo(seg(t, 0, 1.0)), out = eio(seg(t, DUR - 0.6, 0.6));
      set('phone', { transform: `translateX(${((1 - sin) * 42 - out * 0).toFixed(2)}%)`, opacity: String(cl(sin * 1.4) * (1 - out)) });
      set('ticket', { clipPath: `inset(0 0 ${((1 - eo(seg(t, 0.5, 0.9))) * 100).toFixed(1)}% 0)`, opacity: String(1 - out) });
      // 02 heat: the plate glows orange, the air shimmers, the thermometer climbs to 80°C
      const heat = seg(t, 1.5, 1.2), cool = seg(t, 4.2, 1.2), hv = heat * (1 - cool);
      set('heat', { opacity: (hv * 0.85).toFixed(3) });
      set('shim', { opacity: (hv * 0.6).toFixed(3) });
      const deg = Math.round(24 + 56 * eo(heat) - 30 * eo(cool)); const th = q('temp'); if (th && th.textContent !== deg + '°C') th.textContent = deg + '°C';
      set('thermo', { opacity: String(cl(seg(t, 1.4, 0.3)) * (1 - seg(t, 5.4, 0.4))) }); set('tbar', { transform: `scaleX(${((deg - 24) / 56).toFixed(3)})` });
      // 03 open: the suction cup lands, the pick runs along the seam, the screen lifts away
      const cupIn = eo(seg(t, 3.0, 0.4)), pk = seg(t, 3.3, 0.9), lift = eio(seg(t, 4.2, 0.8));
      const oldScr = K === 'scr' ? 'screen-crack' : 'screen-new';
      set('pick', { opacity: String(pk > 0 && pk < 1 ? 1 : 0), transform: `translateX(${(-18 + pk * 40).toFixed(2)}%)` });
      const scrUp = `translateY(${(-lift * 16).toFixed(2)}%) scale(${(1 + lift * 0.04).toFixed(3)})`;
      set('scr-old', { opacity: String(1 - seg(t, 4.6, 0.4)), transform: scrUp });
      set('cup', { opacity: String(cupIn * (1 - seg(t, 4.6, 0.4))), transform: `translateY(${((1 - cupIn) * -10 - lift * 16).toFixed(2)}%) scale(${(1 + lift * 0.04).toFixed(3)})` });
      // 04 swap: the old part lifts away, the new one lowers in, the flex clicks home with a spark
      const outP = eio(seg(t, 5.0, 0.6)), inP = eio(seg(t, 5.6, 0.9)), spark = seg(t, 6.5, 0.35);
      const back = K === 'scr' ? 0 : eio(seg(t, 6.6, 0.4)); // battery / port: the original screen goes back on
      const newScr = K === 'scr' ? inP : back;
      set('scr-new', { opacity: String(newScr), transform: `translateY(${((1 - newScr) * -16).toFixed(2)}%) scale(${(1 + (1 - newScr) * 0.04).toFixed(3)})` });
      set('bat-old', { opacity: String(K === 'bat' ? 1 - outP : 1), transform: K === 'bat' ? `translateY(${(-outP * 12).toFixed(2)}%)` : '' });
      set('bat-new', { opacity: String(K === 'bat' ? inP : 0), transform: `translateY(${((1 - inP) * -12).toFixed(2)}%)` });
      set('port-old', { opacity: String(K === 'port' ? 1 - outP : 1), transform: K === 'port' ? `translateY(${(-outP * 10).toFixed(2)}%)` : '' });
      set('port-new', { opacity: String(K === 'port' ? inP : 0), transform: `translateY(${((1 - inP) * -10).toFixed(2)}%)` });
      const sp = SPARK[K], se = q('spark'); if (se) { se.style.left = sp[0] + '%'; se.style.top = sp[1] + '%'; se.style.opacity = String(spark > 0 && spark < 1 ? Math.sin(Math.PI * spark) : 0); se.style.transform = `translate(-50%,-50%) scale(${(0.4 + spark * 1.2).toFixed(3)})`; }
      // 05 boot: the Sam Electronics boot logo
      set('boot', { opacity: String(eo(seg(t, 7.1, 0.5)) * (1 - seg(t, 8.6, 0.5)) * (1 - out)) });
      // 06 tested: the checklist ticks one by one, the warranty sticker goes on
      R.querySelectorAll<HTMLElement>('[data-rf="chk"] li').forEach((li, j) => li.classList.toggle('on', t >= 8.1 + j * 0.25));
      set('chk', { opacity: String(cl(seg(t, 7.9, 0.3)) * (1 - out)), transform: `translateY(${((1 - eo(seg(t, 7.9, 0.4))) * 12).toFixed(1)}px)` });
      const st = seg(t, 9.2, 0.25); set('sticker', { opacity: String(st > 0 ? 1 - out : 0), transform: `rotate(-10deg) scale(${(st < 1 ? 1.7 - 0.7 * eo(st) : 1).toFixed(3)})` });
      // the camera dollies in slowly through the whole shot
      set('dolly', { transform: `scale(${(1 + 0.05 * eio(t / 9.5)).toFixed(4)})` });
      R.querySelectorAll<HTMLElement>('.rf-steps li').forEach((li, j) => li.classList.toggle('on', j === (t < 1.5 ? 0 : t < 3 ? 1 : t < 5 ? 2 : t < 7 ? 3 : t < 8 ? 4 : 5)));
      const stp = q('step'); const n = t < 1.5 ? 1 : t < 3 ? 2 : t < 5 ? 3 : t < 7 ? 4 : t < 8 ? 5 : 6; if (stp && stp.textContent !== String(n)) stp.textContent = String(n);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  const STEP = ['Intake', 'Heat', 'Opening', 'Swap', 'Boot', 'Tested'];
  return (
    <div className="rf" ref={root} data-kind={kind}>
      <div className="rf-stage">
        <div className="rf-dolly" data-rf="dolly">
          <Layer l="mat" />
          <span className="rf-heat" data-rf="heat" aria-hidden="true" />
          <div className="rf-phone" data-rf="phone">
            <Layer l="body" />
            <Layer l="bat-old" />
            <Layer l="bat-new" />
            <Layer l="port-old" />
            <Layer l="port-new" />
            <Layer l={kind === 'scr' ? 'screen-crack' : 'screen-new'} k="scr-old" />
            <Layer l="screen-new" k="scr-new" />
            <Layer l="screen-boot" k="boot" />
            <Layer l="cup" />
            <Layer l="pick" />
            <span className="rf-spark" data-rf="spark" aria-hidden="true" />
          </div>
          <span className="rf-shim" data-rf="shim" aria-hidden="true" />
        </div>
        <div className="rf-ticket" data-rf="ticket">
          <b>JOB #4821</b>
          <span data-no-i18n="">{ticket.model}</span>
          <span>{ticket.problems}</span>
        </div>
        <div className="rf-thermo" data-rf="thermo">
          <span>HEAT PLATE</span>
          <b data-rf="temp" data-no-i18n="">24°C</b>
          <i>
            <em data-rf="tbar" />
          </i>
        </div>
        <ul className="rf-chk" data-rf="chk">
          {CHECKS.map((c) => (
            <li key={c}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
        <span className="rf-sticker" data-rf="sticker">
          WARRANTY
          <br />
          TESTED
        </span>
      </div>
      <ol className="rf-steps" aria-hidden="true">
        {STEP.map((s, i) => (
          <li key={s}>
            <small>0{i + 1}</small> {s}
          </li>
        ))}
        <li className="rf-now">
          <small>STEP</small> <b data-rf="step">1</b>/6
        </li>
      </ol>
    </div>
  );
}
