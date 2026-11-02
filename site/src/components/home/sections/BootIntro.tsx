// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "BootIntro". Renders against the home page's values (`v`, from HomeV3's logic class).
// 14 Oct §01: the loading screen "buys time" on purpose. Graphite screen, the round logo (no box behind it), a soft
// breathing yellow glow, the yellow LED ring following real loading (fonts, page + hero images, globe data, the parts
// library / first 3D), and five status lines; Samsoom wakes up on the last one. Stays 2.4–6s (R10 A1), once per visit.
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { type Vals } from '@/dc/runtime';
import SESamsoom from '@/components/dc/SESamsoom';

type Msg = { icon: string; t: Record<string, string> };
// R10 A2: a pool of 15 messages; 4 are picked per visit, then Samsoom wakes up. Written in the 12 languages a first-time
// visitor's browser is most likely to ask for (others see English until they pick their language).
const POOL: Msg[] = [
  { icon: 'shelf', t: { en: 'Stocking the shelves', ar: 'نرتّب البضاعة على الرفوف', es: 'Llenando los estantes', fr: 'On remplit les rayons', fa: 'چیدن قفسه‌ها', ru: 'Раскладываем товар', hi: 'अलमारियां भर रहे हैं', ur: 'شیلف بھر رہے ہیں', de: 'Regale werden aufgefüllt', zh: '正在上架', pt: 'Abastecendo as prateleiras', it: 'Riempiamo gli scaffali' } },
  { icon: 'box', t: { en: 'Unboxing fresh screens', ar: 'نفتح كراتين الشاشات الجديدة', es: 'Abriendo pantallas nuevas', fr: 'Déballage des nouveaux écrans', fa: 'باز کردن صفحه‌های تازه', ru: 'Распаковываем новые экраны', hi: 'नई स्क्रीन खोल रहे हैं', ur: 'نئی اسکرینز کھول رہے ہیں', de: 'Neue Displays werden ausgepackt', zh: '正在拆封新屏幕', pt: 'Desembalando telas novas', it: 'Apriamo i nuovi schermi' } },
  { icon: 'battery', t: { en: 'Charging the batteries', ar: 'نشحن البطاريات', es: 'Cargando las baterías', fr: 'Recharge des batteries', fa: 'شارژ باتری‌ها', ru: 'Заряжаем батареи', hi: 'बैटरी चार्ज कर रहे हैं', ur: 'بیٹریاں چارج کر رہے ہیں', de: 'Akkus werden geladen', zh: '正在给电池充电', pt: 'Carregando as baterias', it: 'Ricarichiamo le batterie' } },
  { icon: 'parcel', t: { en: 'Packing today’s orders', ar: 'نجهّز طلبات اليوم', es: 'Embalando los pedidos de hoy', fr: 'Préparation des commandes du jour', fa: 'بسته‌بندی سفارش‌های امروز', ru: 'Упаковываем заказы', hi: 'आज के ऑर्डर पैक कर रहे हैं', ur: 'آج کے آرڈر پیک کر رہے ہیں', de: 'Heutige Bestellungen werden gepackt', zh: '正在打包今日订单', pt: 'Embalando os pedidos de hoje', it: 'Imballiamo gli ordini di oggi' } },
  { icon: 'screen', t: { en: 'Calibrating screens', ar: 'نعاير الشاشات', es: 'Calibrando pantallas', fr: 'Calibrage des écrans', fa: 'کالیبره کردن صفحه‌ها', ru: 'Калибруем экраны', hi: 'स्क्रीन कैलिब्रेट कर रहे हैं', ur: 'اسکرینز کیلیبریٹ کر رہے ہیں', de: 'Displays werden kalibriert', zh: '正在校准屏幕', pt: 'Calibrando telas', it: 'Calibriamo gli schermi' } },
  { icon: 'flex', t: { en: 'Testing flex cables', ar: 'نفحص كابلات الفليكس', es: 'Probando cables flex', fr: 'Test des nappes flex', fa: 'تست کابل‌های فلت', ru: 'Проверяем шлейфы', hi: 'फ्लेक्स केबल जांच रहे हैं', ur: 'فلیکس کیبلز ٹیسٹ کر رہے ہیں', de: 'Flexkabel werden getestet', zh: '正在测试排线', pt: 'Testando cabos flex', it: 'Testiamo i cavi flex' } },
  { icon: 'glass', t: { en: 'Polishing the glass', ar: 'نلمّع الزجاج', es: 'Puliendo el cristal', fr: 'Polissage des vitres', fa: 'براق کردن شیشه‌ها', ru: 'Полируем стекло', hi: 'ग्लास चमका रहे हैं', ur: 'شیشہ چمکا رہے ہیں', de: 'Glas wird poliert', zh: '正在抛光玻璃', pt: 'Polindo o vidro', it: 'Lucidiamo il vetro' } },
  { icon: 'sticker', t: { en: 'Checking warranty stickers', ar: 'نتحقق من ملصقات الضمان', es: 'Revisando sellos de garantía', fr: 'Vérification des étiquettes de garantie', fa: 'بررسی برچسب‌های گارانتی', ru: 'Проверяем гарантийные пломбы', hi: 'वारंटी स्टिकर जांच रहे हैं', ur: 'وارنٹی اسٹیکرز چیک کر رہے ہیں', de: 'Garantiesiegel werden geprüft', zh: '正在检查保修贴', pt: 'Conferindo selos de garantia', it: 'Controlliamo i sigilli di garanzia' } },
  { icon: 'scope', t: { en: 'Inspecting every part', ar: 'نفحص كل قطعة', es: 'Inspeccionando cada pieza', fr: 'Inspection de chaque pièce', fa: 'بازرسی تک‌تک قطعات', ru: 'Осматриваем каждую деталь', hi: 'हर पार्ट जांच रहे हैं', ur: 'ہر پارٹ کا معائنہ کر رہے ہیں', de: 'Jedes Teil wird geprüft', zh: '正在检查每个配件', pt: 'Inspecionando cada peça', it: 'Ispezioniamo ogni pezzo' } },
  { icon: 'tools', t: { en: 'Sharpening the screwdrivers', ar: 'نجهّز المفكات', es: 'Afilando los destornilladores', fr: 'On affûte les tournevis', fa: 'آماده کردن پیچ‌گوشتی‌ها', ru: 'Готовим отвёртки', hi: 'पेचकस तैयार कर रहे हैं', ur: 'پیچ کس تیار کر رہے ہیں', de: 'Schraubendreher werden bereitgelegt', zh: '正在准备螺丝刀', pt: 'Afiando as chaves de fenda', it: 'Prepariamo i cacciaviti' } },
  { icon: 'truck', t: { en: 'Loading the delivery van', ar: 'نحمّل سيارة التوصيل', es: 'Cargando la furgoneta', fr: 'Chargement de la camionnette', fa: 'بارگیری ون تحویل', ru: 'Загружаем фургон', hi: 'डिलीवरी वैन लोड कर रहे हैं', ur: 'ڈیلیوری وین لوڈ کر رہے ہیں', de: 'Lieferwagen wird beladen', zh: '正在装载送货车', pt: 'Carregando a van de entregas', it: 'Carichiamo il furgone' } },
  { icon: 'chip', t: { en: 'Warming up the logic boards', ar: 'نسخّن اللوحات الأم', es: 'Calentando las placas', fr: 'Préchauffage des cartes mères', fa: 'گرم کردن بردها', ru: 'Прогреваем платы', hi: 'लॉजिक बोर्ड गर्म कर रहे हैं', ur: 'لاجک بورڈز گرم کر رہے ہیں', de: 'Platinen werden vorgewärmt', zh: '正在预热主板', pt: 'Aquecendo as placas', it: 'Scaldiamo le schede madri' } },
  { icon: 'camera', t: { en: 'Focusing the cameras', ar: 'نضبط تركيز الكاميرات', es: 'Enfocando las cámaras', fr: 'Mise au point des caméras', fa: 'فوکوس کردن دوربین‌ها', ru: 'Фокусируем камеры', hi: 'कैमरे फोकस कर रहे हैं', ur: 'کیمرے فوکس کر رہے ہیں', de: 'Kameras werden scharfgestellt', zh: '正在对焦摄像头', pt: 'Focando as câmeras', it: 'Mettiamo a fuoco le fotocamere' } },
  { icon: 'speaker', t: { en: 'Tuning the speakers', ar: 'نضبط السماعات', es: 'Afinando los altavoces', fr: 'Réglage des haut-parleurs', fa: 'تنظیم بلندگوها', ru: 'Настраиваем динамики', hi: 'स्पीकर ट्यून कर रहे हैं', ur: 'اسپیکرز ٹیون کر رہے ہیں', de: 'Lautsprecher werden abgestimmt', zh: '正在调试扬声器', pt: 'Afinando os alto-falantes', it: 'Accordiamo gli altoparlanti' } },
  { icon: 'plug', t: { en: 'Plugging in the test rig', ar: 'نوصّل جهاز الفحص', es: 'Conectando el banco de pruebas', fr: 'Branchement du banc de test', fa: 'وصل کردن دستگاه تست', ru: 'Подключаем тестовый стенд', hi: 'टेस्ट रिग जोड़ रहे हैं', ur: 'ٹیسٹ رِگ لگا رہے ہیں', de: 'Prüfstand wird angeschlossen', zh: '正在连接测试台', pt: 'Ligando a bancada de testes', it: 'Colleghiamo il banco prova' } },
];
const WAKE_MSG: Record<string, string> = { en: 'Waking Samsoom up', ar: 'نوقظ سمسوم', es: 'Despertando a Samsoom', fr: 'On réveille Samsoom', fa: 'بیدار کردن سامسوم', ru: 'Будим Samsoom', hi: 'Samsoom को जगा रहे हैं', ur: 'سمسوم کو جگا رہے ہیں', de: 'Samsoom wird geweckt', zh: '正在唤醒 Samsoom', pt: 'Acordando o Samsoom', it: 'Svegliamo Samsoom' };
const WAKE = 1.3; // s for Samsoom: asleep → yawn → blink → wave
const MIN = 2.4, MAX = 6, STEP = 0.62, R = 92; // R10 A1: never shorter than 2.4s, never longer than 6s; ring radius = 80 (logo) + 12
const ICON = 22; // every icon (Samsoom included) sits in the same 22px box

