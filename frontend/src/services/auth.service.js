import { api, getApiErrorMessage } from "./api";

const LOGIN_PATH = "/professor/login";

export async function loginProfessor({ email, password }) {
  try {
    const res = await api.post(LOGIN_PATH, { email, password });

    // token pode vir em formatos diferentes
    const token =
      res.data?.token ||
      res.data?.accessToken ||
      res.data?.data?.token;

    // professor pode vir em formatos diferentes
    const professor =
      res.data?.professor ||
      res.data?.user ||
      res.data?.data?.professor ||
      res.data?.data?.user;

    if (!token) {
      throw new Error("Token não retornado pela API.");
    }

    // se não vier professor, ainda deixa logar, mas a navbar não terá nome
    return { token, professor: professor || null };
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Não foi possível realizar login."));
  }
}
