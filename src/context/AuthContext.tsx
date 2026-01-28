import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, me as apiMe } from "../api/auth";

interface User {
  id_usuario: string;
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

  // 👉 Recuperar sesión al refrescar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario"); // ✅ Buscamos el usuario guardado

    if (!token) return;

    if (storedUser) {
      // Si ya tenemos el usuario en storage, lo cargamos directamente
      const parsedUser = JSON.parse(storedUser);
      setUser({
        id_usuario: parsedUser.id_usuario,
        nombre: parsedUser.nombre,
        email: parsedUser.email,
        rol: (parsedUser.rolUsuarios?.[0]?.rol?.rol || "sin rol").toLowerCase(),
      });
    } else {
      // Si no hay usuario pero hay token, consultamos /auth/me
      const fetchUser = async () => {
        try {
          const data = await apiMe();
          const loggedUser: User = {
            id_usuario: data.id_usuario || data.id,
            nombre: data.nombre ?? "",
            email: data.email,
            rol: (data.roles?.[0] || "sin rol").toLowerCase(),
          };
          setUser(loggedUser);
        } catch (err) {
          console.error("Error al recuperar usuario:", err);
          logout();
        }
      };
      fetchUser();
    }
  }, []);

  // 👉 Login Corregido
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      console.log("Enviando login con:", email, password);
      const data = await apiLogin(email, password);
      console.log("Respuesta de /auth/login:", data);

      if (data.access_token && data.usuario) {
        // 1. Guardar Token
        localStorage.setItem("token", data.access_token);

        // 2. ✅ GUARDAR OBJETO USUARIO (VITAL para el Dashboard)
        // Esto soluciona: "No se encontró el ID del usuario en storage"
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        // 3. Crear objeto de usuario para el estado
        // Esto soluciona: "Cannot read properties of undefined (reading 'id_usuario')"
        const loggedUser: User = {
          id_usuario: data.usuario.id_usuario,
          nombre: data.usuario.nombre,
          email: data.usuario.email,
          rol: (data.usuario.rolUsuarios?.[0]?.rol?.rol || "sin rol").toLowerCase(),
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
    localStorage.removeItem("usuario"); // ✅ También limpiamos el usuario
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