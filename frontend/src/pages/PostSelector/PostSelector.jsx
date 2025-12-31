import { useEffect, useMemo, useState } from "react";
import PostCard from "../../components/PostCard/PostCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Loading from "../../components/Loading/Loading";
import ErrorState from "../../components/ErrorState/ErrorState";
import Pagination from "../../components/Pagination/Pagination";
import { getPosts, searchPosts } from "../../services/posts.service";
import "./PostSelector.css";

function normalizeTag(t) {
    return String(t || "").trim();
}

export default function PostSelector() {
    const PAGE_SIZE = 12;

    const [tagsOpen, setTagsOpen] = useState(true);

    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | idle | error
    const [error, setError] = useState(null);

    const [term, setTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [page, setPage] = useState(1);

    async function fetchPosts(searchTerm = "") {
        try {
            setStatus("loading");
            setError(null);

            const data = searchTerm ? await searchPosts(searchTerm) : await getPosts();
            setPosts(data || []);
            setStatus("idle");
        } catch (e) {
            setError(e?.message || "Falha ao carregar posts.");
            setStatus("error");
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    // tags disponíveis (a partir dos posts carregdos)
    const tags = useMemo(() => {
        const map = new Map(); // tag -> count
        for (const p of posts || []) {
            const arr = Array.isArray(p?.tags) ? p.tags : [];
            for (const raw of arr) {
                const tag = normalizeTag(raw);
                if (!tag) continue;
                map.set(tag, (map.get(tag) || 0) + 1);
            }
        }
        // ordena por quantidade desc e depois alfabética
        return Array.from(map.entries())
            .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0], "pt-BR"))
            .map(([name, count]) => ({ name, count }));
    }, [posts]);

    // aplica filtro por tag
    const filteredPosts = useMemo(() => {
        if (!selectedTag) return posts || [];
        const tag = normalizeTag(selectedTag).toLowerCase();

        return (posts || []).filter((p) => {
            const arr = Array.isArray(p?.tags) ? p.tags : [];
            return arr.some((t) => normalizeTag(t).toLowerCase() === tag);
        });
    }, [posts, selectedTag]);

    // paginação calculada sobr os posts filtrados
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil((filteredPosts?.length || 0) / PAGE_SIZE));
    }, [filteredPosts, PAGE_SIZE]);

    const visiblePosts = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return (filteredPosts || []).slice(start, start + PAGE_SIZE);
    }, [filteredPosts, page, PAGE_SIZE]);

    // se o filtro reduzir o total de páginas, garante page vlida
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    const handleSearch = async (q) => {
        const nextTerm = String(q || "").trim();
        setTerm(nextTerm);
        setSelectedTag(null); 
        setPage(1);
        await fetchPosts(nextTerm);
    };

    const handleSelectTag = (tag) => {
        setSelectedTag((prev) => (prev === tag ? null : tag)); // toggle
        setPage(1);
    };

    const clearFilters = () => {
        setSelectedTag(null);
        setPage(1);
    };

    const handlePageChange = (nextPage) => {
        const p = Math.max(1, Math.min(totalPages, Number(nextPage) || 1));
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container py-4">
            <h1 className="mb-3">Publicações</h1>

            <SearchBar
                placeholder="Buscar por título, tag ou professor..."
                onSearch={handleSearch}
            />

            {status === "loading" && <Loading />}
            {status === "error" && <ErrorState message={error} />}

            {status === "idle" && (
                <>
                    <div className="pe-posts-layout mt-3">
                        {/* Quadro de tags */}
                        <aside className="pe-tags">
                            <div className="pe-tags__header">
                                <button
                                    type="button"
                                    className="pe-tags__toggle"
                                    onClick={() => setTagsOpen((v) => !v)}
                                    aria-expanded={tagsOpen}
                                    aria-controls="pe-tags-panel"
                                    title={tagsOpen ? "Recolher tags" : "Expandir tags"}
                                >
                                    <span className="pe-tags__title">Tags</span>
                                    <span className={`pe-tags__chevron ${tagsOpen ? "is-open" : ""}`} aria-hidden="true">
                                        ▾
                                    </span>
                                </button>

                                {selectedTag && (
                                    <button
                                        type="button"
                                        className="pe-tags__clear"
                                        onClick={clearFilters}
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>

                            <div
                                id="pe-tags-panel"
                                className={`pe-tags__panel ${tagsOpen ? "is-open" : ""}`}
                            >
                                {tags.length === 0 ? (
                                    <p className="pe-tags__empty">Nenhuma tag disponível.</p>
                                ) : (
                                    <div className="pe-tags__list" role="list">
                                        {tags.map((t) => (
                                            <button
                                                key={t.name}
                                                type="button"
                                                className={`pe-tag ${selectedTag === t.name ? "is-active" : ""}`}
                                                onClick={() => handleSelectTag(t.name)}
                                                title={`Ver posts com a tag "${t.name}"`}
                                            >
                                                <span className="pe-tag__name">{t.name}</span>
                                                <span className="pe-tag__count">{t.count}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </aside>


                        {/* Lista de posts */}
                        <main className="pe-posts">
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="opacity-75">
                                    {term ? (
                                        <>Resultados para: <strong>{term}</strong></>
                                    ) : (
                                        <>Todos os posts</>
                                    )}
                                    {selectedTag ? (
                                        <>
                                            {" "}· Filtrando por: <strong>{selectedTag}</strong>
                                        </>
                                    ) : null}
                                </small>

                                <small className="opacity-75">
                                    {filteredPosts.length} post(s) · Página{" "}
                                    <strong>{page}</strong> de <strong>{totalPages}</strong>
                                </small>
                            </div>

                            {filteredPosts.length === 0 ? (
                                <div className="mt-4">
                                    <ErrorState message="Nenhum post encontrado com os filtros atuais." />
                                </div>
                            ) : (
                                <>
                                    <div className="row g-3 mt-2">
                                        {visiblePosts.map((post) => (
                                            <div key={post.id} className="col-12 col-md-6 col-lg-4">
                                                <PostCard post={post} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 d-flex justify-content-center">
                                        <Pagination
                                            page={page}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </>
                            )}
                        </main>
                    </div>
                </>
            )}
        </div>
    );
}
