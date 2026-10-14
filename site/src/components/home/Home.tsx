'use client';
import dynamic from 'next/dynamic';
import OffscreenPause from '@/components/perf/OffscreenPause';
import HScrollArrows from '@/components/perf/HScrollArrows';
import CircuitSurge from '@/components/perf/CircuitSurge';
import SectionFX from '@/components/perf/SectionFX';
import LangPop from '@/components/home/LangPop';
import { installI18n } from '@/i18n/lang';

// G9: the language is applied before the home page renders, so nothing flashes in the other language.
if (typeof window !== 'undefined') installI18n();

// The home page is the design's Home v3. Its components read window globals and measure the
// viewport while rendering, so it renders in the browser only.
const HomeV3 = dynamic(() => import('@/components/dc/HomeV3'), { ssr: false });

export default function Home() {
  return (
    <div id="dc-root">
      <HomeV3 />
      <OffscreenPause />
      <HScrollArrows />
      <CircuitSurge />
      <SectionFX />
      <LangPop />
    </div>
  );
}
