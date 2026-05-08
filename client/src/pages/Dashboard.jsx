import { Activity, Bed, CalendarDays, ClipboardCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';

const cardsByRole = {
  admin: [
    ['patients', 'Total patients', Users, 'blue'],
    ['staff', 'Total staff', ClipboardCheck, 'green'],
    ['appointmentsToday', 'Appointments today', CalendarDays, 'amber'],
    ['occupiedBeds', 'Occupied beds', Bed, 'red']
  ],
  doctor: [
    ['appointmentsToday', 'Appointments today', CalendarDays, 'blue'],
    ['pendingRecords', 'Pending updates', ClipboardCheck, 'amber'],
    ['patientCount', 'Patients seen', Users, 'green']
  ],
  nurse: [
    ['appointmentsToday', 'Appointments prepped', CalendarDays, 'blue'],
    ['registrations', 'Registrations', Users, 'green'],
    ['wards', 'Assigned wards', Bed, 'amber'],
    ['recordsTouched', 'Records available', Activity, 'red']
  ]
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get(`/stats/${user.role}`)
      .then(({ data }) => setStats(data))
      .catch((error) => toast.error(error.response?.data?.message || 'Could not load dashboard'));
  }, [user.role]);

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Today</p>
        <h2>{user.name}'s dashboard</h2>
      </div>
      <div className="stats-grid">
        {(cardsByRole[user.role] || []).map(([key, label, Icon, tone]) => (
          <StatCard key={key} label={label} value={Array.isArray(stats[key]) ? stats[key].length : stats[key]} icon={Icon} tone={tone} />
        ))}
      </div>
    </section>
  );
}
