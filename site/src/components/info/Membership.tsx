'use client';
// P3 · SAM CIRCUIT (/membership): the three cards in detail. The home's card builder at the top, then one full section
// per card (who it is for, how to get it, every level with its requirement and perks), how points work, the card in
// My Bench, and questions. Levels, thresholds and perks are the owner's R8 list; numbers are samples until confirmed.
import React, { useState } from 'react';
import SECircuit from '@/components/dc/SECircuit';
import { useMe } from '@/lib/backend';
import { PageHero, T, useRise } from '@/components/site/ui';
import MemberCard, { type CardKind } from '@/components/account/MemberCard';
import { waLink } from '@/lib/catalog';

const CARDS: { k: CardKind; name: string; for: string; tone: string; intro: string; how: [string, string][]; levels: [string, string, string[]][]; cta: [string, string] }[] = [
  { k: 'circuit', name: 'Sam Circuit', for: 'For customers', tone: 'y', intro: 'The card for everyone who buys parts or repairs with us. Register online, your first purchase activates it, and every dirham you spend charges it up.',
    how: [['Register online', 'Create your My Bench account in a minute.'], ['Your first purchase activates it', 'In the shop in Deira or online.'], ['Collect points, level up', 'AED 1 = 1 point, on every part and every repair.']],
    levels: [['Connected', 'Your first purchase', ['Saved parts and order history', 'Repair status on your phone']], ['Charged', '1,000 points', ['Priority stock alerts', 'Early access to deals']], ['Supercharged', '5,000 points', ['Free diagnosis, always first in line', 'Birthday offer']], ['Fully Charged', '15,000 points', ['A personal adviser on WhatsApp', 'First pick of new arrivals']], ['Lightning', '40,000 points', ['Members-only prices', 'Free delivery in the UAE']]],
    cta: ['Register online', '/account'] },
  { k: 'grid', name: 'Sam Grid', for: 'For shops, traders and suppliers', tone: 'd', intro: 'The trade card. Apply online with your trade licence; our management team checks it and activates the card by hand. Your monthly volume sets your level.',
    how: [['Apply online', 'Your trade licence and shop details.'], ['Our management team verifies it', 'We activate your card by hand.'], ['Your monthly volume sets your level', 'The more you trade, the higher you go.']],
    levels: [['Node', 'Approved trade account', ['Trade prices on every grade', 'Bulk lists quoted the same day']], ['Hub', 'AED 10,000 a month', ['Trade price tiers', 'Credit on approved orders']], ['Network', 'AED 50,000 a month', ['A dedicated account manager', 'Export paperwork handled']], ['Backbone', 'AED 150,000 a month', ['First pick of incoming shipments', 'Custom stock reserved for you']], ['Mainframe', 'AED 400,000 a month', ['Direct line to management', 'Factory-direct allocations']]],
    cta: ['Apply for a Grid card', '/wholesale#apply'] },
  { k: 'circle', name: 'Sam Circle', for: 'For our most loyal customers', tone: 'w', intro: 'By invitation only. No levels and no points: management chooses who receives it, and its offers are made personally for each member.',
    how: [['Ask us on WhatsApp', 'Tell us a little about you.'], ['Management decides', 'By invitation only, never automatic.'], ['Personal, limited offers', 'Chosen for you, not for everyone.']],
    levels: [['Sam Circle member', 'By invitation', ['Limited offers nobody else gets', 'Made personally for you', 'First call on rare and new stock', 'A seat at our launches']]],
    cta: ['Ask on WhatsApp', ''] },
];
const FAQ: [string, string][] = [
  ['Can I have more than one card?', 'Yes. A repair shop owner can hold a Sam Grid card for the business and a Sam Circuit card for personal purchases. Both show in My Bench.'],
  ['Do points expire?', 'Points stay as long as your account is active (at least one purchase a year). The exact rules are confirmed by the owner before launch.'],
  ['Do repairs earn points?', 'Yes: the part and the fitting fee both count, AED 1 = 1 point.'],
  ['I already have a physical card. How do I connect it?', 'Sign in to My Bench, open Points & card and type the number printed on your card (it looks like SC 123 456 2700).'],
  ['How is the Grid level calculated?', 'From your approved trade orders in the last 30 days. It is reviewed every month; you never drop more than one level at a time.'],
];

