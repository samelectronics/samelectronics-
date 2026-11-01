'use client';
// R9: while a language's words download (every language except English and Arabic is fetched only when picked; Spanish
// and French are fetched early), a small pill says so in that language, with a charging bar. Styles: dc-base.css (.se-ll).
import React, { useEffect, useState } from 'react';

const MSG: Record<string, string> = {"en": "Switching language…", "de": "Sprache wird gewechselt…", "it": "Cambio lingua…", "pt": "A mudar de idioma…", "ca": "Canviant d’idioma…", "gl": "Cambiando de idioma…", "eu": "Hizkuntza aldatzen…", "ro": "Se schimbă limba…", "tl": "Nagpapalit ng wika…", "zh": "正在切换语言…", "ml": "ഭാഷ മാറ്റുന്നു…", "sw": "Inabadilisha lugha…", "am": "ቋንቋ በመቀየር ላይ…", "ha": "Ana canza harshe…", "yo": "Ń yí èdè padà…", "om": "Afaan jijjiiramaa jira…", "ig": "Na-agbanwe asụsụ…", "ar": "جارٍ تغيير اللغة…", "es": "Cambiando de idioma…", "fr": "Changement de langue…", "fa": "در حال تغییر زبان…", "ru": "Меняем язык…", "hi": "भाषा बदल रही है…", "ur": "زبان بدل رہی ہے…"};
const RTL = new Set(['ar', 'fa', 'ur']);

export default function LangLoading() {
  const [l, setL] = useState<string | null>(null);
  useEffect(() => { const on = (e: Event) => setL((e as CustomEvent).detail || null); window.addEventListener('se:lang-loading', on); return () => window.removeEventListener('se:lang-loading', on); }, []);
  if (!l) return null;
  return (
    <div className="se-ll" role="status" aria-live="polite" data-no-i18n="" lang={l} dir={RTL.has(l) ? 'rtl' : 'ltr'}>
      <i className="se-ll-bar"><b /></i>
      <span>{MSG[l] || MSG.en}</span>
    </div>
  );
}
