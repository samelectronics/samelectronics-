import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import PaymentsPage from '@/components/info/PaymentsPage';
import Faq from '@/components/site/Faq';
export const metadata = { title: 'Sam Electronics - Payments', description: 'Ways to pay Sam Electronics: cash and card in Deira, bank transfer, international transfer and more.', alternates: { canonical: '/payments' } };
export default function Page() {
  return (<><TabTitle page="Payments" ar="طرق الدفع" /><SitePage><PaymentsPage /><Faq topic="payments" /></SitePage></>);
}
