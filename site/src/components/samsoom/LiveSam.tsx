'use client';
// Owner (R9): Samsoom is never frozen. LiveSam keeps him alive anywhere he appears outside the launcher: he blinks and
// breathes at rest, plays a short emote every few seconds (never the same twice), and his eyes follow the pointer while he
// rests. `mood` sets what he shows between emotes (idle / think / type), `play` asks for one emote now (it changes when the
// value changes, e.g. on each tour step).
import React, { useEffect, useRef, useState } from 'react';
import SESamsoom from '../dc/SESamsoom';
import { createScheduler } from './scheduler';
import { siteRaw } from '@/lib/catalog';

const PLAYFUL = ['wave', 'happy', 'think', 'wink', 'kiss', 'celebrate', 'blush', 'dabke'];

// `pose` (R9 tour): a scripted pose such as 'pt-smile' held for as long as it is set (no random emotes); `pointA` aims the arm.
export default function LiveSam({ size = 64, mood = 'idle', play, rest: rest0, className, pose, pointA }: { size?: number; mood?: string; play?: string; rest?: number; className?: string; pose?: string; pointA?: number }) {
  // the emotes and their pace are set in the Control Room (Site & Samsoom)
  const cfg = siteRaw<{ emotes?: string[]; rest?: number }>('samsoom', {}), rest = rest0 || cfg.rest || 2600;
  const [m, setM] = useState(play || mood), [look, setLook] = useState({ x: 0, y: 0 }), box = useRef<HTMLSpanElement>(null);
  const sch = useRef<ReturnType<typeof createScheduler> | null>(null), cur = useRef(m);
  cur.current = m;
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const x = createScheduler({ onMood: setM, auto: !reduce && !pose, emotes: cfg.emotes && cfg.emotes.length ? cfg.emotes : PLAYFUL, rest });
    sch.current = x;
    return () => { x.stop(); sch.current = null; };
  }, [rest, !!pose]);
  useEffect(() => { sch.current?.base(mood); }, [mood]);
  useEffect(() => { if (play) sch.current?.play(play); }, [play]);
  // the eyes follow the pointer while he rests (cheap: at most ~11 updates a second)
  useEffect(() => {
    let t = 0;
    const mv = (e: PointerEvent) => {
      const n = performance.now(); if (n - t < 90) return; t = n;
      if (cur.current !== 'idle' && cur.current !== 'think') return;
      const r = box.current?.getBoundingClientRect(); if (!r) return;
      const cl = (v: number) => Math.max(-1, Math.min(1, v));
      setLook({ x: Math.round(cl((e.clientX - (r.left + r.width / 2)) / 420) * 10) / 10, y: Math.round(cl((e.clientY - (r.top + r.height / 2)) / 420) * 10) / 10 });
    };
    window.addEventListener('pointermove', mv, { passive: true });
    return () => window.removeEventListener('pointermove', mv);
  }, []);
  return (
    <span ref={box} className={className} style={{ display: 'inline-grid', placeItems: 'center' }}>
      <SESamsoom mood={pose || m} size={size} lookX={pose ? 0 : look.x} lookY={pose ? 0 : look.y} pointA={pointA} />
    </span>
  );
}
