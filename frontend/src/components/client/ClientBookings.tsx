import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, MapPin, Clock, Edit, X, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  station: string;
  price: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
}

export function ClientBookings() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const bookings: Booking[] = [
    {
      id: "1",
      vehicleName: "Tesla Model 3",
      vehicleImage: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhcnxlbnwxfHx8fDE3NjI1MjE2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "15 Nov 2025, 10:00",
      endDate: "17 Nov 2025, 10:00",
      station: "Lac 2, Tunis",
      price: 240,
      status: "upcoming",
    },
    {
      id: "2",
      vehicleName: "Renault Clio",
      vehicleImage: "https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwY2l0eXxlbnwxfHx8fDE3NjI0MjQ2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "7 Nov 2025, 14:00",
      endDate: "10 Nov 2025, 14:00",
      station: "Tunis Centre",
      price: 135,
      status: "active",
    },
  ];

  const handleCancelBooking = (bookingId: string) => {
    toast.success("Réservation annulée avec succès");
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast.success("Réservation modifiée avec succès");
    setEditDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: { label: "À venir", variant: "default" as const },
      active: { label: "En cours", variant: "default" as const },
      completed: { label: "Terminée", variant: "secondary" as const },
      cancelled: { label: "Annulée", variant: "destructive" as const },
    };
    const { label, variant } = variants[status as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mes réservations</CardTitle>
            <Button variant="outline" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Moyens de paiement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback
                        src={booking.vehicleImage}
                        alt={booking.vehicleName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="mb-1">{booking.vehicleName}</h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl">{booking.price} TND</div>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.startDate} → {booking.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.station}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "upcoming" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <X className="w-4 h-4 mr-2" />
                                  Annuler
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir annuler cette réservation ? Des frais d'annulation peuvent s'appliquer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Non</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleCancelBooking(booking.id)}>
                                    Oui, annuler
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                        {booking.status === "active" && (
                          <Button size="sm">
                            Voir le suivi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la réservation</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="datetime-local" defaultValue="2025-11-15T10:00" />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input type="datetime-local" defaultValue="2025-11-17T10:00" />
              </div>
              <div className="space-y-2">
                <Label>Station</Label>
                <Input defaultValue={selectedBooking.station} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
