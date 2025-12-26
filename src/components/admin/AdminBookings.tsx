import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Calendar, User, MapPin, Check, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  station: string;
  price: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
}

export function AdminBookings() {
  const bookings: Booking[] = [
    {
      id: "1",
      customer: "Ahmed Ben Ali",
      vehicle: "Tesla Model 3",
      startDate: "15 Nov 2025, 10:00",
      endDate: "17 Nov 2025, 10:00",
      station: "Lac 2",
      price: 240,
      status: "pending",
    },
    {
      id: "2",
      customer: "Leila Trabelsi",
      vehicle: "Renault Clio",
      startDate: "16 Nov 2025, 14:00",
      endDate: "18 Nov 2025, 14:00",
      station: "Tunis Centre",
      price: 90,
      status: "confirmed",
    },
    {
      id: "3",
      customer: "Mohamed Salah",
      vehicle: "Peugeot 3008",
      startDate: "7 Nov 2025, 09:00",
      endDate: "10 Nov 2025, 09:00",
      station: "Sfax Centre",
      price: 255,
      status: "active",
    },
  ];

  const handleAcceptBooking = (id: string) => {
    toast.success("Réservation acceptée");
  };

  const handleRejectBooking = (id: string) => {
    toast.success("Réservation refusée");
  };

  const handleReassignBooking = (id: string) => {
    toast.success("Réservation réaffectée");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { label: "En attente", variant: "destructive" as const },
      confirmed: { label: "Confirmée", variant: "default" as const },
      active: { label: "En cours", variant: "secondary" as const },
      completed: { label: "Terminée", variant: "secondary" as const },
      cancelled: { label: "Annulée", variant: "destructive" as const },
    };
    const { label, variant } = variants[status as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filterBookingsByStatus = (status: string) => {
    if (status === "all") return bookings;
    return bookings.filter((b) => b.status === status);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
            </TabsList>

            {["all", "pending", "confirmed", "active"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-3">
                {filterBookingsByStatus(status).map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4>{booking.vehicle}</h4>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{booking.customer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.startDate} → {booking.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.station}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl">{booking.price} TND</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {booking.status === "pending" && (
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
                        {(booking.status === "confirmed" || booking.status === "active") && (
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
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
