'use client';
// Owner (28 Oct): a small notice when the connection drops or is slow. Offline: what you already opened keeps showing,
// nothing new can load or send. Slow: some animations and pictures may take longer. Hides itself when the line is back.
import React, { useEffect, useRef, useState } from 'react';
import SysNote from '@/components/site/SysNote';

type Net = { effectiveType?: string; saveData?: boolean; addEventListener?: (t: string, f: () => void) => void; removeEventListener?: (t: string, f: () => void) => void };
const T = (s: string) => { const w = window as unknown as { seI18n?: { t: (x: string) => string } }; return w.seI18n ? w.seI18n.t(s) : s; };

export default function NetNotice() {
  // owner (R8): offline and back-online show as a centred card over a blurred page, each closable with ×; slow stays a
  // small toast at the bottom. "Back online" is shown whenever the line returns after being offline.
  const [st, setSt] = useState<'' | 'off' | 'slow' | 'back'>(''), [shut, setShut] = useState(false), wasOff = useRef(false), backT = useRef(0), slowSeen = useRef(false), [k, setK] = useState(0);
  useEffect(() => {
    const c = (navigator as unknown as { connection?: Net }).connection;
    const check = () => {
      clearTimeout(backT.current);
      // R10 (owner): every state shows at the bottom for 10s (a thin bar drains), then hides itself; × closes it sooner
      const show = (x: 'off' | 'slow' | 'back') => { setShut(false); setSt(x); setK((n) => n + 1); backT.current = window.setTimeout(() => setSt(''), 20000); };
      if (!navigator.onLine) { wasOff.current = true; show('off'); return; }
      if (wasOff.current) { wasOff.current = false; show('back'); return; }
      const slow = !!c && (/(^|-)2g$/.test(c.effectiveType || '') || !!c.saveData);
      if (slow && !slowSeen.current) { slowSeen.current = true; show('slow'); }
    };
    check();
    window.addEventListener('online', check); window.addEventListener('offline', check); c?.addEventListener?.('change', check);
    return () => { window.removeEventListener('online', check); window.removeEventListener('offline', check); c?.removeEventListener?.('change', check); clearTimeout(backT.current); };
  }, []);
  if (!st || shut) return null;
  const close = () => { setShut(true); if (st === 'back') setSt(''); };
  // 17 Nov (owner): the same system notice as every other one (SysNote): white card under the header, same place
  const M = { off: ['stop', 'wifi-off', 'You are offline', 'Open pages keep showing.'], slow: ['warn', 'wifi-slow', 'Slow connection', 'Pictures may load slower.'], back: ['ok', 'wifi', 'Back online', 'Everything works again.'] } as const;
  const [tone, icon, h, p] = M[st];
  return <SysNote key={k} tone={tone} icon={icon} kicker={T('CONNECTION')} title={T(h)} text={T(p)} onClose={close} ms={st === 'off' ? 0 : 8000} role={st === 'off' ? 'alert' : 'status'} />;
}
