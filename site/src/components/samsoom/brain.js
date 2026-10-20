// @ts-nocheck
/**
 * G8: Samsoom's fuzzy fallback brain, used until ANTHROPIC_API_KEY is set (and whenever the API fails),
 * and his context emotes for every answer (Claude's too).
 *
 * - Typo tolerant: every word of the question is matched to the nearest keyword (edit distance, with
 *   swapped letters counting as one edit); exact words always win, so "shop" never reads as "ship".
 * - Understands English and Arabic, and answers in the language of the question.
 * - Never invents prices, stock or policies: TO CONFIRM items go to the team on WhatsApp.
 */

// ── text helpers ──────────────────────────────────────────────────────────────────────────────────
export const isArabic = (s) => /[؀-ۿ]/.test(s || '');

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '') // Arabic diacritics, tatweel
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[’'`]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/(\p{L})\1{2,}/gu, '$1') // hiii → hi, hellooo → hello
    .replace(/\s+/g, ' ')
    .trim();
}
const stripAr = (w) => (w.length > 4 ? w.replace(/^(وال|بال|فال|لل|ال|و)/, '') : w);

/** Damerau–Levenshtein (optimal string alignment). */
function dist(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 9;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[m][n];
}
/** Edits allowed for a keyword of this length. */
const allow = (k) => (k.length <= 3 ? 0 : k.length <= 7 ? 1 : 2);

// ── intents ───────────────────────────────────────────────────────────────────────────────────────
// words: single words (fuzzy) · phrases: multi-word (exact, after normalising)
const INTENTS = {
  warranty: { words: 'warranty warrenty guarantee guaranty ضمان كفاله', phrases: '' },
  trade: { words: 'trade wholesale wholesaler bulk reseller dealer quantity quantities جمله كميه كميات تاجر', phrases: 'price list|trade account|in bulk|whole sale|trade price|trade prices' },
  price: { words: 'price prices pricing cost costs cheap cheaper expensive aed dirham dirhams سعر اسعار بكم تكلفه رخيص غالي درهم', phrases: 'how much|كم سعر|قديش' },
  shipping: { words: 'ship ships shipping shipment deliver delivery send export abroad worldwide courier country countries international شحن توصيل ترسلون تشحنون دوله بلد تصدير', phrases: 'to my country' },
  repair: { words: 'repair repairs fix fixing broken crack cracked damaged smashed technician dead faulty تصليح صيانه اصلاح مكسور مكسوره كسر خربان عطل معطل', phrases: '' },
  grades: { words: 'grade grades original oled incell copy quality difference genuine اصلي جوده نوعيه اوليد كوبي درجه', phrases: 'service pack|high copy' },
  hours: { words: 'open opened opening hours hour close closed closing today tonight tomorrow now time friday sunday saturday schedule timing مفتوح مفتوحين فاتح فاتحين دوام ساعات مسكر مسكرين مغلق متي اليوم الوقت الجمعه الاحد بكره', phrases: 'are you open' },
  location: { words: 'where location located address map maps directions shop store deira murar dubai branch visit وين اين عنوان موقع مكان محل ديره المرر دبي فرع', phrases: 'find you|get there' },
  contact: { words: 'contact phone call number whatsapp email mail instagram tiktok facebook human person talk تواصل رقم هاتف تلفون جوال واتس واتساب ايميل اتصل', phrases: '' },
  brands: { words: 'brand brands apple iphone samsung galaxy xiaomi redmi poco realme oppo vivo huawei honor google pixel tecno infinix oneplus nokia ماركات ماركه براند ابل ايفون سامسونج شاومي ريدمي هواوي اوبو', phrases: 'which phones' },
  stock: { words: 'stock available availability part parts screen screens battery batteries lcd display متوفر موجود قطعه قطع شاشه بطاريه', phrases: 'do you have|عندكم' },
  thanks: { words: 'thanks thank thx ty appreciate awesome amazing perfect love شكرا مشكور تسلم يعطيك', phrases: 'thank you' },
  bye: { words: 'bye goodbye cya باي', phrases: 'see you|مع السلامه' },
  greet: { words: 'hi hello hey hiya howdy salam salaam marhaba yo sup مرحبا مرحبتين سلام اهلا هلا صباح مساء كيفك شلونك', phrases: 'good morning|good evening|how are you|السلام عليكم' },
};
const ORDER = ['warranty', 'trade', 'price', 'shipping', 'repair', 'grades', 'hours', 'location', 'contact', 'brands', 'stock', 'thanks', 'bye', 'greet'];
const KW = [];
for (const [intent, { words, phrases }] of Object.entries(INTENTS)) {
  words.split(' ').filter(Boolean).forEach((w) => KW.push({ w: stripAr(norm(w)), intent }));
  INTENTS[intent].ph = phrases.split('|').filter(Boolean).map(norm);
}

