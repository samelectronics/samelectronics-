'use client';
// P1 · One store for everything a visitor keeps while browsing, shared by every page (home, shop, account…):
// cart, favourites (stars), saved for later, compare, "My devices", stock alerts, recent searches and recently viewed.
// Kept on this device (localStorage) for guests; when someone signs in and Supabase is connected, src/lib/backend syncs
// it to their account (tables cart_items, favourites, devices, alerts in supabase/schema.sql).
import { useSyncExternalStore } from 'react';
import { allowed } from './prefs';
import { notify } from './notes';

export type Line = { id: string; qty: number; at: number };
export type Device = { model_id: string; name: string; nick?: string };
export type State = {
  cart: Line[]; favs: string[]; saved: string[]; compare: string[]; devices: Device[]; alerts: string[];
  recent: string[]; viewed: string[]; kits: { name: string; ids: string[] }[];
};
const KEY = 'se-store-v1';
const EMPTY: State = { cart: [], favs: [], saved: [], compare: [], devices: [], alerts: [], recent: [], viewed: [], kits: [] };
let state: State = EMPTY, loaded = false;
const subs = new Set<() => void>();
function load() {
  if (loaded || typeof window === 'undefined') return; loaded = true;
  try { state = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* private mode */ }
  window.addEventListener('storage', (e) => { if (e.key === KEY) { loaded = false; load(); emit(); } });
}
function emit() { subs.forEach((f) => f()); if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('se:store', { detail: state })); }
// R9: recent searches and recently viewed parts are only kept on the device when the visitor allowed the Memory Chip
function set(patch: Partial<State>) { load(); state = { ...state, ...patch }; try { const keep = allowed('memory') ? state : { ...state, recent: [], viewed: [] }; localStorage.setItem(KEY, JSON.stringify(keep)); } catch { /* full or blocked */ } emit(); }
export const get = (): State => { load(); return state; };
export function useStore(): State {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, get, () => EMPTY);
}
const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [id, ...list]);

export const store = {
  add(id: string, qty = 1) { const c = get().cart, ex = c.find((x) => x.id === id); set({ cart: ex ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x)) : [...c, { id, qty, at: Date.now() }], saved: get().saved.filter((x) => x !== id) }); },
  qty(id: string, qty: number) { set({ cart: qty <= 0 ? get().cart.filter((x) => x.id !== id) : get().cart.map((x) => (x.id === id ? { ...x, qty } : x)) }); },
  remove(id: string) { set({ cart: get().cart.filter((x) => x.id !== id) }); },
  clear() { set({ cart: [] }); },
  later(id: string) { set({ cart: get().cart.filter((x) => x.id !== id), saved: [id, ...get().saved.filter((x) => x !== id)] }); },
  fav(id: string) { set({ favs: toggle(get().favs, id) }); },
  cmp(id: string) { const c = get().compare; set({ compare: c.includes(id) ? c.filter((x) => x !== id) : [...c, id].slice(-3) }); },
  alert(id: string) { const on = !get().alerts.includes(id); set({ alerts: toggle(get().alerts, id) }); if (on) notify({ kind: 'stock', t: 'Alert set', d: 'We will tell you here when the price drops or stock is back.', href: '/account#saved' }); },
  device(d: Device) { const l = get().devices; set({ devices: l.some((x) => x.model_id === d.model_id) ? l.filter((x) => x.model_id !== d.model_id) : [...l, d].slice(-8) }); },
  searched(q: string) { q = q.trim(); if (q.length < 2) return; set({ recent: [q, ...get().recent.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 8) }); },
  forget(q?: string) { set({ recent: q ? get().recent.filter((x) => x !== q) : [] }); },
  view(id: string) { set({ viewed: [id, ...get().viewed.filter((x) => x !== id)].slice(0, 16) }); },
  kit(name: string, ids: string[]) { set({ kits: [{ name, ids }, ...get().kits.filter((k) => k.name !== name)].slice(0, 12) }); },
  /** R10 P2: put a part in (or take it out of) a named list such as "Shop order June" or "For Ahmed" */
  toList(name: string, id: string) { name = name.trim().slice(0, 40); if (!name) return; const k = get().kits, ex = k.find((x) => x.name === name); set({ kits: ex ? k.map((x) => (x.name === name ? { ...x, ids: x.ids.includes(id) ? x.ids.filter((i) => i !== id) : [id, ...x.ids] } : x)) : [{ name, ids: [id] }, ...k].slice(0, 12) }); },
  replace(s: Partial<State>) { set(s); },
};
if (typeof window !== 'undefined') (window as unknown as { seStore: typeof store }).seStore = store;
