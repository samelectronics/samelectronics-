// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "BootIntro". Renders against the home page's values (`v`, from HomeV3's logic class).
// 14 Oct §01: the loading screen "buys time" on purpose. Graphite screen, the round logo (no box behind it), a soft
// breathing yellow glow, the yellow LED ring following real loading (fonts, page + hero images, globe data, the parts
// library / first 3D), and five status lines; Samsoom wakes up on the last one. Stays 1.5–5s, once per visit.
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { type Vals } from '@/dc/runtime';
import SESamsoom from '@/components/dc/SESamsoom';

const LINES: { en: string; ar: string; es?: string; fr?: string; fa?: string; ru?: string; hi?: string; ur?: string; icon: string }[] = [
  { en: 'Stocking the shelves…', ar: 'نرتّب البضاعة على الرفوف…', es: 'Llenando los estantes…', fr: 'On remplit les rayons…', fa: 'چیدن قفسه‌ها…', ru: 'Раскладываем товар…', hi: 'अलमारियां भर रहे हैं…', ur: 'شیلف بھر رہے ہیں…', icon: 'shelf' },
  { en: 'Unboxing fresh screens…', ar: 'نفتح كراتين الشاشات الجديدة…', es: 'Abriendo pantallas nuevas…', fr: 'Déballage des nouveaux écrans…', fa: 'باز کردن صفحه‌های تازه…', ru: 'Распаковываем новые экраны…', hi: 'नई स्क्रीन खोल रहे हैं…', ur: 'نئی اسکرینز کھول رہے ہیں…', icon: 'box' },
  { en: 'Charging the batteries…', ar: 'نشحن البطاريات…', es: 'Cargando las baterías…', fr: 'Recharge des batteries…', fa: 'شارژ باتری‌ها…', ru: 'Заряжаем батареи…', hi: 'बैटरी चार्ज कर रहे हैं…', ur: 'بیٹریاں چارج کر رہے ہیں…', icon: 'battery' },
  { en: 'Packing today’s orders…', ar: 'نجهّز طلبات اليوم…', es: 'Embalando los pedidos de hoy…', fr: 'Préparation des commandes du jour…', fa: 'بسته‌بندی سفارش‌های امروز…', ru: 'Упаковываем сегодняшние заказы…', hi: 'आज के ऑर्डर पैक कर रहे हैं…', ur: 'آج کے آرڈر پیک کر رہے ہیں…', icon: 'parcel' },
  { en: 'Waking Samsoom up…', ar: 'نوقظ سمسوم…', es: 'Despertando a Samsoom…', fr: 'On réveille Samsoom…', fa: 'بیدار کردن سامسوم…', ru: 'Будим Samsoom…', hi: 'Samsoom को जगा रहे हैं…', ur: 'سمسوم کو جگا رہے ہیں…', icon: 'samsoom' },
];
const WAKE = 1.4; // s for Samsoom: asleep → yawn → blink → wave
const MIN = 1.5, MAX = 5, DUR = 4.8, R = 92; // owner (28 Oct): the loading screen always runs the same ~5s (DUR), from when it appears; // ring radius = 80 (logo) + 12

function Icon({ k }: { k: string }) {
  const p = { fill: 'none', stroke: '#F7C032', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" style={{ flex: 'none' }}>
      {k === 'shelf' ? (
        <>
          <path d="M3 3v14M17 3v14M3 9h14M3 15h14" {...p} />
          <rect x="5" y="5" width="3" height="4" rx=".6" {...p} />
          <rect x="10" y="11" width="4" height="4" rx=".6" {...p} />
        </>
      ) : k === 'box' ? (
        <>
          <path d="M3 7l7-3 7 3v8l-7 3-7-3z" {...p} />
          <path d="M3 7l7 3 7-3M10 10v8M6.5 5.5l7 3" {...p} />
        </>
      ) : k === 'battery' ? (
        <>
          <rect x="2.5" y="6" width="13.5" height="8" rx="1.6" {...p} />
          <path d="M17.5 8.6v2.8" {...p} />
          <path d="M9.6 7.6 7.6 10.4h3l-2 2.8" {...p} />
        </>
      ) : (
        <>
          <rect x="3" y="5" width="14" height="11" rx="1.4" {...p} />
          <path d="M3 9h14M8 5v4M12 5v4M6 13h3" {...p} />
        </>
      )}
    </svg>
  );
}

