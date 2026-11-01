// R9 · SEO part page (/p/<part>): one part, one grade. Product structured data with price and stock, breadcrumbs, the
// other grades of the same part and the model's other parts.
import { notFound } from 'next/navigation';
import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import BuyBox from '@/components/seo/BuyBox';
import { catalog, partBySlug, modelBySlug, productLd, crumbsLd, abs } from '@/lib/seo';
import { site } from '@/content/facts';

export const dynamicParams = false;
export function generateStaticParams() { return catalog().parts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = partBySlug((await params).slug); if (!p) return {};
  return { title: `${p.title} · ${p.gradeName} | Sam Electronics Dubai`, description: `${p.name} for ${p.modelName}, ${p.gradeName} grade by ${p.maker}. Tested, ${p.warranty} warranty. ${p.stock > 0 ? 'In stock' : 'Ask for stock'} in Deira, Dubai; shipped worldwide.`, alternates: { canonical: '/p/' + p.slug }, openGraph: { title: p.title + ' · ' + p.gradeName, images: p.imgBig ? [abs(p.imgBig)] : undefined } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = partBySlug((await params).slug); if (!p) notFound();
  const m = modelBySlug(p.modelSlug), grades = m ? m.parts.filter((x) => x.cat === p.cat && x.id !== p.id) : [], more = m ? m.parts.filter((x) => x.cat !== p.cat).slice(0, 8) : [];
  const ld = [productLd(p), crumbsLd([['Home', '/'], ['Models', '/m'], [p.modelName, '/m/' + p.modelSlug], [p.title, '/p/' + p.slug]])];
  const spec: [string, string][] = [['Part', p.name], ['Fits', p.modelName], ['Grade', p.gradeName], ['Quality', p.quality], ['Made by', p.maker], ['Warranty', p.warranty], ['Part number', p.id]];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <TabTitle page={p.title} ar={p.title} />
      <SitePage>
        <section className="sx-hero sx-hero-p">
          <div className="sp-wrap sx-pgrid">
            <div className="sx-pimg">{p.imgBig ? <img src={p.imgBig} alt={p.title + ' ' + p.gradeName} width={960} height={960} /> : null}</div>
            <div className="sx-pinfo">
              <nav className="sx-crumb" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><a href={'/m/' + p.modelSlug}>{p.modelName}</a><i>/</i><span>{p.catName}</span></nav>
              <span className={'pc-gr g-' + p.grade}>{p.gradeName}</span>
              <h1 className="sx-h1 sm">{p.title}</h1>
              <p className="sx-sub">{p.name} for the {p.modelName}. {p.gradeName} grade by {p.maker}, tested on our bench before it ships, with a {p.warranty} warranty.</p>
              <BuyBox id={p.id} price={p.price} stock={p.stock} title={p.title + ' ' + p.gradeName} wa={site.contact.whatsapp} />
              <dl className="sx-spec">{spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              {p.sample ? <p className="sx-note">Price and stock are samples until our live stock system is connected.</p> : null}
            </div>
          </div>
        </section>
        {grades.length ? (
          <section className="sp-sec w"><div className="sp-wrap"><h2 className="sx-h2">Other grades of this part</h2>
            <div className="sx-grid">{grades.map((x) => <a key={x.id} className="sx-card" href={'/p/' + x.slug}><span className="sx-img">{x.img ? <img src={x.img} alt="" loading="lazy" width={240} height={240} /> : null}</span><span className={'pc-gr g-' + x.grade}>{x.gradeName}</span><b>{x.title}</b><small>{x.maker} · {x.warranty}</small><span className="sx-row"><em>AED {x.price}</em><i className={x.stock > 0 ? 'in' : ''}>{x.stock > 0 ? 'In stock' : 'Out of stock'}</i></span></a>)}</div>
          </div></section>
        ) : null}
        {more.length ? (
          <section className="sp-sec"><div className="sp-wrap"><h2 className="sx-h2">More {p.modelName} parts</h2>
            <div className="sx-grid">{more.map((x) => <a key={x.id} className="sx-card" href={'/p/' + x.slug}><span className="sx-img">{x.img ? <img src={x.img} alt="" loading="lazy" width={240} height={240} /> : null}</span><span className={'pc-gr g-' + x.grade}>{x.gradeName}</span><b>{x.title}</b><small>{x.catName}</small><span className="sx-row"><em>AED {x.price}</em></span></a>)}</div>
            <p><a className="sp-btn ghost" href={'/m/' + p.modelSlug}>Every {p.modelName} part →</a></p>
          </div></section>
        ) : null}
      </SitePage>
    </>
  );
}
