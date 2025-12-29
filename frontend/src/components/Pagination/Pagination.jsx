import Button from "../Button/Button";

export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  className = "",
  showWhenSinglePage = false,
}) {
  if (!showWhenSinglePage && totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div
      className={`d-flex justify-content-center align-items-center gap-3 mt-3 ${className}`}
    >
      <Button variant="outline-secondary" onClick={onPrev} disabled={isFirst}>
        Anterior
      </Button>

      <span>
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <Button variant="outline-secondary" onClick={onNext} disabled={isLast}>
        Próxima
      </Button>
    </div>
  );
}
