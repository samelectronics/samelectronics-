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
        <span className="fw-head"><img src="/assets/se-logo-128.webp" alt="" /><b>samelectronics.uae</b><img className="fw-net" src={net.icon} alt="" /></span>
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

export default function FeedWall() {
  const ref = useRef<HTMLElement>(null), [k, setK] = useState(0), [net, setNet] = useState(0), [live, setLive] = useState(false), [hold, setHold] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return; let iv = 0;
    const io = new IntersectionObserver(([e]) => { setLive(e.isIntersecting); }, { threshold: [0, 0.1] }); io.observe(el);
    iv = window.setInterval(() => { if (!document.hidden) setK((v) => v + 1); }, STEP);
    return () => { io.disconnect(); window.clearInterval(iv); };
  }, []);
  useEffect(() => { if (!live) return; if (hold) return; const t = window.setInterval(() => setNet((n) => (n + 1) % NET.length), STEP * 2); return () => window.clearInterval(t); }, [live, hold]);
  const N = NET[net];
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
                <span className="fw-ico"><img src={n.icon} alt="" /></span><span><b>{n.name}</b><small>{n.n} {T('followers')}</small></span>
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
          <div className="fw-fan">
            <Story net={NET[(net + 1) % 3]} k={k + 2} live={live} />
            <Story net={NET[(net + 2) % 3]} k={k + 1} live={live} />
            <Story net={N} k={k} live={live} />
          </div>
        </div>
      </div>
      <div className="fw-strip" aria-hidden="true"><div className="fw-strip-in">{[...strip, ...strip].map((s, i) => <span key={i}><i />{s}</span>)}</div></div>
    </section>
  );
}
