export default function StatCard({ icon: Icon, label, value, tone = 'blue' }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">
        {Icon ? <Icon size={22} aria-hidden="true" /> : null}
      </div>
      <div>
        <span>{label}</span>
        <strong>{value ?? 0}</strong>
      </div>
    </article>
  );
}
