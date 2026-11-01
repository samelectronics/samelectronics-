'use client';
// R9 · /payments: the ways to pay, as the owner switched them on (Control Room → Settings → Payment methods)
import React, { useEffect, useState } from 'react';
import { PageHero, T } from '@/components/site/ui';
import { siteRaw } from '@/lib/catalog';
import { PAYMENTS, PAY_GROUPS, PAY_DEFAULT } from '@/lib/payments';

const ICON: Record<string, string> = { 'In the shop': 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6', Cards: 'M2 6h20v12H2zM2 10h20M6 15h4', Wallets: 'M3 7h18v12H3zM16 13h2M3 7l3-4h12l3 4', 'Pay later': 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2', 'Bank transfer': 'M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M12 3l9 5H3z', 'Money transfer': 'M7 7h13l-4-4M17 17H4l4 4', Regional: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20', 'On delivery': 'M3 7h11v10H3zM14 10h4l3 3v4h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' };

export default function PaymentsPage() {
  const [on, setOn] = useState<Record<string, boolean>>(PAY_DEFAULT);
  useEffect(() => { const r = () => setOn({ ...PAY_DEFAULT, ...siteRaw<Record<string, boolean>>('payments', {}) }); r(); window.addEventListener('se:db', r); return () => window.removeEventListener('se:db', r); }, []);
  const list = PAYMENTS.filter((p) => on[p.id]);
  return (
    <>
      <PageHero eb={T('PAYMENTS')} title={T('Pay your way.')} accent={T('Safely.')} crumb={[[T('Payments')]]} seed={71} sub={T('Every way you can pay us today, in the shop, online and from abroad. Prices are in AED; card payments are charged in AED.')} />
      <section className="sp-sec w"><div className="sp-wrap pm-wrap">
        {PAY_GROUPS.map((g) => { const ps = list.filter((p) => p.group === g); if (!ps.length) return null; return (
          <div key={g} className="pm-g">
            <h2 className="sx-h2"><span className="pm-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={ICON[g]} /></svg></span>{T(g)}</h2>
            <div className="pm-grid">{ps.map((p) => <div key={p.id} className="pm-card"><b>{p.name}</b><small>{T(p.where)}</small>{p.note ? <em>{T(p.note)}</em> : null}</div>)}</div>
          </div>); })}
        <div className="pm-safe"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></svg><span><b>{T('We never ask for your card number on WhatsApp or by e-mail.')}</b> {T('Online card payments go through a secure payment page; we never see or keep your card details.')}</span></div>
        <p className="sx-note">{T('Need another way to pay? Ask us on WhatsApp and we will tell you what is possible.')}</p>
      </div></section>
    </>
  );
}
