# Stations Database Integration

## Changes Made

### 1. Database Schema Update
Updated `backend/prisma/schema.prisma` to add missing fields to the Station model:
- `capacity`: Int (default: 20) - Maximum number of parking spots
- `openingHours`: String (default: "08:00 - 20:00") - Station operating hours
- `isOpen`: Boolean (default: true) - Station status

### 2. Backend API Enhancement
Updated `backend/src/routes/stations.ts` with full CRUD operations:
- **GET /api/stations** - Get all stations with availability info
- **GET /api/stations/:id** - Get specific station details
- **POST /api/stations** - Create new station (admin)
- **PUT /api/stations/:id** - Update station (admin)
- **PATCH /api/stations/:id/toggle** - Toggle station open/closed status
- **DELETE /api/stations/:id** - Delete station (admin)

### 3. Database Seed Update
Updated `backend/prisma/seed.ts` with 9 real stations across Tunisia:
- Tunis Centre
- Lac 2
- Sfax Centre
- Sousse Ville
- Monastir
- Nabeul
- Hammamet
- Djerba
- Tozeur

Each station includes:
- Full address and contact details
- GPS coordinates
- Capacity
- Opening hours
- Status (open/closed)

### 4. Frontend API Service
Updated `frontend/src/services/api.ts` with complete station service:
- `stationService.getAll()` - Fetch all stations
- `stationService.getById(id)` - Get station by ID
- `stationService.create(data)` - Create station
- `stationService.update(id, data)` - Update station
- `stationService.toggle(id)` - Toggle station status
- `stationService.delete(id)` - Delete station

### 5. Admin Stations Component
Updated `frontend/src/components/admin/AdminStations.tsx`:
- Replaced hardcoded data with real API calls
- Added loading state with spinner
- Implemented real-time CRUD operations
- Added form validation
- Integrated with backend API

### 6. Home Page Update
Updated `frontend/src/components/HomePage.tsx`:
- Cities are now fetched dynamically from the database
- Fallback to default cities if API fails
- Displays unique cities from all stations

## How to Use

### Running Migration
```bash
cd backend
npx prisma migrate dev --name add_station_fields
```

### Seeding Database
```bash
cd backend
npx ts-node prisma/seed.ts
```

### Testing API
```bash
curl http://localhost:5000/api/stations
```

## Features
- ✅ Real-time station data from PostgreSQL database
- ✅ Full CRUD operations for admins
- ✅ Station availability tracking
- ✅ Vehicle count per station
- ✅ Open/Close station toggle
- ✅ Dynamic city list on home page
- ✅ 9 stations across Tunisia with real addresses

## Next Steps
You can now:
1. Add/edit/delete stations from the admin panel
2. Toggle station status (open/closed)
3. View real-time availability
4. Track vehicles per station
