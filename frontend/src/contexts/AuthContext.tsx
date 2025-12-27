import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService } from "../services/api";
import { toast } from "sonner";

export type UserRole = "CLIENT" | "ADMIN" | "DIRECTION";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response: any = await authService.login(email, password);
      
      if (response.token && response.user) {
        authService.saveToken(response.token);
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role as UserRole,
          phone: response.user.phone || "",
          address: response.user.address || "",
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success("Connexion réussie !");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Erreur lors de la connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      setIsLoading(true);
      const response: any = await authService.register({
        name,
        email,
        password,
        phone,
      });

      if (response.token && response.user) {
        authService.saveToken(response.token);
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role as UserRole,
          phone: response.user.phone || "",
          address: response.user.address || "",
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success("Compte créé avec succès !");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error(error.message || "Erreur lors de l'inscription");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Déconnexion réussie");
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
