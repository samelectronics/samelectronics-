'use client';
// Owner (17 Nov): the short pop-ups link here for the full story (like the cookies page). Each notice is explained,
// and the visitor sees every notice this device was shown (the same record the team keeps in the Control Room).
import React, { useEffect, useState } from 'react';
import { PageHero, T, useRise } from '@/components/site/ui';
import { warnings, WARN_TITLE, type Warn } from '@/lib/warnings';

const NOTES: [string, string, string[]][] = [
  ['vpn', 'Location notice (VPN)', [
    'When your internet connection says you are in a different place than your device’s clock, you are most likely using a VPN or a proxy.',
    'Prices, stock, delivery times and offers on this website depend on where you really are. With a hidden location, what you see may not apply to you, and we may ask you to confirm your location before we confirm an order.',
    'Our terms of use ask visitors not to hide their location when browsing or ordering. If you are simply travelling, choose “I am travelling” and carry on: nothing else changes.',
    'We only compare two time zones. We never store your IP address.',
  ]],
  ['copyright', 'Copyright notice', [
    'Everything on this website and in its systems (photos, designs, texts, prices and data) belongs to Sam Electronics and is protected by the copyright laws of the United Arab Emirates, including Federal Decree-Law No. 38 of 2021. A screenshot for your own reference is fine; copying, sharing or publishing it without our written permission is not.',
    'Browsers can only see the screenshot keys on computers (Print Screen, ⌘⇧3/4/5, Win+Shift+S). When we see one, this notice appears once and the team is told which page it was.',
    '!Trying to get around this protection, for example by photographing or filming the screen with another phone, camera or device, or by using tools that hide or remove our watermark, is not allowed and can be punished under UAE law.',
    '!Copying our design, colours, layout, structure, look, characters (including Samsoom), texts or ideas, or using them wrongly or falsely (for example to look like Sam Electronics or to suggest you work with us), is not allowed and can be punished under UAE law.',
    'Every screenshot carries our watermark with the date, time and a reference, so its origin can always be traced.',
    'If you took it for another reason, you can safely ignore the notice. For permission, write to us from the Contact page.',
  ]],
];

export default function NoticesPage() {
  const [list, setList] = useState<Warn[]>([]);
  useEffect(() => setList(warnings()), []);
  useRise();
  return (
    <>
      <PageHero eb={T('SITE NOTICES')} title={T('Short pop-ups.')} accent={T('The full story.')} crumb={[[T('Legal'), '/legal'], [T('Site notices')]]} seed={41}
        sub={T('What each notice on this website means, and every notice this device has been shown.')} />
      <section className="sp-sec w"><div className="sp-wrap nt">
        {NOTES.map(([id, h, ps]) => (
          <article key={id} id={id} className="nt-c" data-rise>
            <h2 className="sp-h3">{T(h)}</h2>
            {ps.map((p) => p.startsWith('!') ? <p key={p} className="sp-p nt-hl">{T(p.slice(1))}</p> : <p key={p} className="sp-p">{T(p)}</p>)}
          </article>
        ))}
        <article className="nt-c" data-rise>
          <h2 className="sp-h3">{T('Notices shown on this device')}</h2>
          {list.length ? (
            <ul className="nt-log">{list.map((w, i) => <li key={i}><b>{T(WARN_TITLE[w.kind])}</b><span dir="ltr">{w.page}</span><time dir="ltr">{new Date(w.at).toLocaleString()}</time></li>)}</ul>
          ) : <p className="sp-p">{T('None so far.')}</p>}
          <small className="sp-muted">{T('This list stays on this device. The team keeps the same record with your customer ID.')}</small>
        </article>
      </div></section>
    </>
  );
}
