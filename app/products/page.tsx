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
    <main className="container section">
      <div className="section-head" style={{alignItems:'start'}}>
        <div>
          <span className="eyebrow">Products</span>
          <h1 style={{fontSize:'clamp(46px,6.5vw,72px)',lineHeight:1,letterSpacing:'-.06em',margin:'18px 0 14px'}}>Tools for traders who want a system.</h1>
          <p className="muted" style={{fontSize:18,lineHeight:1.8,maxWidth:720}}>Explore the methodology, compatibility, delivery format and published evidence before you buy.</p>
        </div>
      </div>

      {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',marginTop:38}}>{products.map(p=><article className="card product-card" key={p.id}>
        <div className="product-meta"><span className="eyebrow">{p.platform}</span>{p.price_cents > 0 && <strong className="price">{(p.price_cents/100).toFixed(0)} {p.currency.toUpperCase()}</strong>}</div>
        <h2>{p.name}</h2>
        <p className="muted prose-muted">{p.description || 'Verified product information is available on the product page.'}</p>
        <div style={{marginTop:24,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <span className="muted" style={{fontSize:12}}>V1 · Instant digital delivery</span>
          <Link className="btn btn-primary" href={'/products/'+p.slug} prefetch>View product <span aria-hidden>→</span></Link>
        </div>
      </article>)}</div> : <div className="card" style={{padding:32,marginTop:40}}><h2>Products are being prepared.</h2><p className="muted">The V1 catalog is configured privately and will appear here when published.</p></div>}
    </main>
    <SiteFooter />
  </>;
}
