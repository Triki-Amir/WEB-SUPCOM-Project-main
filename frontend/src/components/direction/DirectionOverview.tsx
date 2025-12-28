import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Car, Users, DollarSign, AlertCircle, MapPin, Wrench, Loader2 } from "lucide-react";
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

export function DirectionOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [cityPerformance, setCityPerformance] = useState<CityPerformance[]>([]);
  const [topVehicles, setTopVehicles] = useState<TopVehicle[]>([]);
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
      setMonthlyData(monthlyTrends as MonthlyData[]);
      setCityPerformance(stationStats as CityPerformance[]);
      
      // Get top 3 vehicles
      const topThree = (vehiclePerformance as any[])
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
      change: "+8 ce mois",
      trend: "up",
      icon: Car,
      color: "text-blue-600",
    },
    {
      title: "Clients actifs",
      value: stats.totalUsers.toString(),
      change: "+124 ce mois",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Revenu total",
      value: `${stats.totalRevenue.toFixed(2)} TND`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Réservations actives",
      value: stats.activeBookings.toString(),
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Total réservations",
      value: stats.totalBookings.toString(),
      change: "+2 ce mois",
      trend: "up",
      icon: MapPin,
      color: "text-indigo-600",
    },
    {
      title: "Incidents",
      value: stats.totalIncidents.toString(),
      change: "-4 vs mois dernier",
      trend: "down",
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
            <div className="space-y-3">
              {[
                { type: "warning", message: "3 véhicules nécessitent une maintenance" },
                { type: "info", message: "Nouveau contrat d'assurance à renouveler" },
                { type: "success", message: "Objectif mensuel atteint à 112%" },
              ].map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  alert.type === "warning" ? "bg-yellow-50 border-l-4 border-yellow-500" :
                  alert.type === "info" ? "bg-blue-50 border-l-4 border-blue-500" :
                  "bg-green-50 border-l-4 border-green-500"
                }`}>
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objectifs mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Revenu", current: 67340, target: 60000, unit: "TND" },
                { label: "Réservations", current: 450, target: 500, unit: "" },
                { label: "Nouveaux clients", current: 124, target: 150, unit: "" },
              ].map((goal, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{goal.label}</span>
                    <span className="text-sm">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
