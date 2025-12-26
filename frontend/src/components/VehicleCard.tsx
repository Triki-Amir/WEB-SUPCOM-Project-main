import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Car, Users, Fuel, Gauge } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface VehicleCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  transmission: string;
  fuel: string;
  available: boolean;
  onSelect: (id: string) => void;
}

export function VehicleCard({
  id,
  name,
  category,
  image,
  price,
  seats,
  transmission,
  fuel,
  available,
  onSelect,
}: VehicleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Indisponible</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="mb-1">{name}</h3>
            <Badge variant="outline">{category}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 my-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{seats} places</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span>Climatisation</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl">{price}€</span>
            <span className="text-sm text-gray-600">/jour</span>
          </div>
          <Button 
            onClick={() => onSelect(id)} 
            disabled={!available}
          >
            Réserver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
