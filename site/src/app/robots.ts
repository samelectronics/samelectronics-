import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/staff', '/api/', '/account', '/cart'] }], sitemap: SITE + '/sitemap.xml', host: SITE };
}
