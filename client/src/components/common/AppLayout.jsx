import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar role={user?.role} />
      <main className="main-panel">
        <Navbar />
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
