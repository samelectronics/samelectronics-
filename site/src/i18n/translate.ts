/**
 * English → Arabic for one piece of text, using src/i18n/ar.ts.
 * Order: exact text → patterns (numbers, prices, times, models) → pieces joined by " · " → unchanged.
 * Leading/trailing spaces are kept so text that sits next to other text still reads correctly.
 */
import { DAYS, ENGINE, EXACT, GRADES, PARTS, PLACES, TIERS } from './ar';

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const DICT: Record<string, string> = { ...ENGINE, ...EXACT, ...PLACES };

const MODEL_RE =
  /^(?:iPhone|Galaxy|Redmi|POCO|Pixel|Realme|Oppo|Vivo|Huawei|Honor|Xperia|Tecno|Infinix|Xiaomi|SM-|S\d{2}|A\d{2,4}|Note|Magic|Camon|Spark|Nova|P\d{2})/;
const partAr = (p: string) => PARTS[p.toLowerCase()];
const PART_ALT = Object.keys(PARTS)
  .sort((a, b) => b.length - a.length)
  .map((p) => p.replace(/ /g, ' '))
  .join('|');
const gradeAr = (g: string) => GRADES[g] || g;
const placeAr = (p: string) => PLACES[p] || p;
const num = (s: string) => s; // digits stay Western, as on UAE price tags

type Rule = [RegExp, (...m: string[]) => string];

