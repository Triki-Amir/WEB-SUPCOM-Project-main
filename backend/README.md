# 🚀 Auto Fleet - Backend API

RESTful API for the Auto Fleet car rental management system, built with Express.js, Prisma ORM, and PostgreSQL.

## 📋 Overview

This backend provides a complete API for managing:
- User authentication and authorization
- Vehicle fleet management
- Booking and reservation system
- Station management
- Incident reporting and tracking
- Maintenance scheduling
- User notifications

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type safety
- **Prisma** - Modern database ORM
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Zod** - Runtime validation

## 📁 Structure

```
backend/
├── src/
│   ├── routes/              # API route handlers
│   │   ├── auth.ts         # Authentication endpoints
│   │   ├── vehicles.ts     # Vehicle management
│   │   ├── bookings.ts     # Booking management
│   │   ├── stations.ts     # Station endpoints
│   │   ├── incidents.ts    # Incident reporting
│   │   ├── users.ts        # User management
│   │   └── maintenance.ts  # Maintenance tracking
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts         # JWT authentication
│   │   └── validate.ts     # Request validation
│   ├── server.ts           # Express server setup
│   └── index.ts            # Application entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your database credentials:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/car_rental"
   JWT_SECRET="your-secret-key"
   PORT=5000
   NODE_ENV=development
   ```

4. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database (optional):**
   ```bash
   npm run prisma:seed
   ```

### Running the Server

**Development mode:**
```bash
npm run dev
```
Server runs on `http://localhost:5000` with hot-reload.

**Production mode:**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |

### Vehicles

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/vehicles` | List all vehicles | No |
| GET | `/api/vehicles/:id` | Get vehicle details | No |
| POST | `/api/vehicles` | Create vehicle | Admin |
| PUT | `/api/vehicles/:id` | Update vehicle | Admin |
| DELETE | `/api/vehicles/:id` | Delete vehicle | Admin |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings` | Get user's bookings | Yes |
| POST | `/api/bookings` | Create booking | Yes |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Yes |
| GET | `/api/bookings/all` | Get all bookings | Admin |

### Stations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stations` | List all stations | No |
| GET | `/api/stations/:id` | Get station details | No |

### Incidents

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/incidents` | Get user's incidents | Yes |
| POST | `/api/incidents` | Report incident | Yes |
| GET | `/api/incidents/all` | Get all incidents | Admin |
| PATCH | `/api/incidents/:id/status` | Update incident status | Admin |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/me` | Get user profile | Yes |
| PUT | `/api/users/me` | Update profile | Yes |

### Maintenance

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/maintenance` | List maintenance records | Admin |
| POST | `/api/maintenance` | Create maintenance record | Admin |
| PATCH | `/api/maintenance/:id/status` | Update maintenance status | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Getting a token:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Using the token:**
```bash
GET /api/bookings
Authorization: Bearer <your-token>
```

## 🗄️ Database Schema

### User Roles
- **client**: Can book vehicles and report incidents
- **admin**: Can manage fleet, bookings, and users
- **direction**: Can view analytics and reports

### Main Tables
- `User` - User accounts and authentication
- `Vehicle` - Vehicle inventory
- `Station` - Pickup/dropoff locations
- `Booking` - Rental reservations
- `Incident` - Issue reports
- `Maintenance` - Vehicle maintenance records
- `Notification` - User notifications

For detailed schema, see `prisma/schema.prisma`.

## 🧪 Testing

### Test Accounts (after seeding)

**Client:**
- Email: `client@autofleet.tn`
- Password: `password123`

**Admin:**
- Email: `admin@autofleet.tn`
- Password: `password123`

**Direction:**
- Email: `direction@autofleet.tn`
- Password: `password123`

## 📜 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Compile TypeScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |

## 🐛 Troubleshooting

**Database connection error:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

**Prisma errors:**
- Run `npm run prisma:generate` after schema changes
- Run `npm run prisma:migrate` to apply migrations

**Port already in use:**
- Change `PORT` in `.env`
- Kill process using port 5000: `npx kill-port 5000`

## 📚 Documentation

For complete project documentation, see the `/Documentation` directory in the project root:
- [ARCHITECTURE.md](../Documentation/ARCHITECTURE.md) - System architecture
- [README_DEVELOPMENT.md](../Documentation/README_DEVELOPMENT.md) - Development guide

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add validation for new endpoints
3. Update Prisma schema if changing database
4. Test authentication and authorization
5. Document new endpoints in this README

## 📄 License

MIT License - See project root for details.

---

**Need help?** Check the [Documentation](../Documentation) or contact the development team.
