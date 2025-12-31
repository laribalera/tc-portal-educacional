import { api, getApiErrorMessage } from "./api";

// limitando a 10 últimos posts para evitar payloads grandes na listagem
const PATHS = {
  list: "/professores",
  postsByProfessor: (professorId) => `/posts?authorId=${professorId}&limit=10`,
};

// busca todos os professores
export async function getProfessores() {
  try {
    const { data } = await api.get(PATHS.list);
    return data;
  } catch (e) {
    throw new Error(getApiErrorMessage(e, "Falha ao carregar professores."));
  }
}

// busca os últimos posts de um professor específico
export async function getUltimosPostsDoProfessor(professorId) {
  try {
    const { data } = await api.get(PATHS.postsByProfessor(professorId));
    return data;
  } catch (e) {
    throw new Error(getApiErrorMessage(e, "Falha ao carregar posts do professor."));
  }
}

// busca os dados do professor logado
export async function getMeProfessor() {
  const { data } = await api.get("/professores/me");
  return data; // { id, name, email, disciplinas }
}

// registra um novo professor
export async function registerProfessor(payload) {
  try {
    const { data } = await api.post("/professores", payload);
    return data;
  } catch (e) {
    throw new Error(getApiErrorMessage(e) || "Falha ao cadastrar professor.");
  }
}
