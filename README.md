# MediCore HMS

MERN hospital management MVP with role-based dashboards for Admin, Doctor, and Nurse users.

## Prerequisites Checked

- Node.js and npm are required.
- MongoDB is accessed through `server/.env` using `MONGO_URI`.
- Local `mongod`/`mongosh` are optional when using MongoDB Atlas.

## Setup

Full setup documentation:

- [General setup guide](Docs/General_Setup.md)
- [MongoDB setup guide](Docs/MongoDB_Setup.md)

```bash
npm run install:all
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Update `server/.env` with your MongoDB connection string and JWT secret.

Seed the first admin:

```bash
npm run seed --prefix server
```

This now seeds a full demo dataset: admin, doctors, nurses, wards, patients, appointments, and medical records.

Run the apps in two terminals:

```bash
cd server
npm run dev

cd client
npm run dev
```

Default URLs:

- API: `http://localhost:5000/api`
- Client: `http://localhost:5173`

Seeded admin credentials:

- Email: `admin@hospital.com`
- Password: `Admin@123`

Sample staff accounts:

- Doctor: `amina.rahman@hospital.com` / `Doctor@123`
- Doctor: `daniel.lee@hospital.com` / `Doctor@123`
- Nurse: `priya.shah@hospital.com` / `Nurse@123`
- Nurse: `olivia.brown@hospital.com` / `Nurse@123`
