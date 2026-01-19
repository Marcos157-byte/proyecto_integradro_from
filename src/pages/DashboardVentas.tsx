
import VentaForm from "../components/VentaForm";
import { useAuth } from "../context/AuthContext";
import VentaList from "../components/VentaList";
function DashboardVentas() {
  const { user } = useAuth(); // 👈 más limpio

  return (
    <div className="dashboard-ventas">
      <h1>Panel de Ventas</h1>

      <section>
        <h2>Registrar nueva venta</h2>
        {user && <VentaForm id_usuario={user.id} />}
      </section>
       <section>
        <h2>Listado de ventas</h2>
        <VentaList /> {/* 👈 aquí se muestra el listado */}
      </section>
    </div>
  );
}

export default DashboardVentas;