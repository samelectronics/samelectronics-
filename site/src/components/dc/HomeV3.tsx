// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, t } from '@/dc/runtime';
import Logic from './HomeV3.logic.js';
import SEBenchTest from './SEBenchTest';
import SEBrandLogo from './SEBrandLogo';
import SEFMPMenu from './SEFMPMenu';
import SEFinale from './SEFinale';
import SEHomeDeals from './SEHomeDeals';
import SEShowcase from './SEShowcase';
import SEHomeSamsoom from './SEHomeSamsoom';
import SELauncher from './SELauncher';
import SELiveBoard from './SELiveBoard';
import SEPart from './SEPart';
import SERepairSequence from './SERepairSequence';
import SESamsoom from './SESamsoom';
import SETeardown from './SETeardown';
import SEWhatWeOffer from './SEWhatWeOffer';
import SEWholesale from './SEWholesale';
import SEStory from './SEStory';
import SETeam from './SETeam';
import SEWho from './SEWho';
import SECircuit from './SECircuit';
import BootIntro from '../home/sections/BootIntro';
import Nav from '../home/sections/Nav';
import Hero from '../home/sections/Hero';
import RepairLab from '../home/sections/RepairLab';
import Worldwide from '../home/sections/Worldwide';
import Social from '../home/sections/Social';
import RequestVisit from '../home/sections/RequestVisit';
import Footer from '../home/sections/Footer';
import FindMyPartPanel from '../home/sections/FindMyPartPanel';
import SystemMapDrawer from '../home/sections/SystemMapDrawer';
import CartDrawer from '../home/sections/CartDrawer';
import SamsoomChat from '../home/sections/SamsoomChat';
import Toast from '../home/sections/Toast';
import HeroPoster from '../home/sections/HeroPoster';
import ComingSoon from '../g17/ComingSoon';

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
            <SEWhatWeOffer />
            <SELiveBoard />
            <SEBenchTest />
            <SEShowcase />
            <SEHomeDeals />
            <RepairLab v={v} />
            <SEWholesale />
            <Worldwide v={v} />
            <SEStory todayHours={v.todayHours} dirLink={v.dirLink} wa={v.visit?.wa} notify={v.story?.notify} />
            <SETeam />
            <SEWho />
            <SECircuit />
            <SEHomeSamsoom />
            <Social v={v} />
            <RequestVisit v={v} />
            <SEFinale />
            <Footer v={v} />
          </>
        ) : null}
        <FindMyPartPanel v={v} />
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
