import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' D�marrage du seed...');

  // Clear existing data
  console.log('  Suppression de toutes les donn�es...');
  await prisma.notification.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();
  console.log(' Base de donn�es vid�e');

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

  console.log('✅ Utilisateurs créés');
  console.log('\n📧 Comptes disponibles:');
  console.log('   Admin de Parc: parcadmin@autofleet.tn / parcadmin123');
  console.log('   Direction: direction@autofleet.tn / direction123');
  
  // Create stations
  console.log('\n🏢 Création des stations...');
  
  const stations = [
    {
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
    {
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
    {
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
    {
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
      isOpen: true,
    },
    {
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
  ];

  const createdStations = [];
  for (const stationData of stations) {
    const station = await prisma.station.create({ data: stationData });
    createdStations.push(station);
  }
  console.log(`✅ ${createdStations.length} stations créées`);

  // Create vehicles with images
  console.log('\n🚗 Création des véhicules avec images...');
  
  const vehicleModels = [
    { 
      brand: 'Renault', 
      model: 'Clio 5', 
      category: 'Économique', 
      price: 45, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
    },
    { 
      brand: 'Peugeot', 
      model: '208', 
      category: 'Économique', 
      price: 50, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80'
    },
    { 
      brand: 'Dacia', 
      model: 'Sandero', 
      category: 'Économique', 
      price: 35, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
    },
    { 
      brand: 'Fiat', 
      model: '500', 
      category: 'Économique', 
      price: 40, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 4,
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80'
    },
    { 
      brand: 'Renault', 
      model: 'Captur', 
      category: 'Compacte', 
      price: 60, 
      transmission: 'Automatique', 
      fuelType: 'Diesel', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'
    },
    { 
      brand: 'Peugeot', 
      model: '3008', 
      category: 'SUV', 
      price: 75, 
      transmission: 'Automatique', 
      fuelType: 'Diesel', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80'
    },
    { 
      brand: 'Volkswagen', 
      model: 'Polo', 
      category: 'Compacte', 
      price: 55, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=800&q=80'
    },
    { 
      brand: 'Toyota', 
      model: 'Yaris', 
      category: 'Économique', 
      price: 48, 
      transmission: 'Automatique', 
      fuelType: 'Hybride', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'
    },
    { 
      brand: 'Hyundai', 
      model: 'i10', 
      category: 'Économique', 
      price: 38, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80'
    },
    { 
      brand: 'Kia', 
      model: 'Picanto', 
      category: 'Économique', 
      price: 36, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80'
    },
    { 
      brand: 'Citroën', 
      model: 'C3', 
      category: 'Compacte', 
      price: 52, 
      transmission: 'Manuelle', 
      fuelType: 'Diesel', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80'
    },
    { 
      brand: 'Seat', 
      model: 'Ibiza', 
      category: 'Compacte', 
      price: 50, 
      transmission: 'Manuelle', 
      fuelType: 'Essence', 
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80'
    },
  ];

  const colors = ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge', 'Argent'];
  let vehicleCount = 0;
  let plateNumber = 1000;

  for (const station of createdStations) {
    const numVehicles = Math.floor(Math.random() * 3) + 4; // 4 to 6 vehicles
    
    for (let i = 0; i < numVehicles; i++) {
      const model = vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const year = 2021 + Math.floor(Math.random() * 4); // 2021-2024
      const mileage = Math.floor(Math.random() * 50000) + 5000; // 5000-55000 km
      
      await prisma.vehicle.create({
        data: {
          brand: model.brand,
          model: model.model,
          year,
          category: model.category,
          licensePlate: `TUN-${plateNumber++}`,
          color,
          seats: model.seats,
          transmission: model.transmission,
          fuelType: model.fuelType,
          price: model.price,
          status: 'AVAILABLE',
          mileage,
          imageUrl: model.imageUrl,
          stationId: station.id,
        },
      });
      vehicleCount++;
    }
  }

  console.log(`✅ ${vehicleCount} véhicules avec images créés`);
  
  console.log('\n🎉 Seed terminé avec succès!');
  console.log('📝 Base de données initialisée avec:');
  console.log(`   ✓ 2 utilisateurs (Admin + Direction)`);
  console.log(`   ✓ ${createdStations.length} stations`);
  console.log(`   ✓ ${vehicleCount} véhicules avec images`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
