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
    // owner (19 Nov): "a notification if your wifi is slow": most browsers don't say, so we measure: a small picture is
    // fetched fresh a few seconds after the page settles (and again every 2 minutes while the page is open). If it
    // crawls (under ~350 kbit/s, or over 1.8 s just to answer), the slow-connection notice shows once per visit.
    // two slow readings in a row are needed (one busy moment is not a slow line), measured on a ~100 KB picture
    let strikes = 0;
    const probe = async () => {
      if (slowSeen.current || document.hidden || !navigator.onLine) return;
      const t0 = performance.now();
      try {
        const r = await fetch('/assets/se-logo-metal-1024.webp?probe=' + Date.now(), { cache: 'no-store' }); const b = await r.blob(); const ms = performance.now() - t0;
        const kbps = (b.size * 8) / Math.max(1, ms), cl = c as unknown as { downlink?: number; rtt?: number; effectiveType?: string } | undefined;
        const slow = (b.size > 20000 && kbps < 300) || ms > 4000 || (!!cl && (/(^|-)2g$/.test(cl.effectiveType || '') || ((cl.downlink ?? 10) > 0 && (cl.downlink ?? 10) < 0.35)));
        strikes = slow ? strikes + 1 : 0;
        if (strikes >= 2) { slowSeen.current = true; setShut(false); setSt('slow'); setK((n) => n + 1); import('@/lib/warnings').then((m) => m.logWarning('slow', Math.round(kbps) + ' kbit/s · ' + Math.round(ms) + ' ms for ' + Math.round(b.size / 1024) + ' KB')).catch(() => {}); }
        else if (slow) window.setTimeout(probe, 8000);
      } catch { /* offline is handled by the events */ }
    };
    const p0 = window.setTimeout(probe, 12000), piv = window.setInterval(probe, 120000);
    window.addEventListener('online', check); window.addEventListener('offline', check); c?.addEventListener?.('change', check);
    return () => { window.clearTimeout(p0); window.clearInterval(piv); window.removeEventListener('online', check); window.removeEventListener('offline', check); c?.removeEventListener?.('change', check); clearTimeout(backT.current); };
  }, []);
  if (!st || shut) return null;
  const close = () => { setShut(true); if (st === 'back') setSt(''); };
  // 17 Nov (owner): the same system notice as every other one (SysNote): white card under the header, same place
  const M = { off: ['stop', 'wifi-off', 'You are offline', 'Open pages keep showing.'], slow: ['info', 'wifi-slow', 'Your connection is slow', 'Pictures and animations may take a little longer. Everything still works.'], back: ['ok', 'wifi', 'Back online', 'Everything works again.'] } as const;
  const [tone, icon, h, p] = M[st];
  return <SysNote key={k} tone={tone} icon={icon} kicker={T('CONNECTION')} title={T(h)} text={T(p)} onClose={close} ms={st === 'off' ? 0 : 8000} role={st === 'off' ? 'alert' : 'status'} />;
}
