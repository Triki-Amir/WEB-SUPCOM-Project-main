# 🏗️ Auto Fleet - System Architecture

## Overview

Auto Fleet is a modern car rental management system built with a clean separation between frontend and backend, following industry best practices for maintainability and scalability.

## 📁 Project Structure

```
WEB-SUPCOM-Project/
│
├── backend/                         # Backend (API)
│   ├── src/                         # Backend source code (Express)
│   │   ├── routes/                 # API route handlers
│   │   ├── middleware/             # Express middleware (auth, validation)
│   │   ├── server.ts               # Express server setup
│   │   └── index.ts                # Application entry point
│   ├── prisma/                      # Prisma schema & database
│   │   ├── schema.prisma           # Database schema definition
│   │   └── seed.ts                 # Database seeding script
│   ├── package.json                # Backend dependencies
│   └── README.md                   # Backend documentation
│
├── src/                             # Frontend (React – single app)
│   ├── components/                 # UI components
│   │   ├── admin/                  # Admin dashboard components
│   │   ├── client/                 # Client dashboard components
│   │   ├── direction/              # Direction dashboard components
│   │   ├── auth/                   # Authentication components
│   │   ├── ui/                     # Shared UI components (buttons, cards, etc.)
│   │   └── *.tsx                   # Shared components
│   ├── contexts/                   # React Contexts
│   │   └── AuthContext.tsx         # Authentication state management
│   ├── services/                   # API services
│   │   └── api.ts                  # API client and requests
│   ├── assets/                     # Static assets (images, icons)
│   ├── styles/                     # Global styles
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # React application entry point
│   └── README.md                   # Frontend documentation
│
├── Documentation/                  # Project documentation
│   ├── INDEX.md                    # Navigation / table of contents
│   ├── ARCHITECTURE.md             # This file - System architecture
│   ├── README.md                   # Main documentation guide
│   ├── architecture_frontend.md    # Frontend architecture details
│   ├── figma_import_steps.md       # Design import workflow
│   ├── justification_du_choix_du_theme.md  # Theme selection
│   ├── README_DEVELOPMENT.md       # Development setup guide
│   ├── Guidelines.md               # Coding guidelines
│   └── Attributions.md             # Credits and attributions
│
├── Configuration/                  # Configuration guide
│   └── README.md                   # Guide to all configuration files
│
├── index.html                      # Vite HTML entry point
├── package.json                    # Frontend dependencies & scripts
├── vite.config.ts                  # Vite build configuration
└── README.md                       # Global project overview
```

## 🎯 Architecture Principles

### 1. Separation of Concerns
- **Frontend**: Pure React application focused on UI/UX
- **Backend**: RESTful API handling business logic and data
- **Configuration**: Centralized configuration management
- **Documentation**: Standalone, comprehensive documentation

### 2. Modularity
- Components organized by feature and role (admin, client, direction)
- Shared UI components in `/src/components/ui`
- Reusable services for API communication

### 3. Scalability
- Role-based architecture allowing easy addition of new user types
- Modular component structure for feature expansion
- Prisma ORM for flexible database schema evolution

## 🔧 Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization
- **Framer Motion**: Smooth animations

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **TypeScript**: Type-safe backend code
- **Prisma**: Modern ORM
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Zod**: Runtime type validation

## 🔐 Authentication Flow

```
User Login
    ↓
Credentials Validation (Backend)
    ↓
JWT Token Generation
    ↓
Token Storage (Frontend - AuthContext)
    ↓
Protected Routes Access
    ↓
Role-Based Component Rendering
```

### Roles:
1. **Client**: Book vehicles, view rentals, report incidents
2. **Admin**: Manage fleet, bookings, maintenance, users
3. **Direction**: View analytics, reports, KPIs

## 🗄️ Database Schema

### Key Entities:
- **User**: Authentication and profile information
- **Vehicle**: Fleet inventory
- **Station**: Pickup/dropoff locations
- **Booking**: Rental reservations
- **Incident**: Issue reporting and tracking
- **Maintenance**: Vehicle maintenance records
- **Notification**: User notifications

### Relationships:
- User → Bookings (one-to-many)
- Vehicle → Bookings (one-to-many)
- Vehicle → Maintenance (one-to-many)
- Booking → Incidents (one-to-many)

## 🌐 API Architecture

### RESTful Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Vehicles
- `GET /api/vehicles` - List vehicles (with filters)
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle (admin)
- `PUT /api/vehicles/:id` - Update vehicle (admin)

#### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking

#### Stations
- `GET /api/stations` - List all stations

#### Incidents
- `GET /api/incidents` - List user incidents
- `POST /api/incidents` - Report incident

#### Users (Admin)
- `GET /api/users` - List all users

#### Maintenance (Admin)
- `GET /api/maintenance` - List maintenance records

## 🔄 Component Architecture

### State Management
- **AuthContext**: Global authentication state
- **Component State**: Local UI state with useState/useReducer
- **Form State**: React Hook Form for complex forms

### Component Hierarchy

```
App (AuthProvider)
  ├── HomePage (Public)
  ├── LoginPage (Public)
  └── Dashboard (Protected)
      ├── ClientDashboard
      │   ├── VehicleSearch
      │   ├── MyBookings
      │   └── IncidentReporting
      ├── AdminDashboard
      │   ├── FleetManagement
      │   ├── BookingManagement
      │   ├── UserManagement
      │   └── MaintenanceTracking
      └── DirectionDashboard
          ├── Analytics
          ├── Reports
          └── KPIs
```

## 📦 Build & Deployment

### Development
```bash
# Frontend
npm run dev          # Starts Vite dev server on port 3000

# Backend
cd backend
npm run dev          # Starts Express server on port 5000
```

### Production
```bash
# Frontend
npm run build        # Builds to /build directory

# Backend
cd backend
npm run build        # Compiles TypeScript to /dist
npm start            # Runs production server
```

## 🔒 Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Password Security**: Bcrypt hashing (10 rounds)
3. **API Validation**: Zod schemas for request validation
4. **Role-Based Access**: Middleware-enforced permissions
5. **CORS**: Configured for specific origins
6. **SQL Injection**: Protected by Prisma ORM

## 🚀 Future Enhancements

1. **Real-time Features**: WebSocket for live notifications
2. **Payment Integration**: Stripe or PayPal for online payments
3. **Mobile App**: React Native application
4. **Advanced Analytics**: ML-based predictions
5. **Multi-language**: i18n support
6. **Testing**: Comprehensive unit and integration tests

## 📊 Performance Optimization

1. **Code Splitting**: Lazy loading for route components
2. **Image Optimization**: Compressed assets
3. **Database Indexing**: Optimized Prisma queries
4. **Caching**: API response caching strategies
5. **Bundle Optimization**: Vite's optimized builds

## 🧪 Testing Strategy

### Frontend
- Component testing with React Testing Library
- E2E testing with Playwright/Cypress
- Visual regression testing

### Backend
- Unit tests for business logic
- Integration tests for API endpoints
- Database migration testing

## 📈 Monitoring & Logging

1. **Application Logs**: Structured logging
2. **Error Tracking**: Centralized error monitoring
3. **Performance Monitoring**: API response times
4. **Database Monitoring**: Query performance
5. **User Analytics**: Usage patterns and metrics

---

For more detailed information on specific components, please refer to the respective documentation files in the `/Documentation` directory.
