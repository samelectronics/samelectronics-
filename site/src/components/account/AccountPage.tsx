'use client';
// P3 · /account: signed out → sign in / create account (with e-mail confirmation); signed in → My Bench.
import React from 'react';
import { useMe } from '@/lib/backend';
import { T } from '@/components/site/ui';
import HowTo from '@/components/site/HowTo';
import Auth from './Auth';
import Bench from './Bench';
import NotesPanel from './NotesPanel';

// R11: the reset link from the e-mail lands here signed in for a moment: the visitor chooses a new password first
function NewPassword({ done }: { done: () => void }) {
  const [pw, setPw] = React.useState(''), [pw2, setPw2] = React.useState(''), [code, setCode] = React.useState(''), [needCode, setNeedCode] = React.useState(false), [err, setErr] = React.useState(''), [ok, setOk] = React.useState(false), [busy, setBusy] = React.useState(false);
  React.useEffect(() => { import('@/lib/backend/supabase').then((m) => m.needsMfaForPassword()).then(setNeedCode).catch(() => {}); }, []);
  const save = async (e: React.FormEvent) => { e.preventDefault(); setErr(''); if (pw.length < 8) return setErr(T('Your password needs at least 8 characters.')); if (pw !== pw2) return setErr(T('The two passwords are not the same.'));
    if (needCode && !/^\d{6}$/.test(code.replace(/\s/g, ''))) return setErr(T('Type the 6-digit code from your authenticator app.'));
    setBusy(true); const { setNewPassword } = await import('@/lib/backend/supabase'); const m = await setNewPassword(pw, needCode ? code : undefined); setBusy(false);
    if (m === 'MFA_REQUIRED') { setNeedCode(true); setErr(T('Your account is protected by an authenticator app. Type its 6-digit code to save the new password.')); return; }
    if (m) setErr(T(m)); else { setOk(true); window.setTimeout(done, 1200); } };
  return (
    <div className="au au-door cr-door"><div className="cr-door-card au-card">
      <span className="cr-brand"><img src="/assets/se-logo-128.webp" alt="" /><span><b>SAM ELECTRONICS</b><small>{T('CHOOSE A NEW PASSWORD')}</small></span></span>
      <form className="au-form" onSubmit={save} noValidate>
        <label className="sp-field">{T('New password')}<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></label>
        <label className="sp-field">{T('Type it again')}<input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></label>
        {needCode ? <label className="sp-field">{T('6-digit code from your authenticator app')}<input inputMode="numeric" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} autoComplete="one-time-code" placeholder="123 456" /></label> : null}
        {err ? <div className="sp-note au-err">{err}</div> : null}{ok ? <div className="sp-note au-ok">{T('Saved. You are signed in.')}</div> : null}
        <button type="submit" className="sp-btn au-go" disabled={busy}>{T('Save my new password')}</button>
      </form>
    </div></div>
  );
}

// R12: a reset link that was already used or has expired lands here with an error: say so clearly, never just open the profile
function LinkExpired({ close }: { close: () => void }) {
  return (
    <div className="au au-door cr-door"><div className="cr-door-card au-card">
      <span className="cr-brand"><img src="/assets/se-logo-128.webp" alt="" /><span><b>SAM ELECTRONICS</b><small>{T('LINK EXPIRED')}</small></span></span>
      <p className="au-lead">{T('This e-mail link has already been used or has expired. Links work once and only for a short time.')}</p>
      <button type="button" className="sp-btn au-go" onClick={close}>{T('OK')}</button>
    </div></div>
  );
}

export default function AccountPage() {
  const [me, refresh] = useMe();
  const [reset, setReset] = React.useState(() => typeof location !== 'undefined' && (/[?&]reset=1/.test(location.search) || /type=recovery/.test(location.hash)));
  const [expired, setExpired] = React.useState(() => typeof location !== 'undefined' && /error_code=|error=access_denied/.test(location.hash + location.search));
  if (expired) return (
    <section className="sp-cine au-stage" data-tone="dark" data-v="1"><div className="cine-bg" aria-hidden="true"><i className="cine-wall" /><i className="cine-beam" /><span className="cine-bokeh">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <i key={k} />)}</span><i className="cine-floor" /></div>
      <div className="sp-wrap au-stage-in"><LinkExpired close={() => { history.replaceState(null, '', '/account'); setExpired(false); setReset(false); }} /></div></section>
  );
  if (reset && me === undefined) return <div className="shop-wait"><span /><span /><span /></div>;
  if (reset && me) return (
    <section className="sp-cine au-stage" data-tone="dark" data-v="1"><div className="cine-bg" aria-hidden="true"><i className="cine-wall" /><i className="cine-beam" /><span className="cine-bokeh">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <i key={k} />)}</span><i className="cine-floor" /></div>
      <div className="sp-wrap au-stage-in"><NewPassword done={() => { history.replaceState(null, '', '/account'); setReset(false); refresh(); }} /></div></section>
  );
  const done = () => { refresh(); const n = new URLSearchParams(location.search).get('next'); if (n && n.startsWith('/')) location.href = n; else if (n === 'trade') location.href = '/wholesale#apply'; };
  if (me === undefined) return <div className="shop-wait"><span /><span /><span /></div>;
  if (!me) return (
    <>
      {/* R11 (owner): signing in is the first thing you see, on the teardown's stage with the soft yellow lights */}
      <section className="sp-cine au-stage" data-tone="dark" data-v="1">
        <div className="cine-bg" aria-hidden="true"><i className="cine-wall" /><i className="cine-beam" /><span className="cine-bokeh">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <i key={k} />)}</span><i className="cine-floor" /><i className="cine-grain" /></div>
        <span className="cine-word" style={{ ['--n' as string]: 'BENCH'.length }} aria-hidden="true" data-no-i18n="">BENCH</span>
        <div className="sp-wrap au-stage-in"><Auth onDone={done} /></div>
      </section>
      {typeof location !== 'undefined' && location.hash === '#notifications' ? <section className="sp-sec"><div className="sp-wrap"><h2 className="sp-h2">{T('Notifications')}</h2><NotesPanel /></div></section> : null}
      <section className="sp-sec w"><div className="sp-wrap">
        <HowTo eb="MY BENCH" title="What you get with an account." steps={[
          { t: 'Orders and repairs, live', d: 'Every order and repair with its status, the moment it changes.', url: '/account#orders', screen: { h: 'Orders', rows: ['SE-2041 · Ready for pickup', 'SE-2033 · Delivered'], btn: 'Track order' } },
          { t: 'Your Sam Circuit card', d: 'Points on every part and repair; your level grows with you.', url: '/account#points', screen: { h: 'Points & card', card: 'circuit', btn: 'See my card' } },
          { t: 'Your devices', d: 'Add your phones once; the shop marks every part that fits.', url: '/account#devices', screen: { h: 'My devices', rows: ['Model code'], btn: 'Add a device', done: 'Fits marked in the shop' } },
          { t: 'Settings in one place', d: 'Sounds, Samsoom’s voice, language, currency and privacy.', url: '/account#profile', screen: { h: 'Site settings', rows: ['Sounds', 'Samsoom’s voice'], btn: 'Save' } },
        ]} />
      </div></section>
    </>
  );
  return <div className="bn-page"><Bench me={me} refresh={refresh} /></div>;
}
