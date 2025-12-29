import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../ConfirmDialogue/ConfirmDialogue";

export default function PostActions({ id, onDelete, disabled = false }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const confirmDelete = () => {
    close();
    onDelete?.(id);
  };

  return (
    <>
      <div className="btn-group">
        <Link
          className={`btn btn-outline-secondary btn-sm ${disabled ? "disabled" : ""}`}
          to={`/posts/${id}/edit`}
          aria-disabled={disabled ? "true" : "false"}
          tabIndex={disabled ? -1 : 0}
        >
          Editar
        </Link>

        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          Excluir
        </button>
      </div>

      {open && (
        <ConfirmDialog
          title="Excluir postagem"
          message="Tem certeza que deseja excluir esta postagem? Essa ação não pode ser desfeita."
          confirmLabel="Sim, excluir"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={close}
        />
      )}
    </>
  );
}
