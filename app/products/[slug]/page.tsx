import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '../../../lib/supabase-server';
import BuyButton from '../../../components/BuyButton';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: product } = await supabase.from('products').select('id,slug,name,platform,description,price_cents,currency').eq('slug', slug).eq('published', true).single();
  if (!product) notFound();

  const { data: version } = await supabase.from('product_versions').select('id,version,release_date,ex5_path,pine_path,documentation_path').eq('product_id', product.id).order('release_date', { ascending: false }).limit(1).maybeSingle();
  const files: string[] = [];
  if (version?.ex5_path) files.push('MetaTrader 5 Expert Advisor (.ex5)');
  if (version?.pine_path) files.push('TradingView source (.pine)');
  if (version?.documentation_path) files.push('Documentation');

  return <>
    <SiteHeader />
    <main className="container section">
      <Link className="back-link" href="/products" prefetch>← Back to products</Link>
      <div style={{marginTop:48,maxWidth:860}}>
        <span className="eyebrow">{product.platform}</span>
        <h1 style={{fontSize:'clamp(44px,6.8vw,78px)',lineHeight:1,letterSpacing:'-.065em',margin:'18px 0'}}>{product.name}</h1>
        <p className="muted" style={{fontSize:19,lineHeight:1.8,maxWidth:790}}>{product.description || 'Commercial and technical details will be published with the verified product release.'}</p>
      </div>

      <div className="grid" style={{gridTemplateColumns:'minmax(0,1.55fr) minmax(300px,.75fr)',marginTop:42,alignItems:'start'}}>
        <section className="card" style={{padding:32}}>
          <div className="grid" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))',paddingBottom:26,borderBottom:'1px solid var(--line)'}}>
            <div><span className="muted" style={{fontSize:12}}>Platform</span><strong style={{display:'block',marginTop:6,textTransform:'uppercase'}}>{product.platform}</strong></div>
            <div><span className="muted" style={{fontSize:12}}>Version</span><strong style={{display:'block',marginTop:6}}>{version?.version ?? 'V1'}</strong></div>
            <div><span className="muted" style={{fontSize:12}}>Release</span><strong style={{display:'block',marginTop:6}}>{version?.release_date ?? 'Launch build'}</strong></div>
          </div>

          <h2 style={{marginTop:32,fontSize:26,letterSpacing:'-.035em'}}>What you receive</h2>
          {files.length ? <div className="grid" style={{marginTop:16}}>{files.map(file=><div key={file} className="card card-glass" style={{padding:'15px 17px',boxShadow:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}><strong>{file}</strong><span className="muted" style={{fontSize:12}}>Included</span></div>)}</div> : <p className="muted prose-muted">No downloadable file is associated with this version yet.</p>}

          <h2 style={{marginTop:36,fontSize:26,letterSpacing:'-.035em'}}>Performance evidence</h2>
          <p className="muted prose-muted">Verified backtests and Monte Carlo results will be displayed here when published. Simulated results remain clearly separated from forward testing and live performance.</p>

          <div style={{marginTop:30,paddingTop:22,borderTop:'1px solid var(--line)'}}><strong>Secure delivery</strong><p className="muted" style={{fontSize:13,lineHeight:1.7,marginBottom:0}}>Files stay in private Supabase Storage and are delivered through temporary signed URLs after authenticated purchase verification.</p></div>
        </section>

        <aside className="card card-dark" style={{padding:30,position:'sticky',top:98}}>
          <span className="eyebrow" style={{background:'rgba(255,255,255,.07)',borderColor:'rgba(255,255,255,.12)',color:'#bbaeff'}}>One-time access</span>
          <h2 style={{fontSize:28,letterSpacing:'-.04em',margin:'18px 0 8px'}}>Own this release.</h2>
          <div style={{fontSize:42,fontWeight:900,letterSpacing:'-.055em'}}>{product.price_cents > 0 ? `${(product.price_cents/100).toFixed(0)} ${product.currency.toUpperCase()}` : 'Price pending'}</div>
          {product.price_cents > 0 ? <BuyButton productId={product.id} /> : <p style={{color:'#b7bfd4',lineHeight:1.7}}>Checkout will activate once the commercial price is configured.</p>}
          <div style={{borderTop:'1px solid rgba(255,255,255,.11)',marginTop:22,paddingTop:18}}><strong style={{fontSize:13}}>Risk notice</strong><p style={{color:'#aeb7ce',fontSize:12,lineHeight:1.65,marginBottom:0}}>Trading involves risk. Historical or simulated performance is not a guarantee of future results.</p></div>
        </aside>
      </div>
    </main>
    <SiteFooter />
  </>;
}
