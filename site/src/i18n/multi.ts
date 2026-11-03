/**
 * Spanish, French and Persian (R7-G). The same approach as the Arabic translator (src/i18n/translate.ts), with one
 * dictionary per language (es.ts, fr.ts, fa.ts, loaded only when picked):
 *   exact text → patterns (hours, stock, prices, "<model> <part>") → pieces joined by " · " → unchanged.
 * Brand and model names, codes and AED prices stay as they are, the way shops write them.
 */
import { PARTS } from './ar-parts';

export type Other = 'es' | 'fr' | 'fa' | 'ru' | 'hi' | 'ur' | 'tl' | 'ml' | 'ca' | 'de' | 'it' | 'pt' | 'ro' | 'zh' | 'gl' | 'eu' | 'sw' | 'am' | 'ha' | 'yo' | 'om' | 'ig';
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const dicts: Partial<Record<Other, Record<string, string>>> = {};
const caches: Partial<Record<Other, Map<string, string>>> = {};

// R9: one small file per language, fetched only when needed
const LOAD: Record<Other, () => Promise<{ default: Record<string, string> }>> = {
  es: () => import('./es'), fr: () => import('./fr'), fa: () => import('./fa'), ru: () => import('./ru'), hi: () => import('./hi'), ur: () => import('./ur'),
  tl: () => import('./tl'), ml: () => import('./ml'), ca: () => import('./ca'), de: () => import('./de'), it: () => import('./it'), pt: () => import('./pt'),
  ro: () => import('./ro'), zh: () => import('./zh'), gl: () => import('./gl'), eu: () => import('./eu'), sw: () => import('./sw'), am: () => import('./am'),
  ha: () => import('./ha'), yo: () => import('./yo'), om: () => import('./om'), ig: () => import('./ig'),
};
/** Load a language's dictionary (once). */
export async function loadDict(l: Other) {
  if (dicts[l]) return;
  const m = await LOAD[l]();
  dicts[l] = m.default;
  caches[l] = new Map();
}
export const hasDict = (l: Other) => !!dicts[l];

