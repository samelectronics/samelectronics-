'use client';
// Owner (17 Nov): "the shop needs a fun, teardown-like video entrance". The first time the shop opens in a visit:
// a graphite stage, the real teardown film plays fast (the phone comes apart into its parts), light beams cross,
// "Every part. Every grade." slams in, and the stage wipes up to reveal the shop. About 2.6 s; a click skips it.
import React, { useEffect, useState } from 'react';
import { isEmbed } from '@/lib/embed';
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';

const FR = Array.from({ length: 24 }, (_, i) => '/assets/pose/film-' + String(i * 2).padStart(2, '0') + '-480.webp');

export default function ShopIntro() {
  const [on, setOn] = useState(false), [f, setF] = useState(0), [out, setOut] = useState(false);
  useEffect(() => {
    if (isEmbed() || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    try { if (sessionStorage.getItem('se-shop-intro')) return; sessionStorage.setItem('se-shop-intro', '1'); } catch { return; }
    let ok = 0; const imgs = FR.map((s) => { const i = new Image(); i.onload = () => { ok++; }; i.src = s; return i; }); void imgs;
    setOn(true); document.documentElement.classList.add('se-intro');
    const t0 = performance.now(); let raf = 0;
    const step = (t: number) => { const k = (t - t0) / 1500; setF(Math.min(FR.length - 1, Math.floor(Math.max(0, k) * FR.length))); if (k < 1) raf = requestAnimationFrame(step); };
    const st = window.setTimeout(() => { raf = requestAnimationFrame(step); play('open'); }, 250);
    const a = window.setTimeout(() => setOut(true), 2300), b = window.setTimeout(() => { setOn(false); document.documentElement.classList.remove('se-intro'); }, 2900);
    return () => { window.clearTimeout(st); window.clearTimeout(a); window.clearTimeout(b); cancelAnimationFrame(raf); document.documentElement.classList.remove('se-intro'); };
  }, []);
  if (!on) return null;
  const skip = () => { setOut(true); window.setTimeout(() => { setOn(false); document.documentElement.classList.remove('se-intro'); }, 550); };
  return (
    <div className={'shi' + (out ? ' out' : '')} onClick={skip} role="presentation" aria-hidden="true">
      <i className="shi-r a" /><i className="shi-r b" /><i className="shi-r c" />
      <img className="shi-film" src={FR[f]} alt="" />
      <div className="shi-t"><span className="shi-k">{T('THE PARTS SHOP')}</span><b><span>{T('Every part.')}</span><span className="y">{T('Every grade.')}</span></b></div>
      <span className="shi-skip">{T('Skip')}</span>
    </div>
  );
}
