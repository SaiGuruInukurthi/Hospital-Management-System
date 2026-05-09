import { UserPlus, Save, X, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  const [editingId, setEditingId] = useState(null);
  
  const { formState: { errors, isSubmitting }, handleSubmit, register, reset, watch, setValue } = useForm({
    defaultValues: { role: 'doctor' }
  });
  const role = watch('role');

  const onSubmit = async (values) => {
    try {
      if (editingId) {
        await api.put(`/staff/${editingId}`, values);
        toast.success('Staff account updated');
        setEditingId(null);
      } else {
        await api.post('/staff', values);
        toast.success('Staff account created');
      }
      reset({ role: 'doctor' });
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || `Could not ${editingId ? 'update' : 'create'} staff account`);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    reset({
      name: row.name,
      email: row.email,
      role: row.role,
      specialization: row.specialization || '',
      department: row.department || '',
      phone: row.phone || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset({ role: 'doctor' });
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="icon-button" type="button" onClick={() => handleEdit(row)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="ghost-button" type="button" onClick={async () => {
                    await api.put(`/staff/${row._id}/status`);
                    reload();
                  }}>
                    Toggle
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>

      <aside className="side-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{editingId ? 'Edit staff' : 'Create staff'}</h3>
          {editingId && (
            <button className="icon-button" type="button" onClick={cancelEdit} title="Cancel">
              <X size={20} />
            </button>
          )}
        </div>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" error={errors.name}>
            <input {...register('name', { required: 'Name is required' })} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input type="email" {...register('email', { required: 'Email is required' })} />
          </FormField>
          {!editingId && (
            <FormField label="Password" error={errors.password}>
              <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} />
            </FormField>
          )}
          <FormField label="Role">
            <select {...register('role')} disabled={editingId ? true : false}>
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
            {editingId ? <Save size={18} /> : <UserPlus size={18} />}
            {isSubmitting ? (editingId ? 'Saving' : 'Creating') : (editingId ? 'Save changes' : 'Create account')}
          </button>
        </form>
      </aside>
    </section>
  );
}
