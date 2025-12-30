# 📂 Project Structure Guide

<div align="center">
<img src="../frontend/src/assets/logo.png" alt="Auto Fleet" width="80" />
</div>

---

**Organization:** Backend (API + Database) • Frontend (React Dashboards) • Documentation • Configuration

## 🌳 Complete Directory Tree

```
WEB-SUPCOM-Project-main/
│
├── 📁 backend/                      # Backend API Server (Node.js + Express)
│   ├── 📁 src/                      # TypeScript source code
│   │   ├── 📁 routes/              # API route handlers (9 modules)
│   │   │   ├── auth.ts             # Authentication (register, login)
│   │   │   ├── vehicles.ts         # Vehicle CRUD + availability check
│   │   │   ├── bookings.ts         # Booking lifecycle management
│   │   │   ├── stations.ts         # Station management
│   │   │   ├── incidents.ts        # Incident reporting & tracking
│   │   │   ├── maintenance.ts      # Vehicle maintenance scheduling
│   │   │   ├── users.ts            # User profile & role management
│   │   │   ├── notifications.ts    # Notification system
│   │   │   └── analytics.ts        # Dashboard stats & reports
│   │   ├── 📁 middleware/          # Express middleware
│   │   │   └── auth.ts             # JWT authentication & authorization
│   │   ├── 📁 lib/                 # Utility libraries
│   │   │   └── prisma.ts           # Prisma client singleton
│   │   ├── server.ts               # Express app configuration
│   │   └── index.ts                # Alternative entry point
│   ├── 📁 prisma/                   # Database management (Prisma ORM)
│   │   ├── schema.prisma           # Database schema (7 models, 4 enums)
│   │   ├── seed.ts                 # Database seeding (users, vehicles, etc.)
│   │   ├── init.sql                # Initial SQL setup
│   │   └── migrations/             # Migration history
│   │       ├── migration_lock.toml
│   │       └── 20251227132658_initial_complete_schema/
│   │           └── migration.sql
│   ├── 📄 package.json             # Backend dependencies
│   │   ├── @prisma/client: 6.19.1
│   │   ├── express: 4.21.2
│   │   ├── bcryptjs: 2.4.3
│   │   ├── jsonwebtoken: 9.0.2
│   │   ├── zod: 3.24.1
│   │   └── tsx: 4.19.2 (dev)
│   ├── 📄 tsconfig.json            # TypeScript configuration
│   ├── 📄 README.md                # Backend documentation
│   ├── 📄 check-data.ts            # Database verification script
│   └── 📄 start-backend.bat        # Windows startup script
│
├── 📁 frontend/                     # Frontend Application (React + Vite)
│   ├── 📁 src/                      # React application source
│   │   ├── 📁 components/          # React components
│   │   │   ├── 📁 admin/           # Admin dashboard (8 components)
│   │   │   │   ├── AdminDashboard.tsx    # Main admin interface
│   │   │   │   ├── AdminStats.tsx        # Statistics overview
│   │   │   │   ├── AdminFleet.tsx        # Vehicle fleet management
│   │   │   │   ├── AdminBookings.tsx     # Booking management
│   │   │   │   ├── AdminMaintenance.tsx  # Maintenance scheduling
│   │   │   │   ├── AdminStations.tsx     # Station management
│   │   │   │   ├── AdminUsers.tsx        # User administration
│   │   │   │   └── AdminAlerts.tsx       # Incident management
│   │   │   ├── 📁 client/          # Client portal (7 components)
│   │   │   │   ├── ClientDashboard.tsx   # Main client view
│   │   │   │   ├── ClientSearch.tsx      # Vehicle search & booking
│   │   │   │   ├── ClientBookings.tsx    # Active rentals
│   │   │   │   ├── ClientHistory.tsx     # Booking history
│   │   │   │   ├── ClientIncidents.tsx   # Incident reporting
│   │   │   │   ├── ClientNotifications.tsx # Notification center
│   │   │   │   └── ClientProfile.tsx     # Profile settings
│   │   │   ├── 📁 direction/       # Director dashboard (4 components)
│   │   │   │   ├── DirectionDashboard.tsx  # Main director view
│   │   │   │   ├── DirectionOverview.tsx   # Business overview
│   │   │   │   ├── DirectionAnalytics.tsx  # Advanced analytics
│   │   │   │   └── DirectionReports.tsx    # Report generation
│   │   │   ├── 📁 auth/            # Authentication components
│   │   │   │   └── LoginPage.tsx   # Login & registration forms
│   │   │   ├── 📁 ui/              # Reusable UI components (50+)
│   │   │   │   ├── button.tsx      # Button variants
│   │   │   │   ├── card.tsx        # Card layouts
│   │   │   │   ├── dialog.tsx      # Modal dialogs
│   │   │   │   ├── table.tsx       # Data tables
│   │   │   │   ├── form.tsx        # Form components
│   │   │   │   ├── input.tsx       # Input fields
│   │   │   │   ├── select.tsx      # Dropdown selects
│   │   │   │   ├── badge.tsx       # Status badges
│   │   │   │   ├── calendar.tsx    # Date picker
│   │   │   │   ├── chart.tsx       # Recharts integration
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── ... (30+ more Radix UI components)
│   │   │   ├── 📁 figma/          # Figma import utilities
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   ├── HomePage.tsx        # Landing page
│   │   │   ├── SearchPanel.tsx     # Vehicle search interface
│   │   │   ├── VehicleCard.tsx     # Vehicle display card
│   │   │   ├── BookingDialog.tsx   # Booking creation modal
│   │   │   ├── ActiveRental.tsx    # Current rental display
│   │   │   ├── StationRecommendation.tsx # Station suggestions
│   │   │   └── TechStack.tsx       # Technology showcase
│   │   ├── 📁 contexts/            # React Context providers
│   │   │   └── AuthContext.tsx     # Authentication state management
│   │   ├── 📁 services/            # API service layer
│   │   │   └── api.ts              # Centralized API client (678 lines)
│   │   │       ├── authService     # Authentication APIs
│   │   │       ├── vehicleService  # Vehicle management APIs
│   │   │       ├── bookingService  # Booking APIs
│   │   │       ├── stationService  # Station APIs
│   │   │       ├── incidentService # Incident APIs
│   │   │       ├── maintenanceService # Maintenance APIs
│   │   │       ├── userService     # User management APIs
│   │   │       ├── notificationService # Notification APIs
│   │   │       └── analyticsService # Analytics APIs
│   │   ├── 📁 assets/              # Static assets
│   │   │   ├── logo.png            # Main logo (PNG)
│   │   │   ├── logo.svg            # Vector logo
│   │   │   ├── hero-car.jpg        # Hero image
│   │   │   ├── home_page_screanshot.png      # Homepage screenshot
│   │   │   ├── login_screanshot.png          # Login page screenshot
│   │   │   ├── user_interface_screanshot.png # User dashboard screenshot
│   │   │   ├── parc_admin_screanshot.png     # Admin fleet screenshot
│   │   │   └── 651c45b1865c51f174a583211861ca76520c7033.png # Tech stack
│   │   ├── 📁 styles/              # Global styles
│   │   │   └── globals.css         # Tailwind directives
│   │   ├── App.tsx                 # Root component (102 lines)
│   │   ├── main.tsx                # React entry point
│   │   ├── index.css               # Base styles
│   │   ├── env.d.ts                # TypeScript definitions
│   │   └── README.md               # Frontend documentation
│   ├── 📄 package.json             # Frontend dependencies
│   │   ├── react: 18.3.1
│   │   ├── @radix-ui/*: Latest (30+ packages)
│   │   ├── recharts: 2.15.2
│   │   ├── react-hook-form: 7.55.0
│   │   ├── lucide-react: 0.487.0
│   │   ├── tailwind-merge: Latest
│   │   ├── class-variance-authority: 0.7.1
│   │   └── sonner: 2.0.3
│   ├── 📄 vite.config.ts           # Vite configuration
│   ├── 📄 tsconfig.json            # TypeScript config
│   ├── 📄 tsconfig.node.json       # Node TypeScript config
│   ├── 📄 index.html               # HTML entry point
│   └── 📄 test-api.html            # API testing page
│
├── 📁 Documentation/               # Comprehensive documentation
│   ├── ARCHITECTURE.md             # System architecture (370+ lines)
│   ├── ARCHITECTURE_INTEGRATION.md # Integration guide (771+ lines)
│   ├── PROJECT_STRUCTURE.md        # This file (375+ lines)
│   ├── QUICKSTART.md               # Quick start guide (184+ lines)
│   └── README.md                   # Documentation overview
│
├── 📁 Configuration/               # Configuration guides
│   └── README.md                   # Configuration reference
│
├── 📄 package.json                 # Root package.json (frontend deps)
├── 📄 docker-compose.yml           # Docker setup for PostgreSQL
├── 📄 DOCKER_SETUP.md              # Docker installation guide
├── 📄 SETUP_GUIDE.md               # Complete setup instructions
└── 📄 README.md                    # Main project documentation

📊 Project Statistics:
- Total Files: 150+
- Lines of Code: 10,000+
- Frontend Components: 70+
- Backend Routes: 50+ endpoints
- Database Models: 7
- API Services: 9 modules
```

