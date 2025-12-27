# 🚀 Full Stack Connection Guide

This guide will help you connect Prisma, Backend, and Frontend components.

## Prerequisites

- Node.js (v18+)
- PostgreSQL or Docker
- Git

## 🗄️ Step 1: Database Setup

### Option A: Using Docker (Recommended)

1. Start the PostgreSQL database:
```bash
docker-compose up -d
```

This will start PostgreSQL on port 5432 with:
- Database: `car_rental_db`
- User: `postgres`
- Password: `admin`

### Option B: Local PostgreSQL

If you have PostgreSQL installed locally, create a database named `car_rental_db` and update the `DATABASE_URL` in `backend/.env` accordingly.

## 🔧 Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already created with the correct configuration:
```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/car_rental_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. (Optional) Seed the database with initial data:
```bash
npm run prisma:seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:5000`

### Verify Backend is Running

Open your browser or use curl to check:
```bash
curl http://localhost:5000/health
```

You should see: `{"status":"OK","message":"Car Rental API is running"}`

## 🎨 Step 3: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already created with the backend URL:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173` (or another port if 5173 is busy)

## 🔗 Connection Flow

```
Frontend (React + Vite)
    ↓
    HTTP Requests to http://localhost:5000/api
    ↓
Backend (Express + TypeScript)
    ↓
    Prisma Client
    ↓
PostgreSQL Database (Docker/Local)
```

## 📋 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID

### Bookings
- `GET /api/bookings` - Get user's bookings (requires auth)
- `POST /api/bookings` - Create new booking (requires auth)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (requires auth)

### Stations
- `GET /api/stations` - Get all stations

### Incidents
- `GET /api/incidents` - Get user's incidents (requires auth)
- `POST /api/incidents` - Report incident (requires auth)

### Users (Admin)
- `GET /api/users` - Get all users (requires auth)

### Maintenance (Admin)
- `GET /api/maintenance` - Get maintenance records (requires auth)

## 🔍 Troubleshooting

### Database Connection Issues

If you get connection errors:

1. Check if PostgreSQL is running:
```bash
docker ps
```

2. Verify the database URL in `backend/.env`

3. Test connection:
```bash
cd backend
npx prisma db pull
```

### Backend Port Already in Use

If port 5000 is already in use, update:
1. `backend/.env` - Change `PORT=5000` to another port (e.g., `PORT=4000`)
2. `frontend/.env` - Update `VITE_API_BASE_URL` to match

### CORS Issues

If you encounter CORS errors:
1. Verify the backend has `cors()` middleware enabled (already configured in `server.ts`)
2. Check that the frontend is making requests to the correct URL

### Prisma Client Not Generated

If you get Prisma client errors:
```bash
cd backend
npm run prisma:generate
```

## 🛠️ Useful Commands

### Database Management
```bash
# View database in browser
npm run prisma:studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Format Prisma schema
npx prisma format
```

### Backend
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Next Steps

1. ✅ All components are now connected
2. Test the authentication flow by registering a new user
3. Explore the API endpoints using the frontend UI
4. Check `prisma/schema.prisma` to understand the database structure
5. Customize the application according to your needs

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## 🔐 Security Notes

⚠️ **Important for Production:**
1. Change the `JWT_SECRET` in `.env` to a strong, random value
2. Use environment-specific `.env` files
3. Never commit `.env` files to version control
4. Enable HTTPS
5. Implement rate limiting
6. Add input validation and sanitization
7. Set up proper authentication middleware

---

Happy coding! 🎉
