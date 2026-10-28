import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import ContactPage from '@/components/info/ContactPage';

export const metadata = { title: 'Sam Electronics - Contact', description: 'Call, WhatsApp, e-mail or visit Sam Electronics in Al Murar, Deira, Dubai. Live chat and help centre.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Contact" ar="تواصل معنا" />
      <SitePage><ContactPage /></SitePage>
    </>
  );
}
