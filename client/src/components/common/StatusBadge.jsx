const toneByStatus = {
  Scheduled: 'badge-blue',
  'In Progress': 'badge-amber',
  Completed: 'badge-green',
  Cancelled: 'badge-red',
  active: 'badge-green',
  inactive: 'badge-red'
};

export default function StatusBadge({ value }) {
  return <span className={`status-badge ${toneByStatus[value] || 'badge-gray'}`}>{value}</span>;
}
