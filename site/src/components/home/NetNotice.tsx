'use client';
// Owner (28 Oct): a small notice when the connection drops or is slow. Offline: what you already opened keeps showing,
// nothing new can load or send. Slow: some animations and pictures may take longer. Hides itself when the line is back.
import React, { useEffect, useRef, useState } from 'react';

type Net = { effectiveType?: string; saveData?: boolean; addEventListener?: (t: string, f: () => void) => void; removeEventListener?: (t: string, f: () => void) => void };
const T = (s: string) => { const w = window as unknown as { seI18n?: { t: (x: string) => string } }; return w.seI18n ? w.seI18n.t(s) : s; };

export default function NetNotice() {
  // owner (R8): offline and back-online show as a centred card over a blurred page, each closable with ×; slow stays a
  // small toast at the bottom. "Back online" is shown whenever the line returns after being offline.
  const [st, setSt] = useState<'' | 'off' | 'slow' | 'back'>(''), [shut, setShut] = useState(false), wasOff = useRef(false), backT = useRef(0);
  useEffect(() => {
    const c = (navigator as unknown as { connection?: Net }).connection;
    const check = () => {
      clearTimeout(backT.current);
      if (!navigator.onLine) { wasOff.current = true; setShut(false); setSt('off'); return; }
      if (wasOff.current) { wasOff.current = false; setShut(false); setSt('back'); backT.current = window.setTimeout(() => setSt(''), 4000); return; }
      const slow = !!c && (/(^|-)2g$/.test(c.effectiveType || '') || !!c.saveData);
      setSt((p) => (p === 'back' ? p : slow ? 'slow' : ''));
    };
    check();
    window.addEventListener('online', check); window.addEventListener('offline', check); c?.addEventListener?.('change', check);
    return () => { window.removeEventListener('online', check); window.removeEventListener('offline', check); c?.removeEventListener?.('change', check); clearTimeout(backT.current); };
  }, []);
  if (!st || shut) return null;
  const m = st === 'off'
    ? ['You are offline', 'What is already open keeps showing. Nothing new can load or be sent until you are back online.']
    : st === 'slow'
      ? ['Slow connection', 'Some animations and pictures may take longer or play simplified.']
      : ['Back online', 'Everything works again.'];
  const close = () => { setShut(true); if (st === 'back') setSt(''); };
  const card = (
    <div className={'se-net ' + st} role={st === 'slow' ? 'status' : 'alertdialog'} aria-live="polite">
      <span className="ic" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1.2" fill="currentColor" />
          {st === 'off' ? <path d="M3 3l18 18" /> : null}
        </svg>
      </span>
      <span className="tx"><b>{T(m[0])}</b><small>{T(m[1])}</small></span>
      <button type="button" aria-label={T('Close')} onClick={close}>×</button>
    </div>
  );
  return st === 'slow' ? card : <div className={'se-net-veil ' + st} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>{card}</div>;
}
