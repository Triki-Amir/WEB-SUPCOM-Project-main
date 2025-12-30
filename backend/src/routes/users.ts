import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true,
        address: true,
        role: true, 
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// Update current user profile
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

// Update password
router.put('/me/password', authenticate, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe' });
  }
});

// Get user by ID (admin only)
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin or direction
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'DIRECTION') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            bookings: true,
            incidents: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// Update user role (admin only)
router.patch('/:id/role', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { role } = req.body;

    if (!role || !['CLIENT', 'ADMIN', 'DIRECTION'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour du rôle' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const userId = req.params.id;

    // Cannot delete self
    if (userId === req.user!.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    // Check if user has active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        userId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }
      }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer un utilisateur avec des réservations actives' 
      });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

export default router;
