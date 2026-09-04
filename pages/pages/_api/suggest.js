// Rota de backend: recebe o texto clínico, monta o prompt e chama o Gemini.
// A chave da API nunca é exposta ao navegador — ela vive só aqui, no servidor.

const SYSTEM_PROMPT = `Você é um assistente de apoio a profissionais de neuropsicopedagogia.
Você vai receber um texto clínico (laudo, avaliação ou anotação já anonimizada, sem dados
identificáveis do paciente). Com base nele, organize hipóteses de plano de intervenção.

Regras obrigatórias:
- Organize a resposta por área (ex: cognitiva, linguagem, motora, socioemocional, aprendizagem escolar),
  só incluindo as áreas que fizerem sentido para o caso.
- Para cada área, liste sugestões objetivas e práticas, não genéricas.
- Nunca dê um diagnóstico. Nunca afirme com certeza clínica.
- Termine sempre com o aviso: "Estas são sugestões de apoio para análise do profissional responsável,
  não substituem o julgamento clínico nem constituem diagnóstico ou prescrição."
- Responda em português do Brasil, em texto corrido organizado por seções, sem markdown de tabela.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { texto } = req.body || {};

  if (!texto || typeof texto !== "string" || texto.trim().length < 20) {
    return res.status(400).json({
      error: "Cole um texto clínico com pelo menos algumas frases para gerar sugestões.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY não configurada no servidor. Veja o README.",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: `Texto clínico:\n\n${texto}` }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Erro da API Gemini:", errBody);
      return res.status(502).json({ error: "Erro ao consultar o modelo de IA." });
    }

    const data = await response.json();
    const texto_resposta =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
      "Não foi possível gerar uma resposta. Tente reformular o texto.";

    return res.status(200).json({ resultado: texto_resposta });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro inesperado ao processar a solicitação." });
  }
}
