import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get all maintenance records
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const maintenance = await prisma.maintenance.findMany({
      include: { 
        vehicle: {
          include: {
            station: true
          }
        } 
      },
      orderBy: { scheduledAt: 'desc' },
    });
    res.json(maintenance);
  } catch (error) {
    console.error('Error fetching maintenance:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des maintenances' });
  }
});

// Get maintenance by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const maintenance = await prisma.maintenance.findUnique({
      where: { id: req.params.id },
      include: { 
        vehicle: {
          include: {
            station: true
          }
        } 
      },
    });

    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance non trouvée' });
    }

    res.json(maintenance);
  } catch (error) {
    console.error('Error fetching maintenance:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la maintenance' });
  }
});

// Create maintenance record (admin only)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { vehicleId, type, description, cost, scheduledAt, notes } = req.body;

    if (!vehicleId || !type || !description || !scheduledAt) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }

    const maintenance = await prisma.$transaction(async (tx) => {
      const newMaintenance = await tx.maintenance.create({
        data: {
          vehicleId,
          type,
          description,
          cost,
          scheduledAt: new Date(scheduledAt),
          notes
        },
        include: {
          vehicle: {
            include: {
              station: true
            }
          }
        }
      });

      // Update vehicle status to MAINTENANCE
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'MAINTENANCE' }
      });

      return newMaintenance;
    });

    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Error creating maintenance:', error);
    res.status(400).json({ error: 'Erreur lors de la création de la maintenance' });
  }
});

// Update maintenance (admin only)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { type, description, cost, scheduledAt, completedAt, notes } = req.body;
    const maintenanceId = req.params.id;

    const maintenance = await prisma.maintenance.update({
      where: { id: maintenanceId },
      data: {
        ...(type && { type }),
        ...(description && { description }),
        ...(cost !== undefined && { cost }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(completedAt && { completedAt: new Date(completedAt) }),
        ...(notes && { notes })
      },
      include: {
        vehicle: {
          include: {
            station: true
          }
        }
      }
    });

    res.json(maintenance);
  } catch (error) {
    console.error('Error updating maintenance:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la maintenance' });
  }
});

// Complete maintenance (admin only)
router.patch('/:id/complete', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const maintenanceId = req.params.id;

    const currentMaintenance = await prisma.maintenance.findUnique({
      where: { id: maintenanceId }
    });

    if (!currentMaintenance) {
      return res.status(404).json({ error: 'Maintenance non trouvée' });
    }

    const maintenance = await prisma.$transaction(async (tx) => {
      const updatedMaintenance = await tx.maintenance.update({
        where: { id: maintenanceId },
        data: { completedAt: new Date() }
      });

      // Update vehicle status back to AVAILABLE
      await tx.vehicle.update({
        where: { id: currentMaintenance.vehicleId },
        data: { status: 'AVAILABLE' }
      });

      return updatedMaintenance;
    });

    res.json(maintenance);
  } catch (error) {
    console.error('Error completing maintenance:', error);
    res.status(400).json({ error: 'Erreur lors de la finalisation de la maintenance' });
  }
});

// Delete maintenance (admin only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const maintenanceId = req.params.id;

    const currentMaintenance = await prisma.maintenance.findUnique({
      where: { id: maintenanceId }
    });

    if (!currentMaintenance) {
      return res.status(404).json({ error: 'Maintenance non trouvée' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.maintenance.delete({
        where: { id: maintenanceId }
      });

      // If not completed, update vehicle status back to AVAILABLE
      if (!currentMaintenance.completedAt) {
        await tx.vehicle.update({
          where: { id: currentMaintenance.vehicleId },
          data: { status: 'AVAILABLE' }
        });
      }
    });

    res.json({ message: 'Maintenance supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    res.status(400).json({ error: 'Erreur lors de la suppression de la maintenance' });
  }
});

export default router;
