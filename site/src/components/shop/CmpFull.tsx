'use client';
// R10 (owner): when compare is full (3 parts), a 4th is never dropped silently: Samsoom says so in his pop-up style, with
// its own "can't do that" sound (not the copyright warning), and offers to open compare or keep going.
import React, { useEffect, useState } from 'react';
import SysNote from '@/components/site/SysNote';
import { T } from '@/components/site/ui';

export default function CmpFull() {
  const [on, setOn] = useState(false);
  useEffect(() => { const f = () => { setOn(false); window.requestAnimationFrame(() => setOn(true)); }; window.addEventListener('se:cmp-full', f); return () => window.removeEventListener('se:cmp-full', f); }, []);
  if (!on) return null;
  return <SysNote tone="warn" snd="oops" role="alert" sam={{ mood: 'nono' }} kicker={T('COMPARE')} title={T('Compare is full')} text={T('You can compare up to 3 parts at a time. Remove one, then add this part.')} ms={8000} onClose={() => setOn(false)}
    acts={[{ label: T('Open compare'), primary: true, on: () => window.dispatchEvent(new CustomEvent('se:open-compare')) }, { label: T('OK') }]} />;
}
