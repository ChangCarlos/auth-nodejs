import { api } from "@/services/api";
import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  async function login(email: string, password: string) {
    const response = await api.post("/login", {
      email,
      password,
    });
    const { user, accessToken } = response.data;

    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    setUser(user);
  }

  async function logout() {
    await api.post("/logout");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
