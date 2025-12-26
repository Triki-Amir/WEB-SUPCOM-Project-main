import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { MapPin, Clock, Calendar, Navigation, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ActiveRentalProps {
  rental: {
    id: string;
    vehicleName: string;
    vehicleImage: string;
    startDate: string;
    endDate: string;
    currentLocation: string;
    distance: number;
    duration: number;
  };
  onEndRental: () => void;
}

export function ActiveRental({ rental, onEndRental }: ActiveRentalProps) {
  const progress = (rental.duration / 72) * 100; // Assuming 3 days max

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Location en cours</CardTitle>
          <Badge>Actif</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <ImageWithFallback
              src={rental.vehicleImage}
              alt={rental.vehicleName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">{rental.vehicleName}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{rental.startDate} - {rental.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{rental.currentLocation}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Durée de location
            </span>
            <span>{rental.duration}h / 72h</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl mb-1">{rental.distance} km</div>
              <div className="text-sm text-gray-600">Distance parcourue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl mb-1">{Math.round(72 - rental.duration)}h</div>
              <div className="text-sm text-gray-600">Temps restant</div>
            </CardContent>
          </Card>
        </div>

        <div className="pt-2 space-y-2">
          <Button className="w-full" variant="outline" onClick={onEndRental}>
            <Navigation className="mr-2 w-4 h-4" />
            Terminer et retourner le véhicule
          </Button>
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-blue-900">
              Pensez à faire le plein avant de retourner le véhicule pour éviter des frais supplémentaires.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
