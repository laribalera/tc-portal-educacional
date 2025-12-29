import "./Button.css";

export default function Button({
  children,
  variant = "outline-secondary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
