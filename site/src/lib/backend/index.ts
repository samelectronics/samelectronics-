'use client';
// P1 · `backend` = Supabase when its keys are set, otherwise the demo kept in this browser. Pages import only this.
import { useEffect, useState } from 'react';
import { local } from './local';
import { supabase } from './supabase';
import type { Backend, Staff, User } from './types';
export * from './types';

export const live = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const backend: Backend = live ? supabase : local;

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
