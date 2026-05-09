import { Save, Trash2, Edit2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import DataTable from '../components/common/DataTable';
import FormField from '../components/common/FormField';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import useResource from '../hooks/useResource';
import { bloodGroups, genders } from '../utils/constants';
import { formatDate } from '../utils/format';

export default function PatientsPage() {
  const { user } = useAuth();
  const canWrite = ['admin', 'nurse'].includes(user.role);
  const { data: patients, loading, reload } = useResource('/patients', 'patients');
  const [editingId, setEditingId] = useState(null);
  const { formState: { errors, isSubmitting }, handleSubmit, register, reset } = useForm({
    defaultValues: { gender: 'Male', bloodGroup: 'O+' }
  });

  const onSubmit = async (values) => {
    try {
      if (editingId) {
        await api.put(`/patients/${editingId}`, values);
        toast.success('Patient updated');
        setEditingId(null);
      } else {
        await api.post('/patients', values);
        toast.success('Patient registered');
      }
      reset({ gender: 'Male', bloodGroup: 'O+' });
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || `Could not ${editingId ? 'update' : 'save'} patient`);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    const dateStr = row.dateOfBirth ? new Date(row.dateOfBirth).toISOString().split('T')[0] : '';
    reset({
      name: row.name,
      dateOfBirth: dateStr,
      gender: row.gender,
      bloodGroup: row.bloodGroup,
      phone: row.phone || '',
      email: row.email || '',
      address: row.address || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset({ gender: 'Male', bloodGroup: 'O+' });
  };

  if (loading) return <Loader label="Loading patients" />;

  return (
    <section className={canWrite ? 'split-page' : 'page-stack'}>
      <div className="page-stack">
        <div className="section-heading">
          <p className="eyebrow">Patients</p>
          <h2>Patient registry</h2>
        </div>
        <DataTable
          rows={patients}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'dateOfBirth', header: 'DOB', render: (row) => formatDate(row.dateOfBirth) },
            { key: 'gender', header: 'Gender' },
            { key: 'phone', header: 'Phone' },
            { key: 'bloodGroup', header: 'Blood' },
            { key: 'ward', header: 'Ward', render: (row) => row.ward?.name || '-' },
            {
              key: 'actions',
              header: '',
              render: (row) => canWrite ? (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button className="icon-button" type="button" title="Edit patient" onClick={() => handleEdit(row)}>
                    <Edit2 size={16} />
                  </button>
                  {user.role === 'admin' && (
                    <button className="icon-button danger" type="button" title="Delete patient" onClick={async () => {
                      await api.delete(`/patients/${row._id}`);
                      reload();
                    }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ) : null
            }
          ]}
        />
      </div>

      {canWrite ? (
        <aside className="side-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{editingId ? 'Edit patient' : 'Register patient'}</h3>
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
            <FormField label="Date of birth" error={errors.dateOfBirth}>
              <input type="date" {...register('dateOfBirth', { required: 'Date of birth is required' })} />
            </FormField>
            <FormField label="Gender">
              <select {...register('gender')}>{genders.map((item) => <option key={item}>{item}</option>)}</select>
            </FormField>
            <FormField label="Blood group">
              <select {...register('bloodGroup')}>{bloodGroups.map((item) => <option key={item}>{item}</option>)}</select>
            </FormField>
            <FormField label="Phone" error={errors.phone}>
              <input {...register('phone', { required: 'Phone is required' })} />
            </FormField>
            <FormField label="Email">
              <input type="email" {...register('email')} />
            </FormField>
            <FormField label="Address">
              <textarea rows="3" {...register('address')} />
            </FormField>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              <Save size={18} />
              {isSubmitting ? 'Saving' : (editingId ? 'Save changes' : 'Register patient')}
            </button>
          </form>
        </aside>
      ) : null}
    </section>
  );
}
