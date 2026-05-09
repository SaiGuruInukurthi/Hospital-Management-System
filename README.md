# MediCore HMS

MERN hospital management MVP with role-based dashboards for Admin, Doctor, and Nurse users.

## Features

- Admin dashboard with patient, staff, appointment, and ward statistics.
- Staff management for creating, editing, activating/deactivating, and deleting doctor or nurse accounts.
- Patient registration and management with role-based access.
- Appointment scheduling and status tracking.
- Doctor medical records and nurse ward workflows.

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

## Vercel deployment

Deploy the frontend and backend as separate Vercel projects:

```bash
cd client
vercel --prod

cd ../server
vercel --prod
```

Backend environment variables in Vercel:

- `MONGO_URI` - your MongoDB Atlas connection string
- `JWT_SECRET` - a long random secret used for auth tokens
- `CLIENT_URL` - the deployed frontend URL on Vercel
- `NODE_ENV=production`

Frontend environment variables in Vercel:

- `VITE_API_URL` - set this to `/api` so the frontend calls go through the Vercel rewrite and stay same-origin

If you want the deployed app to have demo data, run the seed script against the same MongoDB Atlas database before or after deployment:

```bash
npm run seed --prefix server
```
