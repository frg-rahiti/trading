import Link from 'next/link';
import { createServerSupabase } from '../lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createServerSupabase();
  const { data: products } = await supabase
    .from('products')
    .select('id,slug,name,platform,description')
    .eq('published', true)
    .order('created_at');

  return <>
    <header className="site-header"><div className="container" style={{height:72,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <Link className="brand" href="/">TAHITIAN <span className="gradient">TRADER</span></Link>
      <nav className="nav"><Link href="/products">Products</Link><Link href="/performance">Performance</Link><Link href="/resources">Resources</Link><Link href="/pricing">Pricing</Link><Link href="/login">Login</Link><Link className="btn btn-primary" href="/products">Get Started</Link></nav>
    </div></header>
    <main>
      <section className="container" style={{minHeight:620,display:'flex',alignItems:'center',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:850,position:'relative',zIndex:2}}>
          <span className="pill">ALGORITHMIC TRADING TECHNOLOGY</span>
          <h1 style={{fontSize:'clamp(52px,8vw,92px)',lineHeight:.98,letterSpacing:'-.06em',margin:'22px 0'}}>Algorithmic Trading.<br/><span className="gradient">Built with Data.</span></h1>
          <p className="muted" style={{fontSize:20,lineHeight:1.7,maxWidth:690}}>Systematic trading algorithms, MetaTrader 5 Expert Advisors and TradingView strategies — tested, measured and documented for disciplined traders.</p>
          <div style={{display:'flex',gap:12,marginTop:32}}><Link className="btn btn-primary" href="/products">Explore Products →</Link><Link className="btn btn-secondary" href="/performance">View Performance</Link></div>
        </div><div className="hero-orb"/>
      </section>

      <section className="container section">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:20,flexWrap:'wrap'}}><div><span className="pill">THE PRODUCT LINEUP</span><h2 style={{fontSize:44,letterSpacing:'-.04em',margin:'14px 0 0'}}>Built for systematic traders.</h2></div><Link href="/products">View all products →</Link></div>
        {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',marginTop:30}}>{products.map(p=><article className="card" style={{padding:28}} key={p.id}><span style={{fontSize:12,fontWeight:800,color:'#7657d9'}}>{p.platform.toUpperCase()}</span><h3 style={{fontSize:25,margin:'12px 0'}}>{p.name}</h3><p className="muted" style={{lineHeight:1.65,minHeight:78}}>{p.description || 'Product details will be published with the verified launch information.'}</p><Link href={'/products/'+p.slug}>View product →</Link></article>)}</div> : <div className="card" style={{padding:32,marginTop:30}}><h3>Catalog preparation in progress</h3><p className="muted">The V1 products are configured privately and will appear here once their commercial pricing and publication status are finalized.</p></div>}
      </section>

      <section style={{background:'var(--navy)',color:'#fff'}}><div className="container section"><span style={{color:'#a78bfa',fontSize:12,fontWeight:800}}>MEASURED, NOT MARKETED</span><h2 style={{fontSize:48,letterSpacing:'-.04em',maxWidth:800}}>Backtests. Monte Carlo. Context.</h2><p style={{color:'#aeb4c5',lineHeight:1.8,maxWidth:700}}>Historical backtests, Monte Carlo analysis, forward tests and live results are presented separately. No fabricated figures. No profit promises.</p><Link className="btn" style={{background:'#fff',color:'var(--ink)',marginTop:18}} href="/performance">Explore Performance</Link></div></section>
    </main>
    <footer className="container footer">© 2026 Tahitian Trader · Algorithmic Trading Technology · <Link href="/legal/risk-disclaimer">Risk Disclaimer</Link></footer>
  </>;
}
