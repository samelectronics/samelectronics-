'use client';
import SESamsoom from '@/components/dc/SESamsoom';
export default function P() {
  const m = typeof window !== 'undefined' ? new URLSearchParams(location.search).get('m') || 'kiss' : 'kiss';
  return <div style={{ background: '#fff', padding: 40, display: 'flex', gap: 30 }}><SESamsoom mood={m} size={320} /></div>;
}
