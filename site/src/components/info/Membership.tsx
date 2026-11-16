'use client';
// P3 · SAM CIRCUIT (/membership): the three cards in detail. The home's card builder at the top, then one full section
// per card (who it is for, how to get it, every level with its requirement and perks), how points work, the card in
// My Bench, and questions. Levels, thresholds and perks are the owner's R8 list; numbers are samples until confirmed.
import React from 'react';
import { useMe } from '@/lib/backend';
import HowTo from '@/components/site/HowTo';
import { PageHero, T, useRise } from '@/components/site/ui';
import MemberCard, { type CardKind } from '@/components/account/MemberCard';
import { waLink, waCard } from '@/lib/catalog';
import PointsSim from './PointsSim';

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

export default function Membership() {
  const [me] = useMe();
  useRise();
  return (
    <>
      <PageHero eb={T('SAM CIRCUIT · MEMBERSHIP')} title={T('Three cards.')} accent={T('One is yours.')} crumb={[[T('Sam Circuit')]]} seed={57}
        sub={T('One for customers, one for suppliers, and one we give to our most loyal customers. Each is earned its own way, and each lives in your account.')}
        right={<div className="ms-fan">{(['circle', 'grid', 'circuit'] as CardKind[]).map((k, i) => <div key={k} className={'ms-f f' + i}><MemberCard kind={k} name={me?.name || 'Your name here'} no={k === 'circuit' ? 'SC 214 508 2731' : k === 'grid' ? 'SG 771 093 2840' : 'SO 300 112 2903'} level={k === 'grid' ? 2 : 3} tilt={false} /></div>)}</div>}>
        <div className="sp-acts">{me ? <a className="sp-btn" href="/account#points">{me.card ? T('See my card') : T('Connect my card')}</a> : <a className="sp-btn" href="/account">{T('Register online')}</a>}<a className="sp-btn ghost" href="#cards">{T('Compare the cards')}</a></div>
      </PageHero>

      <Showroom name={me?.name || 'Your name here'} />

      {/* R11 (owner): a real walk-through of joining, instead of the home page's cards again */}
      <section className="sp-sec w"><div className="sp-wrap">
        <HowTo eb="HOW TO JOIN" title="Your card in three screens." steps={[
          { t: 'Create your account', d: 'My Bench › Create account: your name, e-mail and a password.', url: '/account?signup=1', screen: { h: 'Create your account', rows: ['Full name', 'E-mail', 'Password'], btn: 'Create account' } },
          { t: 'Confirm your e-mail', d: 'Type the 6-digit code we e-mail you. Your Sam Circuit card is ready.', url: '/account', screen: { h: 'Confirm your e-mail', rows: ['6-digit code'], btn: 'Confirm', done: 'Card ready' } },
          { t: 'Shop and charge it', d: 'Your first purchase activates it. AED 1 = 1 point, on parts and repairs.', url: '/account#points', screen: { h: 'Points & card', card: 'circuit', btn: 'See my card' } },
          { t: 'Trade? Get the Grid card', d: 'Apply with your trade licence; management activates it by hand.', url: '/wholesale#apply', screen: { h: 'Apply for a trade account', card: 'grid', rows: ['Trade licence number'], btn: 'Send application' } },
        ]} />
      </div></section>

      <div id="cards">
        {CARDS.map((c, ci) => <CardSection key={c.k} c={c} ci={ci} name={me?.name || 'Your name here'} />)}
      </div>

      <section className="sp-sec g">
        <div className="sp-wrap ms-pts">
          <div data-rise><span className="sp-eb">{T('HOW POINTS WORK')}</span><h2 className="sp-h2">{T('AED 1 = 1 point.')}<br />{T('On everything.')}</h2></div>
          <div className="ms2-pts" data-rise>
            {[['Parts', 'Every part, in the shop or online.', 'M4 7h16v10H4zM8 7V5h8v2'], ['Repairs', 'The part and the fitting fee both count.', 'M14 7l3-3 3 3-3 3M4 20l9-9'], ['In your account', 'Points, level and history live in My Bench.', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c1-4 4-6 8-6s7 2 8 6']].map(([t, d, ic]) => <span key={t}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={ic} /></svg><b>{T(t)}</b><small>{T(d)}</small></span>)}
          </div>
          <PointsSim />
        </div>
      </section>

    </>
  );
}

/** One card's section. Owner (16 Nov): no boxes. The levels are a charging rail: tap a level (or let it run) and the
 *  card next to it charges to that level, with that level's perks underneath. Sections rotate graphite / yellow / white. */
function CardSection({ c, ci, name }: { c: (typeof CARDS)[number]; ci: number; name: string }) {
  const n = c.levels.length, [lv, setLv] = React.useState(0), [hold, setHold] = React.useState(false), ref = React.useRef<HTMLDivElement>(null), seen = React.useRef(false);
  React.useEffect(() => {
    if (n < 2 || hold) return; let iv = 0; const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { window.clearInterval(iv); if (e.isIntersecting) { seen.current = true; iv = window.setInterval(() => setLv((v) => (v + 1) % n), 2600); } }, { threshold: [0, 0.08, 0.16, 0.25] });
    io.observe(el); return () => { io.disconnect(); window.clearInterval(iv); };
  }, [n, hold]);
  const tone = ci === 0 ? 'g' : ci === 1 ? 'y' : 'w', [l, r, perks] = c.levels[lv];
  return (
    <section id={c.k} className={'sp-sec ms-card ms2 ' + tone}>
      <div className="sp-wrap ms-in">
        <div className="ms-l" data-rise>
          <span className="sp-eb">{T(c.for)}</span>
          <h2 className="sp-h2">{c.name}</h2>
          <p className="sp-p">{T(c.intro)}</p>
          <ol className="ms-how">{c.how.map(([t, d], i) => <li key={t}><i>{i + 1}</i><span><b>{T(t)}</b><small>{T(d)}</small></span></li>)}</ol>
          <div className="sp-acts">{c.k === 'circle' ? <a className="sp-btn wa" href={waLink(waCard('Sam Circle', [['Request', 'Please consider me for the Sam Circle loyalty card']]))} target="_blank" rel="noopener noreferrer">{T(c.cta[0])}</a> : <a className={'sp-btn ms2-cta' + (tone === 'y' ? ' dark' : '')} href={c.cta[1]}>{T(c.cta[0])} <i>→</i></a>}</div>
        </div>
        <div className="ms-r" data-rise>
          <MemberCard kind={c.k} name={name} no={c.k === 'circuit' ? 'SC 214 508 2731' : c.k === 'grid' ? 'SG 771 093 2840' : 'SO 300 112 2903'} level={n > 1 ? lv : 0} />
        </div>
      </div>
      <div className="sp-wrap" ref={ref}>
        {n > 1 ? (
          <div className="ms2-rail" data-rise onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} style={{ ['--p' as string]: lv / (n - 1), ['--n' as string]: n } as React.CSSProperties}>
            <div className="ms2-track" aria-hidden="true"><i /><b /></div>
            <div className="ms2-nodes" role="tablist">
              {c.levels.map(([ln, lr], i) => (
                <button key={ln} type="button" role="tab" aria-selected={lv === i} className={(i <= lv ? 'on' : '') + (i === lv ? ' cur' : '')} onClick={() => { setHold(true); setLv(i); }}>
                  <span className="ms2-dot" aria-hidden="true">{i + 1}</span><b>{T(ln)}</b><small className="mono">{T(lr)}</small>
                </button>
              ))}
            </div>
            <div className="ms2-perks" key={lv}><span className="ms2-lv mono">{T('LEVEL')} {lv + 1} · {T(l)}</span><small>{T(r)}</small><ul>{perks.map((p) => <li key={p}>{T(p)}</li>)}</ul></div>
          </div>
        ) : (
          <div className="ms2-invite" data-rise>
            <span className="ms2-inv-k">{T('BY INVITATION · SAM ELECTRONICS')}</span>
            <b>{T(l)}</b><small>{T(r)}</small>
            <ul>{perks.map((p) => <li key={p}>{T(p)}</li>)}</ul>
            <span className="ms2-inv-sig">{T('Chosen by the management, for our most loyal customers.')}</span>
          </div>
        )}
        {c.k !== 'circle' ? <span className="sp-sample">{T('Levels, thresholds and perks are samples until the owner confirms them.')}</span> : null}
      </div>
    </section>
  );
}

/** Owner (17 Nov): "the Sam Circuit page is boring and cheap". A card showroom: the three cards stand on a glowing
 *  graphite stage and tilt in 3D with the pointer; each says who it is for and how you get it. */
function Showroom({ name }: { name: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); el.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(2) + 'deg'); el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2) + 'deg'); el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); };
  const leave = () => { const el = ref.current; if (!el) return; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
  const C: [CardKind, string, string, string, string][] = [
    ['circuit', 'Sam Circuit', 'For customers', 'Register online, your first purchase activates it.', 'SC 214 508 2731'],
    ['grid', 'Sam Grid', 'For shops and traders', 'Apply with your trade licence; we activate it by hand.', 'SG 771 093 2840'],
    ['circle', 'Sam Circle', 'For our most loyal customers', 'By invitation only.', 'SO 300 112 2903'],
  ];
  return (
    <section className="ms-show" onPointerMove={move} onPointerLeave={leave}>
      <i className="ms-show-ray a" aria-hidden="true" /><i className="ms-show-ray b" aria-hidden="true" />
      <div className="sp-wrap">
        <div className="ms-show-h" data-rise><span className="sp-eb">{T('THE CARDS')}</span><h2 className="sp-h2">{T('Pick up your card.')}</h2></div>
        <div className="ms-show-g" ref={ref}>
          {C.map(([k, n, f, how, no], i) => (
            <a key={k} href={'#' + k} className={'ms-show-c c' + i} style={{ ['--i' as string]: i } as React.CSSProperties}>
              <span className="ms-show-card"><MemberCard kind={k} name={name} no={no} level={0} /><i className="ms-show-glare" aria-hidden="true" /></span>
              <span className="ms-show-floor" aria-hidden="true" />
              <b>{n}</b><small>{T(f)}</small><em>{T(how)}</em><span className="ms-show-go">{T('See the card')} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
