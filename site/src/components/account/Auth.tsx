'use client';
// P3 · Sign in / create an account / confirm the e-mail / forgot password. Real e-mail confirmation once Supabase is
// connected (a 6-digit code is e-mailed); in the demo the code is shown on screen so the flow can be tried end to end.
import React, { useState } from 'react';
import { backend, live } from '@/lib/backend';
import { T } from '@/components/site/ui';

type Mode = 'in' | 'up' | 'code' | 'forgot';
// R11: clear, human messages for every auth failure
const nice = (m: string) => {
  const x = (m || '').toLowerCase();
  if (x.includes('already registered') || x.includes('already been registered')) return T('This e-mail already has an account. Sign in, or use “Forgot your password?”.');
  if (x.includes('invalid login') || x.includes('invalid credentials')) return T('Wrong e-mail or password. Check both, or reset your password.');
  if (x.includes('not confirmed')) return T('Please confirm your e-mail first: we sent you a new code.');
  if (x.includes('expired') || x.includes('invalid') && x.includes('token')) return T('That code is wrong or has expired. Ask for a new one.');
  if (x.includes('rate') || x.includes('seconds') || x.includes('too many')) return T('Too many tries. Please wait a minute and try again.');
  if (x.includes('password') && (x.includes('short') || x.includes('least'))) return T('Your password needs at least 8 characters.');
  if (x.includes('email') && x.includes('invalid')) return T('That e-mail address does not look right.');
  return T(m);
};
const strength = (p: string) => [p.length >= 8, /[A-Z]/.test(p) && /[a-z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p), p.length >= 12].filter(Boolean).length;

export default function Auth({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<Mode>(() => (typeof location !== 'undefined' && new URLSearchParams(location.search).get('signup') ? 'up' : 'in')), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [info, setInfo] = useState('');
  const [f, setF] = useState({ name: '', email: '', password: '', phone: '', kind: 'customer' as 'customer' | 'wholesale', agree: false, code: '' });
  const [demo, setDemo] = useState(''), [show, setShow] = useState(false), [wait, setWait] = useState(0);
  React.useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait(wait - 1), 1000); return () => clearTimeout(t); }, [wait]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const go = (m: Mode) => { setMode(m); setErr(''); setInfo(''); };
  const run = async (fn: () => Promise<void>) => { setBusy(true); setErr(''); try { await fn(); } finally { setBusy(false); } };
  const s = strength(f.password);

  const submit = (e: React.FormEvent) => { e.preventDefault();
    const em = f.email.trim(), need = (c: boolean, m: string) => { if (c) { setErr(T(m)); return true; } return false; };
    if (mode === 'up' && need(!f.name.trim(), 'Please type your full name.')) return;
    if (mode !== 'code' && need(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em), 'Please type a valid e-mail address.')) return;
    if ((mode === 'in' || mode === 'up') && need(!f.password, 'Please type your password.')) return;
    if (mode === 'up' && need(f.password.length < 8, 'Your password needs at least 8 characters.')) return;
    if (mode === 'code' && need(!/^\d{6}$/.test(f.code.trim()), 'Type the 6-digit code from the e-mail.')) return;
    run(async () => {
    if (mode === 'in') { const r = await backend.signIn(f.email, f.password); if (r.ok) onDone(); else { setErr(nice(r.error)); if (/confirm/i.test(r.error)) { const x = await backend.resend(f.email); if (x.ok && x.data.demoCode) setDemo(x.data.demoCode); go('code'); } } }
    else if (mode === 'up') {
      if (!f.agree) return setErr(T('Please accept the terms and privacy policy.'));
      const r = await backend.signUp({ email: f.email, password: f.password, name: f.name, phone: f.phone, kind: f.kind });
      if (!r.ok) { if (/already/i.test(r.error)) go('in'); return setErr(nice(r.error)); }
      setDemo(r.data.demoCode || ''); go('code'); setWait(60); setInfo(T('We sent a 6-digit code to') + ' ' + f.email + '.');
    } else if (mode === 'code') { const r = await backend.verify(f.email, f.code); if (r.ok) onDone(); else setErr(nice(r.error)); }
    else { const r = await backend.resetPassword(f.email); if (r.ok) { setInfo(T('If an account exists for that e-mail, a reset link is on its way.')); if (r.data.demoCode) setDemo(r.data.demoCode); } else setErr(T(r.error)); }
  }); };

  return (
    // R10 S2: one glass card on the teardown's stage, slow yellow lights, no Samsoom
    <div className="au au-door cr-door">
      <span className="cr-door-l a" aria-hidden="true" /><span className="cr-door-l b" aria-hidden="true" /><span className="cr-door-l c" aria-hidden="true" />
      <div className="cr-door-card au-card">
      <span className="cr-brand"><img src="/assets/se-logo-128.webp" alt="" /><span><b>SAM ELECTRONICS</b><small>{mode === 'up' ? T('CREATE YOUR ACCOUNT') : T('MY BENCH · SIGN IN')}</small></span></span>
      {!live ? <span className="cr-note">{T('Demo mode: accounts are kept in this browser until the database is connected.')}</span> : null}
      <form className="au-form" onSubmit={submit} noValidate>
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
            <button type="button" className="shop-clear" disabled={wait > 0 || busy} onClick={() => run(async () => { const r = await backend.resend(f.email); if (r.ok) { setInfo(T('A new code is on its way.')); setWait(60); if (r.data.demoCode) setDemo(r.data.demoCode); } else { setErr(nice(r.error)); const m = /(\d+)\s*seconds?/.exec(r.error); setWait(m ? +m[1] : 60); } })}>{wait > 0 ? T('Send a new code in') + ' ' + wait + 's' : T('Send a new code')}</button>
            <small className="au-hint">{T('No e-mail? Check spam. You can also press the link in the e-mail instead of typing the code.')}</small>
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
      <div className="cr-door-help"><span>{T('Talk to a person:')}</span><a href="/contact#chat">{T('Chat on the website')}</a><span>·</span><a href={'https://wa.me/971503420015?text=' + encodeURIComponent('Hi, I need help with my account.')} target="_blank" rel="noopener noreferrer">WhatsApp</a><span>·</span><a href="/samsoom">{T('Ask Samsoom')}</a></div>
      </div>
    </div>
  );
}
