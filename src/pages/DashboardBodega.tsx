import { Link } from "react-router-dom";
import "../styles/DashboardBodega.css";

export default function DashboardBodega() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">🏭 Panel de Bodega</h1>
        <p className="dashboard-subtitle">
          Gestión completa de colores, proveedores, tallas, categorías y productos del sistema
        </p>
      </header>

      <div className="dashboard-grid">
        {/* Sección Colores */}
        <div className="section-card" data-section="colores">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🎨</span>
              Gestión de Colores
            </h2>
            <div className="section-buttons">
              <Link to="/colores/crear">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">➕</span> Crear Color
                </button>
              </Link>
              <Link to="/colores/lista">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">👁️</span> Ver Colores
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Sección Proveedores */}
        <div className="section-card" data-section="proveedores">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🏢</span>
              Gestión de Proveedores
            </h2>
            <div className="section-buttons">
              <Link to="/proveedores/crear">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">➕</span> Crear Proveedor
                </button>
              </Link>
              <Link to="/proveedores/lista">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">👁️</span> Ver Proveedores
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Sección Tallas */}
        <div className="section-card" data-section="tallas">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📏</span>
              Gestión de Tallas
            </h2>
            <div className="section-buttons">
              <Link to="/tallas/crear">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">➕</span> Crear Talla
                </button>
              </Link>
              <Link to="/tallas/lista">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">👁️</span> Ver Tallas
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Sección Categorías */}
        <div className="section-card" data-section="categorias">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📂</span>
              Gestión de Categorías
            </h2>
            <div className="section-buttons">
              <Link to="/categorias/crear">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">➕</span> Crear Categoría
                </button>
              </Link>
              <Link to="/categorias/lista">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">👁️</span> Ver Categorías
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Sección Productos */}
        <div className="section-card" data-section="productos">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📦</span>
              Gestión de Productos
            </h2>
            <div className="section-buttons">
              <Link to="/productos/crear">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">➕</span> Crear Producto
                </button>
              </Link>
              <Link to="/productos/lista">
                <button className="dashboard-btn btn-primary">
                  <span className="btn-icon">👁️</span> Ver Productos
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p className="footer-text">
          Sistema de Bodega • <span className="footer-highlight">Versión 2.0</span> •{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}