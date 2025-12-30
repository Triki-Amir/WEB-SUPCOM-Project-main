import prisma from './src/lib/prisma';

async function seedHistoricalData() {
  console.log('📊 Création de données historiques pour les graphiques...\n');

  try {
    // Obtenir les véhicules et clients existants
    const vehicles = await prisma.vehicle.findMany({ 
      include: { station: true },
      take: 15 
    });
    const clients = await prisma.user.findMany({ 
      where: { role: 'CLIENT' } 
    });

    if (vehicles.length === 0 || clients.length === 0) {
      console.log('⚠️  Veuillez d\'abord créer des véhicules et clients');
      return;
    }

    // Définir les données pour chaque mois (juillet à décembre 2025)
    const monthsData = [
      { month: 6, name: 'Juillet', bookings: 45, avgPrice: 850 },      // Juillet 2025
      { month: 7, name: 'Août', bookings: 52, avgPrice: 900 },         // Août 2025
      { month: 8, name: 'Septembre', bookings: 48, avgPrice: 820 },    // Septembre 2025
      { month: 9, name: 'Octobre', bookings: 42, avgPrice: 780 },      // Octobre 2025
      { month: 10, name: 'Novembre', bookings: 38, avgPrice: 730 },    // Novembre 2025
      { month: 11, name: 'Décembre', bookings: 25, avgPrice: 650 },    // Décembre 2025 (en cours)
    ];

    let totalCreated = 0;

    for (const monthData of monthsData) {
      console.log(`📅 Création de réservations pour ${monthData.name}...`);
      
      // Créer des réservations pour ce mois
      for (let i = 0; i < monthData.bookings; i++) {
        const vehicle = vehicles[i % vehicles.length];
        const client = clients[i % clients.length];
        
        // Date aléatoire dans le mois
        const day = Math.floor(Math.random() * 28) + 1;
        const startDate = new Date(2025, monthData.month, day, 10, 0, 0);
        
        // Durée aléatoire entre 1 et 5 jours
        const duration = Math.floor(Math.random() * 5) + 1;
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);
        
        // Prix avec variation
        const priceVariation = (Math.random() * 0.4 - 0.2); // ±20%
        const totalPrice = Math.round(monthData.avgPrice * duration * (1 + priceVariation));
        
        // Status : COMPLETED pour les mois passés, mix pour décembre
        const isDecember = monthData.month === 11;
        const statuses = isDecember 
          ? ['COMPLETED', 'COMPLETED', 'ACTIVE', 'PENDING']
          : ['COMPLETED'];
        const status = statuses[i % statuses.length] as any;

        try {
          await prisma.booking.create({
            data: {
              userId: client.id,
              vehicleId: vehicle.id,
              stationId: vehicle.stationId,
              startDate,
              endDate,
              totalPrice,
              status,
              createdAt: startDate,
              updatedAt: startDate
            }
          });
          totalCreated++;
        } catch (error) {
          // Ignorer les erreurs de doublons
        }
      }
      
      console.log(`  ✅ ${monthData.bookings} réservations créées pour ${monthData.name}`);
    }

    console.log(`\n✅ ${totalCreated} réservations historiques créées avec succès!\n`);

    // Afficher les statistiques finales par mois
    console.log('📊 STATISTIQUES PAR MOIS:\n');
    
    for (const monthData of monthsData) {
      const monthStart = new Date(2025, monthData.month, 1);
      const monthEnd = new Date(2025, monthData.month + 1, 0, 23, 59, 59);
      
      const [bookingCount, revenueData] = await Promise.all([
        prisma.booking.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        }),
        prisma.booking.aggregate({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            },
            status: { in: ['COMPLETED', 'ACTIVE'] }
          },
          _sum: { totalPrice: true }
        })
      ]);

      const revenue = revenueData._sum.totalPrice || 0;
      const costs = Math.round(revenue * 0.55); // Coûts estimés à 55%
      const profit = revenue - costs;

      console.log(`${monthData.name} 2025:`);
      console.log(`  Réservations: ${bookingCount}`);
      console.log(`  Revenu: ${Math.round(revenue)} TND`);
      console.log(`  Coûts: ${costs} TND`);
      console.log(`  Bénéfice: ${profit} TND`);
      console.log('');
    }

    console.log('💡 Maintenant:');
    console.log('   1. Redémarrez le backend (Ctrl+C puis npm run dev)');
    console.log('   2. Rafraîchissez le dashboard');
    console.log('   3. Les graphiques afficheront les vraies données!\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedHistoricalData();
