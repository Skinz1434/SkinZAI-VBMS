'use client'
import { useEffect, useState } from 'react';

export default function AssistPanel({ claimId, docs }: { claimId: string, docs: any[] }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    setLoading(true);
    const r = await fetch('http://localhost:8088/infer/claim', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ claim_id: claimId, documents: docs.map(d=>({id:d.id, doc_type:d.doc_type, text:d.text || '', tags:d.tags||[]})) })
    });
    const j = await r.json();
    setResult(j);
    setLoading(false);
  }

  return (
    <aside className="sz-card" style={{minWidth:360}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div style={{fontWeight:700}}>ML Assist</div>
        <button onClick={run} style={{padding:'6px 10px', borderRadius:10, background:'var(--sz-accent)'}}>Analyze</button>
      </div>
      {loading && <div style={{marginTop:8}}>Thinking…</div>}
      {result && result.diagnostics?.map((d:any)=>(
        <div key={d.cluster_id} style={{marginTop:12}}>
          <div>Cluster {d.cluster_id} <span className="sz-chip">Conf {d.confidence}</span></div>
          <div>Suggest DC: <b>{d.suggested_dc}</b> @ <b>{d.suggested_percent}%</b></div>
          <ul>{d.reasons.map((r:string,i:number)=>(<li key={i}>{r}</li>))}</ul>
        </div>
      ))}
    </aside>
  );
}
