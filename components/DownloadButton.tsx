'use client';

import { useState } from 'react';

export default function DownloadButton({ versionId, fileType, label='Download' }: { versionId:string; fileType:'EX5'|'MQ5'|'PINE'|'DOC'; label?:string }) {
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  async function download() {
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/download',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({versionId,fileType})});
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Download failed');
      window.location.href = data.url;
    } catch(e) {
      setError(e instanceof Error ? e.message : 'Download failed');
      setBusy(false);
    }
  }
  return <div><button className="btn btn-secondary" style={{border:0,cursor:busy?'wait':'pointer'}} disabled={busy} onClick={download}>{busy?'Preparing…':label}</button>{error && <p style={{color:'#b42318',fontSize:12,marginTop:6}}>{error}</p>}</div>;
}
