import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabase-server';

export const dynamic='force-dynamic';

export default async function Dashboard(){
  const supabase=await createServerSupabase();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return <main className="container section"><h1>Dashboard</h1><p className="muted">You need to sign in to access your account.</p><Link className="btn btn-primary" href="/login">Sign in</Link></main>;
  const {data:licenses}=await supabase.from('licenses').select('id,license_key,status,created_at,expires_at,products(name,platform)').eq('user_id',user.id).order('created_at',{ascending:false});
  return <main className="container section"><div style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',flexWrap:'wrap'}}><div><span className="pill">CUSTOMER DASHBOARD</span><h1 style={{fontSize:48,letterSpacing:'-.04em'}}>Your workspace</h1><p className="muted">{user.email}</p></div><Link href="/products">Browse products →</Link></div>
    <nav className="card" style={{display:'flex',gap:20,padding:16,marginTop:30,flexWrap:'wrap'}}><Link href="/dashboard">Overview</Link><Link href="/dashboard/products">My Products</Link><Link href="/dashboard/licenses">Licenses</Link><Link href="/dashboard/downloads">Downloads</Link><Link href="/dashboard/account">Account</Link></nav>
    <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',marginTop:25}}>{[['Products',licenses?.length??0],['Active licenses',licenses?.filter((x:any)=>x.status==='ACTIVE').length??0],['Account','Active']].map(([a,b])=><div className="card stat" key={String(a)}><span className="muted">{a}</span><br/><strong>{b}</strong></div>)}</div>
    <section style={{marginTop:40}}><h2>My products</h2>{licenses?.length?<div className="grid" style={{marginTop:18}}>{licenses.map((l:any)=><article className="card" style={{padding:24}} key={l.id}><div style={{display:'flex',justifyContent:'space-between',gap:12}}><b>{l.products?.name}</b><span className="pill">{l.status}</span></div><p className="muted">{l.products?.platform}</p><code style={{wordBreak:'break-all'}}>{l.license_key}</code><div style={{marginTop:18}}><Link href="/dashboard/downloads">Manage downloads →</Link></div></article>)}</div>:<div className="card" style={{padding:30}}><p className="muted">No products purchased yet.</p><Link href="/products">Explore products →</Link></div>}</section>
  </main>;
}
