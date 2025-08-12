export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{background:'#0B1220', color:'#E5E7EB', fontFamily:'ui-sans-serif'}}>
        <div style={{display:'flex', minHeight:'100vh'}}>
          <aside style={{width:260, background:'#111827', padding:16}}>
            <h2 style={{marginBottom:16}}>SkinZAI VBMS</h2>
            <nav style={{display:'grid', gap:8}}>
              <a href="/">Dashboard</a>
              <a href="/search">Search</a>
              <a href="/claims">Claims</a>
              <a href="/efolder">eFolder</a>
              <a href="/development">Development</a>
              <a href="/decisions">Decisions</a>
              <a href="/queue">Work Queue</a>
              <a href="/admin">Admin</a>
            </nav>
          </aside>
          <main style={{flex:1, padding:24}}>{children}</main>
        </div>
      </body>
    </html>
  );
}
