// Owner (17 Nov): "I'm not paying for AI. Code him to work without engines or money." and "Make him so smart: he
// understands basic stuff besides the website, replies differently based on how the user asks, never spams the same
// line, and works in all 24 languages."
// Samsoom's own brain: no AI service, no key, no cost. It reads the real catalogue and the company facts already on the
// page, understands models, parts, grades, countries and days in every site language (and with typos), remembers what
// the visitor was talking about, picks up the tone (in a hurry, upset, cheerful, casual), handles everyday talk (hello,
// how are you, thanks, time, date, jokes, phone tips, sums) and never says the same thing twice in a row.
import { products, data, warrantyOf, repairFee, type Product } from '@/lib/catalog';
import { shopStatus } from '@/lib/shopStatus';
import { N, has, CANON, TALK, APPLE, dayIn, countryIn } from './lex';

export type Answer = { t: string; act?: string; emote?: string; parts?: string[] } | null;
type Ctx = { history: string[]; tr: (s: string) => string; last?: string };

const VOCAB = ['iphone', 'galaxy', 'samsung', 'xiaomi', 'redmi', 'huawei', 'screen', 'battery', 'camera', 'charging', 'repair', 'original', 'incell', 'difference', 'shipping', 'warranty', 'cheapest', 'friday', 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'tomorrow', 'display', 'cover', 'frame', 'speaker', 'thanks', 'hello', 'price', 'delivery', 'location', 'address', 'broken', 'cracked'];
function lev(a: string, b: string) { const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
const AR: [RegExp, string][] = [[/ (ايفون|ايفن|آيفون) /g, ' iphone '], [/ (سامسونج|سامسونغ|جالكسي|جالاكسي|غالاكسي|گلکسی|سامسونگ) /g, ' galaxy '], [/ (شاومي|شياومي|شیائومی) /g, ' xiaomi '], [/ (ريدمي|ردمي|ردمی) /g, ' redmi '], [/ (هواوي|هوآوی) /g, ' huawei '], [/ (نوت) /g, ' note '], [/ (برو|پرو) /g, ' pro '], [/ (ماكس|مکس) /g, ' max '], [/ (الترا|اولترا) /g, ' ultra '], [/ (айфон) /g, ' iphone '], [/ (самсунг|галакси) /g, ' galaxy '], [/ (сяоми|ксиаоми) /g, ' xiaomi '], [/ (苹果) /g, ' iphone '], [/ (三星) /g, ' galaxy '], [/ (小米) /g, ' xiaomi '], [/ (आईफोन|आइफोन) /g, ' iphone '], [/ (सैमसंग) /g, ' galaxy ']];
const script = (n: string) => AR.reduce((x, [r, v]) => x.replace(r, v).replace(r, v), n.replace(/(苹果|三星|小米|айфон|самсунг)/g, ' $1 '));
/** small typos word by word (iphon → iphone, scren → screen, batery → battery) */
const typo = (n0: string) => { const n = script(n0); return ' ' + n.trim().split(' ').map((w) => (w.length < 4 || /\d/.test(w) || !/^[a-z]+$/.test(w) || VOCAB.includes(w) ? w : VOCAB.find((v) => v[0] === w[0] && lev(w, v) <= (v.length > 6 ? 2 : 1)) || w)).join(' ') + ' '; };
/** every language → the English meaning words, added in front so the rest of the brain reads any language */
const canon = (n: string) => { const add = Object.keys(CANON).filter((k) => has(n, CANON[k])); return add.length ? ' ' + add.join(' ') + n : n; };
const aed = (n: number) => 'AED ' + Math.round(n).toLocaleString('en-US');

const CAT: Record<string, string[]> = {
  SCR: ['screen', 'screens', 'display', 'lcd', 'oled screen', 'glass', 'touch'],
  BAT: ['battery', 'batteries', 'batt'],
  FLX: ['flex', 'charging', 'port', 'charger', 'connector'],
  BCV: ['back cover', 'back glass', 'backglass', 'cover'],
  FRM: ['frame', 'housing', 'chassis'],
  CAM: ['camera', 'cam', 'lens'],
  SML: ['speaker', 'mic', 'microphone', 'sim tray', 'button', 'vibrator', 'earpiece'],
};
const GRADE: Record<string, string[]> = { OR: ['original', 'service pack', 'genuine'], OL: ['oled', 'soft oled'], IN: ['incell', 'in cell'], AQ: ['aaa', 'copy'] };
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Model = { id: string; name: string; brand_id: string; series: string };
let aliasCache: { len: number; list: [string, Model][] } | null = null;
function aliases(): [string, Model][] {
  const d = data(); if (!d) return [];
  if (aliasCache && aliasCache.len === d.models.length) return aliasCache.list;
  const out: [string, Model][] = [];
  for (const m of d.models as Model[]) {
    const n = N(m.name).trim(); out.push([n, m]);
    const short = n.replace(/^(galaxy|apple|samsung|xiaomi|google|huawei|honor|oppo|vivo|realme|tecno|infinix|nokia|oneplus)\s+/, '');
    if (short !== n && /^[a-z]/.test(short) && (/\d/.test(short) || short.length > 4)) out.push([short, m]); // never "13 pro" alone (iPhone vs Xiaomi)
    const base = N(m.name.replace(/\([^)]*\)/g, ' ')).trim();
    if (base && base !== n) { out.push([base, m]); if (m.brand_id === 'samsung' && /^[a-z]\d/.test(base)) out.push(['galaxy ' + base, m]); const nb = base.replace(/^(redmi|poco|galaxy)\s+/, ''); if (nb !== base && /^[a-z]/.test(nb)) out.push([nb, m]); }
    const par = (m.name.match(/\(([^)]+)\)/) || [])[1];
    if (par) { const pn = N(par).trim(); out.push([pn, m]); const p2 = pn.replace(/\s*[45]g$/, ''); if (p2 !== pn && /^[a-z]/.test(p2)) { out.push([p2, m]); out.push(['galaxy ' + p2, m]); } }
    const ns = n.replace(/\s+/g, ''); if (ns !== n && /\d/.test(ns)) out.push([ns, m]);
  }
  out.sort((a, b) => b[0].length - a[0].length);
  aliasCache = { len: d.models.length, list: out };
  return out;
}
export function findModel(n: string): Model | null {
  const flat = n.replace(/\s+/g, '');
  for (const [a, m] of aliases()) if (n.includes(' ' + a + ' ') || (a.length > 5 && !a.includes(' ') && flat.includes(a))) return m;
  return null;
}
const findCat = (n: string) => Object.keys(CAT).find((k) => has(n, CAT[k])) || null;
const findGrade = (n: string) => Object.keys(GRADE).find((k) => has(n, GRADE[k])) || null;
type Country = { name: string; geo: string; region: string };
function findCountry(n: string) {
  const d = data() as unknown as { countries?: Country[]; regions?: { id: string; name: string }[] } | null;
  const list = d?.countries || [];
  const e = countryIn(n, list.map((c) => c.geo));
  const c = list.find((x) => x.geo === e) || list.find((x) => n.includes(' ' + N(x.name).trim() + ' '));
  return c ? { name: c.name, region: (d?.regions || []).find((r) => r.id === c.region)?.name || '' } : null;
}

