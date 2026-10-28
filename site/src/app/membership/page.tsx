import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import Membership from '@/components/info/Membership';

export const metadata = { title: 'Sam Electronics - Sam Circuit', description: 'Sam Circuit, Sam Grid and Sam Circle: the three Sam Electronics membership cards, their levels, points and perks.' };

export default function Page() {
  return (
    <>
      <TabTitle page="Sam Circuit" ar="سام سيركت" />
      <SitePage><Membership /></SitePage>
    </>
  );
}
