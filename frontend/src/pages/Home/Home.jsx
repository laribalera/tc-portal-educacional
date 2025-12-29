import { useEffect, useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import PostList from "../../components/PostList/PostList";
import Loading from "../../components/Loading/Loading";
import ErrorState from "../../components/ErrorState/ErrorState";
import Carousel from "../../components/Carousel/Carousel";
import Button from "../../components/Button/Button";
import Pagination from "../../components/Pagination/Pagination";
import Heading from "../../components/Headers/Headers";

import { getPosts, searchPosts } from "../../services/posts.service";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);

  // paginação
  const PAGE_SIZE = 3;
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  }, [posts.length]);

  const visiblePosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return posts.slice(start, start + PAGE_SIZE);
  }, [posts, page]);

  const fetchPosts = async (searchTerm = "") => {
    try {
      setStatus("loading");
      setError(null);

      const data = searchTerm ? await searchPosts(searchTerm) : await getPosts();

      setPosts(Array.isArray(data) ? data : []);
      setPage(1); // sempre volta para a 1ª página ao carregar/buscar
      setStatus("idle");
    } catch (e) {
      setError(e?.message || "Falha ao carregar posts.");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchPosts("");
  }, []);

  const handleSearch = (value) => {
    setTerm(value);
    fetchPosts(value);
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <main style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <Carousel />
      <Heading as="h1">Últimas publicações</Heading>


      <div style={{ margin: "12px 0 20px" }}>
        <SearchBar value={term} onChange={setTerm} onSearch={handleSearch} />
      </div>

      {status === "loading" ? <Loading /> : null}
      {status === "error" ? (
        <ErrorState message={error} onRetry={() => fetchPosts(term)} />
      ) : null}

      {status === "idle" && posts.length === 0 ? <p>Nenhum post encontrado.</p> : null}

      {status === "idle" && posts.length > 0 ? (
        <>
          <PostList posts={visiblePosts} />

          {/* Paginação */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={goPrev}
            onNext={goNext}
          />

        </>
      ) : null}
    </main>
  );
}
