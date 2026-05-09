# 🏥 Hospital Management System — MVP Specification
> **Stack:** MongoDB · Express.js · React.js · Node.js  
> **Internship Assignment:** ISAII MERN Stack Developer Internship  
> **Roles:** Admin · Doctor · Nurse  
> **Architecture:** Separate Frontend & Backend  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Core Features (MVP Scope)](#5-core-features-mvp-scope)
6. [Data Models (MongoDB Schemas)](#6-data-models-mongodb-schemas)
7. [Backend — API Design](#7-backend--api-design)
8. [Frontend — Pages & Components](#8-frontend--pages--components)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Environment Variables](#10-environment-variables)
11. [Development Setup](#11-development-setup)
12. [Deployment Guide](#12-deployment-guide)
13. [MVP Milestone Checklist](#13-mvp-milestone-checklist)
14. [Out of Scope (Post-MVP)](#14-out-of-scope-post-mvp)

---

## 1. Project Overview

A role-based Hospital Management System that allows hospital staff to manage patients, appointments, staff records, and medical notes through a clean web interface. Each role has a dedicated dashboard with relevant permissions.

| Property | Detail |
|---|---|
| Project Name | MediCore HMS |
| Type | Web Application |
| Auth Strategy | JWT (Access Token) + Role-based middleware |
| API Style | RESTful |
| Database | MongoDB Atlas (Cloud) |
| Frontend Hosting | Vercel |
| Backend Hosting | Vercel |

---

## 2. Repository Structure

```
hospital-management-system/
│
├── client/                          # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios instance & API calls
│   │   ├── assets/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Navbar, Sidebar, Modal, Table, Loader
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   └── nurse/
│   │   ├── context/                 # AuthContext (global user state)
│   │   ├── hooks/                   # Custom hooks (useAuth, useFetch)
│   │   ├── pages/
│   │   │   ├── auth/                # Login
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── doctor/              # Doctor dashboard pages
│   │   │   └── nurse/               # Nurse dashboard pages
│   │   ├── routes/                  # Protected route wrappers
│   │   ├── utils/                   # Formatters, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   ├── staffController.js
│   │   └── medicalRecordController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── roleMiddleware.js        # Role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   └── Ward.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── staffRoutes.js
│   │   └── medicalRecordRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 3. Tech Stack & Dependencies

### Backend (`server/`)

| Package | Purpose |
|---|---|
| `express` | HTTP server & routing |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT creation & verification |
| `bcryptjs` | Password hashing |
| `dotenv` | Environment variable management |
| `cors` | Cross-origin resource sharing |
| `express-validator` | Request validation |
| `morgan` | HTTP request logging |
| `nodemon` (dev) | Auto-restart on file changes |

```bash
# Install backend dependencies
cd server
npm install express mongoose jsonwebtoken bcryptjs dotenv cors express-validator morgan
npm install --save-dev nodemon
```

### Frontend (`client/`)

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI library |
| `react-router-dom` v6 | Client-side routing |
| `axios` | HTTP client |
| `tailwindcss` | Utility-first styling |
| `@headlessui/react` | Accessible UI components |
| `react-hook-form` | Form state management |
| `react-hot-toast` | Toast notifications |
| `date-fns` | Date formatting |
| `lucide-react` | Icon library |

```bash
# Install frontend dependencies
cd client
npm create vite@latest . -- --template react
npm install react-router-dom axios react-hook-form react-hot-toast date-fns lucide-react @headlessui/react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 4. User Roles & Permissions

### Permission Matrix

| Feature | Admin | Doctor | Nurse |
|---|:---:|:---:|:---:|
| Login / Logout | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| Create staff accounts | ✅ | ❌ | ❌ |
| View all staff | ✅ | ❌ | ❌ |
| Edit staff accounts | ✅ | ❌ | ❌ |
| Deactivate staff | ✅ | ❌ | ❌ |
| Delete staff accounts | ✅ | ❌ | ❌ |
| Register patient | ✅ | ❌ | ✅ |
| View all patients | ✅ | ✅ | ✅ |
| Edit patient info | ✅ | ❌ | ✅ |
| Delete patient | ✅ | ❌ | ❌ |
| Create appointment | ✅ | ❌ | ✅ |
| View appointments | ✅ | ✅ (own) | ✅ |
| Update appointment status | ✅ | ✅ | ✅ |
| Add medical record/notes | ❌ | ✅ | ❌ |
| View medical records | ✅ | ✅ | ✅ (limited) |
| Assign nurse to ward | ✅ | ❌ | ❌ |
| View ward assignments | ✅ | ❌ | ✅ (own) |
| View dashboard analytics | ✅ | ✅ | ✅ |

---

## 5. Core Features (MVP Scope)

### 5.1 Authentication Module
- Single login page for all roles — role is determined from the JWT payload
- JWT stored in `localStorage`
- Protected routes on frontend via `PrivateRoute` wrapper
- Auto-redirect to role-specific dashboard on login

### 5.2 Admin Features
- **Dashboard:** Total patients, total staff (Doctors + Nurses), appointments today, ward occupancy count
- **Staff Management:** Create Doctor/Nurse accounts, edit staff details, view all staff, toggle active/inactive status, and delete staff accounts with confirmation
- **Patient Management:** View all patients, delete patient records
- **Appointment Overview:** View all appointments across all doctors, filter by date/doctor/status
- **Ward Management:** Create wards, assign nurses to wards

### 5.3 Doctor Features
- **Dashboard:** Today's appointment count, recent patients, pending notes
- **My Appointments:** View appointments assigned to self, update status (`Scheduled` → `In Progress` → `Completed` / `Cancelled`)
- **Patient View:** View patient profile and full medical history
- **Medical Records:** Add consultation notes, diagnosis, prescription, and follow-up date to a patient record

### 5.4 Nurse Features
- **Dashboard:** Assigned ward info, today's appointments to prep, recent patient registrations
- **Patient Registration:** Register new patients (name, DOB, gender, contact, blood group, address)
- **Appointment Scheduling:** Book new appointments (select patient, doctor, date/time, reason)
- **Patient Management:** View and update patient contact/address information
- **Ward View:** See which ward they are assigned to and who the current patients are

---

## 6. Data Models (MongoDB Schemas)

### 6.1 User (Staff)

```javascript
// server/models/User.js
const UserSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },  // bcrypt hashed
  role:           { type: String, enum: ['admin', 'doctor', 'nurse'], required: true },
  specialization: { type: String },                  // Doctor only
  department:     { type: String },                  // Doctor only
  wardAssigned:   { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' }, // Nurse only
  phone:          { type: String },
  isActive:       { type: Boolean, default: true },
}, { timestamps: true });
```

### 6.2 Patient

```javascript
// server/models/Patient.js
const PatientSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup:  { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
  phone:       { type: String, required: true },
  email:       { type: String },
  address:     { type: String },
  registeredBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Nurse who registered
  isAdmitted:  { type: Boolean, default: false },
  ward:        { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
}, { timestamps: true });
```

### 6.3 Appointment

```javascript
// server/models/Appointment.js
const AppointmentSchema = new mongoose.Schema({
  patient:      { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Nurse
  dateTime:     { type: Date, required: true },
  reason:       { type: String, required: true },
  status:       {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  notes:        { type: String },                    // Doctor's notes post-appointment
}, { timestamps: true });
```

### 6.4 MedicalRecord

```javascript
// server/models/MedicalRecord.js
const MedicalRecordSchema = new mongoose.Schema({
  patient:      { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment:  { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  diagnosis:    { type: String, required: true },
  prescription: { type: String },
  notes:        { type: String },
  followUpDate: { type: Date },
}, { timestamps: true });
```

### 6.5 Ward

```javascript
// server/models/Ward.js
const WardSchema = new mongoose.Schema({
  name:        { type: String, required: true },     // e.g. "General Ward A"
  capacity:    { type: Number, required: true },
  nurses:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  patients:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  description: { type: String },
}, { timestamps: true });
```

---

## 7. Backend — API Design

**Base URL:** `http://localhost:5000/api`

---

### Auth Routes `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Login with email + password, returns JWT |
| GET | `/me` | Private | Get logged-in user profile |
| PUT | `/me` | Private | Update own profile |

---

### Staff Routes `/api/staff`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | Create a new Doctor or Nurse account |
| GET | `/` | Admin | Get all staff members |
| GET | `/:id` | Admin | Get single staff member |
| PUT | `/:id` | Admin | Update staff account details |
| PUT | `/:id/status` | Admin | Toggle active/inactive |
| DELETE | `/:id` | Admin | Delete staff account |
| GET | `/doctors` | Admin, Nurse | Get all active doctors (for appointment scheduling) |

---

### Patient Routes `/api/patients`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin, Nurse | Register a new patient |
| GET | `/` | All roles | Get all patients (paginated) |
| GET | `/:id` | All roles | Get single patient |
| PUT | `/:id` | Admin, Nurse | Update patient information |
| DELETE | `/:id` | Admin | Delete patient record |

---

### Appointment Routes `/api/appointments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin, Nurse | Book a new appointment |
| GET | `/` | Admin | Get all appointments |
| GET | `/my` | Doctor | Get appointments for logged-in doctor |
| GET | `/:id` | All roles | Get single appointment detail |
| PUT | `/:id/status` | Admin, Doctor, Nurse | Update appointment status |
| DELETE | `/:id` | Admin | Cancel/delete appointment |

---

### Medical Record Routes `/api/records`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Doctor | Add a medical record |
| GET | `/patient/:patientId` | Admin, Doctor, Nurse | Get all records for a patient |
| GET | `/:id` | Admin, Doctor | Get single record |
| PUT | `/:id` | Doctor | Update own medical record |

---

### Ward Routes `/api/wards`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | Create a ward |
| GET | `/` | Admin, Nurse | Get all wards |
| GET | `/:id` | Admin, Nurse | Get single ward detail |
| PUT | `/:id/assign-nurse` | Admin | Assign nurse to ward |
| PUT | `/:id/admit-patient` | Admin, Nurse | Admit patient to ward |

---

### Stats Route `/api/stats`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin` | Admin | Total patients, staff, today's appointments, ward data |
| GET | `/doctor` | Doctor | Today's appointments, pending records, patient count |
| GET | `/nurse` | Nurse | Today's appointments, ward assignments |

---

### Sample Controller — Auth Login

```javascript
// server/controllers/authController.js
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isActive)
      return res.status(401).json({ message: 'Invalid credentials or account inactive' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### Sample Middleware — Role Guard

```javascript
// server/middleware/roleMiddleware.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};
```

---

## 8. Frontend — Pages & Components

### 8.1 Route Map

```
/login                          → LoginPage (public)

/admin                          → AdminDashboard
/admin/staff                    → StaffManagement (create, edit, activate/deactivate, delete)
/admin/patients                 → PatientList (admin view)
/admin/appointments             → AllAppointments
/admin/wards                    → WardManagement

/doctor                         → DoctorDashboard
/doctor/appointments            → MyAppointments
/doctor/appointments/:id        → AppointmentDetail + Add Record
/doctor/patients/:id            → PatientProfile (with records)

/nurse                          → NurseDashboard
/nurse/patients                 → PatientList
/nurse/patients/register        → RegisterPatientForm
/nurse/patients/:id             → PatientProfile (edit contact info)
/nurse/appointments             → AppointmentList
/nurse/appointments/new         → BookAppointmentForm
/nurse/ward                     → MyWardView
```

### 8.2 Shared Components

| Component | Description |
|---|---|
| `<Navbar />` | Top bar with user name, role badge, logout |
| `<Sidebar />` | Role-specific nav links |
| `<ProtectedRoute />` | Redirects to `/login` if no token |
| `<RoleRoute role="admin" />` | Redirects if role mismatch |
| `<DataTable />` | Reusable paginated table with search |
| `<StatCard />` | Dashboard metric card |
| `<Modal />` | Generic confirm/form modal |
| `<StatusBadge />` | Color-coded status pill |
| `<Loader />` | Full-screen loading spinner |

### 8.3 Auth Context

```javascript
// client/src/context/AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 8.4 Axios Instance

```javascript
// client/src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

## 9. Authentication & Authorization

### Flow

```
User submits login form
       ↓
POST /api/auth/login
       ↓
Server verifies email + password (bcrypt)
       ↓
Server signs JWT { id, role } with secret (8h expiry)
       ↓
Client stores token in localStorage
       ↓
AuthContext stores { user, role }
       ↓
React Router renders role-specific layout/routes
       ↓
Every API request: Authorization: Bearer <token>
       ↓
authMiddleware.js verifies token → attaches req.user
       ↓
roleMiddleware.js checks req.user.role against route requirements
```

### JWT Payload Structure

```json
{
  "id": "64f3a...",
  "role": "doctor",
  "iat": 1712000000,
  "exp": 1712028800
}
```

---

## 10. Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=<paste-your-atlas-connection-string-here>
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Vercel (client) — Environment Variables

| Key | Value |
|---|---|
| `VITE_API_URL` | `/api` when using the client rewrite, or `https://your-backend.vercel.app/api` when calling the API directly |

### Vercel (server) — Environment Variables

| Key | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your secret key |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |

---

## 11. Development Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account (free tier is fine)

### Step-by-step

```bash
# 1. Clone the repo
git clone https://github.com/your-username/hospital-management-system.git
cd hospital-management-system

# 2. Setup Backend
cd server
npm install
cp .env.example .env        # Fill in your MONGO_URI and JWT_SECRET
node scripts/seed.js        # (Optional) Seed an admin user
npm run dev                 # Starts on http://localhost:5000

# 3. Setup Frontend (new terminal)
cd client
npm install
cp .env.example .env        # Set VITE_API_URL=http://localhost:5000/api
npm run dev                 # Starts on http://localhost:5173
```

### Seed Script — Create Initial Admin

```javascript
// server/scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashed = await bcrypt.hash('Admin@123', 10);
  await User.create({
    name: 'Super Admin',
    email: 'admin@hospital.com',
    password: hashed,
    role: 'admin',
  });
  console.log('Admin seeded: admin@hospital.com / Admin@123');
  process.exit(0);
}

seed();
```

---

## 12. Deployment Guide

### Backend → Vercel

1. Add production environment variables in the Vercel project: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV=production`.
2. Deploy from the backend folder:

```bash
cd server
vercel --prod
```

The backend exposes Express through `server/api/index.js`, with API routes mounted under `/api`.

### Frontend → Vercel

1. Add `VITE_API_URL=/api` if using the frontend rewrite, or set it to the deployed backend URL plus `/api`.
2. Deploy from the frontend folder:

```bash
cd client
vercel --prod
```

The frontend uses Vite and the `client/vercel.json` rewrite can proxy `/api/*` requests to the deployed backend.

### CORS Configuration

```javascript
// server/app.js
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
```

---

## 13. MVP Milestone Checklist

### Phase 1 — Foundation (Day 1)
- [ ] Initialize both `client/` and `server/` folders
- [ ] Setup MongoDB Atlas cluster and connect via Mongoose
- [ ] Create all 5 data models (User, Patient, Appointment, MedicalRecord, Ward)
- [ ] Implement auth routes (login, /me)
- [ ] JWT middleware + role middleware
- [ ] Seed initial admin account
- [ ] Setup Vite + React + Tailwind in client
- [ ] Build login page + AuthContext + Axios instance
- [ ] Implement ProtectedRoute + RoleRoute

### Phase 2 — Core Backend (Day 1–2)
- [ ] Patient CRUD routes + controllers
- [ ] Appointment routes + controllers
- [ ] Staff management CRUD routes (Admin)
- [ ] Medical Records routes (Doctor)
- [ ] Ward routes (Admin)
- [ ] Stats endpoints for all 3 roles

### Phase 3 — Core Frontend (Day 2–3)
- [ ] Shared layout: Navbar + Sidebar (role-aware)
- [ ] Admin Dashboard (stat cards)
- [ ] Admin: Staff management page with create, edit, activate/deactivate, and delete actions
- [ ] Admin: Appointments overview table
- [ ] Admin: Ward management
- [ ] Doctor Dashboard
- [ ] Doctor: My Appointments + status update
- [ ] Doctor: Patient profile + add medical record form
- [ ] Nurse Dashboard
- [ ] Nurse: Register patient form
- [ ] Nurse: Book appointment form
- [ ] Nurse: Ward view

### Phase 4 — Polish & Deploy (Day 3)
- [ ] Error handling (toast notifications for API errors)
- [ ] Form validation (react-hook-form)
- [ ] Loading states on all data fetches
- [ ] Responsive layout for all pages
- [ ] Deploy backend to Vercel
- [ ] Deploy frontend to Vercel
- [ ] Test all 3 role flows end-to-end on live URLs
- [ ] Update README with GitHub + Vercel links

---

## 14. Out of Scope (Post-MVP)

The following features are intentionally excluded from the MVP to meet the 24-hour deadline. They can be added in future iterations:

| Feature | Reason Deferred |
|---|---|
| Forgot password / OTP reset | Requires email service (Nodemailer/SendGrid) |
| File uploads (X-rays, reports) | Requires cloud storage (Cloudinary/S3) |
| Real-time notifications | Requires WebSocket (Socket.io) |
| Billing & invoicing module | High complexity |
| Bed/room tracking | Needs UI overhaul |
| Doctor availability / schedule | Complex calendar logic |
| Audit logs | Nice-to-have |
| Dark mode toggle | UI polish |
| Export to PDF/CSV | Post-MVP quality-of-life |
| Multi-hospital / multi-branch | Architecture change needed |

---

> **Built for ISAII MERN Stack Developer Internship**  
> Questions? Reach out at hr@isaii.in
