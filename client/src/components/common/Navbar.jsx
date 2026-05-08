import { LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">MediCore HMS</p>
        <h1>{user?.role ? `${user.role[0].toUpperCase()}${user.role.slice(1)} Workspace` : 'Workspace'}</h1>
      </div>
      <div className="user-strip">
        <UserCircle size={22} aria-hidden="true" />
        <div>
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>
        <button className="icon-button" type="button" onClick={handleLogout} title="Logout" aria-label="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
