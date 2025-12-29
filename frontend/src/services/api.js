import axios from "axios";
import { getToken, clearToken } from "../utils/storage";

/**
 * baseURL: http://localhost:3000/api
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// request interceptor: injeta jwt automaticamente
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: se der 401, limpa token (logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearToken();

      // dispara um evento global opcional (front reage e redireciona)
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  }
);

/**
 * helper: padroniza mensagens de erro pra UI
 */
export function getApiErrorMessage(err, fallback = "Ocorreu um erro na requisição.") {
  // axios: err.response?.data pode vir como { message } ou outro formato
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (err?.message) return err.message;
  return fallback;
}
