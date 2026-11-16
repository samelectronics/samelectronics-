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
export function stamp(text: string): string {
  if (typeof window === 'undefined' || /\*Message ID:\*/.test(text)) return text;
  return text.replace(/\s+$/, '') + '\n\n*Customer ID:* ' + customerId() + '\n*Message ID:* ' + messageId();
}
