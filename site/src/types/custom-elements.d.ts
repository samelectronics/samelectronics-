import type React from 'react';

// <image-slot> is the design's placeholder custom element (public/image-slot.js).
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'image-slot': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}
