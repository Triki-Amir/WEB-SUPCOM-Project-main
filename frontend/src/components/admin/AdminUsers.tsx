import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User, Mail, Phone, Shield, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { userService } from "../../services/api";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "CLIENT" | "ADMIN" | "DIRECTION";
  createdAt: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  // Form state for adding user
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    role: "CLIENT"
  });

  // Form state for editing user
  const [editUser, setEditUser] = useState({
    name: "",
    phone: "",
    address: "",
    role: "CLIENT"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.password || !newUser.name) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      await userService.create(newUser);
      toast.success("Utilisateur ajouté avec succès");
      setAddDialogOpen(false);
      setNewUser({
        email: "",
        password: "",
        name: "",
        phone: "",
        address: "",
        role: "CLIENT"
      });
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout de l'utilisateur");
      console.error(error);
    }
  };

  const handleEditUser = (user: UserAccount) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedUser) return;

      await userService.update(selectedUser.id, editUser);
      toast.success("Utilisateur mis à jour avec succès");
      setEditDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await userService.delete(userId);
      toast.success("Utilisateur supprimé avec succès");
      loadUsers();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error(error);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      CLIENT: { label: "Client", variant: "secondary" as const },
      ADMIN: { label: "Admin", variant: "default" as const },
      DIRECTION: { label: "Direction", variant: "default" as const },
    };
    const { label, variant } = variants[role as keyof typeof variants] || { label: role, variant: "secondary" as const };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
                    <Label>Nom complet *</Label>
                    <Input 
                      placeholder="Nom et prénom" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input 
                      type="email" 
                      placeholder="email@example.com" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mot de passe *</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input 
                      placeholder="+216 XX XXX XXX" 
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input 
                      placeholder="Adresse complète" 
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rôle *</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLIENT">Client</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="DIRECTION">Direction</SelectItem>
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{user.name}</h4>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-400">
                            Inscrit le {formatDate(user.createdAt)}
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
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
                <Label>Nom complet</Label>
                <Input 
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input 
                  value={editUser.phone}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input 
                  value={editUser.address}
                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select 
                  value={editUser.role} 
                  onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="DIRECTION">Direction</SelectItem>
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
