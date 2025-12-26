import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Wrench, Plus, Calendar, Car, Clock } from "lucide-react";
import { toast } from "sonner";

interface Maintenance {
  id: string;
  vehicle: string;
  type: string;
  description: string;
  status: "scheduled" | "in_progress" | "completed";
  date: string;
  technician?: string;
  cost?: number;
}

export function AdminMaintenance() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const maintenanceRecords: Maintenance[] = [
    {
      id: "1",
      vehicle: "Tesla Model 3 - 123 TUN 456",
      type: "Révision complète",
      description: "Révision des 45 000 km",
      status: "scheduled",
      date: "20 Nov 2025",
    },
    {
      id: "2",
      vehicle: "Peugeot 3008 - 345 TUN 678",
      type: "Réparation",
      description: "Remplacement plaquettes de frein",
      status: "in_progress",
      date: "7 Nov 2025",
      technician: "Karim Mansouri",
      cost: 150,
    },
    {
      id: "3",
      vehicle: "Renault Clio - 789 TUN 012",
      type: "Entretien",
      description: "Vidange et changement filtres",
      status: "completed",
      date: "15 Oct 2025",
      technician: "Sami Bouazizi",
      cost: 80,
    },
  ];

  const handleScheduleMaintenance = () => {
    toast.success("Maintenance planifiée avec succès");
    setAddDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { label: "Planifiée", variant: "default" as const },
      in_progress: { label: "En cours", variant: "secondary" as const },
      completed: { label: "Terminée", variant: "secondary" as const },
    };
    const { label, variant } = variants[status as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion de la maintenance</CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Planifier une maintenance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Planifier une maintenance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Véhicule</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tesla Model 3 - 123 TUN 456</SelectItem>
                        <SelectItem value="2">Renault Clio - 789 TUN 012</SelectItem>
                        <SelectItem value="3">Peugeot 3008 - 345 TUN 678</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de maintenance</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revision">Révision complète</SelectItem>
                        <SelectItem value="entretien">Entretien courant</SelectItem>
                        <SelectItem value="reparation">Réparation</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Détails de la maintenance..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Technicien</Label>
                    <Input placeholder="Nom du technicien" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleScheduleMaintenance}>Planifier</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintenanceRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4>{record.type}</h4>
                        {getStatusBadge(record.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          <span>{record.vehicle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{record.date}</span>
                        </div>
                        {record.technician && (
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            <span>{record.technician}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{record.description}</p>
                    </div>
                    {record.cost && (
                      <div className="text-right">
                        <div className="text-xl">{record.cost} TND</div>
                      </div>
                    )}
                  </div>
                  {record.status === "scheduled" && (
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique de maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1">Renault Clio - 789 TUN 012</h4>
                    <p className="text-sm text-gray-600">
                      Dernière maintenance : 15 Oct 2025
                    </p>
                    <p className="text-sm text-gray-600">
                      Prochaine révision : dans 5 000 km
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir l'historique
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
