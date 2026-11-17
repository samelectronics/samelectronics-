// Owner (17 Nov): "I'm not paying for AI. Code him to work without engines or money."
// Samsoom's own brain: no AI service, no key, no cost. It reads the real catalogue and the company facts that are
// already on the page, understands models, parts, grades, countries and days (with typos), remembers what the visitor
// was talking about (the model and the part), and answers with real parts, prices, stock and warranty.
// Anything it cannot answer falls back to the older intent answers (brain.js), then to a friendly "ask the team".
import { products, data, warrantyOf, repairFee, type Product } from '@/lib/catalog';
import { shopStatus } from '@/lib/shopStatus';
import { fallbackAnswer } from './brain';

export type Answer = { t: string; act?: string; emote?: string; parts?: string[] } | null;
type Ctx = { history: string[]; tr: (s: string) => string };

const N = (s: string) => ' ' + s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9؀-ۿ]+/g, ' ').trim() + ' ';
const VOCAB = ['iphone', 'galaxy', 'samsung', 'xiaomi', 'redmi', 'huawei', 'screen', 'battery', 'camera', 'charging', 'repair', 'original', 'incell', 'difference', 'shipping', 'warranty', 'cheapest', 'friday', 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'tomorrow', 'display', 'cover', 'frame', 'speaker'];
function lev(a: string, b: string) { const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
/** fixes small typos word by word (iphon → iphone, scren → screen, batery → battery) */
const AR: [RegExp, string][] = [[/ (ايفون|آيفون|أيفون|ايفن) /g, ' iphone '], [/ (سامسونج|سامسونغ|جالكسي|جالاكسي|غالاكسي) /g, ' galaxy '], [/ (شاومي|شياومي) /g, ' xiaomi '], [/ (ريدمي|ردمي) /g, ' redmi '], [/ (هواوي) /g, ' huawei '], [/ (نوت) /g, ' note '], [/ (برو) /g, ' pro '], [/ (ماكس) /g, ' max '], [/ (الترا) /g, ' ultra ']];
const arab = (n: string) => AR.reduce((x, [r, v]) => x.replace(r, v).replace(r, v), n);
const typo = (n0: string) => { const n = arab(n0); return ' ' + n.trim().split(' ').map((w) => (w.length < 4 || /\d/.test(w) || VOCAB.includes(w) ? w : VOCAB.find((v) => v[0] === w[0] && lev(w, v) <= (v.length > 6 ? 2 : 1)) || w)).join(' ') + ' '; };
const has = (n: string, words: string[]) => words.some((w) => n.includes(' ' + w + ' ') || (w.length > 4 && n.includes(w)));
const aed = (n: number) => 'AED ' + Math.round(n).toLocaleString('en-US');

const CAT: Record<string, string[]> = {
  SCR: ['screen', 'screens', 'display', 'lcd', 'oled', 'glass', 'touch', 'شاشه', 'شاشة', 'شاشات'],
  BAT: ['battery', 'batteries', 'batt', 'بطاريه', 'بطارية', 'بطاريات'],
  FLX: ['flex', 'charging', 'port', 'charger', 'connector', 'شحن', 'فليكس'],
  BCV: ['back', 'cover', 'housing glass', 'backglass', 'غطاء', 'ظهر'],
  FRM: ['frame', 'housing', 'chassis', 'هيكل', 'اطار'],
  CAM: ['camera', 'cam', 'lens', 'كاميرا', 'كاميره'],
  SML: ['speaker', 'mic', 'microphone', 'sim', 'button', 'vibrator', 'earpiece', 'سماعه', 'مايك'],
};
const GRADE: Record<string, string[]> = { OR: ['original', 'service pack', 'genuine', 'اصلي'], OL: ['oled', 'soft oled'], IN: ['incell', 'in cell'], AQ: ['aaa', 'copy', 'cheap'] };
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

type Model = { id: string; name: string; brand_id: string; series: string };
let aliasCache: { len: number; list: [string, Model][] } | null = null;
function aliases(): [string, Model][] {
  const d = data(); if (!d) return [];
  if (aliasCache && aliasCache.len === d.models.length) return aliasCache.list;
  const out: [string, Model][] = [];
  for (const m of d.models as Model[]) {
    const n = N(m.name).trim(); out.push([n, m]);
    // "Galaxy A54" → "a54", "Redmi Note 12" stays (series words that are not enough on their own are kept)
    const short = n.replace(/^(galaxy|apple|samsung|xiaomi|google|huawei|honor|oppo|vivo|realme|tecno|infinix|nokia|oneplus)\s+/, '');
    if (short !== n && /^[a-z]/.test(short) && (/\d/.test(short) || short.length > 4)) out.push([short, m]); // never "13 pro" alone (iPhone vs Xiaomi)
    const base = N(m.name.replace(/\([^)]*\)/g, ' ')).trim(); // "S23 (S911 5G)" → "s23", "Redmi Note 12 (4G)" → "redmi note 12"
    if (base && base !== n) { out.push([base, m]); if (m.brand_id === 'samsung' && /^[a-z]\d/.test(base)) out.push(['galaxy ' + base, m]); const nb = base.replace(/^(redmi|poco|galaxy)\s+/, ''); if (nb !== base && /^[a-z]/.test(nb)) out.push([nb, m]); }
    const par = (m.name.match(/\(([^)]+)\)/) || [])[1]; // "A546 (A54 5G)" → "a54 5g", "a54"
    if (par) { const pn = N(par).trim(); out.push([pn, m]); const p2 = pn.replace(/\s*[45]g$/, ''); if (p2 !== pn && /^[a-z]/.test(p2)) { out.push([p2, m]); out.push(['galaxy ' + p2, m]); } }
    const ns = n.replace(/\s+/g, ''); if (ns !== n && /\d/.test(ns)) out.push([ns, m]); // "iphone13pro"
  }
  out.sort((a, b) => b[0].length - a[0].length);
  aliasCache = { len: d.models.length, list: out };
  return out;
}
function findModel(n: string): Model | null {
  const flat = n.replace(/\s+/g, '');
  for (const [a, m] of aliases()) if (n.includes(' ' + a + ' ') || (a.length > 5 && !a.includes(' ') && flat.includes(a))) return m;
  return null;
}
const findCat = (n: string) => Object.keys(CAT).find((k) => has(n, CAT[k])) || null;
const findGrade = (n: string) => Object.keys(GRADE).find((k) => has(n, GRADE[k])) || null;
function findCountry(n: string) {
  const d = data() as unknown as { countries?: { name: string; geo: string; region: string }[]; regions?: { id: string; name: string }[] } | null;
  const c = (d?.countries || []).find((x) => n.includes(' ' + N(x.name).trim() + ' ') || n.includes(' ' + N(x.geo).trim() + ' '));
  return c ? { name: c.name, region: (d?.regions || []).find((r) => r.id === c.region)?.name || '' } : null;
}

