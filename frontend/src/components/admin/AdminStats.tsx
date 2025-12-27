import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Car, Users, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";

interface DashboardStats {
  vehicles: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
    utilizationRate: string;
  };
  bookings: {
    total: number;
    pending: number;
    active: number;
    completed: number;
  };
  revenue: {
    total: number;
    averagePerBooking: string;
  };
  users: {
    total: number;
  };
  stations: {
    total: number;
  };
  incidents: {
    open: number;
  };
}

interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
}

interface StationStats {
  id: string;
  name: string;
  city: string;
  totalVehicles: number;
  availablePlaces: number;
  capacity: number;
  occupancyRate: string;
  totalBookings: number;
  totalRevenue: number;
  isOpen: boolean;
}

interface VehiclePerformance {
  id: string;
  name: string;
  category: string;
  station: string;
  city: string;
  totalBookings: number;
  totalRevenue: number;
  status: string;
  mileage: number;
}

export function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [stationStats, setStationStats] = useState<StationStats[]>([]);
  const [vehiclePerformance, setVehiclePerformance] = useState<VehiclePerformance[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, trends, stations, vehicles] = await Promise.all([
        api.analytics.getDashboard(),
        api.analytics.getBookingTrends(7),
        api.analytics.getStationStatistics(),
        api.analytics.getVehiclePerformance(),
      ]);

      setDashboardStats(stats as any);
      setBookingTrends(trends as any);
      setStationStats(stations as any);
      setVehiclePerformance(vehicles as any);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Calculate daily bookings from trends
  const bookingsData = bookingTrends.map((trend, index) => {
    const date = new Date(trend.date);
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return {
      name: dayNames[date.getDay()],
      value: trend.bookings,
    };
  });

  // Get today's statistics from trends
  const today = new Date().toISOString().split('T')[0];
  const todayTrend = bookingTrends.find(trend => trend.date === today);
  const todayBookings = todayTrend?.bookings || 0;
  const todayRevenue = todayTrend?.revenue || 0;

  // Calculate weekly comparison
  const lastWeekBookings = bookingTrends.length > 0 
    ? bookingTrends.reduce((sum, t) => sum + t.bookings, 0) / bookingTrends.length 
    : 0;
  const bookingsChange = lastWeekBookings > 0 
    ? Math.round(((todayBookings - lastWeekBookings) / lastWeekBookings) * 100) 
    : 0;

  // Calculate monthly revenue (aggregate by month from trends)
  const monthlyRevenue = bookingTrends.reduce((acc, trend) => {
    const date = new Date(trend.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[monthKey]) {
      acc[monthKey] = { revenue: 0, month: date };
    }
    acc[monthKey].revenue += trend.revenue;
    return acc;
  }, {} as Record<string, { revenue: number; month: Date }>);

  const revenueData = Object.values(monthlyRevenue).map(item => ({
    name: item.month.toLocaleDateString('fr-FR', { month: 'short' }),
    value: Math.round(item.revenue),
  }));

  // Vehicle category data from performance
  const categoryMap = vehiclePerformance.reduce((acc, vehicle) => {
    acc[vehicle.category] = (acc[vehicle.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  const vehicleCategoryData = Object.entries(categoryMap).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length],
  }));

  // Station utilization data
  const utilizationData = stationStats.map(station => ({
    name: station.name,
    value: parseFloat(station.occupancyRate),
  }));

  const statsCards = [
    {
      title: "Véhicules actifs",
      value: dashboardStats.vehicles.total.toString(),
      change: `${dashboardStats.vehicles.utilizationRate}% utilisation`,
      trend: "up",
      icon: Car,
    },
    {
      title: "Réservations aujourd'hui",
      value: todayBookings.toString(),
      change: bookingsChange > 0 ? `+${bookingsChange}%` : `${bookingsChange}%`,
      trend: bookingsChange >= 0 ? "up" : "down",
      icon: Users,
    },
    {
      title: "Revenu journalier",
      value: `${Math.round(todayRevenue)} TND`,
      change: `${dashboardStats.bookings.active} actives`,
      trend: todayRevenue > 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Alertes actives",
      value: dashboardStats.incidents.open.toString(),
      change: `${dashboardStats.bookings.pending} en attente`,
      trend: dashboardStats.incidents.open > 5 ? "up" : "down",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-8 h-8 text-gray-600" />
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="text-2xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
              <div
                className={`text-xs mt-1 ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change} vs semaine dernière
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Réservations par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenu mensuel (TND)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux d'utilisation par station (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
