import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Car, Plus, Edit, MapPin, Battery, Fuel, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  category: string;
  image: string;
  status: "available" | "in_use" | "maintenance" | "offline";
  location: string;
  battery?: number;
  fuel?: number;
  lastMaintenance: string;
  mileage: number;
}

export function AdminFleet() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const vehicles: Vehicle[] = [
    {
      id: "1",
      name: "Tesla Model 3",
      plate: "123 TUN 456",
      category: "Électrique",
      image: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhcnxlbnwxfHx8fDE3NjI1MjE2MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "in_use",
      location: "Lac 2, Tunis",
      battery: 67,
      lastMaintenance: "1 Nov 2025",
      mileage: 45230,
    },
    {
      id: "2",
      name: "Renault Clio",
      plate: "789 TUN 012",
      category: "Compacte",
      image: "https://images.unsplash.com/photo-1701314860844-cd2152fa9071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwY2l0eXxlbnwxfHx8fDE3NjI0MjQ2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "available",
      location: "Tunis Centre",
      fuel: 85,
      lastMaintenance: "15 Oct 2025",
      mileage: 32100,
    },
    {
      id: "3",
      name: "Peugeot 3008",
      plate: "345 TUN 678",
      category: "SUV",
      image: "https://images.unsplash.com/photo-1760976396211-5546ce83a400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjByZW50YWx8ZW58MXx8fHwxNzYyNTExODIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "maintenance",
      location: "Atelier Sfax",
      fuel: 45,
      lastMaintenance: "5 Nov 2025",
      mileage: 58900,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      available: { label: "Disponible", variant: "default" as const, icon: CheckCircle },
      in_use: { label: "En cours", variant: "secondary" as const, icon: Car },
      maintenance: { label: "Maintenance", variant: "destructive" as const, icon: AlertCircle },
      offline: { label: "Hors service", variant: "destructive" as const, icon: AlertCircle },
    };
    const { label, variant, icon: Icon } = variants[status as keyof typeof variants];
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const handleAddVehicle = () => {
    toast.success("Véhicule ajouté avec succès");
    setAddDialogOpen(false);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast.success("Véhicule mis à jour");
    setEditDialogOpen(false);
  };

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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un véhicule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom du véhicule</Label>
                    <Input placeholder="ex: Renault Clio" />
                  </div>
                  <div className="space-y-2">
                    <Label>Immatriculation</Label>
                    <Input placeholder="ex: 123 TUN 456" />
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compacte</SelectItem>
                        <SelectItem value="berline">Berline</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="electric">Électrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Station</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tunis">Tunis Centre</SelectItem>
                        <SelectItem value="lac">Lac 2</SelectItem>
                        <SelectItem value="sfax">Sfax Centre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddVehicle}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                      <ImageWithFallback
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{vehicle.name}</h4>
                        <p className="text-sm text-gray-600">{vehicle.plate}</p>
                      </div>
                      {getStatusBadge(vehicle.status)}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{vehicle.location}</span>
                    </div>
                    {vehicle.battery !== undefined && (
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Batterie</span>
                            <span className="text-xs">{vehicle.battery}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                vehicle.battery > 50 ? "bg-green-500" : "bg-yellow-500"
                              }`}
                              style={{ width: `${vehicle.battery}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {vehicle.fuel !== undefined && (
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Carburant</span>
                            <span className="text-xs">{vehicle.fuel}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                vehicle.fuel > 50 ? "bg-green-500" : "bg-red-500"
                              }`}
                              style={{ width: `${vehicle.fuel}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      Kilométrage: {vehicle.mileage.toLocaleString()} km
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
                <Select defaultValue={selectedVehicle.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="in_use">En cours</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Hors service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Localisation</Label>
                <Input defaultValue={selectedVehicle.location} />
              </div>
              <div className="space-y-2">
                <Label>Kilométrage</Label>
                <Input type="number" defaultValue={selectedVehicle.mileage} />
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
