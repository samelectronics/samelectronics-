'use client';
// P3 · /account: signed out → sign in / create account (with e-mail confirmation); signed in → My Bench.
import React from 'react';
import { useMe } from '@/lib/backend';
import { PageHero, T } from '@/components/site/ui';
import Auth from './Auth';
import Bench from './Bench';

export default function AccountPage() {
  const [me, refresh] = useMe();
  const done = () => { refresh(); const n = new URLSearchParams(location.search).get('next'); if (n && n.startsWith('/')) location.href = n; else if (n === 'trade') location.href = '/wholesale#apply'; };
  if (me === undefined) return <div className="shop-wait"><span /><span /><span /></div>;
  if (!me) return (
    <>
      <PageHero eb={T('MY BENCH')} title={T('Your account.')} accent={T('Your bench.')} crumb={[[T('My Bench')]]} sub={T('Orders, stars, points, companies and your chats with Samsoom, all in one place.')} seed={41} />
      <section className="sp-sec g"><div className="sp-wrap"><Auth onDone={done} /></div></section>
    </>
  );
  return <div className="bn-page"><Bench me={me} refresh={refresh} /></div>;
}
