'use client';
// Owner (16 Nov): "The Feed" redesigned. Our channels as they really look: three phones fanned like a stack of stories,
// each playing our posts (stock drops, restocks, offers, bench tests) with story bars, likes and captions; one row of
// the three networks in their own colours with ONE QR code that follows the chosen network; and a slim moving strip
// with the next landing and this week's drops. Yellow section in the page's colour order.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import qrcode from 'qrcode-generator';
import { T } from '@/components/site/ui';

const NET = [
  { id: 'ig', name: 'Instagram', href: 'https://instagram.com/samelectronics.uae', n: '12.4K', c: 'linear-gradient(45deg,#F58529,#DD2A7B 50%,#8134AF)', icon: '/icons/instagram.svg' },
  { id: 'tt', name: 'TikTok', href: 'https://www.tiktok.com/@samelectronics.uae', n: '8.1K', c: '#111111', icon: '/icons/tiktok.svg' },
  { id: 'fb', name: 'Facebook', href: 'https://facebook.com/samelectronics.uae', n: '5.6K', c: '#1877F2', icon: '/icons/facebook.svg' },
];
const POSTS = [
  { tag: 'STOCK DROP', t: 'Just landed: iPhone 15 Pro OLED screens', m: '12 boxes · Deira', img: '/assets/pose/samsung-sp-480.webp', bg: '#F7C032', likes: 412 },
  { tag: 'RESTOCK', t: 'Galaxy A54 batteries back in stock', m: 'All grades', img: '/assets/pose/solo-bat-480.webp', bg: '#F2F3F4', likes: 268 },
  { tag: 'OFFER', t: 'This week: −18% on back glass', m: 'Ends Friday', img: '/assets/pose/solo-bcv-480.webp', bg: '#26282B', likes: 351 },
  { tag: 'BENCH TEST', t: 'Pixel 8 Pro cameras, tested', m: 'Before they ship', img: '/assets/pose/solo-cam-480.webp', bg: '#FFFFFF', likes: 187 },
];
const STEP = 3200;

