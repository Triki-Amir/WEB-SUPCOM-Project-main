import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Car, Users, DollarSign, AlertCircle, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

interface DashboardStats {
  totalVehicles: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  totalUsers: number;
  totalIncidents: number;
  availableVehicles?: number;
  rentedVehicles?: number;
  maintenanceVehicles?: number;
  utilizationRate?: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
}

interface CityPerformance {
  city: string;
  totalRevenue: number;
  totalVehicles: number;
  occupancyRate: string;
}

interface TopVehicle {
  name: string;
  totalBookings: number;
  totalRevenue: number;
}

interface MonthlyChanges {
  vehicles: { change: number; changeText: string; trend: 'up' | 'down' };
  users: { change: number; changeText: string; trend: 'up' | 'down' };
  revenue: { changePercent: number; changeText: string; trend: 'up' | 'down' };
  activeBookings: { changePercent: number; changeText: string; trend: 'up' | 'down' };
  totalBookings: { change: number; changeText: string; trend: 'up' | 'down' };
  incidents: { change: number; changeText: string; trend: 'up' | 'down' };
}

interface Alert {
  type: 'warning' | 'info' | 'success';
  message: string;
}

interface Goal {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export function DirectionOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [cityPerformance, setCityPerformance] = useState<CityPerformance[]>([]);
  const [topVehicles, setTopVehicles] = useState<TopVehicle[]>([]);
  const [monthlyChanges, setMonthlyChanges] = useState<MonthlyChanges | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardData, monthlyTrends, stationStats, vehiclePerformance] = await Promise.all([
        api.analytics.getDashboard(),
        api.analytics.getMonthlyTrends(),
        api.analytics.getStationStatistics(),
        api.analytics.getVehiclePerformance()
      ]);
      
      // Transform dashboard stats
      const transformedStats: DashboardStats = {
        totalVehicles: dashboardData.vehicles?.total || 0,
        totalBookings: dashboardData.bookings?.total || 0,
        totalRevenue: dashboardData.revenue?.total || 0,
        activeBookings: dashboardData.bookings?.active || 0,
        totalUsers: dashboardData.users?.total || 0,
        totalIncidents: dashboardData.incidents?.open || 0,
        availableVehicles: dashboardData.vehicles?.available || 0,
        rentedVehicles: dashboardData.vehicles?.rented || 0,
        maintenanceVehicles: dashboardData.vehicles?.maintenance || 0,
        utilizationRate: parseFloat(dashboardData.vehicles?.utilizationRate || '0'),
      };
      
      setStats(transformedStats);
      setMonthlyData(monthlyTrends);
      setCityPerformance(stationStats);
      
      // Try to load monthly changes (optional - may fail if backend not restarted)
      try {
        const changes = await api.analytics.getMonthlyChanges();
        setMonthlyChanges(changes);
      } catch (error) {
        console.warn("Monthly changes not available yet - backend needs restart:", error);
        // Leave monthlyChanges as null, fallback values will be used
      }

      // Load alerts and goals
      try {
        const [alertsData, goalsData] = await Promise.all([
          api.analytics.getAlerts(),
          api.analytics.getGoals()
        ]);
        setAlerts(alertsData);
        setGoals(goalsData);
      } catch (error) {
        console.warn("Alerts/Goals not available:", error);
      }
      
      // Get top 3 vehicles
      const topThree = vehiclePerformance
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 3)
        .map(v => ({
          name: v.name,
          totalBookings: v.totalBookings,
          totalRevenue: v.totalRevenue
        }));
      setTopVehicles(topThree);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>Impossible de charger les statistiques</p>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Flotte totale",
      value: `${stats.totalVehicles} véhicules`,
      change: monthlyChanges?.vehicles.changeText || "+0 ce mois",
      trend: monthlyChanges?.vehicles.trend || "up",
      icon: Car,
      color: "text-blue-600",
    },
    {
      title: "Clients actifs",
      value: stats.totalUsers.toString(),
      change: monthlyChanges?.users.changeText || "+0 ce mois",
      trend: monthlyChanges?.users.trend || "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Revenu total",
      value: `${stats.totalRevenue.toFixed(2)} TND`,
      change: monthlyChanges?.revenue.changeText || "+0%",
      trend: monthlyChanges?.revenue.trend || "up",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Réservations actives",
      value: stats.activeBookings.toString(),
      change: monthlyChanges?.activeBookings.changeText || "+0%",
      trend: monthlyChanges?.activeBookings.trend || "up",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Total réservations",
      value: stats.totalBookings.toString(),
      change: monthlyChanges?.totalBookings.changeText || "+0 ce mois",
      trend: monthlyChanges?.totalBookings.trend || "up",
      icon: MapPin,
      color: "text-indigo-600",
    },
    {
      title: "Incidents",
      value: stats.totalIncidents.toString(),
      change: monthlyChanges?.incidents.changeText || "0 vs mois dernier",
      trend: monthlyChanges?.incidents.trend || "down",
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  // Enrichir les données mensuelles avec des coûts estimés (70% du revenu)
  const revenueDataWithCosts = monthlyData.map(item => ({
    month: item.month,
    revenue: item.revenue,
    bookings: item.bookings,
    costs: Math.round(item.revenue * 0.55) // Estimation des coûts à 55% du revenu
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                {kpi.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                {kpi.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
              </div>
              <div className="text-2xl mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-600 mb-1">{kpi.title}</div>
              <div className={`text-xs ${
                kpi.trend === "up" ? "text-green-600" : 
                kpi.trend === "down" ? "text-red-600" : 
                "text-gray-600"
              }`}>
                {kpi.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenu et Réservations</CardTitle>
              <Badge>6 derniers mois</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Revenu (TND)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Réservations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rentabilité mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueDataWithCosts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueDataWithCosts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenu" />
                  <Bar dataKey="costs" fill="#ef4444" name="Coûts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance par ville</CardTitle>
          </CardHeader>
          <CardContent>
            {cityPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalRevenue" fill="#8b5cf6" name="Revenu (TND)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux d'utilisation par ville</CardTitle>
          </CardHeader>
          <CardContent>
            {cityPerformance.length > 0 ? (
              <div className="space-y-4">
                {cityPerformance.map((city) => {
                  const utilization = parseFloat(city.occupancyRate);
                  return (
                    <div key={city.city}>
                      <div className="flex items-center justify-between mb-2">
                        <span>{city.city}</span>
                        <span className="text-sm">{city.occupancyRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            utilization > 75 ? "bg-green-500" :
                            utilization > 60 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${city.occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            {topVehicles.length > 0 ? (
              <div className="space-y-3">
                {topVehicles.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div>{vehicle.name}</div>
                      <div className="text-sm text-gray-600">{vehicle.totalBookings} réservations</div>
                    </div>
                    <div className="text-right">
                      <div>{Math.round(vehicle.totalRevenue)} TND</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes importantes</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    alert.type === "warning" ? "bg-yellow-50 border-l-4 border-yellow-500" :
                    alert.type === "info" ? "bg-blue-50 border-l-4 border-blue-500" :
                    "bg-green-50 border-l-4 border-green-500"
                  }`}>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Aucune alerte</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objectifs mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal, index) => {
                  const percentage = Math.min((goal.current / goal.target) * 100, 100);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{goal.label}</span>
                        <span className="text-sm">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 100 ? 'bg-green-500' :
                            percentage >= 75 ? 'bg-blue-500' :
                            percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage.toFixed(0)}% atteint
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Chargement...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
