import Link from "next/link";

const stripeUrl = "https://buy.stripe.com/7sY00cdeP3445NJbejbbG08";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#05070b", color: "#e6edf3", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1b2633", background: "#05070bf2", position: "sticky", top: 0, zIndex: 10 }}>
        <nav style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ color: "#e5bb60", fontWeight: 800, letterSpacing: ".12em", textDecoration: "none" }}>SPIRAL WEALTH</Link>
          <Link href="/portfolio" style={{ color: "#c5a4e8", fontWeight: 700 }}>Portfólio</Link>
        </nav>
      </header>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "100px 24px 110px" }}>
        <div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".18em", fontFamily: "ui-monospace, monospace" }}>SPIRAL CODES · SPIRAL WEALTH</div>
        <h1 style={{ fontSize: "clamp(44px,7vw,84px)", lineHeight: 1.02, letterSpacing: "-.055em", maxWidth: 900, margin: "22px 0" }}>
          Tecnologia para organizar a vida, as decisões e o que realmente importa.
        </h1>
        <p style={{ color: "#91a0b2", fontSize: 21, lineHeight: 1.7, maxWidth: 780 }}>
          A Spiral Codes desenvolve instrumentos autorais que aproximam tecnologia, engenharia e observação humana. Cada projeto nasce para reduzir ruído, recuperar clareza e transformar experiência em estrutura.
        </p>
        <div style={{ marginTop: 34 }}>
          <Link href="/portfolio" style={{ display: "inline-block", border: "1px solid #8d6bb5", color: "#d8baf4", padding: "15px 22px", borderRadius: 8, fontWeight: 800, textDecoration: "none" }}>
            Conhecer o portfólio humano →
          </Link>
        </div>
      </section>

      <section style={{ borderTop: "1px solid #121a23", padding: "78px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28 }}>
          <article style={{ border: "1px solid #263445", borderRadius: 14, padding: 28, background: "#0b1118" }}>
            <div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".15em" }}>ENGENHARIA</div>
            <h2 style={{ fontSize: 30, margin: "16px 0" }}>Estrutura antes do ruído.</h2>
            <p style={{ color: "#91a0b2", lineHeight: 1.7 }}>Pensamento sistêmico, precisão e construção de instrumentos que possam permanecer úteis ao longo do tempo.</p>
          </article>
          <article style={{ border: "1px solid #263445", borderRadius: 14, padding: 28, background: "#0b1118" }}>
            <div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".15em" }}>OBSERVAÇÃO HUMANA</div>
            <h2 style={{ fontSize: 30, margin: "16px 0" }}>A pessoa não é um dashboard.</h2>
            <p style={{ color: "#91a0b2", lineHeight: 1.7 }}>A tecnologia deve ampliar a percepção e a autonomia, não reduzir a vida humana a métricas superficiais.</p>
          </article>
          <article style={{ border: "1px solid #263445", borderRadius: 14, padding: 28, background: "#0b1118" }}>
            <div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".15em" }}>TECNOLOGIA</div>
            <h2 style={{ fontSize: 30, margin: "16px 0" }}>Experiência que vira instrumento.</h2>
            <p style={{ color: "#91a0b2", lineHeight: 1.7 }}>Produtos e ambientes digitais para registrar, compreender e orientar decisões com mais consciência.</p>
          </article>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1b2633", maxWidth: 1180, margin: "0 auto", padding: "36px 24px 56px", color: "#657487", fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <span>SPIRAL CODES · SPIRAL WEALTH</span>
          <a href={stripeUrl} target="_blank" rel="noreferrer" style={{ color: "#e5bb60", fontWeight: 800 }}>Acessar oferta no Stripe →</a>
        </div>
      </footer>
    </main>
  );
}
