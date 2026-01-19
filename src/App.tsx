import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardVentas from "./pages/DashboardVentas";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardBodega from "./pages/DashboardBodega";
import PrivateRoute from "./routes/PrivateRoute";

// Importa tus componentes
import ProveedorForm from "./components/ProveedorForm";
import ProveedorList from "./components/ProveedorList";
import ColorForm from "./components/ColorForm";
import ColorList from "./components/ColorList";
import TallaForm from "./components/TallaForm";
import TallaList from "./components/TallaList";
import CategoriaForm from "./components/CategoriaForm";
import CategoriaList from "./components/CategoriaList";
import ProductoForm from "./components/ProductoForm";
import ProductoList from "./components/ProductoList";

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
          />

          {/* Administrador */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["administrador"]}>
                <DashboardAdmin />
              </PrivateRoute>
            }
          />

          {/* Bodega */}
          <Route
            path="/bodega"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <DashboardBodega />
              </PrivateRoute>
            }
          />

          {/* Proveedores */}
          <Route
            path="/proveedores/crear"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <ProveedorForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/proveedores/lista"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <ProveedorList />
              </PrivateRoute>
            }
          />

          {/* Colores */}
          <Route
            path="/colores/crear"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <ColorForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/colores/lista"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <ColorList />
              </PrivateRoute>
            }
          />

          {/* Tallas */}
          <Route
            path="/tallas/crear"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <TallaForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/tallas/lista"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <TallaList />
              </PrivateRoute>
            }
          />

          {/* Categorías */}
          <Route
            path="/categorias/crear"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <CategoriaForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/categorias/lista"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <CategoriaList />
              </PrivateRoute>
            }
          />

          {/* Productos */}
          <Route
            path="/productos/crear"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <ProductoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/productos/lista"
            element={
              <PrivateRoute allowedRoles={["bodega"]}>
                <ProductoList />
              </PrivateRoute>
            }
          />
          <Route
            path="/venta"
            element={
              <PrivateRoute allowedRoles={["ventas"]}>
                <DashboardVentas />
              </PrivateRoute>
            }
          />

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