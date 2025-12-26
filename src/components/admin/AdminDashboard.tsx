import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AdminFleet } from "./AdminFleet";
import { AdminBookings } from "./AdminBookings";
import { AdminStations } from "./AdminStations";
import { AdminMaintenance } from "./AdminMaintenance";
import { AdminAlerts } from "./AdminAlerts";
import { AdminUsers } from "./AdminUsers";
import { AdminStats } from "./AdminStats";
import { Car, Calendar, MapPin, Wrench, AlertTriangle, Users, BarChart3 } from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("fleet");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="hidden sm:inline">Flotte</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Réservations</span>
            </TabsTrigger>
            <TabsTrigger value="stations" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Stations</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Alertes</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fleet">
            <AdminFleet />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>

          <TabsContent value="stations">
            <AdminStations />
          </TabsContent>

          <TabsContent value="maintenance">
            <AdminMaintenance />
          </TabsContent>

          <TabsContent value="alerts">
            <AdminAlerts />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
