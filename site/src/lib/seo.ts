// R9 · SEO: the catalogue on the server, so every model and every part has its own crawlable page (/m/<model>, /p/<part>),
// a sitemap and structured data. It runs the same two files the browser runs (public/se-catalog.js + se-data.js, plus
// se-shots.js for the photos) in a sandbox at build time, so the pages always match the shop. When Supabase holds the
// products, swap load() for a query; the shapes below stay the same.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { windowFacts } from '@/content/facts';

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://localhost:3000')).replace(/\/$/, '');
export const slug = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

type RawP = { id: string; model_id: string; category: string; part_name: string; grade: string; quality: string; manufacturer: string; title: string; retail_price: number; stock_qty: number; visible?: boolean; sample?: boolean };
type Data = { brands: { id: string; name: string }[]; models: { id: string; brand_id: string; series: string; name: string; device: string; model_numbers?: string[] }[]; categories: { id: string; name: string }[]; gradeNames: Record<string, string>; manufacturers: { id: string; name: string }[]; qualities: { id: string; name: string }[]; products: RawP[] };
type Shots = { forCat: (c: string, b: string, m: string) => string; url: (id: string, w: number) => string };

export type SeoModel = { id: string; raw: string; slug: string; name: string; full: string; brand: string; brandName: string; series: string; device: string; codes: string[]; parts: SeoPart[] };
export type SeoPart = { id: string; slug: string; title: string; name: string; cat: string; catName: string; grade: string; gradeName: string; maker: string; quality: string; price: number; stock: number; img: string; imgBig: string; warranty: string; model: string; modelSlug: string; modelName: string; brandName: string; sample: boolean };

const WARRANTY: Record<string, string> = { OR: '6 months', OL: '3 months', IN: '1 month', AQ: '1 month' };
let memo: { models: SeoModel[]; parts: SeoPart[]; brands: { id: string; name: string; models: SeoModel[] }[] } | null = null;

export function catalog() {
  if (memo) return memo;
  const pub = path.join(process.cwd(), 'public');
  const w: Record<string, unknown> = { SE_FACTS: windowFacts(), console: { warn() {}, log() {} } }; w.window = w; w.document = { addEventListener() {}, documentElement: { lang: 'en', dir: 'ltr', getAttribute: () => 'en', classList: { contains: () => false } }, querySelector: () => null };
  vm.createContext(w);
  for (const f of ['se-catalog.js', 'se-data.js', 'se-shots.js']) { try { vm.runInContext(fs.readFileSync(path.join(pub, f), 'utf8'), w); } catch { /* a missing file only removes photos */ } }
  const D = w.SE_DATA as Data, S = w.SE_SHOTS as Shots | undefined;
  const B = new Map(D.brands.map((b) => [b.id, b])), C = new Map(D.categories.map((c) => [c.id, c.name])), MK = new Map(D.manufacturers.map((m) => [m.id, m.name])), Q = new Map(D.qualities.map((q) => [q.id, q.name]));
  const used = new Set<string>(), uniq = (s: string, alt: string) => { let k = s || alt; if (used.has(k)) k = alt; let n = 2; const b = k; while (used.has(k)) k = b + '-' + n++; used.add(k); return k; };
  // Samsung names carry factory codes ("A546 / A54 5G"): the page uses the friendly name (Galaxy A54 5G) and lists the codes
  const nice = (m: Data['models'][number]) => { if (m.brand_id !== 'samsung') return { name: m.name, codes: m.model_numbers || [] }; const tok = m.name.replace(/[\/()]/g, ' ').split(/\s+/).filter(Boolean).map((t) => (/^[A-Z]{3,}$/.test(t) ? t[0] + t.slice(1).toLowerCase() : t)), code = (t: string) => /^[A-Z]{1,2}\d{3}[A-Z]{0,2}$/.test(t); const keep = tok.filter((t) => !code(t)), codes = tok.filter(code); return { name: 'Galaxy ' + (keep.length ? keep : tok).join(' '), codes: Array.from(new Set([...(m.model_numbers || []), ...codes])) }; };
  const models: SeoModel[] = D.models.map((m0) => { const b = B.get(m0.brand_id), nn = nice(m0), m = { ...m0, name: nn.name, model_numbers: nn.codes }; return { id: m.id, raw: m0.name, slug: '', name: m.name, full: (b && !m.name.toLowerCase().startsWith(b.name.toLowerCase()) && !/^(iphone|ipad|galaxy|redmi|poco|pixel)/i.test(m.name) ? b.name + ' ' : '') + m.name, brand: m.brand_id, brandName: b ? b.name : '', series: m.series, device: m.device, codes: m.model_numbers || [], parts: [] }; });
  // the short slug (/m/galaxy-a54) when it is unique; otherwise the brand is added
  models.forEach((m) => { m.slug = uniq(slug(m.name), slug(m.brandName + ' ' + m.name)); });
  const MM = new Map(models.map((m) => [m.id, m]));
  const pUsed = new Set<string>();
  const parts: SeoPart[] = D.products.filter((p) => p.visible !== false).map((p) => {
    const m = MM.get(p.model_id), pose = S ? S.forCat(p.category, m ? m.brand : 'other', p.manufacturer) : '';
    const gradeName = D.gradeNames[p.grade] || p.grade, title = m && m.raw !== m.name ? p.title.replace(m.raw, m.name) : p.title; let s = slug(title + ' ' + gradeName); if (pUsed.has(s)) s = s + '-' + slug(p.id); pUsed.add(s);
    const sp: SeoPart = { id: p.id, slug: s, title, name: p.part_name, cat: p.category, catName: C.get(p.category) || p.category, grade: p.grade, gradeName, maker: MK.get(p.manufacturer) || p.manufacturer, quality: Q.get(p.quality) || p.quality, price: p.retail_price, stock: p.stock_qty, img: S ? S.url(pose, 480) : '', imgBig: S ? S.url(pose, 960) : '', warranty: WARRANTY[p.grade] || '1 month', model: p.model_id, modelSlug: m ? m.slug : '', modelName: m ? m.full : '', brandName: m ? m.brandName : '', sample: p.sample !== false };
    if (m) m.parts.push(sp); return sp;
  });
  const brands = D.brands.map((b) => ({ id: b.id, name: b.name, models: models.filter((m) => m.brand === b.id) }));
  memo = { models, parts, brands };
  return memo;
}
export const modelBySlug = (s: string) => catalog().models.find((m) => m.slug === s) || null;
export const partBySlug = (s: string) => catalog().parts.find((p) => p.slug === s) || null;
export const abs = (u: string) => (u.startsWith('http') ? u : SITE + (u.startsWith('/') ? u : '/' + u));

export function productLd(p: SeoPart) {
  return {
    '@context': 'https://schema.org', '@type': 'Product', name: p.title + ' · ' + p.gradeName, sku: p.id, mpn: p.id, category: p.catName,
    image: p.imgBig ? [abs(p.imgBig)] : undefined, description: `${p.name} for ${p.modelName}, ${p.gradeName} grade (${p.quality}), made by ${p.maker}. Tested before it ships, ${p.warranty} warranty. Sam Electronics, Deira, Dubai.`,
    brand: { '@type': 'Brand', name: p.brandName || 'Sam Electronics' },
    offers: { '@type': 'Offer', url: abs('/p/' + p.slug), priceCurrency: 'AED', price: p.price.toFixed(2), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', itemCondition: p.grade === 'OL' ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition', seller: { '@type': 'Organization', name: 'Sam Electronics L.L.C' } },
  };
}
export const crumbsLd = (l: [string, string][]) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: l.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(u) })) });
