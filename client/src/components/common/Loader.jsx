export default function Loader({ label = 'Loading workspace' }) {
  return (
    <div className="loader-screen">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
