'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Contention = { id: string; title: string; dc_suggested?: string }

export default function DecisionPage() {
  const params = useParams();
  const claimId = params?.claimId as string;
  const [contentions, setContentions] = useState<Contention[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [combined, setCombined] = useState(50);

  useEffect(()=>{
    fetch(`http://localhost:8000/claims/${claimId}/contentions`).then(r=>r.json()).then((cts)=>{
      setContentions(cts);
      setRatings(cts.map((c:any)=>({contention: c.title, dc: c.dc_suggested || '', percent: 10, effective_date: new Date().toISOString().slice(0,10)})));
    });
  },[claimId]);

  const updateRating = (i:number, field:string, val:any)=>{
    const next = ratings.slice(); next[i] = {...next[i], [field]: val}; setRatings(next);
  }

  const renderCodeSheet = async ()=>{
    const r = await fetch('http://localhost:8084/codesheet/render',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({claim_id: claimId, ratings, combined_percent: combined})
    });
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16}}>
      <div style={{background:'#111827', borderRadius:16, padding:16}}>
        <h3>Issues</h3>
        <ul>{contentions.map(c=><li key={c.id}>{c.title}</li>)}</ul>
      </div>
      <div style={{background:'#111827', borderRadius:16, padding:16}}>
        <h3>Ratings</h3>
        {ratings.map((r, i)=>(
          <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 100px 120px', gap:8, marginBottom:8}}>
            <input value={r.contention} onChange={e=>updateRating(i,'contention',e.target.value)} style={{padding:6, borderRadius:8, color:'#111827'}}/>
            <input value={r.dc} onChange={e=>updateRating(i,'dc',e.target.value)} placeholder="DC" style={{padding:6, borderRadius:8, color:'#111827'}}/>
            <input value={r.percent} onChange={e=>updateRating(i,'percent',parseInt(e.target.value||'0'))} type="number" style={{padding:6, borderRadius:8, color:'#111827'}}/>
            <input value={r.effective_date} onChange={e=>updateRating(i,'effective_date',e.target.value)} type="date" style={{padding:6, borderRadius:8, color:'#111827'}}/>
          </div>
        ))}
        <div style={{marginTop:8}}>Combined %: <input value={combined} onChange={e=>setCombined(parseInt(e.target.value||'0'))} type="number" style={{padding:6, borderRadius:8, color:'#111827'}}/></div>
      </div>
      <div style={{background:'#111827', borderRadius:16, padding:16}}>
        <h3>Actions</h3>
        <button onClick={renderCodeSheet} style={{padding:'10px 14px', borderRadius:12, background:'#7B61FF'}}>Generate Code Sheet PDF</button>
      </div>
    </div>
  );
}
