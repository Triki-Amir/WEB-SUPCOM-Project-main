import prisma from './src/lib/prisma';

async function seedDemoData() {
  console.log('🌱 Enrichissement des données de démonstration...\n');

  // Dates pour créer des données historiques
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 15);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);

  try {
    // 1. Ajouter des véhicules supplémentaires du mois dernier
    console.log('📦 Ajout de véhicules...');
    const stations = await prisma.station.findMany();
    
    if (stations.length > 0) {
      // Marquer quelques véhicules comme créés le mois dernier
      const vehicles = await prisma.vehicle.findMany({ take: 5 });
      for (const vehicle of vehicles) {
        await prisma.vehicle.update({
          where: { id: vehicle.id },
          data: { createdAt: lastMonth }
        });
      }
      console.log('  ✅ 5 véhicules datés du mois dernier');
    }

    // 2. Ajouter des utilisateurs clients du mois dernier
    console.log('👥 Ajout d\'utilisateurs...');
    const existingUsers = await prisma.user.findMany({ 
      where: { role: 'CLIENT' },
      take: 3 
    });
    
    for (const user of existingUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: { createdAt: lastMonth }
      });
    }
    console.log('  ✅ 3 clients datés du mois dernier');

    // 3. Créer des réservations pour le mois dernier
    console.log('📅 Création de réservations du mois dernier...');
    const vehiclesForBooking = await prisma.vehicle.findMany({ 
      where: { status: 'AVAILABLE' }, 
      take: 10,
      include: { station: true }
    });
    const clients = await prisma.user.findMany({ where: { role: 'CLIENT' } });

    if (vehiclesForBooking.length > 0 && clients.length > 0) {
      // Créer 15 réservations du mois dernier (toutes complétées)
      for (let i = 0; i < 15; i++) {
        const vehicle = vehiclesForBooking[i % vehiclesForBooking.length];
        const client = clients[i % clients.length];
        const startDate = new Date(lastMonth);
        startDate.setDate(startDate.getDate() + i);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 2);
        const days = 2;
        const totalPrice = vehicle.price * days;

        await prisma.booking.create({
          data: {
            userId: client.id,
            vehicleId: vehicle.id,
            stationId: vehicle.stationId,
            startDate,
            endDate,
            totalPrice,
            status: 'COMPLETED',
            createdAt: startDate
          }
        });
      }
      console.log('  ✅ 15 réservations complétées du mois dernier');

      // Créer 10 réservations de ce mois (mix de statuts)
      for (let i = 0; i < 10; i++) {
        const vehicle = vehiclesForBooking[i % vehiclesForBooking.length];
        const client = clients[i % clients.length];
        const startDate = new Date(thisMonth);
        startDate.setDate(startDate.getDate() + i);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 3);
        const days = 3;
        const totalPrice = vehicle.price * days;
        const statuses = ['COMPLETED', 'ACTIVE', 'PENDING'];
        const status = statuses[i % 3] as any;

        await prisma.booking.create({
          data: {
            userId: client.id,
            vehicleId: vehicle.id,
            stationId: vehicle.stationId,
            startDate,
            endDate,
            totalPrice,
            status,
            createdAt: startDate
          }
        });
      }
      console.log('  ✅ 10 réservations de ce mois');
    }

    // 4. Créer quelques incidents
    console.log('⚠️  Création d\'incidents...');
    const bookings = await prisma.booking.findMany({ take: 5 });
    const users = await prisma.user.findMany({ take: 5 });

    if (bookings.length > 0 && users.length > 0) {
      // 2 incidents du mois dernier (résolus)
      for (let i = 0; i < 2; i++) {
        await prisma.incident.create({
          data: {
            userId: users[i].id,
            bookingId: bookings[i].id,
            description: `Incident de test ${i + 1} - Problème mineur résolu`,
            severity: 'LOW',
            status: 'RESOLVED',
            createdAt: lastMonth
          }
        });
      }
      console.log('  ✅ 2 incidents résolus du mois dernier');

      // 1 incident de ce mois (en cours)
      await prisma.incident.create({
        data: {
          userId: users[0].id,
          bookingId: bookings[0].id,
          description: 'Incident actuel - Rayure sur véhicule',
          severity: 'MEDIUM',
          status: 'PENDING',
          createdAt: thisMonth
        }
      });
      console.log('  ✅ 1 incident en attente de ce mois');
    }

    // 5. Créer des maintenances
    console.log('🔧 Création de maintenances...');
    const maintenanceVehicles = await prisma.vehicle.findMany({ take: 3 });
    
    for (let i = 0; i < maintenanceVehicles.length; i++) {
      const vehicle = maintenanceVehicles[i];
      const maintenanceDate = i === 0 ? lastMonth : thisMonth;
      const isCompleted = i === 0;
      
      await prisma.maintenance.create({
        data: {
          vehicleId: vehicle.id,
          type: i % 2 === 0 ? 'ROUTINE' : 'REPAIR',
          description: `Maintenance ${i % 2 === 0 ? 'de routine' : 'réparation'} - ${vehicle.brand} ${vehicle.model}`,
          scheduledAt: maintenanceDate,
          completedAt: isCompleted ? maintenanceDate : null,
          cost: 150 + (i * 50),
          createdAt: maintenanceDate
        }
      });
    }
    console.log('  ✅ 3 maintenances créées');

    // Statistiques finales
    console.log('\n📊 STATISTIQUES FINALES:');
    const stats = await Promise.all([
      prisma.vehicle.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
        _sum: { totalPrice: true }
      }),
      prisma.incident.count(),
      prisma.maintenance.count()
    ]);

    console.log(`  Véhicules: ${stats[0]}`);
    console.log(`  Clients: ${stats[1]}`);
    console.log(`  Réservations: ${stats[2]}`);
    console.log(`  Revenu total: ${stats[3]._sum.totalPrice || 0} TND`);
    console.log(`  Incidents: ${stats[4]}`);
    console.log(`  Maintenances: ${stats[5]}`);

    console.log('\n✅ Données de démonstration enrichies avec succès!');
    console.log('\n💡 Pour visualiser la base de données:');
    console.log('   npx prisma studio\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'enrichissement des données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoData();
