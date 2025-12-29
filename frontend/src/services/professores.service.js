import { api, getApiErrorMessage } from "./api";

const PATHS = {
  list: "/professores",
  postsByProfessor: (professorId) => `/posts?authorId=${professorId}&limit=10`,
};

export async function getProfessores() {
  try {
    const { data } = await api.get(PATHS.list);
    return data;
  } catch (e) {
    throw new Error(getApiErrorMessage(e, "Falha ao carregar professores."));
  }
}

export async function getUltimosPostsDoProfessor(professorId) {
  try {
    const { data } = await api.get(PATHS.postsByProfessor(professorId));
    return data;
  } catch (e) {
    throw new Error(getApiErrorMessage(e, "Falha ao carregar posts do professor."));
  }
}