function Qr({ text }: { text: string }) {
  const svg = useMemo(() => { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }, [text]);
  return <span className="fw-qr-svg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

function Story({ net, k, live }: { net: (typeof NET)[number]; k: number; live: boolean }) {
  const p = POSTS[k % POSTS.length], dark = p.bg === '#26282B';
  return (
    <div className={'fw-phone n-' + net.id}>
      <span className="fw-island" aria-hidden="true" />
      <div className="fw-screen">
        <span className="fw-bars" aria-hidden="true">{POSTS.map((_, i) => <i key={i} className={i < k % POSTS.length ? 'done' : i === k % POSTS.length && live ? 'on' : ''} />)}</span>
        <span className="fw-head"><img loading="lazy" decoding="async" src="/assets/se-logo-128.webp" alt="" /><b>samelectronics.uae</b><img loading="lazy" decoding="async" className="fw-net" src={net.icon} alt="" /></span>
        <div className="fw-post" key={k} style={{ background: p.bg }}>
          <span className={'fw-tag' + (dark ? ' d' : '')}>{T(p.tag)}</span>
          <img className="fw-img" src={p.img} alt="" loading="lazy" decoding="async" />
          <span className="fw-cap" style={{ color: dark ? '#fff' : '#26282B' }}><b>{T(p.t)}</b><small>{T(p.m)}</small></span>
        </div>
        <span className="fw-acts" aria-hidden="true"><i className="heart" /><em key={'l' + k}>{p.likes + (k % 7) * 3}</em><i className="msg" /><i className="send" /></span>
      </div>
    </div>
  );
}

const GRID = [...POSTS, ...POSTS.map((p, i) => ({ ...p, img: ['/assets/pose/solo-scr-480.webp', '/assets/pose/solo-flx-480.webp', '/assets/pose/solo-frm-480.webp', '/assets/pose/solo-board-480.webp'][i], bg: ['#26282B', '#FFFFFF', '#F7C032', '#F2F3F4'][i], likes: p.likes - 40 }))];
/** a realistic profile page of the chosen network, inside the phone; a new post drops in every few seconds */
function Profile({ net, k }: { net: (typeof NET)[number]; k: number }) {
  const posts = Array.from({ length: 9 }, (_, i) => GRID[(i + GRID.length * 9 - (k % GRID.length)) % GRID.length]);
  const tile = (p: (typeof GRID)[number], i: number, extra?: React.ReactNode) => <span key={i + '-' + k} className={'pf-t' + (i === 0 ? ' new' : '')} style={{ background: p.bg }}><img src={p.img} alt="" loading="lazy" decoding="async" />{extra}</span>;
  const ava = <span className="pf-ava"><img loading="lazy" decoding="async" src="/assets/se-logo-128.webp" alt="" /></span>;
  return (
    <div className={'fw-phone pf n-' + net.id} aria-hidden="true">
      <span className="fw-glass" />
      <span className="fw-island" />
      <div className="pf-scr">
        <span className="pf-sb"><b>9:41</b><i /></span>
        {net.id === 'ig' ? (<>
          <span className="pf-top"><b>samelectronics.uae</b><i className="pf-dots" /></span>
          <span className="pf-row">{ava}<span className="pf-n"><span><b>{GRID.length * 51}</b><small>posts</small></span><span><b>{net.n}</b><small>followers</small></span><span><b>214</b><small>following</small></span></span></span>
          <span className="pf-bio"><b>Sam Electronics</b><small>Phone parts · repairs · trade prices</small><small>Al Murar, Deira · since 2003</small></span>
          <span className="pf-btns"><i className="ig">Follow</i><i>Message</i></span>
          <span className="pf-hl">{['Stock', 'Repairs', 'Offers', 'Deira'].map((h) => <span key={h}><i /><small>{h}</small></span>)}</span>
          <span className="pf-grid ig">{posts.map((p, i) => tile(p, i))}</span>
        </>) : net.id === 'tt' ? (<>
          <span className="pf-top c"><b>Sam Electronics</b></span>
          <span className="pf-col">{ava}<b>@samelectronics.uae</b><span className="pf-n c"><span><b>214</b><small>Following</small></span><span><b>{net.n}</b><small>Followers</small></span><span><b>96K</b><small>Likes</small></span></span><span className="pf-btns c"><i className="tt">Follow</i><i>▾</i></span><small className="pf-tt-bio">Daily stock drops from Deira</small></span>
          <span className="pf-grid tt">{posts.map((p, i) => tile(p, i, <em>▶ {(p.likes * 7).toLocaleString('en-US')}</em>))}</span>
        </>) : (<>
          <span className="pf-cover"><img loading="lazy" decoding="async" src="/assets/se-logo-320.webp" alt="" /></span>
          <span className="pf-fbh">{ava}<b>Sam Electronics</b><small>{net.n} followers · Phone parts shop</small></span>
          <span className="pf-btns"><i className="fb">Like</i><i>Message</i></span>
          <span className="pf-post"><span className="pf-ph">{ava}<b>Sam Electronics</b><small>Just now</small></span><small className="pf-pt">{T(GRID[k % GRID.length].t)}</small>{tile(GRID[k % GRID.length], 0)}</span>
        </>)}
      </div>
    </div>
  );
}

/** owner (18 Nov): "more realistic pages and videos": every few posts the phone plays a full-screen reel / TikTok like
 *  the real apps: the clip slowly zooms, the side column counts up, the caption and the sound line scroll, a progress
 *  bar runs along the bottom and a double-tap heart pops in the middle */
function Reel({ net, k }: { net: (typeof NET)[number]; k: number }) {
  const p = GRID[k % GRID.length], dark = p.bg === '#26282B' || p.bg === '#111111';
  const [likes, setLikes] = useState(p.likes * 9);
  useEffect(() => { setLikes(p.likes * 9); const t = window.setInterval(() => setLikes((v) => v + 1 + Math.floor(Math.random() * 4)), 260); return () => window.clearInterval(t); }, [k, p.likes]);
  const fmt = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n));
  return (
    <div className={'fw-phone rl n-' + net.id} aria-hidden="true">
      <span className="fw-glass" />
      <span className="fw-island" />
      <div className="rl-scr" style={{ background: p.bg }}>
        <img className="rl-img" src={p.img.replace('-480.webp', '-480.webp')} alt="" loading="lazy" decoding="async" key={k} />
        <span className="rl-shade" />
        <span className="pf-sb rl-sb"><b>9:41</b><i /></span>
        <span className="rl-top">{net.id === 'tt' ? <><small>Following</small><b>For You</b></> : <b>{net.id === 'ig' ? 'Reels' : 'Reels'}</b>}</span>
        <span className="rl-side">
          <span className="rl-av"><img src="/assets/se-logo-128.webp" alt="" /><i>+</i></span>
          <span className="rl-ic"><i className="h" /><small>{fmt(likes)}</small></span>
          <span className="rl-ic"><i className="c" /><small>{fmt(Math.round(p.likes / 3))}</small></span>
          <span className="rl-ic"><i className="s" /><small>{fmt(Math.round(p.likes / 5))}</small></span>
          {net.id === 'tt' ? <span className="rl-disc"><img src="/assets/se-logo-128.webp" alt="" /></span> : null}
        </span>
        <span className={'rl-cap' + (dark ? '' : ' lt')}><b>@samelectronics.uae</b><small>{T(p.t)} · {T(p.m)}</small><span className="rl-snd"><i>♫</i><span><em>{T('original sound')} · samelectronics.uae · {T('original sound')} · samelectronics.uae</em></span></span></span>
        <span className="rl-pop" key={'p' + k} />
        <span className="rl-prog"><i key={'g' + k} /></span>
      </div>
    </div>
  );
}

