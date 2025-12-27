import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Wrench, Plus, Calendar, Car, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Maintenance {
  id: string;
  vehicleId: string;
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
  };
  type: string;
  description: string;
  status: string;
  cost?: number;
  scheduledAt: string;
  completedAt?: string;
  notes?: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
}

export function AdminMaintenance() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [vehicleId, setVehicleId] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [maintenanceData, vehiclesData] = await Promise.all([
        api.maintenance.getAll(),
        api.vehicles.getAll()
      ]);
      setMaintenanceRecords(maintenanceData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMaintenance = async () => {
    if (!vehicleId || !type || !description || !scheduledAt) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validate date
    const date = new Date(scheduledAt);
    if (isNaN(date.getTime())) {
      toast.error("Date invalide");
      return;
    }

    try {
      setSubmitting(true);
      await api.maintenance.create({
        vehicleId,
        type,
        description,
        cost: cost ? parseFloat(cost) : undefined,
        scheduledAt: date.toISOString(),
        notes: notes || undefined,
      });
      toast.success("Maintenance planifiée avec succès");
      setAddDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error("Error scheduling maintenance:", error);
      toast.error(error.message || "Erreur lors de la planification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteMaintenance = async (id: string) => {
    try {
      await api.maintenance.complete(id);
      toast.success("Maintenance marquée comme terminée");
      loadData();
    } catch (error: any) {
      console.error("Error completing maintenance:", error);
      toast.error(error.message || "Erreur lors de la complétion");
    }
  };

  const resetForm = () => {
    setVehicleId("");
    setType("");
    setDescription("");
    setCost("");
    setScheduledAt("");
    setNotes("");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      SCHEDULED: { label: "Planifiée", variant: "default" },
      IN_PROGRESS: { label: "En cours", variant: "secondary" },
      COMPLETED: { label: "Terminée", variant: "secondary" },
    };
    const { label, variant } = statusMap[status] || statusMap.SCHEDULED;
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
                    <Label>Véhicule *</Label>
                    <Select value={vehicleId} onValueChange={setVehicleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de maintenance *</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Révision complète">Révision complète</SelectItem>
                        <SelectItem value="Entretien courant">Entretien courant</SelectItem>
                        <SelectItem value="Réparation">Réparation</SelectItem>
                        <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="Vidange">Vidange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date planifiée *</Label>
                    <Input 
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea 
                      placeholder="Détails de la maintenance..." 
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coût estimé (TND)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Notes supplémentaires..."
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setAddDialogOpen(false); resetForm(); }} disabled={submitting}>
                    Annuler
                  </Button>
                  <Button onClick={handleScheduleMaintenance} disabled={submitting}>
                    {submitting ? "Planification..." : "Planifier"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintenanceRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Aucune maintenance planifiée</p>
              </div>
            ) : (
              maintenanceRecords.map((record) => (
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
                            <span>{record.vehicle.brand} {record.vehicle.model} - {record.vehicle.licensePlate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(record.scheduledAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
                          </div>
                          {record.completedAt && (
                            <div className="flex items-center gap-2 text-green-600">
                              <Clock className="w-4 h-4" />
                              <span>Terminée le {format(new Date(record.completedAt), "d MMM yyyy", { locale: fr })}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{record.description}</p>
                        {record.notes && (
                          <p className="text-xs text-gray-500 mt-1">Notes: {record.notes}</p>
                        )}
                      </div>
                      {record.cost && (
                        <div className="text-right">
                          <div className="text-xl">{record.cost} TND</div>
                        </div>
                      )}
                    </div>
                    {(record.status === "SCHEDULED" || record.status === "IN_PROGRESS") && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCompleteMaintenance(record.id)}
                      >
                        Marquer comme terminée
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
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
