'use client';
// Owner (28 Oct): the full Repair Lab, as its own place over the page (the home keeps only the essentials). Every fault,
// every quality, the visit time and notes, one booking on WhatsApp. Closes with the bar, Escape or the back button.
import React, { useEffect } from 'react';
import { type Vals } from '@/dc/runtime';
import { useScrollLock, stopWheel } from '@/lib/scrollLock';
import RepairLab from './sections/RepairLab';

export default function RepairLabFull({ v }: { v: Vals }) {
  const open = !!v.re?.full;
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') v.re?.close(); };
    history.pushState({ seRepair: 1 }, '', '#repair-lab'); const back = () => v.re?.close();
    window.addEventListener('keydown', esc); window.addEventListener('popstate', back);
    return () => { window.removeEventListener('keydown', esc); window.removeEventListener('popstate', back); if (location.hash === '#repair-lab') history.replaceState(null, '', location.pathname + location.search); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!open) return null;
  return (
    <div className="rp-full" role="dialog" aria-modal="true" aria-label="Repair Lab" {...stopWheel}>
      <div className="rp-full-bar"><b>REPAIR LAB · DEIRA</b><button type="button" onClick={v.re?.close}>Close ×</button></div>
      <RepairLab v={v} full />
    </div>
  );
}
