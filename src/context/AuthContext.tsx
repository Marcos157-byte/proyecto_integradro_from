import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, me as apiMe } from "../api/auth";

interface User {
  id: string;
  nombre: string;
  rol: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 👉 Al refrescar la página, recuperamos el usuario con /auth/me
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const data = await apiMe();
        console.log("Respuesta de /auth/me:", data);

        const loggedUser: User = {
          id: data.id,
          nombre: data.nombre ?? "",
          email: data.email,
          rol: (data.roles?.[0] || "sin rol").toLowerCase(), // 👈 normalizamos
        };

        setUser(loggedUser);
      } catch (err) {
        console.error("Error al recuperar usuario:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // 👉 Login con /auth/login
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      console.log("Enviando login con:", email, password);
      const data = await apiLogin(email, password);
      console.log("Respuesta de /auth/login:", data);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);

        const loggedUser: User = {
          id: data.usuario.id_usuario,
          nombre: data.usuario.nombre,
          email: data.usuario.email,
          rol: (data.usuario.rolUsuarios?.[0]?.rol?.rol || "sin rol").toLowerCase(), // 👈 normalizamos
        };

        setUser(loggedUser);
        return loggedUser;
      }

      return null;
    } catch (err) {
      console.error("Error en login:", err);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};