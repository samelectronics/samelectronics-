// R6 Part A: the sections below the teardown live in their own chunk, so the hero (and the teardown it hands over to)
// parse and render first; this chunk loads right after, in parallel. Order and content are unchanged.
'use client';
import React from 'react';
import { type Vals } from '@/dc/runtime';
import SEBenchTest from './SEBenchTest';
import SEFinale from './SEFinale';
import SEHomeDeals from './SEHomeDeals';
import SEShowcase from './SEShowcase';
import SEMeet from './SEMeet';
import SEFeed from './SEFeed';
import SEReviews from './SEReviews';
import SEVisit from './SEVisit';
import SELiveBoard from './SELiveBoard';
import SEWhatWeOffer from './SEWhatWeOffer';
import SEWholesale from './SEWholesale';
import SEStory from './SEStory';
import SETeam from './SETeam';
import SEWho from './SEWho';
import SECircuit from './SECircuit';
import RepairLab from '../home/sections/RepairLab';
import RepairLabFull from '../home/RepairLabFull';
import Worldwide from '../home/sections/Worldwide';
import Footer from '../home/sections/Footer';

export default function HomeRest({ v }: { v: Vals }) {
  return (
    <>
      {/* owner (28 Oct): strict colour rotation, white → grey → yellow, never the same colour twice before the other two:
          W families · G board · Y quality · W showcase · G deals · Y wholesale · W repair · G network · Y circuit ·
          W story · G team · Y samsoom · W everyone · G feed · Y request & visit · W reviews · G finale + footer */}
      <SEWhatWeOffer />
      <SELiveBoard />
      <SEBenchTest />
      <SEShowcase />
      <SEHomeDeals />
      <SEWholesale />
      <RepairLab v={v} />
      <RepairLabFull v={v} />
      <Worldwide v={v} />
      <SECircuit />
      <SEStory todayHours={v.todayHours} dirLink={v.dirLink} wa={v.visit?.wa} notify={v.story?.notify} />
      <SETeam />
      <SEMeet />
      <SEWho />
      <SEFeed />
      <SEVisit />
      <SEReviews />
      <SEFinale />
      <Footer v={v} />
    </>
  );
}
