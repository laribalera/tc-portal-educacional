import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headers from "../../components/Headers/Headers";
import { registerProfessor } from "../../services/professores.service";
import "./RegisterProfessor.css";

const CODIGO_VALIDO = "PORTALEDUCACIONALTC";

function toArrayFromText(text) {
  return String(text || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function RegisterProfessor() {
  const navigate = useNavigate();

  // etapa 1 (gate com o codigo para evitar cadastros que nao sejam de professores - codigo: PORTALEDUCACIONALTC)
  const [codigo, setCodigo] = useState("");
  const [codigoOk, setCodigoOk] = useState(false);

  // etapa 2 (cadastro)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disciplinasText, setDisciplinasText] = useState("");
  const [senha, setSenha] = useState("");

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const disciplinas = useMemo(() => toArrayFromText(disciplinasText), [disciplinasText]);

  const handleCheckCodigo = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (codigo.trim() !== CODIGO_VALIDO) {
      setCodigoOk(false);
      setError("Código inválido. Verifique e tente novamente.");
      return;
    }

    setCodigoOk(true);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("loading");
      setError(null);
      setSuccess(null);

      await registerProfessor({
        name,
        email,
        disciplinas,
        senha,
      });

      setSuccess("Cadastro realizado! Agora você pode entrar.");
      setStatus("idle");

      setTimeout(() => navigate("/login"), 800);
    } catch (e2) {
      setError(e2?.message || "Falha ao cadastrar.");
      setStatus("idle");
    }
  };

  return (
    <main className="register-page">
      <section className="register-card" aria-label="Cadastro de professor">
        <img className="register-logo" src="/logo.png" alt="Logo do Portal" />

        <Headers as="h1" text="Cadastro de Professor" />
        <p className="register-subtitle">
          Informe o código de cadastro para liberar o formulário.
        </p>

        {/* ETAPA 1: validar código */}
        {!codigoOk ? (
          <form onSubmit={handleCheckCodigo} className="register-form">
            <div className="register-field">
              <label htmlFor="codigo">Código de cadastro</label>
              <input
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="PORTALEDUCACIONALTC"
                required
              />
              <small className="register-hint">
                O código é obrigatório para continuar.
              </small>
            </div>

            {error ? <p className="register-error" role="alert">{error}</p> : null}

            <button className="register-button" type="submit">
              Validar código
            </button>

            <p className="register-footer">
              Já tem conta? <Link to="/login">Voltar para o login</Link>
            </p>
          </form>
        ) : (
          <>
            {/* ETAPA 2: cadastro */}
            <div className="register-badge" aria-label="Código validado">
              Código validado
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="register-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="register-field">
                <label htmlFor="disciplinas">Disciplinas</label>
                <input
                  id="disciplinas"
                  value={disciplinasText}
                  onChange={(e) => setDisciplinasText(e.target.value)}
                  placeholder="Ex: Matemática, Português, História"
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="register-field">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={status === "loading"}
                />
              </div>

              {error ? <p className="register-error" role="alert">{error}</p> : null}
              {success ? <p className="register-success" role="status">{success}</p> : null}

              <button className="register-button" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Cadastrando..." : "Cadastrar"}
              </button>

              <p className="register-footer">
                Já tem conta? <Link to="/login">Voltar para o login</Link>
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