/** what the visitor said earlier (the last model / part they mentioned) */
function memory(history: string[]) {
  let model: Model | null = null, cat: string | null = null;
  for (const h of history) { const n = canon(typo(N(h))); model = findModel(n) || model; cat = findCat(n) || cat; }
  return { model, cat };
}

// ── variety: never the same line twice in a row ──────────────────────────────────────────────────────
const used: Record<string, number[]> = {};
try { Object.assign(used, JSON.parse(sessionStorage.getItem('se-sam-v') || '{}')); } catch { /* */ }
function pick<X>(key: string, list: X[]): X {
  const u = used[key] || [], free = list.map((_, i) => i).filter((i) => !u.includes(i));
  const i = (free.length ? free : list.map((_, k) => k).filter((k) => k !== u[u.length - 1]))[Math.floor(Math.random() * (free.length || Math.max(1, list.length - 1)))] ?? 0;
  used[key] = [...u, i].slice(-Math.max(1, list.length - 1));
  try { sessionStorage.setItem('se-sam-v', JSON.stringify(used)); } catch { /* */ }
  return list[i];
}

// ── tone: how the visitor asks ───────────────────────────────────────────────────────────────────────
type Tone = 'upset' | 'hurry' | 'sad' | 'cheer' | 'casual' | 'polite' | 'plain';
function toneOf(raw: string, n: string): Tone {
  if (has(n, TALK.angry) || /!{3,}|\?{3,}/.test(raw) || (raw.length > 8 && raw === raw.toUpperCase() && /[A-Z]{5}/.test(raw))) return 'upset';
  if (has(n, ['asap', 'urgent', 'quick', 'quickly', 'hurry', 'fast', 'right now', 'dringend', 'schnell', 'urgent', 'vite', 'urgente', 'rapido', 'subito', 'urgente', 'срочно', 'быстро', '急', '马上', 'فوری', 'سریع', 'جلدی', 'ضروري', 'بسرعه', 'مستعجل', 'जल्दी', 'तुरंत', 'വേഗം', 'ቶሎ', 'haraka', 'da sauri', 'ngwa ngwa', 'kiakia', 'madali'])) return 'hurry';
  if (has(n, ['sad', 'upset', 'worried', 'help me', 'please help', 'my phone died', 'traurig', 'triste', 'triste', 'preoccupato', 'грустно', '难过', 'ناراحت', 'پریشان', 'زعلان', 'حزين', 'दुखी', 'परेशान', 'വിഷമം', 'ያሳዝናል', 'huzuni', 'bakin ciki', 'malungkot'])) return 'sad';
  if (/(!!|😀|😃|😄|😁|😍|🥰|😂|🤣|🔥|🎉|❤|💛)/u.test(raw)) return 'cheer';
  if (has(n, ['bro', 'bruh', 'dude', 'mate', 'man', 'yo', 'sup', 'habibi', 'akhi', 'يا رجل', 'خيو', 'حبيبي', 'يا زلمه', 'داداش', 'bhai', 'यार', 'भाई', 'tío', 'tio', 'wey', 'mec', 'alter', 'брат', 'бро', 'kaka', 'mshkaji', 'pare', 'tol', 'idol'])) return 'casual';
  if (has(n, ['please', 'could you', 'would you', 'kindly', 'bitte', 'sil vous plait', 's il te plait', 'por favor', 'per favore', 'si us plau', 'mesedez', 'va rog', 'пожалуйста', '请', '麻烦', 'لطفا', 'براہ کرم', 'من فضلك', 'لو سمحت', 'कृपया', 'ദയവായി', 'እባክህ', 'maaloo', 'tafadhali', 'don allah', 'biko', 'jọwọ', 'pakiusap', 'paki'])) return 'polite';
  return 'plain';
}
/** a short opener that matches the tone (sometimes none, so it never feels scripted) */
function opener(t: Tone, T: (s: string) => string): string {
  const L: Partial<Record<Tone, string[]>> = {
    upset: ['I’m sorry about this.', 'I understand, and I want to fix it.', 'Sorry for the trouble.'],
    hurry: ['Quick answer:', 'Straight to it:', 'Here you go:'],
    sad: ['Oh no, sorry to hear that.', 'Don’t worry, we’ll sort it out.', 'That’s no fun. Let’s fix it.'],
    cheer: ['Love the energy!', 'Yes!', 'Great question!'],
    casual: ['Sure thing!', 'Got you!', 'Easy one!'],
    polite: ['Of course!', 'With pleasure.', 'Certainly.'],
  };
  const l = L[t]; if (!l) return '';
  if (t !== 'upset' && t !== 'sad' && Math.random() < 0.35) return '';
  return T(pick('op-' + t, l)) + ' ';
}

