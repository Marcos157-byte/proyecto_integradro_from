import { useEffect, useState } from "react";
import { listCategoria } from "../services/categoriaService";
import "../styles/CategoriaList.css";

interface Categoria {
  id_categoria: string;
  nombre: string;
  descripcion: string;
}

function CategoriaList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    fetchCategorias(page);
  }, [page]);

  // Filtrar categorías cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategorias(categorias);
    } else {
      const filtered = categorias.filter(
        (categoria) =>
          categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoria.id_categoria.toString().includes(searchTerm) ||
          categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategorias(filtered);
    }
  }, [searchTerm, categorias]);

  const fetchCategorias = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await listCategoria(pageNumber, 5); // devuelve { docs, totalPages, totalDocs, ... }
      console.log("Respuesta backend:", response);

      const categoriasArray = response.docs || [];
      setCategorias(categoriasArray);
      setFilteredCategorias(categoriasArray);

      // Actualizar paginación
      setTotalPages(response.totalPages || 1);
      setTotalDocs(response.totalDocs || categoriasArray.length);
    } catch (err) {
      if (err instanceof Error) {
        setError(`❌ Error al cargar categorías: ${err.message}`);
      } else {
        setError("❌ Error desconocido al cargar categorías");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const totalCategorias = categorias.length;
  const uniqueFirstLetters = [...new Set(categorias.map(c => c.nombre.charAt(0).toUpperCase()))].length;
  const longestDescription = categorias.length > 0 
    ? Math.max(...categorias.map(c => c.descripcion.length))
    : 0;

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p className="loading-text">⏳ Cargando categorías...</p>
      </div>
    );

  return (
    <div className="categoria-list-container">
      {/* Header */}
      <header className="list-header">
        <span className="list-icon">📂</span>
        <h1 className="list-title">Listado de Categorías</h1>
        <p className="list-subtitle">
          Consulta todas las categorías registradas en el sistema
        </p>
      </header>

      {/* Estadísticas */}
      {!error && categorias.length > 0 && (
        <div className="list-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{totalCategorias}</div>
              <div className="stat-label">Total Categorías</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔤</div>
            <div className="stat-info">
              <div className="stat-value">{uniqueFirstLetters}</div>
              <div className="stat-label">Iniciales Únicas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <div className="stat-value">{longestDescription}</div>
              <div className="stat-label">Descripción más larga</div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="error-state">
          <p className="error-text">{error}</p>
          <button onClick={() => fetchCategorias(page)} className="refresh-btn" style={{ marginTop: '15px' }}>
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Acciones y tabla */}
      {!loading && !error && (
        <>
          <div className="table-actions">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar categorías por nombre, ID o descripción..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => fetchCategorias(page)} className="refresh-btn">
              🔄 Actualizar Lista
            </button>
          </div>

          {/* Contador de resultados */}
          {filteredCategorias.length > 0 && (
            <div className="results-counter">
              Mostrando {filteredCategorias.length} de {categorias.length} categorías
              {searchTerm && ` para "${searchTerm}"`}
            </div>
          )}

          <div className="categoria-table-container">
            <table className="categoria-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategorias.length > 0 ? (
                  filteredCategorias.map((categoria) => (
                    <tr key={categoria.id_categoria}>
                      <td>#{categoria.id_categoria}</td>
                      <td>{categoria.nombre}</td>
                      <td>{categoria.descripcion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="no-data">
                      <span className="no-data-icon">🔍</span>
                      {searchTerm 
                        ? `No se encontraron categorías para "${searchTerm}"`
                        : "🚫 No hay categorías registradas en el sistema"
                      }
                      {searchTerm && (
                        <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.7 }}>
                          <button 
                            onClick={() => setSearchTerm("")}
                            style={{
                              background: 'none',
                              border: '1px solid #9b59b6',
                              color: '#9b59b6',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              marginTop: '10px'
                            }}
                          >
                            Limpiar búsqueda
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {categorias.length > 0 && (
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                ⬅️ Anterior
              </button>
              <span>
                Página {page} de {totalPages} (Total: {totalDocs} categorías)
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Siguiente ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CategoriaList;

