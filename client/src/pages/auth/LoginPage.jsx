import { Building2, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../context/AuthContext';
import { roleHome } from '../../utils/constants';

export default function LoginPage() {
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { formState: { errors, isSubmitting }, handleSubmit, register } = useForm({
    defaultValues: { email: 'admin@hospital.com', password: 'Admin@123' }
  });

  if (isAuthenticated) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}`);
      navigate(location.state?.from?.pathname || roleHome[data.user.role], { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="login-screen">
      <section className="login-panel" aria-label="Login">
        <div className="login-brand">
          <div className="brand-icon"><Building2 size={30} /></div>
          <div>
            <p className="eyebrow">MediCore HMS</p>
            <h1>Staff sign in</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          <FormField label="Email" error={errors.email}>
            <input type="email" {...register('email', { required: 'Email is required' })} />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input type="password" {...register('password', { required: 'Password is required' })} />
          </FormField>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            <LogIn size={18} />
            {isSubmitting ? 'Signing in' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
