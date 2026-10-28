'use client';
import dynamic from 'next/dynamic';
// the Control Room reads the browser's data while rendering, so it renders in the browser
const StaffApp = dynamic(() => import('@/components/staff/StaffApp'), { ssr: false, loading: () => <div className="cr-boot"><i /></div> });
export default function StaffClient() { return <StaffApp />; }
