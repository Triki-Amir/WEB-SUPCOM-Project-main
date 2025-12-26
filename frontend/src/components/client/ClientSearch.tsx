import { useState } from "react";
import { SearchPanel } from "../SearchPanel";
import { VehicleCard } from "../VehicleCard";
import { BookingDialog } from "../BookingDialog";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  transmission: string;
  fuel: string;
  available: boolean;
  station: string;
}

export function ClientSearch() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [searchStation, setSearchStation] = useState("");

  const vehicles: Vehicle[] = [
    {
      id: "1",
      name: "Renault Clio",
      category: "Compacte",
      image: "https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwY2l0eXxlbnwxfHx8fDE3NjI0MjQ2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 45,
      seats: 5,
      transmission: "Manuelle",
      fuel: "Essence",
      available: true,
      station: "Tunis Centre",
    },
    {
      id: "2",
      name: "Tesla Model 3",
      category: "Électrique",
      image: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhcnxlbnwxfHx8fDE3NjI1MjE2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 120,
      seats: 5,
      transmission: "Automatique",
      fuel: "Électrique",
      available: true,
      station: "Lac 2",
    },
    {
      id: "3",
      name: "Peugeot 3008",
      category: "SUV",
      image: "https://images.unsplash.com/photo-1760976396211-5546ce83a400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MXx8fHwxNzYyNTExODIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 85,
      seats: 5,
      transmission: "Automatique",
      fuel: "Diesel",
      available: true,
      station: "Sfax Centre",
    },
    {
      id: "4",
      name: "Dacia Sandero",
      category: "Économique",
      image: "https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwY2l0eXxlbnwxfHx8fDE3NjI0MjQ2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 35,
      seats: 5,
      transmission: "Manuelle",
      fuel: "Essence",
      available: true,
      station: "Sousse Ville",
    },
  ];

  const stations = [
    { id: "1", name: "Tunis Centre", address: "Avenue Habib Bourguiba, Tunis", vehicles: 12 },
    { id: "2", name: "Lac 2", address: "Les Berges du Lac, Tunis", vehicles: 8 },
    { id: "3", name: "Sfax Centre", address: "Avenue Hedi Chaker, Sfax", vehicles: 10 },
    { id: "4", name: "Sousse Ville", address: "Boulevard de la Corniche, Sousse", vehicles: 7 },
    { id: "5", name: "Aéroport Tunis-Carthage", address: "Tunis-Carthage", vehicles: 15 },
  ];

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setBookingDialogOpen(true);
    }
  };

  const handleConfirmBooking = () => {
    toast.success("Réservation confirmée !");
    setBookingDialogOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <div className="space-y-6">
      <SearchPanel onSearch={() => toast.success("Recherche effectuée")} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="mb-4">Véhicules disponibles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} {...vehicle} onSelect={handleSelectVehicle} />
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-4">Stations à proximité</h3>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher une station..."
                    className="pl-9"
                    value={searchStation}
                    onChange={(e) => setSearchStation(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                {stations.map((station) => (
                  <Card key={station.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm mb-1">{station.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{station.address}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{station.vehicles} véh.</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Voir les véhicules
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingDialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        vehicle={selectedVehicle}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
