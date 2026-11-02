'use client';
// R6 §03 F · the language switch moment, the same every time: the page blurs, a compact card (380×140) shows a tiny
// circuit trace drawing the new language's first letter (A / ع) for 2.0s while the switch runs under it, then the
// letter flashes yellow with "Mission accomplished!" for 1.2s, and it closes. No Samsoom. The choice is remembered
// by setLang (localStorage).
import React, { useEffect, useRef, useState } from 'react';
// Hero 3 (owner): the battery charges with a percentage counting up, the end is a drawn tick, the card fits its text
// (nothing centred awkwardly) and has real color and detail: graphite case, segmented green charge, yellow accents.

type Lang = string;
type Phase = 'off' | 'load' | 'done' | 'out';
const TXT: Record<string, { eb: string; load: string; done: string; sub: string; close: string }> = {
  en: { eb: 'LANGUAGE · ENGLISH', load: 'Translating every screen and battery…', done: 'Mission accomplished!', sub: 'The whole shop now speaks English.', close: 'Close' },
  ar: { eb: 'اللغة · العربية', load: 'نترجم كل شاشة وكل بطارية…', done: 'تمت المهمة!', sub: 'المتجر كله يتحدث العربية الآن.', close: 'إغلاق' },
  es: { eb: 'IDIOMA · ESPAÑOL', load: 'Traduciendo cada pantalla y cada batería…', done: '¡Misión cumplida!', sub: 'Toda la tienda habla ahora español.', close: 'Cerrar' },
  fr: { eb: 'LANGUE · FRANÇAIS', load: 'Traduction de chaque écran et chaque batterie…', done: 'Mission accomplie !', sub: 'Toute la boutique parle désormais français.', close: 'Fermer' },
  ru: { eb: 'ЯЗЫК · РУССКИЙ', load: 'Переводим каждый экран и каждую батарею…', done: 'Миссия выполнена!', sub: 'Весь магазин теперь говорит по-русски.', close: 'Закрыть' },
  hi: { eb: 'भाषा · हिन्दी', load: 'हर स्क्रीन और हर बैटरी का अनुवाद हो रहा है…', done: 'मिशन पूरा!', sub: 'पूरी दुकान अब हिन्दी बोलती है।', close: 'बंद करें' },
  ur: { eb: 'زبان · اردو', load: 'ہر اسکرین اور ہر بیٹری کا ترجمہ ہو رہا ہے…', done: 'مشن مکمل!', sub: 'پوری دکان اب اردو بولتی ہے۔', close: 'بند کریں' },
  fa: { eb: 'زبان · فارسی', load: 'ترجمهٔ همهٔ صفحه‌ها و باتری‌ها…', done: 'مأموریت انجام شد!', sub: 'حالا کل فروشگاه فارسی صحبت می‌کند.', close: 'بستن' },
  de: { eb: 'SPRACHE · DEUTSCH', load: 'Jeder Bildschirm und jeder Akku wird übersetzt…', done: 'Mission erfüllt!', sub: '', close: 'Schließen' },
  it: { eb: 'LINGUA · ITALIANO', load: 'Traduciamo ogni schermo e ogni batteria…', done: 'Missione compiuta!', sub: '', close: 'Chiudi' },
  pt: { eb: 'IDIOMA · PORTUGUÊS', load: 'A traduzir cada ecrã e cada bateria…', done: 'Missão cumprida!', sub: '', close: 'Fechar' },
  zh: { eb: '语言 · 中文', load: '正在翻译每一块屏幕和每一块电池…', done: '任务完成！', sub: '', close: '关闭' },
  ro: { eb: 'LIMBA · ROMÂNĂ', load: 'Traducem fiecare ecran și fiecare baterie…', done: 'Misiune îndeplinită!', sub: '', close: 'Închide' },
  ca: { eb: 'IDIOMA · CATALÀ', load: 'Traduint cada pantalla i cada bateria…', done: 'Missió complerta!', sub: '', close: 'Tanca' },
  gl: { eb: 'IDIOMA · GALEGO', load: 'Traducindo cada pantalla e cada batería…', done: 'Misión cumprida!', sub: '', close: 'Pechar' },
  eu: { eb: 'HIZKUNTZA · EUSKARA', load: 'Pantaila eta bateria guztiak itzultzen…', done: 'Misioa beteta!', sub: '', close: 'Itxi' },
  tl: { eb: 'WIKA · TAGALOG', load: 'Isinasalin ang bawat screen at baterya…', done: 'Tapos na ang misyon!', sub: '', close: 'Isara' },
  ml: { eb: 'ഭാഷ · മലയാളം', load: 'എല്ലാ സ്ക്രീനും ബാറ്ററിയും വിവർത്തനം ചെയ്യുന്നു…', done: 'ദൗത്യം പൂർത്തിയായി!', sub: '', close: 'അടയ്ക്കുക' },
  sw: { eb: 'LUGHA · KISWAHILI', load: 'Tunatafsiri kila skrini na kila betri…', done: 'Kazi imekamilika!', sub: '', close: 'Funga' },
  am: { eb: 'ቋንቋ · አማርኛ', load: 'እያንዳንዱን ስክሪንና ባትሪ እየተረጎምን ነው…', done: 'ተልዕኮው ተሳክቷል!', sub: '', close: 'ዝጋ' },
  ha: { eb: 'HARSHE · HAUSA', load: 'Muna fassara kowane allo da kowane batir…', done: 'An cika aiki!', sub: '', close: 'Rufe' },
  yo: { eb: 'ÈDÈ · YORÙBÁ', load: 'À ń túmọ̀ gbogbo ojú fóònù àti bátìrì…', done: 'Iṣẹ́ parí!', sub: '', close: 'Pa á dé' },
  ig: { eb: 'ASỤSỤ · IGBO', load: 'Anyị na-asụgharị ihuenyo na batrị ọ bụla…', done: 'Ozi emezuola!', sub: '', close: 'Mechie' },
  om: { eb: 'AFAAN · OROMOO', load: 'Iskiriinii fi baatirii hunda hiikaa jirra…', done: 'Ergamni milkaa\'e!', sub: '', close: 'Cufi' },
};

