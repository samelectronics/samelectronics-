import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import CartPage from '@/components/shop/CartPage';

export const metadata = { title: 'Sam Electronics - Cart', robots: { index: false } };

export default function Page() {
  return (
    <>
      <TabTitle page="Cart" ar="السلة" />
      <SitePage><CartPage /></SitePage>
    </>
  );
}
