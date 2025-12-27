import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, MapPin, Users, CreditCard } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  stationId?: string;
}

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onConfirm: () => void;
}

export function BookingDialog({ open, onClose, vehicle, onConfirm }: BookingDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!vehicle) return null;

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const days = calculateDays();
  const totalPrice = vehicle.price * days;

  const handleConfirmBooking = async () => {
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les dates de début et de fin");
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Dates invalides");
      return;
    }

    if (start >= end) {
      toast.error("La date de fin doit être après la date de début");
      return;
    }

    if (!vehicle.stationId) {
      toast.error("Station non définie pour ce véhicule");
      return;
    }

    try {
      setSubmitting(true);
      await api.bookings.create({
        vehicleId: vehicle.id,
        stationId: vehicle.stationId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPrice,
        pickupLocation: pickupLocation || undefined,
        dropoffLocation: dropoffLocation || undefined,
        notes: notes || undefined,
      });
      toast.success("Réservation confirmée avec succès !");
      onConfirm();
      // Reset form
      setStartDate("");
      setEndDate("");
      setPickupLocation("");
      setDropoffLocation("");
      setNotes("");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Erreur lors de la création de la réservation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <div className="mt-1 text-sm font-semibold">
                {vehicle.price} TND/jour
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4>Dates de location</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Date de début *</Label>
                <Input 
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin *</Label>
                <Input 
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4>Informations supplémentaires</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="pickupLocation">Lieu de prise en charge</Label>
                <Input 
                  id="pickupLocation" 
                  placeholder="Adresse de prise en charge (optionnel)"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dropoffLocation">Lieu de restitution</Label>
                <Input 
                  id="dropoffLocation" 
                  placeholder="Adresse de restitution (optionnel)"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes" 
                  placeholder="Notes ou demandes spéciales (optionnel)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Location ({days} jour{days > 1 ? 's' : ''})</span>
              <span>{vehicle.price} TND × {days}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{totalPrice} TND</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button onClick={handleConfirmBooking} disabled={submitting}>
            {submitting ? "Confirmation..." : "Confirmer la réservation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
