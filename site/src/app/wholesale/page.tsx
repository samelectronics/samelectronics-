import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import WholesalePage from '@/components/info/WholesalePage';

export const metadata = { title: 'Sam Electronics - Wholesale', description: 'Trade accounts for repair shops, traders and exporters: trade prices on every part, bulk quotes and export.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Wholesale" ar="الجملة" />
      <SitePage><WholesalePage /></SitePage>
    </>
  );
}
