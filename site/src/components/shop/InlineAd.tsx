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
import Medal from '@/components/account/Medal';

export type AdFx = 'film' | 'grades' | 'fix' | 'ship' | 'years' | 'brand' | 'card' | 'chips' | 'stack' | 'deal' | 'part' | 'place';
export type Ad = { id: string; k: string; t: string; d: string; cta: string; href: string; img: string; tone: 'y' | 'd' | 'w'; cat?: string; fx?: AdFx; chips?: string[]; brand?: string };
export const ADS_DEFAULT: Ad[] = [
  { id: 'a1', fx: 'film', k: 'INSIDE YOUR PHONE', t: 'Every part inside your phone.', d: 'Screens, batteries, cameras and flex cables, tested on our bench.', chips: ['TESTED', 'WARRANTY', 'IN STOCK'], cta: 'Shop all parts', href: '/shop', img: '/assets/pose/film-24-480.webp', tone: 'd' },
  { id: 'a2', fx: 'grades', k: 'QUALITY GRADES', t: 'One screen. Every grade.', d: 'Original, Compatible, OLED, Incell, AAA and more: you choose the quality and the price.', chips: ['10 GRADES', 'EVERY PRICE'], cta: 'Compare grades', href: '/shop?cat=SCR', img: '/assets/pose/apple-sp-480.webp', tone: 'w', cat: 'SCR' },
  { id: 'a3', fx: 'fix', k: 'REPAIR LAB', t: 'Cracked in the morning. Fixed by lunch.', d: 'Bring your phone to Deira. Most fits take under an hour.', chips: ['WHILE YOU WAIT', 'TESTED TWICE'], cta: 'Book a repair', href: '/repair', img: '/assets/pose/rep-fixed-480.webp', tone: 'y' },
  { id: 'a4', fx: 'ship', k: 'WORLDWIDE DELIVERY', t: 'Packed in Deira. Tracked to your door.', d: 'Every week to the Middle East, Africa, Europe and Asia.', chips: ['PACKED', 'SHIPPED', 'TRACKED'], cta: 'Get a shipping quote', href: '/worldwide', img: '/assets/pallet/full-600.webp', tone: 'd' },
  { id: 'b1', fx: 'brand', cat: 'SCR', k: 'SAMSUNG · SERVICE PACK', t: 'Straight from Samsung’s own box.', d: 'Service Pack screens for Galaxy S, A and Note, tested before they ship.', chips: ['SERVICE PACK', '6-MONTH WARRANTY'], cta: 'Shop Samsung', href: '/shop?q=Samsung', img: '/assets/pose/samsung-sp-480.webp', tone: 'w' },
  { id: 'b2', fx: 'brand', k: 'APPLE · EVERY IPHONE', t: 'Every iPhone, every grade.', d: 'From the iPhone 8 to the newest Pro Max: screens, batteries and cameras.', chips: ['ORIGINAL', 'OLED', 'INCELL'], cta: 'Shop iPhone parts', href: '/shop?q=iPhone', img: '/assets/pose/apple-sp-480.webp', tone: 'w' },
  { id: 'b3', fx: 'brand', k: 'XIAOMI · REDMI · POCO', t: 'Redmi and POCO, in stock.', d: 'The phones repair shops see most, with the parts on our shelf in Deira.', chips: ['IN STOCK', 'TRADE PRICES'], cta: 'Shop Xiaomi', href: '/shop?q=Xiaomi', img: '/assets/pose/xiaomi-sp-480.webp', tone: 'd' },
  // owner (18 Nov, round 2): "more ads for all brands, a long list as you scroll" — each brand ad wears the brand's colour
  { id: 'b4', fx: 'brand', brand: 'huawei', k: 'HUAWEI · P · MATE · NOVA', t: 'Huawei parts, ready on the shelf.', d: 'Screens and batteries for P, Mate and Nova, every one tested in Deira.', chips: ['TESTED', 'IN STOCK'], cta: 'Shop Huawei', href: '/shop?q=Huawei', img: '/assets/pose/huawei-sp-480.webp', tone: 'd' },
  { id: 'b5', fx: 'brand', brand: 'google', k: 'GOOGLE · PIXEL', t: 'Pixel screens, sharp as day one.', d: 'Original and OLED screens for Pixel 6 to the newest, with a written warranty.', chips: ['ORIGINAL', 'OLED'], cta: 'Shop Pixel', href: '/shop?q=Pixel', img: '/assets/pose/google-sp-480.webp', tone: 'w' },
  { id: 'b6', fx: 'brand', brand: 'oppo', k: 'OPPO · RENO · A SERIES', t: 'Oppo parts for every Reno and A.', d: 'Screens, batteries and charging flex cables, ready for the counter.', chips: ['SCREENS', 'BATTERIES'], cta: 'Shop Oppo', href: '/shop?q=Oppo', img: '/assets/pose/bbk-sp-480.webp', tone: 'w' },
  { id: 'b7', fx: 'brand', brand: 'redmi', k: 'REDMI · NOTE SERIES', t: 'Every Redmi Note, every grade.', d: 'The most repaired phones in the region, with parts at trade prices.', chips: ['ORIGINAL', 'INCELL', 'AAA'], cta: 'Shop Redmi', href: '/shop?q=Redmi', img: '/assets/pose/xiaomi-sp-480.webp', tone: 'd' },
  { id: 'b8', fx: 'brand', brand: 'honor', k: 'HONOR · X · MAGIC', t: 'Honor parts, tested twice.', d: 'Screens and batteries for the Honor X and Magic lines.', chips: ['TESTED TWICE', 'WARRANTY'], cta: 'Shop Honor', href: '/shop?q=Honor', img: '/assets/pose/generic-gx-480.webp', tone: 'w' },
  { id: 'b9', fx: 'brand', brand: 'realme', k: 'REALME · C · GT', t: 'Realme, from C to GT.', d: 'Screens, back covers and charging ports for the realme range.', chips: ['IN STOCK', 'TRADE PRICES'], cta: 'Shop realme', href: '/shop?q=Realme', img: '/assets/pose/bbk-sp-480.webp', tone: 'd' },
  { id: 'b10', fx: 'brand', brand: 'oneplus', k: 'ONEPLUS · NORD', t: 'OnePlus and Nord, fixed fast.', d: 'OLED screens and batteries for OnePlus and Nord phones.', chips: ['OLED', 'BATTERIES'], cta: 'Shop OnePlus', href: '/shop?q=OnePlus', img: '/assets/pose/generic-temp-480.webp', tone: 'y' },
  { id: 'b11', fx: 'brand', brand: 'nokia', k: 'NOKIA · G · C SERIES', t: 'Nokia parts that last.', d: 'Screens and batteries for Nokia G and C phones, with a written warranty.', chips: ['WARRANTY', 'IN STOCK'], cta: 'Shop Nokia', href: '/shop?q=Nokia', img: '/assets/pose/generic-zy-480.webp', tone: 'w' },
  { id: 'b12', fx: 'brand', brand: 'poco', k: 'POCO · X · F · M', t: 'POCO parts at trade prices.', d: 'Screens and batteries for POCO X, F and M, ready in Deira.', chips: ['TRADE PRICES', 'TESTED'], cta: 'Shop POCO', href: '/shop?q=POCO', img: '/assets/pose/xiaomi-sp-480.webp', tone: 'd' },
  // owner (19 Nov): more kinds of ads, grouped by theme (services · brands · qualities · membership)
  { id: 's1', fx: 'stack', k: 'TRADE PRICES', t: 'Repair shops pay trade prices.', d: 'Apply once with your trade licence and every part shows your price.', chips: ['APPLY ONCE', 'EVERY GRADE'], cta: 'Get trade prices', href: '/wholesale', img: '/assets/pose/samsung-sp-480.webp', tone: 'd' },
  { id: 's2', fx: 'stack', k: 'PICK UP TODAY', t: 'Order now, collect in Deira.', d: 'Parts are ready at the counter in about 20 minutes during opening hours.', chips: ['SAME DAY', 'AL MURAR'], cta: 'Shop now', href: '/shop', img: '/assets/se-logo-320.webp', tone: 'w' },
  { id: 's3', fx: 'film', k: 'ASK SAMSOOM', t: 'Not sure which part fits?', d: 'Tell Samsoom the model. He finds the part, the grade and the price.', chips: ['ANY TIME', 'ANY LANGUAGE'], cta: 'Ask Samsoom', href: '/samsoom', img: '/assets/pose/film-24-480.webp', tone: 'y' },
  { id: 'm1', fx: 'card', k: 'SAM CIRCUIT', t: 'Points on every part you buy.', d: 'Your first purchase activates the card. Level up from Connected to Lightning.', chips: ['POINTS', 'LEVELS', 'PERKS'], cta: 'Get the card', href: '/membership', img: '/assets/se-logo-320.webp', tone: 'd' },
  { id: 'm2', fx: 'chips', k: 'MEDALS & LEVELS', t: 'Explore the site, earn chips.', d: 'Every medal adds points. Points unlock levels, and every level brings a reward.', chips: ['CHIPS', 'POINTS', 'REWARDS'], cta: 'See my bench', href: '/account#medals', img: '/assets/se-logo-320.webp', tone: 'w' },
  // owner (R12): "play ALL kinds of ads, even discounts, all locations, not just a few": deals, arrivals, warranty, places
  { id: 'd1', fx: 'deal', k: 'THIS WEEK ONLY', t: 'Up to 25% off screens.', d: 'Live deals on screens, batteries and back glass, while the stock lasts.', chips: ['LIVE DEALS', 'WHILE STOCK LASTS'], cta: 'See every deal', href: '/deals', img: '/assets/pose/solo-scr-960.webp', tone: 'y' },
  { id: 'd2', fx: 'deal', k: 'BACK GLASS WEEK', t: '−18% on every back glass.', d: 'Every colour, with or without the camera ring, tested before it ships.', chips: ['EVERY COLOUR', '−18%'], cta: 'Shop back glass', href: '/shop?q=back', img: '/assets/pose/solo-bcv-960.webp', tone: 'd' },
  { id: 'n1', fx: 'part', k: 'JUST LANDED', t: 'New batteries, fresh on the shelf.', d: 'Genuine cells, capacity tested, with a written warranty.', chips: ['NEW ARRIVAL', 'CAPACITY TESTED'], cta: 'Shop batteries', href: '/shop?q=battery', img: '/assets/pose/solo-bat-960.webp', tone: 'w' },
  { id: 'n2', fx: 'part', k: 'CAMERAS · FRONT & REAR', t: 'Sharp again in ten minutes.', d: 'Front and rear cameras for every popular model, bench-tested.', chips: ['FRONT', 'REAR', 'LENSES'], cta: 'Shop cameras', href: '/shop?q=camera', img: '/assets/pose/solo-cam-960.webp', tone: 'd' },
  { id: 'w1', fx: 'part', k: 'WRITTEN WARRANTY', t: 'Every grade. Its own warranty.', d: 'The warranty is printed on your invoice, so you always know what you bought.', chips: ['ON THE INVOICE', 'EVERY GRADE'], cta: 'Read the warranty', href: '/legal', img: '/assets/pose/solo-flx-960.webp', tone: 'w' },
  { id: 'l1', fx: 'place', k: 'AL MURAR · DEIRA · DUBAI', t: 'Come by the counter.', d: 'Open every day in Al Murar. Pick up your order in about 20 minutes.', chips: ['PICK UP', 'OPEN DAILY'], cta: 'Get directions', href: '/contact', img: '/assets/pose/bench-phone-960.webp', tone: 'd' },
  { id: 'l2', fx: 'place', k: 'MADRID · PLAZA MAYOR', t: 'Next stop: Madrid.', d: 'Our first branch outside Dubai is coming to the heart of Madrid.', chips: ['COMING SOON', 'SPAIN'], cta: 'Our story', href: '/story', img: '/assets/pose/solo-board-960.webp', tone: 'y' },
  { id: 'a5', fx: 'years', k: 'OUR EXPERIENCE', t: 'Since 2003. Same family, same street.', d: 'Twenty years of parts, repairs and honest prices in Deira.', chips: ['QUALITY', 'WARRANTY', 'PRICE'], cta: 'Our story', href: '/story', img: '/assets/se-logo-320.webp', tone: 'w' },
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
    case 'fix': return <span className="iad2-fix"><img className="was" src="/assets/promo/rep-crack.webp" alt="" /><img className="now" src="/assets/promo/rep-fixed.webp" alt="" /><i className="scan" /></span>;
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
const ACC: Record<string, [string, string]> = { deal: ['#F7C032', 'DEALS'], part: ['#F7C032', 'NEW IN'], place: ['#F7C032', 'DEIRA'], film: ['#F7C032', 'PARTS'], grades: ['#F7C032', 'GRADES'], fix: ['#F7C032', 'REPAIR'], ship: ['#F7C032', 'WORLDWIDE'], years: ['#F7C032', 'SINCE 2003'], brand: ['#F7C032', 'BRANDS'], card: ['#F7C032', 'SAM CIRCUIT'], chips: ['#F7C032', 'MEDALS'], stack: ['#F7C032', 'PICK UP'] };
function Vis3({ a, live }: { a: Ad; live: boolean }) {
  if (a.fx === 'grades') return <span className="ia3-grades">{([['apple-sp', 'OR', 'Original'], ['apple-gx', 'OL', 'OLED Soft'], ['apple-zy', 'IN', 'Incell'], ['apple-temp', 'AQ', 'AAA']] as const).map(([g, k, n], i) => <span key={g} style={{ ['--i' as string]: i } as React.CSSProperties}><img src={'/assets/pose/' + g + '-480.webp'} alt="" /><GradeTag g={k} name={n} size="sm" /></span>)}</span>;
  if (a.fx === 'card') return <span className="ia3-card"><span className="cd"><b>SAM CIRCUIT</b><i className="chip" /><span className="med"><img src="/assets/se-logo-metal-128.webp" alt="" /></span><small>CONNECTED → LIGHTNING</small></span></span>;
  if (a.fx === 'chips') return <span className="ia3-chipset">{(['bronze', 'silver', 'gold'] as const).map((t, k) => <span key={t} style={{ ['--k' as string]: k } as React.CSSProperties}><Medal tier={t} size={86} group={(['explore', 'shop', 'train'] as const)[k]} /></span>)}</span>;
  if (a.fx === 'stack') return <span className="ia3-stack">{['solo-scr', 'solo-bat', 'solo-cam'].map((n, k) => <img key={n} src={'/assets/pose/' + n + '-480.webp'} alt="" style={{ ['--k' as string]: k } as React.CSSProperties} />)}</span>;
  // owner (18 Nov night): no drawn route lines; the pallet, with the four regions as clean pills
  if (a.fx === 'ship') return (
    <span className="ia3-ship2">
      <img className="pal" src="/assets/pallet/full-600.webp" alt="" />
      <span className="regs">{['MIDDLE EAST', 'AFRICA', 'EUROPE', 'ASIA'].map((r, k) => <i key={r} style={{ ['--k' as string]: k } as React.CSSProperties}>{T(r)}</i>)}</span>
    </span>
  );
  // the repair: the cracked phone, a light passes over it, and it comes out fixed
  if (a.fx === 'fix') return (
    <span className="ia3-fix2"><img className="was" src="/assets/pose/rep-crack-480.webp" alt="" /><img className="now" src="/assets/pose/rep-fixed-480.webp" alt="" /></span>
  );
  // brand ads: the part big, the brand's logo large and faint behind it
  // owner (R10): "a better teardown ad": the phone opens layer by layer and every layer is named as it comes out
  if (a.fx === 'film') return (
    <span className="ia3-film"><span className="tfm"><Film live={live} /></span><span className="tly">{['SCREEN', 'FRAME', 'BATTERY', 'CAMERA', 'CHARGING PORT'].map((n, k) => <i key={n} style={{ ['--k' as string]: k } as React.CSSProperties}><u>{String(k + 1).padStart(2, '0')}</u>{T(n)}</i>)}</span></span>
  );
  if (a.fx === 'deal') { const pc = (a.t.match(/[−-]?\d+%/) || ['−25%'])[0].replace('-', '−'); return <span className="ia3-part ia3-deal"><img src={a.img} alt="" /><b className="off" data-no-i18n="">{pc.startsWith('−') ? pc : '−' + pc}</b></span>; }
  if (a.fx === 'part' || a.fx === 'place') return <span className="ia3-part"><img src={a.img} alt="" /></span>;
  if (a.fx === 'brand') { const b = adBrand(a); return (
    <span className="ia3-brand2"><img src={a.img} alt="" /></span>
  ); }
  return <Visual a={a} live={live} />;
}

export default function InlineAd({ slot, lastCat }: { slot: number; lastCat?: string }) {
  // owner (19 Nov): every ad slot has ONE theme and turns only through it (services · brands · qualities · membership ·
  // the parts film), and the colours rotate slot by slot: graphite, white, yellow
  const THEMES: ((a: Ad) => boolean)[] = [
    (a) => ['a3', 'a4', 's1', 's2', 's3'].includes(a.id),
    (a) => a.fx === 'brand',
    (a) => a.fx === 'grades' || a.id === 'a1' || a.id === 'b1',
    (a) => a.id === 'm1' || a.id === 'm2' || a.id === 'a5',
    (a) => a.fx === 'deal' || a.fx === 'part',
    (a) => a.fx === 'place' || a.id === 'a4' || a.id === 's2',
  ];
  const list = useMemo(() => {
    const all = shopAds(), th = THEMES[(slot - 1 + 5) % THEMES.length];
    let pick = all.filter(th); if (pick.length < 2) pick = all;
    const n = pick.length, off = Math.floor((slot - 1) / THEMES.length) * 2, rot = pick.map((_, k) => pick[(k + off) % n]);
    if (lastCat && allowed('booster')) { const m = rot.findIndex((a) => a.cat === lastCat); if (m > 0) rot.unshift(...rot.splice(m, 1)); }
    return rot.slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot, lastCat]);
  const [i, setI] = useState(0), [live, setLive] = useState(false), [seen, setSeen] = useState(false), box = useRef<HTMLAnchorElement>(null);
  useEffect(() => { const el = box.current; if (!el) return; const io = new IntersectionObserver(([e]) => { setLive(e.isIntersecting); if (e.isIntersecting) setSeen(true); }, { threshold: 0.25 }); io.observe(el); return () => io.disconnect(); }, []);
  useEffect(() => { if (!live || list.length < 2) return; const t = window.setTimeout(() => setI((n) => (n + 1) % list.length), 4500); return () => window.clearTimeout(t); }, [i, live, list.length]);
  const a = list[i]; if (!a) return null;
  // owner (R10): inside one holder the slides take turns graphite → white → yellow (never three graphite in a row);
  // the slot offset keeps two holders on screen from wearing the same colour at the same moment
  const tone = (['d', 'w', 'y'] as const)[(i + slot - 1) % 3];
  const [ac, word0] = ACC[a.fx || 'film'] || ACC.film, word = a.id === 's1' ? 'TRADE' : a.id === 's3' ? 'SAMSOOM' : word0, brandC = a.fx === 'brand' ? brandInk(adBrand(a)) : null;
  return (
    <a ref={box} className={'ia3' + (live ? ' live' : '') + (seen ? ' seen' : '')} data-in={(slot + i) % 3} data-flip={(slot + i) % 2} data-tone={tone} data-brand={a.fx === 'brand' ? '1' : undefined} href={a.href} aria-label={T(a.t)} style={{ ['--ac' as string]: ac, ['--bc' as string]: brandC || ac } as React.CSSProperties}>
      <span className="ia3-bg" aria-hidden="true"><i className="glow" />{a.fx === 'brand' ? <span className="ia3-logos" key={adBrand(a)}>{[0, 1].map((k) => <span key={k}>{[0, 1, 2].map((j) => <SEBrandLogo key={j} brand={adBrand(a)} h={64} fit="300x70" color={brandInk(adBrand(a))} />)}</span>)}</span> : <span className="ia3-word" data-no-i18n="">{[0, 1].map((k) => <b key={k}>{word} · {word} · </b>)}</span>}</span>
      <span className="ia3-scene" key={a.id + '-' + i}>
        <span className="ia3-txt">
          <span className="ia3-k">{T(a.k)}<em>{T('Ad')}</em></span>
          <b className="ia3-t" data-no-i18n="">{T(a.t).split(' ').map((w, k) => { const nm = a.fx === 'brand' && new RegExp('^(' + [adBrand(a), 'iphone', 'galaxy', 'pixel', 'redmi', 'poco', 'nord', 'oneplus', 'realme'].join('|') + ')', 'i').test(w); return <span key={k} className={nm ? 'bn' : undefined} style={{ ['--w' as string]: k } as React.CSSProperties}>{w} </span>; })}</b>
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
