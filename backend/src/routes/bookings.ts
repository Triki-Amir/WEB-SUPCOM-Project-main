import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get user's bookings
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: {
        vehicle: {
          include: {
            station: true
          }
        },
        station: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// Get all bookings (admin only)
router.get('/all', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        vehicle: {
          include: {
            station: true
          }
        },
        station: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        vehicle: {
          include: {
            station: true
          }
        },
        station: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== req.user!.id && req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la réservation' });
  }
});

// Create booking
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { vehicleId, stationId, startDate, endDate, totalPrice, pickupLocation, dropoffLocation, notes } = req.body;

    // Check if vehicle is available
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }

    if (vehicle.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Véhicule non disponible' });
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        vehicleId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } }
            ]
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } }
            ]
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ error: 'Le véhicule est déjà réservé pour ces dates' });
    }

    // Create booking and update vehicle status
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId: req.user!.id,
          vehicleId,
          stationId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          pickupLocation,
          dropoffLocation,
          notes,
          status: 'PENDING'
        },
        include: {
          vehicle: {
            include: {
              station: true
            }
          },
          station: true,
        },
      });

      // Create notification for user
      await tx.notification.create({
        data: {
          userId: req.user!.id,
          title: 'Réservation créée',
          message: `Votre réservation pour ${vehicle.brand} ${vehicle.model} a été créée avec succès. En attente de confirmation.`,
          type: 'info'
        }
      });

      return newBooking;
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { status } = req.body;
    const bookingId = req.params.id;

    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        user: true
      }
    });

    if (!currentBooking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    const booking = await prisma.$transaction(async (tx) => {
      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status },
      });

      // Update vehicle status based on booking status
      if (status === 'CONFIRMED' || status === 'ACTIVE') {
        await tx.vehicle.update({
          where: { id: currentBooking.vehicleId },
          data: { status: status === 'ACTIVE' ? 'RENTED' : 'AVAILABLE' }
        });
      } else if (status === 'COMPLETED' || status === 'CANCELLED') {
        await tx.vehicle.update({
          where: { id: currentBooking.vehicleId },
          data: { status: 'AVAILABLE' }
        });
      }

      // Create notification for user
      let notificationMessage = '';
      let notificationType = 'info';

      if (status === 'CONFIRMED') {
        notificationMessage = `Votre réservation pour ${currentBooking.vehicle.brand} ${currentBooking.vehicle.model} a été confirmée.`;
        notificationType = 'success';
      } else if (status === 'CANCELLED') {
        notificationMessage = `Votre réservation pour ${currentBooking.vehicle.brand} ${currentBooking.vehicle.model} a été annulée.`;
        notificationType = 'warning';
      } else if (status === 'COMPLETED') {
        notificationMessage = `Votre réservation pour ${currentBooking.vehicle.brand} ${currentBooking.vehicle.model} est terminée. Merci d'avoir utilisé nos services.`;
        notificationType = 'success';
      }

      if (notificationMessage) {
        await tx.notification.create({
          data: {
            userId: currentBooking.userId,
            title: 'Mise à jour de réservation',
            message: notificationMessage,
            type: notificationType
          }
        });
      }

      return updatedBooking;
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour du statut de la réservation' });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookingId = req.params.id;
    
    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true
      }
    });

    if (!currentBooking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Check if user owns the booking or is admin
    if (currentBooking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Can only cancel if status is PENDING or CONFIRMED
    if (currentBooking.status !== 'PENDING' && currentBooking.status !== 'CONFIRMED') {
      return res.status(400).json({ error: 'Cette réservation ne peut pas être annulée' });
    }

    const booking = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });

      // Make vehicle available again
      await tx.vehicle.update({
        where: { id: currentBooking.vehicleId },
        data: { status: 'AVAILABLE' }
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: currentBooking.userId,
          title: 'Réservation annulée',
          message: `Votre réservation pour ${currentBooking.vehicle.brand} ${currentBooking.vehicle.model} a été annulée.`,
          type: 'warning'
        }
      });

      return updatedBooking;
    });

    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(400).json({ error: 'Erreur lors de l\'annulation de la réservation' });
  }
});

// Update booking (modify dates, notes, etc.)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookingId = req.params.id;
    const { startDate, endDate, pickupLocation, dropoffLocation, notes } = req.body;

    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!currentBooking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Check if user owns the booking or is admin
    if (currentBooking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Can only modify if status is PENDING or CONFIRMED
    if (currentBooking.status !== 'PENDING' && currentBooking.status !== 'CONFIRMED') {
      return res.status(400).json({ error: 'Cette réservation ne peut pas être modifiée' });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(pickupLocation && { pickupLocation }),
        ...(dropoffLocation && { dropoffLocation }),
        ...(notes && { notes })
      },
      include: {
        vehicle: {
          include: {
            station: true
          }
        },
        station: true,
      },
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({ error: 'Erreur lors de la modification de la réservation' });
  }
});

export default router;
