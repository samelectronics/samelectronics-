'use client';
// Owner (18 Nov) approved Samsoom's "stock alerts" and "price watch". A part is watched from the chat, the shop or the
// part page (store.alert). Here we keep what it looked like when the watch started (price, stock) and, every time the
// site opens, compare it with the live catalogue: back in stock or a lower price rings the bell (notes) once.
import { byId, priceText } from './catalog';
import { get } from './store';
import { notify } from './notes';

type Base = { price: number; stock: number; at: number; kind: 'stock' | 'price' | 'both' };
const KEY = 'se-watch';
const read = (): Record<string, Base> => { try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const write = (m: Record<string, Base>) => { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* private mode */ } };

/** remember the part as it is now, so a later change can be spotted */
export function watchBase(id: string, kind: Base['kind'] = 'both') {
  const p = byId(id); if (!p) return; const m = read(); m[id] = { price: p.price, stock: p.stock_qty, at: Date.now(), kind }; write(m);
}
export function unwatch(id: string) { const m = read(); delete m[id]; write(m); }
export const watchKind = (id: string): Base['kind'] | null => read()[id]?.kind || null;

/** compare every watched part with the live catalogue; returns what changed (and rings the bell for each) */
export function checkWatches(): { id: string; what: 'back' | 'drop'; from?: number; to?: number }[] {
  if (typeof window === 'undefined') return [];
  const ids = get().alerts, m = read(), out: { id: string; what: 'back' | 'drop'; from?: number; to?: number }[] = [];
  for (const id of ids) {
    const p = byId(id); if (!p) continue;
    const b = m[id]; if (!b) { m[id] = { price: p.price, stock: p.stock_qty, at: Date.now(), kind: 'both' }; continue; }
    const name = p.modelName + ' ' + p.catName + ' · ' + p.gradeName;
    if (b.kind !== 'price' && b.stock <= 0 && p.stock_qty > 0) { out.push({ id, what: 'back' }); notify({ id: 'w-back-' + id + '-' + Math.floor(Date.now() / 864e5), kind: 'stock', t: 'Back in stock', d: name, href: '/shop?p=' + id }); }
    if (b.kind !== 'stock' && p.price > 0 && b.price > 0 && p.price < b.price) { out.push({ id, what: 'drop', from: b.price, to: p.price }); notify({ id: 'w-drop-' + id + '-' + p.price, kind: 'offer', t: 'Price dropped', d: name + ' · ' + priceText(b.price) + ' → ' + priceText(p.price), href: '/shop?p=' + id }); }
    m[id] = { ...b, price: p.price, stock: p.stock_qty };
  }
  for (const k of Object.keys(m)) if (!ids.includes(k)) delete m[k];
  write(m);
  return out;
}
