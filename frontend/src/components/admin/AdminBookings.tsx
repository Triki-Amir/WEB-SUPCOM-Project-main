import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Calendar, User, MapPin, Check, X, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Booking {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  vehicleId: string;
  vehicle: {
    brand: string;
    model: string;
  };
  stationId: string;
  station: {
    name: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.bookings.getAll();
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (id: string) => {
    try {
      await api.bookings.updateStatus(id, "CONFIRMED");
      toast.success("Réservation acceptée");
      loadBookings();
    } catch (error: any) {
      console.error("Error accepting booking:", error);
      toast.error(error.message || "Erreur lors de l'acceptation");
    }
  };

  const handleRejectBooking = async (id: string) => {
    try {
      await api.bookings.updateStatus(id, "CANCELLED");
      toast.success("Réservation refusée");
      loadBookings();
    } catch (error: any) {
      console.error("Error rejecting booking:", error);
      toast.error(error.message || "Erreur lors du refus");
    }
  };

  const handleReassignBooking = (id: string) => {
    toast.info("Fonctionnalité de réaffectation à venir");
    // TODO: Implement reassignment logic
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      PENDING: { label: "En attente", variant: "destructive" },
      CONFIRMED: { label: "Confirmée", variant: "default" },
      ACTIVE: { label: "En cours", variant: "secondary" },
      COMPLETED: { label: "Terminée", variant: "secondary" },
      CANCELLED: { label: "Annulée", variant: "destructive" },
    };
    const { label, variant } = statusMap[status] || statusMap.PENDING;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filterBookingsByStatus = (status: string) => {
    if (status === "all") return bookings;
    return bookings.filter((b) => b.status === status.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
            </TabsList>

            {["all", "pending", "confirmed", "active"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-3">
                {filterBookingsByStatus(status).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucune réservation</p>
                  </div>
                ) : (
                  filterBookingsByStatus(status).map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4>{booking.vehicle.brand} {booking.vehicle.model}</h4>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{booking.user.name} ({booking.user.email})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(booking.startDate), "d MMM yyyy, HH:mm", { locale: fr })} → {format(new Date(booking.endDate), "d MMM yyyy, HH:mm", { locale: fr })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.station.name}, {booking.station.city}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl">{booking.totalPrice} TND</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleAcceptBooking(booking.id)}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Accepter
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <X className="w-4 h-4 mr-2" />
                                    Refuser
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Refuser la réservation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir refuser cette réservation ? Le client sera notifié.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRejectBooking(booking.id)}>
                                      Confirmer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {(booking.status === "CONFIRMED" || booking.status === "ACTIVE") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReassignBooking(booking.id)}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Réaffecter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
