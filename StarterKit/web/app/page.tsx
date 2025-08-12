export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to SkinZAI VBMS (v2). Use the left nav or Search.</p>
      <div style={{marginTop:24, display:'grid', gap:12, gridTemplateColumns:'repeat(3, 1fr)'}}>
        <div style={{padding:16, background:'#111827', borderRadius:12}}>My Queue</div>
        <div style={{padding:16, background:'#111827', borderRadius:12}}>Claims in Flight</div>
        <div style={{padding:16, background:'#111827', borderRadius:12}}>DTA Monitor</div>
      </div>
    </div>
  );
}
