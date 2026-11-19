'use client';
// Watches what the visitor does and hands out medals (pages visited, language changed, cart, stars, Find My Part,
// Samsoom chat, the teardown watched to the end), and shows a short, quiet toast when one is earned:
// the medal swings in, its name, and a link to see them all in My Bench.
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Medal from './Medal';
import LiveSam from '@/components/samsoom/LiveSam';
import { MEDALS, unlock, visitMedal } from '@/lib/achievements';
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';

export default function MedalWatch() {
  const path = usePathname(), [show, setShow] = useState<string | null>(null);
  useEffect(() => { if (path && !path.startsWith('/staff')) { visitMedal(path); if (path === '/account') { /* the bench itself */ } } }, [path]);
  useEffect(() => {
    const on: [string, (e: Event) => void][] = [
      ['se:lang', () => unlock('polyglot')], ['se:fmp', () => unlock('fmp')], ['se:chat', () => unlock('chat')], ['se:td-done', () => unlock('teardown')],
      ['se:store', (e) => { const s = (e as CustomEvent).detail || {}; if (s.cart?.length) unlock('cart'); if (s.favs?.length) unlock('star'); if (s.devices?.length) unlock('device'); }],
    ];
    on.forEach(([k, f]) => window.addEventListener(k, f));
    let t = 0;
    const got = (e: Event) => { const id = (e as CustomEvent).detail as string; window.clearTimeout(t); setShow(id); play('tada'); t = window.setTimeout(() => setShow(null), 4200); };
    window.addEventListener('se:medal', got);
    return () => { on.forEach(([k, f]) => window.removeEventListener(k, f)); window.removeEventListener('se:medal', got); window.clearTimeout(t); };
  }, []);
  const m = show ? MEDALS.find((x) => x.id === show) : null;
  if (!m || path?.startsWith('/staff')) return null;
  // owner (18 Nov, round 2): notices are the Samsoom card (no tiny kicker labels): Samsoom celebrating in his circle,
  // the medal beside its name, one button
  return (
    <div className="sn2-dock low" key={m.id}>
      <div className="sn2 sn2-ok md2" role="status" aria-live="polite">
        <span className="sn2-sam" aria-hidden="true"><LiveSam size={92} pose="celebrate" /></span>
        <span className="md2-row"><Medal tier={m.tier} size={44} group={m.id === 'teardown' ? 'teardown' : m.group} /><span><b className="sn2-h">{T('New medal')}: {T(m.t)}</b><p className="sn2-p">{T(m.tier === 'gold' ? 'Gold' : m.tier === 'silver' ? 'Silver' : 'Bronze')}</p></span></span>
        <span className="sn2-acts"><a className="sn2-b y" href="/account#medals" onClick={() => setShow(null)}>{T('See all')}</a></span>
        <button type="button" className="sn2-x" aria-label="Close" onClick={() => setShow(null)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      </div>
    </div>
  );
}
