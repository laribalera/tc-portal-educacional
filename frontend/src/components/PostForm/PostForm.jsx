import { useEffect, useMemo, useRef, useState } from "react";

function toTagsArray(text) {
  return String(text || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function toTagsText(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join(", ");
}

export default function PostForm({ initialValues, onSubmit, isSubmitting, submitLabel }) {
  const initializedRef = useRef(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [materia, setMateria] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [authorName, setAuthorName] = useState("");

  // inicializa o form UMA VEZ (ou quando muda de post) pra evitar perdas de dados
  useEffect(() => {
    if (initializedRef.current) return;

    setTitle(initialValues?.title || "");
    setContent(initialValues?.content || "");
    setMateria(initialValues?.materia || "");
    setTagsText(toTagsText(initialValues?.tags || []));
    setAuthorName(initialValues?.authorName || "");

    initializedRef.current = true;
  }, [initialValues]);

  const tagsArray = useMemo(() => toTagsArray(tagsText), [tagsText]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      content,
      materia,
      tags: tagsArray,
      authorId: initialValues?.authorId,
      authorName,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Autor</label>
        <input value={authorName} disabled readOnly />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Matéria</label>
        <input value={materia} onChange={(e) => setMateria(e.target.value)} required />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Tags</label>
        <input
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="Separe por vírgula"
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Conteúdo</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
