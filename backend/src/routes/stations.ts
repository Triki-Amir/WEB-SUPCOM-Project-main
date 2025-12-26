import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

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
