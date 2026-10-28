import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import BrandsPage from '@/components/info/BrandsPage';

export const metadata = { title: 'Sam Electronics - Brands', description: 'Phone brands and part manufacturers explained: Service Pack, OEM, OLED, GX, ZY and more.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Brands" ar="الماركات" />
      <SitePage><BrandsPage /></SitePage>
    </>
  );
}
