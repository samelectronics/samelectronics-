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
  // short second lines for the pill
  if (st === 'off') m[1] = 'Open pages keep showing.'; else if (st === 'slow') m[1] = 'Pictures may load slower.';
  const close = () => { setShut(true); if (st === 'back') setSt(''); };
  // R10 B13: one graphite pill in the site's style for every state, a small coloured dot carries the meaning
  // (green back online, red offline, amber slow). No veil over the page.
  return (
    <div className={'se-netp ' + st} role={st === 'off' ? 'alert' : 'status'} aria-live="polite">
      <i className="dot" aria-hidden="true" />
      <b>{T(m[0])}</b>
      <small>{T(m[1])}</small>
      <button type="button" aria-label={T('Close')} onClick={close}>×</button>
    </div>
  );
}
