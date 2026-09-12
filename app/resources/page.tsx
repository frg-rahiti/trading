import Link from 'next/link';
import { getLocale, getTranslations } from '../../lib/i18n';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

type ResourceItem = readonly [title: string, desc: string];

export default async function Resources() {
  const locale = await getLocale();
  const t = getTranslations(locale).resources;
  const hrefs = ['/dashboard', '/products', '/performance', '/resources', '/legal/risk-disclaimer'];
  const items = t.items as ResourceItem[];

  return (
    <>
      <SiteHeader />
      <main className="hero premium-hero">
        <div className="container">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>
            {t.title1}
            <br />
            <span className="gradient">{t.title2}</span>
          </h1>
          <p className="hero-copy" style={{ maxWidth: 760 }}>{t.copy}</p>
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', marginTop: 42 }}
          >
            {items.map(([title, desc]: ResourceItem, i: number) => (
              <article className="card product-card resource-card" key={title}>
                <div className="resource-icon">{String(i + 1).padStart(2, '0')}</div>
                <h2>{title}</h2>
                <p className="muted prose-muted">{desc}</p>
                <Link className="btn btn-secondary" href={hrefs[i]} prefetch>
                  {t.open} <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
