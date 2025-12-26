import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User, Mail, Phone, Shield, Plus, Edit } from "lucide-react";
import { toast } from "sonner";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "operator" | "support";
  status: "active" | "suspended";
  joinDate: string;
}

export function AdminUsers() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const users: UserAccount[] = [
    {
      id: "1",
      name: "Ahmed Ben Ali",
      email: "ahmed.benali@email.com",
      phone: "+216 20 123 456",
      role: "client",
      status: "active",
      joinDate: "15 Jan 2025",
    },
    {
      id: "2",
      name: "Leila Trabelsi",
      email: "leila.trabelsi@email.com",
      phone: "+216 21 234 567",
      role: "client",
      status: "active",
      joinDate: "3 Feb 2025",
    },
    {
      id: "3",
      name: "Karim Mansouri",
      email: "karim.mansouri@drivehub.tn",
      phone: "+216 22 345 678",
      role: "operator",
      status: "active",
      joinDate: "10 Dec 2024",
    },
    {
      id: "4",
      name: "Sami Bouazizi",
      email: "sami.bouazizi@drivehub.tn",
      phone: "+216 23 456 789",
      role: "support",
      status: "active",
      joinDate: "5 Nov 2024",
    },
  ];

  const handleAddUser = () => {
    toast.success("Utilisateur ajouté avec succès");
    setAddDialogOpen(false);
  };

  const handleEditUser = (user: UserAccount) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast.success("Utilisateur mis à jour");
    setEditDialogOpen(false);
  };

  const handleSuspendUser = (userId: string) => {
    toast.success("Utilisateur suspendu");
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      client: { label: "Client", variant: "secondary" as const },
      operator: { label: "Opérateur", variant: "default" as const },
      support: { label: "Support", variant: "default" as const },
    };
    const { label, variant } = variants[role as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: "Actif", variant: "default" as const },
      suspended: { label: "Suspendu", variant: "destructive" as const },
    };
    const { label, variant } = variants[status as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input placeholder="Nom et prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input placeholder="+216 XX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rôle</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="operator">Opérateur</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{user.name}</h4>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="operator">Opérateur</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
