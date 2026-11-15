// R12 (owner): every WhatsApp message the website prepares arrives at the team neatly laid out: a bold title, the request
// details one per line, who the customer is, which page it came from and when (Dubai time). Messages that are already
// laid out (they start with '*') are left alone.
type Who = { name?: string; email?: string; phone?: string } | null;
let who: Who = null;
export const setWaCustomer = (w: Who) => { who = w; };

export function formatWa(raw: string): string {
  const txt = (raw || '').trim();
  if (!txt || txt.startsWith('*')) return txt;
  let body = txt.replace(/^(hi|hello|hey|salam|مرحبا|hola|bonjour)[^,.!\n]*[,.!]\s*/i, '');
  const m = body.match(/^([^.?!\n]{6,90}[.?!])\s*/);
  let title = 'Website request';
  if (m) { title = m[1].replace(/^I\s+(would like|want|need)\s+(to\s+)?/i, '').replace(/^(a|an|the)\s+/i, '').replace(/[.?!]$/, ''); title = title.charAt(0).toUpperCase() + title.slice(1); body = body.slice(m[0].length); }
  const parts = body.split(/\s+·\s+|\n+/).map((x) => x.trim()).filter(Boolean);
  const lines = parts.map((x) => { const kv = x.match(/^([^:]{2,40}):\s*(.+)$/); return kv ? `• *${kv[1].trim()}:* ${kv[2].trim()}` : `• ${x}`; });
  const now = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const cust = who ? [who.name && `Name: ${who.name}`, who.email && `E-mail: ${who.email}`, who.phone && `WhatsApp: ${who.phone}`].filter(Boolean).join('\n') : 'Website visitor (not signed in)';
  const page = typeof location !== 'undefined' ? location.origin + location.pathname : '';
  return [`*Sam Electronics · Website*`, `━━━━━━━━━━━━`, `*${title}*`, ...(lines.length ? ['', ...lines] : []), '', `*Customer*`, cust, '', `*Page:* ${page}`, `*Sent:* ${now} (Dubai)`].join('\n');
}

/** Rewrites a wa.me URL so its text is the laid-out version. */
export function formatWaUrl(href: string): string {
  try { const u = new URL(href, typeof location !== 'undefined' ? location.href : 'https://x'); if (!/wa\.me$|api\.whatsapp\.com$/.test(u.hostname)) return href; const t = u.searchParams.get('text'); if (t == null) return href; u.searchParams.set('text', formatWa(t)); return u.toString(); } catch { return href; }
}
