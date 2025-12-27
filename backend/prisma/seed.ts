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

  // Create default stations across Tunisia
  const tunisStation = await prisma.station.create({
    data: {
      name: 'Tunis Centre',
      city: 'Tunis',
      address: 'Avenue Habib Bourguiba',
      phone: '+216 71 123 456',
      email: 'tunis@autofleet.tn',
      latitude: 36.8065,
      longitude: 10.1815,
      capacity: 20,
      availablePlaces: 20,
      openingHours: '07:00 - 22:00',
      isOpen: true,
    },
  });

  const lac2Station = await prisma.station.create({
    data: {
      name: 'Lac 2',
      city: 'Tunis',
      address: 'Les Berges du Lac',
      phone: '+216 71 234 567',
      email: 'lac2@autofleet.tn',
      latitude: 36.8415,
      longitude: 10.2395,
      capacity: 15,
      availablePlaces: 15,
      openingHours: '08:00 - 20:00',
      isOpen: true,
    },
  });

  const sfaxStation = await prisma.station.create({
    data: {
      name: 'Sfax Centre',
      city: 'Sfax',
      address: 'Avenue Hedi Chaker',
      phone: '+216 74 456 789',
      email: 'sfax@autofleet.tn',
      latitude: 34.7406,
      longitude: 10.7603,
      capacity: 18,
      availablePlaces: 18,
      openingHours: '07:00 - 21:00',
      isOpen: true,
    },
  });

  const sousseStation = await prisma.station.create({
    data: {
      name: 'Sousse Ville',
      city: 'Sousse',
      address: 'Boulevard de la Corniche',
      phone: '+216 73 345 678',
      email: 'sousse@autofleet.tn',
      latitude: 35.8256,
      longitude: 10.6369,
      capacity: 12,
      availablePlaces: 12,
      openingHours: '08:00 - 20:00',
      isOpen: false,
    },
  });

  const monastirStation = await prisma.station.create({
    data: {
      name: 'Monastir',
      city: 'Monastir',
      address: 'Route de la Corniche',
      phone: '+216 73 456 789',
      email: 'monastir@autofleet.tn',
      latitude: 35.7774,
      longitude: 10.8264,
      capacity: 10,
      availablePlaces: 10,
      openingHours: '08:00 - 19:00',
      isOpen: true,
    },
  });

  const nabeulStation = await prisma.station.create({
    data: {
      name: 'Nabeul',
      city: 'Nabeul',
      address: 'Avenue Farhat Hached',
      phone: '+216 72 567 890',
      email: 'nabeul@autofleet.tn',
      latitude: 36.4516,
      longitude: 10.7350,
      capacity: 8,
      availablePlaces: 8,
      openingHours: '08:00 - 18:00',
      isOpen: true,
    },
  });

  const hammametStation = await prisma.station.create({
    data: {
      name: 'Hammamet',
      city: 'Hammamet',
      address: 'Avenue de la République',
      phone: '+216 72 678 901',
      email: 'hammamet@autofleet.tn',
      latitude: 36.4000,
      longitude: 10.6167,
      capacity: 15,
      availablePlaces: 15,
      openingHours: '07:00 - 21:00',
      isOpen: true,
    },
  });

  const djerbaStation = await prisma.station.create({
    data: {
      name: 'Djerba',
      city: 'Djerba',
      address: 'Houmt Souk',
      phone: '+216 75 789 012',
      email: 'djerba@autofleet.tn',
      latitude: 33.8076,
      longitude: 10.8451,
      capacity: 12,
      availablePlaces: 12,
      openingHours: '08:00 - 20:00',
      isOpen: true,
    },
  });

  const tozeurStation = await prisma.station.create({
    data: {
      name: 'Tozeur',
      city: 'Tozeur',
      address: 'Avenue Abou El Kacem Chebbi',
      phone: '+216 76 890 123',
      email: 'tozeur@autofleet.tn',
      latitude: 33.9197,
      longitude: 8.1338,
      capacity: 10,
      availablePlaces: 10,
      openingHours: '08:00 - 19:00',
      isOpen: true,
    },
  });

  console.log('✅ 9 Stations créées à travers la Tunisie');

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
