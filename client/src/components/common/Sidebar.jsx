import { NavLink } from 'react-router-dom';
import { navByRole } from '../../utils/constants';

export default function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <div className="brand-mark">
        <span>MC</span>
        <div>
          <strong>MediCore</strong>
          <small>Hospital ops</small>
        </div>
      </div>
      <nav aria-label="Primary">
        {(navByRole[role] || []).map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path} end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
