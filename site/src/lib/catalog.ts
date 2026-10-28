'use client';
// P1 · The shop's catalogue engine. Reads the product data the whole site already uses (window.SE_DATA, built from the
// owner's Products.xlsx) and adds what the shop needs on top: brand/model names, the product photo, price labels, a
// typo-tolerant search with suggestions, every filter of the "customise" panel, facet counts and sorting.
// When Supabase is connected (src/lib/backend), products come from the `products` table instead, in the same shape.
//
// Prices: everything in the data is a SAMPLE until the owner sends real prices, so every price label carries "· sample".

export type Raw = {
  id: string; model_id: string; category: string; part: string; part_name: string; grade: string; quality: string; manufacturer: string;
  title: string; shot: string; retail_price: number; wholesale_price: number; stock_qty: number; low_stock_threshold: number;
  badges: string[]; visible: boolean; sample?: boolean; colour?: string;
};
export type Product = Raw & {
  brand: string; brandName: string; modelName: string; series: string; device: string; catName: string; gradeName: string;
  makerName: string; qualityName: string; img: string; imgBig: string; deal: number; dealEnds: number; price: number;
  rating: number; reviews: number; warranty: string; hay: string; isNew: boolean; best: boolean;
};
type D = {
  brands: { id: string; name: string; group: string }[]; models: { id: string; brand_id: string; series: string; name: string; device: string; model_numbers?: string[] }[];
  categories: { id: string; name: string; one: string; part?: string; soon?: boolean }[]; gradeNames: Record<string, string>; makerNames: Record<string, string>;
  qualities: { id: string; name: string }[]; manufacturers: { id: string; name: string }[]; colours: { id: string; name: string }[];
  products: Raw[]; deals: { product_id: string; discount: number; starts: number; ends: number }[];
  contact: { wa: string; email: string; phone: string };
};
type Shots = { forCat: (c: string, b: string, m: string) => string; url: (id: string, w: number) => string };
const W = () => window as unknown as { SE_DATA?: D; SE_SHOTS?: Shots };
export const shots = (): Shots | undefined => (typeof window !== 'undefined' ? W().SE_SHOTS : undefined);

export const data = (): D | null => (typeof window !== 'undefined' && W().SE_DATA) || null;
export const VAT = 0.05; // UAE VAT (owner: 5%)
export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
export const aed = (n: number, sample = true) => 'AED ' + fmt(n) + (sample ? ' · sample' : '');

// a stable pseudo-random number per id (placeholder ratings until account holders rate)
const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return (h >>> 0) / 4294967295; };
const WARRANTY: Record<string, string> = { OR: '6 months', OL: '3 months', IN: '1 month', AQ: '1 month' };
export const warrantyOf = (grade: string) => WARRANTY[grade] || '1 month';

let cache: { d: D; list: Product[] } | null = null;
export function products(): Product[] {
  const d = data(); if (!d) return [];
  if (cache && cache.d === d) return cache.list;
  const B = new Map(d.brands.map((b) => [b.id, b])), M = new Map(d.models.map((m) => [m.id, m])), C = new Map(d.categories.map((c) => [c.id, c]));
  const Q = new Map(d.qualities.map((q) => [q.id, q.name])), MK = new Map(d.manufacturers.map((q) => [q.id, q.name]));
  const now = Date.now(), DL = new Map(d.deals.filter((x) => x.ends > now - 864e5 * 30).map((x) => [x.product_id, x]));
  const S = shots();
  const list = d.products.filter((p) => p.visible !== false).map((p, i) => {
    const m = M.get(p.model_id), b = m ? B.get(m.brand_id) : undefined, brand = b ? b.id : 'other', dl = DL.get(p.id);
    const pose = S ? S.forCat(p.category, brand, p.manufacturer) : p.shot;
    // sample offers on ~1 in 9 parts (besides the deals in the data), ending at the end of the week, until the team sets real ones
    const r = hash(p.id), rd = hash(p.id + 'deal'), wk = (() => { const t = new Date(); t.setHours(23, 59, 59, 0); t.setDate(t.getDate() + ((7 - t.getDay()) % 7)); return t.getTime(); })();
    const deal = dl ? dl.discount : rd < 0.11 ? 5 + Math.round(rd * 180) : 0;
    const out: Product = {
      ...p, brand, brandName: b ? b.name : '', modelName: m ? m.name : '', series: m ? m.series : '', device: m ? m.device : 'phone',
      catName: C.get(p.category)?.name || p.category, gradeName: d.gradeNames[p.grade] || p.grade, makerName: MK.get(p.manufacturer) || d.makerNames[p.grade] || p.manufacturer,
      qualityName: Q.get(p.quality) || p.quality, img: S ? S.url(pose, 480) : '', imgBig: S ? S.url(pose, 960) : '',
      deal, dealEnds: dl ? dl.ends : deal ? wk : 0, price: Math.round(p.retail_price * (1 - deal / 100)),
      rating: Math.round((3.9 + r * 1.1) * 10) / 10, reviews: Math.round(4 + r * 180), warranty: warrantyOf(p.grade),
      hay: '', isNew: i % 11 === 3, best: r > 0.82,
      // back covers and frames come in colours (sample until the Excel lists them per product)
      colour: p.colour || (p.category === 'BCV' || p.category === 'FRM' ? d.colours[Math.floor(hash(p.id + 'c') * Math.min(8, d.colours.length))].id : ''),
    };
    out.hay = norm([out.title, out.brandName, out.modelName, out.series, out.catName, out.part_name, out.gradeName, out.makerName, out.qualityName, p.id].join(' '));
    return out;
  });
  cache = { d, list };
  return list;
}
export const byId = (id: string) => products().find((p) => p.id === id) || null;

