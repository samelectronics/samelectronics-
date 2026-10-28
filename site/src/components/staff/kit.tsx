'use client';
// P5 · Control Room building blocks: a saved setting hook, panels, KPI tiles, a sortable/searchable table, a tiny bar chart,
// CSV export, and the "who can do what" check.
import React, { useEffect, useMemo, useState } from 'react';
import { backend, type Perm, type Staff } from '@/lib/backend';

export const can = (me: Staff, p: Perm) => me.role === 'owner' || me.role === 'manager' || me.perms.includes(p);
export const money = (n: number) => 'AED ' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const day = (t: number) => new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
export const when = (t: number) => new Date(t).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

/** a value kept in the backend's settings (demo: this browser; Supabase: the settings table), with an audit entry on save */
export function useSetting<T>(key: string, fallback: T): [T, (v: T, note?: string) => Promise<void>, boolean] {
  const [v, setV] = useState<T>(fallback), [ok, setOk] = useState(false);
  useEffect(() => { let a = true; backend.setting(key, fallback).then((x) => { if (a) { setV(x); setOk(true); } }); return () => { a = false; }; }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async (x: T, note?: string) => { setV(x); await backend.saveSetting(key, x); await backend.log('setting.save', key, note); };
  return [v, save, ok];
}

export function Panel({ t, d, right, children, className }: { t: string; d?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={'cr-panel' + (className ? ' ' + className : '')}>
      <header><div><h3>{t}</h3>{d ? <p>{d}</p> : null}</div>{right ? <span className="cr-ph-r">{right}</span> : null}</header>
      <div className="cr-pb">{children}</div>
    </section>
  );
}
export function Kpi({ l, v, s, tone, onClick }: { l: string; v: string | number; s?: string; tone?: 'y' | 'g' | 'r' | 'd'; onClick?: () => void }) {
  return <button type="button" className={'cr-kpi' + (tone ? ' ' + tone : '')} onClick={onClick} disabled={!onClick}><small>{l}</small><b>{v}</b>{s ? <span>{s}</span> : null}</button>;
}
export function Bars({ data, h = 160, fmt = (n: number) => String(Math.round(n)) }: { data: { l: string; v: number; v2?: number }[]; h?: number; fmt?: (n: number) => string }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.v, d.v2 || 0)));
  return (
    <div className="cr-bars" style={{ height: h }}>
      {data.map((d, i) => (
        <span key={i} className="cr-bar" title={d.l + ': ' + fmt(d.v)}>
          <i style={{ height: (d.v / max) * 100 + '%' }} />{d.v2 != null ? <em style={{ height: (d.v2 / max) * 100 + '%' }} /> : null}
          <small>{d.l}</small>
        </span>
      ))}
    </div>
  );
}
export type Col<T> = { k: string; l: string; w?: string; get: (r: T) => React.ReactNode; sort?: (r: T) => number | string; cls?: string };
export function Table<T>({ rows, cols, search, empty = 'Nothing here yet.', onRow, pageSize = 50, actions }: { rows: T[]; cols: Col<T>[]; search?: (r: T) => string; empty?: string; onRow?: (r: T) => void; pageSize?: number; actions?: React.ReactNode }) {
  const [q, setQ] = useState(''), [sk, setSk] = useState<string | null>(null), [dir, setDir] = useState(1), [n, setN] = useState(pageSize);
  const list = useMemo(() => {
    let l = search && q ? rows.filter((r) => search(r).toLowerCase().includes(q.toLowerCase())) : rows;
    const c = cols.find((x) => x.k === sk); if (c && c.sort) l = [...l].sort((a, b) => { const x = c.sort!(a), y = c.sort!(b); return (x > y ? 1 : x < y ? -1 : 0) * dir; });
    return l;
  }, [rows, q, sk, dir, cols, search]);
  return (
    <div className="cr-table">
      {search || actions ? <div className="cr-tbar">{search ? <input className="cr-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" /> : null}<small>{list.length} rows</small>{actions}</div> : null}
      <div className="cr-tscroll">
        <table>
          <thead><tr>{cols.map((c) => <th key={c.k} style={{ width: c.w }} className={c.sort ? 'srt' + (sk === c.k ? (dir > 0 ? ' up' : ' dn') : '') : ''} onClick={() => { if (!c.sort) return; if (sk === c.k) setDir(-dir); else { setSk(c.k); setDir(1); } }}>{c.l}</th>)}</tr></thead>
          <tbody>
            {list.slice(0, n).map((r, i) => <tr key={i} onClick={onRow ? () => onRow(r) : undefined} className={onRow ? 'click' : ''}>{cols.map((c) => <td key={c.k} className={c.cls}>{c.get(r)}</td>)}</tr>)}
            {!list.length ? <tr><td colSpan={cols.length} className="cr-empty">{empty}</td></tr> : null}
          </tbody>
        </table>
      </div>
      {list.length > n ? <button type="button" className="cr-more" onClick={() => setN(n + pageSize)}>Show {Math.min(pageSize, list.length - n)} more</button> : null}
    </div>
  );
}
export function csv(name: string, rows: (string | number)[][]) {
  const body = rows.map((r) => r.map((x) => { const s = String(x ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' })); a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
export function Drawer({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="cr-veil" onClick={onClose} />
      <aside className={'cr-drawer' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title}>
        <header><h3>{title}</h3><button type="button" className="cr-x" onClick={onClose} aria-label="Close">×</button></header>
        <div className="cr-dbody">{children}</div>
      </aside>
    </>
  );
}
export const Badge = ({ t, tone }: { t: string; tone?: 'y' | 'g' | 'r' | 'd' | 'b' }) => <span className={'cr-badge' + (tone ? ' ' + tone : '')}>{t}</span>;
