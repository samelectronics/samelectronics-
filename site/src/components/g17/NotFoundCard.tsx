'use client';
/** G17: "Signal lost. This page switched to airplane mode." In English or Arabic, following the saved choice. */
import { useEffect, useState } from 'react';
import { LANG_KEY } from '@/i18n/prepaint';

const T = {
  en: { k: 'ERROR 404 · NO SERVICE', h: ['Signal lost.', 'This page switched', 'to airplane mode.'], p: 'The page you were looking for isn’t here. Everything else is one tap away.', b: 'Back to the home page' },
  ar: { k: 'خطأ 404 · لا توجد خدمة', h: ['انقطعت الإشارة.', 'هذه الصفحة دخلت', 'وضع الطيران.'], p: 'الصفحة التي تبحث عنها غير موجودة. كل شيء آخر على بُعد نقرة.', b: 'العودة إلى الصفحة الرئيسية' },
};

export default function NotFoundCard() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  useEffect(() => {
    try {
      if (localStorage.getItem(LANG_KEY) === 'ar') setLang('ar');
    } catch {
      /* private mode */
    }
  }, []);
  const t = T[lang];
  return (
    <main className="se-404" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="se-404-bars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ height: 8 + i * 7 + 'px' }} />
        ))}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      </div>
      <span className="se-404-k">{t.k}</span>
      <h1>
        {t.h.map((x, i) => (
          <span key={i} style={i === 0 ? { color: '#F7C032' } : undefined}>
            {x}
          </span>
        ))}
      </h1>
      <p>{t.p}</p>
      <a href="/" className="se-soon-cta">
        {t.b}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </main>
  );
}
