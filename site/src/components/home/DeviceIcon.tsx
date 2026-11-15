// R12 (owner: "cartoonish, thick edges"): clean product drawings. A thin titanium edge (light rolled highlight, darker
// band), near edge-to-edge black glass with a soft diagonal reflection, and only the real details: the Dynamic Island,
// the iPad's front camera, the watch's crown, side button and woven band. No outlines, no fake home bar.
import React from 'react';

type Kind = 'phone' | 'tablet' | 'watch';

export default function DeviceIcon({ kind, size = 22 }: { kind: Kind | string; size?: number }) {
  const id = 'dv' + kind;
  const defs = (
    <defs>
      <linearGradient id={id + 'm'} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7B7F84" /><stop offset=".06" stopColor="#E6E8EA" /><stop offset=".16" stopColor="#A9ADB2" />
        <stop offset=".5" stopColor="#C3C6CA" /><stop offset=".84" stopColor="#A2A6AB" /><stop offset=".94" stopColor="#E0E2E4" /><stop offset="1" stopColor="#74787D" />
      </linearGradient>
      <linearGradient id={id + 'g'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2B2D31" /><stop offset=".55" stopColor="#0D0E10" /><stop offset="1" stopColor="#1A1B1E" />
      </linearGradient>
      <linearGradient id={id + 'r'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".22" /><stop offset=".35" stopColor="#FFFFFF" stopOpacity=".05" /><stop offset=".36" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
  if (kind === 'tablet')
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        {defs}
        <rect x="7" y="4.5" width="34" height="39" rx="3.6" fill={`url(#${id}m)`} />
        <rect x="7.7" y="5.2" width="32.6" height="37.6" rx="3" fill="#050506" />
        <rect x="9.2" y="6.7" width="29.6" height="34.6" rx="1.6" fill={`url(#${id}g)`} />
        <rect x="9.2" y="6.7" width="29.6" height="34.6" rx="1.6" fill={`url(#${id}r)`} />
        <circle cx="24" cy="5.95" r=".45" fill="#2A2C30" />
        <rect x="33" y="4.05" width="5" height=".55" rx=".27" fill="#A9ADB2" />
      </svg>
    );
  if (kind === 'watch')
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        {defs}
        <path d="M16.6 3h14.8l1.2 8.6H15.4zM15.4 36.4h17.2L31.4 45H16.6z" fill="#2E3034" />
        <path d="M17.4 5h13.2M17.2 7h13.6M17 9h14M17 39h14M17.2 41h13.6M17.4 43h13.2" stroke="#3B3E43" strokeWidth=".55" />
        <rect x="11.6" y="10.6" width="24.8" height="26.8" rx="7.2" fill={`url(#${id}m)`} />
        <rect x="12.4" y="11.4" width="23.2" height="25.2" rx="6.5" fill="#050506" />
        <rect x="13.8" y="12.8" width="20.4" height="22.4" rx="5.4" fill={`url(#${id}g)`} />
        <rect x="13.8" y="12.8" width="20.4" height="22.4" rx="5.4" fill={`url(#${id}r)`} />
        <rect x="36.2" y="18.2" width="1.8" height="4.6" rx=".8" fill={`url(#${id}m)`} />
        <rect x="36.3" y="25.2" width="1.2" height="3.6" rx=".5" fill="#A9ADB2" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {defs}
      <rect x="13.2" y="2.6" width="21.6" height="42.8" rx="5.4" fill={`url(#${id}m)`} />
      <rect x="13.85" y="3.25" width="20.3" height="41.5" rx="4.8" fill="#050506" />
      <rect x="15" y="4.4" width="18" height="39.2" rx="3.9" fill={`url(#${id}g)`} />
      <rect x="15" y="4.4" width="18" height="39.2" rx="3.9" fill={`url(#${id}r)`} />
      <rect x="21.2" y="5.6" width="5.6" height="1.7" rx=".85" fill="#000" />
      <rect x="12.75" y="11" width=".5" height="3" rx=".25" fill="#A9ADB2" />
      <rect x="12.75" y="15.6" width=".5" height="4.6" rx=".25" fill="#A9ADB2" />
      <rect x="34.75" y="13.6" width=".5" height="6.4" rx=".25" fill="#A9ADB2" />
    </svg>
  );
}
