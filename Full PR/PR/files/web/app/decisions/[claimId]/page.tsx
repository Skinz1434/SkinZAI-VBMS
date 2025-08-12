'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AssistPanel from '../../../components/AssistPanel';
import { apiJson } from '../../../lib/fetcher';

type Contention = { id: string; title: string; dc_suggested?: string }
type Doc = { id: string; claim_id?: string; doc_type: string; received_date?: string; path: string; tags?: string[]; text?: string }

export default function DecisionPage() {
  const params = useParams();
  const claimId = params?.claimId as string;
  const [contentions, setContentions] = useState<Contention[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [combined, setCombined] = useState(50);
  const [ml, setMl] = useState<any>(null);
  const [msg, setMsg] = useState<string>('');

  useEffect(()=>{
    if (!claimId) return;
    (async () => {
      const cts: Contention[] = await apiJson(`/claims/${claimId}/contentions`).catch(async () => {
        return [] as Contention[];
      });
      setContentions(cts);
      setRatings(cts.map((c:any)=>({contentionId: c.id, contention: c.title, dc: c.dc_suggested || '', percent: 10, effective_date: new Date().toISOString().slice(0,10)})));
      // try common endpoints to pull docs by claim
      let allDocs: Doc[] = [];
      try {
        allDocs = await apiJson(`/claims/${claimId}/documents`);
      } catch {}
      if (!allDocs.length) {
        try { allDocs = await apiJson(`/documents?claim_id=${encodeURIComponent(claimId)}`); } catch {}
      }
      setDocs(allDocs.slice(0, 50));
    })();
  },[claimId]);

  const updateRating = (i:number, field:string, val:any)=>{
    const next = ratings.slice(); next[i] = {...next[i], [field]: val}; setRatings(next);
  }

  const applySuggestions = (res:any)=>{
    if (!res || !res.clusters || !res.diagnostics) return;
    // Build docId -> doc and contention tags mapping
    const docById: Record<string, Doc> = {};
    docs.forEach(d=>{ docById[d.id] = d; });
    const ctnIndexById: Record<string, number> = {};
    ratings.forEach((r, idx)=>{ if (r.contentionId) ctnIndexById[r.contentionId] = idx; });

    let applied = 0;
    for (const diag of res.diagnostics) {
      const cluster = res.clusters.find((c:any)=>c.cluster_id === diag.cluster_id);
      if (!cluster) continue;
      const tagCounts: Record<string, number> = {};
      for (const mid of cluster.members || []) {
        const d = docById[mid];
        const tags = (d?.tags || []).filter(t=>t.startsWith('contention:'));
        for (const t of tags) tagCounts[t] = (tagCounts[t]||0)+1;
      }
      const top = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1])[0];
      if (!top) continue;
      const ctnId = top[0].replace('contention:','');
      const idx = ctnIndexById[ctnId];
      if (idx === undefined) continue;
      // Apply DC and %
      const next = ratings.slice();
      next[idx] = { ...next[idx], dc: diag.suggested_dc, percent: diag.suggested_percent };
      setRatings(next);
      applied++;
    }
    setMsg(`Applied ${applied} suggestion(s) to ratings.`);
  };

  const renderCodeSheet = async ()=>{
    const res = await fetch('http://localhost:8084/codesheet/render',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({claim_id: claimId, ratings, combined_percent: combined})
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:16}}>
      <div className="sz-card">
        <h3>Ratings</h3>
        {ratings.map((r, i)=>(
          <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 100px 120px 160px', gap:8, marginBottom:8}}>
            <input value={r.contention} onChange={e=>updateRating(i,'contention',e.target.value)} style={{padding:6, borderRadius:8, color:'#111827'}}/>
            <input value={r.dc} onChange={e=>updateRating(i,'dc',e.target.value)} placeholder="DC" style={{padding:6, borderRadius:8, color:'#111827'}}/>
            <input value={r.percent} onChange={e=>updateRating(i,'percent',parseInt(e.target.value||'0'))} type="number" style={{padding:6, borderRadius:8, color:'#111827'}}/>
            <input value={r.effective_date} onChange={e=>updateRating(i,'effective_date',e.target.value)} type="date" style={{padding:6, borderRadius:8, color:'#111827'}}/>
          </div>
        ))}
        <div style={{marginTop:8}}>Combined %: <input value={combined} onChange={e=>setCombined(parseInt(e.target.value||'0'))} type="number" style={{padding:6, borderRadius:8, color:'#111827'}}/></div>
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button onClick={renderCodeSheet} style={{padding:'10px 14px', borderRadius:12, background:'var(--sz-accent)'}}>Generate Code Sheet PDF</button>
          {ml && <button onClick={()=>applySuggestions(ml)} style={{padding:'10px 14px', borderRadius:12}}>Apply suggestions</button>}
        </div>
        {msg && <div style={{marginTop:8, opacity:.8}}>{msg}</div>}
      </div>
      <AssistPanel claimId={claimId} docs={docs} onResult={setMl} onApply={applySuggestions} />
    </div>
  );
}