const RULES: Rule[] = [
  // stock, counts
  [/^([\d,.]+k?) in stock$/i, (_, n) => `${num(n)} متوفر`],
  [/^Only (\d+) left$/i, (_, n) => `بقي ${n} فقط`],
  [/^Only (\d+)$/i, (_, n) => `فقط ${n}`],
  [/^(\d+) searches$/, (_, n) => `${n} عملية بحث`],
  [/^([\d,]+) (models?|parts?|listings|boxes|events today|cartons?)$/i, (_, n, w) => `${n} ${({ model: 'موديل', models: 'موديل', part: 'قطعة', parts: 'قطعة', listings: 'إعلان', boxes: 'صندوق', 'events today': 'حدث اليوم', carton: 'كرتونة', cartons: 'كرتونة' } as Record<string, string>)[w.toLowerCase()]}`],
  [/^(\d+) GRADES?$/, (_, n) => `${n} ${n === '1' ? 'درجة' : 'درجات'}`],
  [/^(\d+) DESTINATIONS$/, (_, n) => `${n} وجهة`],
  [/^(\d+) LAYERS · EVERY MAJOR BRAND$/, (_, n) => `${n} طبقات · كل الماركات الرئيسية`],
  [/^([\d,]+) parts in stock · ([\d,]+) listings · sample data$/, (_, a, b) => `${a} قطعة متوفرة · ${b} إعلان · بيانات تجريبية`],
  [/^Search ([\d,]+)\+ parts$/, (_, n) => `ابحث في أكثر من ${n} قطعة`],
  [/^(\d+) \/ 4 passed$/, (_, n) => `${n} / 4 ناجح`],
  // prices
  [/^AED ([\d,]+(?:[–-][\d,]+)?)( · sample)?$/, (_, n, s) => `${n} درهم${s ? ' · عيّنة' : ''}`],
  [/^From AED ([\d,]+)$/, (_, n) => `ابتداءً من ${n} درهم`],
  [/^from AED ([\d,]+)$/, (_, n) => `من ${n} درهم`],
  [/^AED ([\d,]+) \(sample\)$/, (_, n) => `${n} درهم (عيّنة)`],
  // times and hours
  [/^(\d+)d (\d+)h (\d+)m$/, (_, d, h, m) => `${d}ي ${h}س ${m}د`],
  [/^(\d+)h (\d+)m$/, (_, h, m) => `${h}س ${m}د`],
  [/^(\d+) H AGO$/i, (_, n) => `قبل ${n} ساعة`],
  [/^(\d+) d ago$/i, (_, n) => `قبل ${n} يوم`],
  [/^(\d+)[–-](\d+) min$/, (_, a, b) => `${a}–${b} دقيقة`],
  [/^(\d+)[–-](\d+) hrs$/, (_, a, b) => `${a}–${b} ساعة`],
  [/^Open · closes (\d\d:\d\d)$/, (_, t) => `مفتوح · يغلق ${t}`],
  [/^Open now · closes (\d\d:\d\d)$/, (_, t) => `مفتوح الآن · يغلق ${t}`],
  [/^Closed · opens (\d\d:\d\d)$/, (_, t) => `مغلق · يفتح ${t}`],
  [/^Closed · opens tomorrow (\d\d:\d\d)$/, (_, t) => `مغلق · يفتح غداً ${t}`],
  [/^Closed · opens (Mon|Sat|Sun|Tue|Wed|Thu|Fri) (\d\d:\d\d)$/, (_, d, t) => `مغلق · يفتح ${DAYS[d]} ${t}`],
  [/^Closed now · opens (\d\d:\d\d) today$/, (_, t) => `مغلق الآن · يفتح اليوم ${t}`],
  [/^Closed now · opens tomorrow (\d\d:\d\d)$/, (_, t) => `مغلق الآن · يفتح غداً ${t}`],
  [/^Closed now · opens (Mon|Sat|Sun|Tue|Wed|Thu|Fri) (\d\d:\d\d)$/, (_, d, t) => `مغلق الآن · يفتح ${DAYS[d]} ${t}`],
  [/^Opens tomorrow (\d\d:\d\d)$/, (_, t) => `يفتح غداً ${t}`],
  [/^Opens (\d\d:\d\d)$/, (_, t) => `يفتح ${t}`],
  [/^Open till (\d\d:\d\d)$/, (_, t) => `مفتوح حتى ${t}`],
  [/^Closes in (.+)$/, (_, t) => `يغلق خلال ${tr(t)}`],
  [/^Opens in (.+)$/, (_, t) => `يفتح خلال ${tr(t)}`],
  [/^(\d{4})[–-]today$/, (_, y) => `${y}–اليوم`],
  // steps, checks, labels with numbers
  [/^CHECK (\d) \/ (\d)$/, (_, a, b) => `فحص ${a} / ${b}`],
  [/^CHECK (\d) OF (\d)$/, (_, a, b) => `فحص ${a} من ${b}`],
  [/^LANE (\d+)$/, (_, n) => `المسار ${n}`],
  [/^BRANCH (\d+)$/, (_, n) => `الفرع ${n}`],
  [/^LOADING UNIT #(\d+)$/, (_, n) => `وحدة التحميل #${n}`],
  [/^(\d) · (Brand|Model|Problem|Grade)$/, (_, n, w) => `${n} · ${DICT[w]}`],
  [/^(\d\d) (Intake|Heat|Open|Swap|Boot|Tested)$/, (_, n, w) => `${n} ${DICT[w] || w}`],
  [/^Stacking (\d+) cartons…$/, (_, n) => `جارٍ رصّ ${n} كراتين…`],
  [/^You · (\d+%)$/, (_, p) => `أنت · ${p}`],
  [/^You: (.+) · (\d+%)$/, (_, t, p) => `أنت: ${TIERS[t] || t} · ${p}`],
  [/^→ (\d+%) to (.+)$/, (_, p, t) => `← ${p} حتى ${TIERS[t] || t}`],
  [/^(\d+%) pixels$/, (_, p) => `${p} بكسل`],
  [/^This week: (.+) on (.+)$/, (_, d, w) => `هذا الأسبوع: ${d} على ${partAr(w) || tr(w)}`],
  [/^Just landed: (.+)$/, (_, x) => `وصل للتو: ${tr(x)}`],
  [/^(.+) back in stock$/, (_, x) => `${tr(x)} عادت للمخزون`],
  [/^Screens & batteries · ([\d,]+) parts$/, (_, n) => `شاشات وبطاريات · ${n} قطعة`],
  [/^Yes\. Original grade, in stock in Deira · AED ([\d,]+) \(sample\)\. Want me to add it to your cart\?$/, (_, n) => `نعم. درجة أصلية، متوفرة في ديرة · ${n} درهم (عيّنة). هل أضيفها إلى سلتك؟`],
  [/^We have no (.+) part in stock for that right now\. I can ask the team on WhatsApp\.$/, (_, x) => `لا تتوفر لدينا قطعة ${tr(x)} لهذا الآن. يمكنني سؤال الفريق على واتساب.`],
  [/^([\d,]+) results · sample data$/, (_, n) => `${n} نتيجة · بيانات تجريبية`],
  [/^([\d,]+) models · all parts$/, (_, n) => `${n} موديل · كل القطع`],
  [/^Apple · Samsung · Xiaomi · \+(\d+)$/, (_, n) => `Apple · Samsung · Xiaomi · +${n}`],
  [/^T0(\d) · (.+)$/, (_, n, x) => `T0${n} · ${tr(x)}`],
  [/^T05 · LEADING SINCE (\d{4})$/, (_, y) => `T05 · يقود منذ ${y}`],
  [/^SINCE (\d{4})$/i, (_, y) => `منذ ${y}`],
  [/^Trusted since (\d{4})$/, (_, y) => `موثوقون منذ ${y}`],
  [/^(\d+) years with us$/, (_, n) => `${n} سنة معنا`],
  [/^(\d\d) \/ (\d\d) · (.+)$/, (_, a, b, x) => `${a} / ${b} · ${tr(x)}`],
  // products: "<model> <part>[ · <grade>]" → "<part> <model>[ · <grade>]"
  [
    new RegExp(`^(.+?) (${PART_ALT})(?: · (Original|Service Pack|OLED|Incell|High Copy))?$`, 'i'),
    (all, model, part, grade) => (MODEL_RE.test(model) ? `${partAr(part)} ${model}${grade ? ' · ' + gradeAr(grade) : ''}` : all),
  ],
  // ships, codes and places joined with a dot
  [/^(Repair shop|Trader|Exporter|Shop|Distributor) · (.+)$/, (_, w, p) => `${DICT[w] || w} · ${placeAr(p)}`],
  [/^Off to dispatch · (.+)$/, (_, p) => `إلى الإرسال · ${placeAr(p)}`],
  [/^(.+), (.+)$/, (all, c, k) => (PLACES[c] && PLACES[k] ? `${PLACES[c]}، ${PLACES[k]}` : all)],
  [/^DXB → (.+)$/, (_, p) => `DXB ← ${placeAr(p.charAt(0) + p.slice(1).toLowerCase())}`],
];

const KEEP = /^(?:[A-Z]{1,4}-?[\dA-Z]{2,}(?:-[\dA-Z]+)*|v\d\.\d|[\d\s.,:%+°K×x/–-]+|[\w.+-]+@[\w.-]+|@[\w.]+|https?:\/\/\S+|se:\/\/\S+)$/;

const cache = new Map<string, string>();

/** Translate one string to Arabic. Returns the input when there is no translation. */
export function tr(input: string): string {
  if (!input || !/[A-Za-z→]/.test(input)) return input;
  const hit = cache.get(input);
  if (hit !== undefined) return hit;
  const lead = input.match(/^\s*/)![0];
  const trail = input.match(/\s*$/)![0];
  const s = norm(input);
  let out = translateCore(s);
  out = out == null ? input : lead + out + trail;
  if (cache.size > 5000) cache.clear();
  cache.set(input, out);
  return out;
}

function translateCore(s: string): string | null {
  if (DICT[s] !== undefined) return DICT[s];
  if (KEEP.test(s)) return s;
  for (const [re, fn] of RULES) {
    const m = s.match(re);
    if (m) {
      const r = fn(...(m as unknown as string[]));
      if (r !== m[0]) return r;
    }
  }
  // "A · B · C": translate each piece
  if (s.includes(' · ')) {
    const parts = s.split(' · ');
    const t = parts.map((p) => translateCore(p) ?? p);
    if (t.some((x, i) => x !== parts[i])) return t.join(' · ');
  }
  // trailing dot/colon/ellipsis variants
  const m = s.match(/^(.*?)([.:…!?])$/);
  if (m && DICT[m[1]] !== undefined) return DICT[m[1]] + m[2];
  if (s.endsWith(' ·') && DICT[s.slice(0, -2)] !== undefined) return DICT[s.slice(0, -2)] + ' ·';
  return null;
}

/**
 * In Arabic, keep numbers that contain separators (times "10:30–14:00", phones "+971 4 273 3031", prices,
 * codes "SE-4544") in left-to-right order: wrap each run in Unicode isolates (LRI … PDI) so the bidi
 * algorithm cannot reorder its parts.
 */
const NUM_RUN = /[A-Z]{1,4}-\d[\dA-Z-]*|\+?\d[\d,.:]*(?:(?:\s?[–\-\/×:]\s?|\s)\+?\d[\d,.:]*)+/g;
export function isolateNumbers(s: string): string {
  if (!/\d/.test(s)) return s;
  return s.replace(NUM_RUN, (m) => '\u2066' + m + '\u2069');
}

/** True when a text still contains Latin words that should have been translated (used by the coverage check). */
export function looksUntranslated(s: string): boolean {
  const t = norm(s);
  if (!/[A-Za-z]{2}/.test(t) || KEEP.test(t)) return false;
  // allowed Latin: brands, models, units, codes, product grades kept in Latin
  const rest = t
    .replace(/\b(?:Apple|Samsung|SAMSUNG|Xiaomi|Redmi|POCO|Realme|realme|Oppo|oppo|Vivo|vivo|Huawei|HUAWEI|Honor|HONOR|Google|Sony|SONY|Tecno|TECNO|Infinix|OnePlus|Nokia|Motorola|iPhone|iPad|Galaxy|Pixel|Xperia|Camon|Spark|Note|Pro|Max|Ultra|Plus|Mini|Magic\d*|Nova|Reno|OLED|LCD|AED|mAh|DXB|GST|UAE|QR|ID|Face|True|Tone|Ctrl|EN|K|V|W|WhatsApp|Instagram|TikTok|Facebook|Google|Plus Code|SE|IP\d+\w*|Li-ion|GX)\b/g, '')
    .replace(/[A-Z]{1,4}-?[\dA-Z]{2,}(?:-[\dA-Z]+)*/g, '')
    .replace(/[\w.+-]+@[\w.-]+|@[\w.]+|https?:\/\/\S+/g, '');
  return /[A-Za-z]{2}/.test(rest);
}
