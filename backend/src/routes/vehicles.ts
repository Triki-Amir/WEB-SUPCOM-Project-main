import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const { status, category, stationId } = req.query;
    
    const vehicles = await prisma.vehicle.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(category && { category: category as string }),
        ...(stationId && { stationId: stationId as string }),
      },
      include: {
        station: true,
      },
    });

    res.json(vehicles);
  } catch (error) {
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
    const vehicle = await prisma.vehicle.create({
      data: req.body,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du véhicule' });
  }
});

// Update vehicle (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du véhicule' });
  }
});

export default router;
