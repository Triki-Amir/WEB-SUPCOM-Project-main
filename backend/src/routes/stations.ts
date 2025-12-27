import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get all stations with vehicle count and availability
router.get('/', async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      include: {
        _count: {
          select: { vehicles: true },
        },
      },
    });

    // Map stations with calculated fields
    const stationsWithAvailability = stations.map(station => {
      const stationObj: any = { ...station };
      return {
        ...stationObj,
        availableSpots: stationObj.availablePlaces || station.capacity,
        totalVehicles: station._count.vehicles,
      };
    });

    res.json(stationsWithAvailability);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des stations' });
  }
});

// Get station by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const station = await prisma.station.findUnique({
      where: { id },
      include: {
        vehicles: true,
        _count: {
          select: { vehicles: true },
        },
      },
    });

    if (!station) {
      return res.status(404).json({ error: 'Station introuvable' });
    }

    res.json(station);
  } catch (error) {
    console.error('Error fetching station:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la station' });
  }
});

// Create new station (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, city, address, phone, email, latitude, longitude, capacity, openingHours } = req.body;

    if (!name || !city || !address || !phone) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const stationCapacity = capacity || 20;

    const station = await prisma.station.create({
      data: {
        name,
        city,
        address,
        phone,
        email,
        latitude,
        longitude,
        capacity: stationCapacity,
        availablePlaces: stationCapacity,
        openingHours: openingHours || '08:00 - 20:00',
        isOpen: true,
      },
    });

    res.status(201).json(station);
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la station' });
  }
});

// Update station (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, address, phone, email, latitude, longitude, capacity, openingHours, isOpen } = req.body;

    const station = await prisma.station.update({
      where: { id },
      data: {
        name,
        city,
        address,
        phone,
        email,
        latitude,
        longitude,
        capacity,
        openingHours,
        isOpen,
      },
    });

    res.json(station);
  } catch (error) {
    console.error('Error updating station:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la station' });
  }
});

// Toggle station status (admin only)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const currentStation = await prisma.station.findUnique({
      where: { id },
    });

    if (!currentStation) {
      return res.status(404).json({ error: 'Station introuvable' });
    }

    const station = await prisma.station.update({
      where: { id },
      data: {
        isOpen: !currentStation.isOpen,
      },
    });

    res.json(station);
  } catch (error) {
    console.error('Error toggling station:', error);
    res.status(500).json({ error: 'Erreur lors du changement du statut de la station' });
  }
});

// Delete station (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if station has vehicles
    const vehicleCount = await prisma.vehicle.count({
      where: { stationId: id },
    });

    if (vehicleCount > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer une station avec des véhicules' 
      });
    }

    await prisma.station.delete({
      where: { id },
    });

    res.json({ message: 'Station supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting station:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la station' });
  }
});

export default router;
