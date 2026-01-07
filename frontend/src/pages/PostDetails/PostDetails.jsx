import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "../../components/Loading/Loading";
import ErrorState from "../../components/ErrorState/ErrorState";
import Headers from "../../components/Headers/Headers";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

import { getPostById } from "../../services/posts.service";

import "./PostDetails.css";

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pt-BR");
}

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    try {
      setStatus("loading");
      setError(null);

      const data = await getPostById(id);
      setPost(data);
      setStatus("idle");
    } catch (e) {
      setError(e?.message || "Falha ao carregar post.");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (status === "loading") {
    return (
      <main className="container py-4 post-details">
        <Loading />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="container py-4 post-details">
        <ErrorState message={error} onRetry={fetchPost} />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container py-4 post-details">
        <p>Post não encontrado.</p>
      </main>
    );
  }

  const created = formatDate(post.createdAt);
  const updated = formatDate(post.updatedAt);
  const postTitle = post.title ?? post.titulo ?? "Sem título";
  const postAuthor = post.author ?? post.autor?.name ?? post.autor ?? "Não informado";

  return (
    <main className="container py-4 post-details">
      <div className="post-details__header">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Publicações", to: "/posts" },
            { label: postTitle },
          ]}
        />

        <div className="post-details__title">
          <Headers level="h1">{postTitle}</Headers>
        </div>
      </div>



      <div className="post-details__title">
        <Headers level="h1" text={postTitle} />
      </div>

      <p className="post-details__author">
        Autor: <strong>{postAuthor}</strong>
      </p>

      <article className="post-details__content">{post.content}</article>

      <footer className="post-details__footer">
        <div className="post-details__dates">
          {created && <span className="post-details__date">Criado em: {created}</span>}
          {updated && <span className="post-details__date">Atualizado em: {updated}</span>}
        </div>
      </footer>
    </main>
  );
}
