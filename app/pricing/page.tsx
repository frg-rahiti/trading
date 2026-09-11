import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabase-server';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function Pricing() {
  const supabase = await createServerSupabase();
  const { data: products } = await supabase.from('products').select('id,slug,name,platform,description,price_cents,currency').eq('published', true).gt('price_cents', 0).order('created_at');

  return <><SiteHeader /><main className="container section">
    <span className="eyebrow">Pricing</span>
    <h1 style={{fontSize:'clamp(46px,6.5vw,72px)',lineHeight:1,letterSpacing:'-.06em',margin:'18px 0 14px'}}>Simple access. Clear pricing.</h1>
    <p className="muted" style={{fontSize:18,lineHeight:1.8,maxWidth:700}}>Every V1 product is a one-time purchase. No bundles, subscriptions or hidden tiers in the initial launch.</p>
    {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',marginTop:38}}>{products.map(p=><article className="card product-card" key={p.id}><div className="product-meta"><span className="eyebrow">{p.platform}</span><strong className="price">{(p.price_cents/100).toFixed(0)} {p.currency.toUpperCase()}</strong></div><h2>{p.name}</h2><p className="muted prose-muted">{p.description || 'Product details are available on the dedicated product page.'}</p><Link className="btn btn-primary" href={'/products/'+p.slug} prefetch>View product <span aria-hidden>→</span></Link></article>)}</div> : <div className="card" style={{padding:32,marginTop:40}}><h2>Pricing is not published yet.</h2><p className="muted">The catalog will appear here when products are published.</p></div>}
  </main><SiteFooter /></>;
}
