import { useEffect, useRef } from "react";
import "./ConfirmDialogue.css";

export default function ConfirmDialog({
  title = "Confirmar",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    confirmBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onCancel]);

  return (
    <div
      className="confirm-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <header className="confirm-header">
          <strong>{title}</strong>

          <button
            type="button"
            className="confirm-close"
            onClick={onCancel}
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>

        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <footer className="confirm-footer">
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`btn btn-${variant}`}
            onClick={onConfirm}
            ref={confirmBtnRef}
          >
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