/** Intents found in a text, in priority order. */
export function intents(text) {
  const n = norm(text), hit = new Set();
  for (const i of ORDER) if (INTENTS[i].ph.some((p) => (' ' + n + ' ').includes(' ' + p + ' ') || (isArabic(p) && n.includes(p)))) hit.add(i);
  for (const raw of n.split(' ')) {
    const tok = stripAr(raw);
    if (!tok) continue;
    let best = null, bd = 9;
    for (const k of KW) {
      if (k.w === tok) { best = k; bd = 0; break; }
      if (tok.length < 3 || k.w[0] !== tok[0]) continue;
      const d = dist(tok, k.w);
      if (d <= allow(k.w) && d < bd) { best = k; bd = d; }
    }
    if (best) hit.add(best.intent);
  }
  return ORDER.filter((i) => hit.has(i));
}

// ── emotes ────────────────────────────────────────────────────────────────────────────────────────
/** Universal emotes the idle scheduler cycles through (G8). */
export const UNIVERSAL = ['wave', 'blush', 'dabke', 'kiss', 'happy', 'spin', 'wink', 'yawn'];

/** The context emote that matches what was asked (or answered). */
export function emoteFor(text, answer) {
  const n = norm(text), I = intents(text);
  const main = I[0] || intents(answer || '')[0];
  switch (main) {
    case 'hours': return /\b(now|today|tonight|open|close)\b|الان|اليوم|مفتوح|فاتح/.test(n) ? 'clock' : 'check';
    case 'warranty': return 'check';
    case 'repair': return 'tool';
    case 'price': case 'trade': return 'tag';
    case 'shipping': return /countr|world|abroad|international|\bto [a-z]{4,}|دول|بلد|الى|إلى/.test(n) ? 'globe' : 'parcel';
    case 'stock': case 'brands': case 'grades': return 'part';
    case 'location': return 'globe';
    case 'contact': return 'happy';
    case 'thanks': return 'thanks';
    case 'greet': case 'bye': return 'wave';
    default: return null;
  }
}

// ── fallback answers ──────────────────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const hm = (x) => pad(Math.floor(x / 60)) + ':' + pad(x % 60);
const shifts = (H, d, and) => (H[d] || []).map(([a, b]) => hm(a) + '–' + hm(b)).join(and);

/**
 * Answer a question without the API.
 * ctx: { D: window.SE_DATA, H: home.hours() → { open, short }, tr: (en) => Arabic }
 * Returns { t, ar, act, emote } where act is a site place (see the API route's ACTIONS) or null.
 */
