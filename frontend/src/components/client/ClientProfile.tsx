import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from "../../contexts/AuthContext";
import { User, Mail, Phone, MapPin, CreditCard, Shield, Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: string;
  last4: string;
}

export function ClientProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem("paymentMethods");
    return saved ? JSON.parse(saved) : [];
  });
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    cardType: "",
  });
  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    cardType: "",
  });

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Card type options with their colors
  const cardTypes = [
    { id: "visa", name: "Visa", color: "from-blue-500 to-blue-700" },
    { id: "mastercard", name: "Mastercard", color: "from-red-500 to-orange-500" },
    { id: "cb", name: "Carte Bancaire", color: "from-green-600 to-green-800" },
  ];

  // Save payment methods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("paymentMethods", JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.users.getProfile();
      setProfileData(data);
      setName(data.name || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.users.updateProfile({ 
        name, 
        phone: phone || undefined, 
        address: address || undefined 
      });
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès");
      loadProfile(); // Reload profile data
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    }
  };

  // Detect card type based on card number
  const detectCardType = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "American Express";
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover";
    return "Carte";
  };

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    const groups = cleanValue.match(/.{1,4}/g);
    return groups ? groups.join(" ").substring(0, 19) : "";
  };

  // Format expiry date
  const formatExpiryDate = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  // Validate card form
  const validateCardForm = (): boolean => {
    const errors = {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      cardType: "",
    };
    let isValid = true;

    if (!newCard.cardType) {
      errors.cardType = "Veuillez sélectionner un type de carte";
      isValid = false;
    }

    const cleanCardNumber = newCard.cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      errors.cardNumber = "Numéro de carte invalide";
      isValid = false;
    }

    if (!newCard.cardHolder.trim()) {
      errors.cardHolder = "Nom du titulaire requis";
      isValid = false;
    }

    const expiryParts = newCard.expiryDate.split("/");
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      errors.expiryDate = "Format invalide (MM/YY)";
      isValid = false;
    } else {
      const month = parseInt(expiryParts[0], 10);
      const year = parseInt("20" + expiryParts[1], 10);
      const now = new Date();
      const cardDate = new Date(year, month - 1);
      if (month < 1 || month > 12) {
        errors.expiryDate = "Mois invalide";
        isValid = false;
      } else if (cardDate < now) {
        errors.expiryDate = "Carte expirée";
        isValid = false;
      }
    }

    if (newCard.cvv.length < 3 || newCard.cvv.length > 4) {
      errors.cvv = "CVV invalide";
      isValid = false;
    }

    setCardErrors(errors);
    return isValid;
  };

  // Handle adding a new payment method
  const handleAddPaymentMethod = () => {
    if (!validateCardForm()) return;

    const cleanCardNumber = newCard.cardNumber.replace(/\s/g, "");
    const selectedCardType = cardTypes.find(ct => ct.id === newCard.cardType);
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      cardNumber: cleanCardNumber,
      cardHolder: newCard.cardHolder,
      expiryDate: newCard.expiryDate,
      cardType: selectedCardType?.name || detectCardType(cleanCardNumber),
      last4: cleanCardNumber.slice(-4),
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setNewCard({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "", cardType: "" });
    setCardErrors({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "", cardType: "" });
    setIsPaymentDialogOpen(false);
    toast.success("Carte ajoutée avec succès");
  };

  // Handle removing a payment method
  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    toast.success("Carte retirée avec succès");
  };

  // Get card logo component based on card type
  const getCardLogo = (cardType: string, size: 'small' | 'medium' = 'medium') => {
    const sizeClasses = size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3';
    const textSize = size === 'small' ? 'text-[10px]' : 'text-xs';
    
    if (cardType === "Visa") {
      return <span className={`text-white font-bold ${textSize} italic`}>VISA</span>;
    } else if (cardType === "Mastercard") {
      return (
        <div className="flex">
          <div className={`${sizeClasses} rounded-full bg-red-400 -mr-1`}></div>
          <div className={`${sizeClasses} rounded-full bg-yellow-400`}></div>
        </div>
      );
    } else if (cardType === "Carte Bancaire") {
      return <span className={`text-white font-bold ${textSize}`}>CB</span>;
    } else {
      return <CreditCard className={`${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />;
    }
  };

  // Get card color gradient
  const getCardColor = (cardType: string): string => {
    if (cardType === "Visa") return "from-blue-500 to-blue-700";
    if (cardType === "Mastercard") return "from-red-500 to-orange-500";
    if (cardType === "Carte Bancaire") return "from-green-600 to-green-800";
    return "from-purple-500 to-purple-700";
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Mot de passe actuel requis";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Nouveau mot de passe requis";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Veuillez confirmer le mot de passe";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) return;

    try {
      await api.users.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setIsPasswordDialogOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Mot de passe mis à jour avec succès");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const displayUser = profileData || user;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">
                {displayUser?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3>{displayUser?.name || "Utilisateur"}</h3>
              <p className="text-sm text-gray-600">{displayUser?.email}</p>
              <Badge variant="secondary" className="mt-1">
                Client {displayUser?.role === "CLIENT" ? "Vérifié" : displayUser?.role}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4>Informations personnelles</h4>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsEditing(false);
                    setName(displayUser?.name || "");
                    setPhone(displayUser?.phone || "");
                    setAddress(displayUser?.address || "");
                  }}>
                    Annuler
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    value={displayUser?.email || ""}
                    disabled
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    className="pl-9"
                    placeholder="Optionnel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                    className="pl-9"
                    placeholder="Optionnel"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Moyens de paiement</CardTitle>
            <Button size="sm" onClick={() => setIsPaymentDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun moyen de paiement enregistré</p>
              <p className="text-sm mt-1">Cliquez sur "Ajouter" pour ajouter une carte</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-8 rounded flex items-center justify-center bg-gradient-to-br ${getCardColor(method.cardType)}`}>
                        {getCardLogo(method.cardType, 'medium')}
                      </div>
                      <div>
                        <div className="font-medium">{method.cardType} •••• {method.last4}</div>
                        <div className="text-sm text-gray-600">
                          {method.cardHolder} • Expire {method.expiryDate}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Retirer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une carte</DialogTitle>
            <DialogDescription>
              Entrez les informations de votre carte bancaire
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Card Type Selector */}
            <div className="space-y-2">
              <Label>Type de carte</Label>
              <div className="grid grid-cols-3 gap-3">
                {cardTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => {
                      setNewCard({ ...newCard, cardType: type.id });
                      setCardErrors({ ...cardErrors, cardType: "" });
                    }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col items-center gap-2 hover:shadow-md ${
                      newCard.cardType === type.id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-1"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className={`w-12 h-7 rounded flex items-center justify-center bg-gradient-to-br ${type.color}`}>
                      {type.id === "visa" ? (
                        <span className="text-white font-bold text-xs italic">VISA</span>
                      ) : type.id === "mastercard" ? (
                        <div className="flex">
                          <div className="w-3 h-3 rounded-full bg-red-400 -mr-1"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        </div>
                      ) : (
                        <span className="text-white font-bold text-xs">CB</span>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      newCard.cardType === type.id ? "text-blue-700" : "text-gray-700"
                    }`}>{type.name}</span>
                  </div>
                ))}
              </div>
              {cardErrors.cardType && (
                <p className="text-sm text-red-500">{cardErrors.cardType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({
                    ...newCard,
                    cardNumber: formatCardNumber(e.target.value)
                  })}
                  className="pl-9"
                  maxLength={19}
                />
              </div>
              {cardErrors.cardNumber && (
                <p className="text-sm text-red-500">{cardErrors.cardNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolder">Nom du titulaire</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="cardHolder"
                  placeholder="JEAN DUPONT"
                  value={newCard.cardHolder}
                  onChange={(e) => setNewCard({
                    ...newCard,
                    cardHolder: e.target.value.toUpperCase()
                  })}
                  className="pl-9"
                />
              </div>
              {cardErrors.cardHolder && (
                <p className="text-sm text-red-500">{cardErrors.cardHolder}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d'expiration</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({
                    ...newCard,
                    expiryDate: formatExpiryDate(e.target.value)
                  })}
                  maxLength={5}
                />
                {cardErrors.expiryDate && (
                  <p className="text-sm text-red-500">{cardErrors.expiryDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({
                    ...newCard,
                    cvv: e.target.value.replace(/\D/g, "")
                  })}
                  maxLength={4}
                />
                {cardErrors.cvv && (
                  <p className="text-sm text-red-500">{cardErrors.cvv}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPaymentDialogOpen(false);
                setNewCard({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "", cardType: "" });
                setCardErrors({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "", cardType: "" });
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleAddPaymentMethod}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter la carte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <div>Sécurité</div>
                <div className="text-sm text-gray-600">Mot de passe et authentification</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPasswordDialogOpen(true)}>
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel et votre nouveau mot de passe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })}
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
              )}
              <p className="text-xs text-gray-500">Au moins 6 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value
                })}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
            >
              Annuler
            </Button>
            <Button onClick={handlePasswordChange}>
              <Shield className="w-4 h-4 mr-2" />
              Changer le mot de passe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