## 🎯 Key Directories

### 🔧 Backend (`/backend`)

The backend is a RESTful API server built with Express.js and TypeScript.

**Purpose:** Handle all business logic, database operations, and API endpoints.

**Technology Stack:**
- **Express 4.21.2** - Minimalist web framework
- **Prisma 6.19.1** - Next-generation ORM with type safety
- **PostgreSQL 14+** - Relational database
- **TypeScript 5.7.2** - Type-safe development
- **JWT 9.0.2** - Stateless authentication
- **Bcrypt 6.0.0** - Password hashing (10 rounds)
- **Zod 3.24.1** - Runtime type validation

**Key Features:**
- ✅ **9 Route Modules** - Organized by domain (auth, vehicles, bookings, etc.)
- ✅ **JWT Authentication** - Secure token-based auth with role checking
- ✅ **Prisma ORM** - Type-safe database queries with migrations
- ✅ **Input Validation** - Zod schemas for request validation
- ✅ **Error Handling** - Centralized error middleware
- ✅ **CORS Support** - Configured for frontend origins
- ✅ **Health Check** - `/health` endpoint for monitoring

**API Endpoints:**
- 50+ RESTful endpoints across 9 modules
- Role-based access control (CLIENT, ADMIN, DIRECTION)
- Advanced filtering and pagination
- Transaction support for data consistency

