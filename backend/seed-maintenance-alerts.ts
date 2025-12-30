import prisma from './src/lib/prisma';

async function addMaintenanceData() {
  console.log('🔧 Ajout de données de maintenance...\n');

  try {
    // Get vehicles
    const vehicles = await prisma.vehicle.findMany({ take: 10 });

    if (vehicles.length === 0) {
      console.log('⚠️  Aucun véhicule trouvé');
      return;
    }

    // Set 3 vehicles to MAINTENANCE status
    console.log('🚗 Mise à jour du statut de 3 véhicules en MAINTENANCE...');
    for (let i = 0; i < Math.min(3, vehicles.length); i++) {
      await prisma.vehicle.update({
        where: { id: vehicles[i].id },
        data: { status: 'MAINTENANCE' }
      });
    }
    console.log('  ✅ 3 véhicules en statut MAINTENANCE');

    // Add upcoming maintenance (within 7 days)
    console.log('\n📅 Création de maintenances programmées pour cette semaine...');
    const now = new Date();
    
    for (let i = 3; i < Math.min(6, vehicles.length); i++) {
      const daysAhead = (i - 2); // 1-3 days ahead
      const scheduledDate = new Date(now);
      scheduledDate.setDate(scheduledDate.getDate() + daysAhead);

      await prisma.maintenance.create({
        data: {
          vehicleId: vehicles[i].id,
          type: i % 2 === 0 ? 'ROUTINE' : 'REPAIR',
          description: `Maintenance ${i % 2 === 0 ? 'de routine' : 'réparation'} programmée - ${vehicles[i].brand} ${vehicles[i].model}`,
          scheduledAt: scheduledDate,
          cost: 150 + (i * 30)
        }
      });
    }
    console.log('  ✅ 3 maintenances programmées cette semaine');

    // Create some open incidents
    console.log('\n⚠️  Création d\'incidents ouverts...');
    const bookings = await prisma.booking.findMany({ 
      where: { status: 'ACTIVE' },
      take: 3 
    });
    const users = await prisma.user.findMany({ 
      where: { role: 'CLIENT' },
      take: 3 
    });

    if (bookings.length > 0 && users.length > 0) {
      const incidents = [
        { severity: 'LOW', description: 'Rayure mineure sur portière avant droite' },
        { severity: 'MEDIUM', description: 'Problème avec le système de climatisation' },
        { severity: 'LOW', description: 'Niveau d\'huile à vérifier' }
      ];

      for (let i = 0; i < Math.min(incidents.length, bookings.length); i++) {
        await prisma.incident.create({
          data: {
            userId: users[i % users.length].id,
            bookingId: bookings[i].id,
            description: incidents[i].description,
            severity: incidents[i].severity,
            status: i === 0 ? 'PENDING' : 'IN_PROGRESS'
          }
        });
      }
      console.log(`  ✅ ${incidents.length} incidents créés`);
    }

    console.log('\n📊 RÉSUMÉ:');
    const [maintenanceVehicles, upcomingMaint, openInc] = await Promise.all([
      prisma.vehicle.count({ where: { status: 'MAINTENANCE' } }),
      prisma.maintenance.count({
        where: {
          scheduledAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          completedAt: null
        }
      }),
      prisma.incident.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } })
    ]);

    console.log(`  Véhicules en maintenance: ${maintenanceVehicles}`);
    console.log(`  Maintenances cette semaine: ${upcomingMaint}`);
    console.log(`  Incidents ouverts: ${openInc}`);

    console.log('\n✅ Données de maintenance ajoutées avec succès!');
    console.log('\n💡 Les alertes devraient maintenant apparaître dans le dashboard');
    console.log('   Redémarrez le backend et rafraîchissez la page!\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMaintenanceData();
