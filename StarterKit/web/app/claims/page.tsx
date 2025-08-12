'use client'
import { useEffect, useState } from 'react';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  useEffect(()=>{
    fetch('http://localhost:8000/claims').then(r=>r.json()).then(setClaims);
  },[]);
  return (
    <div>
      <h1>Claims</h1>
      <pre style={{marginTop:16, background:'#111827', padding:12, borderRadius:12}}>{JSON.stringify(claims, null, 2)}</pre>
    </div>
  );
}
