'use client';
// P3 · /account: signed out → sign in / create account (with e-mail confirmation); signed in → My Bench.
import React from 'react';
import { useMe } from '@/lib/backend';
import { T } from '@/components/site/ui';
import HowTo from '@/components/site/HowTo';
import Auth from './Auth';
import Bench from './Bench';
import NotesPanel from './NotesPanel';

export default function AccountPage() {
  const [me, refresh] = useMe();
  const done = () => { refresh(); const n = new URLSearchParams(location.search).get('next'); if (n && n.startsWith('/')) location.href = n; else if (n === 'trade') location.href = '/wholesale#apply'; };
  if (me === undefined) return <div className="shop-wait"><span /><span /><span /></div>;
  if (!me) return (
    <>
      {/* R11 (owner): signing in is the first thing you see, on the teardown's stage with the soft yellow lights */}
      <section className="sp-cine au-stage" data-tone="dark" data-v="1">
        <div className="cine-bg" aria-hidden="true"><i className="cine-wall" /><i className="cine-beam" /><span className="cine-bokeh">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <i key={k} />)}</span><i className="cine-floor" /><i className="cine-grain" /></div>
        <span className="cine-word" aria-hidden="true" data-no-i18n="">BENCH</span>
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
