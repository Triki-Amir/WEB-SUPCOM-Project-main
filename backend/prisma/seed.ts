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
      dailyRate: 45.0,
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
      dailyRate: 50.0,
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
      dailyRate: 60.0,
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
      dailyRate: 70.0,
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
      dailyRate: 90.0,
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
      dailyRate: 40.0,
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

    // Create incident for this booking
    await prisma.incident.create({
      data: {
        bookingId: booking.id,
        userId: client.id,
        title: 'Pneu crevé',
        description: 'Le pneu avant droit a crevé sur l\'autoroute A1',
        status: 'IN_PROGRESS',
        severity: 'MEDIUM',
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
