// Sam Circuit membership. Owner (R8): THREE cards, each built a different way.
//   SAM CIRCUIT · yellow · for customers   · 5 levels · register online, the first purchase activates it, points level it up
//   SAM GRID    · graphite · for suppliers  · 5 levels · apply online, our management team verifies and activates it
//   SAM CIRCLE  · white · for loyal customers · no levels · by invitation only: ask on WhatsApp, management decides
// The card updates live as you type and pick: its battery fills to the level you choose (the loyalty card carries a seal
// instead), the store's logo is pressed into it as a tint, and its circuit traces are printed on (fixed, not moving).
// Styles in src/styles/circuit.css (the .cx block). The section is yellow (white → grey → YELLOW rotation).
'use client';
import React, { useMemo, useRef, useState } from 'react';

const T = (s: string) => (typeof window !== 'undefined' && (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n ? (window as unknown as { seI18n: { t: (x: string) => string } }).seI18n.t(s) : s);
type Kind = 'circuit' | 'grid' | 'circle';
type Card = { name: string; kind: string; for: string; levels: string[]; req: string[]; perks: string[][]; steps: [string, string][]; cta: string; shop: boolean };
const CARDS: Record<Kind, Card> = {
  circuit: {
    name: 'SAM CIRCUIT', kind: 'Member card', for: 'For customers', shop: false,
    levels: ['Connected', 'Charged', 'Supercharged', 'Fully Charged', 'Lightning'],
    req: ['Your first purchase', '1,000 points', '5,000 points', '15,000 points', '40,000 points'],
    perks: [['Saved parts and order history', 'Repair status on your phone'], ['Priority stock alerts', 'Early access to deals'], ['Free diagnosis, always first in line', 'Birthday offer'], ['A personal adviser on WhatsApp', 'First pick of new arrivals'], ['Members-only prices', 'Free delivery in the UAE']],
    steps: [['Register online', 'Create your account in a minute.'], ['Your first purchase activates it', 'In the shop or online.'], ['Collect points, level up', 'AED 1 = 1 point, on every part and repair.']],
    cta: 'Register online',
  },
  grid: {
    name: 'SAM GRID', kind: 'Supplier card', for: 'For shops, traders and suppliers', shop: true,
    levels: ['Node', 'Hub', 'Network', 'Backbone', 'Mainframe'],
    req: ['Approved trade account', 'AED 10,000 a month', 'AED 50,000 a month', 'AED 150,000 a month', 'AED 400,000 a month'],
    perks: [['Trade prices on every grade', 'Bulk lists quoted the same day'], ['Trade price tiers', 'Credit on approved orders'], ['A dedicated account manager', 'Export paperwork handled'], ['First pick of incoming shipments', 'Custom stock reserved for you'], ['Direct line to management', 'Factory-direct allocations']],
    steps: [['Apply online', 'Your trade licence and shop details.'], ['Our management team verifies it', 'We activate your card by hand.'], ['Your monthly volume sets your level', 'The more you trade, the higher you go.']],
    cta: 'Apply for a Grid card',
  },
  circle: {
    name: 'SAM CIRCLE', kind: 'Loyalty card', for: 'For our most loyal customers', shop: false,
    levels: [], req: [],
    perks: [['Limited offers nobody else gets', 'Made personally for you'], ['First call on rare and new stock', 'A seat at our launches']],
    steps: [['Ask us on WhatsApp', 'Tell us a little about you.'], ['Management decides', 'By invitation only, never automatic.'], ['Personal, limited offers', 'Chosen for you, not for everyone.']],
    cta: 'Ask on WhatsApp',
  },
};
const ORDER: Kind[] = ['circuit', 'grid', 'circle'];

/** the battery printed on the card: 5 cells fill up to the level (a soft charge sweep when it changes) */
function Battery({ n, of, k }: { n: number; of: number; k: Kind }) {
  return (
    <span className="cx-bat" aria-hidden="true">
      <span className="cx-bat-cells">
        {Array.from({ length: of }, (_, i) => <i key={i + '-' + n} className={i <= n ? 'on' : ''} style={{ animationDelay: i * 0.09 + 's' }} />)}
      </span>
      <span className="cx-bat-nub" />
      <svg className="cx-bat-bolt" width="12" height="12" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
      <span className="sr" data-k={k} />
    </span>
  );
}

export default function SECircuit() {
  const [kind, setKind] = useState<Kind>('circuit'), [name, setName] = useState(''), [shop, setShop] = useState(''), [lvl, setLvl] = useState(0);
  const card = useRef<HTMLDivElement>(null), C = CARDS[kind], hasLv = C.levels.length > 0;
  const no = useMemo(() => { let h = kind === 'grid' ? 17 : kind === 'circle' ? 29 : 7; for (const ch of (name || 'SAM').toUpperCase()) h = (h * 31 + ch.charCodeAt(0)) % 999983; const s = String(h).padStart(6, '0'); return ({ circuit: 'SC', grid: 'SG', circle: 'SO' } as const)[kind] + ' ' + s.slice(0, 3) + ' ' + s.slice(3) + ' ' + String(2600 + (h % 300)); }, [name, kind]);
  const waNo = (typeof window !== 'undefined' && (window as unknown as { SE_DATA?: { contact?: { wa?: string } } }).SE_DATA?.contact?.wa) || '971503420015';
  const msg = kind === 'circle'
    ? `*SAM CIRCLE · LOYALTY CARD*\n\nName: ${name.trim() || '—'}\n\nI would like to be considered for the Sam Circle loyalty card.\nSent from the Sam Electronics website`
    : `*${C.name} · ${C.kind.toUpperCase()}*\n\nName: ${name.trim() || '—'}${shop.trim() ? '\nShop / company: ' + shop.trim() : ''}\nLevel I am aiming for: ${C.levels[lvl]}\n\n${kind === 'grid' ? 'Please send me the Grid card application.' : 'Please help me register.'}\nSent from the Sam Electronics website`;
  const wa = 'https://wa.me/' + waNo + '?text=' + encodeURIComponent(msg);
  const pick = (k: Kind) => { setKind(k); setLvl(0); };
  const tilt = (e: React.PointerEvent) => { const c = card.current; if (!c) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.transform = `rotateX(${((0.5 - y) * 16).toFixed(2)}deg) rotateY(${((x - 0.5) * 22).toFixed(2)}deg)`; c.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--ly', (y * 100).toFixed(1) + '%'); };
  const untilt = () => { const c = card.current; if (c) { c.style.transform = ''; c.style.setProperty('--lx', '30%'); c.style.setProperty('--ly', '20%'); } };
  return (
    <section id="circuit" data-tone="yel" data-screen-label="Sam Circuit" className="cx">
      <div className="cx-in">
        <div className="cx-l">
          <span className="cx-eb">SAM CIRCUIT · MEMBERSHIP</span>
          <h2 className="cx-h"><span>Three cards.</span> <span>One is yours.</span></h2>
          <p className="cx-p">One for customers, one for suppliers, and one we give to our most loyal customers. Each is earned its own way.</p>
          <div className="cx-pick" role="tablist">
            {ORDER.map((k) => (
              <button key={k} type="button" role="tab" aria-selected={kind === k} className={'k-' + k + (kind === k ? ' on' : '')} onClick={() => pick(k)}>
                <span className="sw" aria-hidden="true" />
                <b>{CARDS[k].name}</b>
                <small>{T(CARDS[k].for)}</small>
              </button>
            ))}
          </div>

          <div className="cx-form">
            <label><span>{T('Your name')}</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={22} placeholder={T('Type your name')} /></label>
            {C.shop ? <label><span>{T('Shop or company')}</span><input value={shop} onChange={(e) => setShop(e.target.value)} maxLength={28} placeholder="e.g. Al Murar Mobiles" /></label> : null}
            {hasLv ? (
              <div className="cx-lvl">
                <span className="cx-lvl-h"><b>{T('Level')}</b><em>{T(C.levels[lvl])} · {T(C.req[lvl])}</em></span>
                {/* the level picker IS a battery: tap a cell to charge the card to that level */}
                <span className="cx-lvl-bat" role="radiogroup" aria-label={T('Level')}>
                  {C.levels.map((l, i) => (
                    <button key={l} type="button" role="radio" aria-checked={lvl === i} aria-label={T(l)} className={i <= lvl ? 'on' : ''} onClick={() => setLvl(i)}>
                      <small>{T(l)}</small>
                    </button>
                  ))}
                  <span className="nub" aria-hidden="true" />
                </span>
              </div>
            ) : (
              <div className="cx-inv"><b>{T('By invitation only')}</b><span>{T('No levels and no points: management chooses who receives it.')}</span></div>
            )}
          </div>

          <ol className="cx-steps" key={kind}>
            {C.steps.map(([t, d], i) => (
              <li key={t} style={{ animationDelay: i * 0.08 + 's' }}><i>{i + 1}</i><span><b>{T(t)}</b><small>{T(d)}</small></span></li>
            ))}
          </ol>
          <a className="cx-btn" href={wa} target="_blank" rel="noopener noreferrer">{T(C.cta)}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
        </div>

        <div className="cx-r" onPointerMove={tilt} onPointerLeave={untilt}>
          <span className="cx-floor" aria-hidden="true" />
          <div ref={card} className={'cx-card k-' + kind} key={kind}>
            <span className="cx-holo" aria-hidden="true" />
            {/* printed traces: fixed on the card, like a real PCB print */}
            <svg className="cx-trace" viewBox="0 0 400 252" aria-hidden="true">
              <path d="M248 0 V34 L274 60 H332" /><path d="M400 96 H352 L334 114 V150" /><path d="M400 176 H338 L316 154 H262 L244 136 H214" /><path d="M300 0 V14 L314 28 H372" />
              <circle cx="332" cy="60" r="3.4" /><circle cx="334" cy="150" r="3.4" /><circle cx="214" cy="136" r="3.4" /><circle cx="372" cy="28" r="3" />
            </svg>
            <img className="cx-logo" src="/assets/se-logo-320.webp" alt="" aria-hidden="true" />
            <div className="cx-card-in">
              <span className="top">
                <span className="brand"><b data-no-i18n="">{C.name}</b><small>{T(C.kind)}</small></span>
                {hasLv ? <Battery n={lvl} of={5} k={kind} /> : <span className="cx-seal" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 15.3 6.8 18l1-5.8L3.6 8.1l5.8-.8z" /></svg></span>}
              </span>
              <span className="chip" aria-hidden="true"><i /><i /><i /></span>
              <span className="nm" data-no-i18n={name ? '' : undefined}>{name || T('Your name here')}</span>
              <span className="sh" data-no-i18n="">{C.shop ? shop || T('Your shop') : ' '}</span>
              <span className="bot">
                <span><small>{hasLv ? T(kind === 'grid' ? 'TRADE LEVEL' : 'LEVEL') : T('INVITATION')}</small><b>{hasLv ? T(C.levels[lvl]) : T('Sam Circle member')}</b></span>
                <span className="no" data-no-i18n="">{no}</span>
              </span>
            </div>
          </div>
          <div className="cx-perks" key={kind + lvl}>
            <small>{hasLv ? T(C.levels[lvl]) + ' · ' + T(C.req[lvl]) : T('What the Circle brings')}</small>
            {(hasLv ? C.perks[lvl] : C.perks.flat()).map((p) => <span key={p}><i />{T(p)}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
