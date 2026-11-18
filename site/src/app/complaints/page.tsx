import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import ComplaintsPage from '@/components/info/ComplaintsPage';
export const metadata = { title: 'Sam Electronics - Complaints', description: 'File a complaint with Sam Electronics: parts, orders, repairs, staff, prices or the website. Every case gets a number and goes to the management team.', alternates: { canonical: '/complaints' } };
export default function Page() {
  return (<><TabTitle page="Complaints" ar="الشكاوى" /><SitePage><ComplaintsPage /></SitePage></>);
}
