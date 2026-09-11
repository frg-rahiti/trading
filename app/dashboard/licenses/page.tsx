import Link from 'next/link';
import { createServerSupabase } from '../../../lib/supabase-server';

export const dynamic='force-dynamic';

export default async function Licenses(){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) return <main className="container section"><Link href="/login">Sign in</Link></main>;
 const {data:licenses}=await supabase.from('licenses').select('id,license_key,status,created_at,expires_at,products(name,platform)').eq('user_id',user.id).order('created_at',{ascending:false});
 return <main className="container section"><Link href="/dashboard">← Dashboard</Link><h1 style={{fontSize:48,marginTop:45}}>Licenses</h1><div className="grid" style={{marginTop:30}}>{licenses?.length?licenses.map((l:any)=><article className="card" style={{padding:26}} key={l.id}><div style={{display:'flex',justifyContent:'space-between',gap:12}}><b>{l.products?.name}</b><span className="pill">{l.status}</span></div><p className="muted">{l.products?.platform}</p><code style={{wordBreak:'break-all'}}>{l.license_key}</code><p className="muted" style={{fontSize:13}}>Issued {new Date(l.created_at).toLocaleDateString('en-GB')}{l.expires_at?` · Expires ${new Date(l.expires_at).toLocaleDateString('en-GB')}`:''}</p></article>):<div className="card" style={{padding:30}}><p className="muted">No licenses yet.</p></div>}</div></main>;
}
