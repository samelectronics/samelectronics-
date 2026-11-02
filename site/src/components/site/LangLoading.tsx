'use client';
// R9: while a language's words download (every language except English and Arabic is fetched only when picked; Spanish
// and French are fetched early), a small pill says so in that language, with a charging bar. Styles: dc-base.css (.se-ll).
import React, { useEffect, useState } from 'react';

const MSG: Record<string, string> = {"en": "Switching language…", "de": "Sprache wird gewechselt…", "it": "Cambio lingua…", "pt": "A mudar de idioma…", "ca": "Canviant d’idioma…", "gl": "Cambiando de idioma…", "eu": "Hizkuntza aldatzen…", "ro": "Se schimbă limba…", "tl": "Nagpapalit ng wika…", "zh": "正在切换语言…", "ml": "ഭാഷ മാറ്റുന്നു…", "sw": "Inabadilisha lugha…", "am": "ቋንቋ በመቀየር ላይ…", "ha": "Ana canza harshe…", "yo": "Ń yí èdè padà…", "om": "Afaan jijjiiramaa jira…", "ig": "Na-agbanwe asụsụ…", "ar": "جارٍ تغيير اللغة…", "es": "Cambiando de idioma…", "fr": "Changement de langue…", "fa": "در حال تغییر زبان…", "ru": "Меняем язык…", "hi": "भाषा बदल रही है…", "ur": "زبان بدل رہی ہے…"};
const RTL = new Set(['ar', 'fa', 'ur']);

export default function LangLoading() {
  const [l, setL] = useState<string | null>(null);
  useEffect(() => { const on = (e: Event) => setL((e as CustomEvent).detail || null); window.addEventListener('se:lang-loading', on); return () => window.removeEventListener('se:lang-loading', on); }, []);
  // R10 (owner): no pill any more. A switch from Samsoom's picker is silent; a manual switch shows only the centred
  // battery card (LangPop), which waits for the words itself.
  void l; void MSG; void RTL; return null;
}