export default function LangPop() {
  const [phase, setPhase] = useState<Phase>('off');
  const [to, setTo] = useState<Lang>('ar');
  const [pct, setPct] = useState(0);
  const raf = useRef(0);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms));

  useEffect(() => {
    const W = window as unknown as { __seLangPop?: boolean };
    W.__seLangPop = true;
    const close = () => { clear(); setPhase('out'); later(260, () => setPhase('off')); };
    const onPop = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang;
      clear(); setTo(l); setPhase('load'); setPct(0); cancelAnimationFrame(raf.current);
      // owner (26 Oct): the switch is heavy work (the whole page re-translates) and it used to freeze the battery halfway.
      // Now it runs FIRST, while the battery waits at 0%; the battery then charges smoothly (1.6s), the tick draws, and
      // the card stays until the tick has fully played.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (window.seI18n) window.seI18n.now(l as never);
        later(120, () => { const t0 = performance.now(); const step = (n: number) => { const k = Math.min(1, (n - t0) / 1600), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; setPct(Math.min(99, Math.round(e * 100))); if (k < 1) raf.current = requestAnimationFrame(step); else { const t1 = performance.now(); const wait = () => { if ((window.seI18n && window.seI18n.lang() === l) || performance.now() - t1 > 8000) { setPct(100); later(150, () => setPhase('done')); later(1650, close); } else { setPct(99); later(120, wait); } }; wait(); } }; raf.current = requestAnimationFrame(step); });
      }));
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('se:lang-pop', onPop);
    window.addEventListener('keydown', onKey);
    return () => { W.__seLangPop = false; clear(); cancelAnimationFrame(raf.current); window.removeEventListener('se:lang-pop', onPop); window.removeEventListener('keydown', onKey); };
  }, []);

  if (phase === 'off') return null;
  const T = TXT[to] || TXT.en, done = phase === 'done' || phase === 'out';
  return (
    <div className={'lp' + (phase === 'out' ? ' lp-out' : '')} data-no-i18n="" role="dialog" aria-modal="true" aria-live="polite" aria-label={done ? T.done : T.load}>
      <div className={'lp-card lp2' + (done ? ' lp-done' : '')} dir={to === 'ar' || to === 'fa' || to === 'ur' ? 'rtl' : 'ltr'} lang={to}>
        <span className="lp2-ic" aria-hidden="true">
          <span className="lp2-bat">
            <span className="lp2-cell">
              <i className="lp2-fill" style={{ ['--p' as string]: pct / 100 } as React.CSSProperties} />
              <svg className="lp2-bolt" viewBox="0 0 24 24" width="16" height="16"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
            </span>
            <span className="lp2-nub" />
          </span>
          <svg className="lp2-ok" viewBox="0 0 48 48" width="48" height="48">
            <circle cx="24" cy="24" r="24" className="lp2-okc" />
            <path d="M14 24.5l7 7 13-14" className="lp2-okt" pathLength={1} />
          </svg>
        </span>
        <span className="lp-txt lp2-txt">
          <span className="lp-eb">{T.eb}</span>
          <b>{done ? T.done : T.load}</b>
          <span className="lp2-meta" style={{ ['--p' as string]: pct / 100 } as React.CSSProperties}>
            <span className="lp2-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></span>
            <em dir="ltr">{pct}%</em>
          </span>
        </span>
      </div>
    </div>
  );
}
