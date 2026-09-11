import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function Performance() {
  const supabase = await createServerSupabase();
  const [{ data: backtests }, { data: monteCarlo }] = await Promise.all([
    supabase.from('backtests').select('id,product_id,title,metrics,created_at,products(name,platform)').order('created_at', { ascending:false }),
    supabase.from('monte_carlo_reports').select('id,product_id,title,metrics,created_at,products(name,platform)').order('created_at', { ascending:false }),
  ]);

  return <main className="container section"><Link href="/">← Tahitian Trader</Link><span className="pill" style={{marginTop:55}}>PERFORMANCE</span><h1 style={{fontSize:'clamp(46px,6vw,70px)',letterSpacing:'-.05em'}}>Evidence before claims.</h1><p className="muted" style={{fontSize:19,maxWidth:720,lineHeight:1.8}}>Backtests, Monte Carlo analysis, forward tests and live results are kept separate. Only supplied and verified data is published.</p>
    <div className="grid" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))',marginTop:35}}>{['Net Profit','Win Rate','Max Drawdown','Profit Factor'].map(x=><div className="card stat" key={x}><span className="muted">{x}</span><br/><strong>—</strong><p className="muted" style={{fontSize:12}}>Awaiting published verified data</p></div>)}</div>
    <section style={{marginTop:50}}><h2>Backtests</h2>{backtests?.length ? <div className="grid" style={{marginTop:18}}>{backtests.map((r:any)=><article className="card" style={{padding:24}} key={r.id}><span className="pill">{r.products?.platform?.toUpperCase()}</span><h3 style={{fontSize:22}}>{r.products?.name}</h3><p className="muted">{r.title}</p><pre style={{overflowX:'auto',padding:14,background:'#f7f8fc',borderRadius:12,fontSize:12}}>{JSON.stringify(r.metrics,null,2)}</pre></article>)}</div> : <div className="card" style={{padding:28,marginTop:18}}><b>No backtest reports published yet.</b><p className="muted">Verified reports can be added later without changing the product architecture.</p></div>}</section>
    <section style={{marginTop:40}}><h2>Monte Carlo</h2>{monteCarlo?.length ? <div className="grid" style={{marginTop:18}}>{monteCarlo.map((r:any)=><article className="card" style={{padding:24}} key={r.id}><span className="pill">{r.products?.platform?.toUpperCase()}</span><h3 style={{fontSize:22}}>{r.products?.name}</h3><p className="muted">{r.title}</p><pre style={{overflowX:'auto',padding:14,background:'#f7f8fc',borderRadius:12,fontSize:12}}>{JSON.stringify(r.metrics,null,2)}</pre></article>)}</div> : <div className="card" style={{padding:28,marginTop:18}}><b>No Monte Carlo reports published yet.</b><p className="muted">Monte Carlo evidence will be added when you provide the reports.</p></div>}</section>
    <div className="card" style={{padding:28,marginTop:40}}><b>Risk disclosure</b><p className="muted">Historical or simulated results are not guarantees of future performance. Execution, spreads, slippage, liquidity and market conditions can materially change real results.</p></div>
  </main>;
}
