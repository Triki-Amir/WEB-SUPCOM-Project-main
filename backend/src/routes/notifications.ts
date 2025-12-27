import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// Get user's notifications
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { 
        id: req.params.id,
        userId: req.user!.id // Ensure user owns the notification
      },
      data: { read: true },
    });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la notification' });
  }
});

// Mark all notifications as read
router.patch('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { 
        userId: req.user!.id,
        read: false
      },
      data: { read: true },
    });
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour des notifications' });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.delete({
      where: { 
        id: req.params.id,
        userId: req.user!.id // Ensure user owns the notification
      },
    });
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(400).json({ error: 'Erreur lors de la suppression de la notification' });
  }
});

export default router;
