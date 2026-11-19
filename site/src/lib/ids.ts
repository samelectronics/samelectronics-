'use client';
// Owner (16 Nov): every customer has an ID and every message sent gets its own ID, so the team can track everything.
//  · Customer ID: SE-C-XXXXXX for a signed-in customer (from the account), SE-G-XXXXXX for a guest (kept on this device,
//    so a returning guest keeps the same ID until they sign in).
//  · Message ID: SE-M-YYMMDD-XXXX, new for every message, form or WhatsApp/WeChat tap.
// Both are written into the message itself (so they show on WhatsApp too) and into the Control Room inbox.
const A = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const rnd = (n: number) => Array.from({ length: n }, () => A[(Math.random() * A.length) | 0]).join('');
const hash6 = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } let o = ''; h >>>= 0; for (let i = 0; i < 6; i++) { o += A[h % A.length]; h = Math.floor(h / A.length) || (h * 7 + i); } return o; };

let signed: string | null = null;
export const setCustomer = (userId: string | null | undefined) => { signed = userId ? 'SE-C-' + hash6(userId) : null; };
export function customerId(): string {
  if (signed) return signed;
  try { let g = localStorage.getItem('se-cid'); if (!g) { g = 'SE-G-' + rnd(6); localStorage.setItem('se-cid', g); } return g; } catch { return 'SE-G-' + rnd(6); }
}
export function messageId(): string {
  const d = new Date(), p = (n: number) => String(n).padStart(2, '0');
  return 'SE-M-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + rnd(4);
}
/** adds the two IDs to a message once (never twice) */
export function stamp(text: string, channel: Channel = 'Website'): string {
  if (typeof window === 'undefined' || /\*Message ID:\*|\*SYSTEM DETAILS\*/.test(text)) return text;
  return withSys(text, channel);
}

/* R10 (owner: "system messages must follow a rule … identifying the person, location, time zone; the person's reference
   ID never changes, each inquiry has its own ID; date, time, seconds"). Every message the website sends to the team ends
   with this one block, in the same order, on every channel (WhatsApp, WeChat, e-mail, website), in English for staff. */
export type Channel = 'WhatsApp' | 'WeChat' | 'E-mail' | 'Website' | 'Phone';
const LANG_N: Record<string, string> = { en: 'English', ar: 'Arabic', de: 'German', fr: 'French', es: 'Spanish', it: 'Italian', pt: 'Portuguese', ca: 'Catalan', gl: 'Galician', eu: 'Basque', ro: 'Romanian', ru: 'Russian', zh: 'Chinese', fa: 'Persian', ur: 'Urdu', hi: 'Hindi', ml: 'Malayalam', am: 'Amharic', om: 'Oromo', sw: 'Swahili', ha: 'Hausa', ig: 'Igbo', yo: 'Yoruba', tl: 'Filipino' };
function device(): string {
  const u = navigator.userAgent;
  const os = /iPhone/.test(u) ? 'iPhone' : /iPad/.test(u) ? 'iPad' : /Android/.test(u) ? (/Mobile/.test(u) ? 'Android phone' : 'Android tablet') : /Mac OS X/.test(u) ? 'Mac' : /Windows/.test(u) ? 'Windows PC' : /Linux/.test(u) ? 'Linux PC' : 'Unknown device';
  const br = /Edg\//.test(u) ? 'Edge' : /OPR\//.test(u) ? 'Opera' : /SamsungBrowser/.test(u) ? 'Samsung Internet' : /CriOS|Chrome\//.test(u) ? 'Chrome' : /FxiOS|Firefox\//.test(u) ? 'Firefox' : /Safari\//.test(u) ? 'Safari' : 'Browser';
  return os + ' · ' + br;
}
function when(d: Date, tz: string) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return f.format(d).replace(',', '').replace(/ (\d{2}:\d{2}:\d{2})$/, ' · $1');
}
/** The formal details block. `inquiry` is this message's own ID (a new one per inquiry); the customer ref never changes. */
export function sysBlock(channel: Channel, inquiry: string = messageId(), extra: [string, string][] = []): string {
  if (typeof window === 'undefined') return '';
  const now = new Date(), tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'; } catch { return 'unknown'; } })();
  const region = (() => { try { return new Intl.Locale(navigator.language).maximize().region || ''; } catch { return ''; } })();
  let lang = 'en'; try { lang = (window as unknown as { seI18n?: { lang: () => string } }).seI18n?.lang() || localStorage.getItem('se-lang') || 'en'; } catch { /* */ }
  let lvl = ''; try { const L = (window as unknown as { __seLvl?: () => { name: string; xp: number } }).__seLvl?.(); if (L) lvl = L.name + ' · ' + L.xp + ' pts'; } catch { /* */ }
  const rows: [string, string][] = [
    ['Customer ref', customerId() + (signed ? ' (account)' : ' (guest, this device)')],
    ['Inquiry ID', inquiry],
    ['Sent (Dubai)', when(now, 'Asia/Dubai') + ' GST'],
    ...(tz !== 'Asia/Dubai' ? [['Customer local time', when(now, tz) + ' (' + tz + ')'] as [string, string]] : []),
    ['Location', (region ? region + ' · ' : '') + 'time zone ' + tz],
    ['Device', device()],
    ['Site language', LANG_N[lang] || lang],
    ...(lvl ? [['Website level', lvl] as [string, string]] : []),
    ['Channel', channel],
    ['Page', location.href.split('#')[0]],
    ...extra,
  ];
  return '━━━━━━━━━━━━━━━━\n*SYSTEM DETAILS*\n' + rows.map(([k, v]) => '*' + k + ':* ' + v).join('\n');
}
/** adds the formal block once */
export function withSys(text: string, channel: Channel, inquiry?: string): string {
  if (/\*SYSTEM DETAILS\*/.test(text)) return text;
  return text.replace(/\s+$/, '') + '\n\n' + sysBlock(channel, inquiry);
}
