import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import useResource from '../../hooks/useResource';

export default function StaffManagement() {
  const { data: staff, loading, reload } = useResource('/staff', 'staff');
  const { formState: { errors, isSubmitting }, handleSubmit, register, reset, watch } = useForm({
    defaultValues: { role: 'doctor' }
  });
  const role = watch('role');

  const onSubmit = async (values) => {
    try {
      await api.post('/staff', values);
      toast.success('Staff account created');
      reset({ role: 'doctor' });
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create staff account');
    }
  };

  if (loading) return <Loader label="Loading staff" />;

  return (
    <section className="split-page">
      <div className="page-stack">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Staff management</h2>
        </div>
        <DataTable
          rows={staff}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role' },
            { key: 'department', header: 'Department', render: (row) => row.department || row.specialization || '-' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <button className="ghost-button" type="button" onClick={async () => {
                  await api.put(`/staff/${row._id}/status`);
                  reload();
                }}>
                  Toggle
                </button>
              )
            }
          ]}
        />
      </div>

      <aside className="side-panel">
        <h3>Create staff</h3>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" error={errors.name}>
            <input {...register('name', { required: 'Name is required' })} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input type="email" {...register('email', { required: 'Email is required' })} />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} />
          </FormField>
          <FormField label="Role">
            <select {...register('role')}>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
            </select>
          </FormField>
          {role === 'doctor' ? (
            <>
              <FormField label="Specialization">
                <input {...register('specialization')} />
              </FormField>
              <FormField label="Department">
                <input {...register('department')} />
              </FormField>
            </>
          ) : null}
          <FormField label="Phone">
            <input {...register('phone')} />
          </FormField>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            <UserPlus size={18} />
            {isSubmitting ? 'Creating' : 'Create account'}
          </button>
        </form>
      </aside>
    </section>
  );
}
