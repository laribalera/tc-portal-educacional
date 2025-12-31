import { useEffect, useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import PostList from "../../components/PostList/PostList";
import Loading from "../../components/Loading/Loading";
import ErrorState from "../../components/ErrorState/ErrorState";
import Carousel from "../../components/Carousel/Carousel";
import Heading from "../../components/Headers/Headers";
import Footer from "../../components/Footer/Footer";

import { getPosts, searchPosts } from "../../services/posts.service";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);

  const fetchPosts = async (searchTerm = "") => {
    try {
      setStatus("loading");
      setError(null);

      const data = searchTerm ? await searchPosts(searchTerm) : await getPosts();
      setPosts(Array.isArray(data) ? data : []);
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

  // apenas os 3 últimos posts
  const latestPosts = useMemo(() => {
    return posts.slice(0, 3);
  }, [posts]);

  return (
    <>
      <main style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
        <Carousel />

        <Heading as="h1">Últimas publicações</Heading>

        <p>Confira abaixo os últimos posts publicados por nossos professores e para mais, consulte a seção de publicações.</p>

        {status === "loading" && <Loading />}
        {status === "error" && (
          <ErrorState message={error} onRetry={() => fetchPosts(term)} />
        )}

        {status === "idle" && latestPosts.length === 0 && (
          <p>Nenhum post encontrado.</p>
        )}

        {status === "idle" && latestPosts.length > 0 && (
          <PostList posts={latestPosts} />
        )}
      </main>

      <Footer />
    </>
  );
}
