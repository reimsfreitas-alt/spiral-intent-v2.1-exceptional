import Link from "next/link";

export default function PortfolioPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#05070b", color: "#e6edf3", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1b2633", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}><Link href="/" style={{ color: "#e5bb60", fontWeight: 800, letterSpacing: ".12em" }}>SPIRAL CODES</Link> · <Link href="/" style={{ color: "#91a0b2" }}>Página principal</Link></div>
      </header>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".16em" }}>PORTFÓLIO / ECOSSISTEMA SPIRAL</div>
        <h1 style={{ fontSize: "clamp(36px,6vw,64px)", lineHeight: 1.05 }}>Spiral Orb</h1>
        <p style={{ color: "#91a0b2", fontSize: 18, lineHeight: 1.65, maxWidth: 760 }}>Camada de navegação e apresentação do ecossistema Spiral Codes.</p>
        <div style={{ border: "1px solid #263445", borderRadius: 14, overflow: "hidden", background: "#0b1118" }}>
          <iframe src="/orb/index.html" title="Spiral Orb" style={{ display: "block", width: "100%", height: 780, border: 0, background: "#05070b" }} />
        </div>
      </section>
    </main>
  );
}
