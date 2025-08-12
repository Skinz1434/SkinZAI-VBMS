'use client'
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<any[]>([]);
  const go = async () => {
    const r = await fetch(`http://localhost:8000/participants?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setRes(j);
  }
  useEffect(()=>{ go(); },[]);
  return (
    <div>
      <h1>Global Search</h1>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="file number or name"
        style={{padding:8, borderRadius:8, color:'#111827'}} />
      <button onClick={go} style={{marginLeft:8, padding:'8px 12px', background:'#7B61FF', borderRadius:8}}>Search</button>
      <pre style={{marginTop:16, background:'#111827', padding:12, borderRadius:12}}>{JSON.stringify(res, null, 2)}</pre>
    </div>
  );
}
