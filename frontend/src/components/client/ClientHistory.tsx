import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Calendar, MapPin, Star, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface Trip {
  id: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  station: string;
  distance: number;
  price: number;
  rating?: number;
  invoiceId: string;
}

export function ClientHistory() {
  const trips: Trip[] = [
    {
      id: "1",
      vehicleName: "Peugeot 3008",
      vehicleImage: "https://images.unsplash.com/photo-1760976396211-5546ce83a400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MXx8fHwxNzYyNTExODIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "1 Nov 2025",
      endDate: "3 Nov 2025",
      station: "Sfax Centre",
      distance: 245,
      price: 170,
      rating: 5,
      invoiceId: "INV-2025-001",
    },
    {
      id: "2",
      vehicleName: "Renault Clio",
      vehicleImage: "https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwY2l0eXxlbnwxfHx8fDE3NjI0MjQ2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "20 Oct 2025",
      endDate: "22 Oct 2025",
      station: "Tunis Centre",
      distance: 156,
      price: 90,
      rating: 4,
      invoiceId: "INV-2025-002",
    },
    {
      id: "3",
      vehicleName: "Dacia Sandero",
      vehicleImage: "https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwY2l0eXxlbnwxfHx8fDE3NjI0MjQ2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: "10 Oct 2025",
      endDate: "12 Oct 2025",
      station: "Sousse Ville",
      distance: 189,
      price: 70,
      invoiceId: "INV-2025-003",
    },
  ];

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Téléchargement de la facture ${invoiceId}`);
  };

  const handleDownloadReceipt = (invoiceId: string) => {
    toast.success(`Téléchargement du reçu ${invoiceId}`);
  };

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
              {trips.map((trip) => (
                <Card key={trip.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <ImageWithFallback
                          src={trip.vehicleImage}
                          alt={trip.vehicleName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="mb-1">{trip.vehicleName}</h3>
                            {trip.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < trip.rating!
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary">Terminé</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{trip.startDate} → {trip.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{trip.station}</span>
                          </div>
                          <div>Distance parcourue : {trip.distance} km</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl">{trip.price} TND</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadInvoice(trip.invoiceId)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Facture
                            </Button>
                            {!trip.rating && (
                              <Button size="sm">
                                <Star className="w-4 h-4 mr-2" />
                                Noter
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              {trips.map((trip) => (
                <Card key={trip.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4>{trip.invoiceId}</h4>
                          <p className="text-sm text-gray-600">
                            {trip.vehicleName} - {trip.startDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xl">{trip.price} TND</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadInvoice(trip.invoiceId)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Facture
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReceipt(trip.invoiceId)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Reçu
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
