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
