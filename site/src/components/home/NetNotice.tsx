'use client';
// Owner (28 Oct): a small notice when the connection drops or is slow. Offline: what you already opened keeps showing,
// nothing new can load or send. Slow: some animations and pictures may take longer. Hides itself when the line is back.
import React, { useEffect, useState } from 'react';

type Net = { effectiveType?: string; saveData?: boolean; addEventListener?: (t: string, f: () => void) => void; removeEventListener?: (t: string, f: () => void) => void };
const T = (s: string) => { const w = window as unknown as { seI18n?: { t: (x: string) => string } }; return w.seI18n ? w.seI18n.t(s) : s; };

export default function NetNotice() {
  const [st, setSt] = useState<'' | 'off' | 'slow' | 'back'>(''), [shut, setShut] = useState(false);
  useEffect(() => {
    const c = (navigator as unknown as { connection?: Net }).connection;
    let backT = 0;
    const check = () => {
      if (!navigator.onLine) { setShut(false); setSt('off'); return; }
      const slow = !!c && (/(^|-)2g$/.test(c.effectiveType || '') || !!c.saveData);
      setSt((p) => { if (p === 'off') { clearTimeout(backT); backT = window.setTimeout(() => setSt(''), 3500); return 'back'; } return slow ? 'slow' : p === 'back' ? 'back' : ''; });
    };
    check();
    window.addEventListener('online', check); window.addEventListener('offline', check); c?.addEventListener?.('change', check);
    return () => { window.removeEventListener('online', check); window.removeEventListener('offline', check); c?.removeEventListener?.('change', check); clearTimeout(backT); };
  }, []);
  if (!st || (shut && st === 'slow')) return null;
  const m = st === 'off'
    ? ['You are offline', 'What is already open keeps showing. Nothing new can load or be sent until you are back online.']
    : st === 'slow'
      ? ['Slow connection', 'Some animations and pictures may take longer or play simplified.']
      : ['Back online', 'Everything works again.'];
  return (
    <div className={'se-net ' + st} role="status" aria-live="polite">
      <span className="ic" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1.2" fill="currentColor" />
          {st === 'off' ? <path d="M3 3l18 18" /> : null}
        </svg>
      </span>
      <span className="tx"><b>{T(m[0])}</b><small>{T(m[1])}</small></span>
      {st !== 'off' ? <button type="button" aria-label={T('Close')} onClick={() => { setShut(true); if (st === 'back') setSt(''); }}>×</button> : null}
    </div>
  );
}
