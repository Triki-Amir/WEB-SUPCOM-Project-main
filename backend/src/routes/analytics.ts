import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get dashboard statistics (admin and direction only)
router.get('/dashboard', authenticate, async (req: AuthRequest, res) => {
  try {
    console.log('📊 Dashboard stats request from:', req.user?.email);
    
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    console.log('✅ User authorized, fetching stats...');

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

    console.log('✅ Stats fetched successfully');

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
    console.error('❌ Error fetching dashboard stats:', error);
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

// Get revenue by category (admin and direction only)
router.get('/revenue/by-category', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const vehicles = await prisma.vehicle.groupBy({
      by: ['category'],
      _sum: {
        pricePerDay: true
      },
      _count: {
        id: true
      }
    });

    const bookingsByCategory = await prisma.booking.findMany({
      where: { status: 'COMPLETED' },
      include: {
        vehicle: {
          select: { category: true }
        }
      }
    });

    const categoryRevenue = vehicles.map(cat => {
      const revenue = bookingsByCategory
        .filter(b => b.vehicle.category === cat.category)
        .reduce((sum, b) => sum + b.totalPrice, 0);
      return {
        category: cat.category,
        revenue,
        count: cat._count.id
      };
    });

    const totalRevenue = categoryRevenue.reduce((sum, cat) => sum + cat.revenue, 0);
    
    const result = categoryRevenue.map(cat => ({
      category: cat.category,
      revenue: cat.revenue,
      percentage: totalRevenue > 0 ? parseFloat(((cat.revenue / totalRevenue) * 100).toFixed(1)) : 0
    }));

    res.json(result.length > 0 ? result : []);
  } catch (error) {
    console.error('Error fetching revenue by category:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des revenus par catégorie', details: (error as Error).message });
  }
});

// Get revenue by city (admin and direction only)
router.get('/revenue/by-city', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const stations = await prisma.station.findMany({
      include: {
        bookings: {
          where: {
            status: 'COMPLETED',
            createdAt: { gte: threeMonthsAgo }
          },
          select: {
            totalPrice: true,
            createdAt: true
          }
        }
      }
    });

    if (stations.length === 0) {
      return res.json([]);
    }

    const cityRevenue = new Map<string, { q1: number; q2: number }>();

    stations.forEach(station => {
      const sixWeeksAgo = new Date();
      sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

      const q1Revenue = station.bookings
        .filter(b => b.createdAt < sixWeeksAgo)
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      const q2Revenue = station.bookings
        .filter(b => b.createdAt >= sixWeeksAgo)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const existing = cityRevenue.get(station.city) || { q1: 0, q2: 0 };
      existing.q1 += q1Revenue;
      existing.q2 += q2Revenue;
      cityRevenue.set(station.city, existing);
    });

    const result = Array.from(cityRevenue.entries()).map(([city, data]) => ({
      city,
      q1: Math.round(data.q1),
      q2: Math.round(data.q2)
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching revenue by city:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des revenus par ville', details: (error as Error).message });
  }
});

// Get bookings by weekday (admin and direction only)
router.get('/bookings/by-weekday', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true
      }
    });

    const weekdayMap = new Map<number, number>();
    for (let i = 0; i < 7; i++) weekdayMap.set(i, 0);

    bookings.forEach(booking => {
      const day = booking.createdAt.getDay();
      weekdayMap.set(day, (weekdayMap.get(day) || 0) + 1);
    });

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const result = Array.from(weekdayMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([day, count]) => ({
        day: dayNames[day],
        bookings: count
      }));

    // Reorder to start with Monday
    const reordered = [
      result[1], // Lun
      result[2], // Mar
      result[3], // Mer
      result[4], // Jeu
      result[5], // Ven
      result[6], // Sam
      result[0]  // Dim
    ];

    res.json(reordered);
  } catch (error) {
    console.error('Error fetching bookings by weekday:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations par jour', details: (error as Error).message });
  }
});

// Get monthly trends (admin and direction only)
router.get('/revenue/monthly-trends', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: { in: ['COMPLETED', 'ACTIVE'] }
      },
      select: {
        createdAt: true,
        totalPrice: true
      }
    });

    const monthlyMap = new Map<string, { revenue: number; bookings: number }>();

    bookings.forEach(booking => {
      const monthKey = booking.createdAt.toISOString().substring(0, 7); // YYYY-MM
      const existing = monthlyMap.get(monthKey) || { revenue: 0, bookings: 0 };
      existing.revenue += booking.totalPrice;
      existing.bookings += 1;
      monthlyMap.set(monthKey, existing);
    });

    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const result = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([monthKey, data]) => {
        const month = parseInt(monthKey.split('-')[1]);
        return {
          month: monthNames[month - 1],
          revenue: Math.round(data.revenue),
          bookings: data.bookings
        };
      });

    res.json(result.length > 0 ? result : []);
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tendances mensuelles', details: (error as Error).message });
  }
});

export default router;
