import { BedDouble, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Loader from '../../components/common/Loader';
import useResource from '../../hooks/useResource';

export default function WardManagement() {
  const { data: wards, loading, reload } = useResource('/wards', 'wards');
  const [nurses, setNurses] = useState([]);
  const createForm = useForm();
  const assignForm = useForm();

  useEffect(() => {
    api.get('/staff')
      .then(({ data }) => setNurses((data.staff || []).filter((item) => item.role === 'nurse')))
      .catch(() => toast.error('Could not load nurses'));
  }, []);

  const createWard = async (values) => {
    try {
      await api.post('/wards', values);
      toast.success('Ward created');
      createForm.reset();
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create ward');
    }
  };

  const assignNurse = async (values) => {
    try {
      await api.put(`/wards/${values.wardId}/assign-nurse`, { nurseId: values.nurseId });
      toast.success('Nurse assigned');
      assignForm.reset();
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not assign nurse');
    }
  };

  if (loading) return <Loader label="Loading wards" />;

  return (
    <section className="split-page">
      <div className="page-stack">
        <div className="section-heading">
          <p className="eyebrow">Admin</p>
          <h2>Ward management</h2>
        </div>
        <DataTable
          rows={wards}
          columns={[
            { key: 'name', header: 'Ward' },
            { key: 'capacity', header: 'Capacity' },
            { key: 'patients', header: 'Patients', render: (row) => `${row.patients?.length || 0}/${row.capacity}` },
            { key: 'nurses', header: 'Nurses', render: (row) => row.nurses?.map((nurse) => nurse.name).join(', ') || '-' },
            { key: 'description', header: 'Description', render: (row) => row.description || '-' }
          ]}
        />
      </div>

      <aside className="side-panel">
        <h3>Create ward</h3>
        <form className="form-grid" onSubmit={createForm.handleSubmit(createWard)}>
          <FormField label="Name">
            <input {...createForm.register('name', { required: true })} />
          </FormField>
          <FormField label="Capacity">
            <input type="number" min="1" {...createForm.register('capacity', { required: true, valueAsNumber: true })} />
          </FormField>
          <FormField label="Description">
            <textarea rows="2" {...createForm.register('description')} />
          </FormField>
          <button className="primary-button" type="submit" disabled={createForm.formState.isSubmitting}>
            <BedDouble size={18} />
            Create ward
          </button>
        </form>

        <hr />
        <h3>Assign nurse</h3>
        <form className="form-grid" onSubmit={assignForm.handleSubmit(assignNurse)}>
          <FormField label="Ward">
            <select {...assignForm.register('wardId', { required: true })}>
              <option value="">Select ward</option>
              {wards.map((ward) => <option key={ward._id} value={ward._id}>{ward.name}</option>)}
            </select>
          </FormField>
          <FormField label="Nurse">
            <select {...assignForm.register('nurseId', { required: true })}>
              <option value="">Select nurse</option>
              {nurses.map((nurse) => <option key={nurse._id} value={nurse._id}>{nurse.name}</option>)}
            </select>
          </FormField>
          <button className="secondary-button" type="submit" disabled={assignForm.formState.isSubmitting}>
            <UserCheck size={18} />
            Assign nurse
          </button>
        </form>
      </aside>
    </section>
  );
}
