import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import Shop from '@/components/shop/Shop';

export const metadata = { title: 'Sam Electronics - Deals', description: 'Offers that end soon, new arrivals and limited stock on mobile phone parts.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Deals" ar="العروض" />
      <SitePage><Shop mode="deals" /></SitePage>
    </>
  );
}
