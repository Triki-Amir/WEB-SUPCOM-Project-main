# 🔗 Architecture & Integration Guide

<div align="center">
<img src="../frontend/src/assets/logo.png" alt="Auto Fleet" width="80" />
</div>

---

Complete frontend-backend integration documentation with data flow details.

**Integration:** RESTful API • JWT Auth • Role-Based Access • Real-Time Updates

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                              │
│                         Port: 3000 (dev) / 5173 (default)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌─────────────────┐            │
│  │   main.tsx   │──────│   App.tsx    │──────│  Components     │            │
│  └──────────────┘      └──────────────┘      └─────────────────┘            │
│         │                     │                      │                       │
│         │                     ▼                      │                       │
│         │            ┌─────────────────┐             │                       │
│         │            │  AuthContext    │◄────────────┘                       │
│         │            │  (State Mgmt)   │                                     │
│         │            └─────────────────┘                                     │
│         │                     │                                              │
│         └─────────────────────┼──────────────────────┐                       │
│                               ▼                      │                       │
│                      ┌──────────────────┐            │                       │
│                      │   api.ts         │◄───────────┘                       │
│                      │  (API Services)  │                                    │
│                      │  - authService   │                                    │
│                      │  - vehicleService│                                    │
│                      │  - bookingService│                                    │
│                      │  - userService   │                                    │
│                      │  - analyticsService                                   │
│                      └──────────────────┘                                    │
│                               │                                              │
└───────────────────────────────┼──────────────────────────────────────────────┘
                                │
                                │ HTTP/REST (JSON)
                                │ Authorization: Bearer <JWT-token>
                                │ CORS: localhost:3000, localhost:5173
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + TypeScript)                            │
│                         Port: 5000                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐                                                            │
│  │  server.ts   │──► CORS Middleware (cors: 2.8.5)                          │
│  └──────────────┘    JSON Parser (express.json)                             │
│         │            Health Check (/health)                                 │
│         │            Error Handler                                          │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                    Route Handlers                                │        │
│  │  /api/auth       /api/vehicles    /api/bookings                 │        │
│  │  /api/stations   /api/incidents   /api/users                    │        │
│  │  /api/maintenance  /api/notifications  /api/analytics           │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│         │                    │              │            │                   │
│         ▼                    ▼              ▼            ▼                   │
│  ┌─────────────┐      ┌─────────────┐ ┌─────────────┐ ┌──────────────┐     │
│  │   auth.ts   │      │ vehicles.ts │ │ bookings.ts │ │ analytics.ts │     │
│  └─────────────┘      └─────────────┘ └─────────────┘ └──────────────┘     │
│         │                    │              │                                │
│         ▼                    ▼              ▼                                │
│  ┌──────────────────────────────────────────────────┐                       │
│  │        Middleware (middleware/auth.ts)           │                       │
│  │  - authenticate() - Verify JWT (jsonwebtoken)   │                       │
│  │  - authorize(roles) - Check user permissions     │                       │
│  └──────────────────────────────────────────────────┘                       │
│                   │                                                          │
│                   ▼                                                          │
│         ┌──────────────────┐                                                │
│         │   prisma.ts      │                                                │
│         │  (ORM Client)    │                                                │
│         │  - Singleton     │                                                │
│         │  - Type-safe     │                                                │
│         └──────────────────┘                                                │
│                   │                                                          │
└───────────────────┼──────────────────────────────────────────────────────────┘
                    │
                    │ Prisma Query Engine (6.19.1)
                    │ PostgreSQL Protocol
                    ▼
         ┌─────────────────────┐
         │   PostgreSQL DB     │
         │   Port: 5432        │
         │   Database: car_rental
         │                     │
         │  Tables:            │
         │  - users            │
         │  - vehicles         │
         │  - stations         │
         │  - bookings         │
         │  - maintenance      │
         │  - incidents        │
         │  - notifications    │
         └─────────────────────┘
```

---

## 🔄 Data Flow & Request Lifecycle

### Example: User Login Flow

```
1. USER ACTION (Frontend)
   └─► components/auth/LoginPage.tsx
       └─► User clicks "Login" button
           └─► Calls AuthContext.login(email, password)

2. STATE MANAGEMENT
   └─► contexts/AuthContext.tsx
       └─► login() function
           └─► Calls authService.login(email, password)

3. API SERVICE LAYER
   └─► services/api.ts
       └─► authService.login()
           └─► Makes HTTP POST to /api/auth/login
           └─► Headers: { "Content-Type": "application/json" }
           └─► Body: { email, password }

