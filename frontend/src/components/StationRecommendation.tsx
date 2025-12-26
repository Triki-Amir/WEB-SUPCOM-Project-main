import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Clock, Star, Navigation2, Phone } from "lucide-react";

interface Station {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  openUntil: string;
  hasParking: boolean;
  capacity: "low" | "medium" | "high";
}

interface StationRecommendationProps {
  stations: Station[];
  onSelectStation: (stationId: string) => void;
}

export function StationRecommendation({ stations, onSelectStation }: StationRecommendationProps) {
  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCapacityText = (capacity: string) => {
    switch (capacity) {
      case "high": return "Disponibilité élevée";
      case "medium": return "Disponibilité moyenne";
      case "low": return "Disponibilité faible";
      default: return "Inconnu";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stations de retour recommandées</CardTitle>
        <p className="text-sm text-gray-600">
          Stations les plus proches de votre position actuelle
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {stations.map((station) => (
          <Card key={station.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3>{station.name}</h3>
                    {station.id === "station-1" && (
                      <Badge variant="default" className="text-xs">Recommandée</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{station.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{station.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Navigation2 className="w-4 h-4" />
                  <span>{station.distance} km</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Ouvert jusqu'à {station.openUntil}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${getCapacityColor(station.capacity)}`} />
                <span className="text-sm">{getCapacityText(station.capacity)}</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => onSelectStation(station.id)}
                  className="flex-1"
                  variant={station.id === "station-1" ? "default" : "outline"}
                >
                  <Navigation2 className="mr-2 w-4 h-4" />
                  Sélectionner
                </Button>
                <Button variant="outline" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
