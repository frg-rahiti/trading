import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '../../../lib/supabase-server';
import BuyButton from '../../../components/BuyButton';

export const dynamic = 'force-dynamic';

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: product } = await supabase.from('products').select('id,slug,name,platform,description,price_cents,currency').eq('slug', slug).eq('published', true).single();
  if (!product) notFound();

  const { data: version } = await supabase.from('product_versions').select('id,version,release_date,ex5_path,pine_path,documentation_path').eq('product_id', product.id).order('release_date', { ascending: false }).limit(1).maybeSingle();
  const files = [] as { label: string; type: 'EX5' | 'PINE' | 'DOC' }[];
  if (version?.ex5_path) files.push({ label: 'MT5 Expert Advisor (.ex5)', type: 'EX5' });
  if (version?.pine_path) files.push({ label: 'TradingView source (.pine)', type: 'PINE' });
  if (version?.documentation_path) files.push({ label: 'Documentation', type: 'DOC' });

  return <main className="container section"><Link href="/products">← Products</Link><div style={{marginTop:65}}><span className="pill">{product.platform.toUpperCase()}</span><h1 style={{fontSize:'clamp(46px,7vw,76px)',letterSpacing:'-.05em',margin:'16px 0'}}>{product.name}</h1><p className="muted" style={{fontSize:20,maxWidth:760,lineHeight:1.7}}>{product.description || 'Commercial and technical details will be published with the verified product release.'}</p></div>
    <div className="grid" style={{gridTemplateColumns:'2fr 1fr',marginTop:45}}>
      <section className="card" style={{padding:32}}><h2>Product information</h2><div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',marginTop:22}}>{[['Platform',product.platform],['Version',version?.version ?? 'Not available yet'],['Release',version?.release_date ?? 'Not available yet']].map(([a,b])=><div key={a}><span className="muted" style={{fontSize:13}}>{a}</span><div style={{fontWeight:700,marginTop:6}}>{b}</div></div>)}</div><h2 style={{marginTop:38}}>Performance evidence</h2><p className="muted" style={{lineHeight:1.7}}>Verified backtest and Monte Carlo results will be displayed here once they are published. Backtests will always remain clearly separated from forward and live results.</p><h2 style={{marginTop:38}}>Included delivery</h2>{files.length ? <div style={{display:'grid',gap:10}}>{files.map(f=><div key={f.type} className="card" style={{padding:'14px 16px',boxShadow:'none'}}><b>{f.label}</b></div>)}</div> : <p className="muted">No downloadable file has been associated with this version yet.</p>}<p className="muted" style={{marginTop:28,fontSize:14,lineHeight:1.6}}>Files are stored in private Supabase Storage and are delivered only after a valid purchase and authenticated access. Downloads use temporary signed URLs.</p></section>
      <aside className="card" style={{padding:30,height:'fit-content'}}><span className="pill">PURCHASE</span><h2 style={{margin:'14px 0'}}>Access this product</h2><div style={{fontSize:34,fontWeight:800,letterSpacing:'-.03em'}}>{product.price_cents > 0 ? `${(product.price_cents/100).toFixed(2)} ${product.currency.toUpperCase()}` : 'Price pending'}</div>{product.price_cents > 0 ? <BuyButton productId={product.id} /> : <p className="muted" style={{lineHeight:1.6,marginTop:14}}>Checkout will be enabled when the final commercial price is configured.</p>}<div style={{borderTop:'1px solid var(--line)',marginTop:22,paddingTop:20}}><b>Risk notice</b><p className="muted" style={{fontSize:13,lineHeight:1.6}}>Trading involves risk. Historical performance does not guarantee future results.</p></div></aside>
    </div></main>;
}
