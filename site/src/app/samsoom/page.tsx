import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import AskPage from '@/components/samsoom/AskPage';

export const metadata = { title: 'Sam Electronics - Ask Samsoom', description: 'Chat with Samsoom, the Sam Electronics parts assistant: parts, grades, prices, repairs, shipping and opening hours.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Ask Samsoom" ar="اسأل سمسوم" />
      <SitePage><AskPage /></SitePage>
    </>
  );
}
