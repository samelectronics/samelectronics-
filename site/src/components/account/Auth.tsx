'use client';
// P3 · Sign in / create an account / confirm the e-mail / forgot password. Real e-mail confirmation once Supabase is
// connected (a 6-digit code is e-mailed); in the demo the code is shown on screen so the flow can be tried end to end.
import React, { useState } from 'react';
import { backend, live } from '@/lib/backend';
import { T } from '@/components/site/ui';
import LiveSam from '@/components/samsoom/LiveSam';

type Mode = 'in' | 'up' | 'code' | 'forgot';
const strength = (p: string) => [p.length >= 8, /[A-Z]/.test(p) && /[a-z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p), p.length >= 12].filter(Boolean).length;

export default function Auth({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<Mode>('in'), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [info, setInfo] = useState('');
  const [f, setF] = useState({ name: '', email: '', password: '', phone: '', kind: 'customer' as 'customer' | 'wholesale', agree: false, code: '' });
  const [demo, setDemo] = useState(''), [show, setShow] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const go = (m: Mode) => { setMode(m); setErr(''); setInfo(''); };
  const run = async (fn: () => Promise<void>) => { setBusy(true); setErr(''); try { await fn(); } finally { setBusy(false); } };
  const s = strength(f.password);

  const submit = (e: React.FormEvent) => { e.preventDefault(); run(async () => {
    if (mode === 'in') { const r = await backend.signIn(f.email, f.password); if (r.ok) onDone(); else { setErr(T(r.error)); if (/confirm/i.test(r.error)) { const x = await backend.resend(f.email); if (x.ok && x.data.demoCode) setDemo(x.data.demoCode); go('code'); } } }
    else if (mode === 'up') {
      if (!f.agree) return setErr(T('Please accept the terms and privacy policy.'));
      const r = await backend.signUp({ email: f.email, password: f.password, name: f.name, phone: f.phone, kind: f.kind });
      if (!r.ok) return setErr(T(r.error));
      setDemo(r.data.demoCode || ''); go('code'); setInfo(T('We sent a 6-digit code to') + ' ' + f.email + '.');
    } else if (mode === 'code') { const r = await backend.verify(f.email, f.code); if (r.ok) onDone(); else setErr(T(r.error)); }
    else { const r = await backend.resetPassword(f.email); if (r.ok) { setInfo(T('If an account exists for that e-mail, a reset link is on its way.')); if (r.data.demoCode) setDemo(r.data.demoCode); } else setErr(T(r.error)); }
  }); };

  return (
    <div className="au">
      <aside className="au-side">
        <span className="au-sam"><LiveSam size={140} mood="idle" play={mode === 'code' ? 'think' : mode === 'up' ? 'wave' : 'happy'} /></span>
        <b className="sp-h2" style={{ color: '#fff' }}>{mode === 'up' ? T('Welcome to My Bench.') : T('Welcome back.')}</b>
        <ul className="au-perks">
          {['Your orders and repairs, live', 'Stars, saved parts and stock alerts', 'Points on every part and repair', 'Your company profiles and trade prices', 'Your Samsoom chats, kept'].map((p) => <li key={p}><i />{T(p)}</li>)}
        </ul>
        {!live ? <span className="au-demo">{T('Demo mode: accounts are kept in this browser until the database is connected.')}</span> : null}
      </aside>
      <form className="au-form" onSubmit={submit}>
        {mode === 'in' || mode === 'up' ? (
          <div className="au-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'in'} className={mode === 'in' ? 'on' : ''} onClick={() => go('in')}>{T('Sign in')}</button>
            <button type="button" role="tab" aria-selected={mode === 'up'} className={mode === 'up' ? 'on' : ''} onClick={() => go('up')}>{T('Create account')}</button>
            <i style={{ transform: mode === 'up' ? 'translateX(100%)' : 'none' }} />
          </div>
        ) : <h2 className="sp-h3">{mode === 'code' ? T('Confirm your e-mail') : T('Reset your password')}</h2>}

        {mode === 'up' ? (
          <>
            <label className="sp-field">{T('Full name')}<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <div className="au-kind">
              {([['customer', 'For myself', 'Parts and repairs for my own phones'], ['wholesale', 'For my business', 'Repair shop, trader or exporter: apply for trade prices']] as const).map(([k, t, d]) => (
                <label key={k} className={'cart-opt' + (f.kind === k ? ' on' : '')}><input type="radio" checked={f.kind === k} onChange={() => setF({ ...f, kind: k })} /><i /><span><b>{T(t)}</b><small>{T(d)}</small></span></label>
              ))}
            </div>
          </>
        ) : null}
        {mode !== 'code' ? <label className="sp-field">{T('E-mail')}<input required type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label> : null}
        {mode === 'in' || mode === 'up' ? (
          <label className="sp-field">{T('Password')}
            <span className="au-pw"><input required type={show ? 'text' : 'password'} value={f.password} onChange={set('password')} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} minLength={mode === 'up' ? 8 : undefined} /><button type="button" onClick={() => setShow(!show)}>{show ? T('Hide') : T('Show')}</button></span>
            {mode === 'up' ? <span className="au-str" data-s={s}><i /><i /><i /><i /><i /><small>{[T('Too short'), T('Weak'), T('Fair'), T('Good'), T('Strong'), T('Very strong')][s]}</small></span> : null}
          </label>
        ) : null}
        {mode === 'up' ? <label className="sp-field">{T('Phone (WhatsApp, optional)')}<input value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="+971 5x xxx xxxx" /></label> : null}
        {mode === 'up' ? <label className="au-agree"><input type="checkbox" checked={f.agree} onChange={set('agree')} /><span>{T('I accept the')} <a href="/legal#terms" target="_blank">{T('terms')}</a> {T('and the')} <a href="/legal#privacy" target="_blank">{T('privacy policy')}</a>.</span></label> : null}
        {mode === 'code' ? (
          <>
            <p className="sp-p">{T('Enter the 6-digit code we e-mailed to')} <b>{f.email}</b>.</p>
            <input className="au-code" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={f.code} onChange={set('code')} placeholder="••••••" autoComplete="one-time-code" />
            <button type="button" className="shop-clear" onClick={() => run(async () => { const r = await backend.resend(f.email); if (r.ok) { setInfo(T('A new code is on its way.')); if (r.data.demoCode) setDemo(r.data.demoCode); } })}>{T('Send a new code')}</button>
          </>
        ) : null}
        {demo ? <div className="sp-note">{T('Demo: your code is')} <b style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.2em' }}>{demo}</b> · {T('real e-mails start when the database is connected.')}</div> : null}
        {info ? <div className="sp-note" style={{ background: 'rgba(43,182,115,.12)', color: '#157A4A' }}>{info}</div> : null}
        {err ? <div className="sp-note" style={{ background: 'rgba(229,72,77,.1)', color: '#9B1C20' }}>{err}</div> : null}
        <button type="submit" className="sp-btn au-go" disabled={busy}>{busy ? <span className="au-spin" /> : null}{mode === 'in' ? T('Sign in') : mode === 'up' ? T('Create account') : mode === 'code' ? T('Confirm') : T('Send reset link')}</button>
        <span className="au-links">
          {mode === 'in' ? <button type="button" onClick={() => go('forgot')}>{T('Forgot your password?')}</button> : null}
          {mode === 'code' || mode === 'forgot' ? <button type="button" onClick={() => go('in')}>← {T('Back to sign in')}</button> : null}
          <a href="/staff">{T('Staff? Control Room log-in')}</a>
        </span>
      </form>
    </div>
  );
}
