// R9 · Daftra, "the brain": the shop's stock, prices, clients, quotations and invoices live in Daftra
// (https://<DAFTRA_SUBDOMAIN>.daftra.com). This server-only helper talks to its API with DAFTRA_API_KEY (set in Vercel,
// never in the code or the browser). Read-only unless DAFTRA_ALLOW_WRITE=1, and then only quotations and invoices.
export const daftraReady = () => !!(process.env.DAFTRA_API_KEY && process.env.DAFTRA_SUBDOMAIN);
export const canWrite = () => process.env.DAFTRA_ALLOW_WRITE === '1';
const base = () => `https://${process.env.DAFTRA_SUBDOMAIN}.daftra.com/api2/`;

/** Which Daftra paths the Control Room may read, and which it may create (when writing is allowed). */
export const READ = /^(products|clients|invoices|estimates|stores|product_categories|suppliers|purchase_invoices|payments|invoice_payments)(\/\d+)?\.json$/;
export const WRITE = /^(estimates|invoices)\.json$/;

export async function daftra(path: string, init?: { method?: string; body?: unknown; query?: string }) {
  if (!daftraReady()) return { ok: false as const, status: 503, error: 'Daftra is not connected: add DAFTRA_API_KEY and DAFTRA_SUBDOMAIN in Vercel.' };
  const r = await fetch(base() + path + (init?.query ? '?' + init.query : ''), {
    method: init?.method || 'GET', cache: 'no-store',
    headers: { APIKEY: process.env.DAFTRA_API_KEY as string, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  }).catch((e) => ({ ok: false, status: 502, json: async () => ({ message: String(e) }) }) as unknown as Response);
  const j = await r.json().catch(() => ({}));
  return r.ok ? { ok: true as const, status: r.status, data: j } : { ok: false as const, status: r.status, error: (j && (j.message || j.result)) || 'Daftra error ' + r.status };
}

/** Daftra wraps each row as { Product: {...} } / { Client: {...} }; this unwraps lists into plain rows. */
export const rows = (j: unknown): Record<string, unknown>[] => { const d = (j as { data?: unknown[] })?.data; return Array.isArray(d) ? d.map((x) => { const v = Object.values(x as object)[0]; return (v && typeof v === 'object' ? v : x) as Record<string, unknown>; }) : []; };
