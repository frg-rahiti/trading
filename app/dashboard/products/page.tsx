import Link from 'next/link';
import { createServerSupabase } from '../../../lib/supabase-server';

export const dynamic='force-dynamic';

export default async function MyProducts(){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) return <main className="container section"><Link href="/login">Sign in</Link></main>;
 const {data:licenses}=await supabase.from('licenses').select('id,status,products(id,name,platform,slug)').eq('user_id',user.id).order('created_at',{ascending:false});
 return <main className="container section"><Link href="/dashboard">← Dashboard</Link><h1 style={{fontSize:48,marginTop:45}}>My Products</h1><div className="grid" style={{marginTop:30}}>{licenses?.length?licenses.map((l:any)=><article className="card" style={{padding:26}} key={l.id}><span className="pill">{l.status}</span><h2 style={{margin:'12px 0 6px'}}>{l.products?.name}</h2><p className="muted">{l.products?.platform}</p><Link href={`/dashboard/downloads?product=${l.products?.id}`}>Open downloads →</Link></article>):<div className="card" style={{padding:30}}><p className="muted">You have no purchased products yet.</p><Link href="/products">Browse products</Link></div>}</div></main>;
}