export default function FeedWall() {
  const ref = useRef<HTMLElement>(null), [k, setK] = useState(0), [net, setNet] = useState(0), [live, setLive] = useState(false), [hold, setHold] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return; let iv = 0;
    const io = new IntersectionObserver(([e]) => { setLive(e.isIntersecting); }, { threshold: [0, 0.1] }); io.observe(el);
    iv = window.setInterval(() => { if (!document.hidden) setK((v) => v + 1); }, STEP);
    return () => { io.disconnect(); window.clearInterval(iv); };
  }, []);
  useEffect(() => { if (!live) return; if (hold) return; const t = window.setInterval(() => setNet((n) => (n + 1) % NET.length), STEP * 2); return () => window.clearInterval(t); }, [live, hold]);
  // owner (18 Nov): "hearts going out of the phones, fading away"
  const [hearts, setHearts] = useState<{ id: number; x: number; d: number; s: number; r: number; c: number; L?: boolean }[]>([]);
  useEffect(() => {
    if (!live) return; let n = 0;
    const t = window.setInterval(() => { if (document.hidden) return; const id = ++n + Date.now(); setHearts((h) => [...h.slice(-14), { id, L: n % 2 === 0, x: Math.random() * 40 - 20, d: Math.random() * 80 - 40, s: 0.7 + Math.random() * 0.7, r: Math.random() * 40 - 20, c: Math.random() < 0.72 ? 0 : Math.random() < 0.5 ? 1 : 2 }]); window.setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 3200); }, 420);
    return () => window.clearInterval(t);
  }, [live]);
  const N = NET[net], reel = k % 4 === 2 || k % 4 === 3;
  const strip = [T('NEXT LANDING') + ' · ' + T('Thursday') + ' 14:00', ...POSTS.map((p) => T(p.tag) + ' · ' + T(p.t))];
  return (
    <section id="social" ref={ref} className={'fw' + (live ? ' on' : '')} data-tone="light" data-screen-label="The Feed">
      <div className="fw-in">
        <div className="fw-l">
          <span className="fw-eb">{T('THE FEED')} · @SAMELECTRONICS.UAE</span>
          <h2 className="fw-h">{T('Follow us for daily stock drops.')}</h2>
          <p className="fw-p">{T('New stock, offers and bench tests go up first on our channels. Scan a code or tap Follow.')}</p>
          <div className="fw-nets" role="tablist" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
            {NET.map((n, i) => (
              <button key={n.id} type="button" role="tab" aria-selected={i === net} className={'fw-net-b' + (i === net ? ' on' : '')} onClick={() => setNet(i)} style={{ ['--c' as string]: n.c } as React.CSSProperties}>
                <span className="fw-ico"><img loading="lazy" decoding="async" src={n.icon} alt="" /></span><span><b>{n.name}</b><small>{n.n} {T('followers')}</small></span>
              </button>
            ))}
          </div>
          <div className="fw-qr" key={N.id}>
            <Qr text={N.href} />
            <span><small>{T('Scan with your phone')}</small><b>{N.name}</b><a className="fw-follow" href={N.href} target="_blank" rel="noopener noreferrer" style={{ ['--c' as string]: N.c } as React.CSSProperties}>{T('Follow')} <i>→</i></a></span>
          </div>
        </div>
        <div className="fw-stage" aria-label={T('Our latest posts')}>
          <span className="fw-glow" aria-hidden="true" />
          {/* owner (17 Nov): the account you pick opens in the phone, like the real app */}
          {/* owner (19 Nov): keep the three phones; the centre one shows what you pick, the two beside it show the other
              accounts (tap one to bring it to the centre) */}
          <button type="button" className="fw-side l" aria-label={NET[(net + NET.length - 1) % NET.length].name} onClick={() => setNet((net + NET.length - 1) % NET.length)}><Profile net={NET[(net + NET.length - 1) % NET.length]} k={k + 3} /></button>
          <button type="button" className="fw-side r" aria-label={NET[(net + 1) % NET.length].name} onClick={() => setNet((net + 1) % NET.length)}><Profile net={NET[(net + 1) % NET.length]} k={k + 5} /></button>
          <div className="fw-one" key={N.id + (reel ? '-r' : '')}>{reel ? <Reel net={N} k={k} /> : <Profile net={N} k={k} />}</div>
          <span className="fw-hearts" aria-hidden="true">{hearts.map((h) => <i key={h.id} className={'c' + h.c + (h.L ? ' L' : '')} style={{ ['--x' as string]: h.x + 'px', ['--d' as string]: h.d + 'px', ['--s' as string]: h.s, ['--r' as string]: h.r + 'deg' } as React.CSSProperties} />)}</span>
        </div>
      </div>
      <div className="fw-strip" aria-hidden="true"><div className="fw-strip-in">{[...strip, ...strip].map((s, i) => <span key={i}><i />{s}</span>)}</div></div>
    </section>
  );
}
