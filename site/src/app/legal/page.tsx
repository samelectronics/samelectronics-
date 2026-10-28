import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import LegalPage from '@/components/info/LegalPage';

export const metadata = { title: 'Sam Electronics - Legal', description: 'Terms of sale, warranty, returns, shipping, privacy and cookies.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Legal" ar="الشروط والسياسات" />
      <SitePage><LegalPage /></SitePage>
    </>
  );
}
