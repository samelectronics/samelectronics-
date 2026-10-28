'use client';
// P5 · When Supabase is connected, the catalogue (products, prices, stock) is read from the database instead of the
// bundled sample file, so every change made in the Control Room shows on the site at once. Without Supabase, nothing happens.
import { createClient } from '@supabase/supabase-js';
import { invalidate } from './catalog';

let done = false;
export async function loadRemoteCatalog() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (done || !url || !key || typeof window === 'undefined') return; done = true;
  try {
    const sb = createClient(url, key);
    const { data, error } = await sb.from('products_public').select('*').limit(20000);
    const w = window as unknown as { SE_DATA?: { products: unknown[] } };
    if (error || !data || !w.SE_DATA) return;
    w.SE_DATA.products = data.map((p) => ({ ...p, retail_price: +p.retail_price, wholesale_price: p.wholesale_price == null ? 0 : +p.wholesale_price, badges: p.badges || [] }));
    invalidate();
  } catch { /* keep the bundled catalogue */ }
}
