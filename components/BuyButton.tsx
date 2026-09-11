'use client';

import { useState } from 'react';

export default function BuyButton({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function buy() {
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout could not be created');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout could not be created');
      setBusy(false);
    }
  }

  return <div style={{ marginTop: 18 }}><button className="btn btn-primary" style={{ width:'100%', border:0, cursor:busy?'wait':'pointer', opacity:busy?.7:1 }} disabled={busy} onClick={buy}>{busy ? 'Opening checkout…' : 'Buy now'}</button>{error && <p style={{color:'#b42318',fontSize:13,lineHeight:1.5,marginTop:10}}>{error}</p>}</div>;
}
