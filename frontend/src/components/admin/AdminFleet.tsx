import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Car, Plus, Edit, MapPin, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  licensePlate: string;
  color?: string;
  seats: number;
  transmission: string;
  fuelType: string;
  imageUrl?: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE";
  mileage: number;
  stationId: string;
  station?: {
    id: string;
    name: string;
    city: string;
  };
}

interface Station {
  id: string;
  name: string;
  city: string;
}

export function AdminFleet() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding vehicle
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [seats, setSeats] = useState(5);
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mileage, setMileage] = useState(0);
  const [stationId, setStationId] = useState("");

  // Form state for editing
  const [editStatus, setEditStatus] = useState("");
  const [editMileage, setEditMileage] = useState(0);
  const [editStationId, setEditStationId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, stationsData] = await Promise.all([
        api.vehicles.getAll(),
        api.stations.getAll()
      ]);
      setVehicles(vehiclesData);
      setStations(stationsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      AVAILABLE: { label: "Disponible", variant: "default" as const, icon: CheckCircle },
      RENTED: { label: "En cours", variant: "secondary" as const, icon: Car },
      MAINTENANCE: { label: "Maintenance", variant: "destructive" as const, icon: AlertCircle },
      OUT_OF_SERVICE: { label: "Hors service", variant: "destructive" as const, icon: AlertCircle },
    };
    const { label, variant, icon: Icon } = variants[status as keyof typeof variants] || variants.AVAILABLE;
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const resetForm = () => {
    setBrand("");
    setModel("");
    setYear(new Date().getFullYear());
    setCategory("");
    setLicensePlate("");
    setColor("");
    setSeats(5);
    setTransmission("");
    setFuelType("");
    setImageUrl("");
    setMileage(0);
    setStationId("");
  };

  const handleAddVehicle = async () => {
    if (!brand || !model || !licensePlate || !stationId || !category || !transmission || !fuelType) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await api.vehicles.create({
        brand,
        model,
        year,
        category,
        licensePlate,
        color,
        seats,
        transmission,
        fuelType,
        imageUrl,
        mileage,
        stationId,
        status: "AVAILABLE"
      });
      toast.success("Véhicule ajouté avec succès");
      setAddDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast.error(error.message || "Erreur lors de l'ajout du véhicule");
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditStatus(vehicle.status);
    setEditMileage(vehicle.mileage);
    setEditStationId(vehicle.stationId);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedVehicle) return;

    try {
      await api.vehicles.update(selectedVehicle.id, {
        status: editStatus,
        mileage: editMileage,
        stationId: editStationId
      });
      toast.success("Véhicule mis à jour");
      setEditDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
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
            <CardTitle>Gestion de la flotte</CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un véhicule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
                  <DialogTitle>Ajouter un véhicule</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Marque *</Label>
                        <Input placeholder="ex: Renault" value={brand} onChange={(e) => setBrand(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Modèle *</Label>
                        <Input placeholder="ex: Clio" value={model} onChange={(e) => setModel(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Année</Label>
                        <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Couleur</Label>
                        <Input placeholder="ex: Blanc" value={color} onChange={(e) => setColor(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Immatriculation *</Label>
                      <Input placeholder="ex: 123 TUN 456" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Économique">Économique</SelectItem>
                          <SelectItem value="Compact">Compact</SelectItem>
                          <SelectItem value="Berline">Berline</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Électrique">Électrique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Places</Label>
                        <Input type="number" value={seats} onChange={(e) => setSeats(parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Kilométrage</Label>
                        <Input type="number" value={mileage} onChange={(e) => setMileage(parseInt(e.target.value))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Transmission *</Label>
                      <Select value={transmission} onValueChange={setTransmission}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manuelle">Manuelle</SelectItem>
                          <SelectItem value="Automatique">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type de carburant *</Label>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Essence">Essence</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Hybride">Hybride</SelectItem>
                          <SelectItem value="Électrique">Électrique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>URL de l'image</Label>
                      <Input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                      <p className="text-xs text-gray-500">Vous pouvez utiliser une URL d'image (ex: depuis Unsplash)</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Station *</Label>
                      <Select value={stationId} onValueChange={setStationId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations.map((station) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.name} - {station.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t sticky bottom-0 bg-background z-10">
                  <Button variant="outline" onClick={() => { setAddDialogOpen(false); resetForm(); }}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddVehicle}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule</h3>
              <p className="text-gray-600 mb-4">Commencez par ajouter votre premier véhicule</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                        <ImageWithFallback
                          src={vehicle.imageUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400"}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="mb-1">{vehicle.brand} {vehicle.model}</h4>
                          <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                        </div>
                        {getStatusBadge(vehicle.status)}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.station?.name || "N/A"}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Kilométrage: {vehicle.mileage.toLocaleString()} km
                      </div>
                      <div className="text-xs text-gray-600">
                        {vehicle.category} • {vehicle.seats} places • {vehicle.transmission}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleEditVehicle(vehicle)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
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
            <DialogTitle>Modifier le véhicule</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Disponible</SelectItem>
                    <SelectItem value="RENTED">En cours</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="OUT_OF_SERVICE">Hors service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Station</Label>
                <Select value={editStationId} onValueChange={setEditStationId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name} - {station.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kilométrage</Label>
                <Input type="number" value={editMileage} onChange={(e) => setEditMileage(parseInt(e.target.value))} />
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
