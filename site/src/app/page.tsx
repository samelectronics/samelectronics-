import Home from '@/components/home/Home';
import TabTitle from '@/components/site/TabTitle';
import { facts, site } from '@/content/facts';
import { SITE } from '@/lib/seo';

// R9 · the shop as a local business for search engines (address, phone, opening hours from the company facts)
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], t = (n: number) => String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');
const LD = {
  '@context': 'https://schema.org', '@type': 'Store', name: 'Sam Electronics L.L.C', url: SITE, logo: SITE + '/icon-512.png', image: SITE + '/icon-512.png',
  description: 'Wholesale and retail mobile phone spare parts, repairs and worldwide shipping since 2003.', telephone: site.contact.storeTel || site.contact.mobile, email: site.contact.email,
  address: { '@type': 'PostalAddress', streetAddress: 'Al Murar', addressLocality: 'Deira, Dubai', addressCountry: 'AE' }, foundingDate: '2003', priceRange: 'AED',
  openingHoursSpecification: Object.entries(facts.hours.value).flatMap(([d, shifts]) => shifts.map(([a, b]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY[+d], opens: t(a), closes: t(b) }))),
  sameAs: ['https://maps.app.goo.gl/wiMCNcX3SqyPpM9S6'],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <TabTitle page="Home" ar="الرئيسية" />
      <Home />
    </>
  );
}
