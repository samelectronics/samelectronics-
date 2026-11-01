// R9 · every model we carry parts for, by brand (links to /m/<model>)
import SitePage from '@/components/site/SitePage';
import TabTitle from '@/components/site/TabTitle';
import { catalog } from '@/lib/seo';

export const metadata = { title: 'Phone models we carry parts for | Sam Electronics Dubai', description: 'Find your phone: screens, batteries, cameras and more for Apple, Samsung, Xiaomi, Huawei, Oppo and other brands. Deira, Dubai.', alternates: { canonical: '/m' } };

export default function Page() {
  const b = catalog().brands.map((x) => ({ ...x, models: x.models.filter((m) => m.parts.length) })).filter((x) => x.models.length);
  return (
    <>
      <TabTitle page="Models" ar="الموديلات" />
      <SitePage>
        <section className="sx-hero"><div className="sp-wrap">
          <nav className="sx-crumb" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><span>Models</span></nav>
          <span className="sp-eb">FIND YOUR PHONE</span><h1 className="sx-h1">Every model. <em>Every part.</em></h1>
          <p className="sx-sub">Pick your phone to see every part we carry for it, in every grade.</p>
          <div className="sx-brandjump">{b.map((x) => <a key={x.id} href={'#' + x.id}>{x.name}</a>)}</div>
        </div></section>
        <section className="sp-sec w"><div className="sp-wrap">
          {b.map((x) => (
            <div key={x.id} id={x.id} className="sx-group"><h2 className="sx-h2">{x.name} <small>{x.models.length}</small></h2>
              <div className="sx-models">{x.models.map((m) => <a key={m.id} href={'/m/' + m.slug}><b>{m.name}</b><small>{m.parts.length} parts</small></a>)}</div>
            </div>
          ))}
        </div></section>
      </SitePage>
    </>
  );
}
