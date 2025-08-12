'use client'
import { useState } from 'react';

export default function Login() {
  const [email,setEmail] = useState('demo@skinz.ai');
  const [password,setPassword] = useState('demo123');
  const [msg,setMsg] = useState('');

  const doLogin = async () => {
    const r = await fetch('http://localhost:8081/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    });
    if(!r.ok){ setMsg('Login failed'); return; }
    const j = await r.json();
    localStorage.setItem('token', j.access_token);
    setMsg('Logged in. Token stored.');
  }

  return (
    <div>
      <h1>Sign in</h1>
      <div style={{display:'grid', gap:8, maxWidth:340}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{padding:8, borderRadius:8, color:'#111827'}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" style={{padding:8, borderRadius:8, color:'#111827'}}/>
        <button onClick={doLogin} style={{padding:'8px 12px', background:'#7B61FF', borderRadius:8}}>Login</button>
        <div>{msg}</div>
      </div>
    </div>
  );
}
