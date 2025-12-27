import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Clear existing data
  console.log('🗑️  Suppression de toutes les données...');
  await prisma.notification.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Base de données vidée');

  // Create Admin user
  const hashedPasswordAdmin = await bcrypt.hash('parcadmin123', 10);
  const parcAdmin = await prisma.user.create({
    data: {
      email: 'parcadmin@autofleet.tn',
      password: hashedPasswordAdmin,
      name: 'Administrateur de Parc',
      phone: '+21622365887',
      address: 'Tunis, Tunisie',
      role: 'ADMIN',
    },
  });

  // Create Direction user
  const hashedPasswordDirection = await bcrypt.hash('direction123', 10);
  const direction = await prisma.user.create({
    data: {
      email: 'direction@autofleet.tn',
      password: hashedPasswordDirection,
      name: 'Direction',
      phone: '+21626331254',
      address: 'Tunis, Tunisie',
      role: 'DIRECTION',
    },
  });

  console.log('✅ Utilisateurs créés');
  console.log('📧 Admin: parcadmin@autofleet.tn');
  console.log('📧 Direction: direction@autofleet.tn');

  // Create default stations
  const tunisStation = await prisma.station.create({
    data: {
      name: 'Station Tunis Centre',
      city: 'Tunis',
      address: 'Avenue Habib Bourguiba, Tunis 1001',
      phone: '+216 71 123 456',
      email: 'tunis@autofleet.tn',
      latitude: 36.8065,
      longitude: 10.1815,
    },
  });

  const sfaxStation = await prisma.station.create({
    data: {
      name: 'Station Sfax',
      city: 'Sfax',
      address: 'Route de Tunis, Sfax 3000',
      phone: '+216 74 456 789',
      email: 'sfax@autofleet.tn',
      latitude: 34.7406,
      longitude: 10.7603,
    },
  });

  console.log('✅ Stations créées');

  console.log('🎉 Seed terminé avec succès!');
  console.log('\nComptes créés:');
  console.log('Admin de Parc: parcadmin@autofleet.tn / parcadmin123');
  console.log('Direction: direction@autofleet.tn / direction123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
