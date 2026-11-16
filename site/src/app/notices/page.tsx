import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import NoticesPage from '@/components/info/NoticesPage';

export const metadata = { title: 'Sam Electronics - Site notices', description: 'Why the website may show a location (VPN) notice or a copyright notice, what each means, and the notices shown on this device.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Site notices" ar="تنبيهات الموقع" />
      <SitePage><NoticesPage /></SitePage>
    </>
  );
}
