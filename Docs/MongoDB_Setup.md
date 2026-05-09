# MongoDB Setup Guide

This project uses MongoDB through Mongoose in the Express backend. The backend reads the database connection from `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
```

The recommended setup is MongoDB Atlas because it works without installing MongoDB locally.

## Option 1: MongoDB Atlas

### 1. Create an Atlas account

1. Go to <https://www.mongodb.com/atlas>.
2. Create an account or sign in.
3. Create a new project, for example `MediCore HMS`.

### 2. Create a cluster

1. In the Atlas project, create a database deployment.
2. Choose the free/shared tier if this is for internship or local testing.
3. Pick the cloud provider and region closest to you.
4. Wait until the cluster is created.

### 3. Create a database user

1. Open `Database Access`.
2. Click `Add New Database User`.
3. Choose password authentication.
4. Create a username and strong password.
5. Give the user read/write access for this project.

Keep this username and password. They are used in `MONGO_URI`.

### 4. Allow network access

1. Open `Network Access`.
2. Click `Add IP Address`.
3. For local development, add your current IP address.
4. Save the rule.

Avoid using `0.0.0.0/0` for long-term projects because it allows connections from anywhere. If you need it temporarily for quick testing, use a strong database password and remove the rule afterward.

### 5. Copy the connection string

1. Open `Database`.
2. Click `Connect` on your cluster.
3. Choose `Drivers`.
4. Select Node.js as the driver.
5. Copy the `mongodb+srv://...` connection string.

It will look similar to this:

```env
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

For this app, add a database name before the query string:

```env
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hospital_db?retryWrites=true&w=majority
```

Replace:

- `<username>` with your Atlas database username.
- `<password>` with your Atlas database password.
- `cluster0.xxxxx.mongodb.net` with your real Atlas cluster host.
- `hospital_db` with your preferred database name.

If your password contains special characters such as `@`, `#`, `/`, `?`, or `&`, URL-encode the password before placing it in the URI.

### 6. Add the URI to the backend environment file

From the project root:

```powershell
copy server\.env.example server\.env
```

Then edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/hospital_db?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 7. Test the connection

Install dependencies if you have not already:

```powershell
npm install --prefix server
```

Seed the first admin user:

```powershell
npm run seed --prefix server
```

Expected result:

```text
Admin ready: admin@hospital.com / Admin@123
```

Start the backend:

```powershell
npm run dev --prefix server
```

Expected result:

```text
MongoDB connected: ...
API running on http://localhost:5000
```

## Option 2: Local MongoDB

Use this only if you want MongoDB installed on your machine instead of Atlas.

### 1. Install MongoDB Community Server

Download and install MongoDB Community Server from:

<https://www.mongodb.com/try/download/community>

During installation, installing MongoDB as a Windows service is usually easiest.

### 2. Install MongoDB Shell

Download MongoDB Shell from:

<https://www.mongodb.com/try/download/shell>

After installation, verify:

```powershell
mongod --version
mongosh --version
```

### 3. Use a local connection string

In `server/.env`, set:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hospital_db
```

Then seed and start the backend:

```powershell
npm run seed --prefix server
npm run dev --prefix server
```

## Common Problems

### `MONGO_URI is required`

The backend cannot find `server/.env`, or `MONGO_URI` is empty.

Fix:

```powershell
copy server\.env.example server\.env
```

Then fill in `MONGO_URI`.

### `bad auth Authentication failed`

The Atlas username or password is wrong, or the password needs URL encoding.

Fix:

- Confirm the database user in Atlas `Database Access`.
- Reset the password if needed.
- URL-encode special characters in the password.

### `querySrv ENOTFOUND`

The Atlas host in the URI is wrong, or DNS cannot resolve it.

Fix:

- Copy the connection string again from Atlas.
- Check your internet connection.
- Keep the `mongodb+srv://` prefix for Atlas SRV strings.

### Connection timeout

Atlas is blocking your IP address.

Fix:

- Go to Atlas `Network Access`.
- Add your current IP address.
- Wait a minute, then restart the backend.

## Official References

- MongoDB Atlas IP access list: <https://www.mongodb.com/docs/atlas/security/ip-access-list/>
- MongoDB connection string formats: <https://www.mongodb.com/docs/manual/reference/connection-string-formats/>
- MongoDB Node.js driver connection targets: <https://www.mongodb.com/docs/drivers/node/current/connect/connection-targets/>
