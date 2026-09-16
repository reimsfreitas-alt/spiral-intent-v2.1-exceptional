import {NextResponse} from "next/server";

export async function POST(req: Request) {
  try {
    const { text, lang = "pt" } = await req.json();
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "TEXT_REQUIRED" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "VOICE_ENGINE_NOT_CONFIGURED", message: "O motor de resposta ainda não está configurado neste ambiente." },
        { status: 503 }
      );
    }

    const language = ({ pt: "Portuguese (Brazil)", en: "English", de: "German", fr: "French", zh: "Chinese" } as Record<string,string>)[lang] || "Portuguese (Brazil)";
    const system = `You are Spiral Intent, a calm, precise conversational decision assistant. Answer the user's spoken question directly and use ${language}. Keep the answer useful and concise. Do not pretend to execute external actions. When the question is about a real-world legal, financial, medical, or regulatory matter, distinguish general guidance from professional advice and avoid fabricated specifics. The product philosophy is: intent -> direction -> movement. Help the user understand the situation and identify a practical next step.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: text.trim() }
        ],
        max_output_tokens: 700
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Spiral voice provider error", response.status, detail.slice(0, 500));
      return NextResponse.json({ error: "VOICE_PROVIDER_ERROR" }, { status: 502 });
    }

    const data = await response.json();
    const answer = typeof data.output_text === "string"
      ? data.output_text.trim()
      : Array.isArray(data.output)
        ? data.output.flatMap((item: any) => Array.isArray(item.content) ? item.content : []).map((part: any) => part.text || "").join(" ").trim()
        : "";

    if (!answer) return NextResponse.json({ error: "EMPTY_RESPONSE" }, { status: 502 });
    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Spiral voice error", error);
    return NextResponse.json({ error: "VOICE_FAILED" }, { status: 500 });
  }
}
