import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/auth/LoginPage";
import { ClientDashboard } from "./components/client/ClientDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { DirectionDashboard } from "./components/direction/DirectionDashboard";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { LogOut } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import logoImage from "./assets/logo.png";

function AppContent() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (!user && !showLogin) {
    return <HomePage onGetStarted={() => setShowLogin(true)} />;
  }

  if (!user && showLogin) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm" style={{ borderColor: '#B8E3E9' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Auto Fleet" className="w-10 h-10" />
              <div>
                <h1 className="text-xl" style={{ color: '#0B2E33' }}>Auto Fleet</h1>
                <p className="text-xs" style={{ color: '#4F7C82' }}>
                  {user.role === "CLIENT" && "Espace Client"}
                  {user.role === "ADMIN" && "Administration de Parc"}
                  {user.role === "DIRECTION" && "Direction"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10" style={{ backgroundColor: '#B8E3E9' }}>
                  <AvatarFallback style={{ color: '#0B2E33' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm" style={{ color: '#0B2E33' }}>{user.name}</div>
                  <div className="text-xs" style={{ color: '#4F7C82' }}>{user.email}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-[#4F7C82] text-[#0B2E33] hover:bg-[#B8E3E9]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {user.role === "CLIENT" && <ClientDashboard />}
        {user.role === "ADMIN" && <AdminDashboard />}
        {user.role === "DIRECTION" && <DirectionDashboard />}
      </main>

      <footer className="bg-white border-t mt-12" style={{ borderColor: '#B8E3E9' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="Auto Fleet" className="w-6 h-6" />
              <span style={{ color: '#0B2E33' }}>© 2025 Auto Fleet. Tous droits réservés.</span>
            </div>
            <nav className="flex items-center gap-4 text-sm" style={{ color: '#4F7C82' }}>
              <a href="#" className="hover:text-[#0B2E33]">À propos</a>
              <a href="#" className="hover:text-[#0B2E33]">Conditions</a>
              <a href="#" className="hover:text-[#0B2E33]">Confidentialité</a>
              <a href="#" className="hover:text-[#0B2E33]">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
