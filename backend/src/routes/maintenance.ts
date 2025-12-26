import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

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
