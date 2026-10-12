'use client';
import dynamic from 'next/dynamic';

// The home page is the design's Home v3. Its components read window globals and measure the
// viewport while rendering, so it renders in the browser only.
const HomeV3 = dynamic(() => import('@/components/dc/HomeV3'), { ssr: false });

export default function Home() {
  return (
    <div id="dc-root">
      <HomeV3 />
    </div>
  );
}
