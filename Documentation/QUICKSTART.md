# ⚡ Quick Start Guide - Auto Fleet

Get up and running with Auto Fleet in 5 minutes!

## 🎯 What You Need

✅ Node.js 18+ installed  
✅ PostgreSQL 14+ installed  
✅ npm or yarn  
✅ 10 minutes of your time

## 🚀 Installation (3 Steps)

### Step 1️⃣: Install Dependencies

```bash
# In project root (for frontend)
npm install

# In backend folder
cd backend
npm install
```

### Step 2️⃣: Setup Database

```bash
# Create PostgreSQL database
createdb car_rental

# In backend folder, configure .env
cd backend
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/car_rental"
```

### Step 3️⃣: Initialize Database

```bash
# In backend folder
npx prisma generate
npx prisma migrate dev
npx prisma:seed
```

## ▶️ Running the App (2 Terminals)

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

✅ Backend running on: `http://localhost:5000`

### Terminal 2 - Frontend

```bash
# In project root
npm run dev
```

✅ Frontend running on: `http://localhost:3000`

## 🔑 Test Accounts

Login with these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Client** | client@autofleet.tn | password123 |
| **Admin** | admin@autofleet.tn | password123 |
| **Direction** | direction@autofleet.tn | password123 |

## 🗂️ Project Structure (Simple View)

```
Your Project/
├── 📁 backend/        ← Backend API
│   └── npm run dev   → Port 5000
│
├── 📁 src/           ← Frontend React App  
│   └── npm run dev   → Port 3000
│
├── 📁 Documentation/ ← Help & Guides
│
└── 📁 Configuration/ ← Setup Info
```

## 🎨 What You'll See

After logging in, you'll see different dashboards based on your role:

### 👤 Client Dashboard
- Search and book vehicles
- View your rentals
- Report incidents
- Manage profile

### 👨‍💼 Admin Dashboard
- Manage vehicle fleet
- Handle bookings
- Track maintenance
- Manage users

### 👔 Direction Dashboard
- View analytics
- Generate reports
- Track KPIs
- Monitor performance

## 📚 Next Steps

1. **Read the docs:** [Documentation/INDEX.md](./Documentation/INDEX.md)
2. **Understand structure:** [Documentation/PROJECT_STRUCTURE.md](./Documentation/PROJECT_STRUCTURE.md)
3. **Learn API:** [backend/README.md](../backend/README.md)
4. **Explore frontend:** [src/README.md](../src/README.md)

## 🐛 Common Issues

### Port Already in Use?

```bash
# Change port in vite.config.ts
server: {
  port: 3001,  # Change from 3000
}
```

### Database Connection Error?

```bash
# Check PostgreSQL is running
pg_isready

# Verify .env file in backend/
cat backend/.env
```

### Module Not Found?

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 💡 Pro Tips

1. **Use 2 terminals** - One for backend, one for frontend
2. **Check console logs** - Errors show in browser console and terminal
3. **Prisma Studio** - Visual database browser (`npm run prisma:studio` in backend)
4. **Hot reload** - Both frontend and backend auto-reload on changes

## 🆘 Need Help?

- **Documentation:** [Documentation/INDEX.md](./Documentation/INDEX.md)
- **Architecture:** [Documentation/ARCHITECTURE.md](./Documentation/ARCHITECTURE.md)
- **Config Help:** [Configuration/README.md](./Configuration/README.md)
- **Main README:** [README.md](../README.md)

## ✅ Checklist

Before starting development, verify:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Database created
- [ ] `.env` file configured
- [ ] Database migrated
- [ ] Database seeded
- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 3000
- [ ] Can login with test accounts

---

**You're all set! 🎉** Start building amazing features!
