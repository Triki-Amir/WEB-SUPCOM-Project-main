# 📂 Project Structure Guide

<div align="center">

![Auto Fleet](../frontend/src/assets/logo.png)

**Complete Guide to Auto Fleet Project Organization**

</div>

---

This document provides a visual and detailed overview of the Auto Fleet project structure.

## 🎯 Quick Overview

Auto Fleet is organized into clear, logical sections:

- **Backend** - API server and database management
- **Frontend** - React application with role-based dashboards
- **Documentation** - Comprehensive guides and references
- **Configuration** - Setup and deployment guides

### 📸 Visual Guide

![User Interface](../frontend/src/assets/user_interface_screanshot.png)
*Client Dashboard - Intuitive interface for vehicle booking and management*

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

The frontend is a modern React application built with Vite and TypeScript.

**Purpose:** Provide intuitive user interfaces for clients, admins, and management.

**Technology Stack:**
- **React 18.3.1** - Component-based UI with hooks
- **TypeScript** - Type-safe component development
- **Vite** - Lightning-fast dev server and builds
- **Tailwind CSS** - Utility-first styling framework
- **Radix UI** - 30+ accessible component primitives
- **Recharts 2.15.2** - Beautiful data visualizations
- **React Hook Form 7.55.0** - Performant form management
- **Lucide React 0.487.0** - 500+ modern icons
- **Sonner 2.0.3** - Toast notifications

**Key Features:**
- ✅ **Role-Based Dashboards** - CLIENT, ADMIN, DIRECTION interfaces
- ✅ **70+ Components** - Well-organized component library
- ✅ **Centralized API** - Single api.ts service layer (678 lines)
- ✅ **Global State** - AuthContext for authentication state
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Real-Time Updates** - Toast notifications for all actions
- ✅ **Advanced Forms** - React Hook Form with validation

**Component Organization:**
- **Client Portal (7 components):**
  - Vehicle search with filters (date, category, city, station)
  - Booking management (view, create, cancel)
  - Rental history with detailed views
  - Incident reporting with severity levels
  - Real-time notifications
  - Profile management with password change
  
- **Admin Dashboard (8 components):**
  - Comprehensive statistics overview
  - Complete vehicle fleet CRUD operations
  - Booking lifecycle management (confirm, start, complete)
  - Maintenance scheduling and tracking
  - Station management with capacity tracking
  - User administration (role changes, account management)
  - Incident resolution workflow
  
- **Director Dashboard (4 components):**
  - High-level business overview
  - Advanced analytics with Recharts visualizations
  - Revenue and performance metrics
  - Custom report generation

**UI Component Library (50+):**
- Form components (Input, Select, Checkbox, Radio, etc.)
- Layout components (Card, Dialog, Tabs, Accordion)
- Data display (Table, Badge, Avatar, Calendar)
- Feedback components (Toast, Alert, Progress)
- Navigation (Dropdown, Menu, Breadcrumb)

**Start Frontend:**
```bash
npm run dev          # Development server with HMR
npm run build        # Production build (optimized)
npm run preview      # Preview production build
```

**Access:** `http://localhost:3000` (or `http://localhost:5173` - Vite default)

### 📚 Documentation (`/Documentation`)

Centralized location for all project documentation.

**Purpose:** Easy access to guides, architecture, and references.

**Key Files:**
- `INDEX.md` - Documentation navigation
- `ARCHITECTURE.md` - System architecture
- `README.md` - Documentation overview
- `PROJECT_STRUCTURE.md` - This file

### ⚙️ Configuration (`/Configuration`)

Guide to configuration files (actual files at root).

**Purpose:** Reference for setting up and configuring the project.

**Key File:**
- `README.md` - Configuration guide

## 📋 File Organization

### Backend Files

| Path | Description |
|------|-------------|
| `backend/src/routes/` | API endpoint handlers |
| `backend/src/middleware/` | Auth, validation, error handling |
| `backend/prisma/schema.prisma` | Database schema definition |
| `backend/.env` | Environment variables (not in git) |

### Frontend Files

| Path | Description |
|------|-------------|
| `src/components/` | All React components |
| `src/contexts/` | Global state management |
| `src/services/api.ts` | Centralized API calls |
| `src/assets/` | Images, icons, static files |

### Root Files

| File | Description |
|------|-------------|
| `package.json` | Frontend dependencies & scripts |
| `vite.config.ts` | Vite build configuration |
| `index.html` | HTML entry point |
| `tsconfig.json` | TypeScript configuration |

## 🔀 Data Flow

