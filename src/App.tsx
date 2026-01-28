import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardVentas from "./pages/DashboardVentas";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardBodega from "./pages/DashboardBodega";
import PrivateRoute from "./routes/PrivateRoute";
import HomeVentas from "./components/layout/HomeVenta";
// Importa tus componentes
import ProveedorList from "./components/Proveedor/ProveedorList";
import ColorList from "./components/Color/ColorList";
import TallaList from "./components/Talla/TallaList";
import ProductoList from "./components/Producto/ProductoList";
import RegistroUsuario from "./components/Usuario/UsuarioForm";
import VentaList from "./components/Venta/VentaList";
import ClienteForm from "./components/Cliente/ClienteForm";
import VentaReportes from "./components/Venta/VentaReposte";
import HomeAdmin from "./components/layout/HomeAdmin";
import HomeBodega from "./components/layout/HomeBodega";
import CategoriaList from "./components/Categoria/CategoriaList";
import NuevaVenta from "./components/Venta/VentaForm";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ventas */}
          <Route
            path="/ventas"
            element={
              <PrivateRoute allowedRoles={["ventas"]}>
                <DashboardVentas />
              </PrivateRoute>
            }
          >
            <Route path="clientes" element={<ClienteForm />} />
            <Route index element={<HomeVentas/>} />
            <Route path="/ventas/nueva" element={<NuevaVenta/>} />
          </Route>

          {/* Administrador */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["administrador"]}>
                <DashboardAdmin />
              </PrivateRoute>
            }
          >
            {/* Ruta por defecto: cuando entras a /admin te manda a /admin/dashboard */}
            <Route index element={<HomeAdmin />} />

            <Route path="usuarios" element={<RegistroUsuario />} />
            <Route path="ventas" element={<VentaList />} />
            <Route path="reportes" element={<VentaReportes />} />

          </Route>

          {/* Bodega */}
          <Route
            path="/bodega"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <DashboardBodega />
              </PrivateRoute>
            }
          >
            <Route path="productos" element={<ProductoList />} />
            <Route index element={<HomeBodega />} />
            <Route path="tallas" element={<TallaList />} />
            <Route path="colores" element={<ColorList />} />
            <Route path="proveedores" element={<ProveedorList />} />
            <Route path="categorias" element={<CategoriaList />} /> {/* <-- VINCULACIÓN AQUÍ */}
          </Route>

          {/* Redirección raíz */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Ruta comodín */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

