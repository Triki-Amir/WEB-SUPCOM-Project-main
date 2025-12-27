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

  console.log(' Utilisateurs cr��s');
  console.log('\n Comptes disponibles:');
  console.log('   Admin de Parc: parcadmin@autofleet.tn / parcadmin123');
  console.log('   Direction: direction@autofleet.tn / direction123');
  
  console.log('\n Seed termin� avec succ�s!');
  console.log(' Base de donn�es initialis�e avec:');
  console.log('    2 utilisateurs (Admin + Direction)');
  console.log('    Tables vides: Stations, V�hicules, R�servations, Maintenance, Incidents, Notifications');
}

main()
  .catch((e) => {
    console.error(' Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
