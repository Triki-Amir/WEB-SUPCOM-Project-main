import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      include: {
        _count: {
          select: { vehicles: true },
        },
      },
    });
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des stations' });
  }
});

export default router;
