import { Link } from "react-router-dom";
import "./ProfessoresAccordion.css";


function safeDomId(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "");
}

export default function ProfessoresAccordion({ professores, defaultOpenIndex = 0, accordionId = "professoresAccordion" }) {
  if (!professores?.length) {
    return <p className="text-muted mb-0">Nenhum professor encontrado.</p>;
  }

  return (
    <div className="accordion" id={accordionId}>
      {professores.map((prof, index) => {
        const safeId = safeDomId(prof.id);
        const collapseId = `collapse-${safeId}`;
        const headingId = `heading-${safeId}`;

        const disciplinasTxt =
          prof.disciplinas?.length ? prof.disciplinas.join(", ") : "Sem disciplina";

        const isOpen = index === defaultOpenIndex;

        return (
          <div className="accordion-item" key={prof.id}>
            <h2 className="accordion-header" id={headingId}>
              <button
                className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${collapseId}`}
                aria-expanded={isOpen ? "true" : "false"}
                aria-controls={collapseId}
              >
                <span style={{ fontWeight: 700 }}>{prof.name}</span>
                <span className="ms-2 text-muted">— {disciplinasTxt}</span>
              </button>
            </h2>

            <div
              id={collapseId}
              className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
              aria-labelledby={headingId}
              data-bs-parent={`#${accordionId}`}
            >
              <div className="accordion-body">
                <div className="fw-semibold mb-2">Últimos posts</div>

                {prof.posts?.length ? (
                  <ul className="list-group">
                    {prof.posts.map((post) => (
                      <li
                        key={post.id}
                        className="list-group-item d-flex justify-content-between align-items-start"
                      >
                        <div className="me-3">
                          <div className="fw-semibold">
                            <Link to={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
                              {post.titulo || post.title || "Sem título"}
                            </Link>
                          </div>

                          <div className="text-muted small">
                            {(post.materia || post.subject) ? `Matéria: ${post.materia || post.subject}` : ""}
                            {post.tags?.length ? ` • ${post.tags.join(", ")}` : ""}
                          </div>
                        </div>

                        <span className="text-muted small">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString("pt-BR")
                            : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted">Esse professor ainda não tem posts.</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
