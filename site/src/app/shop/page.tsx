import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import Shop from '@/components/shop/Shop';

export const metadata = { title: 'Sam Electronics - Shop', description: 'Every mobile phone part in every grade: screens, batteries, flex cables, back covers, frames, cameras. Retail and trade prices, Dubai.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Shop" ar="المتجر" />
      <SitePage><Shop /></SitePage>
    </>
  );
}
