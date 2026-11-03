'use client';
// P5 · THE CONTROL ROOM (/staff), "super important" (owner). Staff log in with their own account; what each person sees
// and can change follows their role (owner and managers: everything; others: their area). Modules: dashboard, products &
// prices, stock & warehouse, orders, repairs, customers, approvals, inbox (live chat), site editing (banners, Samsoom,
// texts), accounting & VAT reports, automated e-mails, staff & roles, audit log and settings.
// Demo log-ins (until Supabase is connected): owner@sam.demo / demo1234 · manager@ · sales@ · tech@ (same password).
import '@/styles/staff.css';
import React, { useEffect, useState } from 'react';
import { backend, live, preview, ROLE_NAMES, useStaff, type Perm, type Staff } from '@/lib/backend';
import { installI18n } from '@/i18n/lang';
import { installBrandSelects } from '@/lib/brandSelect';
import { can } from './kit';
import { Products, Warehouse } from './mods1';
import { Dashboard, Activity, QrLabels, Scanner, Tasks, Announcement, Reports, StaffBell, Queue, Claims, Calendar } from './mods4';
import { Orders, Repairs, Customers, Approvals, Inbox } from './mods2';
import { SiteEditor, Accounting, Emails, Team, Audit, Settings, MyProfile } from './mods3';

// R10 perf: the heavier pages are separate chunks, fetched the first time someone opens them
type MP = { me: Staff; go: (m: string) => void };
const lz = (f: () => Promise<React.ComponentType<MP>>) => { const L = React.lazy(() => f().then((C) => ({ default: C }))); const W = (p: MP) => <React.Suspense fallback={<div className="cr-lazy"><i /></div>}><L {...p} /></React.Suspense>; return W; };
const DaftraMod = lz(() => import('./DaftraMod').then((m) => m.default as React.ComponentType<MP>)), PromoMod = lz(() => import('./PromoMod').then((m) => m.default as React.ComponentType<MP>)), ExcelMod = lz(() => import('./ExcelMod').then((m) => m.default as React.ComponentType<MP>));
const M5 = () => import('./mods5');
const VisualEditor = lz(() => import('./VisualEditor').then((m) => m.default));
const Pricing = lz(() => M5().then((m) => m.Pricing)), Credit = lz(() => M5().then((m) => m.Credit)), Shipments = lz(() => M5().then((m) => m.Shipments)), BrandStudio = lz(() => M5().then((m) => m.BrandStudio)), Reminders = lz(() => M5().then((m) => m.Reminders)),
  Health = lz(() => M5().then((m) => m.Health as React.ComponentType<MP>)), Training = lz(() => M5().then((m) => m.Training)), Summary = lz(() => M5().then((m) => m.Summary)), NameParser = lz(() => M5().then((m) => m.NameParser as React.ComponentType<MP>)), StaffSam = lz(() => M5().then((m) => m.StaffSam));
if (typeof window !== 'undefined') installI18n();

