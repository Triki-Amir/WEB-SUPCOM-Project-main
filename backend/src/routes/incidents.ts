import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get user's incidents
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { userId: req.user!.id },
      include: { 
        booking: { 
          include: { 
            vehicle: true,
            station: true
          } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des incidents' });
  }
});

// Get all incidents (admin only)
router.get('/all', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const incidents = await prisma.incident.findMany({
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        booking: { 
          include: { 
            vehicle: true,
            station: true
          } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching all incidents:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des incidents' });
  }
});

// Report new incident
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, description, severity } = req.body;

    if (!bookingId || !description || !severity) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Verify booking belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (booking.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const incident = await prisma.$transaction(async (tx) => {
      const newIncident = await tx.incident.create({
        data: { 
          userId: req.user!.id,
          bookingId,
          description,
          severity,
          status: 'PENDING'
        },
        include: {
          booking: {
            include: {
              vehicle: true,
              station: true
            }
          }
        }
      });

      // Create notification for user
      await tx.notification.create({
        data: {
          userId: req.user!.id,
          title: 'Incident déclaré',
          message: `Votre incident concernant ${booking.vehicle.brand} ${booking.vehicle.model} a été enregistré. Notre équipe va le traiter dans les plus brefs délais.`,
          type: 'info'
        }
      });

      return newIncident;
    });

    res.status(201).json(incident);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(400).json({ error: 'Erreur lors de la création de l\'incident' });
  }
});

// Update incident status (admin only)
router.patch('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { status } = req.body;
    const incidentId = req.params.id;

    const currentIncident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: {
        booking: {
          include: {
            vehicle: true
          }
        }
      }
    });

    if (!currentIncident) {
      return res.status(404).json({ error: 'Incident non trouvé' });
    }

    const incident = await prisma.$transaction(async (tx) => {
      const updatedIncident = await tx.incident.update({
        where: { id: incidentId },
        data: { status },
      });

      // Create notification for user
      let notificationMessage = '';
      if (status === 'RESOLVED') {
        notificationMessage = `Votre incident concernant ${currentIncident.booking.vehicle.brand} ${currentIncident.booking.vehicle.model} a été résolu.`;
      } else if (status === 'IN_PROGRESS') {
        notificationMessage = `Votre incident concernant ${currentIncident.booking.vehicle.brand} ${currentIncident.booking.vehicle.model} est en cours de traitement.`;
      } else if (status === 'REJECTED') {
        notificationMessage = `Votre incident concernant ${currentIncident.booking.vehicle.brand} ${currentIncident.booking.vehicle.model} a été rejeté.`;
      }

      if (notificationMessage) {
        await tx.notification.create({
          data: {
            userId: currentIncident.userId,
            title: 'Mise à jour d\'incident',
            message: notificationMessage,
            type: status === 'RESOLVED' ? 'success' : 'info'
          }
        });
      }

      return updatedIncident;
    });

    res.json(incident);
  } catch (error) {
    console.error('Error updating incident status:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'incident' });
  }
});

export default router;
