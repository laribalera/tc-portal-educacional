import { Link } from "react-router-dom";
import "./PostCard.css";

export default function PostCard({ post }) {
  return (
    <article className="card card-border h-100 d-flex flex-column">
      <div className="card-body d-flex flex-column flex-grow-1">
        <h3 className="card-title">
          <Link to={`/posts/${post.id}`} className="text-decoration-none card-title-link">
            {post.title}
          </Link>
        </h3>

        <p className="card-text mb-2 opacity-75">
          <strong>Autor:</strong> {post.author}
        </p>

        <p className="card-text card-summary">
          {post.summary || post.description || "Sem descrição"}
        </p>

        <div className="mt-auto pt-3">
          <Link to={`/posts/${post.id}`} className="btn card-button w-100">
            Ler post
          </Link>
        </div>
      </div>
    </article>
  );
}
