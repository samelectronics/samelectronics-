/**
 * Spanish, French and Persian (R7-G). The same approach as the Arabic translator (src/i18n/translate.ts), with one
 * dictionary per language (es.ts, fr.ts, fa.ts, loaded only when picked):
 *   exact text → patterns (hours, stock, prices, "<model> <part>") → pieces joined by " · " → unchanged.
 * Brand and model names, codes and AED prices stay as they are, the way shops write them.
 */
import { PARTS } from './ar';

export type Other = 'es' | 'fr' | 'fa';
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const dicts: Partial<Record<Other, Record<string, string>>> = {};
const caches: Partial<Record<Other, Map<string, string>>> = {};

/** Load a language's dictionary (once). */
export async function loadDict(l: Other) {
  if (dicts[l]) return;
  const m = l === 'es' ? await import('./es') : l === 'fr' ? await import('./fr') : await import('./fa');
  dicts[l] = m.default;
  caches[l] = new Map();
}
export const hasDict = (l: Other) => !!dicts[l];

// the words the patterns need, per language
type W = { closesIn: string; opensIn: string; openUntil: string; openNowUntil: string; closingSoon: string; openingSoon: string; closedOpens: string; closedOpensTomorrow: string; closedNowOpensToday: string; opensTomorrow: string; opens: string; closes: string; inStock: string; only: string; left: string; from: string; h: string; m: string; d: string; min: string; hrs: string; days: string; ago: (n: string, u: 'h' | 'd') => string; partFirst: boolean };
const WORDS: Record<Other, W> = {
  es: { closesIn: 'Cierra en', opensIn: 'Abre en', openUntil: 'Abierto · hasta', openNowUntil: 'Abierto ahora · hasta', closingSoon: 'Cierra pronto ·', openingSoon: 'Abre pronto ·', closedOpens: 'Cerrado · abre', closedOpensTomorrow: 'Cerrado · abre mañana', closedNowOpensToday: 'Cerrado ahora · abre hoy a las', opensTomorrow: 'Abre mañana', opens: 'Abre', closes: 'Cierra a las', inStock: 'en stock', only: 'Solo', left: 'quedan', from: 'Desde', h: 'h', m: 'min', d: 'd', min: 'min', hrs: 'h', days: 'días', ago: (n, u) => `hace ${n} ${u === 'h' ? 'h' : 'días'}`, partFirst: true },
  fr: { closesIn: 'Ferme dans', opensIn: 'Ouvre dans', openUntil: 'Ouvert · jusqu’à', openNowUntil: 'Ouvert · jusqu’à', closingSoon: 'Ferme bientôt ·', openingSoon: 'Ouvre bientôt ·', closedOpens: 'Fermé · ouvre à', closedOpensTomorrow: 'Fermé · ouvre demain à', closedNowOpensToday: 'Fermé · ouvre aujourd’hui à', opensTomorrow: 'Ouvre demain à', opens: 'Ouvre à', closes: 'Ferme à', inStock: 'en stock', only: 'Plus que', left: 'restants', from: 'Dès', h: 'h', m: 'min', d: 'j', min: 'min', hrs: 'h', days: 'jours', ago: (n, u) => `il y a ${n} ${u === 'h' ? 'h' : 'j'}`, partFirst: true },
  fa: { closesIn: 'بسته می‌شود تا', opensIn: 'باز می‌شود تا', openUntil: 'باز · تا', openNowUntil: 'اکنون باز · تا', closingSoon: 'به‌زودی بسته می‌شود ·', openingSoon: 'به‌زودی باز می‌شود ·', closedOpens: 'بسته · باز می‌شود', closedOpensTomorrow: 'بسته · فردا باز می‌شود', closedNowOpensToday: 'اکنون بسته · امروز باز می‌شود', opensTomorrow: 'فردا باز می‌شود', opens: 'باز می‌شود', closes: 'بسته می‌شود', inStock: 'موجود', only: 'فقط', left: 'باقی مانده', from: 'از', h: 'ساعت', m: 'دقیقه', d: 'روز', min: 'دقیقه', hrs: 'ساعت', days: 'روز', ago: (n, u) => `${n} ${u === 'h' ? 'ساعت' : 'روز'} پیش`, partFirst: true },
};