```
┌─────────────┐      HTTP/REST      ┌─────────────┐      SQL      ┌──────────────┐
│   Browser   │ ◄─────────────────► │   Backend   │ ◄───────────► │  PostgreSQL  │
│  (React)    │    JSON/JWT         │  (Express)  │    Prisma     │   Database   │
└─────────────┘                     └─────────────┘               └──────────────┘
      ▲                                    ▲
      │                                    │
      │  /src/services/api.ts             │  /backend/src/routes/
      │  Makes HTTP requests              │  Handles API endpoints
      │                                    │
      └──── Authentication (JWT) ─────────┘
```

## 🚀 Quick Navigation

### For Development

| Task | Location |
|------|----------|
| Add new API endpoint | `backend/src/routes/` |
| Create new component | `src/components/` |
| Add global state | `src/contexts/` |
| Make API call | `src/services/api.ts` |
| Update DB schema | `backend/prisma/schema.prisma` |
| Add styling | `src/styles/` or component |

### For Documentation

| Task | Location |
|------|----------|
| Read architecture | `Documentation/ARCHITECTURE.md` |
| Setup guide | `Documentation/README_DEVELOPMENT.md` |
| API reference | `backend/README.md` |
| Component docs | `src/README.md` |
| Config help | `Configuration/README.md` |

### For Configuration

| Task | Location |
|------|----------|
| Change frontend port | `vite.config.ts` |
| Change backend port | `backend/.env` |
| Add dependency | `package.json` or `backend/package.json` |
| Configure database | `backend/.env` |
| TypeScript settings | `tsconfig.json` |

## 📊 Component Hierarchy

```
App.tsx (Root)
│
├── AuthProvider (Context)
│   │
│   ├── HomePage (Public)
│   │   ├── SearchPanel
│   │   ├── VehicleCard
│   │   └── StationRecommendation
│   │
│   ├── LoginPage (Public)
│   │   └── LoginForm
│   │
│   └── Dashboard (Protected)
│       │
│       ├── ClientDashboard
│       │   ├── VehicleSearch
│       │   ├── MyBookings
│       │   ├── ActiveRental
│       │   └── IncidentReporting
│       │
│       ├── AdminDashboard
│       │   ├── FleetManagement
│       │   ├── BookingManagement
│       │   ├── UserManagement
│       │   └── MaintenanceTracking
│       │
│       └── DirectionDashboard
│           ├── Analytics
│           ├── Reports
│           └── KPIs
```

## 🎨 Styling Structure

```
Styling Approach: Utility-First (Tailwind CSS)

├── Global Styles
│   ├── src/index.css          # Base styles
│   └── src/styles/globals.css # Custom utilities
│
├── Component Styles
│   └── Inline Tailwind classes in .tsx files
│
└── UI Components
    └── src/components/ui/      # Styled primitives
        ├── button.tsx
        ├── card.tsx
        ├── dialog.tsx
        └── ...
```

## 🔐 Authentication Flow

```
1. User → LoginPage
          ↓
2. API call → /api/auth/login
          ↓
3. Backend validates credentials
          ↓
4. JWT token generated
          ↓
5. Token stored in AuthContext
          ↓
6. Role-based dashboard rendered
          ↓
7. Protected routes accessible
```

## 🛠️ Development Workflow

### Starting Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev              # Starts on port 5000

# Terminal 2 - Frontend  
npm run dev              # Starts on port 3000
```

### Making Changes

1. **Backend Changes:**
   - Edit files in `backend/src/`
   - Changes auto-reload with `tsx watch`

2. **Frontend Changes:**
   - Edit files in `src/`
   - Changes hot-reload with Vite

3. **Database Changes:**
   ```bash
   cd backend
   # Edit prisma/schema.prisma
   npx prisma migrate dev
   npx prisma generate
   ```

## 📦 Build & Deploy

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

## 📈 Scalability

The structure supports growth:

- **New Features:** Add to `src/components/`
- **New Endpoints:** Add to `backend/src/routes/`
- **New Roles:** Extend in `components/[role]/`
- **New Services:** Add to `src/services/`
- **New Tables:** Update `prisma/schema.prisma`

## 🤝 Contributing

When adding to the project:

1. **Follow the structure** - Keep files organized
2. **Document changes** - Update relevant READMEs
3. **Use existing patterns** - Match current code style
4. **Test thoroughly** - Both frontend and backend
5. **Update docs** - Keep documentation current

## 📚 Related Documentation

- [Main README](../README.md) - Project overview
- [Architecture](./ARCHITECTURE.md) - System design
- [Backend README](../backend/README.md) - API details
- [Frontend README](../src/README.md) - UI details
- [Configuration Guide](../Configuration/README.md) - Setup help

---

**Questions?** Check the [Documentation Index](./INDEX.md) or the main [README](../README.md).
