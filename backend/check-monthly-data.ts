import prisma from './src/lib/prisma';

async function checkData() {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  console.log('=== VÉRIFICATION DES DONNÉES MENSUELLES ===\n');
  console.log('Mois actuel commence le:', currentMonthStart.toLocaleDateString());
  console.log('Mois dernier:', lastMonthStart.toLocaleDateString(), 'au', lastMonthEnd.toLocaleDateString());
  console.log('\n');

  // Vehicles
  const currentVehicles = await prisma.vehicle.count();
  const lastVehicles = await prisma.vehicle.count({ where: { createdAt: { lte: lastMonthEnd } } });
  console.log('VÉHICULES:');
  console.log('  Total actuel:', currentVehicles);
  console.log('  Total fin mois dernier:', lastVehicles);
  console.log('  Changement:', currentVehicles - lastVehicles);
  console.log('');

  // Users
  const currentUsers = await prisma.user.count({ where: { role: 'CLIENT' } });
  const lastUsers = await prisma.user.count({
    where: {
      role: 'CLIENT',
      createdAt: { lte: lastMonthEnd }
    }
  });
  console.log('UTILISATEURS (Clients):');
  console.log('  Total actuel:', currentUsers);
  console.log('  Total fin mois dernier:', lastUsers);
  console.log('  Changement:', currentUsers - lastUsers);
  console.log('');

  // Bookings
  const currentBookings = await prisma.booking.count({
    where: { createdAt: { gte: currentMonthStart } }
  });
  const lastBookings = await prisma.booking.count({
    where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
  });
  console.log('RÉSERVATIONS:');
  console.log('  Ce mois:', currentBookings);
  console.log('  Mois dernier:', lastBookings);
  console.log('  Changement:', currentBookings - lastBookings);
  console.log('');

  // Revenue
  const currentRevenue = await prisma.booking.aggregate({
    where: {
      status: { in: ['COMPLETED', 'ACTIVE'] },
      createdAt: { gte: currentMonthStart }
    },
    _sum: { totalPrice: true }
  });
  const lastRevenue = await prisma.booking.aggregate({
    where: {
      status: { in: ['COMPLETED', 'ACTIVE'] },
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
    },
    _sum: { totalPrice: true }
  });
  const currentRev = currentRevenue._sum.totalPrice || 0;
  const lastRev = lastRevenue._sum.totalPrice || 0;
  const revenueChange = lastRev > 0 ? ((currentRev - lastRev) / lastRev * 100).toFixed(1) : '0.0';
  
  console.log('REVENUS:');
  console.log('  Ce mois:', currentRev, 'TND');
  console.log('  Mois dernier:', lastRev, 'TND');
  console.log('  Changement:', revenueChange + '%');
  console.log('');

  // Incidents
  const currentIncidents = await prisma.incident.count({
    where: { createdAt: { gte: currentMonthStart } }
  });
  const lastIncidents = await prisma.incident.count({
    where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } }
  });
  console.log('INCIDENTS:');
  console.log('  Ce mois:', currentIncidents);
  console.log('  Mois dernier:', lastIncidents);
  console.log('  Changement:', currentIncidents - lastIncidents);

  await prisma.$disconnect();
  process.exit(0);
}

checkData().catch((error) => {
  console.error('Erreur:', error);
  process.exit(1);
});
