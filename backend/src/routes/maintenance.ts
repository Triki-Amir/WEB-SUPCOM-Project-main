import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const maintenance = await prisma.maintenance.findMany({
      include: { vehicle: true },
      orderBy: { scheduledAt: 'desc' },
    });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

export default router;
