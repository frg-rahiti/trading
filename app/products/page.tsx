import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const supabase = await createServerSupabase();
  const { data: products } = await supabase.from('products').select('id,slug,name,platform,description,price_cents,currency').eq('published', true).order('created_at');

  return <><header className="site-header"><div className="container" style={{height:72,display:'flex',alignItems:'center',justifyContent:'space-between'}}><Link className="brand" href="/">TAHITIAN <span className="gradient">TRADER</span></Link><nav className="nav"><Link href="/performance">Performance</Link><Link href="/resources">Resources</Link><Link href="/pricing">Pricing</Link><Link href="/login">Login</Link></nav></div></header>
    <main className="container section"><span className="pill">PRODUCTS</span><h1 style={{fontSize:'clamp(44px,6vw,70px)',letterSpacing:'-.05em',margin:'16px 0'}}>Algorithmic tools, without the hype.</h1><p className="muted" style={{maxWidth:700,fontSize:18,lineHeight:1.7}}>Inspect the methodology, compatibility and published evidence before you buy.</p>
      {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',marginTop:40}}>{products.map(p=><article className="card" style={{padding:30}} key={p.id}><span className="pill">{p.platform.toUpperCase()}</span><h2 style={{fontSize:27,marginTop:14}}>{p.name}</h2><p className="muted" style={{lineHeight:1.7,minHeight:78}}>{p.description || 'Verified product information will be shown on the product page.'}</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginTop:20}}><Link className="btn btn-primary" href={'/products/'+p.slug}>View Product</Link><strong>{p.price_cents > 0 ? `${(p.price_cents/100).toFixed(2)} ${p.currency.toUpperCase()}` : 'Price pending'}</strong></div></article>)}</div> : <div className="card" style={{padding:32,marginTop:40}}><h2>Products are being prepared.</h2><p className="muted">The V1 catalog is configured privately. Products will be published when their final commercial pricing is ready.</p></div>}
    </main>
  </>;
}
