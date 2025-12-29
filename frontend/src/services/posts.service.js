import { api, getApiErrorMessage } from "./api";

/**
 * Endpoints para posts (artigos)
 * - GET    /posts
 * - GET    /posts/:id
 * - GET    /posts/search?q=xxx
 * - POST   /posts                  
 * - PUT    /posts/:id             
 * - DELETE /posts/:id              
 */

const PATHS = {
  list: "/posts",
  details: (id) => `/posts/${id}`,
  search: "/posts/search",
  create: "/posts",
  update: (id) => `/posts/${id}`,
  remove: (id) => `/posts/${id}`,
};

// normaliza diferenças entre id/_id e campos
function mapPost(p) {
  if (!p) return p;

  const autorRaw = p.autor ?? p.author ?? null;

  const autorObj =
    autorRaw && typeof autorRaw === "object"
      ? {
          _id: autorRaw._id || autorRaw.id,
          id: autorRaw._id || autorRaw.id,
          name: autorRaw.name,
          email: autorRaw.email,
          disciplinas: Array.isArray(autorRaw.disciplinas) ? autorRaw.disciplinas : [],
        }
      : null;

  const titulo = p.titulo ?? p.title ?? "";
  const conteudo = p.conteudo ?? p.content ?? "";
  const materia = p.materia ?? p.subject ?? "";
  const tags = Array.isArray(p.tags) ? p.tags : [];

  const summary =
    p.summary ||
    p.description ||
    (conteudo ? conteudo.slice(0, 140) + "..." : "");

  // autor padronizado para telas que esperam p.autor (objeto)
  const autor =
    autorObj ||
    (typeof autorRaw === "string" ? { _id: autorRaw, id: autorRaw } : null);

  return {
    // id normalizado
    id: p.id || p._id,

    title: p.title || p.titulo,
    content: p.content || p.conteudo,
    subject: p.subject || p.materia,
    tags,
    summary,
    author:
      typeof autorRaw === "string"
        ? autorRaw
        : (autorRaw?.name || autorRaw?.email || ""),

    // campos para a página de professores
    autor,       // objeto com _id/name/disciplinas (ou pelo menos _id)
    autorObj,    // se precisar em algum lugar
    titulo,
    conteudo,
    materia,

    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}


export async function getPosts() {
  try {
    const res = await api.get(PATHS.list);
    const data = res.data?.data || res.data; 
    return Array.isArray(data) ? data.map(mapPost) : [];
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Falha ao carregar posts."));
  }
}

export async function searchPosts(q) {
  const { data } = await api.get("/posts/search", { params: { q } });
  return Array.isArray(data) ? data.map(mapPost) : [];
}


export async function getPostById(id) {
  try {
    const res = await api.get(PATHS.details(id));
    const data = res.data?.data || res.data;
    return mapPost(data);
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Falha ao carregar o post."));
  }
}

export async function createPost(payload) {
  try {
    const res = await api.post(PATHS.create, payload);
    const data = res.data?.data || res.data;
    return mapPost(data);
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Falha ao criar o post."));
  }
}

export async function updatePost(id, payload) {
  try {
    const res = await api.put(PATHS.update(id), payload);
    const data = res.data?.data || res.data;
    return mapPost(data);
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Falha ao atualizar o post."));
  }
}

export async function deletePost(id) {
  try {
    await api.delete(PATHS.remove(id));
    return true;
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Falha ao excluir o post."));
  }
}
