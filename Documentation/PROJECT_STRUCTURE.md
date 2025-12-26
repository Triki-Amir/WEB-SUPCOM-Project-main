# 📂 Project Structure Guide

This document provides a visual and detailed overview of the Auto Fleet project structure.

## 🌳 Directory Tree

```
WEB-SUPCOM-Project/
│
├── 📁 backend/                      # Backend API Server
│   ├── 📁 src/                      # Backend source code
│   │   ├── 📁 routes/              # API endpoints
│   │   ├── 📁 middleware/          # Express middleware
│   │   ├── server.ts               # Express server
│   │   └── index.ts                # Entry point
│   ├── 📁 prisma/                   # Database management
│   │   ├── schema.prisma           # DB schema
│   │   └── seed.ts                 # Seed data
│   ├── package.json                # Backend dependencies
│   ├── tsconfig.json               # TypeScript config
│   └── README.md                   # Backend docs
│
├── 📁 src/                          # Frontend Application
│   ├── 📁 components/              # React components
│   │   ├── 📁 admin/               # Admin dashboard
│   │   ├── 📁 client/              # Client dashboard
│   │   ├── 📁 direction/           # Direction dashboard
│   │   ├── 📁 auth/                # Authentication
│   │   ├── 📁 ui/                  # UI components
│   │   └── *.tsx                   # Shared components
│   ├── 📁 contexts/                # React Context
│   │   └── AuthContext.tsx         # Auth state
│   ├── 📁 services/                # API services
│   │   └── api.ts                  # API client
│   ├── 📁 assets/                  # Images & files
│   ├── 📁 styles/                  # Global styles
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Entry point
│   └── README.md                   # Frontend docs
│
├── 📁 Documentation/               # All documentation
│   ├── INDEX.md                    # Doc navigation
│   ├── ARCHITECTURE.md             # System design
│   ├── README.md                   # Doc overview
│   ├── PROJECT_STRUCTURE.md        # This file
│   └── *.md                        # Other docs
│
├── 📁 Configuration/               # Config guide
│   └── README.md                   # Config reference
│
├── 📄 index.html                   # HTML entry
├── 📄 package.json                 # Frontend deps
├── 📄 vite.config.ts               # Vite config
├── 📄 tsconfig.json                # TS config
└── 📄 README.md                    # Main README

```

## 🎯 Key Directories

### 🔧 Backend (`/backend`)

The backend directory contains the complete Express.js API server.

**Purpose:** Handle all business logic, database operations, and API endpoints.

**Key Features:**
- RESTful API endpoints
- PostgreSQL database with Prisma ORM
- JWT authentication
- Role-based access control

**Start Backend:**
```bash
cd backend
npm run dev
```

**Access:** `http://localhost:5000`

### 🎨 Frontend (`/src`)

The frontend directory contains the complete React application.

**Purpose:** User interface for clients, admins, and management.

**Key Features:**
- Role-based dashboards
- Real-time updates
- Responsive design
- Modern UI components

**Start Frontend:**
```bash
npm run dev
```

**Access:** `http://localhost:3000`

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
