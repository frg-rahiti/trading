import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabase-server';
import { getLocale, getTranslations } from '../../lib/i18n';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
export const dynamic = 'force-dynamic';
export default async function Products() {
  const locale = await getLocale(); const t = getTranslations(locale).products;
  const supabase = await createServerSupabase();
  const { data: products } = await supabase.from('products').select('id,slug,name,platform,description,price_cents,currency').eq('published', true).order('created_at');
  return <><SiteHeader /><main>
    <section className="hero premium-hero shop-hero"><div className="container"><span className="eyebrow">{t.eyebrow}</span><h1>{t.title1}<br /><span className="gradient">{t.title2}</span></h1><p className="hero-copy shop-intro">{t.copy}</p><div className="shop-principles"><div className="shop-principle"><strong>{t.oneTime}</strong><span>{t.oneTimeText}</span></div><div className="shop-principle"><strong>{t.delivery}</strong><span>{t.deliveryText}</span></div><div className="shop-principle"><strong>{t.pricing}</strong><span>{t.pricingText}</span></div></div></div></section>
    <section className="container section-tight"><div className="section-head"><div><span className="eyebrow">{t.collection}</span><h2>{t.choose}</h2><p className="muted prose-muted">{t.intro}</p></div></div>
      {products?.length ? <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',marginTop:34}}>{products.map(p=><article className="card product-card shop-card" key={p.id}><div className="product-meta"><span className="eyebrow">{p.platform}</span><strong className="price">{(p.price_cents/100).toFixed(0)} {p.currency.toUpperCase()}</strong></div><h2>{p.name}</h2><p className="muted prose-muted">{p.description || t.fallback}</p><div className="product-footer"><span className="muted" style={{fontSize:12}}>V1 · {locale === 'fr' ? 'Livraison numérique' : 'Digital delivery'}</span><Link className="btn btn-primary" href={'/products/'+p.slug} prefetch>{t.view} <span aria-hidden>→</span></Link></div></article>)}</div> : <div className="card" style={{padding:32,marginTop:40}}><h2>{t.prepared}</h2><p className="muted">{t.preparedText}</p></div>}
    </section>
    <section className="container section-tight"><div className="card card-dark" style={{padding:'30px 32px'}}><span className="pill">V1 · {locale === 'fr' ? 'Tarification' : 'Pricing'}</span><h2 style={{fontSize:'clamp(28px,4vw,42px)',margin:'14px 0 8px'}}>{t.pricingTitle}</h2><p style={{color:'#b7bfd4',lineHeight:1.75,maxWidth:760,margin:0}}>{t.pricingText}</p></div></section>
  </main><SiteFooter /></>;
}