4. BACKEND SERVER
   └─► backend/src/server.ts
       └─► Receives request at /api/auth
       └─► Routes to authRoutes

5. ROUTE HANDLER
   └─► backend/src/routes/auth.ts
       └─► POST /login handler
           ├─► Validates data with Zod schema
           ├─► Queries database via Prisma
           ├─► Compares password with bcrypt
           └─► Generates JWT token

6. DATABASE QUERY
   └─► backend/src/lib/prisma.ts
       └─► Prisma Client query
           └─► PostgreSQL database
               └─► Returns user data

7. RESPONSE (Backend → Frontend)
   └─► Returns JSON: { token, user: { id, email, name, role } }

8. FRONTEND PROCESSING
   └─► services/api.ts receives response
       └─► AuthContext.login() processes response
           ├─► Saves token to localStorage
           ├─► Updates user state
           └─► Shows success toast notification

9. UI UPDATE
   └─► App.tsx re-renders based on new user state
       └─► Displays appropriate dashboard (Client/Admin/Direction)
```

---

## 📂 File Structure & Responsibilities

### Frontend Structure

```
frontend/src/
├── main.tsx                        # Entry point - renders App with providers
├── App.tsx                         # Main component - routing & role-based rendering
├── contexts/
│   └── AuthContext.tsx            # Global auth state (user, token, login, logout)
├── services/
│   └── api.ts                     # Centralized API client (678 lines)
│       ├── authService            # login, register, logout, saveToken
│       ├── vehicleService         # getAll, getById, create, update, delete
│       ├── bookingService         # getAll, getAllBookings, create, cancel, confirm, start, complete
│       ├── stationService         # getAll, getById, create, update, toggle, delete
│       ├── incidentService        # getAll, getAllIncidents, create, updateStatus
│       ├── maintenanceService     # getAll, getById, create, complete, update, delete
│       ├── userService            # getAll, getMe, updateMe, changePassword, getById, updateRole, delete
│       ├── notificationService    # getAll, markAsRead, markAllAsRead
│       └── analyticsService       # getDashboard, getBookingTrends, getMonthlyRevenue, etc.
├── components/
│   ├── HomePage.tsx              # Landing page with hero section
│   ├── SearchPanel.tsx           # Vehicle search with filters
│   ├── VehicleCard.tsx           # Vehicle display card
│   ├── BookingDialog.tsx         # Booking creation modal
│   ├── ActiveRental.tsx          # Current rental display
│   ├── StationRecommendation.tsx # Station suggestions
│   ├── TechStack.tsx             # Technology showcase
│   ├── auth/
│   │   └── LoginPage.tsx         # Login/Register forms with Zod validation
│   ├── client/
│   │   ├── ClientDashboard.tsx   # Main client dashboard with tabs
│   │   ├── ClientSearch.tsx      # Vehicle search and booking
│   │   ├── ClientBookings.tsx    # Active bookings management
│   │   ├── ClientHistory.tsx     # Completed bookings history
│   │   ├── ClientIncidents.tsx   # Incident reporting and tracking
│   │   ├── ClientNotifications.tsx # Notification center
│   │   └── ClientProfile.tsx     # Profile management
│   ├── admin/
│   │   ├── AdminDashboard.tsx    # Admin main dashboard with tabs
│   │   ├── AdminStats.tsx        # Statistics overview
│   │   ├── AdminFleet.tsx        # Vehicle fleet management (CRUD)
│   │   ├── AdminBookings.tsx     # All bookings management
│   │   ├── AdminMaintenance.tsx  # Maintenance scheduling
│   │   ├── AdminStations.tsx     # Station management
│   │   ├── AdminUsers.tsx        # User management
│   │   └── AdminAlerts.tsx       # Incident management
│   ├── direction/
│   │   ├── DirectionDashboard.tsx # Director main view
│   │   ├── DirectionOverview.tsx  # High-level overview
│   │   ├── DirectionAnalytics.tsx # Detailed analytics with charts
│   │   └── DirectionReports.tsx   # Report generation
│   └── ui/                        # 50+ Radix UI components
│       ├── button.tsx            # Button variants
│       ├── card.tsx              # Card layouts
│       ├── dialog.tsx            # Modal dialogs
│       ├── table.tsx             # Data tables
│       ├── form.tsx              # Form components
│       ├── input.tsx             # Input fields
│       ├── select.tsx            # Dropdown selects
│       ├── badge.tsx             # Status badges
│       ├── calendar.tsx          # Date picker
│       ├── chart.tsx             # Recharts wrapper
│       └── ... (40+ more)
├── assets/
│   ├── logo.png                  # Application logo
│   ├── logo.svg                  # SVG logo
│   ├── home_page_screanshot.png  # Screenshots for docs
│   ├── login_screanshot.png
│   ├── user_interface_screanshot.png
│   ├── parc_admin_screanshot.png
│   └── 651c45b1865c51f174a583211861ca76520c7033.png # Tech stack
└── styles/
    └── globals.css               # Tailwind directives & custom styles
