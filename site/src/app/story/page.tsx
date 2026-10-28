import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import StoryPage from '@/components/info/StoryPage';

export const metadata = { title: 'Sam Electronics - Our story', description: 'Sam Electronics since 2003: our story, mission, team, branches and careers.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Our story" ar="قصتنا" />
      <SitePage><StoryPage /></SitePage>
    </>
  );
}
