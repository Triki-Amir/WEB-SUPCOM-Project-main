import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin } from "lucide-react";

interface SearchPanelProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  category: string;
}

export function SearchPanel({ onSearch }: SearchPanelProps) {
  const [location, setLocation] = useState("Tunis");
  const [category, setCategory] = useState("all");

  const handleSearch = () => {
    onSearch({ location, startDate: undefined, endDate: undefined, category });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="location">Lieu de prise en charge</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
                placeholder="Ville ou aéroport"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Tous les véhicules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="compact">Compacte</SelectItem>
                <SelectItem value="berline">Berline</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="electrique">Électrique</SelectItem>
                <SelectItem value="luxe">Luxe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} className="w-full">
            Rechercher
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