```

### Backend Structure

```
backend/
├── src/
│   ├── server.ts                      # Express server setup (50 lines)
│   │   ├── Middleware: CORS, JSON parser
│   │   ├── Routes: 9 route modules
│   │   ├── Health check endpoint
│   │   └── Global error handler
│   ├── index.ts                       # Alternative entry point
│   ├── middleware/
│   │   └── auth.ts                    # JWT authentication & authorization
│   │       ├── authenticate()         # Verify JWT token
│   │       └── authorize(roles)       # Check user role permissions
│   ├── routes/
│   │   ├── auth.ts                    # Authentication (109 lines)
│   │   │   ├── POST /register         # User registration with bcrypt
│   │   │   └── POST /login            # Login with JWT generation
│   │   ├── vehicles.ts                # Vehicle management (212+ lines)
│   │   │   ├── GET /                  # List with filters (status, category, city, dates)
│   │   │   ├── GET /:id               # Get details with station & bookings
│   │   │   ├── POST /                 # Create (Admin) - validates data
│   │   │   ├── PUT /:id               # Update (Admin)
│   │   │   └── DELETE /:id            # Delete (Admin) - checks bookings
│   │   ├── bookings.ts                # Booking management (379+ lines)
│   │   │   ├── GET /                  # User bookings
│   │   │   ├── GET /all               # All bookings (Admin/Direction)
│   │   │   ├── GET /:id               # Booking details
│   │   │   ├── POST /                 # Create - validates availability
│   │   │   ├── PATCH /:id/cancel      # Cancel booking
│   │   │   ├── PATCH /:id/confirm     # Confirm (Admin)
│   │   │   ├── PATCH /:id/start       # Start rental (Admin)
│   │   │   └── PATCH /:id/complete    # Complete rental (Admin)
│   │   ├── stations.ts                # Station management (150+ lines)
│   │   │   ├── GET /                  # List all with vehicle counts
│   │   │   ├── GET /:id               # Get details
│   │   │   ├── POST /                 # Create station
│   │   │   ├── PUT /:id               # Update station
│   │   │   ├── PATCH /:id/toggle      # Toggle open/closed
│   │   │   └── DELETE /:id            # Delete (checks vehicles)
│   │   ├── incidents.ts               # Incident management (189+ lines)
│   │   │   ├── GET /                  # User incidents
│   │   │   ├── GET /all               # All incidents (Admin/Direction)
│   │   │   ├── POST /                 # Report incident - creates notifications
│   │   │   └── PATCH /:id/status      # Update status (Admin)
│   │   ├── maintenance.ts             # Maintenance tracking (237+ lines)
│   │   │   ├── GET /                  # List all (Admin/Direction)
│   │   │   ├── GET /:id               # Get details
│   │   │   ├── POST /                 # Schedule - updates vehicle status
│   │   │   ├── PATCH /:id/complete    # Mark completed
│   │   │   ├── PUT /:id               # Update record
│   │   │   └── DELETE /:id            # Delete record
│   │   ├── users.ts                   # User management (212+ lines)
│   │   │   ├── GET /                  # List users (Admin)
│   │   │   ├── GET /me                # Current user profile
│   │   │   ├── PUT /me                # Update profile
│   │   │   ├── PUT /me/password       # Change password
│   │   │   ├── GET /:id               # Get user by ID (Admin/Direction)
│   │   │   ├── PATCH /:id/role        # Change role (Admin)
│   │   │   └── DELETE /:id            # Delete user (Admin)
│   │   ├── notifications.ts           # Notification system (39+ lines)
│   │   │   ├── GET /                  # User notifications
│   │   │   ├── PATCH /:id/read        # Mark as read
│   │   │   └── PATCH /read-all        # Mark all as read
│   │   └── analytics.ts               # Analytics & reports (500+ lines)
│   │       ├── GET /dashboard         # Dashboard statistics
│   │       ├── GET /bookings/trends   # Booking trends over time
│   │       ├── GET /revenue/monthly   # Monthly revenue analysis
│   │       ├── GET /vehicles/performance # Vehicle performance metrics
│   │       └── GET /stations/statistics  # Station-wise statistics
│   └── lib/
│       └── prisma.ts                  # Prisma client singleton
├── prisma/
│   ├── schema.prisma                  # Database schema (176 lines)
│   │   ├── 7 models (User, Vehicle, Station, Booking, etc.)
│   │   ├── 4 enums (UserRole, VehicleStatus, BookingStatus, IncidentStatus)
│   │   └── Relations & indexes
│   ├── seed.ts                        # Database seeding script
│   │   ├── Creates 3 test users (client, admin, direction)
│   │   ├── Creates 3 stations (Tunis, Sfax, Sousse)
│   │   ├── Creates 6 vehicles
│   │   ├── Creates 2 bookings
│   │   ├── Creates 1 incident
│   │   ├── Creates 1 maintenance record
│   │   └── Creates 2 notifications
│   └── migrations/                    # Migration history
│       └── 20251227132658_initial_complete_schema/
├── package.json                       # Dependencies & scripts
└── tsconfig.json                      # TypeScript configuration
```

---

## 🔗 Component Interactions

### 1. Authentication Flow

#### Files Involved:
- **Frontend**: `LoginPage.tsx` → `AuthContext.tsx` → `api.ts`
- **Backend**: `server.ts` → `routes/auth.ts` → `prisma.ts`

#### Code Flow:

**Frontend - LoginPage.tsx**
```typescript
// User submits login form
const handleLogin = async (email: string, password: string) => {
  await login(email, password); // Calls AuthContext function
};
```

**Frontend - AuthContext.tsx**
```typescript
const login = async (email: string, password: string) => {
  const response = await authService.login(email, password); // Calls API service
  authService.saveToken(response.token); // Store JWT token
  setUser(response.user); // Update global state
};
```

**Frontend - api.ts**
```typescript
export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', { // HTTP POST request
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};
```

**Backend - routes/auth.ts**
```typescript
router.post('/login', async (req, res) => {
  const user = await prisma.user.findUnique({ // Query database
    where: { email: data.email }
  });
  const token = jwt.sign({ id, email, role }, SECRET); // Generate JWT
  res.json({ token, user }); // Send response
});
```

---

### 2. Vehicle Search & Booking Flow

#### Files Involved:
- **Frontend**: `ClientSearch.tsx` → `api.ts` → `BookingDialog.tsx`
- **Backend**: `routes/vehicles.ts` → `routes/bookings.ts` → `prisma.ts`

#### Step-by-Step Process:

1. **User searches for vehicles**
   ```typescript
   // ClientSearch.tsx
   const vehicles = await vehicleService.getAll({
     type: selectedType,
     available: true,
     station: selectedStation
   });
   ```

2. **API makes request with filters**
   ```typescript
   // api.ts
   getAll: async (filters) => {
     const queryParams = new URLSearchParams();
     if (filters?.type) queryParams.append('type', filters.type);
     return apiRequest(`/vehicles?${queryParams}`);
   }
   ```

3. **Backend processes request**
   ```typescript
   // routes/vehicles.ts
   router.get('/', async (req, res) => {
     const { status, category, stationId } = req.query;
     const vehicles = await prisma.vehicle.findMany({
       where: { status, category, stationId },
       include: { station: true }
     });
     res.json(vehicles);
   });
   ```

4. **User selects vehicle and creates booking**
   ```typescript
   // BookingDialog.tsx
   const handleBooking = async () => {
     await bookingService.create({
       vehicleId, stationId, startDate, endDate, totalPrice
     });
   };
   ```

5. **Backend creates booking with authentication**
   ```typescript
   // routes/bookings.ts
   router.post('/', authenticate, async (req: AuthRequest, res) => {
     const booking = await prisma.booking.create({
       data: { ...req.body, userId: req.user!.id }
     });
     res.json(booking);
   });
   ```

---

### 3. Admin Dashboard Data Flow

#### Files Involved:
- **Frontend**: `AdminDashboard.tsx` → `AdminFleet.tsx` → `api.ts`
- **Backend**: `routes/vehicles.ts` → `routes/analytics.ts` → `middleware/auth.ts`

#### Protected Route Example:

**Frontend sends authenticated request:**
```typescript
// api.ts - apiRequest function
const token = getAuthToken(); // Get from localStorage
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // Include JWT token
};
```

**Backend validates token:**
```typescript
// middleware/auth.ts
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded; // Attach user info to request
  next();
};
```

**Backend checks authorization:**
```typescript
// routes/vehicles.ts
router.post('/', 
  authenticate, // Verify JWT token
  authorize('ADMIN'), // Check user role
  async (req: AuthRequest, res) => {
    // Only admins can create vehicles
  }
);
```

---

## 🔐 Authentication & Authorization System

### JWT Token Structure

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "CLIENT|ADMIN|DIRECTION",
  "iat": 1234567890,
  "exp": 1235172690
}
```

