import { useEffect, useState } from "react";
import { listTalla } from "../services/tallaService";
import "../styles/TallaList.css";

interface Talla {
  id_talla: string;
  nombre: string;
}

function TallaList() {
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [filteredTallas, setFilteredTallas] = useState<Talla[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    fetchTallas(page);
  }, [page]);

  // Filtrar tallas cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTallas(tallas);
    } else {
      const filtered = tallas.filter(
        (talla) =>
          talla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          talla.id_talla.toString().includes(searchTerm)
      );
      setFilteredTallas(filtered);
    }
  }, [searchTerm, tallas]);

  const fetchTallas = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await listTalla(pageNumber, 5); // limit 5 por página
      console.log("Respuesta backend:", response);

      const tallasArray = response.docs || [];
      setTallas(tallasArray);
      setFilteredTallas(tallasArray);

      // Actualizar paginación
      setTotalPages(response.totalPages || 1);
      setTotalDocs(response.totalDocs || tallasArray.length);
    } catch (err) {
      if (err instanceof Error) {
        setError(`❌ Error al cargar tallas: ${err.message}`);
      } else {
        setError("❌ Error desconocido al cargar tallas");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="loading-text">⏳ Cargando tallas...</p>
      </div>
    );

  return (
    <div className="talla-list-container">
      {/* Header */}
      <header className="list-header">
        <span className="list-icon">📏</span>
        <h1 className="list-title">Listado de Tallas</h1>
        <p className="list-subtitle">
          Consulta todas las tallas registradas en el sistema
        </p>
      </header>

      {/* Acciones */}
      <div className="table-actions">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar tallas por nombre o ID..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => fetchTallas(page)} className="refresh-btn">
          🔄 Actualizar Lista
        </button>
      </div>

      {/* Tabla */}
      <div className="talla-table-container">
        <table className="talla-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la Talla</th>
            </tr>
          </thead>
          <tbody>
            {filteredTallas.length > 0 ? (
              filteredTallas.map((talla) => (
                <tr key={talla.id_talla}>
                  <td>{talla.id_talla}</td>
                  <td>{talla.nombre}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="no-data">
                  🚫 No hay tallas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          ⬅️ Anterior
        </button>
        <span>
          Página {page} de {totalPages} (Total: {totalDocs})
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}

export default TallaList;