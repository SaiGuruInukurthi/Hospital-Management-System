const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Ward = require('../models/Ward');

dotenv.config();

const hashPassword = (password) => bcrypt.hash(password, 10);

const daysFromNow = (days, hours = 9, minutes = 0) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required in server/.env before seeding.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    MedicalRecord.deleteMany({}),
    Appointment.deleteMany({}),
    Patient.deleteMany({}),
    Ward.deleteMany({}),
    User.deleteMany({})
  ]);

  const [adminPassword, doctorOnePassword, doctorTwoPassword, doctorThreePassword, nurseOnePassword, nurseTwoPassword, nurseThreePassword] = await Promise.all([
    hashPassword('Admin@123'),
    hashPassword('Doctor@123'),
    hashPassword('Doctor@123'),
    hashPassword('Doctor@123'),
    hashPassword('Nurse@123'),
    hashPassword('Nurse@123'),
    hashPassword('Nurse@123')
  ]);

  const [admin, doctorOne, doctorTwo, doctorThree, nurseOne, nurseTwo, nurseThree] = await User.create([
    {
      name: 'Super Admin',
      email: 'admin@hospital.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1 555 100 0001'
    },
    {
      name: 'Dr. Amina Rahman',
      email: 'amina.rahman@hospital.com',
      password: doctorOnePassword,
      role: 'doctor',
      specialization: 'Cardiology',
      department: 'Cardiology',
      phone: '+1 555 100 0002'
    },
    {
      name: 'Dr. Daniel Lee',
      email: 'daniel.lee@hospital.com',
      password: doctorTwoPassword,
      role: 'doctor',
      specialization: 'Orthopedics',
      department: 'Orthopedics',
      phone: '+1 555 100 0003'
    },
    {
      name: 'Dr. Sofia Patel',
      email: 'sofia.patel@hospital.com',
      password: doctorThreePassword,
      role: 'doctor',
      specialization: 'Internal Medicine',
      department: 'General Medicine',
      phone: '+1 555 100 0006'
    },
    {
      name: 'Nurse Priya Shah',
      email: 'priya.shah@hospital.com',
      password: nurseOnePassword,
      role: 'nurse',
      phone: '+1 555 100 0004'
    },
    {
      name: 'Nurse Olivia Brown',
      email: 'olivia.brown@hospital.com',
      password: nurseTwoPassword,
      role: 'nurse',
      phone: '+1 555 100 0005'
    },
    {
      name: 'Nurse Hassan Ali',
      email: 'hassan.ali@hospital.com',
      password: nurseThreePassword,
      role: 'nurse',
      phone: '+1 555 100 0007'
    }
  ]);

  const [generalWard, surgicalWard, recoveryWard] = await Ward.create([
    {
      name: 'General Ward A',
      capacity: 12,
      nurses: [nurseOne._id],
      description: 'General recovery and short-stay patients.'
    },
    {
      name: 'Surgical Ward B',
      capacity: 8,
      nurses: [nurseTwo._id],
      description: 'Post-operative monitoring and recovery.'
    },
    {
      name: 'Recovery Ward C',
      capacity: 10,
      nurses: [nurseThree._id],
      description: 'Rehabilitation and recovery care.'
    }
  ]);

  await User.findByIdAndUpdate(nurseOne._id, { wardAssigned: generalWard._id });
  await User.findByIdAndUpdate(nurseTwo._id, { wardAssigned: surgicalWard._id });
  await User.findByIdAndUpdate(nurseThree._id, { wardAssigned: recoveryWard._id });

  const [patientOne, patientTwo, patientThree, patientFour, patientFive, patientSix, patientSeven, patientEight, patientNine] = await Patient.create([
    {
      name: 'John Carter',
      dateOfBirth: new Date('1987-03-14'),
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1 555 200 0001',
      email: 'john.carter@example.com',
      address: '12 River Street, Boston',
      registeredBy: nurseOne._id,
      isAdmitted: true,
      ward: generalWard._id
    },
    {
      name: 'Maria Garcia',
      dateOfBirth: new Date('1992-08-02'),
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+1 555 200 0002',
      email: 'maria.garcia@example.com',
      address: '54 Lake Avenue, Chicago',
      registeredBy: nurseOne._id,
      isAdmitted: true,
      ward: generalWard._id
    },
    {
      name: 'Ahmed Khan',
      dateOfBirth: new Date('1979-11-21'),
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+1 555 200 0003',
      email: 'ahmed.khan@example.com',
      address: '88 Sunset Blvd, Dallas',
      registeredBy: nurseTwo._id,
      isAdmitted: true,
      ward: surgicalWard._id
    },
    {
      name: 'Emily Johnson',
      dateOfBirth: new Date('2001-05-09'),
      gender: 'Female',
      bloodGroup: 'AB-',
      phone: '+1 555 200 0004',
      email: 'emily.johnson@example.com',
      address: '73 Pine Road, Seattle',
      registeredBy: nurseTwo._id,
      isAdmitted: false
    },
    {
      name: 'Lily Thompson',
      dateOfBirth: new Date('1998-01-19'),
      gender: 'Female',
      bloodGroup: 'A-',
      phone: '+1 555 200 0005',
      email: 'lily.thompson@example.com',
      address: '9 Harbor Drive, Miami',
      registeredBy: nurseThree._id,
      isAdmitted: true,
      ward: recoveryWard._id
    },
    {
      name: 'Marcus Reed',
      dateOfBirth: new Date('1968-06-30'),
      gender: 'Male',
      bloodGroup: 'B-',
      phone: '+1 555 200 0006',
      email: 'marcus.reed@example.com',
      address: '120 Elm Street, Denver',
      registeredBy: nurseThree._id,
      isAdmitted: true,
      ward: recoveryWard._id
    },
    {
      name: 'Sara Ahmed',
      dateOfBirth: new Date('2000-10-11'),
      gender: 'Female',
      bloodGroup: 'O-',
      phone: '+1 555 200 0007',
      email: 'sara.ahmed@example.com',
      address: '41 Market Street, Austin',
      registeredBy: nurseOne._id,
      isAdmitted: false
    },
    {
      name: 'Noah Wilson',
      dateOfBirth: new Date('1990-12-04'),
      gender: 'Male',
      bloodGroup: 'AB+',
      phone: '+1 555 200 0008',
      email: 'noah.wilson@example.com',
      address: '77 Cedar Lane, Phoenix',
      registeredBy: nurseTwo._id,
      isAdmitted: false
    },
    {
      name: 'Ava Martinez',
      dateOfBirth: new Date('1975-04-28'),
      gender: 'Female',
      bloodGroup: 'B+',
      phone: '+1 555 200 0009',
      email: 'ava.martinez@example.com',
      address: '14 Willow Way, San Diego',
      registeredBy: nurseThree._id,
      isAdmitted: true,
      ward: recoveryWard._id
    }
  ]);

  await Ward.findByIdAndUpdate(generalWard._id, {
    patients: [patientOne._id, patientTwo._id, patientSeven._id]
  });

  await Ward.findByIdAndUpdate(surgicalWard._id, {
    patients: [patientThree._id, patientFour._id, patientEight._id]
  });

  await Ward.findByIdAndUpdate(recoveryWard._id, {
    patients: [patientFive._id, patientSix._id, patientNine._id]
  });

  const [appointmentOne, appointmentTwo, appointmentThree, appointmentFour, appointmentFive, appointmentSix, appointmentSeven, appointmentEight, appointmentNine] = await Appointment.create([
    {
      patient: patientOne._id,
      doctor: doctorOne._id,
      scheduledBy: nurseOne._id,
      dateTime: daysFromNow(0, 10, 0),
      reason: 'Follow-up for chest pain and blood pressure review',
      status: 'Completed',
      notes: 'Blood pressure improved. Continue monitoring and low-sodium diet.'
    },
    {
      patient: patientTwo._id,
      doctor: doctorOne._id,
      scheduledBy: nurseOne._id,
      dateTime: daysFromNow(0, 14, 30),
      reason: 'Initial cardiology consultation',
      status: 'Scheduled'
    },
    {
      patient: patientThree._id,
      doctor: doctorTwo._id,
      scheduledBy: nurseTwo._id,
      dateTime: daysFromNow(1, 11, 0),
      reason: 'Post-surgery pain assessment',
      status: 'In Progress'
    },
    {
      patient: patientFour._id,
      doctor: doctorTwo._id,
      scheduledBy: nurseTwo._id,
      dateTime: daysFromNow(-1, 9, 30),
      reason: 'Knee pain evaluation',
      status: 'Cancelled',
      notes: 'Patient rescheduled due to travel delay.'
    },
    {
      patient: patientFive._id,
      doctor: doctorThree._id,
      scheduledBy: nurseThree._id,
      dateTime: daysFromNow(2, 8, 45),
      reason: 'General wellness follow-up',
      status: 'Scheduled'
    },
    {
      patient: patientSix._id,
      doctor: doctorThree._id,
      scheduledBy: nurseThree._id,
      dateTime: daysFromNow(0, 16, 0),
      reason: 'Medication review after discharge',
      status: 'In Progress'
    },
    {
      patient: patientSeven._id,
      doctor: doctorOne._id,
      scheduledBy: nurseOne._id,
      dateTime: daysFromNow(3, 10, 15),
      reason: 'Heart murmur screening',
      status: 'Scheduled'
    },
    {
      patient: patientEight._id,
      doctor: doctorTwo._id,
      scheduledBy: nurseTwo._id,
      dateTime: daysFromNow(1, 13, 0),
      reason: 'X-ray review and mobility assessment',
      status: 'Scheduled'
    },
    {
      patient: patientNine._id,
      doctor: doctorThree._id,
      scheduledBy: nurseThree._id,
      dateTime: daysFromNow(-2, 11, 30),
      reason: 'Routine checkup',
      status: 'Completed',
      notes: 'Vitals normal. No follow-up required right now.'
    }
  ]);

  await MedicalRecord.create([
    {
      patient: patientOne._id,
      doctor: doctorOne._id,
      appointment: appointmentOne._id,
      diagnosis: 'Hypertension under control',
      prescription: 'Continue amlodipine 5mg once daily',
      notes: 'Recheck blood pressure in two weeks.',
      followUpDate: daysFromNow(14, 9, 0)
    },
    {
      patient: patientThree._id,
      doctor: doctorTwo._id,
      appointment: appointmentThree._id,
      diagnosis: 'Post-operative recovery progressing normally',
      prescription: 'Paracetamol 500mg as needed for pain',
      notes: 'Keep incision clean and monitor for swelling.',
      followUpDate: daysFromNow(7, 9, 0)
    },
    {
      patient: patientFive._id,
      doctor: doctorThree._id,
      appointment: appointmentFive._id,
      diagnosis: 'Post-discharge recovery on track',
      prescription: 'Continue rest, hydration, and vitamin supplement',
      notes: 'Patient advised to return if fever or swelling develops.',
      followUpDate: daysFromNow(10, 9, 0)
    },
    {
      patient: patientSix._id,
      doctor: doctorThree._id,
      appointment: appointmentSix._id,
      diagnosis: 'Medication review completed',
      prescription: 'Maintain current discharge medication plan',
      notes: 'No adverse effects reported.',
      followUpDate: daysFromNow(21, 9, 0)
    },
    {
      patient: patientNine._id,
      doctor: doctorThree._id,
      appointment: appointmentNine._id,
      diagnosis: 'Routine preventive care visit',
      prescription: 'No medication needed',
      notes: 'Maintain healthy diet and exercise schedule.',
      followUpDate: daysFromNow(30, 9, 0)
    },
    {
      patient: patientTwo._id,
      doctor: doctorOne._id,
      appointment: appointmentTwo._id,
      diagnosis: 'Cardiology consultation pending',
      prescription: 'Await appointment outcome',
      notes: 'Initial assessment scheduled.',
      followUpDate: daysFromNow(5, 9, 0)
    }
  ]);

  console.log('Sample data ready: admin, doctors, nurses, wards, patients, appointments, and medical records seeded.');
  console.log('Login accounts:');
  console.log('admin@hospital.com / Admin@123');
  console.log('amina.rahman@hospital.com / Doctor@123');
  console.log('daniel.lee@hospital.com / Doctor@123');
  console.log('sofia.patel@hospital.com / Doctor@123');
  console.log('priya.shah@hospital.com / Nurse@123');
  console.log('olivia.brown@hospital.com / Nurse@123');
  console.log('hassan.ali@hospital.com / Nurse@123');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
