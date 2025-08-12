'use client'
import { useState } from 'react';

type Doc = { id: string; doc_type: string; text?: string; tags?: string[] }

export default function DiagnosticsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runSample = async () => {
    setLoading(true);
    const r = await fetch('http://localhost:8088/infer/sample', { method: 'POST' });
    const j = await r.json();
    setResult(j);
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{marginBottom:8}}>Diagnostics (Leiden + XGBoost)</h1>
      <p style={{opacity:.8}}>Clusters, confidence, and clear "why" — SkinZAI style.</p>
      <button onClick={runSample} style={{marginTop:12, padding:'10px 14px', borderRadius:12, background:'#7B61FF'}}>Run Sample</button>
      {loading && <div style={{marginTop:12}}>Crunching clusters…</div>}
      {result && (
        <div style={{marginTop:16, display:'grid', gap:12, gridTemplateColumns:'repeat(2, 1fr)'}}>
          {result?.diagnostics?.map((d:any) => (
            <div key={d.cluster_id} style={{background:'#111827', borderRadius:16, padding:16, boxShadow:'0 10px 30px rgba(0,0,0,.35)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3 style={{margin:0}}>Cluster {d.cluster_id}</h3>
                <span style={{padding:'4px 8px', borderRadius:12, background:'rgba(0,212,255,.15)'}}>Conf {d.confidence}</span>
              </div>
              <div style={{marginTop:8}}>
                <div>Suggested DC: <b>{d.suggested_dc}</b></div>
                <div>Suggested %: <b>{d.suggested_percent}</b></div>
              </div>
              <div style={{marginTop:8, fontSize:13, opacity:.9}}>
                <div style={{marginBottom:4, opacity:.65}}>Why:</div>
                <ul>
                  {d.reasons.map((r:string, i:number)=>(<li key={i}>{r}</li>))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
