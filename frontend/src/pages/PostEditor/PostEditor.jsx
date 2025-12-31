import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PostForm from "../../components/PostForm/PostForm";
import Loading from "../../components/Loading/Loading";
import ErrorState from "../../components/ErrorState/ErrorState";
import ConfirmDialog from "../../components/ConfirmDialogue/ConfirmDialogue";

import { createPost, getPostById, updatePost } from "../../services/posts.service";
import { getMeProfessor } from "../../services/professores.service";

function normalizePostFromApi(post) {
  return {
    title: post?.titulo || post?.title || "",
    content: post?.conteudo || post?.content || "",
    materia: post?.materia || "",
    tags: Array.isArray(post?.tags) ? post.tags : [],
  };
}

// transforma erro do axios (ou outro) em mensagem humana
function getApiErrorMessage(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;

// erros mais comuns do back
  const backendMsg =
    data?.message ||
    data?.error ||
    data?.msg ||
    (Array.isArray(data?.errors) ? data.errors.map((e) => e?.message || e).join(" | ") : null);

  if (status === 400 || status === 422) {
    return backendMsg || "Não foi possível salvar. Verifique os campos e tente novamente.";
  }

  if (status === 401) {
    return "Sua sessão expirou. Faça login novamente.";
  }

  if (status === 403) {
    return "Você não tem permissão para realizar esta ação.";
  }

  if (status === 404) {
    return "Recurso não encontrado. Atualize a página e tente novamente.";
  }

  if (status >= 500) {
    return "Ocorreu um erro no servidor. Tente novamente em alguns minutos.";
  }

  // sem response => provavelmente rede/timeout
  if (!err?.response) {
    return "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";
  }

  return backendMsg || "Algo deu errado. Tente novamente.";
}

export default function PostEditor({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = mode === "edit";

  const [me, setMe] = useState(null);

  const professorId = useMemo(() => me?.id || me?._id || null, [me]);
  const professorName = useMemo(
    () => me?.name || me?.nome || me?.email || "",
    [me]
  );

  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    materia: "",
    tags: [],
    authorName: "",
    authorId: "",
  });

  const [status, setStatus] = useState("loading"); // loading | idle | error
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmSave, setConfirmSave] = useState({
    open: false,
    formPayload: null,
  });

  const closeConfirm = () => setConfirmSave({ open: false, formPayload: null });

  useEffect(() => {
    const load = async () => {
      try {
        setStatus("loading");
        setError(null);

        const meData = await getMeProfessor();
        setMe(meData);

        const baseForm = {
          title: "",
          content: "",
          materia: "",
          tags: [],
          authorName: meData?.name || meData?.nome || meData?.email || "",
          authorId: meData?.id || meData?._id || "",
        };

        if (isEdit) {
          const post = await getPostById(id);
          const postNorm = normalizePostFromApi(post);

          setInitialValues({
            ...baseForm,
            ...postNorm,
          });
        } else {
          setInitialValues(baseForm);
        }

        setStatus("idle");
      } catch (e) {
        setError(getApiErrorMessage(e) || "Falha ao carregar página de edição.");
        setStatus("error");
      }
    };

    load();
  }, [isEdit, id]);

  // validação simples antes de abrir o confirm (evita 400)
  const MIN_CONTENT_LENGTH = 10;

  const validateForm = (formPayload) => {
    const problems = [];

    if (!formPayload?.title?.trim()) {
      problems.push("O título é obrigatório.");
    }

    if (!formPayload?.materia?.trim()) {
      problems.push("A matéria é obrigatória.");
    }

    if (!formPayload?.content?.trim()) {
      problems.push("O conteúdo é obrigatório.");
    } else if (formPayload.content.trim().length < MIN_CONTENT_LENGTH) {
      problems.push(
        `O conteúdo deve ter pelo menos ${MIN_CONTENT_LENGTH} caracteres.`
      );
    }

    if (!professorId) {
      problems.push("Sessão inválida. Faça login novamente.");
    }

    return problems;
  };


  const handleAskToSave = (formPayload) => {
    setError(null);

    const problems = validateForm(formPayload);
    if (problems.length) {
      setError(problems.join(" "));
      return;
    }

    setConfirmSave({ open: true, formPayload });
  };

  const handleConfirmSave = async () => {
    const formPayload = confirmSave.formPayload;
    if (!formPayload) return;

    const payloadForApi = {
      titulo: formPayload.title,
      conteudo: formPayload.content,
      materia: formPayload.materia,
      tags: Array.isArray(formPayload.tags) ? formPayload.tags : [],
      autor: professorId,
    };

    try {
      closeConfirm();
      setIsSubmitting(true);
      setError(null);

      if (isEdit) {
        await updatePost(id, payloadForApi);
      } else {
        await createPost(payloadForApi);
      }

      navigate("/dashboard");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="container py-4" style={{ maxWidth: 900 }}>
        <Loading />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="container py-4" style={{ maxWidth: 900 }}>
        <ErrorState message={error} />
      </main>
    );
  }

  const dialogTitle = isEdit ? "Salvar alterações" : "Criar postagem";
  const dialogMessage = isEdit
    ? "Tem certeza que deseja salvar as alterações deste post?"
    : "Tem certeza que deseja criar esta postagem?";

  return (
    <main className="container py-4" style={{ maxWidth: 900 }}>
      {confirmSave.open ? (
        <ConfirmDialog
          title={dialogTitle}
          message={dialogMessage}
          confirmLabel={isEdit ? "Sim, salvar" : "Sim, criar"}
          cancelLabel="Cancelar"
          variant="primary"
          onConfirm={handleConfirmSave}
          onCancel={closeConfirm}
        />
      ) : null}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="mb-0">{isEdit ? "Editar Postagem" : "Criar Nova Postagem"}</h1>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/dashboard")}
          disabled={isSubmitting}
        >
          ← Voltar
        </button>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          <strong>Não foi possível salvar.</strong>
          <div className="mt-1">{error}</div>
        </div>
      ) : null}

      <PostForm
        initialValues={{
          ...initialValues,
          authorName: professorName || initialValues.authorName,
          authorId: professorId || initialValues.authorId,
        }}
        onSubmit={handleAskToSave}
        isSubmitting={isSubmitting}
        submitLabel={isEdit ? "Salvar alterações" : "Criar postagem"}
      />
    </main>
  );
}
