# PostgreSQL Docker Setup Guide

## Prerequisites
- Docker installed on your system ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Start PostgreSQL Container

```bash
# Navigate to project root
cd c:\Users\User\OneDrive\Documents\GitHub\WEB-SUPCOM-Project-main

# Start the PostgreSQL container
docker-compose up -d
```

### 2. Verify Container is Running

```bash
# Check if container is running
docker-compose ps

# View logs
docker-compose logs postgres
```

### 3. Initialize the Database with Prisma

```bash
# Navigate to backend directory
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# (Optional) Seed database with initial data
npm run prisma:seed
```

## Available Commands

### Database Operations

```bash
# Start containers
docker-compose up -d

# Stop containers (data persists)
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# View container status
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# View live logs (follow mode)
docker-compose logs -f postgres
```

### Prisma Operations

```bash
# From backend/ folder

# Generate Prisma Client
npm run prisma:generate

# Run pending migrations
npm run prisma:migrate

# Open Prisma Studio (GUI to view/edit data)
npm run prisma:studio

# Seed database with test data
npm run prisma:seed
```

## Connecting to the Database

### Option 1: Using Prisma Studio (Recommended)
```bash
cd backend
npm run prisma:studio
```
Opens a browser interface at `http://localhost:5555` to view and edit data.

### Option 2: Using psql CLI
```bash
# Connect to the database
docker exec -it car-rental-db psql -U carrentaluser -d car_rental_db

# Inside psql, useful commands:
\dt                  # List all tables
\d tablename         # Describe table structure
SELECT * FROM tablename;  # Query data
\q                   # Exit
```

### Option 3: Using DBeaver or pgAdmin
- **DBeaver**: Free GUI tool for database management
  - Host: `localhost`
  - Port: `5432`
  - User: `carrentaluser`
  - Password: `carrentalpass123`
  - Database: `car_rental_db`

## Environment Variables

The `.env` file in `backend/` contains:

```
DATABASE_URL=postgresql://carrentaluser:carrentalpass123@localhost:5432/car_rental_db
```

**⚠️ Important**: Never commit `.env` to git with production passwords. Update for production use.

## Troubleshooting

### Port 5432 Already in Use

```bash
# Find what's using port 5432
netstat -ano | findstr :5432

# Either stop that service or change port in docker-compose.yml
# Change "5432:5432" to "5433:5432" to use port 5433 instead
```

### Container Fails to Start

```bash
# View detailed error logs
docker-compose logs postgres

# Try rebuilding
docker-compose down
docker-compose up -d --build
```

### Can't Connect to Database

```bash
# Check if container is running
docker-compose ps

# Ensure .env file exists in backend/ folder
# Verify DATABASE_URL is correct

# Test connection
docker exec car-rental-db psql -U carrentaluser -d car_rental_db -c "SELECT 1"
```

### Migration Issues

```bash
# Reset database (⚠️ deletes all data)
cd backend
npm run prisma:migrate reset

# Or manually reset Docker
docker-compose down -v
docker-compose up -d
npm run prisma:migrate
```

## Full Workflow Example

```bash
# 1. Start fresh
docker-compose down -v
docker-compose up -d

# 2. Wait for database to be ready (~5 seconds)
# 3. Run migrations
cd backend
npm run prisma:generate
npm run prisma:migrate

# 4. (Optional) Add seed data
npm run prisma:seed

# 5. View data (optional)
npm run prisma:studio

# 6. Start backend server
npm run dev
```

## Security Notes

- Change default credentials in `.env` before production
- Never commit `.env` to version control
- Use strong passwords in production
- Store `.env` in your `.gitignore`

## Next Steps

1. Verify the database is running: `docker-compose ps`
2. Check backend connection: `npm run prisma:studio` (from backend folder)
3. Create seed data if needed: `npm run prisma:seed`
4. Start your application: `npm run dev`
