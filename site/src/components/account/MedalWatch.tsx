'use client';
// Watches what the visitor does and hands out medals (pages visited, language changed, cart, stars, Find My Part,
// Samsoom chat, the teardown watched to the end), and shows a short, quiet toast when one is earned:
// the medal swings in, its name, and a link to see them all in My Bench.
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Medal from './Medal';
import { MEDALS, unlock, visitMedal, level, XP, LEVELS } from '@/lib/achievements';
const LEVELS_AT = (i: number) => LEVELS[i].at;
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';

const MS = 6500;
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
    const got = (e: Event) => { const id = (e as CustomEvent).detail as string; window.clearTimeout(t); setShow(id); play('tada'); t = window.setTimeout(() => setShow(null), MS); };
    window.addEventListener('se:medal', got);
    return () => { on.forEach(([k, f]) => window.removeEventListener(k, f)); window.removeEventListener('se:medal', got); window.clearTimeout(t); };
  }, []);
  const m = show ? MEDALS.find((x) => x.id === show) : null;
  if (!m || path?.startsWith('/staff')) return null;
  // owner (19 Nov): achievements drop in from the top with a timer: the chip flips in, its name and tier, the points it
  // adds, and the level bar filling towards the next reward
  const L = level(), up = L.i > 0 && L.xp - XP[m.tier] < LEVELS_AT(L.i);
  return (
    <div className="mdt-dock" key={m.id}>
      <div className={'mdt mdt-' + m.tier} role="status" aria-live="polite">
        <span className="mdt-chip"><Medal tier={m.tier} size={58} group={m.id === 'teardown' ? 'teardown' : m.group} /></span>
        <span className="mdt-tx">
          <small>{T('Achievement unlocked')} · {T(m.tier === 'gold' ? 'Gold' : m.tier === 'silver' ? 'Silver' : 'Bronze')}</small>
          <b>{T(m.t)}</b>
          <span className="mdt-lv"><em>+{XP[m.tier]} {T('points')}</em><span className="bar"><i style={{ width: L.pct + '%' }} /></span><span className="nm">{up ? T('New level') + ': ' : ''}{T(L.name)}</span></span>
        </span>
        <a className="mdt-go" href="/account#medals" onClick={() => setShow(null)}>{T('See all')}</a>
        <button type="button" className="mdt-x" aria-label={T('Close')} onClick={() => setShow(null)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        <span className="mdt-t" style={{ animationDuration: MS + 'ms' }} aria-hidden="true" />
      </div>
    </div>
  );
}
