'use client';
import dynamic from 'next/dynamic';
// R10 A3: the Control Room lives in its own bundle (the public site never downloads it) and has its own loading screen
const Boot = () => (
  <div className="cr-boot" role="status" aria-live="polite">
    <div className="cr-boot-in">
      <img src="/assets/se-logo-128.webp" alt="" width={72} height={72} />
      <b>CONTROL ROOM</b>
      <span>Opening the Control Room…</span>
      <em><i /></em>
    </div>
  </div>
);
// the Control Room reads the browser's data while rendering, so it renders in the browser
const StaffApp = dynamic(() => import('@/components/staff/StaffApp'), { ssr: false, loading: Boot });
export default function StaffClient() { return <StaffApp />; }
