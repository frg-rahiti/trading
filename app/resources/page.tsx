import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export default function Resources(){
  const items=[['Documentation','Product setup, compatibility and usage notes.','/products'],['FAQ','Answers about licensing, delivery and support.','/resources'],['Risk disclaimer','Understand the risks before using automated trading software.','/legal/risk-disclaimer']];
  return <><SiteHeader /><main className="container section"><span className="eyebrow">Resources</span><h1 style={{fontSize:'clamp(46px,6.5vw,72px)',lineHeight:1,letterSpacing:'-.06em',margin:'18px 0 14px'}}>Research, documentation and context.</h1><p className="muted" style={{fontSize:18,lineHeight:1.8,maxWidth:720}}>A central place for setup notes, methodology, delivery questions and the information around each release.</p><div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',marginTop:38}}>{items.map(([title,desc,href])=><article className="card product-card" key={title}><span className="eyebrow">Resource</span><h2>{title}</h2><p className="muted prose-muted">{desc}</p><Link className="btn btn-secondary" href={href} prefetch>Open resource <span aria-hidden>→</span></Link></article>)}</div></main><SiteFooter /></>;
}
