import Link from "next/link";

const stripeUrl = "https://buy.stripe.com/7sY00cdeP3445NJbejbbG08";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#05070b", color: "#e6edf3", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #1b2633", background: "#05070bf2", backdropFilter: "blur(12px)" }}>
        <nav style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ color: "#e5bb60", fontWeight: 800, letterSpacing: ".12em", textDecoration: "none" }}>SPIRAL INTENT</Link>
          <div style={{ display: "flex", gap: 18, fontSize: 14 }}>
            <a href="#problem" style={{ color: "#91a0b2" }}>Problema</a>
            <a href="#proof" style={{ color: "#91a0b2" }}>Prova</a>
            <Link href="/portfolio" style={{ color: "#91a0b2" }}>Portfólio</Link>
            <a href={stripeUrl} target="_blank" rel="noreferrer" style={{ color: "#171207", background: "#e5bb60", padding: "9px 12px", borderRadius: 7, fontWeight: 800 }}>Founder / Cowboy</a>
          </div>
        </nav>
      </header>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "92px 24px 78px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".16em", fontFamily: "ui-monospace, monospace" }}>INDEPENDENT EXECUTION ASSURANCE</div>
          <h1 style={{ fontSize: "clamp(44px,6vw,76px)", lineHeight: 1, letterSpacing: "-.05em", margin: "18px 0" }}>Prova para sistemas que <span style={{ color: "#5fe0d0" }}>agem.</span></h1>
          <p style={{ color: "#91a0b2", fontSize: 18, lineHeight: 1.65 }}>O Spiral Intent separa execução de atestação, observa o sistema externo de forma independente e confronta o efeito real com o que foi autorizado.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <a href={stripeUrl} target="_blank" rel="noreferrer" style={{ background: "#e5bb60", color: "#171207", padding: "13px 18px", borderRadius: 8, fontWeight: 800 }}>Acessar Founder / Cowboy</a>
            <Link href="/portfolio" style={{ border: "1px solid #344354", padding: "13px 18px", borderRadius: 8 }}>Ver portfólio</Link>
          </div>
        </div>
        <div style={{ border: "1px solid #263445", borderRadius: 14, padding: 24, background: "linear-gradient(180deg,#0d151f,#080c11)" }}>
          <div style={{ color: "#91a0b2", fontSize: 11, letterSpacing: ".1em" }}>EXEMPLO DE CONFRONTO</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", marginTop: 18 }}>
            <strong style={{ fontSize: 26 }}>R$ 3.000</strong><span style={{ color: "#f06a61", fontSize: 28 }}>≠</span><strong style={{ color: "#f06a61", fontSize: 26 }}>R$ 30.000</strong>
          </div>
          <p style={{ color: "#91a0b2", fontFamily: "ui-monospace, monospace", fontSize: 12, lineHeight: 1.8 }}>worker: SUCCESS<br />observer: estado externo lido<br />verifier: autorização ≠ efeito observado<br />receipt: resultado emitido</p>
          <div style={{ border: "1px solid #51302c", background: "#170d0b", padding: 12, borderRadius: 8, color: "#f06a61", fontFamily: "ui-monospace, monospace", fontSize: 12 }}>DEVIATED — a declaração do executor não é autoridade.</div>
        </div>
      </section>

      <section id="problem" style={{ borderTop: "1px solid #121a23", padding: "76px 24px" }}><div style={{ maxWidth: 1180, margin: "0 auto" }}><h2 style={{ fontSize: "clamp(32px,4vw,50px)", lineHeight: 1.05 }}>Uma chamada bem-sucedida não é um resultado verificado.</h2><p style={{ color: "#91a0b2", maxWidth: 760, fontSize: 18, lineHeight: 1.65 }}>Agentes, workflows, gateways e logs podem afirmar que uma requisição terminou. Isso ainda não prova que o estado externo corresponde ao que foi autorizado.</p></div></section>
      <section id="proof" style={{ borderTop: "1px solid #121a23", padding: "76px 24px" }}><div style={{ maxWidth: 1180, margin: "0 auto" }}><h2 style={{ fontSize: "clamp(32px,4vw,50px)", lineHeight: 1.05 }}>O caminho da prova</h2><p style={{ color: "#91a0b2", fontSize: 18 }}>Intent → Policy → Authorization → Execution → Observation → Verification → Receipt.</p></div></section>
      <section id="portfolio" style={{ borderTop: "1px solid #121a23", padding: "76px 24px" }}><div style={{ maxWidth: 1180, margin: "0 auto" }}><div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".16em" }}>PORTFÓLIO</div><h2 style={{ fontSize: "clamp(32px,4vw,50px)" }}>Spiral Orb</h2><p style={{ color: "#91a0b2", fontSize: 18 }}>A camada de navegação do ecossistema Spiral está disponível na página dedicada.</p><Link href="/portfolio" style={{ color: "#e5bb60", fontWeight: 800 }}>Abrir o Spiral Orb →</Link></div></section>
      <section id="buy" style={{ borderTop: "1px solid #121a23", padding: "76px 24px" }}><div style={{ maxWidth: 1180, margin: "0 auto", border: "1px solid #665326", borderRadius: 14, padding: 32, background: "linear-gradient(135deg,#171308,#0b0e12)" }}><div style={{ color: "#e5bb60", fontSize: 11, letterSpacing: ".16em" }}>FOUNDER / COWBOY</div><h2 style={{ fontSize: "clamp(32px,4vw,50px)" }}>Acesso fundador ao Spiral Intent.</h2><p style={{ color: "#91a0b2", fontSize: 18 }}>Uma experiência de entrada para conhecer o modelo de declaração, autorização, observação e verificação de ações.</p><div style={{ color: "#e5bb60", fontSize: 34, fontWeight: 800 }}>R$ 197 · pagamento único</div><a href={stripeUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 22, background: "#e5bb60", color: "#171207", padding: "13px 18px", borderRadius: 8, fontWeight: 800 }}>Comprar acesso Founder / Cowboy</a></div></section>
      <footer style={{ maxWidth: 1180, margin: "0 auto", padding: "34px 24px 50px", color: "#657487", fontFamily: "ui-monospace, monospace", fontSize: 11 }}>SPIRAL CODES · SPIRAL INTENT</footer>
    </main>
  );
}
