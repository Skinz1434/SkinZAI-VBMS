'use client'
import { useState } from 'react';
import { mlJson } from '../lib/fetcher';

export default function AssistPanel({ claimId, docs, onResult, onApply }: { claimId: string, docs: any[], onResult?: (res:any)=>void, onApply?: (res:any)=>void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    setLoading(true);
    const payload = { claim_id: claimId, documents: docs.map(d=>({ id:d.id, doc_type:d.doc_type, text:d.text||'', tags:d.tags||[] })) };
    const j = await mlJson('/infer/claim', { method:'POST', body: JSON.stringify(payload) });
    setResult(j);
    setLoading(false);
    onResult && onResult(j);
  };

  return (
    <aside className="sz-card" style={{minWidth:360}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontWeight:700}}>ML Assist</div>
        <div style={{display:'flex', gap:8}}>
          <button onClick={run} style={{padding:'6px 10px', borderRadius:10, background:'var(--sz-accent)'}}>Analyze</button>
          {result && onApply && <button onClick={()=>onApply(result)} style={{padding:'6px 10px', borderRadius:10}}>Apply</button>}
        </div>
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
