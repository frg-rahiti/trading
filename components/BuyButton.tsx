'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase';

export default function BuyButton({ productId }: { productId: string }) {
  const [busy,setBusy]=useState(false); const [error,setError]=useState('');

  async function buy(){
    setBusy(true); setError('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const next = `${window.location.pathname}${window.location.search}`;
        window.location.assign(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      const res=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Checkout could not be created');
      if(!data.url) throw new Error('Checkout URL was not returned');
      window.location.assign(data.url);
    } catch(e) {
      setError(e instanceof Error?e.message:'Checkout could not be created');
      setBusy(false);
    }
  }

  return <div style={{marginTop:18}}><button className="btn btn-accent" type="button" style={{width:'100%',border:0,cursor:busy?'wait':'pointer',opacity:busy?.72:1}} disabled={busy} onClick={buy}>{busy?'Opening secure checkout…':'Buy now'}<span aria-hidden>{busy?'':'→'}</span></button>{error&&<p style={{color:'var(--danger)',fontSize:13,lineHeight:1.5,marginTop:10}}>{error}</p>}</div>;
}