// ── search ───────────────────────────────────────────────────────────────────────────────────────────────
export const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9؀-ۿऀ-ॿЀ-ӿ]+/g, ' ').trim();
// words people type for the same thing
const ALIAS: Record<string, string> = { iphone: 'iphone', ip: 'iphone', aple: 'apple', samsng: 'samsung', sumsung: 'samsung', galaxy: 'samsung', lcd: 'screen', display: 'screen', oled: 'screen', glass: 'screen', touch: 'screen', battry: 'battery', batery: 'battery', bat: 'battery', charging: 'flex', charger: 'flex', port: 'flex', cam: 'camera', camra: 'camera', back: 'back', housing: 'frame', chassis: 'frame', 'شاشة': 'screen', 'بطارية': 'battery', 'كاميرا': 'camera', 'ايفون': 'iphone', 'سامسونج': 'samsung' };
const STOP = new Set('do does u you ya have has got any is are there the a an of for to my me i we need want looking price prices cost how much what which please pls plz can could hi hello hey with and or in on at this that it its your'.split(' '));
function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const v = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = v[0]; v[0] = i; let best = v[0];
    for (let j = 1; j <= b.length; j++) { const t = v[j]; v[j] = Math.min(v[j] + 1, v[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; best = Math.min(best, v[j]); }
    if (best > max) return max + 1;
  }
  return v[b.length];
}
let vocab: { d: D; words: string[] } | null = null;
function words(): string[] {
  const d = data(); if (!d) return [];
  if (vocab && vocab.d === d) return vocab.words;
  const set = new Set<string>(); products().forEach((p) => p.hay.split(' ').forEach((w) => w.length > 1 && set.add(w)));
  vocab = { d, words: [...set] }; return vocab.words;
}
/** each typed word → the closest real word (typos up to 1–2 letters), so "iphon 13 scren" finds "iphone 13 screen" */
export function fix(q: string): { terms: string[]; fixed: string; changed: boolean } {
  const W = words(), raw = norm(q).split(' ').filter(Boolean);
  // filler words ("do you have", "price of", "pls") are dropped; unknown words with no close match are dropped too
  const terms = raw.filter((w) => !STOP.has(w)).map((w) => {
    if (ALIAS[w]) return ALIAS[w];
    if (/^\d+$/.test(w) || W.includes(w) || W.some((x) => x.startsWith(w))) return w;
    if (w.length < 3) return '';
    const max = w.length <= 4 ? 1 : 2; let best = '', bd = max + 1;
    for (const x of W) { const dd = lev(w, x, max); if (dd < bd) { bd = dd; best = x; if (dd === 1 && max === 1) break; } }
    return best;
  }).filter(Boolean);
  return { terms, fixed: terms.join(' '), changed: terms.join(' ') !== raw.filter((w) => !STOP.has(w)).join(' ') };
}
export function search(q: string, list = products()): Product[] {
  if (!norm(q)) return list;
  const { terms } = fix(q);
  return list.map((p) => {
    let sc = 0; for (const t of terms) { if (p.hay.includes(' ' + t + ' ') || p.hay.startsWith(t + ' ')) sc += 3; else if (p.hay.includes(t)) sc += 1; else return null; }
    if (norm(p.modelName) === terms.filter((t) => !['screen', 'battery', 'camera', 'flex', 'frame', 'back'].includes(t)).join(' ')) sc += 4;
    return { p, sc };
  }).filter(Boolean).sort((a, b) => b!.sc - a!.sc).map((x) => x!.p);
}
/** suggestions under the search box: models, brands and parts that match what is typed so far */
export function suggest(q: string, n = 8) {
  const d = data(); if (!d || !norm(q)) return [];
  const { terms } = fix(q), t = terms.join(' ');
  const out: { kind: 'model' | 'brand' | 'part'; label: string; sub: string; q: string }[] = [];
  d.brands.forEach((b) => { if (norm(b.name).startsWith(terms[0] || '')) out.push({ kind: 'brand', label: b.name, sub: d.models.filter((m) => m.brand_id === b.id).length + ' models', q: b.name }); });
  const ms = d.models.filter((m) => terms.every((x) => norm(m.name + ' ' + m.series).includes(x) || norm(d.brands.find((b) => b.id === m.brand_id)?.name || '').includes(x)));
  const has = new Set(products().map((p) => p.model_id));
  ms.sort((a, b) => +has.has(b.id) - +has.has(a.id)).slice(0, 5).forEach((m) => out.push({ kind: 'model', label: m.name, sub: has.has(m.id) ? 'in stock' : 'ask us', q: m.name }));
  search(t).slice(0, 4).forEach((p) => out.push({ kind: 'part', label: p.title + ' · ' + p.gradeName, sub: p.makerName, q: p.title }));
  const seen = new Set<string>(); return out.filter((x) => (seen.has(x.label) ? false : (seen.add(x.label), true))).slice(0, n);
}

