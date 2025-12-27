import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, MapPin, Star, Download, FileText, Loader2 } from "lucide-react";
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
  station: {
    name: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export function ClientHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedBookings();
  }, []);

  const loadCompletedBookings = async () => {
    try {
      setLoading(true);
      const data = await api.bookings.getMyBookings();
      // Filter for completed bookings
      const completedBookings = data.filter((b: Booking) => b.status === "COMPLETED");
      setBookings(completedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (bookingId: string) => {
    toast.success(`Téléchargement de la facture pour la réservation ${bookingId}`);
    // TODO: Implement actual invoice download when backend supports it
  };

  const handleDownloadReceipt = (bookingId: string) => {
    toast.success(`Téléchargement du reçu pour la réservation ${bookingId}`);
    // TODO: Implement actual receipt download when backend supports it
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
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
          <CardTitle>Historique des trajets</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trips">
            <TabsList className="mb-4">
              <TabsTrigger value="trips">Trajets</TabsTrigger>
              <TabsTrigger value="invoices">Factures & Reçus</TabsTrigger>
            </TabsList>

            <TabsContent value="trips" className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucun trajet terminé</p>
                </div>
              ) : (
                bookings.map((booking) => {
                  const days = calculateDays(booking.startDate, booking.endDate);
                  return (
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
                              </div>
                              <Badge variant="secondary">Terminé</Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(booking.startDate), "d MMM yyyy", { locale: fr })} → {format(new Date(booking.endDate), "d MMM yyyy", { locale: fr })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.station.name}, {booking.station.city}</span>
                              </div>
                              <div>Durée : {days} jour{days > 1 ? 's' : ''}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xl">{booking.totalPrice} TND</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadInvoice(booking.id)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Facture
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucune facture disponible</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4>Facture #{booking.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-600">
                              {booking.vehicle.brand} {booking.vehicle.model} - {format(new Date(booking.startDate), "d MMM yyyy", { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xl">{booking.totalPrice} TND</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadInvoice(booking.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Facture
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReceipt(booking.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Reçu
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
