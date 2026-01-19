import { useEffect, useState } from "react";
import { listColor } from "../services/colorService";
import "../styles/ColorList.css";

interface Color {
  id_color: string;
  color: string;
  estado?: string;
}

function ColorList() {
  const [colores, setColores] = useState<Color[]>([]);
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
      const respuesta = await listColor(pageNumber, 5);
      console.log("📦 Datos recibidos:", respuesta);

      setColores(respuesta.docs);
      setTotalPages(respuesta.totalPages);
      setTotalDocs(respuesta.totalDocs);
    } catch (err: any) {
      console.error("❌ Error al cargar colores:", err.response || err);
      if (err.response?.status === 403) {
        setError("No tienes permisos para ver colores");
      } else if (err.response?.status === 404) {
        setError("El endpoint de colores no existe");
      } else if (err.response?.status === 500) {
        setError("Error interno del servidor al cargar colores");
      } else {
        setError(err.message || "Error desconocido al cargar colores");
      }
    } finally {
      setLoading(false);
    }
  };

  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      rojo: "#f44336", azul: "#2196f3", verde: "#4caf50",
      amarillo: "#ffeb3b", naranja: "#ff9800", morado: "#9c27b0",
      rosa: "#e91e63", negro: "#212121", blanco: "#ffffff",
      gris: "#9e9e9e", marrón: "#795548", celeste: "#03a9f4",
      turquesa: "#00bcd4", lila: "#ce93d8", dorado: "#ffd700",
      plateado: "#c0c0c0", beige: "#f5f5dc", coral: "#ff7f50",
      azulmarino: "#000080", oliva: "#808000"
    };
    const normalized = colorName.toLowerCase().trim();
    return colorMap[normalized] || "#757575";
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando colores...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <span className="error-icon">⚠️</span>
        <h3 className="error-title">Error</h3>
        <p className="error-message">{error}</p>
        <button onClick={() => fetchData(page)} className="refresh-btn">
          🔄 Reintentar
        </button>
      </div>
    );

  return (
    <div className="color-list-container">
      <div className="color-list-header">
        <h1 className="header-title">Catálogo de Colores</h1>
        <div className="header-count">
          {totalDocs} {totalDocs === 1 ? "color registrado" : "colores registrados"}
        </div>
      </div>

      {colores.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3 className="empty-title">No hay colores registrados</h3>
          <p className="empty-message">
            Aún no se han agregado colores al sistema.
            ¡Sé el primero en registrar un color!
          </p>
        </div>
      ) : (
        <ul className="colors-grid">
          {colores.map((c, index) => (
            <li className="color-card" key={c.id_color || index}>
              <div
                className="color-preview"
                style={{ backgroundColor: getColorHex(c.color) }}
              ></div>
              <div className="card-content">
                <h3 className="color-name">{c.color}</h3>
                <div className="hex-code">{getColorHex(c.color).toUpperCase()}</div>
                <div className="color-info">
                  <span className="color-id">
                    ID: {c.id_color || `#${index + 1}`}
                  </span>
                  <span
                    className={`color-status ${
                      c.estado === "inactivo" ? "status-inactive" : "status-active"
                    }`}
                  >
                    {c.estado === "inactivo" ? "Inactivo" : "Activo"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {colores.length > 0 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
            ⬅️ Anterior
          </button>
          <span>
            Página {page} de {totalPages} (Total: {totalDocs} colores)
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
            Siguiente ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default ColorList;

