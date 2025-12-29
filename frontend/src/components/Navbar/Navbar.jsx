import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Fecha o menu ao voltar para desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) setIsOpen(false); // breakpoint "lg"
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="pe-navbar">
      <nav className="pe-navbar__inner" aria-label="Navegação principal">
        {/* Logo + Nome */}
        <Link to="/" className="pe-navbar__brand" onClick={closeMenu}>
          <img className="pe-navbar__logo" src="/logo2.png" alt="Logo" />
          <span className="pe-navbar__title">Portal Educacional</span>
        </Link>

        {/* Toggle (mobile) */}
        <button
          type="button"
          className="pe-navbar__toggle"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
          aria-controls="pe-navbar-menu"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="pe-navbar__toggleBar" />
          <span className="pe-navbar__toggleBar" />
          <span className="pe-navbar__toggleBar" />
        </button>

        {/* Menu */}
        <div
          id="pe-navbar-menu"
          className={`pe-navbar__menu ${isOpen ? "is-open" : ""}`}
        >
          <div className="pe-navbar__links">
            <NavLink to="/" className="pe-navbar__link" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink
              to="/professores"
              className="pe-navbar__link"
              onClick={closeMenu}
            >
              Professores
            </NavLink>
          </div>

          <div className="pe-navbar__actions">
            {!isAuthenticated ? (
              <NavLink
                to="/login"
                className="pe-navbar__link pe-navbar__login"
                onClick={closeMenu}
              >
                Login
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  className="pe-navbar__link"
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>

                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  type="button"
                  className="pe-navbar__button"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
