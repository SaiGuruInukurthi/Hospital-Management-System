function buildPath(values = [], width = 120, height = 36, pad = 4) {
  if (!values || values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (width - pad * 2) / (values.length - 1 || 1);
  return values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

export default function StatCard({ icon: Icon, label, value, tone = 'blue', spark = [] }) {
  const display = value ?? 0;
  const path = buildPath(spark.length ? spark : [0, 1, 2, 1, 3, 2, 4], 120, 36, 4);

  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-left">
        <div className="stat-icon">
          {Icon ? <Icon size={22} aria-hidden="true" /> : null}
        </div>
        <div className="stat-text">
          <span>{label}</span>
          <strong>{display}</strong>
        </div>
      </div>
      <div className="stat-right">
        <svg className="stat-spark" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden>
          <path d={path} fill="none" strokeWidth="2" className="spark-path" />
        </svg>
      </div>
    </article>
  );
}
