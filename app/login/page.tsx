'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';

function getSafeNext() {
  const value = new URLSearchParams(window.location.search).get('next');
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [message,setMessage]=useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.href = getSafeNext();
    });
  }, []);

  async function submit(e:FormEvent){
    e.preventDefault();
    setMessage('Signing in…');
    const {error}=await createClient().auth.signInWithPassword({email,password});
    if(error){setMessage(error.message);return}
    window.location.href=getSafeNext();
  }

  return <main className="container form-shell"><div className="card form-card"><Link className="brand" href="/" prefetch><span className="brand-mark">TT</span><span>TAHITIAN <span className="gradient">TRADER</span></span></Link><h1>Welcome back.</h1><p className="muted">Access your products, licenses and secure downloads.</p><form onSubmit={submit}><input aria-label="Email" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input aria-label="Password" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn btn-accent" type="submit">Sign in <span aria-hidden>→</span></button></form>{message&&<p className="muted" style={{marginTop:15,fontSize:13}}>{message}</p>}<p className="muted" style={{marginTop:22,fontSize:13}}>New here? <Link href="/signup" prefetch style={{fontWeight:800}}>Create an account</Link></p></div></main>
}
