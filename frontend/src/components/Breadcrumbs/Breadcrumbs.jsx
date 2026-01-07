import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

/**
 * items: [{ label: "Home", to: "/" }, { label: "Posts", to: "/posts" }, { label: "Detalhes" }]
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="breadcrumb" className="app-breadcrumbs">
      <ol className="breadcrumb mb-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li
              key={`${item.label}-${idx}`}
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {!isLast && item.to ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
