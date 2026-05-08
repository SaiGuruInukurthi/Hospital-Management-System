import DataTable from '../../components/common/DataTable';
import Loader from '../../components/common/Loader';
import useResource from '../../hooks/useResource';

export default function WardView() {
  const { data: wards, loading } = useResource('/wards', 'wards');

  if (loading) return <Loader label="Loading ward" />;

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Nurse</p>
        <h2>Assigned ward</h2>
      </div>
      <DataTable
        rows={wards}
        empty="No ward assigned yet"
        columns={[
          { key: 'name', header: 'Ward' },
          { key: 'capacity', header: 'Capacity' },
          { key: 'patients', header: 'Patients', render: (row) => row.patients?.map((patient) => patient.name).join(', ') || '-' },
          { key: 'description', header: 'Description', render: (row) => row.description || '-' }
        ]}
      />
    </section>
  );
}
