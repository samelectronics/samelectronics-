// Owner (26 Oct): the phone / tablet / watch icons were plain outlines. These are small product drawings: a metal body,
// a glossy screen with a soft glare, the island / camera, side buttons, the watch strap and crown. The accent follows
// currentColor (white, or yellow when selected).
import React from 'react';

type Kind = 'phone' | 'tablet' | 'watch';

export default function DeviceIcon({ kind, size = 22 }: { kind: Kind | string; size?: number }) {
  const id = 'di' + kind;
  const defs = (
    <defs>
      <linearGradient id={id + 'b'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#D2D5D9" />
        <stop offset=".45" stopColor="#7C8086" />
        <stop offset="1" stopColor="#B6BABF" />
      </linearGradient>
      <linearGradient id={id + 's'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3A3D42" />
        <stop offset=".6" stopColor="#141518" />
        <stop offset="1" stopColor="#24262A" />
      </linearGradient>
    </defs>
  );
  if (kind === 'tablet')
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        {defs}
        <rect x="3.2" y="2.2" width="17.6" height="19.6" rx="2.6" fill={`url(#${id}b)`} />
        <rect x="4.3" y="3.3" width="15.4" height="17.4" rx="1.7" fill={`url(#${id}s)`} />
        <circle cx="12" cy="2.75" r=".32" fill="#26282B" />
        <path d="M4.3 3.3h7.6L4.3 13.6z" fill="#fff" opacity=".1" />
        <rect x="9" y="18.6" width="6" height=".9" rx=".45" fill="currentColor" opacity=".9" />
        <rect x="16.6" y="1.8" width="2.4" height=".55" rx=".27" fill="#8E939A" />
      </svg>
    );
  if (kind === 'watch')
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        {defs}
        <path d="M8.4 1.6h7.2l.8 4.2H7.6zM7.6 18.2h8.8l-.8 4.2H8.4z" fill="#3D4045" />
        <path d="M8.9 2.4h6.2M8.6 21.6h6.8" stroke="#565A60" strokeWidth=".5" />
        <rect x="5.6" y="5.2" width="12.8" height="13.6" rx="3.6" fill={`url(#${id}b)`} />
        <rect x="6.6" y="6.2" width="10.8" height="11.6" rx="2.8" fill={`url(#${id}s)`} />
        <rect x="18.3" y="9.6" width="1.5" height="2.6" rx=".6" fill="#9DA1A6" />
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.1" strokeDasharray="14 6.2" strokeLinecap="round" transform="rotate(-90 12 12)" />
        <path d="M6.6 6.2h5L6.6 12.4z" fill="#fff" opacity=".1" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {defs}
      <rect x="6" y="1.4" width="12" height="21.2" rx="2.8" fill={`url(#${id}b)`} />
      <rect x="6.9" y="2.3" width="10.2" height="19.4" rx="2.1" fill={`url(#${id}s)`} />
      <rect x="10.3" y="3.3" width="3.4" height="1.05" rx=".52" fill="#050506" />
      <path d="M6.9 2.3h6.2L6.9 12.8z" fill="#fff" opacity=".1" />
      <rect x="9.6" y="19.9" width="4.8" height=".6" rx=".3" fill="currentColor" opacity=".9" />
      <rect x="5.45" y="6.4" width=".6" height="2.2" rx=".3" fill="#8E939A" />
      <rect x="17.95" y="7.2" width=".6" height="3.2" rx=".3" fill="#8E939A" />
    </svg>
  );
}
