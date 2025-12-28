import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Tables nettoyées');

  // ========== USERS ==========
  const hashedPasswordAdmin = await bcrypt.hash('parcadmin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'parcadmin@autofleet.tn',
      password: hashedPasswordAdmin,
      name: 'Administrateur de Parc',
      phone: '+21622365887',
      address: 'Tunis, Tunisie',
      role: 'ADMIN',
    },
  });

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

  // Create client users
  const hashedPasswordClient = await bcrypt.hash('client123', 10);
  const clients = [];
  const clientNames = [
    { name: 'Ahmed Ben Ali', email: 'ahmed.benali@email.tn', phone: '+21698123456' },
    { name: 'Fatma Trabelsi', email: 'fatma.trabelsi@email.tn', phone: '+21697234567' },
    { name: 'Mohamed Mejri', email: 'mohamed.mejri@email.tn', phone: '+21696345678' },
    { name: 'Sarra Khiari', email: 'sarra.khiari@email.tn', phone: '+21695456789' },
    { name: 'Youssef Gharbi', email: 'youssef.gharbi@email.tn', phone: '+21694567890' },
  ];

  for (const clientData of clientNames) {
    const client = await prisma.user.create({
      data: {
        ...clientData,
        password: hashedPasswordClient,
        address: 'Tunisie',
        role: 'CLIENT',
      },
    });
    clients.push(client);
  }

  console.log('✅ Utilisateurs créés');

  // ========== STATIONS ==========
  const stationTunis = await prisma.station.create({
    data: {
      name: 'Station Tunis Centre',
      city: 'Tunis',
      address: 'Avenue Habib Bourguiba',
      phone: '+21671123456',
      email: 'tunis@autofleet.tn',
      latitude: 36.8065,
      longitude: 10.1815,
      capacity: 50,
      availablePlaces: 15,
      openingHours: '08:00-20:00',
      isOpen: true,
    },
  });

  const stationSfax = await prisma.station.create({
    data: {
      name: 'Station Sfax',
      city: 'Sfax',
      address: 'Avenue Hedi Chaker',
      phone: '+21674234567',
      email: 'sfax@autofleet.tn',
      latitude: 34.7406,
      longitude: 10.7603,
      capacity: 30,
      availablePlaces: 12,
      openingHours: '08:00-19:00',
      isOpen: true,
    },
  });

  const stationSousse = await prisma.station.create({
    data: {
      name: 'Station Sousse Port',
      city: 'Sousse',
      address: 'Boulevard 14 Janvier',
      phone: '+21673345678',
      email: 'sousse@autofleet.tn',
      latitude: 35.8256,
      longitude: 10.6369,
      capacity: 25,
      availablePlaces: 8,
      openingHours: '08:00-20:00',
      isOpen: true,
    },
  });

  const stationMonastir = await prisma.station.create({
    data: {
      name: 'Station Monastir',
      city: 'Monastir',
      address: 'Route de la Corniche',
      phone: '+21673456789',
      email: 'monastir@autofleet.tn',
      latitude: 35.7643,
      longitude: 10.8113,
      capacity: 20,
      availablePlaces: 11,
      openingHours: '08:00-18:00',
      isOpen: true,
    },
  });

  console.log('✅ Stations créées');

  // ========== VEHICLES ==========
  const vehiclesData = [
    // Tunis - Mix de catégories
    { brand: 'Tesla', model: 'Model 3', category: 'ELECTRIC', price: 180, station: stationTunis, status: 'AVAILABLE' },
    { brand: 'Peugeot', model: '3008', category: 'SUV', price: 120, station: stationTunis, status: 'RENTED' },
    { brand: 'Renault', model: 'Clio', category: 'COMPACT', price: 45, station: stationTunis, status: 'AVAILABLE' },
    { brand: 'Mercedes', model: 'Classe E', category: 'BERLINE', price: 200, station: stationTunis, status: 'RENTED' },
    { brand: 'Volkswagen', model: 'Golf', category: 'COMPACT', price: 55, station: stationTunis, status: 'AVAILABLE' },
    { brand: 'BMW', model: 'Série 3', category: 'BERLINE', price: 150, station: stationTunis, status: 'AVAILABLE' },
    { brand: 'Nissan', model: 'Leaf', category: 'ELECTRIC', price: 100, station: stationTunis, status: 'MAINTENANCE' },
    { brand: 'Toyota', model: 'Corolla', category: 'BERLINE', price: 80, station: stationTunis, status: 'AVAILABLE' },
    
    // Sfax
    { brand: 'Hyundai', model: 'Tucson', category: 'SUV', price: 100, station: stationSfax, status: 'AVAILABLE' },
    { brand: 'Citroën', model: 'C3', category: 'COMPACT', price: 50, station: stationSfax, status: 'RENTED' },
    { brand: 'Peugeot', model: '208', category: 'COMPACT', price: 48, station: stationSfax, status: 'AVAILABLE' },
    { brand: 'Audi', model: 'A4', category: 'BERLINE', price: 140, station: stationSfax, status: 'AVAILABLE' },
    { brand: 'Renault', model: 'Megane', category: 'BERLINE', price: 70, station: stationSfax, status: 'RENTED' },
    
    // Sousse
    { brand: 'Kia', model: 'Sportage', category: 'SUV', price: 95, station: stationSousse, status: 'AVAILABLE' },
    { brand: 'Seat', model: 'Ibiza', category: 'COMPACT', price: 52, station: stationSousse, status: 'AVAILABLE' },
    { brand: 'Ford', model: 'Focus', category: 'BERLINE', price: 75, station: stationSousse, status: 'RENTED' },
    { brand: 'Opel', model: 'Corsa', category: 'COMPACT', price: 47, station: stationSousse, status: 'AVAILABLE' },
    
    // Monastir
    { brand: 'Fiat', model: '500', category: 'COMPACT', price: 42, station: stationMonastir, status: 'AVAILABLE' },
    { brand: 'Renault', model: 'Captur', category: 'SUV', price: 85, station: stationMonastir, status: 'AVAILABLE' },
    { brand: 'Dacia', model: 'Duster', category: 'SUV', price: 65, station: stationMonastir, status: 'AVAILABLE' },
  ];

  const vehicles = [];
  for (const vData of vehiclesData) {
    const vehicle = await prisma.vehicle.create({
      data: {
        brand: vData.brand,
        model: vData.model,
        category: vData.category,
        year: 2022 + Math.floor(Math.random() * 3),
        price: vData.price,
        mileage: Math.floor(Math.random() * 50000) + 10000,
        fuelType: vData.category === 'ELECTRIC' ? 'ELECTRIC' : (Math.random() > 0.5 ? 'DIESEL' : 'GASOLINE'),
        transmission: Math.random() > 0.3 ? 'AUTOMATIC' : 'MANUAL',
        seats: vData.category === 'COMPACT' ? 5 : (vData.category === 'SUV' ? 7 : 5),
        color: ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge'][Math.floor(Math.random() * 5)],
        licensePlate: `TUN${Math.floor(Math.random() * 9000) + 1000}`,
        status: vData.status,
        stationId: vData.station.id,
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
      },
    });
    vehicles.push(vehicle);
  }

  console.log('✅ Véhicules créés');

  // ========== BOOKINGS - Créer des réservations sur les 6 derniers mois ==========
  const bookings = [];
  const today = new Date();
  
  // Générer des réservations pour les 6 derniers mois
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const monthStart = new Date(today);
    monthStart.setMonth(today.getMonth() - monthOffset);
    monthStart.setDate(1);
    
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthStart.getMonth() + 1);
    monthEnd.setDate(0);
    
    // Nombre de réservations par mois (augmente progressivement)
    const bookingsCount = Math.floor(15 + monthOffset * 8 + Math.random() * 10);
    
    for (let i = 0; i < bookingsCount; i++) {
      // Date aléatoire dans le mois
      const createdAt = new Date(monthStart.getTime() + Math.random() * (monthEnd.getTime() - monthStart.getTime()));
      
      // Durée de 3 à 14 jours
      const duration = Math.floor(Math.random() * 12) + 3;
      const startDate = new Date(createdAt);
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5));
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration);
      
      // Sélectionner un véhicule et client aléatoire
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
      const client = clients[Math.floor(Math.random() * clients.length)];
      
      const totalPrice = vehicle.price * duration;
      
      // Status basé sur les dates
      let status = 'COMPLETED';
      if (startDate > today) {
        status = 'PENDING';
      } else if (endDate > today) {
        status = 'ACTIVE';
      }
      
      const booking = await prisma.booking.create({
        data: {
          userId: client.id,
          vehicleId: vehicle.id,
          stationId: vehicle.stationId,
          startDate,
          endDate,
          totalPrice,
          status,
          pickupLocation: `Station ${vehicle.stationId.substring(0, 8)}`,
          dropoffLocation: `Station ${vehicle.stationId.substring(0, 8)}`,
          createdAt,
        },
      });
      bookings.push(booking);
    }
  }

  console.log('✅ Réservations créées');

  // ========== INCIDENTS ==========
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  for (let i = 0; i < Math.min(5, completedBookings.length); i++) {
    const booking = completedBookings[Math.floor(Math.random() * completedBookings.length)];
    await prisma.incident.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        description: [
          'Rayure sur la porte avant droite',
          'Pneu crevé sur autoroute',
          'Problème de démarrage',
          'Rétroviseur endommagé',
          'Éraflure sur le pare-chocs',
        ][Math.floor(Math.random() * 5)],
        severity: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.3 ? 'RESOLVED' : 'PENDING',
        createdAt: booking.createdAt,
      },
    });
  }

  console.log('✅ Incidents créés');

  // ========== MAINTENANCE ==========
  const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE' || Math.random() > 0.7);
  for (const vehicle of maintenanceVehicles.slice(0, 3)) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30));
    
    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle.id,
        type: ['REPAIR', 'SERVICE', 'INSPECTION'][Math.floor(Math.random() * 3)],
        description: 'Révision périodique et changement huile',
        cost: Math.floor(Math.random() * 500) + 100,
        scheduledAt: scheduledDate,
      },
    });
  }

  console.log('✅ Maintenance créée');

  // ========== STATISTICS ==========
  const totalUsers = await prisma.user.count();
  const totalStations = await prisma.station.count();
  const totalVehicles = await prisma.vehicle.count();
  const totalBookings = await prisma.booking.count();
  const totalIncidents = await prisma.incident.count();

  console.log('\n📊 Statistiques finales:');
  console.log(`   👥 Utilisateurs: ${totalUsers} (${clients.length} clients)`);
  console.log(`   🏢 Stations: ${totalStations}`);
  console.log(`   🚗 Véhicules: ${totalVehicles}`);
  console.log(`   📅 Réservations: ${totalBookings}`);
  console.log(`   ⚠️  Incidents: ${totalIncidents}`);
  
  console.log('\n🔐 Comptes disponibles:');
  console.log('   Admin: parcadmin@autofleet.tn / parcadmin123');
  console.log('   Direction: direction@autofleet.tn / direction123');
  console.log('   Client: ahmed.benali@email.tn / client123');
  
  console.log('\n✅ Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error(' Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
