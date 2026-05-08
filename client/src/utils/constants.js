import {
  Activity,
  Bed,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Stethoscope,
  Users
} from 'lucide-react';

export const roleHome = {
  admin: '/admin',
  doctor: '/doctor',
  nurse: '/nurse'
};

export const navByRole = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Staff', path: '/admin/staff', icon: Stethoscope },
    { label: 'Patients', path: '/admin/patients', icon: Users },
    { label: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
    { label: 'Wards', path: '/admin/wards', icon: Bed }
  ],
  doctor: [
    { label: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
    { label: 'Appointments', path: '/doctor/appointments', icon: CalendarDays },
    { label: 'Patient Records', path: '/doctor/patients', icon: ClipboardList }
  ],
  nurse: [
    { label: 'Dashboard', path: '/nurse', icon: LayoutDashboard },
    { label: 'Patients', path: '/nurse/patients', icon: Users },
    { label: 'Appointments', path: '/nurse/appointments', icon: CalendarDays },
    { label: 'Ward', path: '/nurse/ward', icon: Activity }
  ]
};

export const appointmentStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const genders = ['Male', 'Female', 'Other'];
