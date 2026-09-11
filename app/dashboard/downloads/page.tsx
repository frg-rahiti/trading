import Link from 'next/link';
import { createServerSupabase } from '../../../lib/supabase-server';
import DownloadButton from '../../../components/DownloadButton';

export const dynamic='force-dynamic';

export default async function Downloads(){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) return <main className="container section"><Link href="/login">Sign in</Link></main>;
 const {data:licenses}=await supabase.from('licenses').select('id,product_id,status,products(name,platform)').eq('user_id',user.id).eq('status','ACTIVE').order('created_at',{ascending:false});
 const productIds=(licenses??[]).map((l:any)=>l.product_id);
 const {data:versions}=productIds.length?await supabase.from('product_versions').select('id,product_id,version,release_date,ex5_path,pine_path,documentation_path').in('product_id',productIds).order('release_date',{ascending:false}):{data:[] as any[]};
 const latest=new Map<string,any>(); for(const v of versions??[]) if(!latest.has(v.product_id)) latest.set(v.product_id,v);
 return <main className="container section"><Link href="/dashboard">← Dashboard</Link><h1 style={{fontSize:48,marginTop:45}}>Downloads</h1><p className="muted" style={{maxWidth:700,lineHeight:1.7}}>Downloads are authorized against your active license and use temporary signed URLs. Your download history is recorded for your account.</p><div className="grid" style={{marginTop:30}}>{licenses?.length?licenses.map((l:any)=>{const v=latest.get(l.product_id); return <article className="card" style={{padding:26}} key={l.id}><span className="pill">{l.products?.platform?.toUpperCase()}</span><h2 style={{fontSize:24,margin:'12px 0 6px'}}>{l.products?.name}</h2><p className="muted">Version {v?.version ?? 'Not available yet'}</p><div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:18}}>{v?.ex5_path&&<DownloadButton versionId={v.id} fileType="EX5" label="Download EX5"/>}{v?.pine_path&&<DownloadButton versionId={v.id} fileType="PINE" label="Download Pine"/>}{v?.documentation_path&&<DownloadButton versionId={v.id} fileType="DOC" label="Documentation"/>}</div>{!v&&<p className="muted">No downloadable version is currently assigned.</p>}</article>}) : <div className="card" style={{padding:30}}><p className="muted">No active product licenses found.</p><Link href="/products">Browse products</Link></div>}</div></main>;
}
