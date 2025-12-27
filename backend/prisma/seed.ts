import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const client = await prisma.user.create({
    data: {
      email: 'client@autofleet.tn',
      password: hashedPassword,
      name: 'Ahmed Ben Ali',
      phone: '+216 20 123 456',
      address: 'Tunis, Tunisie',
      role: 'CLIENT',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@autofleet.tn',
      password: hashedPassword,
      name: 'Sarah Trabelsi',
      phone: '+216 20 789 012',
      address: 'Sfax, Tunisie',
      role: 'ADMIN',
    },
  });

  const direction = await prisma.user.create({
    data: {
      email: 'direction@autofleet.tn',
      password: hashedPassword,
      name: 'Mohamed Salah',
      phone: '+216 20 345 678',
      address: 'Sousse, Tunisie',
      role: 'DIRECTION',
    },
  });

  console.log('✅ Utilisateurs créés');

  // Create stations
  const tunisStation = await prisma.station.create({
    data: {
      name: 'Auto Fleet Tunis Centre',
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
      name: 'Auto Fleet Sfax',
      city: 'Sfax',
      address: 'Route de Tunis, Sfax 3000',
      phone: '+216 74 456 789',
      email: 'sfax@autofleet.tn',
      latitude: 34.7406,
      longitude: 10.7603,
    },
  });

  const sousseStation = await prisma.station.create({
    data: {
      name: 'Auto Fleet Sousse',
      city: 'Sousse',
      address: 'Avenue de la Corniche, Sousse 4000',
      phone: '+216 73 789 012',
      email: 'sousse@autofleet.tn',
      latitude: 35.8256,
      longitude: 10.6369,
    },
  });

  console.log('✅ Stations créées');

  // Create vehicles
  const vehicles = [
    {
      brand: 'Renault',
      model: 'Clio',
      year: 2023,
      category: 'Économique',
      licensePlate: 'TUN-1234',
      color: 'Blanc',
      seats: 5,
      transmission: 'Manuelle',
      fuelType: 'Essence',
      status: 'AVAILABLE' as const,
      mileage: 12000,
      stationId: tunisStation.id,
    },
    {
      brand: 'Peugeot',
      model: '208',
      year: 2023,
      category: 'Économique',
      licensePlate: 'TUN-5678',
      color: 'Noir',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Diesel',
      status: 'AVAILABLE' as const,
      mileage: 8000,
      stationId: tunisStation.id,
    },
    {
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      category: 'Compact',
      licensePlate: 'TUN-9012',
      color: 'Gris',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Essence',
      status: 'RENTED' as const,
      mileage: 25000,
      stationId: sfaxStation.id,
    },
    {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2023,
      category: 'Berline',
      licensePlate: 'TUN-3456',
      color: 'Argent',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Hybride',
      status: 'AVAILABLE' as const,
      mileage: 5000,
      stationId: sousseStation.id,
    },
    {
      brand: 'Mercedes',
      model: 'Classe A',
      year: 2023,
      category: 'Premium',
      licensePlate: 'TUN-7890',
      color: 'Bleu',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Diesel',
      status: 'AVAILABLE' as const,
      mileage: 3000,
      stationId: tunisStation.id,
    },
    {
      brand: 'Dacia',
      model: 'Sandero',
      year: 2022,
      category: 'Économique',
      licensePlate: 'TUN-2468',
      color: 'Rouge',
      seats: 5,
      transmission: 'Manuelle',
      fuelType: 'Essence',
      status: 'MAINTENANCE' as const,
      mileage: 35000,
      stationId: sfaxStation.id,
    },
  ];

  for (const vehicleData of vehicles) {
    await prisma.vehicle.create({ data: vehicleData });
  }

  console.log('✅ Véhicules créés');

  // Create bookings
  const vehicleForBooking = await prisma.vehicle.findFirst({
    where: { status: 'RENTED' },
  });

  if (vehicleForBooking) {
    const booking = await prisma.booking.create({
      data: {
        userId: client.id,
        vehicleId: vehicleForBooking.id,
        stationId: sfaxStation.id,
        startDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-17'),
        totalPrice: 420.0,
        status: 'ACTIVE',
        pickupLocation: 'Sfax Centre',
        dropoffLocation: 'Tunis Aéroport',
        notes: 'Client régulier',
      },
    });
  }

  // Create completed booking
  const completedVehicle = await prisma.vehicle.findFirst({
    where: { licensePlate: 'TUN-1234' },
  });

  if (completedVehicle) {
    await prisma.booking.create({
      data: {
        userId: client.id,
        vehicleId: completedVehicle.id,
        stationId: tunisStation.id,
        startDate: new Date('2025-10-15'),
        endDate: new Date('2025-10-20'),
        totalPrice: 225.0,
        status: 'COMPLETED',
        pickupLocation: 'Tunis Centre',
        dropoffLocation: 'Tunis Centre',
      },
    });
  }

  console.log('✅ Réservations créées');

  // Create maintenance records
  const maintenanceVehicle = await prisma.vehicle.findFirst({
    where: { status: 'MAINTENANCE' },
  });

  if (maintenanceVehicle) {
    await prisma.maintenance.create({
      data: {
        vehicleId: maintenanceVehicle.id,
        type: 'Révision générale',
        description: 'Vidange + contrôle freins + remplacement filtres',
        cost: 350.0,
        scheduledAt: new Date('2025-11-15'),
        notes: 'Véhicule à forte kilométrage',
      },
    });
  }

  console.log('✅ Maintenances créées');

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: client.id,
      title: 'Réservation confirmée',
      message: 'Votre réservation du 10/11 au 17/11 a été confirmée',
      type: 'BOOKING',
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: 'Nouveau véhicule en maintenance',
      message: 'Dacia Sandero (TUN-2468) nécessite une révision',
      type: 'MAINTENANCE',
      read: false,
    },
  });

  console.log('✅ Notifications créées');

  console.log('🎉 Seed terminé avec succès!');
  console.log('\nComptes de test:');
  console.log('Client: client@autofleet.tn / demo123');
  console.log('Admin: admin@autofleet.tn / demo123');
  console.log('Direction: direction@autofleet.tn / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
