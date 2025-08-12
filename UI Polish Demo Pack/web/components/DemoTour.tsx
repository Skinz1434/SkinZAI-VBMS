'use client'
import { useEffect, useState } from 'react';

export default function DemoTour() {
  const [on, setOn] = useState(false);
  useEffect(()=>{
    const first = localStorage.getItem('sz_tour_done');
    if (!first) setOn(true);
  }, []);
  if (!on) return null;

  return (
    <div className="sz-card" style={{position:'fixed', bottom:24, right:24, maxWidth:360}}>
      <div style={{fontWeight:700, marginBottom:8}}>Quick Tour</div>
      <ol style={{marginLeft:16}}>
        <li>Search a file number</li>
        <li>Open Diagnostics to get DC suggestions</li>
        <li>Use Decision Builder to generate the code sheet</li>
      </ol>
      <button onClick={()=>{ localStorage.setItem('sz_tour_done','1'); setOn(false); }} style={{marginTop:8, padding:'6px 10px', borderRadius:10, background:'var(--sz-accent)'}}>Got it</button>
    </div>
  );
}