### Token Flow:

1. **Login**: Backend generates JWT token
2. **Storage**: Frontend stores token in `localStorage`
3. **Requests**: Frontend includes token in `Authorization` header
4. **Verification**: Backend middleware validates token on protected routes
5. **Logout**: Frontend removes token from `localStorage`

### Middleware Chain:

```
Request → CORS → JSON Parser → authenticate() → authorize() → Route Handler
```

---

## 🗄️ Database Schema & ORM

### Prisma ORM Architecture

```
┌─────────────────────┐
│  Backend Routes     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Prisma Client     │  (Generated from schema.prisma)
│   (prisma.ts)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   PostgreSQL DB     │
│   Tables:           │
│   - User            │
│   - Vehicle         │
│   - Booking         │
│   - Station         │
│   - Incident        │
│   - Maintenance     │
│   - Notification    │
└─────────────────────┘
```

### Key Models & Relationships

**User Model**
- Has many: Bookings, Incidents, Notifications
- Enum: UserRole (CLIENT, ADMIN, DIRECTION)

**Vehicle Model**
- Belongs to: Station
- Has many: Bookings, Maintenance records
- Enum: VehicleStatus (AVAILABLE, RENTED, MAINTENANCE, OUT_OF_SERVICE)

**Booking Model**
- Belongs to: User, Vehicle, Station
- Enum: BookingStatus (PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED)

