import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import Loader from './components/common/Loader';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import LoginPage from './pages/auth/LoginPage';
import StaffManagement from './pages/admin/StaffManagement';
import WardManagement from './pages/admin/WardManagement';
import WardView from './pages/nurse/WardView';
import PatientsPage from './pages/PatientsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { roleHome } from './utils/constants';

function HomeRedirect() {
  const { booting, isAuthenticated, user } = useAuth();
  if (booting) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome[user.role]} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/patients" element={<PatientsPage />} />
          <Route path="/admin/appointments" element={<AppointmentsPage />} />
          <Route path="/admin/wards" element={<WardManagement />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['doctor']} />}>
        <Route element={<AppLayout />}>
          <Route path="/doctor" element={<Dashboard />} />
          <Route path="/doctor/appointments" element={<AppointmentsPage />} />
          <Route path="/doctor/patients" element={<PatientsPage />} />
          <Route path="/doctor/patients/:id" element={<PatientsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['nurse']} />}>
        <Route element={<AppLayout />}>
          <Route path="/nurse" element={<Dashboard />} />
          <Route path="/nurse/patients" element={<PatientsPage />} />
          <Route path="/nurse/patients/register" element={<PatientsPage />} />
          <Route path="/nurse/appointments" element={<AppointmentsPage />} />
          <Route path="/nurse/appointments/new" element={<AppointmentsPage />} />
          <Route path="/nurse/ward" element={<WardView />} />
        </Route>
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
