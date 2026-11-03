'use client';
import React from 'react';
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
// R11b: if anything in the Control Room breaks, show what broke (instead of a blank error page) with a way back
class Guard extends React.Component<{ children: React.ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { console.error('[Control Room]', err); }
  render() { if (!this.state.err) return this.props.children; return (
    <div className="cr-boot"><div className="cr-boot-in" style={{ maxWidth: 520, textAlign: 'center' }}>
      <img src="/assets/se-logo-128.webp" alt="" width={64} height={64} /><b>CONTROL ROOM</b>
      <span>Something on this screen could not load. Your data is safe.</span>
      <code style={{ display: 'block', margin: '10px 0', fontSize: 12, opacity: .7, wordBreak: 'break-word' }}>{String(this.state.err.message || this.state.err).slice(0, 300)}</code>
      <button type="button" className="cr-btn y" onClick={() => { location.hash = 'dashboard'; location.reload(); }}>Reload the Control Room</button>
    </div></div>
  ); }
}
export default function StaffClient() { return <Guard><StaffApp /></Guard>; }
