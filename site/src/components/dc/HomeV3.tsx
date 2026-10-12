// GENERATED from design/project/Sam Electronics Home v3.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
'use client';
import React from 'react';
import { type Vals, createDC, t } from '@/dc/runtime';
import Logic from './HomeV3.logic.js';
import SEBenchTest from './SEBenchTest';
import SEBrandLogo from './SEBrandLogo';
import SEFMPMenu from './SEFMPMenu';
import SEFinale from './SEFinale';
import SEHomeDeals from './SEHomeDeals';
import SEHomeModels from './SEHomeModels';
import SEHomeSamsoom from './SEHomeSamsoom';
import SELauncher from './SELauncher';
import SELiveBoard from './SELiveBoard';
import SEPart from './SEPart';
import SERepairSequence from './SERepairSequence';
import SESamsoom from './SESamsoom';
import SETeardown from './SETeardown';
import SEWhatWeOffer from './SEWhatWeOffer';
import SEWholesaleTruck from './SEWholesaleTruck';
import BootIntro from '../home/sections/BootIntro';
import Nav from '../home/sections/Nav';
import Hero from '../home/sections/Hero';
import RepairLab from '../home/sections/RepairLab';
import Wholesale from '../home/sections/Wholesale';
import Worldwide from '../home/sections/Worldwide';
import Story from '../home/sections/Story';
import Team from '../home/sections/Team';
import OpenToEveryone from '../home/sections/OpenToEveryone';
import SamCircuit from '../home/sections/SamCircuit';
import Social from '../home/sections/Social';
import RequestVisit from '../home/sections/RequestVisit';
import Footer from '../home/sections/Footer';
import FindMyPartPanel from '../home/sections/FindMyPartPanel';
import SystemMapDrawer from '../home/sections/SystemMapDrawer';
import CartDrawer from '../home/sections/CartDrawer';
import SamsoomChat from '../home/sections/SamsoomChat';
import Toast from '../home/sections/Toast';

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
            <SEHomeModels />
            <SEHomeDeals />
            <RepairLab v={v} />
            <Wholesale v={v} />
            <Worldwide v={v} />
            <Story v={v} />
            <Team v={v} />
            <OpenToEveryone v={v} />
            <SamCircuit v={v} />
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
        {'\n'}
        {t(v.sparkEl)}
        {'\n'}
      </div>
    </>
  );
}

const HomeV3 = createDC('Sam Electronics Home v3', Logic, render);
export default HomeV3;
