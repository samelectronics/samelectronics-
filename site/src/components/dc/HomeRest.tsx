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
import Worldwide from '../home/sections/Worldwide';
import Footer from '../home/sections/Footer';

export default function HomeRest({ v }: { v: Vals }) {
  return (
    <>
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
      <SEMeet />
      <SEFeed />
      <SEReviews />
      <SEVisit />
      <SEFinale />
      <Footer v={v} />
    </>
  );
}
