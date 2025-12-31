import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading/Loading";
import ErrorState from "../../components/ErrorState/ErrorState";
import Headers from "../../components/Headers/Headers";
import ConfirmDialog from "../../components/ConfirmDialogue/ConfirmDialogue";

import { getPosts, deletePost } from "../../services/posts.service";
import { getMeProfessor } from "../../services/professores.service";

import "./Dashboard.css";

function getAutorId(post) {
  return post?.autor?._id || post?.autor?.id || post?.autor;
}

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [me, setMe] = useState(null);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // controle do dialog
  const [confirm, setConfirm] = useState({
    open: false,
    postId: null,
    title: "",
  });

  const openConfirm = (postId, title) => {
    setConfirm({
      open: true,
      postId,
      title: title || "esta postagem",
    });
  };

  const closeConfirm = () => {
    setConfirm({ open: false, postId: null, title: "" });
  };

  const fetchAll = async () => {
    try {
      setStatus("loading");
      setError(null);

      const [meData, postsData] = await Promise.all([getMeProfessor(), getPosts()]);
      setMe(meData);
      setPosts(postsData || []);

      setStatus("idle");
    } catch (e) {
      setError(e?.message || "Falha ao carregar dados do dashboard.");
      setStatus("error");
    }
  };

  const meusPosts = useMemo(() => {
    const myId = me?.id || me?._id;
    if (!myId) return [];
    return posts.filter((p) => String(getAutorId(p)) === String(myId));
  }, [posts, me]);

  const tagsUsadas = useMemo(() => {
    const counts = new Map();

    for (const post of meusPosts || []) {
      const tags = Array.isArray(post?.tags) ? post.tags : [];
      for (const t of tags) {
        const tag = String(t || "").trim();
        if (!tag) continue;
        const key = tag.toLowerCase();
        counts.set(key, { label: tag, count: (counts.get(key)?.count || 0) + 1 });
      }
    }

    return Array.from(counts.values()).sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label)
    );
  }, [meusPosts]);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      await fetchAll();
    } catch (e) {
      alert(e?.message || "Falha ao excluir post.");
    }
  };

  const handleConfirmDelete = async () => {
    const id = confirm.postId;
    if (!id) return;

    closeConfirm();
    await handleDelete(id);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const total = String(meusPosts?.length ?? 0);

  return (
    <main className="dashboard container py-4">
      {/* MODAL CONFIRMAÇÃO */}
      {confirm.open ? (
        <ConfirmDialog
          title="Excluir postagem"
          message={`Tem certeza que deseja excluir "${confirm.title}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Sim, excluir"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={closeConfirm}
        />
      ) : null}

      <div className="dashboard__topbar">
        <Headers as="h1">Dashboard do Professor</Headers>

        <Link className="btn" to="/posts/new">
          Criar nova postagem
        </Link>
      </div>

      <section className="dashboard__stats card shadow-sm">
        <div className="card-body d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div>
            <p className="dashboard__kpiLabel mb-1">Total de postagens</p>
            <div className="dashboard__kpiValue">
              <Headers as="h1">{total}</Headers>
            </div>
          </div>
        </div>

        <div className="card-body">
          <p className="dashboard__kpiLabel mb-1">Tags utilizadas</p>

          {tagsUsadas.length === 0 ? (
            <p className="text-body-secondary mb-0">
              Você ainda não usou tags em postagens.
            </p>
          ) : (
            <div className="dashboard__tagsCloud mt-2">
              {tagsUsadas.map((t) => (
                <span key={t.label.toLowerCase()} className="dashboard__tag">
                  <span className="dashboard__tagText">{t.label}</span>
                  <span className="dashboard__tagCount">{t.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {status === "loading" ? <Loading /> : null}
      {status === "error" ? <ErrorState message={error} onRetry={fetchAll} /> : null}

      {status === "idle" && meusPosts.length === 0 ? (
        <div className="alert alert-info mt-3">
          Nenhuma postagem encontrada para este professor.
        </div>
      ) : null}

      {status === "idle" && meusPosts.length > 0 ? (
        <section className="card shadow-sm mt-3">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {meusPosts.map((p) => {
                    const id = p.id || p._id;
                    const titulo = p.titulo || p.title || "Sem título";

                    return (
                      <tr key={id}>
                        <td>{titulo}</td>

                        <td className="text-end">
                          <div className="btn-group">
                            <Link
                              className="btn btn-outline-secondary btn-sm"
                              to={`/posts/${id}/edit`}
                            >
                              Editar
                            </Link>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => openConfirm(id, titulo)}
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
