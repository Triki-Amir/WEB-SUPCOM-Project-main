import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";

export function DirectionAnalytics() {
  const yearlyTrend = [
    { month: "Jan", revenue: 45000, bookings: 320, customers: 2320 },
    { month: "Fév", revenue: 52000, bookings: 380, customers: 2410 },
    { month: "Mar", revenue: 48000, bookings: 350, customers: 2505 },
    { month: "Avr", revenue: 61000, bookings: 420, customers: 2645 },
    { month: "Mai", revenue: 55000, bookings: 390, customers: 2721 },
    { month: "Juin", revenue: 67340, bookings: 450, customers: 2845 },
  ];

  const categoryRevenue = [
    { category: "Compacte", revenue: 18500, percentage: 27.5 },
    { category: "Berline", revenue: 22340, percentage: 33.2 },
    { category: "SUV", revenue: 16200, percentage: 24.1 },
    { category: "Électrique", revenue: 10300, percentage: 15.3 },
  ];

  const cityComparison = [
    { city: "Tunis", q1: 95000, q2: 105000 },
    { city: "Sfax", q1: 48000, q2: 54000 },
    { city: "Sousse", q1: 28000, q2: 30000 },
    { city: "Monastir", q1: 12000, q2: 13000 },
  ];

  const customerSegments = [
    { segment: "Particuliers", value: 65, color: "#3b82f6" },
    { segment: "Entreprises", value: 25, color: "#10b981" },
    { segment: "Touristes", value: 10, color: "#f59e0b" },
  ];

  const weekdayBookings = [
    { day: "Lun", bookings: 58 },
    { day: "Mar", bookings: 62 },
    { day: "Mer", bookings: 71 },
    { day: "Jeu", bookings: 65 },
    { day: "Ven", bookings: 88 },
    { day: "Sam", bookings: 95 },
    { day: "Dim", bookings: 82 },
  ];

  const handleExportData = () => {
    toast.success("Export des données en cours...");
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 mois</SelectItem>
              <SelectItem value="3months">3 mois</SelectItem>
              <SelectItem value="6months">6 mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
              <SelectItem value="all">Tout</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          <Download className="w-4 h-4 mr-2" />
          Exporter les données
        </Button>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenu</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du revenu</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={yearlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Revenu (TND)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenu par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.category}: ${entry.percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {categoryRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comparaison trimestrielle par ville</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="q1" fill="#3b82f6" name="Q1 2025" />
                  <Bar dataKey="q2" fill="#10b981" name="Q2 2025" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Réservations mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={yearlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Réservations"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Réservations par jour de la semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={weekdayBookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8b5cf6" name="Réservations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Croissance des clients</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={yearlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="customers"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      name="Clients actifs"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segmentation clients</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.segment}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Indicateurs de performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Revenu moyen par réservation", value: "149 TND", trend: "+5%" },
                    { label: "Durée moyenne de location", value: "3.2 jours", trend: "+0.3" },
                    { label: "Taux de conversion", value: "34%", trend: "+2%" },
                    { label: "Valeur vie client (CLV)", value: "890 TND", trend: "+12%" },
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                        <div className="text-xl mt-1">{metric.value}</div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">{metric.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Analyse comparative</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { metric: "Satisfaction", actual: 4.6, target: 4.5 },
                    { metric: "Utilisation", actual: 78, target: 75 },
                    { metric: "Rentabilité", actual: 48, target: 45 },
                    { metric: "Rétention", actual: 72, target: 70 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="#10b981" name="Réel" />
                    <Bar dataKey="target" fill="#3b82f6" name="Objectif" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
