import Faq from '@/components/site/Faq';
import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import AccountPage from '@/components/account/AccountPage';

export const metadata = { title: 'Sam Electronics - My Bench', robots: { index: false } };

export default function Page() {
  return (
    <>
      <TabTitle page="My Bench" ar="حسابي" />
      <SitePage><AccountPage /><Faq topic="account" /></SitePage>
    </>
  );
}
