export default function ErrorState({ title = "Ocorreu um erro", message, onRetry }) {
  return (
    <div role="alert" style={{ border: "1px solid #f2c2c2", padding: 16, borderRadius: 8 }}>
      <strong>{title}</strong>
      {message ? <p style={{ marginTop: 8 }}>{message}</p> : null}
      {onRetry ? (
        <button style={{ marginTop: 8 }} onClick={onRetry} type="button">
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
