import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css"; // 👈 importa tu CSS

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Bienvenido {user?.nombre}</h1>
      <p className="dashboard-role">Rol: {user?.rol}</p>
      <button className="dashboard-button" onClick={logout}>
        Salir
      </button>
    </div>
  );
}