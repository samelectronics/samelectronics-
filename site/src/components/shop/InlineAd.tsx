'use client';
// Owner (16 Nov): the long ads between the product rows carry the teardown ad's spirit: a graphite stage, warm light,
// a bold title that slams in, and something that really plays. They are a little taller than before so the pictures fit,
// and every part has its own column (text · film · button) so nothing ever touches the button.
// Topics: the parts inside a phone, quality grades, fixing, delivery, our experience.
// The team edits them in the Control Room (Ads & pop-ups → 'shop-ads'); these are the samples. With the Booster choice
// on, the strip leads with the ad that matches the part you looked at last. Styles: src/styles/shop.css (.iad2-*).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { T } from '@/components/site/ui';
import { siteRaw } from '@/lib/catalog';
import { allowed } from '@/lib/prefs';

export type AdFx = 'film' | 'grades' | 'fix' | 'ship' | 'years';
export type Ad = { id: string; k: string; t: string; d: string; cta: string; href: string; img: string; tone: 'y' | 'd' | 'w'; cat?: string; fx?: AdFx; chips?: string[] };
export const ADS_DEFAULT: Ad[] = [
  { id: 'a1', fx: 'film', k: 'INSIDE YOUR PHONE', t: 'Every part inside your phone.', d: 'Screens, batteries, cameras and flex cables, tested on our bench.', chips: ['TESTED', 'WARRANTY', 'IN STOCK'], cta: 'Shop all parts', href: '/shop', img: '/assets/pose/film-24-480.webp', tone: 'd' },
  { id: 'a2', fx: 'grades', k: 'QUALITY GRADES', t: 'One screen. Four grades.', d: 'Original, OLED, Incell or AAA: you choose the quality and the price.', chips: ['ORIGINAL', 'OLED', 'INCELL', 'AAA'], cta: 'Compare grades', href: '/shop?cat=SCR', img: '/assets/pose/apple-sp-480.webp', tone: 'd', cat: 'SCR' },
  { id: 'a3', fx: 'fix', k: 'REPAIR LAB', t: 'Cracked in the morning. Fixed by lunch.', d: 'Bring your phone to Deira. Most fits take under an hour.', chips: ['WHILE YOU WAIT', 'TESTED TWICE'], cta: 'Book a repair', href: '/repair', img: '/assets/pose/rep-fixed-480.webp', tone: 'd' },
  { id: 'a4', fx: 'ship', k: 'WORLDWIDE DELIVERY', t: 'Packed in Deira. Tracked to your door.', d: 'Every week to the Middle East, Africa, Europe and Asia.', chips: ['PACKED', 'SHIPPED', 'TRACKED'], cta: 'Get a shipping quote', href: '/worldwide', img: '/assets/pallet/full-600.webp', tone: 'd' },
  { id: 'a5', fx: 'years', k: 'OUR EXPERIENCE', t: 'Since 2003. Same family, same street.', d: 'Twenty years of parts, repairs and honest prices in Deira.', chips: ['QUALITY', 'WARRANTY', 'PRICE'], cta: 'Our story', href: '/story', img: '/assets/se-logo-320.webp', tone: 'd' },
];
export const shopAds = (): Ad[] => { const s = siteRaw<Ad[] | null>('shop-ads', null); return s && s.length ? s : ADS_DEFAULT; };

const FRAMES = Array.from({ length: 24 }, (_, i) => '/assets/pose/film-' + String(i * 2).padStart(2, '0') + '-480.webp');

/** the teardown film: the phone opens up frame by frame, holds, closes again (only plays while on screen) */
function Film({ live }: { live: boolean }) {
  const [f, setF] = useState(0), ok = useRef(false);
  useEffect(() => { if (ok.current) return; ok.current = true; FRAMES.forEach((s) => { const i = new Image(); i.src = s; }); }, []);
  useEffect(() => {
    if (!live) return; let k = 0, t = 0;
    const id = window.setInterval(() => { t++; const n = FRAMES.length, cyc = n * 2 + 16, p = t % cyc; k = p < n ? p : p < n + 8 ? n - 1 : p < n * 2 + 8 ? n * 2 + 7 - p : 0; setF(k); }, 70);
    return () => window.clearInterval(id);
  }, [live]);
  return <img className="iad2-film" src={FRAMES[f]} alt="" />;
}

