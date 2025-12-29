import "./Headers.css";

export default function Headers({ as = "h1", children, className = "" }) {
  const Tag = as;

  return (
    <Tag className={`headers headers-${as} ${className}`}>
      {children}
    </Tag>
  );
}
