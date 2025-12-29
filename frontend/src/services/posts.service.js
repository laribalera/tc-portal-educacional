import { api, getApiErrorMessage } from "./api";

/**
 * Ajuste os endpoints conforme seu backend.
 * Aqui eu assumi um padrão REST:
 * - GET    /posts
 * - GET    /posts/:id
 * - GET    /posts/search?term=xxx   (ou /posts?search=xxx)
 * - POST   /posts                   (protegido)
 * - PUT    /posts/:id               (protegido)
 * - DELETE /posts/:id               (protegido)
 */
const PATHS = {
  list: "/posts",
  details: (id) => `/posts/${id}`,
  search: "/posts/search",
  create: "/posts",
  update: (id) => `/posts/${id}`,
  remove: (id) => `/posts/${id}`,
};

// Normaliza diferenças entre id/_id e campos
function mapPost(p) {
  if (!p) return p;

  const authorObj = p.autor || p.author;

  return {
    id: p.id || p._id,

    // seu backend está em pt-br:
    title: p.title || p.titulo,
    content: p.content || p.conteudo,

    // pode ser string ou objeto
    author:
      typeof authorObj === "string"
        ? authorObj
        : (authorObj?.name || authorObj?.email || ""),

    authorObj: typeof authorObj === "object" ? authorObj : null,

    subject: p.materia || p.subject,
    tags: Array.isArray(p.tags) ? p.tags : [],

    summary:
      p.summary ||
      p.description ||
      (p.conteudo || p.content
        ? (p.conteudo || p.content).slice(0, 140) + "..."
        : ""),

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
