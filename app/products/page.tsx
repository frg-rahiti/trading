import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabase-server';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const supabase = await createServerSupabase();
  const { data: products } = await supabase
    .from('products')
    .select('id,slug,name,platform,description,price_cents,currency')
    .eq('published', true)
    .order('created_at');

  return <>
    <SiteHeader />
    <main>
      <section className="hero premium-hero shop-hero">
        <div className="container">
          <span className="eyebrow">Tahitian Trader · V1 Store</span>
          <h1>Trading systems.<br /><span className="gradient">One-time access.</span></h1>
          <p className="hero-copy shop-intro">Explore the V1 collection of systematic trading tools for MetaTrader 5 and TradingView. Every release shows its platform, delivery format and price before you buy.</p>
          <div className="shop-principles">
            <div className="shop-principle"><strong>One-time purchase</strong><span>No subscription or recurring fee.</span></div>
            <div className="shop-principle"><strong>Digital delivery</strong><span>Access your purchased files from your account.</span></div>
            <div className="shop-principle"><strong>Clear pricing</strong><span>The displayed price is the V1 purchase price.</span></div>
          </div>
        </div>
      </section>

      <section className="container section-tight">
        <div className="section-head">
          <div>
            <span className="eyebrow">The collection</span>
            <h2>Choose your system.</h2>
            <p className="muted prose-muted">Read the dedicated product page for methodology, compatibility, delivery and performance evidence before checkout.</p>
          </div>
        </div>

        {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',marginTop:34}}>{products.map(p=><article className="card product-card shop-card" key={p.id}>
          <div className="product-meta"><span className="eyebrow">{p.platform}</span><strong className="price">{(p.price_cents/100).toFixed(0)} {p.currency.toUpperCase()}</strong></div>
          <h2>{p.name}</h2>
          <p className="muted prose-muted">{p.description || 'Product details are available on the dedicated product page.'}</p>
          <div className="product-footer"><span className="muted" style={{fontSize:12}}>V1 · Digital delivery</span><Link className="btn btn-primary" href={'/products/'+p.slug} prefetch>View product <span aria-hidden>→</span></Link></div>
        </article>)}</div> : <div className="card" style={{padding:32,marginTop:40}}><h2>Products are being prepared.</h2><p className="muted">The V1 catalog is configured privately and will appear here when published.</p></div>}
      </section>

      <section className="container section-tight">
        <div className="card card-dark" style={{padding:'30px 32px'}}>
          <span className="pill">V1 pricing</span>
          <h2 style={{fontSize:'clamp(28px,4vw,42px)',margin:'14px 0 8px'}}>Simple by design.</h2>
          <p style={{color:'#b7bfd4',lineHeight:1.75,maxWidth:760,margin:0}}>The initial launch keeps the offer deliberately simple: individual products, one-time payment and digital delivery. Subscriptions, bundles, coupons and additional tiers are reserved for future versions.</p>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
