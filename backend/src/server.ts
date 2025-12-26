import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import vehiclesRoutes from './routes/vehicles';
import bookingsRoutes from './routes/bookings';
import stationsRoutes from './routes/stations';
import incidentsRoutes from './routes/incidents';
import usersRoutes from './routes/users';
import maintenanceRoutes from './routes/maintenance';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/stations', stationsRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Car Rental API is running' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
