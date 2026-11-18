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
import SEBrandLogo from '@/components/dc/SEBrandLogo';
import { brandInk } from '@/lib/brandInk';
import { GradeTag } from './Tags';

export type AdFx = 'film' | 'grades' | 'fix' | 'ship' | 'years' | 'brand';
export type Ad = { id: string; k: string; t: string; d: string; cta: string; href: string; img: string; tone: 'y' | 'd' | 'w'; cat?: string; fx?: AdFx; chips?: string[]; brand?: string };
export const ADS_DEFAULT: Ad[] = [
  { id: 'a1', fx: 'film', k: 'INSIDE YOUR PHONE', t: 'Every part inside your phone.', d: 'Screens, batteries, cameras and flex cables, tested on our bench.', chips: ['TESTED', 'WARRANTY', 'IN STOCK'], cta: 'Shop all parts', href: '/shop', img: '/assets/pose/film-24-480.webp', tone: 'd' },
  { id: 'a2', fx: 'grades', k: 'QUALITY GRADES', t: 'One screen. Every grade.', d: 'Original, Compatible, OLED, Incell, AAA and more: you choose the quality and the price.', chips: ['10 GRADES', 'EVERY PRICE'], cta: 'Compare grades', href: '/shop?cat=SCR', img: '/assets/pose/apple-sp-480.webp', tone: 'd', cat: 'SCR' },
  { id: 'a3', fx: 'fix', k: 'REPAIR LAB', t: 'Cracked in the morning. Fixed by lunch.', d: 'Bring your phone to Deira. Most fits take under an hour.', chips: ['WHILE YOU WAIT', 'TESTED TWICE'], cta: 'Book a repair', href: '/repair', img: '/assets/pose/rep-fixed-480.webp', tone: 'd' },
  { id: 'a4', fx: 'ship', k: 'WORLDWIDE DELIVERY', t: 'Packed in Deira. Tracked to your door.', d: 'Every week to the Middle East, Africa, Europe and Asia.', chips: ['PACKED', 'SHIPPED', 'TRACKED'], cta: 'Get a shipping quote', href: '/worldwide', img: '/assets/pallet/full-600.webp', tone: 'd' },
  { id: 'b1', fx: 'brand', cat: 'SCR', k: 'SAMSUNG · SERVICE PACK', t: 'Straight from Samsung’s own box.', d: 'Service Pack screens for Galaxy S, A and Note, tested before they ship.', chips: ['SERVICE PACK', '6-MONTH WARRANTY'], cta: 'Shop Samsung', href: '/shop?q=Samsung', img: '/assets/pose/samsung-sp-480.webp', tone: 'w' },
  { id: 'b2', fx: 'brand', k: 'APPLE · EVERY IPHONE', t: 'Every iPhone, every grade.', d: 'From the iPhone 8 to the newest Pro Max: screens, batteries and cameras.', chips: ['ORIGINAL', 'OLED', 'INCELL'], cta: 'Shop iPhone parts', href: '/shop?q=iPhone', img: '/assets/pose/apple-sp-480.webp', tone: 'y' },
  { id: 'b3', fx: 'brand', k: 'XIAOMI · REDMI · POCO', t: 'Redmi and POCO, in stock.', d: 'The phones repair shops see most, with the parts on our shelf in Deira.', chips: ['IN STOCK', 'TRADE PRICES'], cta: 'Shop Xiaomi', href: '/shop?q=Xiaomi', img: '/assets/pose/xiaomi-sp-480.webp', tone: 'd' },
  // owner (18 Nov, round 2): "more ads for all brands, a long list as you scroll" — each brand ad wears the brand's colour
  { id: 'b4', fx: 'brand', brand: 'huawei', k: 'HUAWEI · P · MATE · NOVA', t: 'Huawei parts, ready on the shelf.', d: 'Screens and batteries for P, Mate and Nova, every one tested in Deira.', chips: ['TESTED', 'IN STOCK'], cta: 'Shop Huawei', href: '/shop?q=Huawei', img: '/assets/pose/huawei-sp-480.webp', tone: 'd' },
  { id: 'b5', fx: 'brand', brand: 'google', k: 'GOOGLE · PIXEL', t: 'Pixel screens, sharp as day one.', d: 'Original and OLED screens for Pixel 6 to the newest, with a written warranty.', chips: ['ORIGINAL', 'OLED'], cta: 'Shop Pixel', href: '/shop?q=Pixel', img: '/assets/pose/google-sp-480.webp', tone: 'w' },
  { id: 'b6', fx: 'brand', brand: 'oppo', k: 'OPPO · RENO · A SERIES', t: 'Oppo parts for every Reno and A.', d: 'Screens, batteries and charging flex cables, ready for the counter.', chips: ['SCREENS', 'BATTERIES'], cta: 'Shop Oppo', href: '/shop?q=Oppo', img: '/assets/pose/bbk-sp-480.webp', tone: 'd' },
  { id: 'b7', fx: 'brand', brand: 'redmi', k: 'REDMI · NOTE SERIES', t: 'Every Redmi Note, every grade.', d: 'The most repaired phones in the region, with parts at trade prices.', chips: ['ORIGINAL', 'INCELL', 'AAA'], cta: 'Shop Redmi', href: '/shop?q=Redmi', img: '/assets/pose/xiaomi-sp-480.webp', tone: 'w' },
  { id: 'b8', fx: 'brand', brand: 'honor', k: 'HONOR · X · MAGIC', t: 'Honor parts, tested twice.', d: 'Screens and batteries for the Honor X and Magic lines.', chips: ['TESTED TWICE', 'WARRANTY'], cta: 'Shop Honor', href: '/shop?q=Honor', img: '/assets/pose/generic-gx-480.webp', tone: 'd' },
  { id: 'b9', fx: 'brand', brand: 'realme', k: 'REALME · C · GT', t: 'Realme, from C to GT.', d: 'Screens, back covers and charging ports for the realme range.', chips: ['IN STOCK', 'TRADE PRICES'], cta: 'Shop realme', href: '/shop?q=Realme', img: '/assets/pose/bbk-sp-480.webp', tone: 'w' },
  { id: 'b10', fx: 'brand', brand: 'oneplus', k: 'ONEPLUS · NORD', t: 'OnePlus and Nord, fixed fast.', d: 'OLED screens and batteries for OnePlus and Nord phones.', chips: ['OLED', 'BATTERIES'], cta: 'Shop OnePlus', href: '/shop?q=OnePlus', img: '/assets/pose/generic-temp-480.webp', tone: 'd' },
  { id: 'b11', fx: 'brand', brand: 'nokia', k: 'NOKIA · G · C SERIES', t: 'Nokia parts that last.', d: 'Screens and batteries for Nokia G and C phones, with a written warranty.', chips: ['WARRANTY', 'IN STOCK'], cta: 'Shop Nokia', href: '/shop?q=Nokia', img: '/assets/pose/generic-zy-480.webp', tone: 'w' },
  { id: 'b12', fx: 'brand', brand: 'poco', k: 'POCO · X · F · M', t: 'POCO parts at trade prices.', d: 'Screens and batteries for POCO X, F and M, ready in Deira.', chips: ['TRADE PRICES', 'TESTED'], cta: 'Shop POCO', href: '/shop?q=POCO', img: '/assets/pose/xiaomi-sp-480.webp', tone: 'd' },
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
    case 'brand': { const b = adBrand(a); return <span className="iad2-brand"><span className="lg"><SEBrandLogo brand={b} h={22} fit="120x26" color={brandInk(b)} /></span><img src={a.img} alt="" /></span>; }
    default: return <img className="iad2-pic" src={a.img} alt="" loading="lazy" />;
  }
}
function Years() {
  const end = new Date().getFullYear() - 2003, [y, setY] = useState(0);
  useEffect(() => { let v = 0; const id = window.setInterval(() => { v++; setY(v); if (v >= end) window.clearInterval(id); }, 55); return () => window.clearInterval(id); }, [end]);
  return <span className="iad2-years" data-no-i18n=""><b><i>’</i>03</b><small>{T('SINCE 2003')} · {y}+ {T('YEARS')}</small></span>;
}

