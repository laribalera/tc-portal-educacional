import Button from "../Button/Button";

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  className = "",
  showWhenSinglePage = false,
}) {
  if (!showWhenSinglePage && totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const handlePrev = () => {
    if (isFirst) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (isLast) return;
    onPageChange(page + 1);
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center gap-3 mt-3 ${className}`}
    >
      <Button
        type="button"
        variant="outline-secondary"
        onClick={handlePrev}
        disabled={isFirst}
      >
        Anterior
      </Button>

      <span>
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <Button
        type="button"
        variant="outline-secondary"
        onClick={handleNext}
        disabled={isLast}
      >
        Próxima
      </Button>
    </div>
  );
}
