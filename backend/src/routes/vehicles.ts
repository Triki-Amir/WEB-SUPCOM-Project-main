import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get all vehicles with advanced filtering
router.get('/', async (req, res) => {
  try {
    const { status, category, stationId, city, startDate, endDate, available } = req.query;
    
    // Find stations by city if city is provided
    let stationIds: string[] | undefined;
    if (city) {
      const stationsInCity = await prisma.station.findMany({
        where: {
          city: { equals: city as string, mode: 'insensitive' }
        },
        select: { id: true }
      });
      stationIds = stationsInCity.map(s => s.id);
    }

    // Parse dates for booking conflict check
    const checkStartDate = startDate ? new Date(startDate as string) : undefined;
    const checkEndDate = endDate ? new Date(endDate as string) : undefined;

    // Get all vehicles matching base criteria
    let vehicles = await prisma.vehicle.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(category && category !== 'all' && { category: category as string }),
        ...(stationId && { stationId: stationId as string }),
        ...(stationIds && stationIds.length > 0 && { stationId: { in: stationIds } }),
      },
      include: {
        station: true,
        bookings: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
          },
        },
      },
    });

    // Filter by availability based on booking dates if provided
    if (checkStartDate && checkEndDate) {
      vehicles = vehicles.filter(vehicle => {
        // Check if vehicle has any conflicting bookings
        const hasConflict = vehicle.bookings.some(booking => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);
          // Check for date overlap
          return checkStartDate < bookingEnd && checkEndDate > bookingStart;
        });
        return !hasConflict;
      });
    } else if (available === 'true') {
      // Filter by AVAILABLE status only
      vehicles = vehicles.filter(v => v.status === 'AVAILABLE');
    }

    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        station: true,
        bookings: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
          },
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du véhicule' });
  }
});

// Create vehicle (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { stationId } = req.body;

    // Check if station has available places
    const station = await prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      return res.status(404).json({ error: 'Station non trouvée' });
    }

    if (station.availablePlaces <= 0) {
      return res.status(400).json({ error: 'Aucune place disponible dans cette station' });
    }

    // Create vehicle and decrement available places in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.create({
        data: req.body,
      });

      await tx.station.update({
        where: { id: stationId },
        data: {
          availablePlaces: {
            decrement: 1,
          },
        },
      });

      return vehicle;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(400).json({ error: 'Erreur lors de la création du véhicule' });
  }
});

// Update vehicle (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { stationId } = req.body;
    const vehicleId = req.params.id;

    // Get current vehicle to check if station is changing
    const currentVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!currentVehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }

    // If station is changing
    if (stationId && stationId !== currentVehicle.stationId) {
      const newStation = await prisma.station.findUnique({
        where: { id: stationId },
      });

      if (!newStation) {
        return res.status(404).json({ error: 'Nouvelle station non trouvée' });
      }

      if (newStation.availablePlaces <= 0) {
        return res.status(400).json({ error: 'Aucune place disponible dans la nouvelle station' });
      }

      // Update vehicle and adjust station places in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Increment old station
        await tx.station.update({
          where: { id: currentVehicle.stationId },
          data: { availablePlaces: { increment: 1 } },
        });

        // Decrement new station
        await tx.station.update({
          where: { id: stationId },
          data: { availablePlaces: { decrement: 1 } },
        });

        // Update vehicle
        const vehicle = await tx.vehicle.update({
          where: { id: vehicleId },
          data: req.body,
        });

        return vehicle;
      });

      return res.json(result);
    }

    // If station is not changing, just update the vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: req.body,
    });

    res.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour du véhicule' });
  }
});

// Delete vehicle (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const vehicleId = req.params.id;

    // Get vehicle to know which station to update
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }

    // Delete vehicle and increment station available places
    await prisma.$transaction(async (tx) => {
      await tx.vehicle.delete({
        where: { id: vehicleId },
      });

      await tx.station.update({
        where: { id: vehicle.stationId },
        data: {
          availablePlaces: { increment: 1 },
        },
      });
    });

    res.json({ message: 'Véhicule supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(400).json({ error: 'Erreur lors de la suppression du véhicule' });
  }
});

export default router;