---

## 🌐 API Endpoints Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user account | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Vehicle Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/vehicles` | Get all vehicles (with filters) | No | All |
| GET | `/api/vehicles/:id` | Get vehicle details | No | All |
| POST | `/api/vehicles` | Create new vehicle | Yes | ADMIN |
| PUT | `/api/vehicles/:id` | Update vehicle | Yes | ADMIN |
| DELETE | `/api/vehicles/:id` | Delete vehicle | Yes | ADMIN |

### Booking Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/bookings` | Get user's bookings | Yes | CLIENT |
| GET | `/api/bookings/all` | Get all bookings | Yes | ADMIN, DIRECTION |
| POST | `/api/bookings` | Create new booking | Yes | CLIENT |
| PUT | `/api/bookings/:id` | Update booking | Yes | CLIENT, ADMIN |
| DELETE | `/api/bookings/:id` | Cancel booking | Yes | CLIENT, ADMIN |

### Station Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/stations` | Get all stations | No | All |
| POST | `/api/stations` | Create station | Yes | ADMIN |
| PUT | `/api/stations/:id` | Update station | Yes | ADMIN |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | Get all users | Yes | ADMIN |
| GET | `/api/users/:id` | Get user details | Yes | All (own data) |
| PUT | `/api/users/:id` | Update user | Yes | All (own data), ADMIN |

### Incident Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/incidents` | Get incidents | Yes | CLIENT (own), ADMIN (all) |
| POST | `/api/incidents` | Report incident | Yes | CLIENT |
| PUT | `/api/incidents/:id` | Update incident status | Yes | ADMIN |

### Maintenance Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/maintenance` | Get maintenance records | Yes | ADMIN |
| POST | `/api/maintenance` | Schedule maintenance | Yes | ADMIN |
| PUT | `/api/maintenance/:id` | Update maintenance | Yes | ADMIN |

### Analytics Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/analytics/stats` | Get system statistics | Yes | DIRECTION |
| GET | `/api/analytics/revenue` | Get revenue data | Yes | DIRECTION |

---

## 🔧 Environment Configuration

### Frontend Environment Variables
```env
# .env (frontend root)
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend Environment Variables
```env
# .env (backend root)
PORT=5000
DATABASE_URL=postgresql://postgres:admin@localhost:5432/car_rental_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

---

## 🐳 Docker Setup

### Docker Compose Services

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: car_rental_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Starting the Application

