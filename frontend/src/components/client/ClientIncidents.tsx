import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { AlertCircle, Phone, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

interface Incident {
  id: string;
  type: string;
  description: string;
  date: string;
  status: "open" | "in_progress" | "resolved";
  response?: string;
}

export function ClientIncidents() {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");

  const incidents: Incident[] = [
    {
      id: "1",
      type: "Panne technique",
      description: "Voyant moteur allumé pendant le trajet",
      date: "5 Nov 2025, 14:30",
      status: "resolved",
      response: "Véhicule vérifié et réparé. Aucun problème majeur détecté.",
    },
    {
      id: "2",
      type: "Accident mineur",
      description: "Éraflure sur le pare-chocs avant lors du stationnement",
      date: "28 Oct 2025, 10:15",
      status: "in_progress",
      response: "Dossier en cours de traitement avec l'assurance.",
    },
  ];

  const handleReportIncident = () => {
    if (!incidentType || !description) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success("Incident signalé avec succès. Notre équipe vous contactera rapidement.");
    setReportDialogOpen(false);
    setIncidentType("");
    setDescription("");
  };

  const handleEmergencyCall = () => {
    toast.info("Appel d'urgence vers le +216 71 XXX XXX");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: { label: "Ouvert", variant: "destructive" as const },
      in_progress: { label: "En cours", variant: "default" as const },
      resolved: { label: "Résolu", variant: "secondary" as const },
    };
    const { label, variant } = variants[status as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

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
                        <Label htmlFor="incident-type">Type d'incident</Label>
                        <Select value={incidentType} onValueChange={setIncidentType}>
                          <SelectTrigger id="incident-type">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="panne">Panne technique</SelectItem>
                            <SelectItem value="accident">Accident</SelectItem>
                            <SelectItem value="vol">Vol ou vandalisme</SelectItem>
                            <SelectItem value="crevaison">Crevaison</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
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
                      <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleReportIncident}>
                        Envoyer le rapport
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
              Aucun incident signalé
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card key={incident.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{incident.type}</h4>
                          {getStatusBadge(incident.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{incident.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm mb-1">Description :</div>
                        <p className="text-sm text-gray-600">{incident.description}</p>
                      </div>
                      {incident.response && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm mb-1">Réponse de l'équipe :</div>
                          <p className="text-sm text-gray-700">{incident.response}</p>
                        </div>
                      )}
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
