export default function SkinZAIHeader() {
  return (
    <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
      <div className="sz-hero">SkinZAI VBMS</div>
      <nav style={{display:'flex', gap:12}}>
        <a href="/search">Search</a>
        <a href="/claims">Claims</a>
        <a href="/efolder">eFolder</a>
        <a href="/diagnostics">Diagnostics</a>
        <a href="/decisions">Decisions</a>
      </nav>
    </header>
  );
}
