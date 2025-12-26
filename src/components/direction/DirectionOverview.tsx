import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Car, Users, DollarSign, AlertCircle, MapPin, Wrench } from "lucide-react";

export function DirectionOverview() {
  const kpiCards = [
    {
      title: "Flotte totale",
      value: "156 véhicules",
      change: "+8 ce mois",
      trend: "up",
      icon: Car,
      color: "text-blue-600",
    },
    {
      title: "Clients actifs",
      value: "2,845",
      change: "+124 ce mois",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Revenu mensuel",
      value: "67,340 TND",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Taux d'utilisation",
      value: "78%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Stations actives",
      value: "12",
      change: "+2 ce mois",
      trend: "up",
      icon: MapPin,
      color: "text-indigo-600",
    },
    {
      title: "Incidents",
      value: "8",
      change: "-4 vs mois dernier",
      trend: "down",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      title: "Maintenance",
      value: "15 planifiées",
      change: "5 en cours",
      trend: "neutral",
      icon: Wrench,
      color: "text-yellow-600",
    },
    {
      title: "Satisfaction client",
      value: "4.6/5",
      change: "+0.2",
      trend: "up",
      icon: Users,
      color: "text-pink-600",
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000, bookings: 320, costs: 28000 },
    { month: "Fév", revenue: 52000, bookings: 380, costs: 30000 },
    { month: "Mar", revenue: 48000, bookings: 350, costs: 29000 },
    { month: "Avr", revenue: 61000, bookings: 420, costs: 32000 },
    { month: "Mai", revenue: 55000, bookings: 390, costs: 31000 },
    { month: "Juin", revenue: 67340, bookings: 450, costs: 35000 },
  ];

  const cityPerformance = [
    { city: "Tunis", revenue: 35000, utilization: 85 },
    { city: "Sfax", revenue: 18000, utilization: 72 },
    { city: "Sousse", revenue: 10000, utilization: 68 },
    { city: "Monastir", revenue: 4340, utilization: 54 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
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
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rentabilité mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenu" />
                <Bar dataKey="costs" fill="#ef4444" name="Coûts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance par ville</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Revenu (TND)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux d'utilisation par ville</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cityPerformance.map((city) => (
                <div key={city.city}>
                  <div className="flex items-center justify-between mb-2">
                    <span>{city.city}</span>
                    <span className="text-sm">{city.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        city.utilization > 75 ? "bg-green-500" :
                        city.utilization > 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${city.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Tesla Model 3", bookings: 45, revenue: 5400 },
                { name: "Peugeot 3008", bookings: 38, revenue: 3230 },
                { name: "Renault Clio", bookings: 35, revenue: 1575 },
              ].map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div>{vehicle.name}</div>
                    <div className="text-sm text-gray-600">{vehicle.bookings} réservations</div>
                  </div>
                  <div className="text-right">
                    <div>{vehicle.revenue} TND</div>
                  </div>
                </div>
              ))}
            </div>
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
