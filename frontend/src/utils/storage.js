// chaves para armazenamento local
const TOKEN_KEY = "portal_token";
const USER_KEY = "professor";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const getProfessor = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setProfessor = (p) => localStorage.setItem(USER_KEY, JSON.stringify(p));

export const clearProfessor = () => localStorage.removeItem(USER_KEY);