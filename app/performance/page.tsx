import { createServerSupabase } from '../../lib/supabase-server';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function Performance() {
  const supabase = await createServerSupabase();
  const [{ data: backtests }, { data: monteCarlo }] = await Promise.all([
    supabase.from('backtests').select('id,product_id,title,metrics,created_at,products(name,platform)').order('created_at', { ascending:false }),
    supabase.from('monte_carlo_reports').select('id,product_id,title,metrics,created_at,products(name,platform)').order('created_at', { ascending:false }),
  ]);

  const Report = ({ rows, empty }: { rows:any[] | null, empty:string }) => rows?.length ? <div className="grid" style={{marginTop:20}}>{rows.map((r:any)=><article className="card" style={{padding:26}} key={r.id}><span className="pill">{r.products?.platform?.toUpperCase()}</span><h3 style={{fontSize:22,margin:'14px 0 7px'}}>{r.products?.name}</h3><p className="muted">{r.title}</p><pre style={{overflowX:'auto',padding:15,background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:12,fontSize:12}}>{JSON.stringify(r.metrics,null,2)}</pre></article>)}</div> : <div className="card" style={{padding:28,marginTop:20}}><b>{empty}</b><p className="muted">Verified data will be added when the reports are published.</p></div>;

  return <><SiteHeader /><main className="container section">
    <span className="eyebrow">Performance</span>
    <h1 style={{fontSize:'clamp(46px,6.5vw,72px)',lineHeight:1,letterSpacing:'-.06em',margin:'18px 0 14px'}}>Evidence before claims.</h1>
    <p className="muted" style={{fontSize:18,lineHeight:1.8,maxWidth:740}}>Backtests, Monte Carlo analysis, forward tests and live results stay separate. Only supplied and verified data is published.</p>
    <div className="grid" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))',marginTop:34}}>{['Net profit','Win rate','Max drawdown','Profit factor'].map(x=><div className="card stat" key={x}><span>{x}</span><strong>—</strong><small className="muted">Awaiting verified data</small></div>)}</div>
    <section style={{marginTop:52}}><span className="eyebrow">01 · Historical</span><h2 style={{fontSize:34,letterSpacing:'-.045em',margin:'12px 0'}}>Backtests</h2><Report rows={backtests} empty="No backtest reports published yet." /></section>
    <section style={{marginTop:44}}><span className="eyebrow">02 · Robustness</span><h2 style={{fontSize:34,letterSpacing:'-.045em',margin:'12px 0'}}>Monte Carlo</h2><Report rows={monteCarlo} empty="No Monte Carlo reports published yet." /></section>
    <div className="card card-dark" style={{padding:28,marginTop:48}}><strong>Risk disclosure</strong><p style={{color:'#b7bfd4',lineHeight:1.75,marginBottom:0}}>Historical or simulated results are not guarantees of future performance. Execution, spreads, slippage, liquidity and market conditions can materially change real results.</p></div>
  </main><SiteFooter /></>;
}
