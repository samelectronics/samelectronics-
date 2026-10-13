import type { Metadata } from 'next';
import NotFoundCard from '@/components/g17/NotFoundCard';

export const metadata: Metadata = { title: 'Signal lost · Sam Electronics' };

/** G17: the branded 404. */
export default function NotFound() {
  return <NotFoundCard />;
}
