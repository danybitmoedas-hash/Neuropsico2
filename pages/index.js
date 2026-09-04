import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState("");
  const [erro, setErro] = useState("");

  async function gerarSugestoes() {
    setErro("");
    setResultado("");
    setCarregando(true);
    try {
      const resp = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setErro(data.error || "Não foi possível gerar as sugestões.");
      } else {
        setResultado(data.resultado);
      }
    } catch (e) {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="page">
      <Head>
        <title>Apoio à Intervenção — Neuropsicopedagogia</title>
        <meta name="description" content="Assistente de apoio a planos de intervenção em neuropsicopedagogia" />
      </Head>

      <div className="top">
        <div className="mark">
          <span className="mark-glyph">Apoio</span>
          <span className="mark-label">assistente para neuropsicopedagogos</span>
        </div>
      </div>

      <main>
        <h1>Transforme um laudo em hipóteses de intervenção organizadas</h1>
        <p className="lede">
          Cole o conteúdo clínico de um laudo ou avaliação — sem nome, sem dado que
          identifique o paciente — e receba sugestões organizadas por área para você
          avaliar e adaptar.
        </p>

        <label className="field-label" htmlFor="texto-clinico">
          Texto clínico (anonimizado)
        </label>
        <textarea
          id="texto-clinico"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole aqui o conteúdo do laudo, avaliação ou anotação — apenas o conteúdo clínico, sem nome, data de nascimento ou outros dados que identifiquem o paciente."
        />
        <p className="hint">
          Não inclua nome, CPF, data de nascimento ou qualquer dado que identifique o
          paciente. As sugestões geradas são apoio para sua análise — não substituem seu
          julgamento clínico.
        </p>

        <div className="actions">
          <button onClick={gerarSugestoes} disabled={carregando || texto.trim().length < 20}>
            {carregando ? "Gerando…" : "Gerar sugestões"}
          </button>
          {carregando && <span className="status">Analisando o texto…</span>}
        </div>

        {erro && <div className="error-box">{erro}</div>}

        {resultado && (
          <div className="result">
            <div className="result-label">Sugestões de intervenção</div>
            <div className="result-body">{resultado}</div>
          </div>
        )}
      </main>

      <footer>
        Ferramenta de apoio — as sugestões não constituem diagnóstico ou prescrição e
        devem ser avaliadas pelo profissional responsável.
      </footer>
    </div>
  );
            }
