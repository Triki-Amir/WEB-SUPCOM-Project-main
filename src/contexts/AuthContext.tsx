import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "client" | "admin" | "direction";

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
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock login - determine role based on email
    let role: UserRole = "client";
    if (email.includes("admin")) role = "admin";
    if (email.includes("direction")) role = "direction";

    setUser({
      id: "user-" + Math.random(),
      name: email.split("@")[0],
      email,
      role,
      phone: "+216 20 123 456",
      address: "Tunis, Tunisie",
    });
  };

  const register = (name: string, email: string, password: string) => {
    setUser({
      id: "user-" + Math.random(),
      name,
      email,
      role: "client",
      phone: "",
      address: "",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
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
