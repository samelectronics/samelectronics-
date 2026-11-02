// R9 · Daftra, "the brain": the shop's stock, prices, clients, quotations and invoices live in Daftra
// (https://<DAFTRA_SUBDOMAIN>.daftra.com). This server-only helper talks to its API with DAFTRA_API_KEY (set in Vercel,
// never in the code or the browser). Read-only unless DAFTRA_ALLOW_WRITE=1, and then only quotations and invoices.
export const daftraReady = () => !!(process.env.DAFTRA_API_KEY && process.env.DAFTRA_SUBDOMAIN);
export const canWrite = () => process.env.DAFTRA_ALLOW_WRITE === '1';
const base = () => `https://${process.env.DAFTRA_SUBDOMAIN}.daftra.com/api2/`;

/** Which Daftra paths the Control Room may read, and which it may create (when writing is allowed). */
export const READ = /^(products|clients|invoices|estimates|stores|product_categories|suppliers|purchase_invoices|payments|invoice_payments)(\/\d+)?\.json$/;
export const WRITE = /^$/; // writes only go through send() below, one confirmed document at a time

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

/** R9 · "Send to Daftra": one website order → one Daftra quotation (estimate) or draft invoice, after staff confirm it.
 *  The client is an existing Daftra client (clientId) or created from the order's customer. Returns Daftra's id and number.
 *  Body shapes follow Daftra's API v2 (Invoice/InvoiceItem, Estimate/EstimateItem, Client); check the first test document. */
export type SendItem = { name: string; description?: string; unit_price: number; quantity: number; product_id?: string };
export type SendReq = { type: 'estimate' | 'invoice'; ref: string; clientId?: string; newClient?: { name: string; email?: string; phone?: string }; items: SendItem[]; notes?: string };
const sent = new Map<string, { id: string; no: string }>(); // the same order is never sent twice from one server
export async function send(r: SendReq): Promise<{ ok: true; id: string; no: string; type: string; warn?: string } | { ok: false; error: string; status: number }> {
  if (!canWrite()) return { ok: false, status: 403, error: 'Writing to Daftra is off (DAFTRA_ALLOW_WRITE).' };
  if (!r.ref || !r.items?.length) return { ok: false, status: 400, error: 'Nothing to send.' };
  const key = r.type + ':' + r.ref, had = sent.get(key); if (had) return { ok: false, status: 409, error: `Already sent: ${r.type} ${had.no}` };
  let clientId = r.clientId;
  if (!clientId) {
    const c = r.newClient; if (!c?.name) return { ok: false, status: 400, error: 'Pick a Daftra client or create one.' };
    const cr = await daftra('clients.json', { method: 'POST', body: { Client: { business_name: c.name, ...(c.email ? { email: c.email } : {}), ...(c.phone ? { phone1: c.phone } : {}), country_code: 'AE', default_currency_code: 'AED' } } });
    if (!cr.ok) return { ok: false, status: cr.status, error: 'Could not create the client: ' + cr.error };
    clientId = String((cr.data as { id?: unknown }).id || '');
    if (!clientId) return { ok: false, status: 502, error: 'Daftra did not return the new client id.' };
  }
  const today = new Date(Date.now() + 4 * 36e5).toISOString().slice(0, 10); // Dubai date
  const items = r.items.map((i) => ({ item: i.name.slice(0, 250), description: i.description || '', unit_price: i.unit_price, quantity: i.quantity, ...(i.product_id ? { product_id: i.product_id } : {}) }));
  // Daftra docs: header object + an "InvoiceItem" array for invoices AND estimates; only client_id is required.
  // Invoices are created as drafts. For estimates the docs show the header both as "Estimate" and as "Invoice", so both
  // keys carry the same header (the server reads its own).
  const head = { client_id: clientId, date: today, currency_code: 'AED', draft: 1, notes: ((r.notes || '') + '\nWebsite order ' + r.ref).trim() };
  const body = r.type === 'invoice' ? { Invoice: head, InvoiceItem: items } : { Estimate: head, Invoice: head, InvoiceItem: items };
  const res = await daftra(r.type + 's.json', { method: 'POST', body });
  if (!res.ok) return { ok: false, status: res.status, error: res.error };
  const id = String((res.data as { id?: unknown }).id || '');
  let warn = '';
  let no = String((res.data as { no?: unknown; number?: unknown }).no || (res.data as { number?: unknown }).number || id);
  if (id) { const g = await daftra(r.type + 's/' + id + '.json'); const row = g.ok ? rows({ data: [(g.data as { data?: unknown }).data] })[0] : null; if (row && row.no) no = String(row.no); if (row && Array.isArray((g.data as { data?: { InvoiceItem?: unknown[] } }).data?.InvoiceItem) && !(g.data as { data: { InvoiceItem: unknown[] } }).data.InvoiceItem.length) warn = 'Created, but Daftra shows no items on it: check it in Daftra.'; }
  sent.set(key, { id, no });
  return { ok: true, id, no, type: r.type, ...(warn ? { warn } : {}) };
}
