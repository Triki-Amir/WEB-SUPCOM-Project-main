import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertCircle, Battery, Wrench, Fuel, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  type: "battery" | "fuel" | "maintenance" | "technical";
  severity: "critical" | "warning" | "info";
  vehicle: string;
  message: string;
  time: string;
  resolved: boolean;
}

export function AdminAlerts() {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "battery",
      severity: "critical",
      vehicle: "Tesla Model 3 - 123 TUN 456",
      message: "Niveau de batterie critique : 15%",
      time: "Il y a 10 min",
      resolved: false,
    },
    {
      id: "2",
      type: "fuel",
      severity: "warning",
      vehicle: "Peugeot 3008 - 345 TUN 678",
      message: "Niveau de carburant faible : 20%",
      time: "Il y a 30 min",
      resolved: false,
    },
    {
      id: "3",
      type: "maintenance",
      severity: "warning",
      vehicle: "Renault Clio - 789 TUN 012",
      message: "Maintenance programmée dans 2 jours",
      time: "Il y a 2h",
      resolved: false,
    },
    {
      id: "4",
      type: "technical",
      severity: "critical",
      vehicle: "Dacia Sandero - 234 TUN 567",
      message: "Capteur de pression des pneus défaillant",
      time: "Il y a 3h",
      resolved: false,
    },
  ];

  const handleResolveAlert = (alertId: string) => {
    toast.success("Alerte résolue");
  };

  const handleTriggerAction = (alertId: string) => {
    toast.success("Action déclenchée");
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: { label: "Critique", variant: "destructive" as const },
      warning: { label: "Avertissement", variant: "default" as const },
      info: { label: "Info", variant: "secondary" as const },
    };
    const { label, variant } = variants[severity as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getAlertIcon = (type: string) => {
    const icons = {
      battery: Battery,
      fuel: Fuel,
      maintenance: Wrench,
      technical: AlertCircle,
    };
    const Icon = icons[type as keyof typeof icons];
    return <Icon className="w-5 h-5" />;
  };

  const getAlertColor = (severity: string) => {
    const colors = {
      critical: "border-red-500 bg-red-50",
      warning: "border-yellow-500 bg-yellow-50",
      info: "border-blue-500 bg-blue-50",
    };
    return colors[severity as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Alertes techniques</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">
                {alerts.filter((a) => !a.resolved).length} alertes actives
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.filter((a) => !a.resolved).map((alert) => (
              <Card
                key={alert.id}
                className={`border-l-4 ${getAlertColor(alert.severity)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getSeverityBadge(alert.severity)}
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                      </div>
                      <h4 className="mb-1">{alert.vehicle}</h4>
                      <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleTriggerAction(alert.id)}
                        >
                          Déclencher action
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Résoudre
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertes résolues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Aucune alerte résolue récemment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
