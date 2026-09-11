import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '../../lib/supabase-server';
import { createAdminSupabase } from '../../lib/supabase-admin';

export const dynamic='force-dynamic';

export default async function Admin(){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect('/login');
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();
 if(profile?.role!=='admin') redirect('/dashboard');
 const db=createAdminSupabase();
 const [{count:customers},{count:orders},{count:activeLicenses},{data:products},{data:versions},{data:licenses}]=await Promise.all([
  db.from('profiles').select('id',{count:'exact',head:true}),
  db.from('orders').select('id',{count:'exact',head:true}),
  db.from('licenses').select('id',{count:'exact',head:true}).eq('status','ACTIVE'),
  db.from('products').select('id,slug,name,platform,description,price_cents,currency,published,stripe_price_id').order('created_at'),
  db.from('product_versions').select('id,product_id,version,release_date,ex5_path,pine_path,documentation_path').order('release_date',{ascending:false}),
  db.from('licenses').select('id,license_key,status,created_at,products(name)').order('created_at',{ascending:false}).limit(50),
 ]);
 const latestVersion=new Map<string,any>(); for(const v of versions??[]) if(!latestVersion.has(v.product_id)) latestVersion.set(v.product_id,v);
 return <main className="container section"><div style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',flexWrap:'wrap'}}><div><span className="pill">ADMIN</span><h1 style={{fontSize:48,margin:'12px 0 4px'}}>Tahitian Trader control center</h1><p className="muted">{user.email}</p></div><Link href="/dashboard">Customer dashboard →</Link></div>
  <div className="grid" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))',marginTop:30}}>{[['Customers',customers??0],['Orders',orders??0],['Active licenses',activeLicenses??0],['Products',products?.length??0]].map(([a,b])=><div className="card stat" key={String(a)}><span className="muted">{a}</span><br/><strong>{b}</strong></div>)}</div>
  <section style={{marginTop:45}}><h2>Products</h2><div className="grid" style={{marginTop:18}}>{products?.map(p=>{const v=latestVersion.get(p.id);return <form className="card" style={{padding:24}} action="/api/admin/products" method="post" key={p.id}><input type="hidden" name="productId" value={p.id}/><div style={{display:'flex',justifyContent:'space-between',gap:12}}><b>{p.name}</b><span className="pill">{p.published?'PUBLISHED':'DRAFT'}</span></div><p className="muted">{p.platform} · slug: {p.slug}</p><label style={{display:'grid',gap:6,marginTop:14}}>Description<textarea name="description" defaultValue={p.description} rows={3} style={{padding:10,border:'1px solid var(--line)',borderRadius:10}}/></label><div className="grid" style={{gridTemplateColumns:'1fr 1fr',marginTop:14}}><label style={{display:'grid',gap:6}}>Price (EUR)<input name="price" type="number" min="0" step="0.01" defaultValue={p.price_cents/100} style={{padding:10,border:'1px solid var(--line)',borderRadius:10}}/></label><label style={{display:'grid',gap:6}}>Stripe Price ID<input name="stripePriceId" defaultValue={p.stripe_price_id??''} placeholder="price_..." style={{padding:10,border:'1px solid var(--line)',borderRadius:10}}/></label></div><label style={{display:'flex',alignItems:'center',gap:8,marginTop:14}}><input name="published" type="checkbox" defaultChecked={p.published}/> Publish product</label><div style={{marginTop:16,paddingTop:14,borderTop:'1px solid var(--line)',fontSize:13}}><b>Version:</b> {v?.version??'None'} · {v?.ex5_path??v?.pine_path??'No product file mapped'}</div><button className="btn btn-primary" style={{marginTop:18,border:0,cursor:'pointer'}}>Save product</button></form>})}</div></section>
  <section style={{marginTop:45}}><h2>Recent licenses</h2><div className="card" style={{overflow:'hidden',marginTop:18}}>{licenses?.length?licenses.map((l:any)=><div key={l.id} style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr auto',gap:12,padding:'15px 18px',borderBottom:'1px solid var(--line)',alignItems:'center'}}><div><b>{l.products?.name??'Product'}</b><div className="muted" style={{fontSize:12}}>{l.license_key}</div></div><span className="muted">{l.status}</span><span className="muted">{new Date(l.created_at).toLocaleDateString('en-GB')}</span>{l.status==='ACTIVE'?<form action="/api/admin/licenses/revoke" method="post"><input type="hidden" name="licenseId" value={l.id}/><button className="btn btn-secondary" style={{border:0,cursor:'pointer'}}>Revoke</button></form>:<span/>}</div>):<div style={{padding:24}} className="muted">No licenses yet.</div>}</div></section>
 </main>;
}
