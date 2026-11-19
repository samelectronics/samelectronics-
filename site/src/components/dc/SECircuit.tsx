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

/** guilloche engraving (computed once): a spirograph rosette on the right and fine waves across the card */
const GUIL = (() => {
  const r = (n: number) => n.toFixed(1); let rose = '';
  for (let k = 0; k < 14; k++) { const ph = (k / 14) * Math.PI * 2; let d = '';
    for (let i = 0; i <= 360; i++) { const t = (i / 360) * Math.PI * 2, R = 64 + 26 * Math.sin(7 * t + ph) + 6 * Math.cos(19 * t); const x = 292 + R * Math.cos(t), y = 112 + R * 0.92 * Math.sin(t); d += (i ? 'L' : 'M') + r(x) + ' ' + r(y); }
    rose += d + 'Z'; }
  let waves = '';
  for (let k = 0; k < 22; k++) { let d = ''; const y0 = 150 + k * 5.2, ph = k * 0.42;
    for (let x = -10; x <= 410; x += 4) { const y = y0 + 6 * Math.sin(x / 26 + ph) + 3 * Math.sin(x / 9 - ph); d += (x === -10 ? 'M' : 'L') + r(x) + ' ' + r(y); }
    waves += d; }
  return { rose, waves };
})();


/** R9 (owner): the battery on the card charges like a real one: a liquid fill that grows smoothly to the level (with a
 *  charging shimmer running through it), five faint cell marks on top, never flat blocks */
function Battery({ n, of, k }: { n: number; of: number; k: Kind }) {
  return (
    <span className="cx-bat" aria-hidden="true">
      <span className="cx-bat-cells">
        <span className="fill" style={{ width: (((n + 1) / of) * 100).toFixed(1) + '%' }}><i /></span>
        {Array.from({ length: of - 1 }, (_, i) => <b key={i} style={{ left: (((i + 1) / of) * 100).toFixed(1) + '%' }} />)}
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
                <span className="cx-lvl-bat" role="radiogroup" aria-label={T('Level')} style={{ ['--lv' as string]: String((lvl + 1) / C.levels.length) }}>
                  <span className="charge" aria-hidden="true"><i /></span>
                  {C.levels.map((l, i) => (
                    <button key={l} type="button" role="radio" aria-checked={lvl === i} aria-label={T(l)} className={(i <= lvl ? 'on' : '') + (i === lvl ? ' cur' : '')} style={{ transitionDelay: (i <= lvl ? i * 0.12 : 0) + 's' }} onClick={() => setLvl(i)}>
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
          {/* owner (16 Nov, "make it exciting"): the three cards stand together on a charging dock; the one you pick
              floats to the front and charges, the other two wait behind (tap one to bring it forward) */}
          <span className="cx-dock" aria-hidden="true" key={'d' + kind + lvl}><i className="r1" /><i className="r2" /><i className="r3" /><i className="beam" /></span>
          {ORDER.map((k) => { const CC = CARDS[k], hl = CC.levels.length > 0, front = k === kind, others = ORDER.filter((x) => x !== kind), pos = front ? 'front' : others[0] === k ? 'back-l' : 'back-r';
            return (
          <div key={k} ref={front ? card : undefined} className={'cx-card k-' + k + ' ' + pos} onClick={front ? undefined : () => pick(k)} role={front ? undefined : 'button'} aria-label={front ? undefined : CC.name} tabIndex={front ? undefined : 0}>
            {/* owner (19 Nov): "like the premium bank card: the logo looks deep inside the card, tinted in steel, cool
                patterns around". Brushed metal + guilloche engraving + the mark pressed into the metal (light and shadow
                edges), with a light that follows the pointer. */}
            <span className="cx-metal" aria-hidden="true" />
            <svg className="cx-guil" viewBox="0 0 400 252" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d={GUIL.rose} /><path className="w" d={GUIL.waves} /></svg>
            <span className="cx-press" aria-hidden="true"><i className="lo" /><i className="hi" /><i className="face" /></span>
            <span className="cx-sheen" aria-hidden="true" />
            <div className="cx-card-in">
              <span className="top">
                <span className="brand"><span><b data-no-i18n="">{CC.name}</b><small>{T(CC.kind)}</small></span></span>
                {hl ? <Battery n={front ? lvl : 0} of={5} k={k} /> : <span className="cx-seal" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 15.3 6.8 18l1-5.8L3.6 8.1l5.8-.8z" /></svg></span>}
              </span>
              <span className="cx-chiprow" aria-hidden="true"><span className="chip"><i /><i /><i /></span><svg className="cx-nfc" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8.5 7.5a6 6 0 0 1 0 9M12 5a9.5 9.5 0 0 1 0 14M5 10a2.5 2.5 0 0 1 0 4" /></svg></span>
              <span className="nm" data-no-i18n={name ? '' : undefined}>{front ? name || T('Your name here') : T('Your name here')}</span>
              <span className="sh" data-no-i18n="">{CC.shop ? (front && shop) || T('Your shop') : ' '}</span>
              <span className="bot">
                <span><small>{hl ? T(k === 'grid' ? 'TRADE LEVEL' : 'LEVEL') : T('INVITATION')}</small><b>{hl ? T(CC.levels[front ? lvl : 0]) : T('Sam Circle member')}</b></span>
                <span className="no" data-no-i18n="">{front ? no : 'SC •••• ••••'}</span>
              </span>
            </div>
          </div>); })}
          {hasLv ? (
            <ol className="cx-ladder" aria-label={T('Levels')} style={{ ['--n' as string]: String(C.levels.length), ['--lv' as string]: String(lvl) }} key={'l' + kind}>
              <span className="run" aria-hidden="true"><i style={{ width: ((lvl / (C.levels.length - 1)) * 100).toFixed(1) + '%' }} /></span>
              {C.levels.map((l, i) => <li key={l} className={(i <= lvl ? 'on' : '') + (i === lvl ? ' cur' : '')} onClick={() => setLvl(i)}><i /><b>{T(l)}</b><small>{T(C.req[i])}</small></li>)}
            </ol>
          ) : null}
          <div className="cx-perks" key={kind + lvl}>
            <small>{hasLv ? T(C.levels[lvl]) + ' · ' + T(C.req[lvl]) : T('What the Circle brings')}</small>
            {(hasLv ? C.perks[lvl] : C.perks.flat()).map((p) => <span key={p}><i />{T(p)}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
