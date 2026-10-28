import TabTitle from '@/components/site/TabTitle';
import StaffClient from './StaffClient';

export const metadata = { title: 'Sam Electronics - Control Room', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <TabTitle page="Control Room" ar="غرفة التحكم" />
      <StaffClient />
    </>
  );
}
