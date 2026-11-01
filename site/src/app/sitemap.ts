// R9 · sitemap.xml: the main pages, every model page and every part page
import type { MetadataRoute } from 'next';
import { catalog, SITE } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(), c = catalog();
  const main: [string, number][] = [['/', 1], ['/shop', 0.9], ['/m', 0.8], ['/repair', 0.8], ['/wholesale', 0.7], ['/worldwide', 0.6], ['/brands', 0.6], ['/membership', 0.5], ['/story', 0.5], ['/contact', 0.6], ['/faq', 0.5], ['/samsoom', 0.4], ['/legal', 0.2]];
  return [
    ...main.map(([u, p]) => ({ url: SITE + u, lastModified: now, changeFrequency: 'weekly' as const, priority: p })),
    ...c.models.filter((m) => m.parts.length).map((m) => ({ url: SITE + '/m/' + m.slug, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...c.parts.map((p) => ({ url: SITE + '/p/' + p.slug, lastModified: now, changeFrequency: 'daily' as const, priority: 0.6 })),
  ];
}
