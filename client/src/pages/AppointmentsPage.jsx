import { CalendarPlus, FilePlus2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import DataTable from '../components/common/DataTable';
import FormField from '../components/common/FormField';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import useResource from '../hooks/useResource';
import { appointmentStatuses } from '../utils/constants';
import { formatDateTime } from '../utils/format';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const endpoint = user.role === 'doctor' ? '/appointments/my' : '/appointments';
  const { data: appointments, loading, reload } = useResource(endpoint, 'appointments');
  const [lookups, setLookups] = useState({ doctors: [], patients: [] });
  const canBook = ['admin', 'nurse'].includes(user.role);
  const canWriteRecord = user.role === 'doctor';
  const appointmentForm = useForm();
  const recordForm = useForm();

  useEffect(() => {
    if (!canBook) return;

    Promise.all([api.get('/patients'), api.get('/staff/doctors')])
      .then(([patientsResponse, doctorsResponse]) => {
        setLookups({
          patients: patientsResponse.data.patients || [],
          doctors: doctorsResponse.data.doctors || []
        });
      })
      .catch(() => toast.error('Could not load booking options'));
  }, [canBook]);

  const updateStatus = async (appointment, status) => {
    await api.put(`/appointments/${appointment._id}/status`, { status });
    reload();
  };

  const bookAppointment = async (values) => {
    try {
      await api.post('/appointments', values);
      toast.success('Appointment booked');
      appointmentForm.reset();
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not book appointment');
    }
  };

  const addRecord = async (values) => {
    try {
      await api.post('/records', values);
      toast.success('Medical record added');
      recordForm.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add medical record');
    }
  };

  if (loading) return <Loader label="Loading appointments" />;

  return (
    <section className={(canBook || canWriteRecord) ? 'split-page' : 'page-stack'}>
      <div className="page-stack">
        <div className="section-heading">
          <p className="eyebrow">Appointments</p>
          <h2>{user.role === 'doctor' ? 'My appointments' : 'Appointment overview'}</h2>
        </div>
        <DataTable
          rows={appointments}
          columns={[
            { key: 'patient', header: 'Patient', render: (row) => row.patient?.name || '-' },
            { key: 'doctor', header: 'Doctor', render: (row) => row.doctor?.name || '-' },
            { key: 'dateTime', header: 'When', render: (row) => formatDateTime(row.dateTime) },
            { key: 'reason', header: 'Reason' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            {
              key: 'actions',
              header: 'Update',
              render: (row) => (
                <select value={row.status} onChange={(event) => updateStatus(row, event.target.value)}>
                  {appointmentStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              )
            }
          ]}
        />
      </div>

      {canBook ? (
        <aside className="side-panel">
          <h3>Book appointment</h3>
          <form className="form-grid" onSubmit={appointmentForm.handleSubmit(bookAppointment)}>
            <FormField label="Patient">
              <select {...appointmentForm.register('patient', { required: true })}>
                <option value="">Select patient</option>
                {lookups.patients.map((patient) => <option key={patient._id} value={patient._id}>{patient.name}</option>)}
              </select>
            </FormField>
            <FormField label="Doctor">
              <select {...appointmentForm.register('doctor', { required: true })}>
                <option value="">Select doctor</option>
                {lookups.doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}
              </select>
            </FormField>
            <FormField label="Date and time">
              <input type="datetime-local" {...appointmentForm.register('dateTime', { required: true })} />
            </FormField>
            <FormField label="Reason">
              <textarea rows="3" {...appointmentForm.register('reason', { required: true })} />
            </FormField>
            <button className="primary-button" type="submit" disabled={appointmentForm.formState.isSubmitting}>
              <CalendarPlus size={18} />
              Book appointment
            </button>
          </form>
        </aside>
      ) : null}

      {canWriteRecord ? (
        <aside className="side-panel">
          <h3>Add medical record</h3>
          <form className="form-grid" onSubmit={recordForm.handleSubmit(addRecord)}>
            <FormField label="Patient">
              <select {...recordForm.register('patient', { required: true })}>
                <option value="">Select from appointments</option>
                {appointments.map((appointment) => (
                  <option key={appointment._id} value={appointment.patient?._id}>{appointment.patient?.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Diagnosis">
              <input {...recordForm.register('diagnosis', { required: true })} />
            </FormField>
            <FormField label="Prescription">
              <textarea rows="3" {...recordForm.register('prescription')} />
            </FormField>
            <FormField label="Notes">
              <textarea rows="3" {...recordForm.register('notes')} />
            </FormField>
            <FormField label="Follow-up date">
              <input type="date" {...recordForm.register('followUpDate')} />
            </FormField>
            <button className="primary-button" type="submit" disabled={recordForm.formState.isSubmitting}>
              <FilePlus2 size={18} />
              Add record
            </button>
          </form>
        </aside>
      ) : null}
    </section>
  );
}
