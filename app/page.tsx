import Link from 'next/link';
import { createServerSupabase } from '../lib/supabase-server';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createServerSupabase();
  const { data: products } = await supabase
    .from('products')
    .select('id,slug,name,platform,description,price_cents,currency')
    .eq('published', true)
    .order('created_at');

  return <>
    <SiteHeader />
    <main>
      <section className="container hero premium-hero home-hero">
        <div className="hero-layout">
          <div className="home-hero-copy">
            <span className="eyebrow">Algorithmic trading technology</span>
            <h1>Trading systems.<br /><span className="hero-gradient-text">Built to be measured.</span></h1>
            <p className="hero-copy muted">Premium MetaTrader 5 Expert Advisors and TradingView strategies designed for systematic traders who care about process, evidence and controlled execution.</p>
            <div className="hero-actions">
              <Link className="btn btn-accent" href="/products" prefetch>Explore products <span aria-hidden>→</span></Link>
              <Link className="btn btn-secondary" href="/performance" prefetch>See the evidence</Link>
            </div>
            <div className="trust-strip" style={{marginTop:42}}>
              <div className="trust-item"><strong>Private delivery</strong><span>Authenticated product access</span></div>
              <div className="trust-item"><strong>Measured results</strong><span>Backtest and Monte Carlo separated</span></div>
              <div className="trust-item"><strong>One-time purchase</strong><span>No recurring subscription in V1</span></div>
            </div>
          </div>
          <div className="hero-panel home-hero-visual" aria-hidden="true">
            <div className="hero-orbit">
              <div className="hero-orbit-core">TT</div>
              <div className="hero-metric one"><strong>MT5 + TV</strong><span>Execution stack</span></div>
              <div className="hero-metric two"><strong>Evidence first</strong><span>Risk-aware approach</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-tight">
        <div className="section-head">
          <div>
            <span className="eyebrow">The product lineup</span>
            <h2>Focused tools, not a crowded marketplace.</h2>
          </div>
          <Link className="back-link" href="/products" prefetch>View all products →</Link>
        </div>
        {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',marginTop:28}}>{products.map(p=><article className="card product-card" key={p.id}>
          <div className="product-meta"><span className="eyebrow">{p.platform}</span>{p.price_cents > 0 && <strong className="price">{(p.price_cents/100).toFixed(0)} {p.currency.toUpperCase()}</strong>}</div>
          <h3>{p.name}</h3>
          <p className="muted prose-muted">{p.description || 'Product details will be published with the verified launch information.'}</p>
          <div className="product-footer"><span className="muted" style={{fontSize:12}}>V1 · Digital delivery</span><Link className="btn btn-secondary" href={'/products/'+p.slug} prefetch>View product</Link></div>
        </article>)}</div> : <div className="card" style={{padding:30,marginTop:28}}><h3>Catalog preparation in progress</h3><p className="muted">The V1 products are configured privately and will appear here once their commercial pricing and publication status are finalized.</p></div>}
      </section>

      <section className="container section-tight">
        <div className="card card-dark home-evidence-card" style={{position:'relative',overflow:'hidden'}}>
          <div className="home-evidence-glow" aria-hidden="true" />
          <div style={{position:'relative',zIndex:1,maxWidth:760}}>
            <span className="eyebrow" style={{background:'rgba(255,255,255,.07)',borderColor:'rgba(255,255,255,.12)',color:'#bbaeff'}}>Measured, not marketed</span>
            <h2 style={{fontSize:'clamp(34px,5vw,56px)',lineHeight:1.02,letterSpacing:'-.055em',margin:'18px 0'}}>Backtests. Monte Carlo. Context.</h2>
            <p style={{color:'#b7bfd4',lineHeight:1.8,maxWidth:680}}>Historical, simulated, forward and live evidence stay clearly separated. No fabricated figures. No profit promises. Performance data will be added as it is verified.</p>
            <Link className="btn btn-accent" href="/performance" prefetch style={{marginTop:20}}>Explore performance</Link>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
