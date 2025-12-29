import { useEffect, useMemo, useState } from "react";
import Loading from "../../components/Loading/Loading";
import ErrorState from "../../components/ErrorState/ErrorState";
import Headers from "../../components/Headers/Headers";
import ProfessoresAccordion from "../../components/ProfessoresAccordion/ProfessoresAccordion";
import { getPosts } from "../../services/posts.service";

function autorKey(post) {
  // com teu service atualizado, p.autor deve existir (objeto ou com _id)
  return post?.autor?._id || post?.autor?.id || "sem-autor";
}

export default function Professores() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        setStatus("loading");
        setError(null);
        const data = await getPosts();
        setPosts(data || []);
        setStatus("idle");
      } catch (e) {
        setError(e?.message || "Falha ao carregar posts.");
        setStatus("error");
      }
    }
    fetch();
  }, []);

  const professores = useMemo(() => {
    const map = new Map();

    for (const p of posts) {
      const key = autorKey(p);
      const autor = p.autor || null;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: autor?.name || "Sem autor",
          disciplinas: autor?.disciplinas || [],
          posts: [],
        });
      }
      map.get(key).posts.push(p);
    }

    const out = Array.from(map.values()).map((prof) => {
      const sorted = [...prof.posts].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      return { ...prof, posts: sorted.slice(0, 10) };
    });

    out.sort((a, b) => (a.name || "").localeCompare(b.name || "", "pt-BR"));
    return out;
  }, [posts]);

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorState message={error} />;

  return (
    <section className="container py-4">
      <Headers as="h1">Professores</Headers>

      <p className="text-muted mb-4">
       Confira abaixo todos os professores cadastrados no portal, junto com seus últimos posts publicados.
      </p>

      <ProfessoresAccordion professores={professores} defaultOpenIndex={0} />
    </section>
  );
}