// the words the patterns need, per language
type W = { closesIn: string; opensIn: string; openUntil: string; openNowUntil: string; closingSoon: string; openingSoon: string; closedOpens: string; closedOpensTomorrow: string; closedNowOpensToday: string; opensTomorrow: string; opens: string; closes: string; inStock: string; only: string; left: string; from: string; h: string; m: string; d: string; min: string; hrs: string; days: string; ago: (n: string, u: 'h' | 'd') => string; partFirst: boolean };
const WORDS: Record<Other, W> = {
  es: { closesIn: 'Cierra en', opensIn: 'Abre en', openUntil: 'Abierto · hasta', openNowUntil: 'Abierto ahora · hasta', closingSoon: 'Cierra pronto ·', openingSoon: 'Abre pronto ·', closedOpens: 'Cerrado · abre', closedOpensTomorrow: 'Cerrado · abre mañana', closedNowOpensToday: 'Cerrado ahora · abre hoy a las', opensTomorrow: 'Abre mañana', opens: 'Abre', closes: 'Cierra a las', inStock: 'en stock', only: 'Solo', left: 'quedan', from: 'Desde', h: 'h', m: 'min', d: 'd', min: 'min', hrs: 'h', days: 'días', ago: (n, u) => `hace ${n} ${u === 'h' ? 'h' : 'días'}`, partFirst: true },
  fr: { closesIn: 'Ferme dans', opensIn: 'Ouvre dans', openUntil: 'Ouvert · jusqu’à', openNowUntil: 'Ouvert · jusqu’à', closingSoon: 'Ferme bientôt ·', openingSoon: 'Ouvre bientôt ·', closedOpens: 'Fermé · ouvre à', closedOpensTomorrow: 'Fermé · ouvre demain à', closedNowOpensToday: 'Fermé · ouvre aujourd’hui à', opensTomorrow: 'Ouvre demain à', opens: 'Ouvre à', closes: 'Ferme à', inStock: 'en stock', only: 'Plus que', left: 'restants', from: 'Dès', h: 'h', m: 'min', d: 'j', min: 'min', hrs: 'h', days: 'jours', ago: (n, u) => `il y a ${n} ${u === 'h' ? 'h' : 'j'}`, partFirst: true },
  ru: { closesIn: 'Закроется через', opensIn: 'Откроется через', openUntil: 'Открыто · до', openNowUntil: 'Сейчас открыто · до', closingSoon: 'Скоро закроется ·', openingSoon: 'Скоро откроется ·', closedOpens: 'Закрыто · откроется в', closedOpensTomorrow: 'Закрыто · откроется завтра в', closedNowOpensToday: 'Сейчас закрыто · откроется сегодня в', opensTomorrow: 'Откроется завтра в', opens: 'Откроется в', closes: 'Закроется в', inStock: 'в наличии', only: 'Осталось', left: 'шт.', from: 'От', h: 'ч', m: 'мин', d: 'д', min: 'мин', hrs: 'ч', days: 'дней', ago: (n, u) => `${n} ${u === 'h' ? 'ч' : 'дн.'} назад`, partFirst: true },
  hi: { closesIn: 'बंद होने में', opensIn: 'खुलने में', openUntil: 'खुला · तक', openNowUntil: 'अभी खुला · तक', closingSoon: 'जल्द बंद ·', openingSoon: 'जल्द खुलेगा ·', closedOpens: 'बंद · खुलेगा', closedOpensTomorrow: 'बंद · कल खुलेगा', closedNowOpensToday: 'अभी बंद · आज खुलेगा', opensTomorrow: 'कल खुलेगा', opens: 'खुलेगा', closes: 'बंद होगा', inStock: 'स्टॉक में', only: 'केवल', left: 'बचे', from: 'से', h: 'घं', m: 'मि', d: 'दि', min: 'मिनट', hrs: 'घंटे', days: 'दिन', ago: (n, u) => `${n} ${u === 'h' ? 'घंटे' : 'दिन'} पहले`, partFirst: true },
  ur: { closesIn: 'بند ہونے میں', opensIn: 'کھلنے میں', openUntil: 'کھلا · تک', openNowUntil: 'ابھی کھلا · تک', closingSoon: 'جلد بند ·', openingSoon: 'جلد کھلے گا ·', closedOpens: 'بند · کھلے گا', closedOpensTomorrow: 'بند · کل کھلے گا', closedNowOpensToday: 'ابھی بند · آج کھلے گا', opensTomorrow: 'کل کھلے گا', opens: 'کھلے گا', closes: 'بند ہوگا', inStock: 'اسٹاک میں', only: 'صرف', left: 'باقی', from: 'سے', h: 'گھنٹے', m: 'منٹ', d: 'دن', min: 'منٹ', hrs: 'گھنٹے', days: 'دن', ago: (n, u) => `${n} ${u === 'h' ? 'گھنٹے' : 'دن'} پہلے`, partFirst: true },
  de: { closesIn: 'Schließt in', opensIn: 'Öffnet in', openUntil: 'Geöffnet · bis', openNowUntil: 'Jetzt geöffnet · bis', closingSoon: 'Schließt bald ·', openingSoon: 'Öffnet bald ·', closedOpens: 'Geschlossen · öffnet', closedOpensTomorrow: 'Geschlossen · öffnet morgen', closedNowOpensToday: 'Geschlossen · öffnet heute um', opensTomorrow: 'Öffnet morgen', opens: 'Öffnet', closes: 'Schließt um', inStock: 'auf Lager', only: 'Nur noch', left: 'Stück', from: 'Ab', h: 'Std', m: 'Min', d: 'T', min: 'Min', hrs: 'Std', days: 'Tage', ago: (n, u) => `vor ${n} ${u === 'h' ? 'Std' : 'Tagen'}`, partFirst: true },
  it: { closesIn: 'Chiude tra', opensIn: 'Apre tra', openUntil: 'Aperto · fino alle', openNowUntil: 'Aperto ora · fino alle', closingSoon: 'Chiude presto ·', openingSoon: 'Apre presto ·', closedOpens: 'Chiuso · apre', closedOpensTomorrow: 'Chiuso · apre domani', closedNowOpensToday: 'Chiuso · apre oggi alle', opensTomorrow: 'Apre domani', opens: 'Apre', closes: 'Chiude alle', inStock: 'disponibili', only: 'Solo', left: 'rimasti', from: 'Da', h: 'h', m: 'min', d: 'g', min: 'min', hrs: 'h', days: 'giorni', ago: (n, u) => `${n} ${u === 'h' ? 'h' : 'giorni'} fa`, partFirst: true },
  pt: { closesIn: 'Fecha em', opensIn: 'Abre em', openUntil: 'Aberto · até', openNowUntil: 'Aberto agora · até', closingSoon: 'Fecha em breve ·', openingSoon: 'Abre em breve ·', closedOpens: 'Fechado · abre', closedOpensTomorrow: 'Fechado · abre amanhã', closedNowOpensToday: 'Fechado · abre hoje às', opensTomorrow: 'Abre amanhã', opens: 'Abre', closes: 'Fecha às', inStock: 'em stock', only: 'Só', left: 'restantes', from: 'Desde', h: 'h', m: 'min', d: 'd', min: 'min', hrs: 'h', days: 'dias', ago: (n, u) => `há ${n} ${u === 'h' ? 'h' : 'dias'}`, partFirst: true },
  ca: { closesIn: 'Tanca en', opensIn: 'Obre en', openUntil: 'Obert · fins a les', openNowUntil: 'Obert ara · fins a les', closingSoon: 'Tanca aviat ·', openingSoon: 'Obre aviat ·', closedOpens: 'Tancat · obre', closedOpensTomorrow: 'Tancat · obre demà', closedNowOpensToday: 'Tancat · obre avui a les', opensTomorrow: 'Obre demà', opens: 'Obre', closes: 'Tanca a les', inStock: 'en estoc', only: 'Només', left: 'queden', from: 'Des de', h: 'h', m: 'min', d: 'd', min: 'min', hrs: 'h', days: 'dies', ago: (n, u) => `fa ${n} ${u === 'h' ? 'h' : 'dies'}`, partFirst: true },
  gl: { closesIn: 'Pecha en', opensIn: 'Abre en', openUntil: 'Aberto · ata as', openNowUntil: 'Aberto agora · ata as', closingSoon: 'Pecha axiña ·', openingSoon: 'Abre axiña ·', closedOpens: 'Pechado · abre', closedOpensTomorrow: 'Pechado · abre mañá', closedNowOpensToday: 'Pechado · abre hoxe ás', opensTomorrow: 'Abre mañá', opens: 'Abre', closes: 'Pecha ás', inStock: 'en stock', only: 'Só', left: 'quedan', from: 'Desde', h: 'h', m: 'min', d: 'd', min: 'min', hrs: 'h', days: 'días', ago: (n, u) => `hai ${n} ${u === 'h' ? 'h' : 'días'}`, partFirst: true },
  eu: { closesIn: 'Ixteko', opensIn: 'Irekitzeko', openUntil: 'Irekita · arte', openNowUntil: 'Orain irekita · arte', closingSoon: 'Laster ixten da ·', openingSoon: 'Laster irekiko da ·', closedOpens: 'Itxita · irekiko da', closedOpensTomorrow: 'Itxita · bihar irekiko da', closedNowOpensToday: 'Itxita · gaur irekiko da', opensTomorrow: 'Bihar irekiko da', opens: 'Irekiko da', closes: 'Ixten da', inStock: 'stockean', only: 'Bakarrik', left: 'geratzen dira', from: 'Hemendik', h: 'h', m: 'min', d: 'e', min: 'min', hrs: 'h', days: 'egun', ago: (n, u) => `duela ${n} ${u === 'h' ? 'h' : 'egun'}`, partFirst: true },
  ro: { closesIn: 'Se închide în', opensIn: 'Se deschide în', openUntil: 'Deschis · până la', openNowUntil: 'Deschis acum · până la', closingSoon: 'Se închide curând ·', openingSoon: 'Se deschide curând ·', closedOpens: 'Închis · deschide', closedOpensTomorrow: 'Închis · deschide mâine', closedNowOpensToday: 'Închis · deschide azi la', opensTomorrow: 'Deschide mâine', opens: 'Deschide', closes: 'Se închide la', inStock: 'în stoc', only: 'Doar', left: 'rămase', from: 'De la', h: 'h', m: 'min', d: 'z', min: 'min', hrs: 'h', days: 'zile', ago: (n, u) => `acum ${n} ${u === 'h' ? 'h' : 'zile'}`, partFirst: true },
  tl: { closesIn: 'Magsasara sa', opensIn: 'Magbubukas sa', openUntil: 'Bukas · hanggang', openNowUntil: 'Bukas ngayon · hanggang', closingSoon: 'Magsasara na ·', openingSoon: 'Magbubukas na ·', closedOpens: 'Sarado · bubukas', closedOpensTomorrow: 'Sarado · bubukas bukas', closedNowOpensToday: 'Sarado · bubukas ngayon', opensTomorrow: 'Bubukas bukas', opens: 'Bubukas', closes: 'Magsasara', inStock: 'available', only: 'Tanging', left: 'na lang', from: 'Mula', h: 'h', m: 'min', d: 'a', min: 'min', hrs: 'oras', days: 'araw', ago: (n, u) => `${n} ${u === 'h' ? 'oras' : 'araw'} ang nakalipas`, partFirst: true },
  zh: { closesIn: '距离关门', opensIn: '距离开门', openUntil: '营业中 · 至', openNowUntil: '营业中 · 至', closingSoon: '即将关门 ·', openingSoon: '即将开门 ·', closedOpens: '已关门 · 开门时间', closedOpensTomorrow: '已关门 · 明天开门', closedNowOpensToday: '已关门 · 今天开门', opensTomorrow: '明天开门', opens: '开门', closes: '关门', inStock: '件有货', only: '仅剩', left: '件', from: '起价', h: '小时', m: '分', d: '天', min: '分钟', hrs: '小时', days: '天', ago: (n, u) => `${n}${u === 'h' ? '小时' : '天'}前`, partFirst: true },
  ml: { closesIn: 'അടയ്ക്കാൻ', opensIn: 'തുറക്കാൻ', openUntil: 'തുറന്നിരിക്കുന്നു · വരെ', openNowUntil: 'ഇപ്പോൾ തുറന്നു · വരെ', closingSoon: 'ഉടൻ അടയ്ക്കും ·', openingSoon: 'ഉടൻ തുറക്കും ·', closedOpens: 'അടച്ചു · തുറക്കും', closedOpensTomorrow: 'അടച്ചു · നാളെ തുറക്കും', closedNowOpensToday: 'അടച്ചു · ഇന്ന് തുറക്കും', opensTomorrow: 'നാളെ തുറക്കും', opens: 'തുറക്കും', closes: 'അടയ്ക്കും', inStock: 'സ്റ്റോക്കിൽ', only: 'മാത്രം', left: 'ബാക്കി', from: 'മുതൽ', h: 'മ', m: 'മി', d: 'ദി', min: 'മിനിറ്റ്', hrs: 'മണിക്കൂർ', days: 'ദിവസം', ago: (n, u) => `${n} ${u === 'h' ? 'മണിക്കൂർ' : 'ദിവസം'} മുമ്പ്`, partFirst: true },
  sw: { closesIn: 'Inafunga baada ya', opensIn: 'Inafungua baada ya', openUntil: 'Wazi · hadi', openNowUntil: 'Wazi sasa · hadi', closingSoon: 'Inafunga karibuni ·', openingSoon: 'Inafungua karibuni ·', closedOpens: 'Imefungwa · inafungua', closedOpensTomorrow: 'Imefungwa · inafungua kesho', closedNowOpensToday: 'Imefungwa · inafungua leo', opensTomorrow: 'Inafungua kesho', opens: 'Inafungua', closes: 'Inafunga', inStock: 'zipo', only: 'Zimebaki', left: 'tu', from: 'Kuanzia', h: 'saa', m: 'dk', d: 'siku', min: 'dk', hrs: 'saa', days: 'siku', ago: (n, u) => `${u === 'h' ? 'saa' : 'siku'} ${n} zilizopita`, partFirst: true },
  am: { closesIn: 'የሚዘጋው በ', opensIn: 'የሚከፈተው በ', openUntil: 'ክፍት · እስከ', openNowUntil: 'አሁን ክፍት · እስከ', closingSoon: 'በቅርቡ ይዘጋል ·', openingSoon: 'በቅርቡ ይከፈታል ·', closedOpens: 'ዝግ · ይከፈታል', closedOpensTomorrow: 'ዝግ · ነገ ይከፈታል', closedNowOpensToday: 'ዝግ · ዛሬ ይከፈታል', opensTomorrow: 'ነገ ይከፈታል', opens: 'ይከፈታል', closes: 'ይዘጋል', inStock: 'በክምችት', only: 'የቀሩት', left: 'ብቻ', from: 'ከ', h: 'ሰ', m: 'ደ', d: 'ቀ', min: 'ደቂቃ', hrs: 'ሰዓት', days: 'ቀናት', ago: (n, u) => `ከ${n} ${u === 'h' ? 'ሰዓት' : 'ቀን'} በፊት`, partFirst: true },
  ha: { closesIn: 'Za a rufe cikin', opensIn: 'Za a buɗe cikin', openUntil: 'A buɗe · har', openNowUntil: 'A buɗe yanzu · har', closingSoon: 'Za a rufe nan ba da jimawa ba ·', openingSoon: 'Za a buɗe nan ba da jimawa ba ·', closedOpens: 'A rufe · za a buɗe', closedOpensTomorrow: 'A rufe · za a buɗe gobe', closedNowOpensToday: 'A rufe · za a buɗe yau', opensTomorrow: 'Za a buɗe gobe', opens: 'Za a buɗe', closes: 'Za a rufe', inStock: 'akwai', only: 'Saura', left: 'kawai', from: 'Daga', h: 's', m: 'm', d: 'k', min: 'minti', hrs: 'awa', days: 'kwanaki', ago: (n, u) => `${u === 'h' ? 'awa' : 'kwanaki'} ${n} da suka wuce`, partFirst: true },
  yo: { closesIn: 'Yóò tì ní', opensIn: 'Yóò ṣí ní', openUntil: 'Ṣí sílẹ̀ · títí', openNowUntil: 'Ṣí sílẹ̀ báyìí · títí', closingSoon: 'Yóò tì láìpẹ́ ·', openingSoon: 'Yóò ṣí láìpẹ́ ·', closedOpens: 'Tì · yóò ṣí', closedOpensTomorrow: 'Tì · yóò ṣí lọ́la', closedNowOpensToday: 'Tì · yóò ṣí lónìí', opensTomorrow: 'Yóò ṣí lọ́la', opens: 'Yóò ṣí', closes: 'Yóò tì', inStock: 'wà', only: 'Ó kù', left: 'péré', from: 'Láti', h: 'wk', m: 'ìṣ', d: 'ọj', min: 'ìṣẹ́jú', hrs: 'wákàtí', days: 'ọjọ́', ago: (n, u) => `${u === 'h' ? 'wákàtí' : 'ọjọ́'} ${n} sẹ́yìn`, partFirst: true },
  om: { closesIn: 'Ni cufama', opensIn: 'Ni banama', openUntil: 'Banaa · hanga', openNowUntil: 'Amma banaa · hanga', closingSoon: 'Dhiyootti cufama ·', openingSoon: 'Dhiyootti banama ·', closedOpens: 'Cufaa · banama', closedOpensTomorrow: 'Cufaa · boru banama', closedNowOpensToday: 'Cufaa · har\'a banama', opensTomorrow: 'Boru banama', opens: 'Banama', closes: 'Cufama', inStock: 'ni jira', only: 'Kan hafe', left: 'qofa', from: 'Irraa', h: 's', m: 'd', d: 'g', min: 'daqiiqaa', hrs: 'sa\'aatii', days: 'guyyaa', ago: (n, u) => `${u === 'h' ? 'sa\'aatii' : 'guyyaa'} ${n} dura`, partFirst: true },
  ig: { closesIn: 'Ga-emechi n\'ime', opensIn: 'Ga-emepe n\'ime', openUntil: 'Emeghere · ruo', openNowUntil: 'Emeghere ugbu a · ruo', closingSoon: 'Ga-emechi n\'oge na-adịghị anya ·', openingSoon: 'Ga-emepe n\'oge na-adịghị anya ·', closedOpens: 'Emechiri · ga-emepe', closedOpensTomorrow: 'Emechiri · ga-emepe echi', closedNowOpensToday: 'Emechiri · ga-emepe taa', opensTomorrow: 'Ga-emepe echi', opens: 'Ga-emepe', closes: 'Ga-emechi', inStock: 'dị', only: 'Naanị', left: 'fọdụrụ', from: 'Site na', h: 'aw', m: 'nk', d: 'ụb', min: 'nkeji', hrs: 'awa', days: 'ụbọchị', ago: (n, u) => `${u === 'h' ? 'awa' : 'ụbọchị'} ${n} gara aga`, partFirst: true },
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
  if ((m = s.match(/^(\d+)d (\d+)h (\d+)m$/))) return `${m[1]}${w.d} ${m[2]}${w.h} ${m[3]}${w.m}`.replace(/(\d)([^\d\s])/g, l === 'fa' || l === 'ur' || l === 'hi' ? '$1 $2' : '$1$2');
  if ((m = s.match(/^(\d+)h (\d+)m$/))) return l === 'fa' ? `${m[1]} ساعت ${m[2]} دقیقه` : `${m[1]} ${w.h} ${m[2]} ${w.m}`;
  if ((m = s.match(/^(\d+)m$/))) return `${m[1]} ${w.m}`;
  if ((m = s.match(/^(\d+) H AGO$/i))) return w.ago(m[1], 'h');
  if ((m = s.match(/^(\d+) d ago$/i))) return w.ago(m[1], 'd');
  if ((m = s.match(/^(\d+)[–-](\d+) (min|hrs|days)$/))) return `${m[1]}–${m[2]} ${m[3] === 'min' ? w.min : m[3] === 'hrs' ? w.hrs : w.days}`;
  // R10: counters and labels built from a number or a name (templates live in each language's dictionary)
  const tpl = (k: string, v: Record<string, string>) => (D[k] !== undefined ? D[k].replace(/\{(\w)\}/g, (_, x) => v[x] ?? '') : null);
  if ((m = s.match(/^Only (\d+)$/))) return `${w.only} ${m[1]}`;
  if ((m = s.match(/^\+(\d+) in the last hour$/))) return tpl('+{n} in the last hour', { n: m[1] });
  if ((m = s.match(/^(\d+) cartons? on the pallet$/))) return tpl('{n} cartons on the pallet', { n: m[1] });
  if ((m = s.match(/^(\d{4})–today$/))) return tpl('{y}–today', { y: m[1] });
  if ((m = s.match(/^About (.+)$/))) return tpl('About {x}', { x: T(m[1]) });
  // stock and prices
  if ((m = s.match(/^([\d,.]+k?) in stock$/i))) return `${m[1]} ${w.inStock}`;
  if ((m = s.match(/^Only (\d+) left$/i))) return l === 'fa' ? `فقط ${m[1]} عدد باقی مانده` : l === 'hi' || l === 'ur' ? `${w.only} ${m[1]} ${w.left}` : `${w.only} ${m[1]} ${w.left}`;
  if ((m = s.match(/^From AED ([\d,]+)$/i))) return `${w.from} AED ${m[1]}`;
  if ((m = s.match(/^AED ([\d,]+(?:[–-][\d,]+)?)( · sample)?$/))) return `AED ${m[1]}${m[2] ? ' · ' + T('sample') : ''}`;
  if ((m = s.match(/^SINCE (\d{4})$/i))) return `${T('SINCE')} ${m[1]}`;
  if ((m = s.match(/^Trusted since (\d{4})$/))) return D['Trusted since 2003'] ? D['Trusted since 2003'].replace('2003', m[1]) : null;
  if ((m = s.match(/^([\d,]+) (models?|parts?|results|countries|brands)$/i))) return `${m[1]} ${T(m[2].toLowerCase().replace(/^(model|part)$/, '$1s'))}`;
  if ((m = s.match(/^(\d+) years with us$/))) return `${m[1]} ${T('years with us')}`;
  if ((m = s.match(/^Just landed: (.+)$/))) return `${T('Just landed:')} ${T(m[1])}`;
  // products: "<model> <part>[ · <grade>]" → "<part> <model>[ · <grade>]"
  if ((m = s.match(PRODUCT)) && MODEL_RE.test(m[1])) {
    const part = D[m[2].toLowerCase()] || m[2], cap = l === 'fa' || l === 'ur' || l === 'hi' ? part : part.charAt(0).toUpperCase() + part.slice(1);
    return `${cap} ${m[1]}${m[3] ? ' · ' + T(m[3]) : ''}`;
  }
  if ((m = s.match(/^(.+) \(estimate\)$/)) && D['estimate']) { const r = core(l, m[1]); if (r != null) return `${r} (${D['estimate']})`; }
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