export default function BootIntro({ v }: { v: Vals }) {
  const on = !!v.bootOn;
  const [line, setLine] = useState(0);
  const [mood, setMood] = useState('sleep');
  const [leaving, setLeaving] = useState(false);
  const ring = useRef<SVGCircleElement>(null), ringG = useRef<SVGCircleElement>(null);
  const done = useRef(v.bootSkip as () => void);
  done.current = v.bootSkip as () => void;
  const hl = typeof document !== 'undefined' ? document.documentElement.lang : 'en', ar = hl === 'ar' || hl === 'fa' || hl === 'ur';

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.remove('se-boot'); // the pre-paint graphite veil hands over to this screen
    // times are measured from navigation start (performance.now), so the 1.5–5s window includes the time before React
    // mounted; the line cadence shrinks if the mount came late, so all five lines and the wake-up still fit
    const m0 = performance.now() / 1000, timers: number[] = [];
    const step = Math.max(0.45, (DUR - 0.4 - WAKE - 0.3) / (LINES.length - 1));
    // real loading: each task flips to done; the ring eases toward the done fraction
    const tasks = { fonts: false, page: false, globe: false, parts: false };
    const W = window as unknown as { SE_GLOBE?: unknown; seParts?: { peek?: () => unknown } };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => (tasks.fonts = true));
    const onLoad = () => (tasks.page = true);
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    const onLib = () => (tasks.parts = true);
    window.addEventListener('se:parts-lib', onLib, { once: true });
    let shown = 0, raf = 0, exitAt = 0, lineN = 0, wakeAt = 0;
    const C = 2 * Math.PI * R;
    const frame = (now: number) => {
      const t = now / 1000, tm = t - m0;
      if (!tasks.globe && W.SE_GLOBE) tasks.globe = true;
      if (!tasks.parts && W.seParts && W.seParts.peek && W.seParts.peek()) tasks.parts = true;
      const vals = Object.values(tasks), frac = vals.filter(Boolean).length / vals.length;
      const ready = frac === 1 && tm >= MIN;
      // status lines: one every `step`; the last one wakes Samsoom
      const want = Math.min(LINES.length - 1, Math.floor(Math.max(0, tm - 0.3) / step));
      if (tm >= 0.3 && want !== lineN) { lineN = want; setLine(want); if (want === LINES.length - 1) wakeAt = t; }
      if (wakeAt) { const w = t - wakeAt; setMood(w < 0.25 ? 'sleep' : w < 0.75 ? 'yawn' : w < 1.05 ? 'blink' : 'wave'); }
      const woke = wakeAt > 0 && t - wakeAt >= WAKE;
      if (!exitAt && tm >= DUR - 0.4 && ((ready && woke) || tm >= DUR + 1.2)) { exitAt = t; setLeaving(true); }
      // ring: follows loading, never sits at 0, completes on exit
      const target = exitAt ? 1 : Math.min(0.94, 0.08 + frac * 0.86);
      shown += (target - shown) * (exitAt ? 0.25 : 0.06);
      const off = String(C * (1 - shown));
      if (ring.current) ring.current.style.strokeDashoffset = off;
      if (ringG.current) ringG.current.style.strokeDashoffset = off;
      if (exitAt && t - exitAt >= 0.4) { done.current && done.current(); return; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    timers.push(window.setTimeout(() => done.current && done.current(), (DUR + 2) * 1000)); // hard stop
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('se:parts-lib', onLib);
    };
  }, [on]);

  if (!on) return null;
  const L = LINES[line], C = 2 * Math.PI * R, last = line === LINES.length - 1;
  return (
    <div
      className="se-bootv"
      data-no-i18n=""
      data-leaving={leaving ? '' : undefined}
      onClick={v.bootSkip}
      role="status"
      aria-live="polite"
      style={{ position: 'fixed', inset: '0', zIndex: '200', display: 'grid', placeItems: 'center', background: '#26282B', cursor: 'pointer' }}
    >
      <div className="se-boot-c" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="se-boot-logo" style={{ position: 'relative', width: '208px', height: '208px', display: 'grid', placeItems: 'center' }}>
          {/* soft breathing glow: a radial gradient that fades out well inside its own box, so no edge can show */}
          <span className="se-boot-glow" aria-hidden="true" />
          <svg viewBox="0 0 208 208" width="208" height="208" aria-hidden="true" style={{ position: 'absolute', inset: '0', transform: 'rotate(-90deg)', overflow: 'visible' }} fill="none">
            <circle cx="104" cy="104" r={R} stroke="rgba(255,255,255,.08)" strokeWidth="2" />
            {/* LED glow = a wider faint copy of the ring (no CSS filter, whose box used to show as a square) */}
            <circle cx="104" cy="104" r={R} stroke="rgba(247,192,50,.22)" strokeWidth="7" strokeLinecap="round" ref={ringG} strokeDasharray={C} strokeDashoffset={C} className="se-boot-ringg" />
            <circle ref={ring} cx="104" cy="104" r={R} stroke="#F7C032" strokeWidth="2" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} className="se-boot-ring" />
          </svg>
          <img src="assets/se-logo-320.webp" alt="Sam Electronics" width={160} height={160} className="se-boot-img" />
        </div>
        <div className="se-boot-line" style={{ marginTop: '32px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span key={line} className="se-boot-txt" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', font: (ar ? "500 15px 'IBM Plex Sans Arabic'" : "500 15px Inter") + ', sans-serif', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }}>
            {last ? (
              <span className="se-boot-sam" style={{ width: '48px', height: '48px', display: 'inline-block', flex: 'none' }}>
                <SESamsoom mood={mood} size={38} still={mood !== 'wave'} />
              </span>
            ) : (
              <Icon k={L.icon} />
            )}
            {(L as unknown as Record<string, string | undefined>)[hl] || L.en}
          </span>
        </div>
      </div>
    </div>
  );
}