export function fallbackAnswer(q, ctx) {
  const ar = isArabic(q), D = ctx.D || {}, H = ctx.H || {}, HH = D.hours || {}, C = D.contact || {};
  const I = intents(q), main = I.find((i) => i !== 'greet') || I[0];
  const hi = I.includes('greet') && main !== 'greet' ? (ar ? 'أهلاً! ' : 'Hi! ') : '';
  const wa = C.mobile || '+971 50 342 0015';
  const L = (en, a) => (ar ? a : en);
  let t, act = null;
  switch (main) {
    case 'hours': {
      const now = ar ? (ctx.tr ? ctx.tr(H.short || '') : H.short) : H.short;
      t = L(
        'Right now: ' + now + ' (Dubai time).\nSat–Thu ' + shifts(HH, 1, ' and ') + '\nFri ' + shifts(HH, 5, ' and ') + ' · Sunday closed',
        'الآن: ' + now + ' (بتوقيت دبي).\nالسبت–الخميس ' + shifts(HH, 1, ' و ') + '\nالجمعة ' + shifts(HH, 5, ' و ') + ' · الأحد مغلق',
      );
      act = 'visit';
      break;
    }
    case 'location':
      t = L('We’re in Al Murar, Deira, Dubai (Plus Code ' + (C.plus || '78G4+3H2') + '). Tap below for the map and directions.', 'نحن في المرر، ديرة، دبي (Plus Code ' + (C.plus || '78G4+3H2') + '). اضغط بالأسفل للخريطة والاتجاهات.');
      act = 'visit';
      break;
    case 'contact':
      t = L('Call the shop on ' + (C.phone || '+971 4 273 3031') + ', WhatsApp us on ' + wa + ', or email ' + (C.email || 'samelectronics.uae@gmail.com') + '. We’re @samelectronics.uae on Instagram, TikTok and Facebook.', 'اتصل بالمحل على ' + (C.phone || '+971 4 273 3031') + '، أو راسلنا واتساب على ' + wa + '، أو بالإيميل ' + (C.email || 'samelectronics.uae@gmail.com') + '. حسابنا ‎@samelectronics.uae على إنستغرام وتيك توك وفيسبوك.');
      act = 'whatsapp';
      break;
    case 'brands': {
      const B = (D.brands || []).map((b) => b.name).join(', ');
      t = L('Parts for ' + (B || 'Apple, Samsung, Xiaomi, Redmi, Realme, Oppo, Huawei and more') + '. Pick your brand and model in Find My Part.', 'قطع لـ ' + (B || 'Apple, Samsung, Xiaomi') + '. اختر الماركة والموديل في «ابحث عن قطعتي».');
      act = 'fmp';
      break;
    }
    case 'grades':
      t = L(
        'Quality and manufacturer are labelled separately on every part.\nQualities: ' + (D.qualities || []).map((q) => q.name).join(' · ') + '\nManufacturers: ' + (D.manufacturers || []).map((m) => m.name).join(' · ') + '\nOriginal (Service Pack) for the best result, OLED or AAA for value, Incell when budget comes first.',
        'نوضح الجودة والشركة المصنّعة لكل قطعة بشكل منفصل.\nالجودة: ' + (D.qualities || []).map((q) => q.name).join(' · ') + '\nالمصنّع: ' + (D.manufacturers || []).map((m) => m.name).join(' · ') + '\nOriginal (Service Pack) لأفضل نتيجة، OLED أو AAA قيمة ممتازة، Incell عندما تكون الميزانية أولاً.',
      );
      act = 'models';
      break;
    case 'shipping':
      t = L('Yes. We ship worldwide, mainly to the Middle East, Africa, Europe and Asia. Tracked and securely packed; shipping is quoted with your order.', 'نعم. نشحن لكل العالم، خصوصاً الشرق الأوسط وأفريقيا وأوروبا وآسيا. شحن متتبَّع ومغلّف بإحكام، وتكلفته تُسعَّر مع طلبك.');
      act = 'network';
      break;
    case 'repair':
      t = L('Our bench in Deira fixes screens, batteries and board faults. Try the estimator for a price range; the team confirms the final price.', 'ورشتنا في ديرة تصلّح الشاشات والبطاريات وأعطال اللوحة. جرّب المقدّر لمعرفة نطاق السعر، والفريق يؤكد السعر النهائي.');
      act = 'repair';
      break;
    case 'trade':
      t = L('Trade prices unlock once your trade account is approved. Send a bulk list and we quote it the same day.', 'أسعار الجملة تظهر بعد اعتماد حسابك التجاري. أرسل قائمة الكميات ونرسل لك عرض السعر في نفس اليوم.');
      act = 'wholesale';
      break;
    case 'price':
      t = L('Each part shows its price in Find My Part (sample prices for now). Trade prices unlock with a trade account, and the team confirms the final price on WhatsApp.', 'سعر كل قطعة يظهر في «ابحث عن قطعتي» (أسعار تجريبية حالياً). أسعار الجملة تظهر مع الحساب التجاري، والفريق يؤكد السعر النهائي على واتساب.');
      act = 'fmp';
      break;
    case 'warranty':
      t = L('Warranty depends on the grade and the repair. The team will confirm it for your part; message us on WhatsApp.', 'الضمان يختلف حسب الدرجة ونوع التصليح. الفريق سيؤكده لك حسب القطعة؛ راسلنا على واتساب.');
      act = 'whatsapp';
      break;
    case 'stock':
      t = L('Tell me the model and the part, like “A54 battery” or “iPhone 13 screen”, or open Find My Part to see every part in stock.', 'قل لي الموديل والقطعة، مثل «بطارية A54» أو «شاشة iPhone 13»، أو افتح «ابحث عن قطعتي» لترى كل القطع المتوفرة.');
      act = 'fmp';
      break;
    case 'thanks':
      t = L('Anytime! Happy to help. 💛', 'العفو! بخدمتك دائماً. 💛');
      break;
    case 'bye':
      t = L('Bye for now! I’m right here if you need a part.', 'مع السلامة! أنا هنا إذا احتجت أي قطعة.');
      break;
    case 'greet':
      if (/how are you|how r u|كيفك|شلونك|كيف حالك/.test(norm(q))) {
        t = L('Doing great, thanks for asking! I’m Samsoom. Need a part, a grade, or our hours?', 'بخير الحمد لله، شكراً لسؤالك! أنا سمسوم. تحتاج قطعة، أو درجة، أو أوقات الدوام؟');
        break;
      }
      t = L('Hi! I’m Samsoom. Ask me about a part, a grade, shipping, or whether the shop is open right now.', 'أهلاً! أنا سمسوم. اسألني عن قطعة، أو درجة، أو الشحن، أو إذا كان المحل مفتوحاً الآن.');
      break;
    default:
      return null;
  }
  return { t: hi + t, ar, act, emote: emoteFor(q, t) || 'happy' };
}
