import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Car, Users, DollarSign, AlertCircle } from "lucide-react";

export function AdminStats() {
  const statsCards = [
    {
      title: "Véhicules actifs",
      value: "32",
      change: "+12%",
      trend: "up",
      icon: Car,
    },
    {
      title: "Réservations aujourd'hui",
      value: "18",
      change: "+5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Revenu journalier",
      value: "2,450 TND",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Alertes actives",
      value: "4",
      change: "-2",
      trend: "down",
      icon: AlertCircle,
    },
  ];

  const bookingsData = [
    { name: "Lun", value: 12 },
    { name: "Mar", value: 15 },
    { name: "Mer", value: 18 },
    { name: "Jeu", value: 14 },
    { name: "Ven", value: 22 },
    { name: "Sam", value: 28 },
    { name: "Dim", value: 25 },
  ];

  const revenueData = [
    { name: "Jan", value: 45000 },
    { name: "Fév", value: 52000 },
    { name: "Mar", value: 48000 },
    { name: "Avr", value: 61000 },
    { name: "Mai", value: 55000 },
    { name: "Juin", value: 67000 },
  ];

  const vehicleCategoryData = [
    { name: "Compacte", value: 12, color: "#3b82f6" },
    { name: "Berline", value: 8, color: "#10b981" },
    { name: "SUV", value: 7, color: "#f59e0b" },
    { name: "Électrique", value: 5, color: "#8b5cf6" },
  ];

  const utilizationData = [
    { name: "Tunis Centre", value: 85 },
    { name: "Lac 2", value: 72 },
    { name: "Sfax Centre", value: 68 },
    { name: "Sousse", value: 54 },
    { name: "Aéroport", value: 91 },
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
