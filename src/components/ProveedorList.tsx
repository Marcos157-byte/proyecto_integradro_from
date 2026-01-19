import { useEffect, useState } from "react";
import { listProveedor } from "../services/proveedorService";
import "../styles/ProveedorList.css";

interface Proveedor {
  id_proveedor: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado?: string;
}

function ProveedorList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const respuesta = await listProveedor(pageNumber, 5);
      console.log("📦 Datos recibidos:", respuesta);

      setProveedores(respuesta.docs); // ✅ siempre array
      setTotalPages(respuesta.totalPages);
      setTotalDocs(respuesta.totalDocs);
    } catch (err: any) {
      console.error("❌ Error al cargar proveedores:", err.response || err);

      if (err.response?.status === 403) {
        setError("No tienes permisos para ver proveedores");
      } else if (err.response?.status === 404) {
        setError("El endpoint de proveedores no existe");
      } else if (err.response?.status === 500) {
        setError("Error interno del servidor al cargar proveedores");
      } else {
        setError(err.message || "Error desconocido al cargar proveedores");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando proveedores...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Error</h3>
        <p className="error-message">{error}</p>
        <button onClick={() => fetchData(page)} className="refresh-btn">
          🔄 Reintentar
        </button>
      </div>
    );

  return (
    <div className="proveedor-list-container">
      <div className="proveedor-list-header">
        <h1 className="proveedor-title">Lista de Proveedores</h1>
        <span className="proveedor-count">
          {totalDocs} proveedores registrados
        </span>
      </div>

      {proveedores.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">No hay proveedores</h3>
          <p className="empty-message">No se encontraron proveedores registrados</p>
        </div>
      ) : (
        <ul className="proveedor-list">
          {proveedores.map((p) => (
            <li className="proveedor-item" key={p.id_proveedor}>
              <div className="proveedor-item-header">
                <h3 className="proveedor-name">{p.nombre || "Sin nombre"}</h3>
                {p.id_proveedor && (
                  <span className="proveedor-id">ID: {p.id_proveedor}</span>
                )}
              </div>

              <div className="proveedor-contact-info">
                <div className="contact-person">
                  <span className="contact-icon">👤</span>
                  <span className="contact-label">Contacto:</span>
                  <span>{p.contacto || "No especificado"}</span>
                </div>
              </div>

              <div className="proveedor-details">
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{p.telefono || "N/A"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">✉️</span>
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{p.email || "N/A"}</span>
                </div>

                {p.direccion && (
                  <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                    <span className="detail-icon">📍</span>
                    <span className="detail-label">Dirección:</span>
                    <span className="detail-value">{p.direccion}</span>
                  </div>
                )}
              </div>

              <div className="proveedor-item-footer">
                <span
                  className={`proveedor-status ${
                    p.estado === "inactivo" ? "status-inactive" : "status-active"
                  }`}
                >
                  {p.estado === "inactivo" ? "Inactivo" : "Activo"}
                </span>

                <div className="proveedor-actions">
                  <button className="action-btn edit">
                    <span>✏️</span> Editar
                  </button>
                  <button className="action-btn delete">
                    <span>🗑️</span> Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {proveedores.length > 0 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
            ⬅️ Anterior
          </button>
          <span>
            Página {page} de {totalPages} (Total: {totalDocs} proveedores)
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
            Siguiente ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default ProveedorList;

