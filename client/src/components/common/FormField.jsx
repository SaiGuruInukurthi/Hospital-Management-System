export default function FormField({ error, label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small className="field-error">{error.message}</small> : null}
    </label>
  );
}
