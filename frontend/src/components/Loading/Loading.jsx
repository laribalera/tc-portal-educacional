export default function Loading({ label = "Carregando..." }) {
  return <p aria-busy="true">{label}</p>;
}
