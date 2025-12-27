import { useState, useEffect } from "react";
import { SearchPanel } from "../SearchPanel";
import { VehicleCard } from "../VehicleCard";
import { BookingDialog } from "../BookingDialog";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { MapPin, Search, Loader2, Car } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  category: string;
  imageUrl?: string;
  seats: number;
  transmission: string;
  fuelType: string;
  status: string;
  price: number;
  stationId: string;
  station?: {
    name: string;
    city: string;
  };
}

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  vehicles?: Vehicle[];
}

export function ClientSearch() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [searchStation, setSearchStation] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, stationsData] = await Promise.all([
        api.vehicles.getAll({ available: true }),
        api.stations.getAll()
      ]);
      setVehicles(vehiclesData as Vehicle[]);
      setStations(stationsData as Station[]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="mb-4">Véhicules disponibles</h2>
            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule disponible</h3>
                  <p className="text-gray-600">Aucun véhicule n'est disponible pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {vehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id}
                    id={vehicle.id}
                    name={`${vehicle.brand} ${vehicle.model}`}
                    category={vehicle.category}
                    image={vehicle.imageUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400"}
                    price={vehicle.price}
                    seats={vehicle.seats}
                    transmission={vehicle.transmission}
                    fuel={vehicle.fuelType}
                    available={vehicle.status === "AVAILABLE"}
                    onSelect={handleSelectVehicle}
                  />
                ))}
              </div>
            )}
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
                  {stations
                    .filter((station) => 
                      station.name.toLowerCase().includes(searchStation.toLowerCase()) ||
                      station.city.toLowerCase().includes(searchStation.toLowerCase())
                    )
                    .map((station) => (
                      <Card key={station.id} className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm mb-1">{station.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span>{station.address}</span>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {vehicles.filter(v => v.stationId === station.id).length} véh.
                          </Badge>
                        </div>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedVehicle && (
        <BookingDialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          vehicle={{
            id: selectedVehicle.id,
            name: `${selectedVehicle.brand} ${selectedVehicle.model}`,
            category: selectedVehicle.category,
            image: selectedVehicle.imageUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400",
            price: 50,
            seats: selectedVehicle.seats
          }}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}
