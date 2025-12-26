import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Bell, CheckCircle, AlertCircle, Info, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export function ClientNotifications() {
  const notifications: Notification[] = [
    {
      id: "1",
      type: "success",
      title: "Réservation confirmée",
      message: "Votre réservation pour Tesla Model 3 a été confirmée pour le 15 Nov 2025.",
      date: "Il y a 2 heures",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Rappel de prise en charge",
      message: "N'oubliez pas de récupérer votre véhicule demain à 10:00 à la station Lac 2.",
      date: "Il y a 5 heures",
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Retour en retard",
      message: "Votre location devait se terminer hier. Veuillez retourner le véhicule dès que possible.",
      date: "Il y a 1 jour",
      read: true,
    },
    {
      id: "4",
      type: "success",
      title: "Paiement effectué",
      message: "Votre paiement de 135 TND a été traité avec succès.",
      date: "Il y a 3 jours",
      read: true,
    },
    {
      id: "5",
      type: "info",
      title: "Nouvelle promotion",
      message: "Profitez de 20% de réduction sur votre prochaine location avec le code DRIVE20.",
      date: "Il y a 5 jours",
      read: true,
    },
  ];

  const handleMarkAsRead = (id: string) => {
    toast.success("Notification marquée comme lue");
  };

  const handleDelete = (id: string) => {
    toast.success("Notification supprimée");
  };

  const handleMarkAllAsRead = () => {
    toast.success("Toutes les notifications ont été marquées comme lues");
  };

  const getIcon = (type: string) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-600" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      info: <Info className="w-5 h-5 text-blue-600" />,
      error: <AlertCircle className="w-5 h-5 text-red-600" />,
    };
    return icons[type as keyof typeof icons];
  };

  const getBackgroundColor = (type: string, read: boolean) => {
    if (read) return "bg-gray-50";
    const colors = {
      success: "bg-green-50",
      warning: "bg-yellow-50",
      info: "bg-blue-50",
      error: "bg-red-50",
    };
    return colors[type as keyof typeof colors];
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} nouvelles</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${getBackgroundColor(notification.type, notification.read)} ${
                    !notification.read ? "border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 ml-2 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{notification.date}</span>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Marquer comme lu
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
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