1. **Start Database**
   ```bash
   docker-compose up -d
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📦 Dependencies & Technologies

### Frontend Stack
| Package | Purpose |
|---------|---------|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Radix UI** | Accessible component primitives |
| **Tailwind CSS** | Utility-first CSS |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |
| **date-fns** | Date manipulation |

### Backend Stack
| Package | Purpose |
|---------|---------|
| **Express** | Web server framework |
| **TypeScript** | Type safety |
| **Prisma** | ORM for PostgreSQL |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Zod** | Schema validation |
| **CORS** | Cross-origin requests |
| **dotenv** | Environment variables |

### Database
- **PostgreSQL 16** - Relational database (running in Docker)

---

## 🚀 Request/Response Examples

### Example 1: Login Request

**Frontend Request:**
```typescript
// POST http://localhost:5000/api/auth/login
{
  "email": "client@example.com",
  "password": "password123"
}
```

**Backend Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "client@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "CLIENT"
  }
}
```

### Example 2: Create Booking Request

**Frontend Request with Auth:**
```typescript
// POST http://localhost:5000/api/bookings
// Headers: { Authorization: "Bearer eyJhbGci..." }
{
  "vehicleId": "vehicle-uuid",
  "stationId": "station-uuid",
  "startDate": "2025-01-01T10:00:00Z",
  "endDate": "2025-01-05T10:00:00Z",
  "totalPrice": 250.00
}
```

**Backend Response:**
```json
{
  "id": "booking-uuid",
  "userId": "user-uuid",
  "vehicleId": "vehicle-uuid",
  "stationId": "station-uuid",
  "startDate": "2025-01-01T10:00:00Z",
  "endDate": "2025-01-05T10:00:00Z",
  "status": "PENDING",
  "totalPrice": 250.00,
  "createdAt": "2024-12-27T12:00:00Z"
}
```

---

## 🔍 Error Handling

### Frontend Error Handling
```typescript
// api.ts
try {
  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return await response.json();
} catch (error) {
  console.error('API Request Error:', error);
  toast.error(error.message); // Show user-friendly error
  throw error;
}
```

### Backend Error Handling
```typescript
// routes/bookings.ts
try {
  const booking = await prisma.booking.create({ data });
  res.json(booking);
} catch (error) {
  console.error('Booking creation error:', error);
  res.status(500).json({ 
    error: 'Erreur lors de la création de la réservation' 
  });
}
```

---

## 🎯 Key Interaction Patterns

### Pattern 1: Centralized API Service
- All API calls go through `services/api.ts`
- Consistent error handling
- Automatic authentication header injection
- Type-safe responses

### Pattern 2: Context-Based State Management
- `AuthContext` manages global auth state
- Components consume context via `useAuth()` hook
- Automatic UI updates on state changes

### Pattern 3: Role-Based Access Control
- Frontend: Conditional rendering based on user role
- Backend: Middleware chain validates permissions
- Three roles: CLIENT, ADMIN, DIRECTION

### Pattern 4: RESTful API Design
- Resource-based URLs (`/api/vehicles`, `/api/bookings`)
- HTTP methods for actions (GET, POST, PUT, DELETE)
- JSON request/response format
- Consistent error responses

---

## 📝 Development Workflow

### Adding a New Feature

1. **Database Schema** (if needed)
   - Update `prisma/schema.prisma`
   - Run `npx prisma migrate dev`

2. **Backend Route**
   - Create/update route in `backend/src/routes/`
   - Add authentication/authorization middleware
   - Implement database queries with Prisma

3. **Frontend API Service**
   - Add service methods in `frontend/src/services/api.ts`
   - Define TypeScript interfaces

4. **Frontend Component**
   - Create UI component
   - Use API service methods
   - Handle loading/error states

5. **Integration**
   - Test end-to-end flow
   - Verify authentication
   - Check error handling

---

## 🔒 Security Considerations

1. **JWT Tokens**: 7-day expiration, stored in localStorage
2. **Password Hashing**: bcrypt with salt rounds
3. **CORS**: Configured to accept frontend origin
4. **Input Validation**: Zod schemas on backend
5. **SQL Injection**: Protected by Prisma ORM
6. **Role-Based Access**: Middleware authorization checks

---

## 📚 Additional Documentation

- [STRUCTURE_OVERVIEW.md](./STRUCTURE_OVERVIEW.md) - Project structure details
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation instructions
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Docker configuration
- [INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md) - Feature status

---

## 🤝 Contributing

When adding new features, ensure:
1. Backend routes are properly authenticated
2. Frontend API services are type-safe
3. Error handling is implemented
4. Database migrations are created
5. Documentation is updated

---

**Last Updated**: December 27, 2025
