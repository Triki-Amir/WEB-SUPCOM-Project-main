import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { MapPin, Plus, Edit, Car, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { stationService } from "../../services/api";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  availableSpots: number;
  totalVehicles: number;
  isOpen: boolean;
  openingHours: string;
  phone: string;
  email?: string;
}

interface NewStationForm {
  name: string;
  address: string;
  city: string;
  capacity: number;
  openingHours: string;
  phone: string;
  email: string;
}

export function AdminStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [newStation, setNewStation] = useState<NewStationForm>({
    name: "",
    address: "",
    city: "",
    capacity: 20,
    openingHours: "08:00 - 20:00",
    phone: "",
    email: "",
  });

  // Fetch stations on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await stationService.getAll();
      setStations(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des stations");
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async () => {
    try {
      if (!newStation.name || !newStation.address || !newStation.city || !newStation.phone) {
        toast.error("Veuillez remplir tous les champs requis");
        return;
      }

      await stationService.create(newStation);
      toast.success("Station ajoutée avec succès");
      setAddDialogOpen(false);
      setNewStation({
        name: "",
        address: "",
        city: "",
        capacity: 20,
        openingHours: "08:00 - 20:00",
        phone: "",
        email: "",
      });
      fetchStations();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la station");
      console.error("Error adding station:", error);
    }
  };

  const handleEditStation = (station: Station) => {
    setSelectedStation(station);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedStation) return;

    try {
      await stationService.update(selectedStation.id, {
        capacity: selectedStation.capacity,
        openingHours: selectedStation.openingHours,
      });
      toast.success("Station mise à jour");
      setEditDialogOpen(false);
      fetchStations();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la station");
      console.error("Error updating station:", error);
    }
  };

  const handleToggleStation = async (stationId: string) => {
    try {
      await stationService.toggle(stationId);
      toast.success("Statut de la station mis à jour");
      fetchStations();
    } catch (error) {
      toast.error("Erreur lors du changement de statut");
      console.error("Error toggling station:", error);
    }
  };

  const getOccupancyColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                    <Label>Nom de la station *</Label>
                    <Input 
                      placeholder="ex: Tunis Centre" 
                      value={newStation.name}
                      onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse *</Label>
                    <Input 
                      placeholder="ex: Avenue Habib Bourguiba" 
                      value={newStation.address}
                      onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville *</Label>
                    <Input 
                      placeholder="ex: Tunis" 
                      value={newStation.city}
                      onChange={(e) => setNewStation({ ...newStation, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone *</Label>
                    <Input 
                      placeholder="ex: +216 71 123 456" 
                      value={newStation.phone}
                      onChange={(e) => setNewStation({ ...newStation, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      placeholder="ex: station@autofleet.tn" 
                      value={newStation.email}
                      onChange={(e) => setNewStation({ ...newStation, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacité</Label>
                    <Input 
                      type="number" 
                      placeholder="ex: 20" 
                      value={newStation.capacity}
                      onChange={(e) => setNewStation({ ...newStation, capacity: parseInt(e.target.value) || 20 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horaires d'ouverture</Label>
                    <Input 
                      placeholder="ex: 07:00 - 22:00" 
                      value={newStation.openingHours}
                      onChange={(e) => setNewStation({ ...newStation, openingHours: e.target.value })}
                    />
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
                      <span>{station.totalVehicles}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={station.isOpen}
                        onCheckedChange={() => handleToggleStation(station.id)}
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
                <Input 
                  type="number" 
                  value={selectedStation.capacity}
                  onChange={(e) => setSelectedStation({ 
                    ...selectedStation, 
                    capacity: parseInt(e.target.value) || 20 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Horaires d'ouverture</Label>
                <Input 
                  value={selectedStation.openingHours}
                  onChange={(e) => setSelectedStation({ 
                    ...selectedStation, 
                    openingHours: e.target.value 
                  })}
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
