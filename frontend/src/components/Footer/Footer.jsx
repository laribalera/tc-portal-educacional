import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <img src="/logo2.png" alt="Logo do Portal Educacional" />
        </div>

        <nav className="footer-sitemap">
          <div>
            <h4>Portal</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/professores">Professores</Link></li>
            </ul>
          </div>

          <div>
            <h4>Conteúdo</h4>
            <ul>
              <li><Link to="/">Posts</Link></li>
              <li><Link to="/buscar">Buscar</Link></li>
            </ul>
          </div>

          <div>
            <h4>Área do Professor</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/posts/novo">Criar Post</Link></li>
            </ul>
          </div>

          <div>
            <h4>Institucional</h4>
            <ul>
              <li><a href="https://github.com/laribalera/tc-portal-educacional" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><span>FIAP Tech Challenge</span></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Portal Educacional</span>
      </div>
    </footer>
  );
}