export default function Membership() {
  const [me] = useMe(), [open, setOpen] = useState<number | null>(0);
  useRise();
  return (
    <>
      <PageHero eb={T('SAM CIRCUIT · MEMBERSHIP')} title={T('Three cards.')} accent={T('One is yours.')} crumb={[[T('Sam Circuit')]]} seed={57}
        sub={T('One for customers, one for suppliers, and one we give to our most loyal customers. Each is earned its own way, and each lives in your account.')}
        right={<div className="ms-fan">{(['circle', 'grid', 'circuit'] as CardKind[]).map((k, i) => <div key={k} className={'ms-f f' + i}><MemberCard kind={k} name={me?.name || 'Your name here'} no={k === 'circuit' ? 'SC 214 508 2731' : k === 'grid' ? 'SG 771 093 2840' : 'SO 300 112 2903'} level={k === 'grid' ? 2 : 3} tilt={false} /></div>)}</div>}>
        <div className="sp-acts">{me ? <a className="sp-btn" href="/account#points">{me.card ? T('See my card') : T('Connect my card')}</a> : <a className="sp-btn" href="/account">{T('Register online')}</a>}<a className="sp-btn ghost" href="#cards">{T('Compare the cards')}</a></div>
      </PageHero>

      <div className="ms-builder"><SECircuit /></div>

      <div id="cards">
        {CARDS.map((c, ci) => (
          <section key={c.k} id={c.k} className={'sp-sec ms-card ' + (ci === 1 ? 'd' : ci === 2 ? 'g' : 'w')}>
            <div className="sp-wrap ms-in">
              <div className="ms-l" data-rise>
                <span className="sp-eb">{T(c.for)}</span>
                <h2 className="sp-h2">{c.name}</h2>
                <p className="sp-p">{T(c.intro)}</p>
                <ol className="ms-how">{c.how.map(([t, d], i) => <li key={t}><i>{i + 1}</i><span><b>{T(t)}</b><small>{T(d)}</small></span></li>)}</ol>
                <div className="sp-acts">{c.k === 'circle' ? <a className="sp-btn wa" href={waLink('Hi Sam Electronics, I would like to be considered for the Sam Circle loyalty card.')} target="_blank" rel="noopener noreferrer">{T(c.cta[0])}</a> : <a className={'sp-btn' + (ci === 1 ? '' : ' dark')} href={c.cta[1]}>{T(c.cta[0])}</a>}</div>
              </div>
              <div className="ms-r" data-rise>
                <MemberCard kind={c.k} name={me?.name || 'Your name here'} no={c.k === 'circuit' ? 'SC 214 508 2731' : c.k === 'grid' ? 'SG 771 093 2840' : 'SO 300 112 2903'} level={c.levels.length - 1 > 3 ? 4 : 0} />
              </div>
            </div>
            <div className="sp-wrap">
              <div className="ms-ladder" data-rise>
                {c.levels.map(([l, r, perks], i) => (
                  <div key={l} className="ms-lv" style={{ ['--i' as string]: i }}>
                    <span className="ms-bat">{c.levels.length > 1 ? Array.from({ length: 5 }, (_, j) => <i key={j} className={j <= i ? 'on' : ''} />) : <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 15.3 6.8 18l1-5.8L3.6 8.1l5.8-.8z" /></svg>}</span>
                    <b>{T(l)}</b><small>{T(r)}</small>
                    <ul>{perks.map((p) => <li key={p}>{T(p)}</li>)}</ul>
                  </div>
                ))}
              </div>
              {c.k !== 'circle' ? <span className="sp-sample">{T('Levels, thresholds and perks are samples until the owner confirms them.')}</span> : null}
            </div>
          </section>
        ))}
      </div>

      <section className="sp-sec y">
        <div className="sp-wrap ms-pts">
          <div data-rise><span className="sp-eb">{T('HOW POINTS WORK')}</span><h2 className="sp-h2">{T('AED 1 = 1 point.')}<br />{T('On everything.')}</h2></div>
          <div className="sp-grid sp-g3" data-rise>
            {[['Parts', 'Every part, in the shop or online.'], ['Repairs', 'The part and the fitting fee both count.'], ['In your account', 'Points, level and history live in My Bench.']].map(([t, d]) => <div key={t} className="sp-card"><b className="sp-h3">{T(t)}</b><p className="sp-p">{T(d)}</p></div>)}
          </div>
        </div>
      </section>

      <section className="sp-sec w">
        <div className="sp-wrap ms-faq">
          <div className="sp-head"><div><span className="sp-eb">{T('QUESTIONS')}</span><h2 className="sp-h2">{T('Good to know')}</h2></div></div>
          {FAQ.map(([q, a], i) => (
            <div key={q} className={'ms-q' + (open === i ? ' open' : '')}>
              <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}><b>{T(q)}</b><i /></button>
              <div><p className="sp-p">{T(a)}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
