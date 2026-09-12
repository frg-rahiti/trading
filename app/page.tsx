import Link from 'next/link';
import { createServerSupabase } from '../lib/supabase-server';
import { getLocale, getTranslations } from '../lib/i18n';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const locale = await getLocale();
  const t = getTranslations(locale).home;
  const supabase = await createServerSupabase();
  const { data: products } = await supabase.from('products').select('id,slug,name,platform,description,price_cents,currency').eq('published', true).order('created_at');
  return <><SiteHeader /><main>
    <section className="container hero"><div className="hero-layout"><div>
      <span className="eyebrow">{t.eyebrow}</span>
      <h1>{t.title1}<br /><span className="gradient">{t.title2}</span></h1>
      <p className="hero-copy muted">{t.copy}</p>
      <div className="hero-actions"><Link className="btn btn-accent" href="/products" prefetch>{t.explore} <span aria-hidden>→</span></Link><Link className="btn btn-secondary" href="/performance" prefetch>{t.evidence}</Link></div>
      <div className="trust-strip" style={{marginTop:42}}><div className="trust-item"><strong>{t.private}</strong><span>{t.privateText}</span></div><div className="trust-item"><strong>{t.measured}</strong><span>{t.measuredText}</span></div><div className="trust-item"><strong>{t.oneTime}</strong><span>{t.oneTimeText}</span></div></div>
    </div><div className="hero-panel" aria-hidden="true"><div className="hero-orbit"><div className="hero-orbit-core">TT</div><div className="hero-metric one"><strong>MT5 + TV</strong><span>Execution stack</span></div><div className="hero-metric two"><strong>Evidence first</strong><span>Risk-aware approach</span></div></div></div></div></section>
    <section className="container section-tight"><div className="section-head"><div><span className="eyebrow">{t.lineup}</span><h2>{t.lineupTitle}</h2></div><Link className="back-link" href="/products" prefetch>{t.allProducts} →</Link></div>
      {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',marginTop:28}}>{products.map(p=><article className="card product-card" key={p.id}><div className="product-meta"><span className="eyebrow">{p.platform}</span>{p.price_cents > 0 && <strong className="price">{(p.price_cents/100).toFixed(0)} {p.currency.toUpperCase()}</strong>}</div><h3>{p.name}</h3><p className="muted prose-muted">{p.description || t.detailsFallback}</p><div className="product-footer"><span className="muted" style={{fontSize:12}}>{t.digital}</span><Link className="btn btn-secondary" href={'/products/'+p.slug} prefetch>{t.view}</Link></div></article>)}</div> : <div className="card" style={{padding:30,marginTop:28}}><h3>{t.preparing}</h3><p className="muted">{t.preparingText}</p></div>}
    </section>
    <section className="container section-tight"><div className="card card-dark" style={{padding:'48px 42px',position:'relative',overflow:'hidden'}}><div style={{position:'relative',zIndex:1,maxWidth:760}}><span className="eyebrow" style={{background:'rgba(255,255,255,.07)',borderColor:'rgba(255,255,255,.12)',color:'#bbaeff'}}>{t.marketed}</span><h2 style={{fontSize:'clamp(34px,5vw,56px)',lineHeight:1.02,letterSpacing:'-.055em',margin:'18px 0'}}>{t.performanceTitle}</h2><p style={{color:'#b7bfd4',lineHeight:1.8,maxWidth:680}}>{t.performanceText}</p><Link className="btn btn-accent" href="/performance" prefetch style={{marginTop:20}}>{t.explorePerformance}</Link></div></div></section>
  </main><SiteFooter /></>;
}
