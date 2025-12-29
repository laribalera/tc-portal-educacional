import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, clearToken } from "../utils/storage";

const USER_KEY = "professor";

const AuthContext = createContext(null);

function getProfessor() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
function setProfessor(prof) {
  localStorage.setItem(USER_KEY, JSON.stringify(prof));
}
function clearProfessor() {
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [tokenState, setTokenState] = useState(getToken());
  const [professor, setProfessorState] = useState(getProfessor());

  const isAuthenticated = !!tokenState;

  useEffect(() => {
    const onLogout = () => {
      setTokenState(null);
      setProfessorState(null);
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  async function login({ token, professor }) {
    setToken(token);
    setProfessor(professor || null);

    setTokenState(token);
    setProfessorState(professor || null);
  }

  function logout() {
    clearToken();
    clearProfessor();
    setTokenState(null);
    setProfessorState(null);
    window.dispatchEvent(new Event("auth:logout"));
  }

  const value = useMemo(
    () => ({ isAuthenticated, professor, login, logout }),
    [isAuthenticated, professor]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
