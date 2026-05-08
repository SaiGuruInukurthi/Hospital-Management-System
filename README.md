# MediCore HMS

MERN hospital management MVP with role-based dashboards for Admin, Doctor, and Nurse users.

## Prerequisites Checked

- Node.js and npm are required.
- MongoDB is accessed through `server/.env` using `MONGO_URI`.
- Local `mongod`/`mongosh` are optional when using MongoDB Atlas.

## Setup

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

Run the apps in two terminals:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

Default URLs:

- API: `http://localhost:5000/api`
- Client: `http://localhost:5173`

Seeded admin credentials:

- Email: `admin@hospital.com`
- Password: `Admin@123`
