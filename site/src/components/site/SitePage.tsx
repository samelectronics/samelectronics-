'use client';
// P1 · Wrap any page in this: the shared frame (nav, footer, cart, Samsoom…) plus the language system, the offline notice
// and Samsoom's tour/help (which also walks through the page's own [data-tour-step] elements).
import dynamic from 'next/dynamic';
import LangPop from '@/components/home/LangPop';
import NetNotice from '@/components/home/NetNotice';
import SamsoomTour from '@/components/home/SamsoomTour';
import { installI18n } from '@/i18n/lang';
import { loadRemoteCatalog } from '@/lib/remoteCatalog';
import SiteSettings from './SiteSettings';

if (typeof window !== 'undefined') { installI18n(); loadRemoteCatalog(); }
// the frame reads window globals (data, language) while rendering, like the home page, so it renders in the browser
const SiteFrame = dynamic(() => import('./SiteFrame'), { ssr: false, loading: () => <div className="sp-boot" aria-hidden="true" /> });

export default function SitePage({ children }: { children: React.ReactNode }) {
  return (
    <div id="dc-root">
      <SiteFrame __page={children} />
      <SiteSettings />
      <LangPop />
      <NetNotice />
      <SamsoomTour />
    </div>
  );
}
