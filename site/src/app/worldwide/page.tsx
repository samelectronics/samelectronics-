import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import WorldwidePage from '@/components/info/WorldwidePage';

export const metadata = { title: 'Sam Electronics - Worldwide', description: 'Mobile phone parts shipped door to door to 28+ countries from Dubai.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Worldwide" ar="حول العالم" />
      <SitePage><WorldwidePage /></SitePage>
    </>
  );
}
