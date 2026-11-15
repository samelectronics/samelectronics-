'use client';
// Owner (15 Nov): the hero iPad shows OUR real store as if someone is using it: a real iPad status bar (time, signal,
// Wi-Fi, a battery that slowly drains and then charges), the store scrolling forward without ever jumping back, and
// every few seconds a tap adds a part to the cart (toast + the cart badge counting up).
import React, { useEffect, useState } from 'react';

export default function HeroIpadShop() {
  const [time, setTime] = useState(''), [bat, setBat] = useState(86), [chg, setChg] = useState(false), [cart, setCart] = useState(2), [tap, setTap] = useState(0);
  useEffect(() => {
    const clock = () => { const d = new Date(); setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' })); };
    clock(); const c = window.setInterval(clock, 15000);
    const b = window.setInterval(() => setBat((v) => { if (chg) { if (v >= 96) { setChg(false); return v; } return v + 2; } if (v <= 21) { setChg(true); return v; } return v - 1; }), 9000);
    const t = window.setInterval(() => { if (document.hidden) return; setTap((n) => n + 1); window.setTimeout(() => setCart((n) => (n >= 9 ? 2 : n + 1)), 650); }, 7600);
    return () => { clearInterval(c); clearInterval(b); clearInterval(t); };
  }, [chg]);
  return (
    <div className="hero-shop" aria-hidden="true">
      <div className="hs-status">
        <b>{time}</b>
        <span className="hs-ic">
          <svg width="15" height="9" viewBox="0 0 15 9"><rect x="0" y="6" width="2.6" height="3" rx=".6" /><rect x="4" y="4" width="2.6" height="5" rx=".6" /><rect x="8" y="2" width="2.6" height="7" rx=".6" /><rect x="12" y="0" width="2.6" height="9" rx=".6" opacity=".35" /></svg>
          <svg width="13" height="9" viewBox="0 0 13 9"><path d="M6.5 8.6 4.5 6.4a2.8 2.8 0 0 1 4 0zM2.6 4.6a5.5 5.5 0 0 1 7.8 0l-1.2 1.2a3.8 3.8 0 0 0-5.4 0zM.6 2.6a8.3 8.3 0 0 1 11.8 0l-1.2 1.2a6.6 6.6 0 0 0-9.4 0z" /></svg>
          <i className={'hs-bat' + (chg ? ' chg' : bat < 25 ? ' low' : '')}><i style={{ width: bat + '%' }} /></i>
          <small>{bat}%</small>
        </span>
      </div>
      <div className="hs-track"><img src="/assets/hero-shop.webp" alt="" width={640} height={2498} decoding="async" /><img src="/assets/hero-shop.webp" alt="" width={640} height={2498} decoding="async" /></div>
      <span key={'t' + tap} className={'hs-tap' + (tap ? ' go' : '')} style={{ left: 22 + ((tap * 37) % 55) + '%', top: 38 + ((tap * 23) % 30) + '%' }} />
      <span key={'o' + tap} className={'hs-toast' + (tap ? ' go' : '')}><i>✓</i> Added to cart</span>
      <span className="hs-cart"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 7h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg><b key={cart}>{cart}</b></span>
    </div>
  );
}
