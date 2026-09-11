import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function Pricing() {
  const supabase = await createServerSupabase();
  const { data: products } = await supabase.from('products').select('id,slug,name,platform,description,price_cents,currency').eq('published', true).gt('price_cents', 0).order('created_at');

  return <main className="container section"><Link href="/">← Tahitian Trader</Link><div style={{marginTop:55}}><span className="pill">PRICING</span><h1 style={{fontSize:'clamp(46px,6vw,70px)',letterSpacing:'-.05em'}}>Simple access. Clear pricing.</h1><p className="muted" style={{fontSize:19,maxWidth:680,lineHeight:1.8}}>Each V1 product is sold as a straightforward one-time purchase. Final prices are shown only after they are configured.</p></div>
    {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',marginTop:40}}>{products.map(p=><article className="card" style={{padding:32}} key={p.id}><span className="pill">{p.platform.toUpperCase()}</span><h2 style={{fontSize:30,margin:'14px 0 5px'}}>{p.name}</h2><div style={{fontSize:34,fontWeight:800,marginBottom:14}}>{(p.price_cents/100).toFixed(2)} {p.currency.toUpperCase()}</div><p className="muted" style={{lineHeight:1.7,minHeight:60}}>{p.description || 'Product details are available on the product page.'}</p><Link className="btn btn-primary" href={'/products/'+p.slug}>View product</Link></article>)}</div> : <div className="card" style={{padding:32,marginTop:40}}><h2>Pricing is not published yet.</h2><p className="muted">The products and files are configured in the private backend. The public catalog will open once the final prices and Stripe prices are entered.</p></div>}
  </main>;
}