/** the language the visitor will most likely read: their saved choice, else the browser's */
function loaderLang(): string {
  try { const l = localStorage.getItem('se-lang'); if (l) return l; } catch { /* blocked */ }
  const n = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en').slice(0, 2).toLowerCase();
  return n;
}

function Icon({ k }: { k: string }) {
  const p = { fill: 'none', stroke: '#F7C032', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const d: Record<string, React.ReactNode> = {
    shelf: <><path d="M3 3v14M17 3v14M3 9h14M3 15h14" {...p} /><rect x="5" y="5" width="3" height="4" rx=".6" {...p} /><rect x="10" y="11" width="4" height="4" rx=".6" {...p} /></>,
    box: <><path d="M3 7l7-3 7 3v8l-7 3-7-3z" {...p} /><path d="M3 7l7 3 7-3M10 10v8" {...p} /></>,
    battery: <><rect x="2.5" y="6" width="13.5" height="8" rx="1.6" {...p} /><path d="M17.5 8.6v2.8M9.6 7.6 7.6 10.4h3l-2 2.8" {...p} /></>,
    parcel: <><rect x="3" y="5" width="14" height="11" rx="1.4" {...p} /><path d="M3 9h14M8 5v4M12 5v4M6 13h3" {...p} /></>,
    screen: <><rect x="5.5" y="2.5" width="9" height="15" rx="1.8" {...p} /><path d="M8.5 4.8h3M8 14l4-6" {...p} /></>,
    flex: <><rect x="2.5" y="7.5" width="4" height="5" rx=".8" {...p} /><rect x="13.5" y="7.5" width="4" height="5" rx=".8" {...p} /><path d="M6.5 10c2-3 5-3 7 0" {...p} /></>,
    glass: <><rect x="5" y="2.5" width="10" height="15" rx="1.8" {...p} /><path d="M7.5 9l3-3M7.5 12.5l5-5" {...p} /></>,
    sticker: <><circle cx="10" cy="9" r="5.5" {...p} /><path d="M7.8 9l1.5 1.5 2.9-3M7.5 14l-1 3.5 3.5-1.5 3.5 1.5-1-3.5" {...p} /></>,
    scope: <><circle cx="8.5" cy="8.5" r="5" {...p} /><path d="M12.2 12.2 17 17" {...p} /></>,
    tools: <><path d="M4 16l6-6M11.5 3.5l5 5-2.5 2.5-5-5z" {...p} /><path d="M3 17l1.5-1.5" {...p} /></>,
    truck: <><path d="M2.5 5.5h9v8h-9zM11.5 8.5h3.5l2.5 2.6v2.4h-6" {...p} /><circle cx="6" cy="14.5" r="1.5" {...p} /><circle cx="14.5" cy="14.5" r="1.5" {...p} /></>,
    chip: <><rect x="5.5" y="5.5" width="9" height="9" rx="1.2" {...p} /><path d="M8 2.5v3M12 2.5v3M8 14.5v3M12 14.5v3M2.5 8h3M2.5 12h3M14.5 8h3M14.5 12h3" {...p} /></>,
    camera: <><rect x="2.5" y="5.5" width="15" height="10.5" rx="2" {...p} /><circle cx="10" cy="10.8" r="3" {...p} /><path d="M7 5.5l1.2-2h3.6l1.2 2" {...p} /></>,
    speaker: <><path d="M3 8h3l4-3.5v11L6 12H3z" {...p} /><path d="M13 7.5a3.5 3.5 0 0 1 0 5M15.3 5.3a6.6 6.6 0 0 1 0 9.4" {...p} /></>,
    plug: <><path d="M7 2.5v4M13 2.5v4M5 6.5h10v3a5 5 0 0 1-10 0zM10 14.5v3" {...p} /></>,
  };
  return <svg viewBox="0 0 20 20" width={ICON} height={ICON} aria-hidden="true" style={{ flex: 'none', display: 'block' }}>{d[k] || d.parcel}</svg>;
}

export default function BootIntro({ v }: { v: Vals }) {
  const on = !!v.bootOn;
  const [picks] = useState(() => { const a = POOL.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, 4); });
  const [line, setLine] = useState(0);
  const [mood, setMood] = useState('sleep');
  const [leaving, setLeaving] = useState(false);
  const ring = useRef<SVGCircleElement>(null), ringG = useRef<SVGCircleElement>(null);
  const done = useRef(v.bootSkip as () => void);
  done.current = v.bootSkip as () => void;
  const [hl] = useState(() => (typeof window === 'undefined' ? 'en' : loaderLang())); const ar = hl === 'ar' || hl === 'fa' || hl === 'ur';

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.remove('se-boot'); // the pre-paint graphite veil hands over to this screen
    // times are measured from navigation start (performance.now), so the 1.5–5s window includes the time before React
    // mounted; the line cadence shrinks if the mount came late, so all five lines and the wake-up still fit
    const m0 = performance.now() / 1000, timers: number[] = [];
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
      // status lines: one every `step`; the last one wakes Samsoom
      // four messages, one every STEP; Samsoom wakes as soon as the page is really ready (or late enough to still
      // finish inside MAX), so the whole screen always ends between MIN and MAX
      if (!wakeAt) {
        const want = Math.min(3, Math.floor(Math.max(0, tm - 0.3) / STEP));
        if (tm >= 0.3 && want !== lineN) { lineN = want; setLine(want); }
        if ((frac === 1 && lineN >= 1 && tm >= MIN - WAKE) || tm >= MAX - 0.45 - WAKE) { wakeAt = t; lineN = 4; setLine(4); }
      }
      if (wakeAt) { const w = t - wakeAt; setMood(w < 0.25 ? 'sleep' : w < 0.75 ? 'yawn' : w < 1.05 ? 'blink' : 'wave'); }
      const woke = wakeAt > 0 && t - wakeAt >= WAKE;
      if (!exitAt && woke && tm >= MIN - 0.4) { exitAt = t; setLeaving(true); }
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
    timers.push(window.setTimeout(() => done.current && done.current(), (MAX + 0.3) * 1000)); // hard stop
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('se:parts-lib', onLib);
    };
  }, [on]);

  if (!on) return null;
  const C = 2 * Math.PI * R, last = line >= 4, msg = last ? WAKE_MSG : picks[Math.min(line, 3)].t;
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
          <img src="/assets/se-logo-320.webp" alt="Sam Electronics" width={160} height={160} className="se-boot-img" />
        </div>
        <div className="se-boot-line" style={{ marginTop: '32px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span key={line} className="se-boot-txt" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', font: (ar ? "500 15px 'IBM Plex Sans Arabic'" : "500 15px Inter") + ', sans-serif', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }}>
            <span className="se-boot-ic" style={{ width: ICON + 'px', height: ICON + 'px', display: 'grid', placeItems: 'center', flex: 'none' }}>
              {last ? <SESamsoom mood={mood} size={ICON} still={mood !== 'wave'} /> : <Icon k={picks[Math.min(line, 3)].icon} />}
            </span>
            {(msg[hl] || msg.en) + '…'}
          </span>
        </div>
      </div>
    </div>
  );
}
