import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true,
        address: true,
        role: true, 
        createdAt: true 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// Update current user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        name,
        phone,
        address
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

// Create new user (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { email, password, name, phone, address, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        address,
        role: role || 'CLIENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Update user (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

export default router;