const MODEL_RE = /^(?:iPhone|iPad|Apple Watch|Galaxy|Redmi|POCO|Poco|Pixel|Google|Realme|Oppo|OPPO|RENO|Reno|Vivo|Huawei|Honor|OnePlus|Nokia|Tecno|Infinix|Xiaomi|Mi |SM-|S\d{2}|A\d{2,4}|M\d{3}|J\d|Z |F\d{3}|Note|Magic|Camon|Spark|Nova|P\d{2})/;
const PART_ALT = Object.keys(PARTS).sort((a, b) => b.length - a.length).join('|');
const PRODUCT = new RegExp(`^(.+?) (${PART_ALT})(?: · (Original|Service Pack|OLED Soft|OLED|Incell|AAA))?$`, 'i');
const KEEP = /^(?:[A-Z]{1,4}-?[\dA-Z]{2,}(?:-[\dA-Z]+)*|v\d\.\d|[\d\s.,:%+°K×x/–-]+|[\w.+-]+@[\w.-]+|@[\w.]+|https?:\/\/\S+|se:\/\/\S+)$/;

function core(l: Other, s: string): string | null {
  const D = dicts[l]!, w = WORDS[l], T = (x: string) => core(l, x) ?? x;
  if (D[s] !== undefined) return D[s];
  if (KEEP.test(s)) return s;
  let m: RegExpMatchArray | null;
  const day = (d: string) => D[d] || d;
  // the hours pill and the clocks
  if ((m = s.match(/^Closes in (.+)$/))) return `${w.closesIn} ${T(m[1])}`;
  if ((m = s.match(/^Opens in (.+)$/))) return `${w.opensIn} ${T(m[1])}`;
  if ((m = s.match(/^Closes at (\d\d:\d\d)$/))) return `${w.closes} ${m[1]}`;
  if ((m = s.match(/^Opens at (\d\d:\d\d)$/)) || (m = s.match(/^Opens (\d\d:\d\d)$/))) return `${w.opens} ${m[1]}`;
  if ((m = s.match(/^Open(?: now)? · (?:until|closes) (\d\d:\d\d)$/))) return `${s.includes('now') ? w.openNowUntil : w.openUntil} ${m[1]}`;
  if ((m = s.match(/^Open till (\d\d:\d\d)$/))) return `${w.openUntil} ${m[1]}`;
  if ((m = s.match(/^Closing soon · (\d\d:\d\d)$/))) return `${w.closingSoon} ${m[1]}`;
  if ((m = s.match(/^Opening soon · (\d\d:\d\d)$/))) return `${w.openingSoon} ${m[1]}`;
  if ((m = s.match(/^Closed(?: now)? · opens tomorrow (\d\d:\d\d)$/))) return `${w.closedOpensTomorrow} ${m[1]}`;
  if ((m = s.match(/^Closed now · opens (\d\d:\d\d) today$/))) return `${w.closedNowOpensToday} ${m[1]}`;
  if ((m = s.match(/^Closed(?: now)? · opens (Mon|Tue|Wed|Thu|Fri|Sat|Sun) (\d\d:\d\d)$/))) return `${w.closedOpens} ${day(m[1])} ${m[2]}`;
  if ((m = s.match(/^Closed(?: now)? · opens (\d\d:\d\d)$/))) return `${w.closedOpens} ${m[1]}`;
  if ((m = s.match(/^Opens tomorrow (\d\d:\d\d)$/))) return `${w.opensTomorrow} ${m[1]}`;
  if ((m = s.match(/^(\d+)d (\d+)h (\d+)m$/))) return `${m[1]}${w.d} ${m[2]}${w.h} ${m[3]}${w.m}`.replace(/(\d)([^\d\s])/g, l === 'fa' ? '$1 $2' : '$1$2');
  if ((m = s.match(/^(\d+)h (\d+)m$/))) return l === 'fa' ? `${m[1]} ساعت ${m[2]} دقیقه` : `${m[1]} h ${m[2]} min`;
  if ((m = s.match(/^(\d+)m$/))) return `${m[1]} ${w.m}`;
  if ((m = s.match(/^(\d+) H AGO$/i))) return w.ago(m[1], 'h');
  if ((m = s.match(/^(\d+) d ago$/i))) return w.ago(m[1], 'd');
  if ((m = s.match(/^(\d+)[–-](\d+) (min|hrs|days)$/))) return `${m[1]}–${m[2]} ${m[3] === 'min' ? w.min : m[3] === 'hrs' ? w.hrs : w.days}`;
  // stock and prices
  if ((m = s.match(/^([\d,.]+k?) in stock$/i))) return `${m[1]} ${w.inStock}`;
  if ((m = s.match(/^Only (\d+) left$/i))) return l === 'fa' ? `فقط ${m[1]} عدد باقی مانده` : `${w.only} ${m[1]} ${w.left}`;
  if ((m = s.match(/^From AED ([\d,]+)$/i))) return `${w.from} AED ${m[1]}`;
  if ((m = s.match(/^AED ([\d,]+(?:[–-][\d,]+)?)( · sample)?$/))) return `AED ${m[1]}${m[2] ? ' · ' + T('sample') : ''}`;
  if ((m = s.match(/^SINCE (\d{4})$/i))) return `${T('SINCE')} ${m[1]}`;
  if ((m = s.match(/^Trusted since (\d{4})$/))) return D['Trusted since 2003'] ? D['Trusted since 2003'].replace('2003', m[1]) : null;
  if ((m = s.match(/^([\d,]+) (models?|parts?|results|countries|brands)$/i))) return `${m[1]} ${T(m[2].toLowerCase().replace(/^(model|part)$/, '$1s'))}`;
  if ((m = s.match(/^(\d+) years with us$/))) return `${m[1]} ${T('years with us')}`;
  if ((m = s.match(/^Just landed: (.+)$/))) return `${T('Just landed:')} ${T(m[1])}`;
  // products: "<model> <part>[ · <grade>]" → "<part> <model>[ · <grade>]"
  if ((m = s.match(PRODUCT)) && MODEL_RE.test(m[1])) {
    const part = D[m[2].toLowerCase()] || m[2], cap = l === 'fa' ? part : part.charAt(0).toUpperCase() + part.slice(1);
    return `${cap} ${m[1]}${m[3] ? ' · ' + T(m[3]) : ''}`;
  }
  // "A · B · C": each piece
  if (s.includes(' · ')) {
    const parts = s.split(' · '), t = parts.map((p) => core(l, p) ?? p);
    if (t.some((x, i) => x !== parts[i])) return t.join(' · ');
  }
  if ((m = s.match(/^(.*?)([.:…!?])$/)) && D[m[1]] !== undefined) return D[m[1]] + m[2];
  if (s.endsWith(' ·') && D[s.slice(0, -2)] !== undefined) return D[s.slice(0, -2)] + ' ·';
  return null;
}

/** Translate one string into Spanish, French or Persian (unchanged until that language's dictionary is loaded). */
export function trOther(l: Other, input: string): string {
  if (!input || !dicts[l] || !/[A-Za-z→]/.test(input)) return input;
  const c = caches[l]!, hit = c.get(input);
  if (hit !== undefined) return hit;
  const lead = input.match(/^\s*/)![0], trail = input.match(/\s*$/)![0];
  const out0 = core(l, norm(input)), out = out0 == null ? input : lead + out0 + trail;
  if (c.size > 5000) c.clear();
  c.set(input, out);
  return out;
}
