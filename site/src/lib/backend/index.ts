'use client';
// P1 · `backend` = Supabase when its keys are set, otherwise the demo kept in this browser. Pages import only this.
import { useEffect, useState } from 'react';
import { local } from './local';
import type { Backend, Staff, User } from './types';
export * from './types';

/** R9 · design preview: ?preview=1 runs this browser tab on the sample demo data (nothing is read from or written to the
 *  real database; Daftra stays locked on the server). ?preview=0 or "Exit preview" ends it. For checking design only. */
// R10 S6: the design preview is gone once the real database is connected (it only exists on a site without Supabase)
export const preview = typeof window !== 'undefined' && !(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (() => { try { const q = new URLSearchParams(location.search).get('preview'); if (q === '1') sessionStorage.setItem('se-preview', '1'); if (q === '0') sessionStorage.removeItem('se-preview'); return sessionStorage.getItem('se-preview') === '1'; } catch { return false; } })();
export const live = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && !preview;
// R10 perf: the Supabase client (≈250 kB) is its own chunk, fetched on the first database call instead of with every page
let sbP: Promise<Backend> | null = null;
const sb = () => (sbP = sbP || import('./supabase').then((m) => m.supabase));
const lazy = new Proxy({ mode: 'supabase' } as Backend, { get: (t, k) => (k === 'mode' ? 'supabase' : k === 'then' ? undefined : (...a: unknown[]) => sb().then((b) => (b as unknown as Record<string, (...x: unknown[]) => unknown>)[k as string](...a))) });
export const backend: Backend = live ? lazy : local;
export const staffToken = async (): Promise<string | null> => (live ? (await import('./supabase')).accessToken() : null);

/** the signed-in customer (null = guest, undefined = still checking); refreshes when anyone signs in or out */
export function useMe(): [User | null | undefined, () => void] {
  const [me, setMe] = useState<User | null | undefined>(undefined), [n, setN] = useState(0);
  useEffect(() => {
    let live_ = true; backend.me().then((u) => live_ && setMe(u));
    const on = () => backend.me().then((u) => live_ && setMe(u)); window.addEventListener('se:db', on); window.addEventListener('se:auth', on);
    return () => { live_ = false; window.removeEventListener('se:db', on); window.removeEventListener('se:auth', on); };
  }, [n]);
  return [me, () => { setN((x) => x + 1); window.dispatchEvent(new CustomEvent('se:auth')); }];
}
export function useStaff(): [Staff | null | undefined, () => void] {
  const [me, setMe] = useState<Staff | null | undefined>(undefined), [n, setN] = useState(0);
  useEffect(() => { let a = true; backend.staffMe().then((s) => a && setMe(s)); return () => { a = false; }; }, [n]);
  return [me, () => setN((x) => x + 1)];
}