type Mod = { id: string; l: string; d: string; need?: Perm[]; C: React.ComponentType<{ me: Staff; go: (m: string) => void }> };
const MODS: Mod[] = [
  { id: 'dashboard', l: 'Dashboard', d: 'M3 13h8V3H3zM13 21h8v-8h-8zM3 21h8v-6H3zM13 3v8h8V3z', C: Dashboard },
  { id: 'products', l: 'Products & prices', d: 'M20 7l-8-4-8 4 8 4zM4 7v10l8 4 8-4V7M12 11v10', need: ['products', 'prices'], C: Products },
  { id: 'warehouse', l: 'Stock & warehouse', d: 'M3 21V8l9-5 9 5v13M7 21v-6h10v6M7 12h10', need: ['stock'], C: Warehouse },
  { id: 'orders', l: 'Orders', d: 'M4 7h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8zM8 7a4 4 0 0 1 8 0', need: ['orders'], C: Orders },
  { id: 'repairs', l: 'Repairs', d: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z', need: ['repairs'], C: Repairs },
  { id: 'customers', l: 'Customers', d: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a5 5 0 0 0-4-5', need: ['customers'], C: Customers },
  { id: 'approvals', l: 'Approvals', d: 'M9 12l2 2 4-4M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z', need: ['approvals'], C: Approvals },
  { id: 'inbox', l: 'Inbox · live chat', d: 'M4 5h16v11H8l-4 4z', need: ['chat'], C: Inbox },
  { id: 'site', l: 'Site & Samsoom', d: 'M3 4h18v12H3zM8 20h8M12 16v4', need: ['content', 'banners', 'samsoom'], C: SiteEditor },
  { id: 'daftra', l: 'Daftra · the brain', d: 'M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V18h8v-3.3A7 7 0 0 0 12 2zM9 22h6M9 9h.01M15 9h.01M9 13c1.5 1 4.5 1 6 0', need: ['accounting', 'products'], C: DaftraMod },
  { id: 'excel', l: 'Excel · import & price lists', d: 'M4 3h11l5 5v13H4zM14 3v6h6M8 13l4 5M12 13l-4 5', need: ['products', 'prices', 'stock'], C: ExcelMod },
  { id: 'promo', l: 'Ads, pop-ups & events', d: 'M3 11l15-7v16L3 13zM3 11v2M18 8a4 4 0 0 1 0 8', need: ['banners', 'content'], C: PromoMod },
  { id: 'accounting', l: 'Accounting & VAT', d: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5', need: ['accounting', 'reports'], C: Accounting },
  { id: 'emails', l: 'Automated e-mails', d: 'M3 6l9 6 9-6M3 6h18v12H3z', need: ['emails'], C: Emails },
  { id: 'team', l: 'Staff & roles', d: 'M16 11a4 4 0 1 0-8 0M4 21a8 8 0 0 1 16 0', need: ['staff'], C: Team },
  { id: 'audit', l: 'Audit log', d: 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', need: ['audit'], C: Audit },
  { id: 'settings', l: 'Settings', d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', need: ['settings'], C: Settings },
  { id: 'activity', l: 'Activity Center', d: 'M3 12h4l3-8 4 16 3-8h4', need: ['audit'], C: Activity },
  { id: 'scanner', l: 'Scanner', d: 'M3 7V4h3M18 4h3v3M21 17v3h-3M6 20H3v-3M7 12h10', need: ['stock', 'products'], C: Scanner },
  { id: 'qr', l: 'QR & labels', d: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4', need: ['stock', 'products'], C: QrLabels },
  { id: 'reports', l: 'Reports', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2', need: ['reports'], C: Reports },
  { id: 'claims', l: 'Warranty & returns', d: 'M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7zM9 12l2 2 4-4', need: ['repairs', 'stock'], C: Claims },
  { id: 'queue', l: 'Walk-in queue & TV', d: 'M4 6h16M4 12h10M4 18h6', need: ['orders', 'repairs'], C: Queue },
  { id: 'calendar', l: 'Calendar', d: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4', C: Calendar },
  { id: 'tasks', l: 'Tasks & announcements', d: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', C: Tasks },
  { id: 'editor', l: 'Visual editor', d: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', need: ['content'], C: VisualEditor },
  { id: 'pricing', l: 'Pricing & coupons', d: 'M20 12l-8 8-9-9V3h8zM7.5 7.5h.01', need: ['prices'], C: Pricing },
  { id: 'credit', l: 'Customers & credit', d: 'M4 6h16v12H4zM4 10h16M8 15h4', need: ['customers'], C: Credit },
  { id: 'shipments', l: 'Shipments', d: 'M3 7h11v10H3zM14 10h4l3 3v4h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', need: ['orders'], C: Shipments },
  { id: 'brand', l: 'Brand Studio', d: 'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z', need: ['content', 'orders'], C: BrandStudio },
  { id: 'reminders', l: 'Reminders & campaigns', d: 'M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9', need: ['orders', 'customers', 'emails'], C: Reminders },
  { id: 'health', l: 'Health & data', d: 'M3 12h4l3-8 4 16 3-8h4', need: ['products', 'settings'], C: Health },
  { id: 'training', l: 'Training', d: 'M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM8 7h6', C: Training },
  { id: 'summary', l: 'Today’s summary', d: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5', need: ['reports'], C: Summary },
  { id: 'parser', l: 'Name parser', d: 'M4 7h16M4 12h10M4 17h6', need: ['products'], C: NameParser },
  { id: 'ask', l: 'Ask Samsoom', d: 'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM10 9h.01M14 9h.01M10 13a3 3 0 0 0 4 0', C: StaffSam },
  { id: 'me', l: 'My profile', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', C: MyProfile },
];

// R10 4.0 · the sidebar, grouped like Daftra: short groups that open to their pages. A group shows only the pages
// this person may open; a group with one page is a plain link.
const GROUPS: { g: string; d: string; ids: string[] }[] = [
  { g: 'Home', d: 'M3 11l9-8 9 8v10h-6v-6H9v6H3z', ids: ['dashboard', 'activity', 'summary', 'ask'] },
  { g: 'Sales', d: 'M4 7h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8zM8 7a4 4 0 0 1 8 0', ids: ['orders', 'customers', 'credit', 'approvals', 'pricing', 'accounting'] },
  { g: 'Repairs', d: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z', ids: ['repairs', 'claims'] },
  { g: 'Inventory', d: 'M20 7l-8-4-8 4 8 4zM4 7v10l8 4 8-4V7M12 11v10', ids: ['products', 'warehouse', 'shipments', 'scanner', 'qr'] },
  { g: 'Website', d: 'M3 4h18v12H3zM8 20h8M12 16v4', ids: ['editor', 'site', 'promo'] },
  { g: 'Documents', d: 'M4 3h11l5 5v13H4zM14 3v6h6', ids: ['brand', 'excel', 'reports'] },
  { g: 'Messages', d: 'M4 5h16v11H8l-4 4z', ids: ['inbox', 'reminders', 'emails'] },
  { g: 'Shop floor', d: 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6', ids: ['queue', 'tasks', 'calendar'] },
  { g: 'Team & security', d: 'M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z', ids: ['team', 'audit'] },
  { g: 'Daftra', d: 'M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V18h8v-3.3A7 7 0 0 0 12 2zM9 22h6', ids: ['daftra', 'parser'] },
  { g: 'Settings', d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', ids: ['settings', 'health', 'training', 'me'] },
];
const Ico = ({ d }: { d: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
function SideNav({ mine, cur, go }: { mine: Mod[]; cur: string; go: (m: string) => void }) {
  const has = new Map(mine.map((m) => [m.id, m]));
  const groups = GROUPS.map((g) => ({ ...g, items: g.ids.map((i) => has.get(i)).filter(Boolean) as Mod[] })).filter((g) => g.items.length);
  const [open, setOpen] = useState<string | null>(() => groups.find((g) => g.ids.includes(cur))?.g || 'Home');
  useEffect(() => { const g = groups.find((x) => x.ids.includes(cur)); if (g) setOpen(g.g); }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <nav className="cr-gnav">{groups.map((g) => g.items.length === 1 ? (
      <button key={g.g} type="button" className={'cr-g1' + (cur === g.items[0].id ? ' on' : '')} onClick={() => go(g.items[0].id)}><Ico d={g.d} /><span>{g.g === 'Settings' ? g.items[0].l : g.g === 'Daftra' ? 'Daftra · the brain' : g.items[0].l}</span></button>
    ) : (
      <div key={g.g} className={'cr-grp' + (open === g.g ? ' open' : '') + (g.ids.includes(cur) ? ' has' : '')}>
        <button type="button" className="cr-gh" aria-expanded={open === g.g} onClick={() => setOpen(open === g.g ? null : g.g)}><Ico d={g.d} /><span>{g.g}</span><i /></button>
        <div className="cr-gi"><div>{g.items.map((m) => <button key={m.id} type="button" className={cur === m.id ? 'on' : ''} onClick={() => go(m.id)}><span>{m.l}</span></button>)}</div></div>
      </div>
    ))}</nav>
  );
}


function Palette({ mine, go }: { mine: Mod[]; go: (m: string) => void }) {
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [i, setI] = useState(0);
  useEffect(() => { const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); setQ(''); setI(0); } else if (e.key === 'Escape') setOpen(false); }; const o = () => { setOpen(true); setQ(''); setI(0); }; window.addEventListener('keydown', k); window.addEventListener('cr:palette', o); return () => { window.removeEventListener('keydown', k); window.removeEventListener('cr:palette', o); }; }, []);
  if (!open) return null;
  const hits = mine.filter((m) => !q || m.l.toLowerCase().includes(q.toLowerCase())).slice(0, 9);
  const pick = (m: Mod) => { setOpen(false); go(m.id); };
  return <div className="cr-pal" onClick={() => setOpen(false)}><div onClick={(e) => e.stopPropagation()}><input autoFocus value={q} placeholder="Go to…  (Ctrl+K)" onChange={(e) => { setQ(e.target.value); setI(0); }} onKeyDown={(e) => { if (e.key === 'ArrowDown') setI(Math.min(hits.length - 1, i + 1)); if (e.key === 'ArrowUp') setI(Math.max(0, i - 1)); if (e.key === 'Enter' && hits[i]) pick(hits[i]); }} />{hits.map((m, k) => <button key={m.id} type="button" className={k === i ? 'on' : ''} onClick={() => pick(m)}>{m.l}</button>)}</div></div>;
}

// R10 S2 · S4 · S6 · S7: the Control Room door. Three locks, one after the other, on a teardown-style stage (no Samsoom):
//  1. the Control Room key (checked on the server, /api/staff/gate), 2. personal e-mail + password, 3. the personal
//  6-digit code from an authenticator app (set up here the first time, with a QR code). 5 wrong passwords on this device
//  lock the form for 15 minutes; "Forgot password?" sends a reset link. The design preview is gone once the site is live.
type Step = 'checking' | 'gate' | 'pw' | 'code' | 'enroll' | 'newpw' | 'sent';
const LOCK_KEY = 'cr-lock';
const lockLeft = () => { try { const v = JSON.parse(localStorage.getItem(LOCK_KEY) || '{}'); return v.until && v.until > Date.now() ? Math.ceil((v.until - Date.now()) / 60000) : 0; } catch { return 0; } };
const failOnce = () => { try { const v = JSON.parse(localStorage.getItem(LOCK_KEY) || '{}'); const n = (v.n || 0) + 1; localStorage.setItem(LOCK_KEY, JSON.stringify(n >= 5 ? { n: 0, until: Date.now() + 15 * 60000 } : { n })); return n >= 5 ? 0 : 5 - n; } catch { return 5; } };

function Door({ children, step, keyOff }: { children: React.ReactNode; step: number; keyOff?: boolean }) {
  return (
    <div className="cr-door">
      <span className="cr-door-l a" aria-hidden="true" /><span className="cr-door-l b" aria-hidden="true" /><span className="cr-door-l c" aria-hidden="true" />
      <div className="cr-door-card">
        <span className="cr-brand"><img src="/assets/se-logo-128.webp" alt="" /><span><b>SAM ELECTRONICS</b><small>CONTROL ROOM · STAFF ONLY</small></span></span>
        <ol className="cr-locks" aria-label="Three locks">{['Key', 'Password', '6-digit code'].map((l, i) => i === 0 && keyOff ? <li key={l} className="off"><i>!</i>Key · off</li> : <li key={l} className={i < step ? 'done' : i === step ? 'on' : ''}><i>{i < step ? '✓' : i + 1}</i>{l}</li>)}</ol>
        {children}
        <div className="cr-door-help"><a href={'https://wa.me/971503420015?text=' + encodeURIComponent('Hi, I need help signing in to the Control Room.')} target="_blank" rel="noopener noreferrer">Talk to a person</a><span>·</span><a href="/samsoom">Ask Samsoom</a><span>·</span><a href="/">Back to the website</a></div>
      </div>
    </div>
  );
}

function Login({ onDone, start }: { onDone: () => void; start?: Step }) {
  const [step, setStep] = useState<Step>(start || 'checking'), [email, setEmail] = useState(''), [pw, setPw] = useState(''), [pw2, setPw2] = useState(''), [key, setKey] = useState(''), [code, setCode] = useState('');
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false), [gateMissing, setGateMissing] = useState(false), [enr, setEnr] = useState<{ id: string; qr: string; secret: string } | null>(null), [factor, setFactor] = useState<string | null>(null);
  const sb = () => import('@/lib/backend/supabase');
  const toMfa = async () => {
    if (!live) { onDone(); return; }
    const m = await (await sb()).mfaState();
    if (m.level === 'aal2') { onDone(); return; }
    if (m.enrolled) { setFactor(m.factorId); setStep('code'); return; }
    const e = await (await sb()).mfaEnroll(); if ('error' in e) { setErr(e.error); setStep('enroll'); return; }
    setEnr(e); setFactor(e.id); setStep('enroll');
  };
  useEffect(() => {
    if (start) { if (start === 'code') toMfa(); return; }
    if (live && new URLSearchParams(location.search).get('reset') === '1') { setStep('newpw'); return; }
    fetch('/api/staff/gate', { cache: 'no-store' }).then((r) => r.json()).then((g) => { if (g.configured && !g.open) setStep('gate'); else { setGateMissing(!g.configured); setStep('pw'); } }).catch(() => setStep('pw'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const doGate = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setErr(''); const r = await fetch('/api/staff/gate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key }) }).then((x) => x.json()).catch(() => ({ ok: false, error: 'No connection.' })); setBusy(false); setKey(''); if (r.ok) setStep('pw'); else setErr(r.error); };
  const doPw = async (e: React.FormEvent) => {
    e.preventDefault(); const l = lockLeft(); if (l) { setErr('Too many wrong passwords on this device. Try again in ' + l + ' min.'); return; }
    setBusy(true); setErr(''); const r = await backend.staffSignIn(email, pw); setBusy(false); setPw('');
    if (!r.ok) { const left = failOnce(); setErr(left ? r.error + ' (' + left + ' tries left)' : 'Too many wrong passwords. The form is locked for 15 minutes.'); return; }
    try { localStorage.removeItem(LOCK_KEY); } catch { /* */ } await toMfa();
  };
  const doCode = async (e: React.FormEvent) => { e.preventDefault(); if (!factor) return; setBusy(true); setErr(''); const m = await (await sb()).mfaVerify(factor, code); setBusy(false); setCode(''); if (m) setErr(m); else onDone(); };
  const doReset = async () => { if (!email) { setErr('Type your e-mail first, then press "Forgot password?".'); return; } setBusy(true); const m = live ? await (await sb()).staffPasswordReset(email) : null; setBusy(false); if (m) setErr(m); else setStep('sent'); };
  const doNew = async (e: React.FormEvent) => { e.preventDefault(); if (pw.length < 10) { setErr('Use at least 10 characters.'); return; } if (pw !== pw2) { setErr('The two passwords are not the same.'); return; } setBusy(true); const m = await (await sb()).setNewPassword(pw); setBusy(false); if (m) setErr(m); else { history.replaceState(null, '', '/staff'); await toMfa(); } };
  const stepNo = step === 'gate' ? 0 : step === 'pw' || step === 'sent' || step === 'newpw' ? 1 : step === 'checking' ? 0 : 2;
  if (step === 'checking') return <Door step={0}><div className="cr-door-wait"><i /></div></Door>;
  return (
    <Door step={stepNo} keyOff={gateMissing}>
      {step === 'gate' ? (
        <form onSubmit={doGate}>
          <h1>Control Room key</h1><p>The shared key from the owner. It opens the door to the staff sign-in on this device for 12 hours.</p>
          <label>Key<input className="cr-in" type="password" required autoFocus value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" /></label>
          {err ? <span className="cr-err">{err}</span> : null}
          <button type="submit" className="cr-btn y big" disabled={busy}>{busy ? 'Checking…' : 'Unlock'}</button>
        </form>
      ) : step === 'pw' ? (
        <form onSubmit={doPw}>
          <h1>Sign in</h1><p>Your personal staff account.</p>
          {gateMissing ? <span className="cr-note">The Control Room key is not set yet. The owner adds CONTROL_ROOM_KEY in Vercel to switch on the first lock.</span> : null}
          <label>E-mail<input className="cr-in" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
          <label>Password<input className="cr-in" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></label>
          {err ? <span className="cr-err">{err}</span> : null}
          <button type="submit" className="cr-btn y big" disabled={busy}>{busy ? 'Signing in…' : 'Continue'}</button>
          <button type="button" className="cr-link" onClick={doReset}>Forgot password?</button>
          {!live && !preview ? (
            <div className="cr-demo"><b>Demo log-ins</b> (until the database is connected)
              {[['owner@sam.demo', 'Owner · everything'], ['manager@sam.demo', 'Manager · everything'], ['sales@sam.demo', 'Sales · orders, customers, chat'], ['tech@sam.demo', 'Technician · repairs, stock']].map(([e, r]) => <button key={e} type="button" onClick={() => { setEmail(e); setPw('demo1234'); }}><span>{e}</span><small>{r}</small></button>)}
              <small>Password: demo1234</small>
            </div>
          ) : <small className="cr-muted">Staff accounts are by invitation from the owner.</small>}
        </form>
      ) : step === 'sent' ? (
        <div className="cr-door-msg"><h1>Check your e-mail</h1><p>If {email} is a staff account, a link to choose a new password is on its way. It works once.</p><button type="button" className="cr-btn ghost" onClick={() => setStep('pw')}>Back to sign-in</button></div>
      ) : step === 'newpw' ? (
        <form onSubmit={doNew}>
          <h1>New password</h1><p>At least 10 characters. Then you confirm with your 6-digit code.</p>
          <label>New password<input className="cr-in" type="password" required autoFocus value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></label>
          <label>Repeat it<input className="cr-in" type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></label>
          {err ? <span className="cr-err">{err}</span> : null}
          <button type="submit" className="cr-btn y big" disabled={busy}>Save password</button>
        </form>
      ) : step === 'enroll' ? (
        <form onSubmit={doCode}>
          <h1>Set up your 6-digit code</h1><p>Every staff account needs it. Open an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password…), scan this code, then type the 6 digits it shows.</p>
          {enr ? <div className="cr-qr"><img src={enr.qr} alt="QR code for your authenticator app" width={176} height={176} /><span>Can’t scan? Type this key:<code>{enr.secret.replace(/(.{4})/g, '$1 ').trim()}</code></span></div> : null}
          <label>6-digit code<input className="cr-in cr-code" inputMode="numeric" pattern="[0-9 ]{6,7}" maxLength={7} required autoFocus value={code} onChange={(e) => setCode(e.target.value)} autoComplete="one-time-code" /></label>
          {err ? <span className="cr-err">{err}</span> : null}
          <button type="submit" className="cr-btn y big" disabled={busy || !enr}>{busy ? 'Checking…' : 'Turn on and enter'}</button>
          <small className="cr-muted">Lost your phone later? The owner can reset your two-step in Staff & roles.</small>
        </form>
      ) : (
        <form onSubmit={doCode}>
          <h1>Your 6-digit code</h1><p>From the authenticator app on your phone.</p>
          <label>6-digit code<input className="cr-in cr-code" inputMode="numeric" pattern="[0-9 ]{6,7}" maxLength={7} required autoFocus value={code} onChange={(e) => setCode(e.target.value)} autoComplete="one-time-code" /></label>
          {err ? <span className="cr-err">{err}</span> : null}
          <button type="submit" className="cr-btn y big" disabled={busy}>{busy ? 'Checking…' : 'Open the Control Room'}</button>
          <button type="button" className="cr-link" onClick={async () => { await backend.staffSignOut(); location.reload(); }}>Use another account</button>
        </form>
      )}
    </Door>
  );
}

export default function StaffApp() {
  const [me, refresh] = useStaff(), [mod, setMod] = useState('dashboard'), [nav, setNav] = useState(false);
  useEffect(() => { const h = () => setMod(location.hash.slice(1) || 'dashboard'); h(); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h); }, []);
  useEffect(() => { installBrandSelects(); document.documentElement.classList.add('cr-html'); return () => document.documentElement.classList.remove('cr-html'); }, []);
  // R10 S4: a signed-in staff session still needs its 6-digit code (aal2) before anything shows
  const [lvl, setLvl] = useState<'checking' | 'ok' | 'need'>(live ? 'checking' : 'ok');
  useEffect(() => { if (!live || !me) return; import('@/lib/backend/supabase').then((m) => m.mfaState()).then((m) => setLvl(m.level === 'aal2' ? 'ok' : 'need')).catch(() => setLvl('need')); }, [me]);
  if (me === undefined || (me && lvl === 'checking')) return <div className="cr-boot"><i /></div>;
  if (!me) return <Login onDone={() => { setLvl(live ? 'checking' : 'ok'); refresh(); }} />;
  if (lvl === 'need') return <Login start="code" onDone={() => setLvl('ok')} />;
  const mine = MODS.filter((m) => !m.need || m.need.some((p) => can(me, p)));
  const cur = mine.find((m) => m.id === mod) || mine[0];
  const go = (m: string) => { history.replaceState(null, '', '#' + m); setMod(m); setNav(false); document.querySelector('.cr-main')?.scrollTo({ top: 0 }); };
  return (
    <div className="cr">
      <aside className={'cr-side' + (nav ? ' open' : '')}>
        <a className="cr-brand" href="#dashboard" onClick={() => go('dashboard')}><img src="/assets/se-logo-128.webp" alt="" /><span><b>CONTROL ROOM</b><small>Sam Electronics</small></span></a>
        <SideNav mine={mine} cur={cur.id} go={go} />
        <div className="cr-who">
          <span className="cr-av">{me.photo ? <img src={me.photo} alt="" /> : me.name.slice(0, 1)}</span>
          <span><b>{me.name}</b><small>{ROLE_NAMES[me.role]} · {me.branch}</small></span>
          <button type="button" className="cr-out" title="Sign out" onClick={async () => { await backend.staffSignOut(); refresh(); }}>⏻</button>
        </div>
      </aside>
      <main className="cr-main">
        <header className="cr-top">
          <button type="button" className="cr-burger" onClick={() => setNav(!nav)} aria-label="Menu">☰</button>
          <h1>{cur.l}</h1>
          {preview ? <a className="cr-badge y" href="/staff?preview=0" title="Exit the design preview">DESIGN PREVIEW · sample data · exit</a> : !live ? <span className="cr-badge y">DEMO DATA · this browser only</span> : <span className="cr-badge g">LIVE</span>}
          <button type="button" className="cr-btn ghost cr-find" onClick={() => window.dispatchEvent(new CustomEvent('cr:palette'))} title="Ctrl+K">⌕ Find</button>
          <StaffBell me={me} go={go} />
          <a className="cr-btn ghost" href="/" target="_blank" rel="noopener">View site ↗</a>
        </header>
        <Palette mine={mine} go={go} />
        <div className="cr-body" key={cur.id}>{cur.id === 'dashboard' ? <Announcement /> : null}<cur.C me={me} go={go} /></div>
      </main>
    </div>
  );
}
