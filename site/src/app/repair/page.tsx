import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import RepairPage from '@/components/info/RepairPage';

export const metadata = { title: 'Sam Electronics - Repair Lab', description: 'Phone repairs in Deira, Dubai: every repair for every model with the part price and fitting fee upfront.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Repair Lab" ar="مختبر الصيانة" />
      <SitePage><RepairPage /></SitePage>
    </>
  );
}
