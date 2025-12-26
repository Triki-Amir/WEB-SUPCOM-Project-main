import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { userId: req.user!.id },
      include: { booking: { include: { vehicle: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const incident = await prisma.incident.create({
      data: { ...req.body, userId: req.user!.id },
    });
    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ error: 'Erreur' });
  }
});

export default router;
