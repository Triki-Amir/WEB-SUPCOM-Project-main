import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { AlertCircle, Phone, MessageSquare, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Incident {
  id: string;
  bookingId: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
  booking?: {
    vehicle: {
      brand: string;
      model: string;
    };
  };
}

export function ClientIncidents() {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [incidentsData, bookingsData] = await Promise.all([
        api.incidents.getMyIncidents(),
        api.bookings.getMyBookings()
      ]);
      setIncidents(incidentsData);
      // Filter for active bookings only
      const activeBookings = bookingsData.filter((b: any) => 
        b.status === "ACTIVE" || b.status === "CONFIRMED"
      );
      setBookings(activeBookings);
    } catch (error) {
      console.error("Error loading incidents:", error);
      toast.error("Erreur lors du chargement des incidents");
    } finally {
      setLoading(false);
    }
  };

  const handleReportIncident = async () => {
    if (!bookingId || !severity || !description) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setSubmitting(true);
      await api.incidents.report({
        bookingId,
        description,
        severity,
      });
      toast.success("Incident signalé avec succès. Notre équipe vous contactera rapidement.");
      setReportDialogOpen(false);
      setBookingId("");
      setSeverity("");
      setDescription("");
      loadData(); // Reload incidents
    } catch (error: any) {
      console.error("Error reporting incident:", error);
      toast.error(error.message || "Erreur lors du signalement de l'incident");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmergencyCall = () => {
    toast.info("Appel d'urgence vers le +216 71 XXX XXX");
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

  const getSeverityLabel = (severity: string) => {
    const severityMap: Record<string, string> = {
      LOW: "Faible",
      MEDIUM: "Moyenne",
      HIGH: "Haute",
      CRITICAL: "Critique",
    };
    return severityMap[severity] || severity;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-900 mb-2">Urgence ?</h3>
              <p className="text-sm text-red-800 mb-4">
                En cas d'accident ou de situation d'urgence, contactez immédiatement notre service d'assistance.
              </p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleEmergencyCall}>
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler SOS : +216 71 XXX XXX
                </Button>
                <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Signaler un incident
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Signaler un incident</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="booking">Réservation concernée *</Label>
                        <Select value={bookingId} onValueChange={setBookingId}>
                          <SelectTrigger id="booking">
                            <SelectValue placeholder="Sélectionner une réservation" />
                          </SelectTrigger>
                          <SelectContent>
                            {bookings.length === 0 ? (
                              <SelectItem value="none" disabled>
                                Aucune réservation active
                              </SelectItem>
                            ) : (
                              bookings.map((booking) => (
                                <SelectItem key={booking.id} value={booking.id}>
                                  {booking.vehicle.brand} {booking.vehicle.model} - {booking.station.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity">Gravité *</Label>
                        <Select value={severity} onValueChange={setSeverity}>
                          <SelectTrigger id="severity">
                            <SelectValue placeholder="Sélectionner la gravité" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Faible</SelectItem>
                            <SelectItem value="MEDIUM">Moyenne</SelectItem>
                            <SelectItem value="HIGH">Haute</SelectItem>
                            <SelectItem value="CRITICAL">Critique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Décrivez l'incident en détail..."
                          rows={5}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setReportDialogOpen(false)} disabled={submitting}>
                        Annuler
                      </Button>
                      <Button onClick={handleReportIncident} disabled={submitting}>
                        {submitting ? "Envoi..." : "Envoyer le rapport"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des incidents</CardTitle>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun incident signalé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card key={incident.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4>
                            {incident.booking ? 
                              `${incident.booking.vehicle.brand} ${incident.booking.vehicle.model}` : 
                              "Incident"}
                          </h4>
                          {getStatusBadge(incident.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatDistanceToNow(new Date(incident.createdAt), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Gravité : <span className="font-medium">{getSeverityLabel(incident.severity)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm font-medium mb-1">Description :</div>
                        <p className="text-sm text-gray-600">{incident.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
