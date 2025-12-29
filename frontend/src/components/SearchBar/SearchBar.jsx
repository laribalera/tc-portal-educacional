import { useState, useEffect } from "react";
import Button from "../../components/Button/Button";

export default function SearchBar({ value = "", onChange, onSearch }) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(local.trim());
  };

  return (
    <form onSubmit={submit} className="d-flex gap-2">
      <input
        className="form-control"
        placeholder="Buscar posts..."
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange?.(e.target.value);
        }}
      />
      <Button variant="outline-secondary" type="submit">
        Buscar
      </Button>
    </form>
  );
}
