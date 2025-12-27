import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, MapPin, Clock, Edit, X, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Booking {
  id: string;
  vehicleId: string;
  vehicle: {
    brand: string;
    model: string;
    imageUrl?: string;
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
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
}

export function ClientBookings() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit form state
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editPickupLocation, setEditPickupLocation] = useState("");
  const [editDropoffLocation, setEditDropoffLocation] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.bookings.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.bookings.cancel(bookingId);
      toast.success("Réservation annulée avec succès");
      loadBookings(); // Reload bookings to reflect changes
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Erreur lors de l'annulation");
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditStartDate(format(new Date(booking.startDate), "yyyy-MM-dd'T'HH:mm"));
    setEditEndDate(format(new Date(booking.endDate), "yyyy-MM-dd'T'HH:mm"));
    setEditPickupLocation(booking.pickupLocation || "");
    setEditDropoffLocation(booking.dropoffLocation || "");
    setEditNotes(booking.notes || "");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    
    try {
      await api.bookings.update(selectedBooking.id, {
        startDate: new Date(editStartDate).toISOString(),
        endDate: new Date(editEndDate).toISOString(),
        pickupLocation: editPickupLocation,
        dropoffLocation: editDropoffLocation,
        notes: editNotes,
      });
      toast.success("Réservation modifiée avec succès");
      setEditDialogOpen(false);
      loadBookings();
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast.error(error.message || "Erreur lors de la modification");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      PENDING: { label: "En attente", variant: "default" },
      CONFIRMED: { label: "Confirmée", variant: "default" },
      ACTIVE: { label: "En cours", variant: "default" },
      COMPLETED: { label: "Terminée", variant: "secondary" },
      CANCELLED: { label: "Annulée", variant: "destructive" },
    };
    const { label, variant } = statusMap[status] || statusMap.PENDING;
    return <Badge variant={variant}>{label}</Badge>;
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
          <div className="flex items-center justify-between">
            <CardTitle>Mes réservations</CardTitle>
            <Button variant="outline" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Moyens de paiement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucune réservation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <ImageWithFallback
                          src={booking.vehicle.imageUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400"}
                          alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="mb-1">{booking.vehicle.brand} {booking.vehicle.model}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl">{booking.totalPrice} TND</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
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
                        <div className="flex gap-2">
                          {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
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
                          {booking.status === "ACTIVE" && (
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
          )}
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
                <Input 
                  type="datetime-local" 
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input 
                  type="datetime-local" 
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Lieu de prise en charge</Label>
                <Input 
                  value={editPickupLocation}
                  onChange={(e) => setEditPickupLocation(e.target.value)}
                  placeholder="Adresse de prise en charge"
                />
              </div>
              <div className="space-y-2">
                <Label>Lieu de restitution</Label>
                <Input 
                  value={editDropoffLocation}
                  onChange={(e) => setEditDropoffLocation(e.target.value)}
                  placeholder="Adresse de restitution"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input 
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes supplémentaires"
                />
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
