'use client'
import { useEffect, useState } from 'react';

export default function EFolderPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [typ, setTyp] = useState('');
  const go = async () => {
    const params = new URLSearchParams({});
    if (q) params.set('q', q);
    if (typ) params.set('type', typ);
    const r = await fetch(`http://localhost:8000/documents?${params.toString()}`);
    const j = await r.json();
    setDocs(j);
  }
  useEffect(()=>{ go(); },[]);
  return (
    <div>
      <h1>eFolder</h1>
      <div style={{marginBottom:12}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search path/type"
          style={{padding:8, borderRadius:8, color:'#111827'}} />
        <input value={typ} onChange={e=>setTyp(e.target.value)} placeholder="doc_type"
          style={{padding:8, borderRadius:8, color:'#111827', marginLeft:8}} />
        <button onClick={go} style={{marginLeft:8, padding:'8px 12px', background:'#7B61FF', borderRadius:8}}>Filter</button>
      </div>
      <div style={{background:'#111827', borderRadius:12, padding:12}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead><tr><th align="left">ID</th><th align="left">Type</th><th align="left">Received</th><th align="left">Path (S3 key)</th></tr></thead>
          <tbody>
            {docs.map((d:any)=> (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.doc_type}</td>
                <td>{d.received_date || ''}</td>
                <td style={{fontFamily:'ui-monospace'}}>{d.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
