┌─────────────────────────────────────────────────────────────────┐
│ LAYER 1: FRONTEND COMPONENTS (React)                            │
│ Location: frontend/src/components/                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User clicks "Login" button in LoginPage.tsx                   │
│         │                                                        │
│         ▼                                                        │
│  const handleLogin = (email, password) => {                     │
│    await login(email, password)  // Calls AuthContext          │
│  }                                                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 2: STATE MANAGEMENT (React Context)                      │
│ Location: frontend/src/contexts/AuthContext.tsx                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  const login = async (email, password) => {                    │
│    setIsLoading(true);                                         │
│    const response = await authService.login(email, password);  │
│    authService.saveToken(response.token);                      │
│    setUser(response.user);                                     │
│    toast.success("Connexion réussie!");                        │
│  }                                                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 3: API SERVICE (HTTP Client)                             │
│ Location: frontend/src/services/api.ts                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  authService.login = async (email, password) => {              │
│    return apiRequest('/auth/login', {                          │
│      method: 'POST',                                           │
│      body: JSON.stringify({ email, password })                 │
│    });                                                         │
│  }                                                             │
│                                                                │
│  apiRequest adds:                                              │
│  • Content-Type: application/json                             │
│  • Authorization: Bearer <token> (if exists)                  │
│  • Base URL: http://localhost:5000/api                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP POST Request
                          │ URL: http://localhost:5000/api/auth/login
                          │ Headers: { Content-Type: application/json }
                          │ Body: { email, password }
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 4: BACKEND SERVER (Express)                              │
│ Location: backend/src/server.ts                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  app.use(cors());           // Allow frontend requests         │
│  app.use(express.json());   // Parse JSON body                 │
│                                                                │
│  Request arrives → Middleware chain:                            │
│  1. CORS validation                                            │
│  2. JSON parsing                                               │
│  3. Route matching: app.use('/api/auth', authRoutes)          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 5: ROUTE HANDLER                                         │
│ Location: backend/src/routes/auth.ts                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  router.post('/login', async (req, res) => {                  │
│    // 1. Validate input with Zod                              │
│    const data = loginSchema.parse(req.body);                  │
│                                                                │
│    // 2. Query database via Prisma                            │
│    const user = await prisma.user.findUnique({                │
│      where: { email: data.email }                             │
│    });                                                         │
│                                                                │
│    // 3. Verify password with bcrypt                          │
│    const valid = await bcrypt.compare(                        │
│      data.password, user.password                             │
│    );                                                          │
│                                                                │
│    // 4. Generate JWT token                                   │
│    const token = jwt.sign(                                    │
│      { id: user.id, email: user.email, role: user.role },    │
│      process.env.JWT_SECRET,                                  │
│      { expiresIn: '7d' }                                      │
│    );                                                          │
│                                                                │
│    // 5. Send response                                        │
│    res.json({ token, user: {...} });                         │
│  });                                                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 6: DATABASE (PostgreSQL + Prisma ORM)                    │
│ Location: backend/src/lib/prisma.ts                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Prisma Client:                                                │
│  • Translates JavaScript queries → SQL                        │
│  • Executes: SELECT * FROM users WHERE email = ?              │
│  • Returns typed user object                                   │
│  • Handles connection pooling & transactions                   │
└─────────────────────────────────────────────────────────────────┘