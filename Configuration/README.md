# ⚙️ Configuration Files

This directory serves as a reference guide for all configuration files in the project.

## 📍 Configuration File Locations

Due to build tool requirements, configuration files must remain at the **project root**. This README explains where to find and how to use each configuration file.

## 📋 Configuration Files

### Root Level Configuration

#### `package.json` (Root)
**Location:** `/package.json`

Main frontend dependencies and scripts.

```json
{
  "name": "Car Rental with Tracking",
  "scripts": {
    "dev": "vite",           // Start development server
    "build": "vite build"    // Build for production
  }
}
```

**Usage:**
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
```

#### `vite.config.ts` (Root)
**Location:** `/vite.config.ts`

Vite build tool configuration including:
- React plugin setup
- Path aliases (`@/` points to `./src`)
- Development server settings (port 3000)
- Build output directory

**Key Settings:**
```typescript
server: {
  port: 3000,
  open: true
}
```

#### `tsconfig.json` (Root)
**Location:** `/tsconfig.json`

TypeScript configuration for the frontend application.

**Key Settings:**
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path mappings for imports

#### `tsconfig.node.json` (Root)
**Location:** `/tsconfig.node.json`

TypeScript configuration for Node.js build scripts (Vite config files).

#### `index.html` (Root)
**Location:** `/index.html`

HTML entry point for the Vite application.

**Important:** This file must be at root for Vite to work correctly.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AutoFleet</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Backend Configuration

#### `backend/package.json`
**Location:** `/backend/package.json`

Backend dependencies and scripts.

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

#### `backend/tsconfig.json`
**Location:** `/backend/tsconfig.json`

TypeScript configuration for the backend.

#### `backend/.env`
**Location:** `/backend/.env`

**⚠️ IMPORTANT:** This file is NOT tracked in git (see `.gitignore`).

Copy from `.env.example`:
```bash
cd backend
cp .env.example .env
```

**Environment Variables:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/car_rental"
JWT_SECRET="your-secret-jwt-key"
PORT=5000
NODE_ENV=development
```

#### `backend/prisma/schema.prisma`
**Location:** `/backend/prisma/schema.prisma`

Prisma database schema defining all tables and relationships.

**Commands:**
```bash
cd backend
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open database GUI
```

## 🔧 Configuration Guidelines

### Development Environment

1. **Node.js Version:** 18+
2. **Package Manager:** npm
3. **Database:** PostgreSQL 14+

### Common Configuration Tasks

#### Change Frontend Port
Edit `vite.config.ts`:
```typescript
server: {
  port: 3001,  // Change from 3000 to 3001
  open: true
}
```

#### Change Backend Port
Edit `backend/.env`:
```env
PORT=5001  # Change from 5000 to 5001
```

#### Update Database Connection
Edit `backend/.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

#### Add New Dependency

**Frontend:**
```bash
npm install package-name
```

**Backend:**
```bash
cd backend
npm install package-name
```

#### Configure Path Aliases
Edit `vite.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    '@services': path.resolve(__dirname, './src/services'),
  }
}
```

## 📚 Related Documentation

- **[Backend README](../backend/README.md)** - Backend configuration details
- **[Frontend README](../src/README.md)** - Frontend configuration details
- **[Main README](../README.md)** - Project overview
- **[Architecture](../Documentation/ARCHITECTURE.md)** - System architecture

## 🔒 Security Notes

1. **Never commit `.env` files** - They contain secrets
2. **Use `.env.example`** - Template for required variables
3. **Rotate secrets regularly** - Especially `JWT_SECRET`
4. **Different secrets per environment** - Dev vs Production

## 🐛 Common Configuration Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port in vite.config.ts
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Out of Sync
```bash
cd backend
npx prisma generate
```

### TypeScript Errors
```bash
# Check configuration
npx tsc --noEmit

# Rebuild
npm run build
```

## 📝 Configuration Checklist

Before starting development:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Backend `.env` file created and configured
- [ ] Database created
- [ ] Prisma migrations run (`npm run prisma:migrate`)
- [ ] Database seeded (`npm run prisma:seed`)

---

**Note:** Configuration files must remain at their specified locations for the build tools to function correctly. This directory serves as a reference guide only.