// ── filters (the "customise" panel) ─────────────────────────────────────────────────────────────────────────
export type Filters = {
  q: string; brands: string[]; models: string[]; cats: string[]; parts: string[]; grades: string[]; makers: string[]; qualities: string[];
  min: number | null; max: number | null; inStock: boolean; deals: boolean; isNew: boolean; rating: number; warranty: string[];
  device: string[]; colours: string[]; sort: 'best' | 'price-asc' | 'price-desc' | 'rating' | 'stock' | 'new' | 'name' | 'deal';
};
export const EMPTY: Filters = { q: '', brands: [], models: [], cats: [], parts: [], grades: [], makers: [], qualities: [], min: null, max: null, inStock: false, deals: false, isNew: false, rating: 0, warranty: [], device: [], colours: [], sort: 'best' };
export function apply(f: Filters, base?: Product[], skip?: keyof Filters): Product[] {
  let l = search(f.q, base || products());
  const inn = <T,>(a: T[], v: T) => !a.length || a.includes(v);
  l = l.filter((p) =>
    (skip === 'brands' || inn(f.brands, p.brand)) && (skip === 'models' || inn(f.models, p.model_id)) && (skip === 'cats' || inn(f.cats, p.category)) && (skip === 'parts' || inn(f.parts, p.part)) &&
    (skip === 'grades' || inn(f.grades, p.grade)) && (skip === 'makers' || inn(f.makers, p.manufacturer)) && (skip === 'qualities' || inn(f.qualities, p.quality)) &&
    (skip === 'warranty' || inn(f.warranty, p.warranty)) && (skip === 'device' || inn(f.device, p.device)) && (skip === 'colours' || !f.colours.length || f.colours.includes(p.colour || '')) &&
    (f.min == null || p.price >= f.min) && (f.max == null || p.price <= f.max) && (!f.inStock || p.stock_qty > 0) && (!f.deals || p.deal > 0) && (!f.isNew || p.isNew) && p.rating >= f.rating);
  const avail = (x: Product[]) => [...x.filter((p) => p.stock_qty > 0), ...x.filter((p) => p.stock_qty <= 0)]; // out of stock last
  if (f.q && f.sort === 'best') return avail(l);
  const S: Record<Filters['sort'], (a: Product, b: Product) => number> = {
    best: (a, b) => +b.best - +a.best || b.reviews - a.reviews, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating, stock: (a, b) => b.stock_qty - a.stock_qty, new: (a, b) => +b.isNew - +a.isNew, name: (a, b) => a.title.localeCompare(b.title), deal: (a, b) => b.deal - a.deal,
  };
  return avail([...l].sort(S[f.sort]));
}
/** how many results each option would give (shown next to every checkbox), honouring the other filters */
export function facets(f: Filters) {
  const count = (k: keyof Filters, key: (p: Product) => string) => { const m: Record<string, number> = {}; apply(f, undefined, k).forEach((p) => { const v = key(p); m[v] = (m[v] || 0) + 1; }); return m; };
  return { brands: count('brands', (p) => p.brand), cats: count('cats', (p) => p.category), grades: count('grades', (p) => p.grade), makers: count('makers', (p) => p.manufacturer), qualities: count('qualities', (p) => p.quality), warranty: count('warranty', (p) => p.warranty), device: count('device', (p) => p.device), colours: count('colours', (p) => p.colour || ''), parts: count('parts', (p) => p.part), models: count('models', (p) => p.model_id) };
}
export const priceRange = () => { const l = products(); return l.length ? [Math.min(...l.map((p) => p.price)), Math.max(...l.map((p) => p.price))] : [0, 1000]; };
export const similar = (p: Product, n = 8) => products().filter((x) => x.id !== p.id && (x.model_id === p.model_id || (x.category === p.category && x.brand === p.brand))).sort((a, b) => +(b.model_id === p.model_id) - +(a.model_id === p.model_id) || a.price - b.price).slice(0, n);
export const alsoFor = (p: Product) => products().filter((x) => x.model_id === p.model_id && x.category !== p.category);
export const grades = (p: Product) => products().filter((x) => x.model_id === p.model_id && x.category === p.category);
export const waLink = (text: string) => 'https://wa.me/' + (data()?.contact.wa || '971503420015') + '?text=' + encodeURIComponent(text);
/** fee for fitting a part in the Repair Lab (owner): AED 25 under 100, AED 35 for 100–500, AED 45 above 500 */
export const repairFee = (partPrice: number) => (partPrice < 100 ? 25 : partPrice <= 500 ? 35 : 45);
