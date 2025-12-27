import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertCircle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Incident {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  bookingId: string;
  booking: {
    vehicle: {
      brand: string;
      model: string;
      licensePlate: string;
    };
  };
  description: string;
  severity: string;
  status: string;
  createdAt: string;
}

export function AdminAlerts() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.incidents.getAll();
      setIncidents(data);
    } catch (error) {
      console.error("Error loading incidents:", error);
      toast.error("Erreur lors du chargement des incidents");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (incidentId: string, newStatus: string) => {
    try {
      await api.incidents.updateStatus(incidentId, newStatus);
      toast.success("Statut de l'incident mis à jour");
      loadIncidents();
    } catch (error: any) {
      console.error("Error updating incident status:", error);
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const getSeverityBadge = (severity: string) => {
    const severityMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      LOW: { label: "Faible", variant: "secondary" },
      MEDIUM: { label: "Moyenne", variant: "default" },
      HIGH: { label: "Haute", variant: "destructive" },
      CRITICAL: { label: "Critique", variant: "destructive" },
    };
    const { label, variant } = severityMap[severity] || severityMap.MEDIUM;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      PENDING: { label: "En attente", variant: "destructive" },
      IN_PROGRESS: { label: "En cours", variant: "default" },
      RESOLVED: { label: "Résolu", variant: "secondary" },
      REJECTED: { label: "Rejeté", variant: "destructive" },
    };
    const { label, variant } = statusMap[status] || statusMap.PENDING;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

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
            <CardTitle>Gestion des incidents</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">
                {incidents.filter((i) => i.status === "PENDING").length} incidents en attente
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Gravité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes gravités</SelectItem>
                <SelectItem value="LOW">Faible</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="HIGH">Haute</SelectItem>
                <SelectItem value="CRITICAL">Critique</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="RESOLVED">Résolu</SelectItem>
                <SelectItem value="REJECTED">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Aucun incident trouvé</p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <Card key={incident.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSeverityBadge(incident.severity)}
                          {getStatusBadge(incident.status)}
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true, locale: fr })}
                          </span>
                        </div>
                        <h4 className="mb-1">
                          {incident.booking.vehicle.brand} {incident.booking.vehicle.model} - {incident.booking.vehicle.licensePlate}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          Client: {incident.user.name} ({incident.user.email})
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                        {(incident.status === "PENDING" || incident.status === "IN_PROGRESS") && (
                          <div className="flex gap-2">
                            {incident.status === "PENDING" && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleUpdateStatus(incident.id, "IN_PROGRESS")}
                              >
                                Prendre en charge
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(incident.id, "RESOLVED")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Résoudre
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(incident.id, "REJECTED")}
                            >
                              Rejeter
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
