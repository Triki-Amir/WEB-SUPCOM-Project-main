import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

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
