// Owner (18 Nov, round 2): "the compare button should look more like comparing". A balance scale: two parts weighed
// against each other, the universal sign for comparing.
import React from 'react';
export function CompareIcon({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4.6V20M8 20h8M4.5 7.2h15" />
      <circle cx="12" cy="4" r="1.3" fill="currentColor" stroke="none" />
      <path d="M4.5 7.2L2 13.5M4.5 7.2L7 13.5M19.5 7.2L17 13.5M19.5 7.2L22 13.5" />
      <path d="M1.6 13.5h5.8a2.9 2.4 0 0 1-5.8 0zM16.6 13.5h5.8a2.9 2.4 0 0 1-5.8 0z" fill="currentColor" fillOpacity=".18" />
    </svg>
  );
}
