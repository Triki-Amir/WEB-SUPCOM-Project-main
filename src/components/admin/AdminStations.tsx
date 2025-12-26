import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { MapPin, Plus, Edit, Car, Clock } from "lucide-react";
import { toast } from "sonner";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  availableSpots: number;
  vehicles: number;
  isOpen: boolean;
  openingHours: string;
}

export function AdminStations() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const stations: Station[] = [
    {
      id: "1",
      name: "Tunis Centre",
      address: "Avenue Habib Bourguiba",
      city: "Tunis",
      capacity: 20,
      availableSpots: 8,
      vehicles: 12,
      isOpen: true,
      openingHours: "07:00 - 22:00",
    },
    {
      id: "2",
      name: "Lac 2",
      address: "Les Berges du Lac",
      city: "Tunis",
      capacity: 15,
      availableSpots: 7,
      vehicles: 8,
      isOpen: true,
      openingHours: "08:00 - 20:00",
    },
    {
      id: "3",
      name: "Sfax Centre",
      address: "Avenue Hedi Chaker",
      city: "Sfax",
      capacity: 18,
      availableSpots: 8,
      vehicles: 10,
      isOpen: true,
      openingHours: "07:00 - 21:00",
    },
    {
      id: "4",
      name: "Sousse Ville",
      address: "Boulevard de la Corniche",
      city: "Sousse",
      capacity: 12,
      availableSpots: 5,
      vehicles: 7,
      isOpen: false,
      openingHours: "08:00 - 20:00",
    },
  ];

  const handleAddStation = () => {
    toast.success("Station ajoutée avec succès");
    setAddDialogOpen(false);
  };

  const handleEditStation = (station: Station) => {
    setSelectedStation(station);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast.success("Station mise à jour");
    setEditDialogOpen(false);
  };

  const handleToggleStation = (stationId: string, isOpen: boolean) => {
    toast.success(isOpen ? "Station ouverte" : "Station fermée");
  };

  const getOccupancyColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des stations</CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une station
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une station</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom de la station</Label>
                    <Input placeholder="ex: Tunis Centre" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input placeholder="ex: Avenue Habib Bourguiba" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input placeholder="ex: Tunis" />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacité</Label>
                    <Input type="number" placeholder="ex: 20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Horaires d'ouverture</Label>
                    <Input placeholder="ex: 07:00 - 22:00" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddStation}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {stations.map((station) => (
              <Card key={station.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="mb-1">{station.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{station.address}</p>
                      <Badge variant="outline">{station.city}</Badge>
                    </div>
                    <Badge variant={station.isOpen ? "default" : "secondary"}>
                      {station.isOpen ? "Ouvert" : "Fermé"}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{station.openingHours}</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Places disponibles
                        </span>
                        <span>{station.availableSpots} / {station.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getOccupancyColor(
                            station.availableSpots,
                            station.capacity
                          )}`}
                          style={{
                            width: `${(station.availableSpots / station.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        Véhicules
                      </span>
                      <span>{station.vehicles}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={station.isOpen}
                        onCheckedChange={(checked) =>
                          handleToggleStation(station.id, checked)
                        }
                      />
                      <span className="text-sm">
                        {station.isOpen ? "Ouvrir" : "Fermer"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditStation(station)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
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
            <DialogTitle>Modifier la station</DialogTitle>
          </DialogHeader>
          {selectedStation && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Capacité</Label>
                <Input type="number" defaultValue={selectedStation.capacity} />
              </div>
              <div className="space-y-2">
                <Label>Horaires d'ouverture</Label>
                <Input defaultValue={selectedStation.openingHours} />
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
