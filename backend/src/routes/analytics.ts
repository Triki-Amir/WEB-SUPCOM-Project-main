import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get dashboard statistics (admin and direction only)
router.get('/dashboard', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Get various statistics
    const [
      totalVehicles,
      availableVehicles,
      rentedVehicles,
      maintenanceVehicles,
      totalBookings,
      pendingBookings,
      activeBookings,
      completedBookings,
      totalRevenue,
      totalUsers,
      totalStations,
      openIncidents
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { status: 'RENTED' } }),
      prisma.vehicle.count({ where: { status: 'MAINTENANCE' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'ACTIVE' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.aggregate({
        where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
        _sum: { totalPrice: true }
      }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.station.count(),
      prisma.incident.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } })
    ]);

    res.json({
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        rented: rentedVehicles,
        maintenance: maintenanceVehicles,
        utilizationRate: totalVehicles > 0 ? ((rentedVehicles / totalVehicles) * 100).toFixed(2) : 0
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        active: activeBookings,
        completed: completedBookings
      },
      revenue: {
        total: totalRevenue._sum.totalPrice || 0,
        averagePerBooking: completedBookings > 0 ? ((totalRevenue._sum.totalPrice || 0) / completedBookings).toFixed(2) : 0
      },
      users: {
        total: totalUsers
      },
      stations: {
        total: totalStations
      },
      incidents: {
        open: openIncidents
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Get booking trends (admin and direction only)
router.get('/bookings/trends', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        totalPrice: true,
        status: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const trendsMap = new Map<string, { count: number; revenue: number }>();
    
    bookings.forEach(booking => {
      const date = booking.createdAt.toISOString().split('T')[0];
      const existing = trendsMap.get(date) || { count: 0, revenue: 0 };
      existing.count += 1;
      if (booking.status === 'COMPLETED' || booking.status === 'ACTIVE') {
        existing.revenue += booking.totalPrice;
      }
      trendsMap.set(date, existing);
    });

    const trends = Array.from(trendsMap.entries()).map(([date, data]) => ({
      date,
      bookings: data.count,
      revenue: data.revenue
    }));

    res.json(trends);
  } catch (error) {
    console.error('Error fetching booking trends:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tendances' });
  }
});

// Get vehicle performance (admin and direction only)
router.get('/vehicles/performance', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const vehicles = await prisma.vehicle.findMany({
      include: {
        _count: {
          select: {
            bookings: true
          }
        },
        bookings: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            totalPrice: true
          }
        },
        station: {
          select: {
            name: true,
            city: true
          }
        }
      }
    });

    const performance = vehicles.map(vehicle => ({
      id: vehicle.id,
      name: `${vehicle.brand} ${vehicle.model}`,
      category: vehicle.category,
      station: vehicle.station.name,
      city: vehicle.station.city,
      totalBookings: vehicle._count.bookings,
      totalRevenue: vehicle.bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      status: vehicle.status,
      mileage: vehicle.mileage
    }));

    // Sort by revenue
    performance.sort((a, b) => b.totalRevenue - a.totalRevenue);

    res.json(performance);
  } catch (error) {
    console.error('Error fetching vehicle performance:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des performances' });
  }
});

// Get station statistics (admin and direction only)
router.get('/stations/statistics', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const stations = await prisma.station.findMany({
      include: {
        _count: {
          select: {
            vehicles: true,
            bookings: true
          }
        },
        bookings: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            totalPrice: true
          }
        }
      }
    });

    const statistics = stations.map(station => ({
      id: station.id,
      name: station.name,
      city: station.city,
      totalVehicles: station._count.vehicles,
      availablePlaces: station.availablePlaces,
      capacity: station.capacity,
      occupancyRate: ((station.capacity - station.availablePlaces) / station.capacity * 100).toFixed(2),
      totalBookings: station._count.bookings,
      totalRevenue: station.bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      isOpen: station.isOpen
    }));

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching station statistics:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques des stations' });
  }
});

// Get user statistics (admin and direction only)
router.get('/users/statistics', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const [
      totalUsers,
      clientCount,
      adminCount,
      directionCount,
      newUsersThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'DIRECTION' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    res.json({
      total: totalUsers,
      byRole: {
        clients: clientCount,
        admins: adminCount,
        direction: directionCount
      },
      newThisMonth: newUsersThisMonth
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques utilisateurs' });
  }
});

export default router;
