// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, t } from '@/dc/runtime';
import Logic from './HomeV3.logic.js';
import SEBrandLogo from './SEBrandLogo';
import SEFMPMenu from './SEFMPMenu';
import SELauncher from './SELauncher';
import SEPart from './SEPart';
import SERepairSequence from './SERepairSequence';
import SESamsoom from './SESamsoom';
import SETeardown from './SETeardown';
import BootIntro from '../home/sections/BootIntro';
import Nav from '../home/sections/Nav';
import Hero from '../home/sections/Hero';
import FindMyPart from '../home/FindMyPart';
import SystemMapDrawer from '../home/sections/SystemMapDrawer';
import CartDrawer from '../home/sections/CartDrawer';
import SamsoomChat from '../home/sections/SamsoomChat';
import Toast from '../home/sections/Toast';
import HeroPoster from '../home/sections/HeroPoster';
import ComingSoon from '../g17/ComingSoon';
import dynamic from 'next/dynamic';

// R6 Part A: below-the-teardown sections in their own chunk (see HomeRest.tsx)
const HomeRest = dynamic(() => import('./HomeRest'), { ssr: false });

function render(v: Vals) {
  return (
    <>
      <div ref={v.rootRef} style={{ position: 'relative', minHeight: '100vh' }}>
        <BootIntro v={v} />
        <Nav v={v} />
        <Hero v={v} />
        {v.showRest ? (
          <>
            <SETeardown />
            <HomeRest v={v} />
          </>
        ) : null}
        <FindMyPart open={!!v.fmp?.open} init={v.fmp?.init || {}} onClose={v.fmp?.close} onShop={v.fmp?.shop} />
        <SystemMapDrawer v={v} />
        <CartDrawer v={v} />
        {v.chat?.closed ? (
          <>
            <SELauncher onOpen={v.openChat} m0={v.launch?.m0} m1={v.launch?.m1} m2={v.launch?.m2} m3={v.launch?.m3} />
          </>
        ) : null}
        <SamsoomChat v={v} />
        <Toast v={v} />
        <HeroPoster v={v} />
        <ComingSoon />
        {'\n'}
        {t(v.sparkEl)}
        {'\n'}
      </div>
    </>
  );
}

const HomeV3 = createDC('Sam Electronics Home v3', Logic, render);
export default HomeV3;
