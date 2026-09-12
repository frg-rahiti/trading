import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

const items = [
  ['01', 'Getting started', 'How to access a purchase, download your file and move from checkout to your dashboard.', '/dashboard'],
  ['02', 'Product documentation', 'Platform compatibility, delivery format and the information you need before installing a release.', '/products'],
  ['03', 'Performance methodology', 'How backtests, Monte Carlo analysis, forward testing and live results are presented separately.', '/performance'],
  ['04', 'FAQ & support', 'Common questions about purchases, licensing, downloads and account access.', '/resources'],
  ['05', 'Risk disclosure', 'Important information about automated trading, historical results and market risk.', '/legal/risk-disclaimer'],
];

export default function Resources() {
  return <>
    <SiteHeader />
    <main className="hero premium-hero">
      <div className="container">
        <span className="eyebrow">Resources</span>
        <h1>Everything around<br /><span className="gradient">the systems.</span></h1>
        <p className="hero-copy" style={{maxWidth:760}}>A practical knowledge hub for installation, product information, performance methodology and the questions that matter before and after a purchase.</p>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',marginTop:42}}>
          {items.map(([num,title,desc,href]) => <article className="card product-card resource-card" key={title}>
            <div className="resource-icon">{num}</div>
            <h2>{title}</h2>
            <p className="muted prose-muted">{desc}</p>
            <Link className="btn btn-secondary" href={href} prefetch>Open resource <span aria-hidden>→</span></Link>
          </article>)}
        </div>
      </div>
    </main>
    <SiteFooter />
  </>;
}
