import Link from 'next/link';
import { createServerSupabase } from '../../../lib/supabase-server';

export const dynamic='force-dynamic';

export default async function Account(){
 const supabase=await createServerSupabase();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) return <main className="container section"><Link href="/login">Sign in</Link></main>;
 const {data:profile}=await supabase.from('profiles').select('display_name,role,created_at').eq('id',user.id).maybeSingle();
 return <main className="container section"><Link href="/dashboard">← Dashboard</Link><h1 style={{fontSize:48,marginTop:45}}>Account</h1><section className="card" style={{padding:30,marginTop:30,maxWidth:700}}><div style={{display:'grid',gap:20}}><div><span className="muted">Email</span><div style={{fontWeight:700,marginTop:5}}>{user.email}</div></div><div><span className="muted">Name</span><div style={{fontWeight:700,marginTop:5}}>{profile?.display_name || 'Not set'}</div></div><div><span className="muted">Account type</span><div style={{fontWeight:700,marginTop:5}}>{profile?.role || 'customer'}</div></div><div><span className="muted">Member since</span><div style={{fontWeight:700,marginTop:5}}>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB') : 'Not available'}</div></div></div></section></main>;
}
