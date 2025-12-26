import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ClientSearch } from "./ClientSearch";
import { ClientBookings } from "./ClientBookings";
import { ClientHistory } from "./ClientHistory";
import { ClientProfile } from "./ClientProfile";
import { ClientIncidents } from "./ClientIncidents";
import { ClientNotifications } from "./ClientNotifications";
import { Car, History, User, AlertCircle, Bell, CreditCard } from "lucide-react";

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span className="hidden sm:inline">Recherche</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Réservations</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="incidents" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Incidents</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <ClientSearch />
          </TabsContent>

          <TabsContent value="bookings">
            <ClientBookings />
          </TabsContent>

          <TabsContent value="history">
            <ClientHistory />
          </TabsContent>

          <TabsContent value="incidents">
            <ClientIncidents />
          </TabsContent>

          <TabsContent value="notifications">
            <ClientNotifications />
          </TabsContent>

          <TabsContent value="profile">
            <ClientProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
