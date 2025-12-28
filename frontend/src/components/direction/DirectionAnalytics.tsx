import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
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

interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}

interface CityComparison {
  city: string;
  q1: number;
  q2: number;
}

interface WeekdayBooking {
  day: string;
  bookings: number;
}

interface MonthlyTrend {
  month: string;
  revenue: number;
  bookings: number;
}

export function DirectionAnalytics() {
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [vehiclePerformance, setVehiclePerformance] = useState<VehiclePerformance[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
  const [cityComparison, setCityComparison] = useState<CityComparison[]>([]);
  const [weekdayBookings, setWeekdayBookings] = useState<WeekdayBooking[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    loadAnalyticsData();
  }, [period]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [
        trendsData, 
        performanceData, 
        categoryData, 
        cityData, 
        weekdayData,
        monthlyData
      ] = await Promise.all([
        api.analytics.getBookingTrends(parseInt(period)).catch(() => []),
        api.analytics.getVehiclePerformance().catch(() => []),
        api.analytics.getRevenueByCategory().catch(() => []),
        api.analytics.getRevenueByCity().catch(() => []),
        api.analytics.getBookingsByWeekday().catch(() => []),
        api.analytics.getMonthlyTrends().catch(() => [])
      ]);
      
      console.log('📊 Analytics data loaded:', {
        trends: trendsData,
        performance: performanceData,
        category: categoryData,
        city: cityData,
        weekday: weekdayData,
        monthly: monthlyData
      });
      
      setBookingTrends(Array.isArray(trendsData) ? trendsData as BookingTrend[] : []);
      setVehiclePerformance(Array.isArray(performanceData) ? performanceData as VehiclePerformance[] : []);
      setCategoryRevenue(Array.isArray(categoryData) ? categoryData as CategoryRevenue[] : []);
      setCityComparison(Array.isArray(cityData) ? cityData as CityComparison[] : []);
      setWeekdayBookings(Array.isArray(weekdayData) ? weekdayData as WeekdayBooking[] : []);
      setMonthlyTrends(Array.isArray(monthlyData) ? monthlyData as MonthlyTrend[] : []);
    } catch (error: any) {
      console.error("Error loading analytics:", error);
      const errorMessage = error?.message || "Erreur inconnue";
      toast.error(`Impossible de charger certaines analyses: ${errorMessage}`);
      
      // Set empty arrays to prevent crashes
      setBookingTrends([]);
      setVehiclePerformance([]);
      setCategoryRevenue([]);
      setCityComparison([]);
      setWeekdayBookings([]);
      setMonthlyTrends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast.success("Export des données en cours...");
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  // Format booking trends with formatted dates
  const formattedBookingTrends = bookingTrends.map(trend => ({
    ...trend,
    displayDate: formatDate(trend.date)
  }));

  // Customer segments - keeping static for now as it requires booking metadata
  const customerSegments = [
    { segment: "Particuliers", value: 65, color: "#3b82f6" },
    { segment: "Entreprises", value: 25, color: "#10b981" },
    { segment: "Touristes", value: 10, color: "#f59e0b" },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 jours</SelectItem>
              <SelectItem value="30">30 jours</SelectItem>
              <SelectItem value="90">3 mois</SelectItem>
              <SelectItem value="180">6 mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          <Download className="w-4 h-4 mr-2" />
          Exporter les données
        </Button>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendances des réservations</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={formattedBookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="displayDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Réservations"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center py-8 text-gray-500">Aucune donnée disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance des véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              {vehiclePerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={vehiclePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalBookings" fill="#3b82f6" name="Réservations" />
                    <Bar dataKey="totalRevenue" fill="#10b981" name="Revenu (TND)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center py-8 text-gray-500">Aucune donnée disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du revenu</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlyTrends}>
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
                      label={(data) => `${data.category}: ${data.percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {categoryRevenue.map((_item, index) => (
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
                  <LineChart data={monthlyTrends}>
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
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      name="Réservations"
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
