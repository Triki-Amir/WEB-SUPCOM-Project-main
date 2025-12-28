import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Vérification des données dans la base...\n');

    const users = await prisma.user.count();
    const stations = await prisma.station.count();
    const vehicles = await prisma.vehicle.count();
    const bookings = await prisma.booking.count();
    const incidents = await prisma.incident.count();
    const maintenance = await prisma.maintenance.count();

    console.log('📊 Statistiques de la base de données:');
    console.log(`   👥 Utilisateurs: ${users}`);
    console.log(`   🏢 Stations: ${stations}`);
    console.log(`   🚗 Véhicules: ${vehicles}`);
    console.log(`   📅 Réservations: ${bookings}`);
    console.log(`   ⚠️  Incidents: ${incidents}`);
    console.log(`   🔧 Maintenance: ${maintenance}`);

    // Vérifier quelques réservations pour les analytics
    const completedBookings = await prisma.booking.count({
      where: { status: 'COMPLETED' }
    });
    const activeBookings = await prisma.booking.count({
      where: { status: 'ACTIVE' }
    });

    console.log('\n📈 Réservations par statut:');
    console.log(`   ✅ Complétées: ${completedBookings}`);
    console.log(`   🔄 Actives: ${activeBookings}`);

    // Vérifier le revenu total
    const revenue = await prisma.booking.aggregate({
      where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
      _sum: { totalPrice: true }
    });

    console.log('\n💰 Revenu total: ' + (revenue._sum.totalPrice || 0).toFixed(2) + ' TND');

    console.log('\n✅ Base de données connectée et remplie!');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
