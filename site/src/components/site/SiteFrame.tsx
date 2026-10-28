'use client';
// P1 · The frame every page other than the home sits in: the SAME nav, footer, Find My Part, cart drawer, site map,
// Samsoom (launcher, chat with its history, tour, ? help) and language system as the home page, driven by the home's own
// logic so they look and behave identically. Only what is home-only (hero, loading film, sections) is left out, and the
// links point at the real pages instead of scrolling the home page.
import React from 'react';
import dynamic from 'next/dynamic';
import { type Vals, createDC, t } from '@/dc/runtime';
import HomeLogic from '../dc/HomeV3.logic.js';
import SELauncher from '../dc/SELauncher';
import Nav from '../home/sections/Nav';
import Footer from '../home/sections/Footer';
import SystemMapDrawer from '../home/sections/SystemMapDrawer';
import CartDrawer from '../home/sections/CartDrawer';
import SamsoomChat from '../home/sections/SamsoomChat';
import Toast from '../home/sections/Toast';
import ComingSoon from '../g17/ComingSoon';
import { jumpTo } from '@/lib/jumpScroll';

const FindMyPart = dynamic(() => import('../home/FindMyPart'), { ssr: false });

/** where each home-page section lives as a page */
export const ROUTES: Record<string, string> = {
  offer: '/shop', shop: '/shop', deals: '/deals', repair: '/repair', 'repair-full': '/repair', wholesale: '/wholesale', network: '/worldwide', worldwide: '/worldwide',
  circuit: '/membership', membership: '/membership', story: '/story', team: '/story#team', meet: '/samsoom', samsoom: '/samsoom', visit: '/contact', contact: '/contact',
  reviews: '/shop', feed: '/', everyone: '/', board: '/shop', brands: '/brands', account: '/account', cart: '/cart', staff: '/staff', help: '/contact#help', legal: '/legal',
};
export const NAV_LINKS: [string, string][] = [['Shop', '/shop'], ['Repair', '/repair'], ['Wholesale', '/wholesale'], ['Contact', '/contact']];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SiteLogic extends (HomeLogic as any) {
  componentDidMount() {
    super.componentDidMount();
    // home-only: the hero entrance and the iPad's little cart animation
    cancelAnimationFrame(this.introR); clearTimeout(this.introT); clearInterval(this.buyIv);
    document.documentElement.classList.remove('se-intro'); document.documentElement.classList.add('se-intro-done', 'se-page');
  }
  flyToCart() { /* home hero only */ }
  go(id: string) {
    if (id === 'models') return this.openFmpAt();
    const el = document.getElementById(id);
    if (el) return jumpTo(el.getBoundingClientRect().top + window.scrollY - 80);
    location.href = ROUTES[id] || '/#' + id;
  }
  renderVals() {
    const v = super.renderVals(), path = typeof location !== 'undefined' ? location.pathname : '/';
    return {
      ...v,
      goTop: (ev: Event) => { ev.preventDefault(); location.href = '/'; },
      navLinks: NAV_LINKS.map(([label, href]) => ({ label, href, on: path.startsWith(href), go: () => {} })),
      st: { ...v.st, go: (ev: Event) => { ev && ev.preventDefault && ev.preventDefault(); location.href = '/contact#visit'; } },
      bench: () => (location.href = '/account'), staff: () => (location.href = '/staff'),
    };
  }
}

function render(v: Vals) {
  return (
    <div ref={v.rootRef} className="sp-root" style={{ position: 'relative', minHeight: '100vh' }}>
      <Nav v={v} />
      <main id="main" className="sp-main">{v.__page}</main>
      <Footer v={v} />
      <FindMyPart open={!!v.fmp?.open} init={v.fmp?.init || {}} onClose={v.fmp?.close} onShop={v.fmp?.shop} />
      <SystemMapDrawer v={v} />
      <CartDrawer v={v} />
      {v.chat?.closed ? <SELauncher onOpen={v.openChat} m0={v.launch?.m0} m1={v.launch?.m1} m2={v.launch?.m2} m3={v.launch?.m3} /> : null}
      <SamsoomChat v={v} />
      <Toast v={v} />
      <ComingSoon />
      {t(v.sparkEl)}
    </div>
  );
}

const SiteFrame = createDC('Site frame', SiteLogic as never, render);
export default SiteFrame;