/** what the visitor said earlier (the last model / part they mentioned) */
function memory(history: string[]) {
  let model: Model | null = null, cat: string | null = null;
  for (const h of history) { const n = typo(N(h)); model = findModel(n) || model; cat = findCat(n) || cat; }
  return { model, cat };
}

export function think(q: string, ctx: Ctx): Answer {
  const T = ctx.tr, raw = q.trim(); if (!raw) return null;
  const W = (w: string) => String(w).replace(/months?/i, T('months'));
  const n = typo(N(raw)), mem = memory(ctx.history);
  const d = data(); if (!d) return null;
  let model = findModel(n), cat = findCat(n);
  const grade = findGrade(n), refers = has(n, ['it', 'that', 'this', 'one', 'same', 'هذا', 'هاد']) || /^\s*(and|what about|how about|و)\b/.test(raw.toLowerCase());
  if (!model && (cat || grade || refers || has(n, ['price', 'how much', 'cost', 'stock', 'warranty', 'repair', 'fix']))) model = mem.model;
  if (!cat && model && (grade || refers || has(n, ['price', 'how much', 'cost', 'cheapest', 'warranty']))) cat = mem.cat;
  const want = (k: string[]) => has(n, k);

  // order tracking
  if (/\bse[- ]?\d{3,}/i.test(raw) || want(['my order', 'track', 'tracking', 'طلبي'])) return { t: T('You can follow every order, step by step, in My Bench → Orders. Sign in with the e-mail you ordered with; the team also updates you on WhatsApp.'), act: 'whatsapp', emote: 'parcel' };

  // who is Samsoom / small talk
  if (want(['who are you', 'your name', 'are you a robot', 'are you ai', 'are you real', 'مين انت', 'من انت'])) return { t: T('I’m Samsoom, the Sam Electronics phone! I know every part in our shop, the grades, the prices, our hours and where we ship. For anything I can’t do, I’ll pass you to a real person.'), emote: 'wave' };
  if (want(['joke', 'funny', 'نكته', 'نكتة'])) return { t: T('Why did the phone wear glasses? It lost its contacts. 📱 Now, can I find you a part?'), emote: 'happy' };
  if (want(['owner', 'founder', 'who owns', 'boss', 'manager', 'صاحب'])) return { t: T('Sam Electronics is a family business, run by the same management since 2003, first as Syria Tell, on the same street in Deira.'), act: 'story', emote: 'happy' };
  if (want(['madrid', 'spain', 'europe branch', 'اسبانيا', 'مدريد'])) return { t: T('Our second branch is coming to Plaza Mayor in Madrid. The opening date will be announced on the website and our channels.'), act: 'story', emote: 'globe' };
  if (want(['since when', 'how long', 'how old', 'history', 'established', 'founded'])) return { t: T('We have been in Deira since 2003, first as Syria Tell. Same family, same street.'), act: 'story', emote: 'happy' };

  // grades: explain or compare
  if (want(['difference', 'compare', 'vs', 'versus', 'better', 'which grade', 'what is oled', 'what is incell', 'الفرق', 'افضل']) && (grade || want(['grade', 'grades', 'oled', 'incell', 'original', 'aaa']))) {
    const lines = ((d as unknown as { grades: { code: string; name: string; maker: string; desc: string }[] }).grades || []).map((g) => '• ' + g.name + ' (' + g.maker + '): ' + T(g.desc) + ' · ' + T('warranty') + ' ' + W(warrantyOf(g.code)));
    return { t: T('Four grades, from best to most affordable:') + '\n' + lines.join('\n') + '\n' + T('Tell me your model and I’ll show you the price of each grade.'), act: 'models', emote: 'part' };
  }

  const P = products();
  // a model (with or without a part)
  if (model) {
    const forModel = P.filter((p) => p.model_id === model!.id);
    const repair = want(['repair', 'fix', 'fitting', 'fitted', 'install', 'broken', 'cracked', 'تصليح', 'تركيب', 'مكسور']);
    if (!forModel.length) return { t: T('We have') + ' ' + model.name + ' ' + T('on our list, but no parts are online for it yet. The team can check the shelf for you on WhatsApp.'), act: 'whatsapp', emote: 'think' };
    if (!cat) {
      const byCat = new Map<string, Product[]>(); forModel.forEach((p) => { const l = byCat.get(p.category) || []; l.push(p); byCat.set(p.category, l); });
      const lines = [...byCat.entries()].map(([, l]) => '• ' + T(l[0].catName) + ': ' + T('from') + ' ' + aed(Math.min(...l.map((x) => x.price))) + ' (' + l.length + ' ' + (l.length > 1 ? T('grades') : T('grade')) + ')');
      return { t: model.name + ' · ' + T('here is what we have') + ':\n' + lines.join('\n') + '\n' + T('Which part do you need?'), act: 'fmp', emote: 'found' };
    }
    let list = forModel.filter((p) => p.category === cat);
    if (!list.length) return { t: T('No') + ' ' + (CAT[cat] ? cat.toLowerCase() : '') + ' ' + T('for') + ' ' + model.name + ' ' + T('online yet. The team can check the shelf for you on WhatsApp.'), act: 'whatsapp', emote: 'think' };
    if (grade) { const g = list.filter((p) => p.grade === grade); if (g.length) list = g; }
    list = list.sort((a, b) => b.price - a.price);
    if (want(['cheapest', 'cheap', 'lowest', 'budget', 'ارخص'])) list = [...list].sort((a, b) => a.price - b.price).slice(0, 1);
    const fee = (p: Product) => repairFee(p.price);
    const rep = (d as unknown as { repairs?: { cat: string; time: string }[] }).repairs?.find((r) => r.cat === cat);
    const lines = list.map((p) => '• ' + p.gradeName + ' (' + p.makerName + '): ' + aed(p.price) + (repair ? ' + ' + T('fitting') + ' ' + aed(fee(p)) + ' = ' + aed(p.price + fee(p)) : '') + ' · ' + (p.stock_qty > 0 ? T('in stock') : T('ask us')) + ' · ' + T('warranty') + ' ' + W(p.warranty));
    const head = T(list[0].catName) + ' ' + model.name + (repair ? ' · ' + T('fitted in Deira') + (rep ? ' (' + rep.time + ')' : '') : '');
    return { t: head + ':\n' + lines.join('\n') + '\n' + T('Prices are samples until the team confirms them.'), parts: list.slice(0, 4).map((p) => p.id), act: repair ? 'repair' : 'fmp', emote: repair ? 'tool' : 'found' };
  }
  // a part but no model yet
  if (cat && !want(['ship', 'shipping', 'deliver'])) {
    const c = (d.categories as { id: string; name: string }[]).find((x) => x.id === cat);
    const top = [...new Set(P.filter((p) => p.category === cat && p.stock_qty > 0).map((p) => p.modelName))].slice(0, 4);
    return { t: T('Which phone is it for?') + ' ' + T('Popular') + ' ' + (c?.name || '').toLowerCase() + ': ' + top.join(', ') + '.', act: 'fmp', emote: 'think' };
  }
  // shipping to a country
  const country = findCountry(n);
  if (country || want(['ship', 'shipping', 'deliver', 'delivery', 'شحن', 'توصيل'])) {
    if (country) return { t: T('Yes, we ship to') + ' ' + country.name + (country.region ? ' (' + T(country.region) + ')' : '') + '. ' + T('Packed in Deira, tracked to your door; the shipping cost is quoted with your order.'), act: 'network', emote: 'globe' };
  }
  // hours on a given day
  const day = DAYS.findIndex((x) => n.includes(' ' + x + ' ')), tmr = want(['tomorrow', 'بكره', 'بكرا', 'غدا']);
  if (day >= 0 || (tmr && want(['open', 'close', 'hours', 'time', 'دوام', 'مفتوح']))) {
    const H = (d as unknown as { hours: Record<number, [number, number][]> }).hours || {}, di = day >= 0 ? day : (new Date(Date.now() + 4 * 36e5).getUTCDay() + 1) % 7;
    const hm = (x: number) => String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');
    const sh = (H[di] || []).map(([a, b]) => hm(a) + '–' + hm(b)).join(' ' + T('and') + ' ');
    const name = T(DAYS[di][0].toUpperCase() + DAYS[di].slice(1));
    return { t: sh ? name + ': ' + T('open') + ' ' + sh + ' ' + T('(Dubai time).') : name + ': ' + T('closed.'), act: 'visit', emote: 'clock' };
  }
  // everything else: the intent answers
  const H = shopStatus((d as unknown as { hours: Record<number, [number, number][]> }).hours, Date.now()) as { short: string; open: boolean };
  const fb = fallbackAnswer(raw, { D: d, H, tr: T });
  return fb ? { t: fb.t, act: fb.act || undefined, emote: fb.emote } : null;
}
