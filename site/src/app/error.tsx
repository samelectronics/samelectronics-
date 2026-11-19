'use client';
// A designed error page for any part of the site (owner, 19 Nov): the reason, a retry, and a way to report it.
import ErrorScreen from '@/components/site/ErrorScreen';

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorScreen error={error} retry={retry} />;
}
