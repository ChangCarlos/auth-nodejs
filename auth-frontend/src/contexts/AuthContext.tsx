import { api } from "@/services/api";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        try {
          const response = await api.get("/me");
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('accessToken');
          delete api.defaults.headers.common["Authorization"];
        }
      }
      
      setIsLoading(false);
    }

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post("/login", {
      email,
      password,
    });
    const { user, accessToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    setUser(user);
  }

  async function logout() {
    await api.post("/logout");
    localStorage.removeItem('accessToken');
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
