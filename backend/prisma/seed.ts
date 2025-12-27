import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin user
  const hashedPasswordAdmin = await bcrypt.hash('parcadmin123', 10);
  await prisma.user.create({
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
  await prisma.user.create({
    data: {
      email: 'direction@autofleet.tn',
      password: hashedPasswordDirection,
      name: 'Direction',
      phone: '+21626331254',
      address: 'Tunis, Tunisie',
      role: 'DIRECTION',
    },
  });

  // Create Client user
  const hashedPasswordClient = await bcrypt.hash('client123', 10);
  await prisma.user.create({
    data: {
      email: 'client@autofleet.tn',
      password: hashedPasswordClient,
      name: 'Ahmed Ben Ali',
      phone: '+21698765432',
      address: 'Tunis, Tunisie',
      role: 'CLIENT',
    },
  });

  console.log('Users created');

  // Create stations
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
      availablePlaces: 15,
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
      availablePlaces: 10,
      openingHours: '08:00 - 20:00',
      isOpen: true,
    },
  });

  const sfaxStation = await prisma.station.create({
    data: {
      name: 'Sfax Centre',
      city: 'Sfax',
      address: 'Avenue Hedi Chaker',
      phone: '+216 74 234 567',
      email: 'sfax@autofleet.tn',
      latitude: 34.7404,
      longitude: 10.7608,
      capacity: 15,
      availablePlaces: 12,
      openingHours: '08:00 - 20:00',
      isOpen: true,
    },
  });

  const sousseStation = await prisma.station.create({
    data: {
      name: 'Sousse Plage',
      city: 'Sousse',
      address: 'Boulevard de la Corniche',
      phone: '+216 73 345 678',
      email: 'sousse@autofleet.tn',
      latitude: 35.8256,
      longitude: 10.6369,
      capacity: 12,
      availablePlaces: 8,
      openingHours: '08:00 - 21:00',
      isOpen: true,
    },
  });

  console.log('Stations created');

  // Create vehicles with matching categories
  const vehicles = [
    // Compacte - Tunis
    {
      brand: 'Renault',
      model: 'Clio',
      year: 2023,
      category: 'compacte',
      licensePlate: 'TUN-001',
      color: 'Blanc',
      seats: 5,
      transmission: 'Manuelle',
      fuelType: 'Essence',
      status: 'AVAILABLE',
      price: 45,
      stationId: tunisStation.id,
    },
    // Berline - Tunis
    {
      brand: 'Peugeot',
      model: '208',
      year: 2023,
      category: 'berline',
      licensePlate: 'TUN-002',
      color: 'Noir',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Diesel',
      status: 'AVAILABLE',
      price: 50,
      stationId: tunisStation.id,
    },
    // SUV - Tunis
    {
      brand: 'Toyota',
      model: 'RAV4',
      year: 2023,
      category: 'suv',
      licensePlate: 'TUN-003',
      color: 'Gris',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Essence',
      status: 'AVAILABLE',
      price: 75,
      stationId: tunisStation.id,
    },
    // Electrique - Lac 2
    {
      brand: 'Tesla',
      model: 'Model 3',
      year: 2023,
      category: 'electrique',
      licensePlate: 'TUN-004',
      color: 'Bleu',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Electrique',
      status: 'AVAILABLE',
      price: 120,
      stationId: lac2Station.id,
    },
    // Luxe - Lac 2
    {
      brand: 'BMW',
      model: 'Serie 5',
      year: 2023,
      category: 'luxe',
      licensePlate: 'TUN-005',
      color: 'Blanc',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Essence',
      status: 'AVAILABLE',
      price: 150,
      stationId: lac2Station.id,
    },
    // Compacte - Sfax
    {
      brand: 'Fiat',
      model: '500',
      year: 2022,
      category: 'compacte',
      licensePlate: 'TUN-006',
      color: 'Rouge',
      seats: 4,
      transmission: 'Manuelle',
      fuelType: 'Essence',
      status: 'AVAILABLE',
      price: 40,
      stationId: sfaxStation.id,
    },
    // SUV - Sfax
    {
      brand: 'Volkswagen',
      model: 'Tiguan',
      year: 2023,
      category: 'suv',
      licensePlate: 'TUN-007',
      color: 'Noir',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Diesel',
      status: 'AVAILABLE',
      price: 85,
      stationId: sfaxStation.id,
    },
    // Berline - Sousse
    {
      brand: 'Hyundai',
      model: 'i30',
      year: 2023,
      category: 'berline',
      licensePlate: 'TUN-008',
      color: 'Gris',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Essence',
      status: 'AVAILABLE',
      price: 55,
      stationId: sousseStation.id,
    },
    // Electrique - Sousse
    {
      brand: 'Nissan',
      model: 'Leaf',
      year: 2023,
      category: 'electrique',
      licensePlate: 'TUN-009',
      color: 'Blanc',
      seats: 5,
      transmission: 'Automatique',
      fuelType: 'Electrique',
      status: 'AVAILABLE',
      price: 100,
      stationId: sousseStation.id,
    },
  ];

  for (const vehicleData of vehicles) {
    await prisma.vehicle.create({
      data: vehicleData as any,
    });
  }

  console.log('9 Vehicles created');
  console.log('\nAccounts:');
  console.log('Admin: parcadmin@autofleet.tn / parcadmin123');
  console.log('Direction: direction@autofleet.tn / direction123');
  console.log('Client: client@autofleet.tn / client123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
