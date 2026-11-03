import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import CookiesPage from '@/components/info/CookiesPage';

export const metadata = { title: 'Sam Electronics - Cookies', description: 'Our four cookies, named after phone parts: what each stores, for how long and why. Change your choice any time.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Cookies" ar="ملفات تعريف الارتباط" />
      <SitePage><CookiesPage /></SitePage>
    </>
  );
}
