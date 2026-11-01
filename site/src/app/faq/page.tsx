import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import FaqPage from '@/components/info/FaqPage';
import { FAQ } from '@/lib/faq';

export const metadata = { title: 'Sam Electronics - Questions', description: 'Answers about phone part grades, repairs in Deira, trade prices, worldwide shipping and payments.', alternates: { canonical: '/faq' } };

// FAQPage structured data so search engines can show the answers
const LD = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: Object.values(FAQ).flat().map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <TabTitle page="Questions" ar="الأسئلة الشائعة" />
      <SitePage><FaqPage /></SitePage>
    </>
  );
}
