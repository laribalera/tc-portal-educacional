import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";
import { loginProfessor } from "../../services/auth.service";
import Headers from "../../components/Headers/Headers";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("loading");
      setError(null);

      const data = await loginProfessor({ email, password });
      await login({ token: data.token, professor: data.professor });
      navigate(from, { replace: true });
      
    } catch (e2) {
      setError(e2?.message || "Login inválido.");
      setStatus("idle");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Área de login">
        <img className="login-logo" src="/logo.png" alt="Logo do Portal" />

        <Headers as="h1" text="Entrar" />
        <p className="login-subtitle">Olá professor! Acesse com seu e-mail e senha.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
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

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              disabled={status === "loading"}
            />
          </div>

          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}

          <button className="login-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