function Visual({ a, live }: { a: Ad; live: boolean }) {
  switch (a.fx) {
    case 'film': return <Film live={live} />;
    case 'grades': return <span className="iad2-grades">{['apple-sp', 'apple-gx', 'apple-zy', 'apple-temp'].map((g, i) => <img key={g} src={'/assets/pose/' + g + '-480.webp'} alt="" style={{ ['--i' as string]: i } as React.CSSProperties} />)}</span>;
    case 'fix': return <span className="iad2-fix"><img className="was" src="/assets/ads/rep-crack.webp" alt="" /><img className="now" src="/assets/ads/rep-fixed.webp" alt="" /><i className="scan" /></span>;
    case 'ship': return <span className="iad2-ship"><svg className="route" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><path d="M8 66 C 80 6, 200 6, 292 52" pathLength={1} /></svg><img className="pal" src="/assets/pallet/full-600.webp" alt="" /></span>;
    case 'years': return <Years />;
    default: return <img className="iad2-pic" src={a.img} alt="" loading="lazy" />;
  }
}
function Years() {
  const end = new Date().getFullYear() - 2003, [y, setY] = useState(0);
  useEffect(() => { let v = 0; const id = window.setInterval(() => { v++; setY(v); if (v >= end) window.clearInterval(id); }, 55); return () => window.clearInterval(id); }, [end]);
  return <span className="iad2-years" data-no-i18n=""><b><i>’</i>03</b><small>{T('SINCE 2003')} · {y}+ {T('YEARS')}</small></span>;
}

export default function InlineAd({ slot, lastCat }: { slot: number; lastCat?: string }) {
  const list = useMemo(() => {
    const all = shopAds(); const n = all.length; const rot = all.map((_, i) => all[(i + slot * 2) % n]);
    if (lastCat && allowed('booster')) { const m = rot.findIndex((a) => a.cat === lastCat); if (m > 0) rot.unshift(...rot.splice(m, 1)); }
    return rot.slice(0, 3);
  }, [slot, lastCat]);
  const [i, setI] = useState(0), [prev, setPrev] = useState<number | null>(null), [pause, setPause] = useState(false), [live, setLive] = useState(false), box = useRef<HTMLAnchorElement>(null);
  useEffect(() => { const el = box.current; if (!el) return; const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.25 }); io.observe(el); return () => io.disconnect(); }, []);
  const go = (n: number) => { setPrev(i); setI(n); window.setTimeout(() => setPrev(null), 520); };
  useEffect(() => { if (pause || !live || list.length < 2) return; const t = window.setTimeout(() => go((i + 1) % list.length), 7000); return () => window.clearTimeout(t); }, [i, pause, live, list.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const a = list[i]; if (!a) return null;
  const scene = (x: Ad, out: boolean) => (
    <span className={'iad2-scene' + (out ? ' out' : '')} key={(out ? 'o' : 'n') + x.id} aria-hidden={out}>
      <span className="iad2-txt">
        <span className="iad2-k"><i className="rec" />{T(x.k)}<em>{T('Ad')}</em></span>
        <b className="iad2-t" data-no-i18n="">{T(x.t).split(' ').map((w, k) => <span key={k} style={{ ['--w' as string]: k } as React.CSSProperties}>{w} </span>)}</b>
        <small className="iad2-d">{T(x.d)}</small>
        {x.chips?.length ? <span className="iad2-chips">{x.chips.map((c, k) => <i key={c} style={{ ['--c' as string]: k } as React.CSSProperties}>{T(c)}</i>)}</span> : null}
      </span>
      <span className="iad2-vis"><Visual a={x} live={live && !out} /></span>
      <span className="iad2-cta">{T(x.cta)} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
    </span>
  );
  return (
    <a ref={box} className={'iad2' + (live ? ' live' : '')} href={a.href} onPointerEnter={() => setPause(true)} onPointerLeave={() => setPause(false)} aria-label={T(a.t)}>
      <span className="iad2-bg" aria-hidden="true"><i className="g1" /><i className="g2" /><i className="sweep" /></span>
      {prev !== null && list[prev] ? scene(list[prev], true) : null}
      {scene(a, false)}
      {list.length > 1 ? <span className="iad2-dots" onClick={(e) => e.preventDefault()}>{list.map((x, k) => <button key={x.id} type="button" className={k === i ? 'on' : ''} onClick={() => k !== i && go(k)} aria-label={'Ad ' + (k + 1)}><i style={{ animationPlayState: pause || !live ? 'paused' : 'running' }} /></button>)}</span> : null}
    </a>
  );
}
