import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import logoImage from "../../assets/logo.png";

export function LoginPage() {
  const { login, register, isLoading } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      try {
        await login(loginEmail, loginPassword);
      } catch (error) {
        // Error is already handled in AuthContext
      }
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerName && registerEmail && registerPassword) {
      if (registerPassword.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      try {
        await register(registerName, registerEmail, registerPassword, registerPhone);
      } catch (error) {
        // Error is already handled in AuthContext
      }
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires");
    }
  };

  const handleDemoLogin = async (role: string) => {
    const emails = {
      client: "client@autofleet.tn",
      admin: "admin@autofleet.tn",
      direction: "direction@autofleet.tn",
    };
    try {
      await login(emails[role as keyof typeof emails], "demo123");
    } catch (error) {
      // Error is already handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B8E3E9] to-[#93B1B5] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.img 
              src={logoImage} 
              alt="Auto Fleet" 
              className="w-16 h-16"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <h1 className="text-5xl" style={{ color: '#0B2E33' }}>Auto Fleet</h1>
          </div>
          <p style={{ color: '#0B2E33' }}>Location de véhicules en Tunisie</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-2 border-[#4F7C82]">
            <CardHeader>
              <CardTitle style={{ color: '#0B2E33' }}>Bienvenue</CardTitle>
              <CardDescription style={{ color: '#4F7C82' }}>
                Connectez-vous ou créez un compte pour continuer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#B8E3E9]">
                  <TabsTrigger value="login" className="data-[state=active]:bg-[#0B2E33] data-[state=active]:text-white">Connexion</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-[#0B2E33] data-[state=active]:text-white">Inscription</TabsTrigger>
                </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="exemple@email.com"
                        className="pl-9"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#0B2E33] hover:bg-[#4F7C82] text-white" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Comptes de démonstration</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[#4F7C82] text-[#0B2E33] hover:bg-[#B8E3E9]"
                      onClick={() => handleDemoLogin("client")}
                    >
                      Client
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[#4F7C82] text-[#0B2E33] hover:bg-[#B8E3E9]"
                      onClick={() => handleDemoLogin("admin")}
                    >
                      Administrateur de parc
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[#4F7C82] text-[#0B2E33] hover:bg-[#B8E3E9]"
                      onClick={() => handleDemoLogin("direction")}
                    >
                      Direction
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="register-name"
                        placeholder="Nom et prénom"
                        className="pl-9"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="exemple@email.com"
                        className="pl-9"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="register-phone"
                        placeholder="+216 XX XXX XXX"
                        className="pl-9"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#0B2E33] hover:bg-[#4F7C82] text-white" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      "Créer un compte"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
