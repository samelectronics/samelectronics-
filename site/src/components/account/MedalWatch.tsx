'use client';
// Watches what the visitor does and hands out medals (pages visited, language changed, cart, stars, Find My Part,
// Samsoom chat, the teardown watched to the end), and shows a short, quiet toast when one is earned:
// the medal swings in, its name, and a link to see them all in My Bench.
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Medal from './Medal';
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
  return (
    <div className="md-toast" role="status" aria-live="polite" key={m.id}>
      <Medal tier={m.tier} size={52} group={m.id === 'teardown' ? 'teardown' : m.group} />
      <span><small>{T('Medal earned')} · {T(m.tier === 'gold' ? 'Gold' : m.tier === 'silver' ? 'Silver' : 'Bronze')}</small><b>{T(m.t)}</b></span>
      <a href="/account#medals" onClick={() => setShow(null)}>{T('See all')}</a>
    </div>
  );
}
