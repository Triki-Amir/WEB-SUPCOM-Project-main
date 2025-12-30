# 🚗 Auto Fleet - Modern Car Rental Management System

<div align="center">

![Auto Fleet Logo](./frontend/src/assets/logo.png)

**A comprehensive car rental management platform built with cutting-edge technologies**

[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

[Features](#-features) • [Screenshots](#-screenshots) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 🌟 Overview

Auto Fleet is a modern, full-stack web application designed for efficient car rental management in Tunisia. Built with React, Node.js, and PostgreSQL, it provides a seamless experience for clients, administrators, and management teams.

### 🎯 Key Highlights

✨ **Role-Based Dashboards** - Tailored interfaces for Clients, Admins, and Directors  
🚗 **Real-Time Fleet Management** - Track vehicles, bookings, and maintenance  
📊 **Advanced Analytics** - Comprehensive reports and KPIs for decision-making  
🔐 **Secure Authentication** - JWT-based authentication with role-based access  
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
⚡ **Modern Tech Stack** - Built with the latest web technologies  

---

## 📸 Screenshots

### 🏠 Home Page
Discover available vehicles and explore our platform features.

![Home Page](./frontend/src/assets/home_page_screanshot.png)

### 🔐 Login Interface
Secure authentication with role-based access control.

![Login Page](./frontend/src/assets/login_screanshot.png)

### 👤 User Dashboard
Intuitive client interface for booking and managing rentals.

![User Interface](./frontend/src/assets/user_interface_screanshot.png)

### 🚗 Admin Fleet Management
Powerful tools for managing the entire vehicle fleet.

![Admin Fleet](./frontend/src/assets/parc_admin_screanshot.png)

---

## ✨ Features

<table>
<tr>
<td width="33%" valign="top">

### 👤 Client Portal

- 🔐 **Secure Authentication**  
  Register and login with JWT tokens
  
- 🔍 **Vehicle Search**  
  Advanced filters by type, station, dates
  
- 📅 **Booking Management**  
  Create, view, and manage reservations
  
- 📜 **Rental History**  
  Complete history of past bookings
  
- 🚨 **Incident Reporting**  
  Report and track vehicle issues
  
- 📬 **Real-Time Notifications**  
  Stay updated on booking status
  
- 👤 **Profile Management**  
  Update personal information

</td>
<td width="33%" valign="top">

### 👨‍💼 Admin Dashboard

- 📊 **Comprehensive Dashboard**  
  Real-time statistics and insights
  
- 🚗 **Fleet Management**  
  Complete vehicle CRUD operations
  
- 📝 **Booking Oversight**  
  Manage all customer reservations
  
- 🔧 **Maintenance Tracking**  
  Schedule and monitor vehicle maintenance
  
- 📍 **Station Management**  
  Manage pickup/dropoff locations
  
- 👥 **User Administration**  
  Manage client accounts and roles
  
- 🚨 **Alert System**  
  Handle incidents and notifications
  
- 📈 **Reports Generation**  
  Generate operational reports

</td>
<td width="33%" valign="top">

### 👔 Director Portal

- 📊 **Advanced Analytics**  
  Deep insights into operations
  
- 📈 **Performance Metrics**  
  Track business performance
  
- 💰 **Financial Reports**  
  Revenue and profit analysis
  
- 🎯 **KPIs Dashboard**  
  Key performance indicators
  
- 📉 **Trend Analysis**  
  Historical data visualization
  
- 🔄 **Fleet Utilization**  
  Vehicle usage statistics
  
- 📅 **Booking Analytics**  
  Reservation patterns and trends
  
- 🏆 **Strategic Insights**  
  Data-driven decision support

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

![Tech Stack](./frontend/src/assets/651c45b1865c51f174a583211861ca76520c7033.png)

<table>
<tr>
<td width="50%">

### 🎨 Frontend

| Technology | Purpose | Version |
|------------|---------|----------|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black) | UI Framework | 18.x |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Type Safety | 5.x |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool | Latest |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Styling | 3.x |
| ![Radix UI](https://img.shields.io/badge/-Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white) | Components | Latest |
| ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | Animations | Latest |
| ![Recharts](https://img.shields.io/badge/-Recharts-FF6B6B?style=flat) | Charts | Latest |
| ![Lucide React](https://img.shields.io/badge/-Lucide-F56565?style=flat) | Icons | Latest |

</td>
<td width="50%">

### ⚙️ Backend

| Technology | Purpose | Version |
|------------|---------|----------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white) | Runtime | 18+ |
| ![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white) | Web Framework | 4.x |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Type Safety | 5.x |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=prisma&logoColor=white) | ORM | Latest |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) | Database | 14+ |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat&logo=json-web-tokens&logoColor=white) | Auth Tokens | Latest |
| ![Bcrypt](https://img.shields.io/badge/-Bcrypt-CA0000?style=flat) | Password Hash | Latest |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat) | Validation | Latest |

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 14+ | [postgresql.org](https://www.postgresql.org/) |
| npm/yarn | Latest | Included with Node.js |

### ⚡ Installation

#### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd WEB-SUPCOM-Project-main
```

#### 2️⃣ Install Frontend Dependencies

```bash
npm install
```

#### 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

#### 4️⃣ Configure Database

Create a PostgreSQL database:

```bash
# Using PostgreSQL command line
createdb car_rental

# Or using psql
psql -U postgres
CREATE DATABASE car_rental;
\q
```

#### 5️⃣ Setup Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/car_rental?schema=public"
JWT_SECRET="your-secret-jwt-key-change-this"
PORT=5000
NODE_ENV=development
```

#### 6️⃣ Initialize Database

Run Prisma migrations and seed the database:

```bash
# In the backend folder
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

<details>
<summary>📦 What gets seeded?</summary>

The seed script creates:
- ✅ 3 test users (Client, Admin, Director)
- ✅ 3 stations (Tunis, Sfax, Sousse)
- ✅ 6 vehicles with different categories
- ✅ 2 sample bookings
- ✅ 1 incident report
- ✅ 1 maintenance record
- ✅ 2 notifications

</details>

---

## 🎮 Running the Application

### Start Development Servers

You'll need **two terminal windows**:

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

✅ Backend API running at: `http://localhost:5000`

#### Terminal 2 - Frontend Application

```bash
# In project root
npm run dev
```

✅ Frontend app running at: `http://localhost:3000`

### 🎯 Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

### 🗄️ Database Management (Optional)

Launch Prisma Studio for visual database management:

```bash
cd backend
npm run prisma:studio
```

✅ Prisma Studio running at: `http://localhost:5555`

---

## 🔑 Test Accounts

Use these credentials to explore different user roles:

<table>
<tr>
<th>Role</th>
<th>Email</th>
<th>Password</th>
<th>Access Level</th>
</tr>
<tr>
<td>👤 <strong>Client</strong></td>
<td><code>client@autofleet.tn</code></td>
<td><code>password123</code></td>
<td>Vehicle search, bookings, incident reports</td>
</tr>
<tr>
<td>👨‍💼 <strong>Admin</strong></td>
<td><code>admin@autofleet.tn</code></td>
<td><code>password123</code></td>
<td>Full system management, fleet, users, bookings</td>
</tr>
<tr>
<td>👔 <strong>Director</strong></td>
<td><code>direction@autofleet.tn</code></td>
<td><code>password123</code></td>
<td>Analytics, reports, KPIs, strategic insights</td>
</tr>
</table>

> ⚠️ **Important:** Change these passwords in production environments!

---

## 📂 Project Structure

```
WEB-SUPCOM-Project/
│
├── 📁 backend/                     # Backend API Server
│   ├── 📁 src/
│   │   ├── 📁 routes/             # API endpoints (auth, vehicles, bookings, etc.)
│   │   ├── 📁 middleware/         # Auth, validation middleware
│   │   ├── 📁 lib/                # Prisma client
│   │   ├── server.ts              # Express server configuration
│   │   └── index.ts               # Application entry point
│   ├── 📁 prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.ts                # Database seeding
│   │   └── migrations/            # Migration history
│   ├── package.json
│   └── README.md
│
├── 📁 frontend/src/                # Frontend Application
│   ├── 📁 components/
│   │   ├── 📁 admin/              # Admin dashboard components
│   │   ├── 📁 client/             # Client portal components
│   │   ├── 📁 direction/          # Director dashboard components
│   │   ├── 📁 auth/               # Authentication pages
│   │   └── 📁 ui/                 # Reusable UI components
│   ├── 📁 contexts/
│   │   └── AuthContext.tsx        # Global auth state
│   ├── 📁 services/
│   │   └── api.ts                 # API client & requests
│   ├── 📁 assets/                 # Images, logos, screenshots
│   ├── 📁 styles/                 # Global CSS
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # React entry point
│
├── 📁 Documentation/               # Comprehensive documentation
│   ├── ARCHITECTURE.md            # System architecture
│   ├── ARCHITECTURE_INTEGRATION.md # Integration guide
│   ├── PROJECT_STRUCTURE.md       # Project organization
│   └── QUICKSTART.md              # Quick start guide
│
├── 📁 Configuration/               # Configuration guides
│   └── README.md
│
├── 📄 index.html                  # HTML entry point
├── 📄 package.json                # Frontend dependencies
├── 📄 vite.config.ts              # Vite configuration
├── 📄 docker-compose.yml          # Docker setup
└── 📄 README.md                   # This file
```

### 🎯 Quick Navigation

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `/backend` | API & Database | `server.ts`, `schema.prisma` |
| `/frontend/src` | React Application | `App.tsx`, `api.ts` |
| `/Documentation` | Guides & Docs | `ARCHITECTURE.md`, `QUICKSTART.md` |
| `/Configuration` | Setup Help | `README.md` |

📖 **Detailed structure:** See [PROJECT_STRUCTURE.md](./Documentation/PROJECT_STRUCTURE.md)

---

## 📚 Documentation

Comprehensive documentation is available in the `/Documentation` folder:

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](./Documentation/QUICKSTART.md) | Get started in 5 minutes |
| [ARCHITECTURE.md](./Documentation/ARCHITECTURE.md) | System architecture & design |
| [ARCHITECTURE_INTEGRATION.md](./Documentation/ARCHITECTURE_INTEGRATION.md) | Integration & data flow |
| [PROJECT_STRUCTURE.md](./Documentation/PROJECT_STRUCTURE.md) | Project organization |
| [Backend README](./backend/README.md) | Backend API documentation |

---

## 🔌 API Endpoints

The backend provides a comprehensive RESTful API:

<details>
<summary><strong>Authentication</strong></summary>

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

</details>

<details>
<summary><strong>Vehicles</strong></summary>

- `GET /api/vehicles` - List all vehicles (with filters)
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle (Admin)
- `PUT /api/vehicles/:id` - Update vehicle (Admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin)

</details>

<details>
<summary><strong>Bookings</strong></summary>

- `GET /api/bookings` - List user bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `PATCH /api/bookings/:id/complete` - Complete booking (Admin)

</details>

<details>
<summary><strong>Stations</strong></summary>

- `GET /api/stations` - List all stations
- `GET /api/stations/:id` - Get station details
- `POST /api/stations` - Create station (Admin)
- `PUT /api/stations/:id` - Update station (Admin)

</details>

<details>
<summary><strong>Incidents</strong></summary>

- `GET /api/incidents` - List incidents
- `POST /api/incidents` - Report incident
- `PATCH /api/incidents/:id` - Update incident status (Admin)

</details>

<details>
<summary><strong>Users</strong></summary>

- `GET /api/users` - List all users (Admin)
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

</details>

<details>
<summary><strong>Analytics</strong></summary>

- `GET /api/analytics/dashboard` - Dashboard statistics (Director)
- `GET /api/analytics/revenue` - Revenue reports (Director)
- `GET /api/analytics/fleet-usage` - Fleet utilization (Director)

</details>

📖 **Full API documentation:** [Backend README](./backend/README.md)

---

## 🐛 Troubleshooting

<details>
<summary><strong>Port Already in Use</strong></summary>

**Problem:** Port 3000 or 5000 is already in use

**Solution:**
```bash
# Frontend - Edit vite.config.ts
server: { port: 3001 }

# Backend - Edit backend/.env
PORT=5001
```
</details>

<details>
<summary><strong>Database Connection Error</strong></summary>

**Problem:** Cannot connect to PostgreSQL

**Solution:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in `backend/.env`
3. Ensure database exists: `createdb car_rental`
4. Test connection: `psql -U postgres -d car_rental`
</details>

<details>
<summary><strong>Prisma Errors</strong></summary>

**Problem:** Prisma client errors or migration issues

**Solution:**
```bash
cd backend
npx prisma generate      # Regenerate client
npx prisma migrate reset # Reset database (WARNING: deletes data)
npx prisma migrate dev   # Apply migrations
```
</details>

<details>
<summary><strong>Module Not Found</strong></summary>

**Problem:** Missing dependencies or module errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Backend clean install
cd backend
rm -rf node_modules package-lock.json
npm install
```
</details>

<details>
<summary><strong>Build Errors</strong></summary>

**Problem:** TypeScript or build errors

**Solution:**
```bash
# Clear cache and rebuild
npm run build -- --force

# Backend rebuild
cd backend
rm -rf dist
npm run build
```
</details>

---

## 📝 Available Scripts

### Frontend Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Commands

```bash
cd backend

# Development
npm run dev                  # Start dev server with hot reload

# Production
npm run build                # Compile TypeScript
npm start                    # Start production server

# Database
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate       # Run migrations
npm run prisma:seed          # Seed database
npm run prisma:studio        # Open Prisma Studio GUI
npm run prisma:reset         # Reset database (deletes all data)
```

---

## 🔒 Security

### Authentication
- JWT token-based authentication
- Bcrypt password hashing (10 rounds)
- Role-based access control (RBAC)

### Best Practices
- Environment variables for sensitive data
- SQL injection protection via Prisma ORM
- Input validation with Zod schemas
- CORS configuration

---

## 🚀 Deployment

### Production Build

```bash
# Frontend
npm run build
# Deploy /dist folder to hosting service

# Backend
cd backend
npm run build
# Deploy with Node.js hosting (Heroku, Railway, etc.)
```

### Environment Variables

Ensure these are set in production:

```env
DATABASE_URL=<production-database-url>
JWT_SECRET=<strong-secret-key>
NODE_ENV=production
PORT=5000
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team & Credits

<div align="center">

**Developed for Auto Fleet**  
*Modern Car Rental Management System for Tunisia*

### Built With ❤️ Using

HTML5 • CSS3 • JavaScript • TypeScript • React • Node.js • Express • PostgreSQL • Prisma

---

### 📧 Contact & Support

For questions, issues, or suggestions:
- 📫 Email: support@autofleet.tn
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📚 Documentation: [Documentation Folder](./Documentation/)

---

**⭐ If you find this project helpful, please give it a star!**

</div>