const JOKES = ['Why did the phone wear glasses? It lost its contacts. 📱 Now, can I find you a part?', 'Why was the phone so tired? It had too many tabs open.', 'My battery and I have a lot in common: we both need a recharge after lunch.', 'Why did the smartphone go to school? To get a little smarter.', 'I told my phone a joke about Wi-Fi. It didn’t get the connection.'];
const FACTS = ['The first iPhone came out in 2007. Our shop was already four years old.', 'An OLED screen lights every tiny pixel on its own, which is why its blacks look so deep.', 'Most phone batteries keep about 80% of their health after around 500 full charges.', 'Phone glass is tough, but sand can still scratch it, so keep keys and sand away from the screen.', 'Putting a wet phone in rice doesn’t really help. Switching it off fast does.'];

export function think(q: string, ctx: Ctx): Answer {
  const T = ctx.tr, raw = q.trim(); if (!raw) return null;
  const W = (w: string) => String(w).replace(/^\s*1\s+months?/i, '1 ' + T('month')).replace(/months?/i, T('months'));
  const n0 = typo(N(raw)), n = canon(n0), mem = memory(ctx.history);
  const d = data(); if (!d) return null;
  const tone = toneOf(raw, n0), op = opener(tone, T), words = n0.trim().split(' ').filter(Boolean).length, short = words <= 4 && raw.length <= 24;
  const say = (t: string, x: Omit<NonNullable<Answer>, 't'> = {}): Answer => ({ t: op + t, ...x });
  const plain = (t: string, x: Omit<NonNullable<Answer>, 't'> = {}): Answer => ({ t, ...x });
  let model = findModel(n), cat = findCat(n);
  const grade = findGrade(n), refers = has(n, ['it', 'that', 'this', 'one', 'same', 'هذا', 'هاد', 'هاي']) || /^\s*(and|what about|how about|und|et|y|e|i|и|و|او)\b/i.test(raw.toLowerCase());
  const want = (k: string[]) => has(n, k);
  const talk = (k: string) => has(n0, TALK[k]);
  if (!model && (cat || grade || refers || want(['price', 'how much', 'cost', 'stock', 'warranty', 'repair', 'fix', 'cheapest']))) model = mem.model;
  if (!cat && model && (grade || refers || want(['price', 'how much', 'cost', 'cheapest', 'warranty']))) cat = mem.cat;
  const biz = !!(model || cat) || Object.keys(CANON).some((k) => has(n0, CANON[k]));

  // upset: always a person, right away
  if (talk('angry')) return plain(T(pick('angry', ['I’m sorry about that. Let me get a real person to help you right away.', 'I hear you, and I’m sorry. The team on WhatsApp can sort this out for you now.', 'Sorry I let you down. Tell me what went wrong, or talk to the team directly.'])), { act: 'whatsapp', emote: 'blush' });

  // a sum: "25*4", "120 + 75"
  const sum = raw.replace(/[x×]/g, '*').replace(/÷/g, '/').replace(/,/g, '.').replace(/[=?]\s*$/, '');
  if (/^[\d\s.+\-*/()%]+$/.test(sum) && /\d\s*[+\-*/%]\s*[\d(]/.test(sum) && sum.length < 60) {
    try { const v = Function('"use strict";return (' + sum + ')')() as number; if (Number.isFinite(v)) return plain(T(pick('sum', ['That makes', 'The answer is', 'Easy:'])) + ' ' + (Math.round(v * 1000) / 1000).toLocaleString('en-US') + '.', { emote: 'happy' }); } catch { /* not a sum */ }
  }
  // AED ↔ US dollars (the dirham is pegged: 1 USD = 3.6725 AED)
  const amt = raw.match(/(\d[\d,.]*)/);
  if (amt && talk('currency')) {
    const v = parseFloat(amt[1].replace(/,/g, '')), lo = raw.toLowerCase(), toAed = /(in|to|into|en|a|nach|в|إلى|الى)\s*(aed|dirham|درهم)/i.test(lo) ? true : /(in|to|into|en|a|nach|в|إلى|الى)\s*(usd|\$|dollar|دولار)/i.test(lo) ? false : !/\d[\d,.]*\s*(aed|dirham|درهم|درہم)/i.test(lo);
    const r = toAed ? 'USD ' + v.toLocaleString('en-US') + ' ≈ ' + aed(v * 3.6725) : aed(v) + ' ≈ USD ' + (Math.round((v / 3.6725) * 100) / 100).toLocaleString('en-US');
    return plain(r + '. ' + T('The dirham is pegged to the dollar, so this rate stays the same.'), { emote: 'tag' });
  }

  // order tracking
  if (/\bse[- ]?\d{3,}/i.test(raw) || has(n0, CANON.order)) return say(T('You can follow every order, step by step, in My Bench → Orders. Sign in with the e-mail you ordered with; the team also updates you on WhatsApp.'), { act: 'whatsapp', emote: 'parcel' });

  // phone troubles: real first-aid advice before a part
  if (talk('water')) return say(T(pick('water', ['Act fast: switch it off, don’t charge it, and skip the rice. Dry the outside and bring it to us as soon as you can; we open and clean it on the bench.', 'Water and phones don’t mix! Turn it off now and don’t plug it in. The sooner we clean the board, the better the chances.'])), { act: 'repair', emote: 'tool' });
  if (talk('notcharging')) return say(T(pick('notch', ['Let’s check it step by step: try another cable and charger, clean the port gently with a wooden toothpick, then restart. If it still won’t charge, it is usually the charging port, and we replace it the same day.', 'Try a different cable first, then look inside the port: lint loves to hide there. Still nothing? The charging port is likely worn, and we fit a new one in Deira.'])) + (model ? '\n' + T('Tell me “charging port” and I’ll show the price for your') + ' ' + model.name + '.' : ''), { act: 'repair', emote: 'tool' });
  if (talk('drain') && !model) return say(T(pick('drain', ['A few quick tips: lower the brightness, turn off background refresh, and check Battery Health in Settings. If it shows under 80%, a new battery brings the phone back to life.', 'Check Settings → Battery to see which app drains it most. If the battery health is under 80%, it’s time for a new one; tell me your model for the price.'])), { act: 'fmp', emote: 'part' });
  if (talk('slow') && !talk('weather') && !biz) return say(T(pick('slow', ['Try a restart, free up some storage and update the software. If it gets hot while charging, the battery may be swelling: please stop charging it and let us check it.', 'Close the apps you don’t use, clear some space and restart. A phone that gets very hot needs a look, so bring it by the bench.'])), { act: 'repair', emote: 'think' });
  if (talk('cracked') && !model) return say(T(pick('crack', ['Ouch! Back up your photos if the touch still works, and avoid pressing on the crack. Tell me your model and I’ll show you the screen price for each grade.', 'Oh no! Put a bit of tape over the crack to protect your fingers, and tell me the model: I’ll find the screen for you.'])), { act: 'fmp', emote: 'tool' });
  if (talk('modelcode') && !model) return say(T('On iPhone: Settings → General → About. On Android: Settings → About phone. You can also send me a screenshot of that page and I’ll read it for you.'), { emote: 'think' });

  // everyday talk (only when it is not about a phone part)
  if (!biz) {
    if (talk('bot')) return plain(T(pick('bot', ['I’m Samsoom, a little phone with a big memory for parts. I’m not a person, but I can bring one in whenever you like.', 'I’m the shop’s own assistant, built by Sam Electronics. A real person is one tap away if you need one.'])), { emote: 'wink' });
    if (talk('name')) return plain(T(pick('who', ['I’m Samsoom, the Sam Electronics phone! I know every part in our shop, the grades, the prices, our hours and where we ship. For anything I can’t do, I’ll pass you to a real person.', 'Samsoom, at your service! I’m the shop’s phone: parts, prices, repairs, shipping and opening hours are my thing.'])), { emote: 'wave' });
    if (talk('howareyou')) return plain(T(pick('hay', ['Doing great, thanks for asking! And you?', 'Fully charged and ready to help! How about you?', 'All good here in Deira. How is your day going?'])), { emote: 'happy' });
    if (talk('time')) { const s = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' }); return plain(T('In Dubai it is now') + ' ' + s + '. ' + T(pick('time', ['Need to know if we’re open?', 'Plenty of time to find your part!', 'Ask me if the shop is open right now.'])), { emote: 'clock' }); }
    if (talk('date')) { let s = ''; try { s = new Date().toLocaleDateString(window.seI18n ? window.seI18n.lang() : 'en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dubai' }); } catch { s = new Date().toDateString(); } return plain(T('Today is') + ' ' + s + '.', { emote: 'clock' }); }
    if (talk('weather')) return plain(T(pick('wx', ['I can’t see the sky from inside the phone, but Dubai is usually sunny and warm. Perfect weather to come by the shop!', 'No window in here, sorry! Your weather app knows best. And if your phone overheats in the sun, I can help with that.'])), { emote: 'think' });
    if (talk('joke')) return plain(T(pick('joke', JOKES)), { emote: 'happy' });
    if (talk('fact')) return plain(T(pick('fact', FACTS)), { emote: 'think' });
    if (talk('bored')) return plain(T(pick('bored', ['Let’s fix that! Want a phone fact, a joke, or should we find your phone a new battery?', 'Boredom, my old enemy! Ask me for a joke, or let’s see what your phone needs.'])), { emote: 'dabke' });
    if (talk('love')) return plain(T(pick('love', ['Aww, you just made my screen blush!', 'Thank you! You’re pretty great too.', 'That charged my battery to 100%!'])), { emote: 'kiss' });
    if (talk('help')) return plain(T('I can find parts and prices for your model, explain the grades, price a repair, tell you our hours, check shipping to your country, read your model from a photo, and pass you to a person. What do you need?'), { emote: 'happy' });
    if (talk('sorry') && short) return plain(T(pick('sorry', ['No worries at all!', 'All good, nothing to apologise for.', 'Don’t worry about it!'])), { emote: 'happy' });
    if (talk('thanks')) return plain(T(pick('thanks', ['Anytime!', 'You’re welcome! Anything else I can do?', 'My pleasure. I’m here if you need more.', 'Happy to help!'])), { emote: 'thanks' });
    if (talk('bye')) return plain(T(pick('bye', ['Bye for now! Come back any time.', 'Take care! Your phone is in good hands with us.', 'See you soon!'])), { emote: 'kiss' });
    if (talk('fine') && short) return plain(T(pick('fine', ['Glad to hear it! What can I do for you?', 'Nice! So, what are we fixing today?', 'Great! Tell me what you need.'])), { emote: 'happy' });
    if (talk('greet')) {
      const h = +new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', hour12: false });
      const part = h < 12 ? 'Good morning!' : h < 18 ? 'Good afternoon!' : 'Good evening!';
      const lines = tone === 'casual' ? ['Hey hey! What’s up? Need a part?', 'Yo! Samsoom here. What are we fixing?'] : ['Hi! What can I find for you today?', 'Hello there! Looking for a part, a repair, or just saying hi?', 'Hey! Tell me your phone model and I’ll take it from there.', 'Welcome! Ask me anything about phones and parts.'];
      return plain((Math.random() < 0.4 ? T(part) + ' ' : '') + T(pick('greet', lines)), { emote: 'wave' });
    }
    if (short && talk('yes')) return plain(T(pick('yes', ['Great! Tell me what you need.', 'Perfect. What’s the phone model?', 'Okay! Ask me anything.'])), { emote: 'happy' });
    if (short && talk('no')) return plain(T(pick('no', ['No problem. I’m here if you change your mind.', 'Alright! Anything else I can help with?'])), { emote: 'think' });
  }

  // the shop's story
  if (want(['owner', 'founder', 'who owns', 'boss', 'manager', 'صاحب', 'inhaber', 'proprietaire', 'dueno', 'proprietario', 'владелец', '老板', 'مالک', 'مالک', 'मालिक'])) return say(T('Sam Electronics is a family business, run by the same management since 2003, first as Syria Tell, on the same street in Deira.'), { act: 'story', emote: 'happy' });
  if (want(['madrid', 'spain', 'europe branch', 'اسبانيا', 'مدريد', 'espana', 'spanien', 'espagne', 'spagna', 'испания', '西班牙', 'اسپانیا'])) return say(T('Our second branch is coming to Plaza Mayor in Madrid. The opening date will be announced on the website and our channels.'), { act: 'story', emote: 'globe' });
  if (want(['since when', 'how long', 'how old', 'history', 'established', 'founded', 'seit wann', 'depuis quand', 'desde cuando', 'da quando', 'с какого', '多久', 'از کی', 'کب سے', 'من متى', 'कब से'])) return say(T('We have been in Deira since 2003, first as Syria Tell. Same family, same street.'), { act: 'story', emote: 'happy' });

  // grades: explain or compare
  if ((want(['difference', 'compare', 'versus', 'vs', 'better', 'which grade', 'what is oled', 'what is incell']) && (grade || want(['grades', 'grade', 'oled', 'incell', 'original', 'aaa']))) || (want(['grades']) && !model)) {
    const lines = ((d as unknown as { grades: { code: string; name: string; maker: string; desc: string }[] }).grades || []).map((g) => '• ' + T(g.name) + ' (' + g.maker + '): ' + T(g.desc) + ' · ' + T('warranty') + ' ' + W(warrantyOf(g.code)));
    return say(T('Four grades, from best to most affordable:') + '\n' + lines.join('\n') + '\n' + T('Tell me your model and I’ll show you the price of each grade.'), { act: 'models', emote: 'part' });
  }

  const P = products();
  // a model (with or without a part)
  if (model) {
    const forModel = P.filter((p) => p.model_id === model!.id);
    const repair = want(['repair', 'fit', 'fitting', 'fitted', 'install', 'replace', 'تركيب', 'تبديل']);
    if (!forModel.length) return say(T('We have') + ' ' + model.name + ' ' + T('on our list, but no parts are online for it yet. The team can check the shelf for you on WhatsApp.'), { act: 'whatsapp', emote: 'think' });
    if (!cat) {
      const byCat = new Map<string, Product[]>(); forModel.forEach((p) => { const l = byCat.get(p.category) || []; l.push(p); byCat.set(p.category, l); });
      const lines = [...byCat.entries()].map(([, l]) => '• ' + T(l[0].catName) + ': ' + T('from') + ' ' + aed(Math.min(...l.map((x) => x.price))) + ' (' + l.length + ' ' + (l.length > 1 ? T('grades') : T('grade')) + ')');
      return say(model.name + ' · ' + T(pick('have', ['here is what we have', 'this is on our shelf', 'good news, we have these'])) + ':\n' + lines.join('\n') + '\n' + T(pick('whichpart', ['Which part do you need?', 'Which one are you after?'])), { act: 'fmp', emote: 'found' });
    }
    let list = forModel.filter((p) => p.category === cat);
    const one = (d.categories as { id: string; one?: string; name: string }[]).find((c) => c.id === cat);
    if (!list.length) return say(T('No') + ' ' + T(one?.one || one?.name || '').toLowerCase() + ' ' + T('for') + ' ' + model.name + ' ' + T('online yet. The team can check the shelf for you on WhatsApp.'), { act: 'whatsapp', emote: 'think' });
    if (grade) { const g = list.filter((p) => p.grade === grade); if (g.length) list = g; }
    list = list.sort((a, b) => b.price - a.price);
    if (want(['cheapest'])) list = [...list].sort((a, b) => a.price - b.price).slice(0, 1);
    const fee = (p: Product) => repairFee(p.price);
    const rep = (d as unknown as { repairs?: { cat: string; time: string }[] }).repairs?.find((r) => r.cat === cat);
    const lines = list.map((p) => '• ' + T(p.gradeName) + ' (' + p.makerName + '): ' + aed(p.price) + (repair ? ' + ' + T('fitting') + ' ' + aed(fee(p)) + ' = ' + aed(p.price + fee(p)) : '') + ' · ' + (p.stock_qty > 0 ? T('in stock') : T('ask us')) + ' · ' + T('warranty') + ' ' + W(p.warranty));
    const head = T(one?.one || list[0].catName) + ' · ' + model.name + (repair ? ' · ' + T('fitted in Deira') + (rep ? ' (' + rep.time + ')' : '') : '');
    const tail = tone === 'hurry' ? '' : '\n' + T(pick('tail', ['Prices are samples until the team confirms them.', 'Tap + to add one to your cart.', 'Want it fitted? Ask me for the repair price.']));
    return say(head + ':\n' + lines.join('\n') + tail, { parts: list.slice(0, 4).map((p) => p.id), act: repair ? 'repair' : 'fmp', emote: repair ? 'tool' : 'found' });
  }
  // a part but no model yet
  if (cat && !want(['shipping', 'hours', 'location'])) {
    const c = (d.categories as { id: string; name: string }[]).find((x) => x.id === cat);
    const top = [...new Set(P.filter((p) => p.category === cat && p.stock_qty > 0).map((p) => p.modelName))].slice(0, 4);
    return say(T(pick('whichphone', ['Which phone is it for?', 'Sure, for which model?', 'Tell me the model and I’ll find it.'])) + (top.length ? ' ' + T('Popular') + ' ' + T(c?.name || '').toLowerCase() + ': ' + top.join(', ') + '.' : ''), { act: 'fmp', emote: 'think' });
  }
  // shipping
  const country = findCountry(n);
  if (country) return say(T('Yes, we ship to') + ' ' + T(country.name) + (country.region ? ' (' + T(country.region) + ')' : '') + '. ' + T('Packed in Deira, tracked to your door; the shipping cost is quoted with your order.'), { act: 'network', emote: 'globe' });
  if (want(['shipping'])) return say(T('Yes. We ship worldwide, mainly to the Middle East, Africa, Europe and Asia. Tracked and securely packed; shipping is quoted with your order.'), { act: 'network', emote: 'parcel' });
  // hours: a given day, tomorrow, or right now
  const HH = (d as unknown as { hours: Record<number, [number, number][]> }).hours || {};
  const day = dayIn(n0), tmr = want(['tomorrow']);
  const hm = (x: number) => String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');
  const shifts = (di: number) => (HH[di] || []).map(([a, b]) => hm(a) + '–' + hm(b)).join(' ' + T('and') + ' ');
  if (day >= 0 || (tmr && want(['hours']))) {
    const di = day >= 0 ? day : (new Date(Date.now() + 4 * 36e5).getUTCDay() + 1) % 7, sh = shifts(di);
    return say(sh ? T(DAYS[di]) + ': ' + T('open') + ' ' + sh + ' ' + T('(Dubai time).') : T(DAYS[di]) + ': ' + T('closed.'), { act: 'visit', emote: 'clock' });
  }
  if (want(['hours'])) {
    const H = shopStatus(HH, Date.now()) as { short: string; open: boolean };
    return say(T('Right now:') + ' ' + T(H.short || '') + ' ' + T('(Dubai time).') + '\n' + T('Saturday') + '–' + T('Thursday') + ' ' + shifts(1) + '\n' + T('Friday') + ' ' + shifts(5) + ' · ' + T('Sunday') + ' ' + T('closed.'), { act: 'visit', emote: 'clock' });
  }
  const C = (d as unknown as { contact?: { phone?: string; mobile?: string; email?: string; plus?: string } }).contact || {};
  if (want(['location'])) return say(T('We’re in Al Murar, Deira, Dubai.') + ' Plus Code ' + (C.plus || '78G4+3H2') + '. ' + T('Tap below for the map and directions.'), { act: 'visit', emote: 'globe' });
  if (want(['contact'])) return say(T('Call the shop, message us on WhatsApp or WeChat, or e-mail us. We’re @samelectronics.uae on Instagram, TikTok and Facebook.') + '\n' + (C.phone || '+971 4 273 3031') + ' · WhatsApp ' + (C.mobile || '+971 50 342 0015') + (C.email ? ' · ' + C.email : ''), { act: 'whatsapp', emote: 'happy' });
  if (want(['wholesale'])) return say(T('Trade prices unlock once your trade account is approved. Send a bulk list and we quote it the same day.'), { act: 'wholesale', emote: 'tag' });
  if (want(['warranty'])) return say(T('Every part has a warranty that depends on the grade:') + ' ' + ((d as unknown as { grades: { code: string; name: string }[] }).grades || []).map((g) => T(g.name) + ' ' + W(warrantyOf(g.code))).join(' · ') + '.', { act: 'models', emote: 'check' });
  if (want(['repair'])) return say(T('Our bench in Deira fixes screens, batteries and board faults. Try the estimator for a price range; the team confirms the final price.'), { act: 'repair', emote: 'tool' });
  if (want(['price'])) return say(T('Tell me the model and the part, like “A54 battery” or “iPhone 13 screen”, and I’ll show the price of each grade.'), { act: 'fmp', emote: 'tag' });
  if (want(['grades'])) return say(T('Four grades, from best to most affordable:') + ' ' + ((d as unknown as { grades: { name: string }[] }).grades || []).map((g) => T(g.name)).join(' · ') + '. ' + T('Tell me your model and I’ll show you the price of each grade.'), { act: 'models', emote: 'part' });
  if (talk('photo')) return say(T('Send me a photo with the camera button: a screenshot of Settings → About phone, or the label on the box, works best. I’ll read the model for you.'), { emote: 'think' });
  return null;
}

/** when nothing matched: a different, helpful line each time (it uses what the visitor talked about before) */
export function unknown(q: string, ctx: Ctx): NonNullable<Answer> {
  const T = ctx.tr, mem = memory(ctx.history);
  if (mem.model && Math.random() < 0.6) return { t: T('Still about your') + ' ' + mem.model.name + '? ' + T('Tell me the part: screen, battery, camera or charging port.'), emote: 'think', act: 'fmp' };
  const l = ['Hmm, I’m not sure I got that. Could you say it another way?', 'That one is new to me! Try a phone model and a part, like “A54 battery”.', 'I’m better with phones than with that. Ask me about parts, repairs, hours or shipping.', 'I didn’t quite get it. The team on WhatsApp can help, or try other words.', 'Let me think… no, that one beat me! Try asking about a part, a repair or our hours.'];
  const i = l.indexOf(pick('unk', l));
  return { t: T(l[i]), emote: i === 4 ? 'blush' : 'think', act: i === 3 ? 'whatsapp' : undefined };
}

/** photo reading, free: the text on the photo is read in the browser (Tesseract), then the model is found in it */
export async function readPhoto(src: string, ctx: Ctx, extra = ''): Promise<NonNullable<Answer>> {
  const T = ctx.tr;
  let text = '';
  try {
    const { createWorker } = await import('tesseract.js');
    const w = await createWorker('eng');
    const r = await Promise.race([w.recognize(src), new Promise<null>((res) => setTimeout(() => res(null), 25000))]);
    text = r ? r.data.text : '';
    w.terminate();
  } catch { text = ''; }
  const up = text.toUpperCase().replace(/[|]/g, 'I');
  const a = (up.match(/\bA\s?(2\d{3}|3\d{3})\b/) || [])[1];
  const sm = (up.match(/\bSM-?\s?([ASMNFGZ]\d{3})/) || [])[1];
  const n = typo(N(text + ' ' + (a && APPLE['A' + a] ? APPLE['A' + a] : '') + ' ' + (sm || '')));
  const m = findModel(n);
  if (m) {
    const rest = think(m.name + ' ' + extra, ctx);
    return { t: T('I read your photo: it is a') + ' ' + m.name + (a ? ' (A' + a + ')' : sm ? ' (SM-' + sm + ')' : '') + '.\n' + (rest ? rest.t : ''), parts: rest?.parts, act: rest?.act || 'fmp', emote: 'found' };
  }
  if (/\b\d{15}\b/.test(text.replace(/\s/g, ''))) return { t: T('I can see an IMEI number on the photo. Send it to the team on WhatsApp and they will find the exact model.'), act: 'whatsapp', emote: 'think' };
  return { t: T(pick('photo', ['I looked closely but couldn’t read a model on this photo. A screenshot of Settings → About phone works best, or just tell me the model.', 'I can read text on photos, but I couldn’t find a model on this one. Try the label on the box, or type the model, and I’ll take it from there.'])), act: 'whatsapp', emote: 'think' };
}
