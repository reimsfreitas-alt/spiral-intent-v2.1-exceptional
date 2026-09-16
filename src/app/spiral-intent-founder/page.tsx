"use client";

import { useEffect, useState } from "react";

const stripeUrl = "https://buy.stripe.com/7sY00cdeP3445NJbejbbG08";

type Lang = "pt" | "en" | "de" | "fr" | "zh";

const copy: Record<Lang, any> = {
  pt: {
    nav1: "Como funciona", nav2: "Voz", nav3: "Por dentro", buy: "Founder",
    kicker: "INTENÇÃO → DIREÇÃO → MOVIMENTO",
    title: <>Você diz o que quer. O <em>Spiral</em> ajuda a encontrar o caminho.</>,
    lead: "Sem ficha de cadastro interminável. Sem painel que parece cabine de avião. Você começa pela intenção. A profundidade fica por baixo.",
    start: "Começar", speak: "Falar com o Spiral", ready: "VOZ: pronta quando seu navegador oferecer reconhecimento de fala.",
    f1: "menos preenchimento · mais intenção", f2: "memória · tempo · direção", f3: "humano por fora · cálculo por dentro",
    ideaK: "A IDEIA", ideaT: "A maioria das pessoas não precisa de mais informação. Precisa de orientação.",
    ideaP: "A filosofia Spiral parte de uma sequência simples: enxergar, escolher e mover. A tecnologia existe para diminuir o ruído — não para aumentar a quantidade de coisas que você precisa preencher.",
    c1t: "Luz", c1p: "Ver a situação como ela está, sem transformar a pessoa em um conjunto de métricas.",
    c2t: "Direção", c2p: "Encontrar o próximo passo que realmente importa, em vez de abrir mais dez abas.",
    c3t: "Movimento", c3p: "Transformar clareza em uma ação concreta. Pequena quando precisa ser pequena.",
    voiceK: "UMA CONVERSA, NÃO UM FORMULÁRIO", voiceT: "Diga. O sistema organiza.",
    voiceP: "Fale naturalmente. O Spiral transforma sua fala em intenção, organiza a resposta e pode lê-la de volta para você.",
    ph: "Por exemplo: “Qual é o próximo passo para lançar meu produto?”", mic: "Ouvir",
    insideK: "POR DENTRO", insideT: "A superfície pode ser simples. O motor não precisa ser.",
    insideP: "O Spiral separa intenção, política, autorização, execução, observação e verificação. A complexidade fica onde ela é útil: no motor.",
    s1: "O que você quer fazer?", s2: "O que pode acontecer?", s3: "O que foi permitido?", s4: "O que foi feito?", s5: "O que aconteceu?", s6: "O que podemos afirmar?"
  },
  en: {
    nav1: "How it works", nav2: "Voice", nav3: "Inside", buy: "Founder", kicker: "INTENT → DIRECTION → MOVEMENT",
    title: <>You say what you want. <em>Spiral</em> helps find the path.</>, lead: "No endless intake form. No cockpit dashboard. You start with intent. The depth stays underneath.", start: "Start", speak: "Talk to Spiral", ready: "VOICE: ready when your browser offers speech recognition.", f1: "less filling · more intent", f2: "memory · time · direction", f3: "human outside · calculation inside",
    ideaK: "THE IDEA", ideaT: "Most people do not need more information. They need orientation.", ideaP: "Spiral starts with a simple sequence: see, choose, move. Technology reduces noise instead of adding more things to fill in.", c1t: "Light", c1p: "See the situation as it is, without turning a person into a set of metrics.", c2t: "Direction", c2p: "Find the next step that matters instead of opening ten more tabs.", c3t: "Movement", c3p: "Turn clarity into concrete action. Small when it needs to be small.", voiceK: "A CONVERSATION, NOT A FORM", voiceT: "Say it. The system organizes.", voiceP: "Speak naturally. Spiral turns your speech into intent, organizes the answer, and can read it back to you.", ph: "For example: “What is the next step to launch my product?”", mic: "Listen", insideK: "INSIDE", insideT: "The surface can be simple. The engine does not have to be.", insideP: "Spiral separates intent, policy, authorization, execution, observation and verification. Complexity stays where it is useful: in the engine.", s1: "What do you want to do?", s2: "What may happen?", s3: "What was allowed?", s4: "What was done?", s5: "What happened?", s6: "What can we affirm?"
  },
  de: { nav1:"So funktioniert es",nav2:"Stimme",nav3:"Im Inneren",buy:"Founder",kicker:"ABSICHT → RICHTUNG → BEWEGUNG",title:<>Du sagst, was du willst. <em>Spiral</em> hilft, den Weg zu finden.</>,lead:"Kein endloses Formular. Kein Cockpit. Du beginnst mit deiner Absicht. Die Tiefe bleibt darunter.",start:"Starten",speak:"Mit Spiral sprechen",ready:"STIMME: bereit, wenn dein Browser Spracherkennung anbietet.",f1:"weniger Eingabe · mehr Absicht",f2:"Gedächtnis · Zeit · Richtung",f3:"menschlich außen · Berechnung innen",ideaK:"DIE IDEE",ideaT:"Die meisten Menschen brauchen nicht mehr Informationen. Sie brauchen Orientierung.",ideaP:"Spiral folgt einer einfachen Sequenz: sehen, wählen, bewegen. Technologie reduziert Rauschen, statt neue Formulare zu schaffen.",c1t:"Licht",c1p:"Die Situation sehen, wie sie ist, ohne Menschen in Kennzahlen zu verwandeln.",c2t:"Richtung",c2p:"Den nächsten wichtigen Schritt finden, statt zehn weitere Tabs zu öffnen.",c3t:"Bewegung",c3p:"Klarheit in konkrete Handlung verwandeln.",voiceK:"EIN GESPRÄCH, KEIN FORMULAR",voiceT:"Sag es. Das System ordnet.",voiceP:"Sprich natürlich. Spiral macht daraus eine Absicht, organisiert die Antwort und kann sie vorlesen.",ph:"Zum Beispiel: „Was ist der nächste Schritt für mein Produkt?"",mic:"Hören",insideK:"IM INNEREN",insideT:"Die Oberfläche darf einfach sein. Der Motor muss es nicht sein.",insideP:"Spiral trennt Absicht, Richtlinie, Autorisierung, Ausführung, Beobachtung und Verifikation.",s1:"Was willst du tun?",s2:"Was darf passieren?",s3:"Was wurde erlaubt?",s4:"Was wurde getan?",s5:"Was ist passiert?",s6:"Was können wir bestätigen?"},
  fr: { nav1:"Fonctionnement",nav2:"Voix",nav3:"À l'intérieur",buy:"Founder",kicker:"INTENTION → DIRECTION → MOUVEMENT",title:<>Vous dites ce que vous voulez. <em>Spiral</em> aide à trouver le chemin.</>,lead:"Pas de formulaire interminable. Pas de tableau de bord. Vous commencez par l'intention. La profondeur reste dessous.",start:"Commencer",speak:"Parler avec Spiral",ready:"VOIX : prête si votre navigateur propose la reconnaissance vocale.",f1:"moins de saisie · plus d'intention",f2:"mémoire · temps · direction",f3:"humain dehors · calcul dedans",ideaK:"L'IDÉE",ideaT:"La plupart des gens n'ont pas besoin de plus d'informations. Ils ont besoin d'orientation.",ideaP:"Spiral suit une séquence simple : voir, choisir, avancer. La technologie réduit le bruit au lieu d'ajouter des champs.",c1t:"Lumière",c1p:"Voir la situation telle qu'elle est, sans réduire une personne à des métriques.",c2t:"Direction",c2p:"Trouver la prochaine étape importante au lieu d'ouvrir dix onglets.",c3t:"Mouvement",c3p:"Transformer la clarté en action concrète.",voiceK:"UNE CONVERSATION, PAS UN FORMULAIRE",voiceT:"Dites-le. Le système organise.",voiceP:"Parlez naturellement. Spiral transforme votre voix en intention, organise la réponse et peut la lire à voix haute.",ph:"Par exemple : « Quelle est la prochaine étape pour lancer mon produit ? »",mic:"Écouter",insideK:"À L'INTÉRIEUR",insideT:"La surface peut être simple. Le moteur ne doit pas l'être.",insideP:"Spiral sépare intention, politique, autorisation, exécution, observation et vérification.",s1:"Que voulez-vous faire ?",s2:"Que peut-il se passer ?",s3:"Qu'est-ce qui a été autorisé ?",s4:"Qu'est-ce qui a été fait ?",s5:"Que s'est-il passé ?",s6:"Que pouvons-nous affirmer ?"},
  zh: { nav1:"如何工作",nav2:"语音",nav3:"内部",buy:"Founder",kicker:"意图 → 方向 → 行动",title:<>你说出想做什么。<em>Spiral</em> 帮你找到路径。</>,lead:"没有冗长表格，也没有复杂仪表盘。你从意图开始，深度留在底层。",start:"开始",speak:"与 Spiral 对话",ready:"语音：浏览器支持语音识别时即可使用。",f1:"少填写 · 多意图",f2:"记忆 · 时间 · 方向",f3:"外部简单 · 内部计算",ideaK:"理念",ideaT:"大多数人不需要更多信息，而需要方向。",ideaP:"Spiral 从一个简单序列开始：看见、选择、行动。技术用于减少噪音，而不是增加表格。",c1t:"看见",c1p:"看清情况本身，而不是把人变成一组指标。",c2t:"方向",c2p:"找到真正重要的下一步，而不是打开更多页面。",c3t:"行动",c3p:"把清晰转化为具体行动。",voiceK:"一场对话，而不是一张表",voiceT:"说出来。系统负责整理。",voiceP:"自然地说出来。Spiral 将语音转化为意图，组织答案，并可以朗读给你。",ph:"例如：“发布产品的下一步是什么？”",mic:"聆听",insideK:"内部",insideT:"表面可以简单，内部引擎不必简单。",insideP:"Spiral 将意图、策略、授权、执行、观察和验证分开。",s1:"你想做什么？",s2:"什么可以发生？",s3:"什么被允许？",s4:"做了什么？",s5:"发生了什么？",s6:"我们能确认什么？"}
};

export default function SpiralIntentFounder() {
  const [lang, setLang] = useState<Lang>("pt");
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");
  const t = copy[lang];

  useEffect(() => {
    const saved = window.localStorage.getItem("spiral-intent-lang") as Lang | null;
    if (saved && copy[saved]) setLang(saved);
  }, []);

  function changeLang(next: Lang) {
    setLang(next); window.localStorage.setItem("spiral-intent-lang", next);
  }

  async function askSpiral(transcript: string) {
    if (!transcript.trim()) return;
    setStatus("Spiral is thinking…");
    try {
      const res = await fetch("/api/spiral-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, lang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "VOICE_FAILED");
      setAnswer(data.answer);
      setStatus("Ready.");
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.answer);
        utterance.lang = lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : `${lang}-${lang === "en" ? "US" : lang === "fr" ? "FR" : "DE"}`;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error: any) {
      setStatus(error?.message === "VOICE_ENGINE_NOT_CONFIGURED" ? "Voice response engine is not configured yet." : "I couldn't complete the response. Please try again.");
    }
  }

  function startVoice() {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) { setStatus("Speech recognition is not available in this browser."); return; }
    const r = new Recognition();
    r.lang = lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : `${lang}-${lang === "en" ? "US" : lang === "fr" ? "FR" : "DE"}`;
    r.interimResults = false; r.continuous = false;
    setListening(true); setStatus("Listening…");
    r.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((x:any) => x[0].transcript).join(" ").trim();
      setText(transcript);
      void askSpiral(transcript);
    };
    r.onerror = () => { setListening(false); setStatus("Voice recognition stopped."); };
    r.onend = () => { setListening(false); };
    r.start();
  }

  return <>
    <style dangerouslySetInnerHTML={{__html:`
      :root{--bg:#071018;--ink:#f6f1e8;--muted:#aab5bd;--gold:#e5bd69;--cyan:#5de2d0;--violet:#9b7cff;--line:rgba(255,255,255,.11);--max:1180px}
      *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(900px 500px at 12% 5%,rgba(93,226,208,.12),transparent 60%),radial-gradient(800px 520px at 88% 14%,rgba(155,124,255,.13),transparent 60%),var(--bg);color:var(--ink);font:16px/1.55 Inter,system-ui,-apple-system,Segoe UI,sans-serif;overflow-x:hidden}body:before{content:"";position:fixed;inset:-30%;background:conic-gradient(from 90deg,transparent,rgba(229,189,105,.04),transparent 30%,rgba(93,226,208,.035),transparent 55%,rgba(155,124,255,.04),transparent);animation:drift 22s linear infinite;pointer-events:none;z-index:-1}@keyframes drift{to{transform:rotate(360deg)}}a{color:inherit;text-decoration:none}.wrap{width:min(var(--max),calc(100% - 36px));margin:auto}nav{height:68px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:800;letter-spacing:.16em;font-size:13px}.brand i{color:var(--gold);font-style:normal}.links{display:flex;gap:18px;align-items:center;color:var(--muted);font-size:13px}.links a:hover{color:var(--ink)}.langs{display:flex;gap:6px}.langs button{background:transparent;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:6px 8px;font:700 9px ui-monospace,monospace;cursor:pointer}.langs button.active{color:var(--gold);border-color:rgba(229,189,105,.5)}.hero{min-height:calc(100vh - 68px);display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:50px;padding:80px 0 100px}.kicker{font:700 10px ui-monospace,monospace;letter-spacing:.18em;color:var(--gold);text-transform:uppercase}.hero h1{font-size:clamp(48px,7vw,88px);line-height:.94;letter-spacing:-.055em;max-width:10ch;margin:18px 0}.hero h1 em{font-style:normal;background:linear-gradient(100deg,var(--gold),var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent}.lead{font-size:20px;color:var(--muted);max-width:620px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin:28px 0}.btn{border:1px solid var(--line);border-radius:12px;padding:13px 18px;font-weight:750;display:inline-flex;align-items:center;gap:8px;cursor:pointer;background:rgba(255,255,255,.025)}.btn:hover{border-color:rgba(229,189,105,.5);transform:translateY(-1px)}.primary{background:var(--gold);color:#17130a;border-color:var(--gold)}.voice{border-color:rgba(93,226,208,.35);color:var(--cyan)}.orb-wrap{position:relative;min-height:520px;display:grid;place-items:center}.orb{width:min(72vw,470px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.95),rgba(93,226,208,.55) 9%,rgba(93,226,208,.12) 28%,rgba(155,124,255,.12) 45%,transparent 68%);box-shadow:0 0 100px rgba(93,226,208,.14),0 0 170px rgba(155,124,255,.11);animation:float 7s ease-in-out infinite}.orb:before,.orb:after{content:"";position:absolute;inset:12%;border:1px solid rgba(229,189,105,.35);border-radius:47% 53% 60% 40%;animation:spin 18s linear infinite}.orb:after{inset:22%;border-color:rgba(93,226,208,.35);animation-duration:12s;animation-direction:reverse}.ring{position:absolute;width:min(85vw,560px);aspect-ratio:1;border:1px solid rgba(255,255,255,.08);border-radius:50%;animation:spin 30s linear infinite}.ring b{position:absolute;left:9%;top:20%;font:700 10px ui-monospace,monospace;color:var(--gold);letter-spacing:.15em}.floating{position:absolute;padding:10px 13px;border:1px solid var(--line);background:rgba(8,16,24,.72);backdrop-filter:blur(12px);border-radius:12px;color:var(--muted);font-size:12px;animation:float 6s ease-in-out infinite}.f1{right:3%;top:18%}.f2{left:1%;bottom:20%;animation-delay:-2s}.f3{right:12%;bottom:8%;animation-delay:-4s}@keyframes float{50%{transform:translateY(-12px)}}@keyframes spin{to{transform:rotate(360deg)}}section{padding:90px 0;border-top:1px solid rgba(255,255,255,.07)}h2{font-size:clamp(34px,5vw,58px);line-height:1;letter-spacing:-.045em;margin:8px 0 18px}.sub{color:var(--muted);font-size:18px;max-width:700px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{padding:24px;border:1px solid var(--line);border-radius:18px;background:rgba(14,24,34,.78);backdrop-filter:blur(16px)}.card h3{margin:0 0 8px}.card p{color:var(--muted);margin:0}.flow{display:grid;grid-template-columns:repeat(6,1fr);margin-top:35px}.step{padding:18px;border-left:1px solid var(--line)}.step b{font:700 10px ui-monospace,monospace;color:var(--gold)}.step h3{margin:14px 0 6px}.step p{color:var(--muted);font-size:13px}.voicebox{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;border:1px solid rgba(93,226,208,.22);background:linear-gradient(135deg,rgba(93,226,208,.06),rgba(155,124,255,.06));border-radius:20px;padding:24px}.voicebox input{width:100%;background:transparent;border:0;outline:0;color:var(--ink);font-size:18px}.status{font:10px ui-monospace,monospace;color:var(--muted)}.answer{margin-top:16px;padding:20px;border:1px solid rgba(229,189,105,.25);border-radius:18px;background:rgba(229,189,105,.045);white-space:pre-wrap;color:var(--ink);font-size:17px;line-height:1.65}footer{padding:35px 0 55px;color:#71808b;font:10px ui-monospace,monospace}@media(max-width:900px){.hero{grid-template-columns:1fr;padding-top:50px}.orb-wrap{min-height:420px}.grid{grid-template-columns:1fr}.flow{grid-template-columns:1fr 1fr}.links a:not(.cta){display:none}}@media(max-width:560px){.wrap{width:min(var(--max),calc(100% - 28px))}.hero h1{font-size:48px}.langs{margin-left:auto}.voicebox{grid-template-columns:1fr}.flow{grid-template-columns:1fr}}
    `}} />
    <header><div className="wrap"><nav><a className="brand" href="#top">SPIRAL <i>INTENT</i></a><div className="links"><a href="#ideia">{t.nav1}</a><a href="#voz">{t.nav2}</a><a href="#camada">{t.nav3}</a><a className="btn" href={stripeUrl} target="_blank" rel="noopener">{t.buy}</a></div><div className="langs">{(["pt","en","de","fr","zh"] as Lang[]).map(x=><button key={x} onClick={()=>changeLang(x)} className={lang===x?"active":""}>{x==="zh"?"中文":x.toUpperCase()}</button>)}</div></nav></div></header>
    <main id="top">
      <section className="hero"><div className="wrap hero" style={{width:"min(var(--max),calc(100% - 36px))",margin:"auto"}}><div><div className="kicker">{t.kicker}</div><h1>{t.title}</h1><p className="lead">{t.lead}</p><div className="actions"><a className="btn primary" href="#voz">{t.start}</a><button className="btn voice" onClick={startVoice}>◉ {t.speak}</button></div><div className="status">{listening ? "● LISTENING" : status || t.ready}</div></div><div className="orb-wrap"><div className="ring"><b>SPIRAL · LIVE</b></div><div className="orb"/><div className="floating f1">{t.f1}</div><div className="floating f2">{t.f2}</div><div className="floating f3">{t.f3}</div></div></div></section>
      <section id="ideia"><div className="wrap"><div className="kicker">{t.ideaK}</div><h2>{t.ideaT}</h2><p className="sub">{t.ideaP}</p><div className="grid" style={{marginTop:32}}><div className="card"><h3>{t.c1t}</h3><p>{t.c1p}</p></div><div className="card"><h3>{t.c2t}</h3><p>{t.c2p}</p></div><div className="card"><h3>{t.c3t}</h3><p>{t.c3p}</p></div></div></div></section>
      <section id="voz"><div className="wrap"><div className="kicker">{t.voiceK}</div><h2>{t.voiceT}</h2><p className="sub">{t.voiceP}</p><div className="voicebox"><input value={text} onChange={e=>setText(e.target.value)} placeholder={t.ph}/><button className="btn voice" onClick={startVoice}>🎙 {t.mic}</button></div>{text && <p className="status" style={{marginTop:10}}>{text}</p>}{answer && <div className="answer" aria-live="polite">{answer}</div>}</div></section>
      <section id="camada"><div className="wrap"><div className="kicker">{t.insideK}</div><h2>{t.insideT}</h2><p className="sub">{t.insideP}</p><div className="flow">{[["01","Intent",t.s1],["02","Policy",t.s2],["03","Authorization",t.s3],["04","Execution",t.s4],["05","Observation",t.s5],["06","Truth",t.s6]].map(([n,h,p])=><div className="step" key={n}><b>{n}</b><h3>{h}</h3><p>{p}</p></div>)}</div></div></section>
    </main>
    <footer><div className="wrap">SPIRAL CODES · INTENT · PT / EN / DE / FR / 中文</div></footer>
  </>;
}
