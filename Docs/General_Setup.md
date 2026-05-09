# General Setup Guide

This guide explains how to set up and run the MediCore HMS MERN application from a fresh checkout.

## Project Structure

```text
MERN-internship-Project/
  client/      React + Vite frontend
  server/      Express + MongoDB backend
  Docs/        Project documentation
```

## Prerequisites

Install these before running the project:

- Node.js 18 or newer
- npm 9 or newer
- MongoDB Atlas account or local MongoDB
- Git, if cloning from a repository

Verify Node and npm:

```powershell
node -v
npm -v
```

Verify whether MongoDB local tools are installed:

```powershell
mongod --version
mongosh --version
```

Local MongoDB tools are optional if you use MongoDB Atlas.

## Install Dependencies

From the project root:

```powershell
npm run install:all
```

Or install each app separately:

```powershell
npm install --prefix server
npm install --prefix client
```

## Configure Environment Files

### Backend

Create `server/.env`:

```powershell
copy server\.env.example server\.env
```

Set these values:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/hospital_db?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Notes:

- `MONGO_URI` is required for the API to start.
- `JWT_SECRET` should be long, random, and private.
- `CLIENT_URL` must match the frontend URL for CORS.

### Frontend

Create `client/.env`:

```powershell
copy client\.env.example client\.env
```

Set:

```env
VITE_API_URL=http://localhost:5000/api
```

## Seed the Admin User

After `server/.env` is configured:

```powershell
npm run seed --prefix server
```

This seeds a complete demo dataset for the app: admin, doctors, nurses, wards, patients, appointments, and medical records.

Default admin:

```text
Email: admin@hospital.com
Password: Admin@123
```

Sample staff logins:

```text
Doctor: amina.rahman@hospital.com / Doctor@123
Doctor: daniel.lee@hospital.com / Doctor@123
Nurse: priya.shah@hospital.com / Nurse@123
Nurse: olivia.brown@hospital.com / Nurse@123
```

Use this account only for development. Change or remove it before production.

## Run the Application

Open two terminals.

Terminal 1, backend:

```powershell
cd server
npm run dev
```

Backend URL:

```text
http://localhost:5000/api
```

Terminal 2, frontend:

```powershell
cd client
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Verify the Setup

### 1. Check installed packages

```powershell
npm list express --prefix server
npm list mongoose --prefix server
npm list react --prefix client
```

### 2. Check the backend health route

Start the backend, then open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "MediCore HMS API"
}
```

### 3. Check the frontend build

```powershell
npm run build --prefix client
```

Expected result:

```text
vite build
... built ...
```

### 4. Login flow

1. Open `http://localhost:5173`.
2. Sign in with the seeded admin account.
3. Confirm that the Admin dashboard loads.

## Main Scripts

From the project root:

```powershell
npm run install:all
npm run dev:server
npm run dev:client
npm run build
```

From `server/`:

```powershell
npm run dev
npm run start
npm run seed
```

If you run the backend from inside `server/`, do not add `--prefix server` again. That makes npm look for `server/server/package.json` and triggers the `ENOENT` error you saw.

From `client/`:

```powershell
npm run dev
npm run build
npm run preview
```

## Development Workflow

1. Start MongoDB Atlas or local MongoDB.
2. Start the backend.
3. Start the frontend.
4. Login as admin.
5. Create doctor and nurse accounts.
6. Register patients.
7. Create appointments.
8. Login as doctor or nurse to test role-based pages.

## Troubleshooting

### Port already in use

If `5000` or `5173` is already in use, stop the existing process or change the port.

Backend port:

```env
PORT=5001
```

Frontend API URL:

```env
VITE_API_URL=http://localhost:5001/api
```

### Frontend cannot reach API

Check:

- Backend is running.
- `client/.env` has the correct `VITE_API_URL`.
- `server/.env` has `CLIENT_URL=http://localhost:5173`.
- Restart both apps after changing `.env` files.

### Login fails

Check:

- Admin seed ran successfully.
- You are using `admin@hospital.com` and `Admin@123`.
- Backend is connected to the same MongoDB database that was seeded.

### Backend exits immediately

Most common causes:

- Missing `server/.env`.
- Missing or invalid `MONGO_URI`.
- Atlas network access does not include your IP address.
- Wrong Atlas database username or password.

## Production Notes

Before deployment:

- Use a strong production `JWT_SECRET`.
- Use a restricted Atlas IP access list when possible.
- Set `CLIENT_URL` to the deployed frontend URL.
- Set `VITE_API_URL` to the deployed backend URL plus `/api`.
- Do not commit `.env` files.
- Change or remove the seeded admin credentials.

## Related Docs

- MVP specification: [MVP.md](./MVP.md)
- MongoDB setup: [MongoDB_Setup.md](./MongoDB_Setup.md)
