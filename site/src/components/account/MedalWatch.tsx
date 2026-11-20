'use client';
// Watches what the visitor does and hands out medals (pages visited, language changed, cart, stars, Find My Part,
// Samsoom chat, the teardown watched to the end), and shows a short, quiet toast when one is earned:
// the medal swings in, its name, and a link to see them all in My Bench.
import React, { useEffect, useState } from 'react';
import EdgeTimer from '@/components/site/EdgeTimer';
import { usePathname } from 'next/navigation';
import Medal from './Medal';
import { MEDALS, unlock, visitMedal, level, XP, LEVELS } from '@/lib/achievements';
const LEVELS_AT = (i: number) => LEVELS[i].at;
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';

const MS = 3600; // owner (19 Nov): small and quick, it never interrupts
export default function MedalWatch() {
  const path = usePathname(), [show, setShow] = useState<string | null>(null);
  useEffect(() => { if (path && !path.startsWith('/staff')) { visitMedal(path); if (path === '/account') { /* the bench itself */ } } }, [path]);
  useEffect(() => { (window as unknown as { __seLvl?: () => { name: string; xp: number } }).__seLvl = () => level(); }, []);
  useEffect(() => {
    const on: [string, (e: Event) => void][] = [
      ['se:lang', () => unlock('polyglot')], ['se:fmp', () => unlock('fmp')], ['se:chat', () => unlock('chat')], ['se:td-done', () => unlock('teardown')],
      ['se:store', (e) => { const s = (e as CustomEvent).detail || {}; if (s.cart?.length) unlock('cart'); if (s.favs?.length) unlock('star'); if (s.devices?.length) unlock('device'); }],
    ];
    on.forEach(([k, f]) => window.addEventListener(k, f));
    let t = 0;
    const got = (e: Event) => { const id = (e as CustomEvent).detail as string; window.clearTimeout(t); setShow(id); play('tada'); };
    window.addEventListener('se:medal', got);
    return () => { on.forEach(([k, f]) => window.removeEventListener(k, f)); window.removeEventListener('se:medal', got); window.clearTimeout(t); };
  }, []);
  const m = show ? MEDALS.find((x) => x.id === show) : null;
  if (!m || path?.startsWith('/staff')) return null;
  // owner (19 Nov): achievements drop in from the top with a timer: the chip flips in, its name and tier, the points it
  // adds, and the level bar filling towards the next reward
  const L = level(), up = L.i > 0 && L.xp - XP[m.tier] < LEVELS_AT(L.i);
  // owner (R11): "something small, not huge, a quicker timer; it must never interrupt": one slim pill at the top, the token
  // flips in, its name, the points, and the level line. The whole pill opens My Bench; it never blocks clicks elsewhere.
  const TN: Record<string, string> = { bronze: 'Bronze token', silver: 'Steel token', gold: 'Gold token', platinum: 'Platinum token' };
  return (
    <div className="mdt-dock mdt3-dock" key={m.id}>
      <a className={'mdt3 t-' + m.tier} role="status" aria-live="polite" href="/account#medals" onClick={() => setShow(null)}>
        <span className="mdt3-tok"><Medal tier={m.tier} size={40} group={m.id === 'teardown' ? 'teardown' : m.group} /></span>
        <span className="mdt3-tx"><small>{T(TN[m.tier])} · <em>+{XP[m.tier]} {T('points')}</em></small><b>{T(m.t)}</b></span>
        <span className="mdt3-lv"><small>{up ? T('Level up') : 'Lv ' + (L.i + 1)}</small><b>{T(L.name)}</b><span className="bar"><i style={{ width: L.pct + '%' }} /></span></span>
        <EdgeTimer ms={MS} r={999} onEnd={() => setShow(null)} />
      </a>
    </div>
  );
}
