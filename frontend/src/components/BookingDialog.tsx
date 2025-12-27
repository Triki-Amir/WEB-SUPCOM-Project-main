import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, MapPin, Users, CreditCard } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  seats: number;
}

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onConfirm: () => void;
}

export function BookingDialog({ open, onClose, vehicle, onConfirm }: BookingDialogProps) {
  if (!vehicle) return null;

  const days = 3;
  const totalPrice = vehicle.price * days;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirmer votre réservation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <ImageWithFallback
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="mb-1">{vehicle.name}</h3>
              <Badge variant="outline">{vehicle.category}</Badge>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{vehicle.seats} places</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4>Détails de la location</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <div>
                  <div>Prise en charge</div>
                  <div>Tunis, Tunisie</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <div>
                  <div>Dates</div>
                  <div>7 Nov - 10 Nov 2025</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4>Informations de paiement</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardName">Nom sur la carte</Label>
                <Input id="cardName" placeholder="Jean Dupont" />
              </div>
              <div>
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <div className="relative">
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiration</Label>
                  <Input id="expiry" placeholder="MM/AA" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" type="password" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Location ({days} jours)</span>
              <span>{vehicle.price} DT × {days}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Assurance</span>
              <span>45 DT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Frais de service</span>
              <span>15 DT</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Total</span>
              <span>{totalPrice + 60} DT</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>
            Confirmer la réservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
