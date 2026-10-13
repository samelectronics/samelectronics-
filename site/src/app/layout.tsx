import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { DC_FONT_CSS, DC_SCRIPTS, DC_TITLE } from '@/dc/head';
import { windowFacts } from '@/content/facts';
import { PRE_PAINT } from '@/i18n/prepaint';
import '@/styles/arabic.css';
import '@/styles/dc-base.css';
import '@/styles/dc.css';
import '@/styles/live-board.css';
import '@/styles/bench-test.css';
import '@/styles/showcase.css';
import '@/styles/deals.css';
import '@/styles/wholesale.css';
import '@/styles/worldwide.css';

export const metadata: Metadata = {
  title: DC_TITLE ?? 'Sam Electronics',
  description:
    'Sam Electronics L.L.C, Al Murar, Deira, Dubai: wholesale and retail mobile phone spare parts, repairs and worldwide shipping since 2003. Quality · Warranty · Price.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {DC_FONT_CSS.map((href) => (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>
        {/* G9: Arabic or English before the first paint. */}
        <Script id="se-lang" strategy="beforeInteractive">
          {PRE_PAINT}
        </Script>
        {/* Company facts for public/se-data.js (must run before it). */}
        <Script id="se-facts" strategy="beforeInteractive">
          {`window.SE_FACTS=${JSON.stringify(windowFacts()).replace(/</g, '\\u003c')};`}
        </Script>
        {/* Data + engine globals the design components read from window (files in public/, unchanged from the design). */}
        {DC_SCRIPTS.map((src) => (
          <Script key={src} src={'/' + src} strategy="beforeInteractive" />
        ))}
        {children}
      </body>
    </html>
  );
}
