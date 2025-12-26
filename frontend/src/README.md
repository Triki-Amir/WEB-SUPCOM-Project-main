# 🎨 Auto Fleet - Frontend Application

Modern React-based frontend for the Auto Fleet car rental management system.

## 📋 Overview

A responsive, role-based single-page application built with React, TypeScript, and Tailwind CSS. The application provides distinct interfaces for clients, administrators, and management.

## 🛠️ Technology Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library
- **React Hook Form** - Form management

## 📁 Structure

```
src/
├── components/              # React components
│   ├── admin/              # Admin dashboard components
│   │   ├── AdminDashboard.tsx
│   │   ├── FleetManagement.tsx
│   │   ├── BookingManagement.tsx
│   │   └── ...
│   ├── client/             # Client dashboard components
│   │   ├── ClientDashboard.tsx
│   │   ├── VehicleSearch.tsx
│   │   ├── MyBookings.tsx
│   │   └── ...
│   ├── direction/          # Direction dashboard components
│   │   ├── DirectionDashboard.tsx
│   │   ├── Analytics.tsx
│   │   └── ...
│   ├── auth/               # Authentication components
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── HomePage.tsx        # Landing page
│   ├── VehicleCard.tsx     # Vehicle display card
│   └── ...                 # Other shared components
├── contexts/               # React Context providers
│   └── AuthContext.tsx     # Authentication state
├── services/               # API communication
│   └── api.ts             # Centralized API service
├── assets/                 # Static assets
│   ├── images/            # Image files
│   └── icons/             # Icon files
├── styles/                 # Global styles
│   └── globals.css        # Global CSS
├── App.tsx                 # Root component
├── main.tsx               # Application entry point
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see `/backend/README.md`)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment (optional):**
   Create `.env` in project root if you need to customize:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```
Application runs on `http://localhost:3000` with hot-reload.

**Production build:**
```bash
npm run build
```
Builds to `/build` directory.

## 👥 User Roles & Features

### 🧑‍💼 Client Dashboard

Available after login with client role:

- **Vehicle Search & Booking**
  - Search vehicles by type, location, dates
  - View vehicle details and availability
  - Create new bookings
  
- **My Bookings**
  - View active and past rentals
  - Track current rental status
  - Cancel upcoming bookings

- **Incident Reporting**
  - Report vehicle issues
  - Track incident status
  - Upload incident photos

- **Profile Management**
  - Update personal information
  - View notification history
  - Manage preferences

### 👨‍💼 Admin Dashboard

Available for admin role:

- **Fleet Management**
  - Add/edit/delete vehicles
  - Track vehicle status
  - Manage vehicle availability
  - View vehicle history

- **Booking Management**
  - View all bookings
  - Approve/reject bookings
  - Modify booking details
  - Handle cancellations

- **Station Management**
  - Manage pickup/dropoff locations
  - Update station details
  - View station statistics

- **User Management**
  - View all users
  - Modify user roles
  - Handle user issues

- **Maintenance Tracking**
  - Schedule maintenance
  - Track maintenance history
  - Update maintenance status

- **Incident Management**
  - Review incident reports
  - Update incident status
  - Assign to maintenance

### 👔 Direction Dashboard

Available for direction role:

- **Analytics & KPIs**
  - Revenue statistics
  - Booking trends
  - Fleet utilization
  - Customer satisfaction

- **Reports**
  - Monthly/quarterly reports
  - Performance metrics
  - Financial summaries
  - Growth indicators

- **Business Intelligence**
  - Interactive charts
  - Data visualization
  - Comparative analysis
  - Predictive insights

## 🎨 Component Architecture

### State Management

**Global State:**
- `AuthContext` - User authentication and authorization

**Local State:**
- Component state with `useState`
- Form state with React Hook Form
- UI state (modals, tabs, etc.)

### Component Patterns

**Compound Components:**
Used for complex UI elements like cards, dialogs, and forms.

**Controlled Components:**
Form inputs managed through React Hook Form.

**Presentational Components:**
UI components in `/components/ui` are pure and reusable.

**Container Components:**
Dashboard components handle business logic and data fetching.

## 🔌 API Integration

API calls are centralized in `/services/api.ts`:

```typescript
import { api } from '@/services/api';

// Get vehicles
const vehicles = await api.vehicles.getAll({ type: 'SUV' });

// Create booking
const booking = await api.bookings.create({
  vehicleId: '123',
  startDate: '2025-01-01',
  endDate: '2025-01-05',
  pickupStationId: 'station1',
  returnStationId: 'station1'
});

// Report incident
const incident = await api.incidents.report({
  bookingId: 'booking123',
  description: 'Flat tire',
  severity: 'medium'
});
```

See `/services/api.ts` for all available methods.

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with a custom theme:

**Primary Colors:**
- `#0B2E33` - Dark blue (primary)
- `#4F7C82` - Medium blue (secondary)
- `#B8E3E9` - Light blue (accent)
- `#f8f9fa` - Background

**Usage:**
```tsx
<div className="bg-[#0B2E33] text-white p-4 rounded-lg">
  Content
</div>
```

### Component Library

Radix UI components are styled with Tailwind in `/components/ui`.

### Custom Styles

Global styles in `/styles/globals.css` for:
- Reset and normalization
- Typography
- Custom utilities

## 🔐 Authentication Flow

1. User logs in via `LoginPage`
2. Backend returns JWT token
3. Token stored in `AuthContext`
4. Protected routes check authentication
5. Role-based component rendering

```tsx
const { user, login, logout } = useAuth();

if (user.role === 'client') {
  return <ClientDashboard />;
}
```

## 📱 Responsive Design

- **Mobile**: < 768px - Optimized layouts
- **Tablet**: 768px - 1024px - Adapted interfaces
- **Desktop**: > 1024px - Full features

All components are mobile-first and responsive.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login/logout functionality
- [ ] Role-based access control
- [ ] Vehicle search and booking
- [ ] Dashboard data loading
- [ ] Form validation
- [ ] Responsive layouts
- [ ] Error handling

### Test Accounts

Use these credentials (after backend seeding):

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
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🔧 Configuration

### Vite Configuration

See `/Configuration/vite.config.ts` for build settings.

### TypeScript

TypeScript configuration in `/Configuration/tsconfig.json`.

### Path Aliases

```typescript
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
```

## 🐛 Troubleshooting

**Development server won't start:**
- Check port 3000 is available
- Clear node_modules and reinstall
- Check for syntax errors

**API calls failing:**
- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` configuration
- Inspect network tab for errors

**Build errors:**
- Run `npm run build` to see detailed errors
- Check TypeScript errors
- Verify all imports are correct

## 📚 Documentation

For complete project documentation:
- [ARCHITECTURE.md](../Documentation/ARCHITECTURE.md) - System architecture
- [Frontend Architecture](../Documentation/architecture_frontend.md) - Frontend details
- [Design System](../Documentation/justification_du_choix_du_theme.md) - Theme and styling

## 🤝 Contributing

1. Follow React best practices
2. Use TypeScript for type safety
3. Create reusable components
4. Follow existing code style
5. Test on multiple screen sizes
6. Document complex components

## 🚀 Performance

- Code splitting with React.lazy
- Optimized images
- Minimal bundle size
- Efficient re-renders
- Cached API responses

## 📄 License

MIT License - See project root for details.

---

**Need help?** Check the [Documentation](../Documentation) or contact the development team.