**Start Backend:**
```bash
cd backend
npm run dev          # Development with hot reload (tsx watch)
npm run build        # Compile TypeScript to JavaScript
npm start            # Production mode
npm run prisma:studio # Visual database editor
```

**Access:** `http://localhost:5000/api`  
**Health Check:** `http://localhost:5000/health`

### 🎨 Frontend (`/frontend/src`)

Modern React application with role-based interfaces.

**Stack:** React 18.3.1 • TypeScript • Vite • Tailwind CSS • Radix UI • Recharts • React Hook Form

**Features:**
- 70+ Components organized by role (Client, Admin, Direction)
- Centralized API service (678 lines)
- Global authentication state
- Real-time toast notifications

**Access:** `http://localhost:3000` or `http://localhost:5173`

**Components:** Client portal (7) • Admin dashboard (8) • Director dashboard (4) • UI library (50+)  
See [ARCHITECTURE_INTEGRATION.md](./ARCHITECTURE_INTEGRATION.md) for complete component details.

**Commands:**
```bash
npm run dev          # Development server
npm run build        # Production build
```

### 📚 Documentation (`/Documentation`)

Technical guides and architecture references.

### ⚙️ Configuration (`/Configuration`)

Setup and configuration guides.

## 📋 Quick Reference

| Path | Description |
|------|-------------|
| `backend/src/routes/` | API endpoint handlers |
| `backend/prisma/schema.prisma` | Database schema |
| `src/components/` | React components |
| `src/services/api.ts` | Centralized API calls |
| `src/contexts/` | Global state management |

## 🔀 Data Flow

**Browser** ↔ HTTP/REST (JSON + JWT) ↔ **Backend** ↔ Prisma ↔ **PostgreSQL**

## 🚀 Development Tasks

| Task | Location |
|------|----------|
| Add API endpoint | `backend/src/routes/` |
| Create component | `src/components/` |
| Update DB schema | `backend/prisma/schema.prisma` |

---

**Next:** See [QUICKSTART.md](./QUICKSTART.md) for setup instructions.

##  Build & Deploy

### Development Build

```bash
# Frontend
npm run build           # → /build

# Backend
cd backend
npm run build          # → /dist
```

### Production Deployment

```bash
# Frontend (serves static files)
npm run build
# Deploy /build directory

# Backend (runs Node.js)
cd backend
npm run build
npm start              # Runs on PORT from .env
```

## 🔍 Finding Things

### "Where do I...?"

| Need to... | Go to... |
|------------|----------|
| Add a new page | `src/components/` |
| Create API endpoint | `backend/src/routes/` |
| Update database | `backend/prisma/schema.prisma` |
| Add authentication | `src/contexts/AuthContext.tsx` |
| Make API call | `src/services/api.ts` |
| Style components | Tailwind in component files |
| Read docs | `Documentation/INDEX.md` |
| Configure build | `vite.config.ts` |
| Set environment vars | `backend/.env` |

## � Related Documentation

- [Main README](../README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design & API details
- [ARCHITECTURE_INTEGRATION.md](./ARCHITECTURE_INTEGRATION.md) - Component details
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup guide

---

**Questions?** Check [../README.md](../README.md) for the main documentation.
