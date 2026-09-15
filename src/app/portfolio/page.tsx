import Link from "next/link";

export default function PortfolioPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#05070b", color: "#e6edf3", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1b2633", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Link href="/" style={{ color: "#e5bb60", fontWeight: 800, letterSpacing: ".12em", textDecoration: "none" }}>SPIRAL WEALTH</Link>
          <span style={{ color: "#657487", margin: "0 12px" }}>·</span>
          <Link href="/" style={{ color: "#91a0b2" }}>Página principal</Link>
        </div>
      </header>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".16em" }}>PORTFÓLIO / APRESENTAÇÃO HUMANA</div>
        <h1 style={{ fontSize: "clamp(36px,6vw,64px)", lineHeight: 1.05 }}>Orb by Spiral Codes</h1>
        <p style={{ color: "#91a0b2", fontSize: 18, lineHeight: 1.65, maxWidth: 760 }}>
          Uma apresentação sobre história, decisões, padrões, memória e futuro — sem linguagem Enterprise e sem transformar a vida humana em dashboard.
        </p>
        <div style={{ border: "1px solid #263445", borderRadius: 14, overflow: "hidden", background: "#0b1118" }}>
          <iframe src="/spiral-orb-Rev1.html" title="Orb — apresentação humana" style={{ display: "block", width: "100%", height: 980, border: 0, background: "#05070b" }} />
        </div>
      </section>
    </main>
  );
}
