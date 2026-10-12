import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The design's logic classes start timers/animations in componentDidMount and were written for
  // a single mount (the design runtime did not use StrictMode), so keep dev behaviour identical.
  reactStrictMode: false,
};

export default nextConfig;
