// Owner (18 Nov): "the compare icon doesn't hint at comparing". Two parts side by side with arrows swapping between them.
import React from 'react';
export function CompareIcon({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4" width="6.5" height="16" rx="1.6" /><rect x="15" y="4" width="6.5" height="16" rx="1.6" />
      <path d="M10.6 9.5h3.2M12.4 8l1.5 1.5-1.5 1.5M13.4 14.5h-3.2M11.6 13l-1.5 1.5 1.5 1.5" />
    </svg>
  );
}
