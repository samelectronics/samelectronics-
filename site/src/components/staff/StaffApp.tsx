'use client';
// P5 · THE CONTROL ROOM (/staff), "super important" (owner). Staff log in with their own account; what each person sees
// and can change follows their role (owner and managers: everything; others: their area). Modules: dashboard, products &
// prices, stock & warehouse, orders, repairs, customers, approvals, inbox (live chat), site editing (banners, Samsoom,
// texts), accounting & VAT reports, automated e-mails, staff & roles, audit log and settings.
// Demo log-ins (until Supabase is connected): owner@sam.demo / demo1234 · manager@ · sales@ · tech@ (same password).
import React, { useEffect, useState } from 'react';
import { backend, live, ROLE_NAMES, useStaff, type Perm, type Staff } from '@/lib/backend';
import { installI18n } from '@/i18n/lang';
import LiveSam from '@/components/samsoom/LiveSam';
import { can } from './kit';
import { Dashboard, Products, Warehouse } from './mods1';
import { Orders, Repairs, Customers, Approvals, Inbox } from './mods2';
import { SiteEditor, Accounting, Emails, Team, Audit, Settings, MyProfile } from './mods3';

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
  { id: 'accounting', l: 'Accounting & VAT', d: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5', need: ['accounting', 'reports'], C: Accounting },
  { id: 'emails', l: 'Automated e-mails', d: 'M3 6l9 6 9-6M3 6h18v12H3z', need: ['emails'], C: Emails },
  { id: 'team', l: 'Staff & roles', d: 'M16 11a4 4 0 1 0-8 0M4 21a8 8 0 0 1 16 0', need: ['staff'], C: Team },
  { id: 'audit', l: 'Audit log', d: 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', need: ['audit'], C: Audit },
  { id: 'settings', l: 'Settings', d: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', need: ['settings'], C: Settings },
  { id: 'me', l: 'My profile', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', C: MyProfile },
];

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState(''), [pw, setPw] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setErr(''); const r = await backend.staffSignIn(email, pw); setBusy(false); if (r.ok) onDone(); else setErr(r.error); };
  return (
    <div className="cr-login">
      <div className="cr-lcard">
        <span className="cr-lsam"><LiveSam size={96} mood="idle" play="wave" /></span>
        <span className="cr-brand"><img src="/assets/se-logo-128.webp" alt="" /><span><b>SAM ELECTRONICS</b><small>CONTROL ROOM · STAFF ONLY</small></span></span>
        <form onSubmit={go}>
          <label>E-mail<input className="cr-in" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
          <label>Password<input className="cr-in" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></label>
          {err ? <span className="cr-err">{err}</span> : null}
          <button type="submit" className="cr-btn y big" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        {!live ? (
          <div className="cr-demo"><b>Demo log-ins</b> (until the database is connected)
            {[['owner@sam.demo', 'Owner · everything'], ['manager@sam.demo', 'Manager · everything'], ['sales@sam.demo', 'Sales · orders, customers, chat'], ['tech@sam.demo', 'Technician · repairs, stock']].map(([e, r]) => <button key={e} type="button" onClick={() => { setEmail(e); setPw('demo1234'); }}><span>{e}</span><small>{r}</small></button>)}
            <small>Password: demo1234</small>
          </div>
        ) : <small className="cr-muted">Staff accounts are created by the owner or a manager in Staff & roles.</small>}
        <a className="cr-back" href="/">← Back to the website</a>
      </div>
    </div>
  );
}

export default function StaffApp() {
  const [me, refresh] = useStaff(), [mod, setMod] = useState('dashboard'), [nav, setNav] = useState(false);
  useEffect(() => { const h = () => setMod(location.hash.slice(1) || 'dashboard'); h(); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h); }, []);
  useEffect(() => { document.documentElement.classList.add('cr-html'); return () => document.documentElement.classList.remove('cr-html'); }, []);
  if (me === undefined) return <div className="cr-boot"><i /></div>;
  if (!me) return <Login onDone={refresh} />;
  const mine = MODS.filter((m) => !m.need || m.need.some((p) => can(me, p)));
  const cur = mine.find((m) => m.id === mod) || mine[0];
  const go = (m: string) => { history.replaceState(null, '', '#' + m); setMod(m); setNav(false); document.querySelector('.cr-main')?.scrollTo({ top: 0 }); };
  return (
    <div className="cr">
      <aside className={'cr-side' + (nav ? ' open' : '')}>
        <a className="cr-brand" href="#dashboard" onClick={() => go('dashboard')}><img src="/assets/se-logo-128.webp" alt="" /><span><b>CONTROL ROOM</b><small>Sam Electronics</small></span></a>
        <nav>{mine.map((m) => <button key={m.id} type="button" className={cur.id === m.id ? 'on' : ''} onClick={() => go(m.id)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={m.d} /></svg><span>{m.l}</span></button>)}</nav>
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
          {!live ? <span className="cr-badge y">DEMO DATA · this browser only</span> : <span className="cr-badge g">LIVE</span>}
          <a className="cr-btn ghost" href="/" target="_blank" rel="noopener">View site ↗</a>
        </header>
        <div className="cr-body" key={cur.id}><cur.C me={me} go={go} /></div>
      </main>
    </div>
  );
}
