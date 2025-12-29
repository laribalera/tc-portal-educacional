export default function Headers({
  as = "h2",
  children,
  className = "",
}) {
  const Tag = as;

  // se não tiver conteúdo, não renderiza
  if (children === null || children === undefined) return null;

  return (
    <Tag className={className}>
      {children}
    </Tag>
  );
}
