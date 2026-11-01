// R9 · SEO model page (/m/galaxy-a54): every part we carry for one model, by part type and grade, with its own title,
// description, breadcrumbs and an ItemList of Products for search engines.
import { notFound } from 'next/navigation';
import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import Faq from '@/components/site/Faq';
import { catalog, modelBySlug, productLd, crumbsLd, abs } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() { return catalog().models.filter((m) => m.parts.length).map((m) => ({ slug: m.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = modelBySlug((await params).slug); if (!m) return {};
  const kinds = Array.from(new Set(m.parts.map((p) => p.catName.toLowerCase()))).slice(0, 4).join(', ');
  return { title: `${m.full} parts & repair · ${kinds} | Sam Electronics Dubai`, description: `${m.parts.length} genuine and tested ${m.full} parts in every grade (${kinds}). Fitted in Deira, Dubai or shipped worldwide, with warranty.`, alternates: { canonical: '/m/' + m.slug }, openGraph: { title: `${m.full} parts · Sam Electronics`, images: m.parts[0]?.imgBig ? [abs(m.parts[0].imgBig)] : undefined } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const m = modelBySlug((await params).slug); if (!m) notFound();
  const groups = Array.from(new Set(m.parts.map((p) => p.catName))).map((c) => [c, m.parts.filter((p) => p.catName === c)] as const);
  const ld = [crumbsLd([['Home', '/'], ['Models', '/m'], [m.brandName, '/m#' + m.brand], [m.full, '/m/' + m.slug]]), { '@context': 'https://schema.org', '@type': 'ItemList', name: m.full + ' parts', itemListElement: m.parts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs('/p/' + p.slug), item: productLd(p) })) }];
  const low = Math.min(...m.parts.map((p) => p.price)), inStock = m.parts.filter((p) => p.stock > 0).length;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <TabTitle page={m.full + ' parts'} ar={'قطع ' + m.full} />
      <SitePage>
        <section className="sx-hero">
          <div className="sp-wrap">
            <nav className="sx-crumb" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><a href="/m">Models</a><i>/</i><a href={'/m#' + m.brand}>{m.brandName}</a><i>/</i><span>{m.name}</span></nav>
            <span className="sp-eb">{m.brandName.toUpperCase()} · {m.series.toUpperCase()}</span>
            <h1 className="sx-h1">{m.full} <em>parts &amp; repair</em></h1>
            <p className="sx-sub">Every part we carry for the {m.full}, in every grade we stock. Tested before it ships, with warranty, fitted in Deira or sent worldwide.</p>
            <div className="sx-stats"><span><b>{m.parts.length}</b><small>parts</small></span><span><b>{groups.length}</b><small>part types</small></span><span><b>{inStock}</b><small>in stock</small></span><span><b>AED {low}</b><small>from · sample</small></span></div>
            {m.codes.length ? <p className="sx-codes">Model codes: {m.codes.map((c) => <code key={c}>{c}</code>)}</p> : null}
            <div className="sp-acts"><a className="sp-btn" href={'/shop?model=' + m.id}>Shop {m.name} parts</a><a className="sp-btn ghost" href={'/repair?model=' + m.id + '#pick'}>Book a repair</a></div>
          </div>
        </section>
        <section className="sp-sec w">
          <div className="sp-wrap">
            {groups.map(([c, list]) => (
              <div key={c} className="sx-group" id={list[0].cat}>
                <h2 className="sx-h2">{m.name} {c.toLowerCase()} <small>{list.length}</small></h2>
                <div className="sx-grid">
                  {list.map((p) => (
                    <a key={p.id} className="sx-card" href={'/p/' + p.slug}>
                      <span className="sx-img">{p.img ? <img src={p.img} alt={p.title + ' ' + p.gradeName} loading="lazy" width={240} height={240} /> : null}</span>
                      <span className={'pc-gr g-' + p.grade}>{p.gradeName}</span>
                      <b>{p.title}</b><small>{p.maker} · {p.warranty} warranty</small>
                      <span className="sx-row"><em>AED {p.price}</em><i className={p.stock > 0 ? 'in' : ''}>{p.stock > 0 ? 'In stock' : 'Out of stock'}</i></span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <p className="sx-note">Prices are samples until our live stock system is connected.</p>
          </div>
        </section>
        <Faq topic="shop" />
      </SitePage>
    </>
  );
}