/** owner (18 Nov): "the ads between products are all yellow, copy-paste, and the worldwide one is so cheap: nothing like
 *  the teardown ad". v3: one graphite stage for all of them, but each ad has its own accent glow and its own big outlined
 *  word drifting behind; the title slams in word by word with an impact flash; the picture whips in; two soft light bands
 *  cross at a steady beat (never random); a compact button. Hovering never stops them. */
// owner (18 Nov, round 2): our own ads wear ONLY our branding (graphite, yellow, white); only brand ads may use the brand's colour
const adBrand = (a: Ad) => a.brand || (a.id === 'b1' ? 'samsung' : a.id === 'b2' ? 'apple' : 'xiaomi');
const ACC: Record<string, [string, string]> = { film: ['#F7C032', 'PARTS'], grades: ['#F7C032', 'GRADES'], fix: ['#F7C032', 'REPAIR'], ship: ['#F7C032', 'WORLDWIDE'], years: ['#F7C032', 'SINCE 2003'], brand: ['#F7C032', 'BRANDS'] };
function Vis3({ a, live }: { a: Ad; live: boolean }) {
  if (a.fx === 'grades') return <span className="ia3-grades">{([['apple-sp', 'OR', 'Original'], ['apple-gx', 'OL', 'OLED Soft'], ['apple-zy', 'IN', 'Incell'], ['apple-temp', 'AQ', 'AAA']] as const).map(([g, k, n], i) => <span key={g} style={{ ['--i' as string]: i } as React.CSSProperties}><img src={'/assets/pose/' + g + '-480.webp'} alt="" /><GradeTag g={k} name={n} size="sm" /></span>)}</span>;
  if (a.fx === 'ship') return (
    <span className="ia3-ship">
      <svg className="ia3-map" viewBox="0 0 320 120" aria-hidden="true">
        <g className="arcs"><path d="M60 78 C 100 20, 150 20, 186 60" pathLength={1} /><path d="M186 60 C 220 30, 260 30, 290 50" pathLength={1} /><path d="M186 60 C 170 90, 150 104, 120 108" pathLength={1} /><path d="M186 60 C 150 30, 110 22, 70 30" pathLength={1} /></g>
        {([[186, 60, 'DXB'], [290, 50, 'ASIA'], [120, 108, 'AFRICA'], [70, 30, 'EUROPE'], [60, 78, 'MIDDLE EAST']] as const).map(([x, y, n], k) => <g key={n} className="pin" style={{ ['--k' as string]: k } as React.CSSProperties}><circle cx={x} cy={y} r={k ? 3.2 : 4.6} /><circle className="ring" cx={x} cy={y} r={k ? 3.2 : 4.6} /><text x={x} y={y - 9} textAnchor="middle">{n}</text></g>)}
        <circle className="plane" r="3" ><animateMotion dur="3.6s" repeatCount="indefinite" path="M186 60 C 220 30, 260 30, 290 50" /></circle>
      </svg>
      <img className="ia3-pal" src="/assets/pallet/full-600.webp" alt="" />
    </span>
  );
  return <Visual a={a} live={live} />;
}

