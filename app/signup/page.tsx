'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';

export default function Signup(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [message,setMessage]=useState('');
  async function submit(e:FormEvent){e.preventDefault();setMessage('Creating account…');const {error}=await createClient().auth.signUp({email,password});setMessage(error?error.message:'Account created. Check your email to confirm your address.')}
  return <main className="container form-shell"><div className="card form-card"><Link className="brand" href="/" prefetch><span className="brand-mark">TT</span><span>TAHITIAN <span className="gradient">TRADER</span></span></Link><h1>Create your account.</h1><p className="muted">Your purchases, licenses and downloads stay in one place.</p><form onSubmit={submit}><input aria-label="Email" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input aria-label="Password" type="password" minLength={8} placeholder="Password (8+ characters)" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn btn-accent" type="submit">Create account <span aria-hidden>→</span></button></form>{message&&<p className="muted" style={{marginTop:15,fontSize:13}}>{message}</p>}<p className="muted" style={{marginTop:22,fontSize:13}}>Already have an account? <Link href="/login" prefetch style={{fontWeight:800}}>Sign in</Link></p></div></main>
}
