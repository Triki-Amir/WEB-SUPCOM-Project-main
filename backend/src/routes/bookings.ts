import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user's bookings
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: {
        vehicle: true,
        station: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// Create booking
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await prisma.booking.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      },
      include: {
        vehicle: true,
        station: true,
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de l\'annulation de la réservation' });
  }
});

export default router;