export default function InlineAd({ slot, lastCat }: { slot: number; lastCat?: string }) {
  const list = useMemo(() => {
    const all = shopAds(); const n = all.length; const rot = all.map((_, i) => all[(i + slot * 3) % n]);
    if (lastCat && allowed('booster')) { const m = rot.findIndex((a) => a.cat === lastCat); if (m > 0) rot.unshift(...rot.splice(m, 1)); }
    return rot.slice(0, 3);
  }, [slot, lastCat]);
  const [i, setI] = useState(0), [live, setLive] = useState(false), box = useRef<HTMLAnchorElement>(null);
  useEffect(() => { const el = box.current; if (!el) return; const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.25 }); io.observe(el); return () => io.disconnect(); }, []);
  useEffect(() => { if (!live || list.length < 2) return; const t = window.setTimeout(() => setI((n) => (n + 1) % list.length), 6500); return () => window.clearTimeout(t); }, [i, live, list.length]);
  const a = list[i]; if (!a) return null;
  const [ac, word] = ACC[a.fx || 'film'] || ACC.film, brandC = a.fx === 'brand' ? brandInk(adBrand(a)) : null;
  return (
    <a ref={box} className={'ia3' + (live ? ' live' : '')} data-in={(slot + i) % 3} href={a.href} aria-label={T(a.t)} style={{ ['--ac' as string]: brandC && brandC !== '#000000' ? brandC : ac } as React.CSSProperties}>
      <span className="ia3-boom" aria-hidden="true" key={'boom' + i + (live ? 1 : 0)} /><span className="ia3-bg" aria-hidden="true"><i className="glow" /><i className="band b1" /><i className="band b2" /><span className="ia3-word" data-no-i18n="">{[0, 1].map((k) => <b key={k}>{word} · {word} · </b>)}</span></span>
      <span className="ia3-scene" key={a.id + '-' + i}>
        <span className="ia3-txt">
          <span className="ia3-k"><i className="rec" />{T(a.k)}<em>{T('Ad')}</em></span>
          <b className="ia3-t" data-no-i18n="">{T(a.t).split(' ').map((w, k) => <span key={k} style={{ ['--w' as string]: k } as React.CSSProperties}>{w} </span>)}</b>
          <small className="ia3-d">{T(a.d)}</small>
          {a.chips?.length ? <span className="ia3-chips">{a.chips.map((c, k) => <i key={c} style={{ ['--c' as string]: k } as React.CSSProperties}>{T(c)}</i>)}</span> : null}
        </span>
        <span className="ia3-vis"><Vis3 a={a} live={live} /></span>
        <span className="ia3-cta">{T(a.cta)}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
        <i className="ia3-flash" aria-hidden="true" />
      </span>
      {list.length > 1 ? <span className="ia3-dots" aria-hidden="true">{list.map((x, k) => <i key={x.id} className={k === i ? 'on' : k < i ? 'done' : ''} />)}</span> : null}
    </a>
  );
}
