import React, { useState, useEffect } from "react";
import { createCategoria } from "../services/categoriaService";
import "../styles/CategoriaForm.css";

function CategoriaForm() {
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [recentCategorias, setRecentCategorias] = useState<{ nombre: string; descripcion: string }[]>([]);

  // Cargar categorías recientes del localStorage al inicio
  useEffect(() => {
    const savedCategorias = localStorage.getItem("recentCategorias");
    if (savedCategorias) {
      setRecentCategorias(JSON.parse(savedCategorias));
    }
  }, []);

  // Guardar categorías recientes en localStorage
  useEffect(() => {
    if (recentCategorias.length > 0) {
      localStorage.setItem("recentCategorias", JSON.stringify(recentCategorias));
    }
  }, [recentCategorias]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      setMessage({ type: "error", text: "Por favor, completa todos los campos" });
      return;
    }

    // Validación local: nombre solo letras y máximo 100 caracteres
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)) {
      setMessage({ type: "error", text: "⛔ El nombre solo puede contener letras y espacios" });
      return;
    }
    if (formData.nombre.length > 100) {
      setMessage({ type: "error", text: "⛔ El nombre no puede tener más de 100 caracteres" });
      return;
    }
    if (formData.descripcion.length > 255) {
      setMessage({ type: "error", text: "⛔ La descripción no puede tener más de 255 caracteres" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const nueva = await createCategoria({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
      });
      console.log("✅ Categoría creada:", nueva);

      // Agregar a categorías recientes (sin duplicados)
      setRecentCategorias((prev) => {
        const filtered = prev.filter((c) => c.nombre !== formData.nombre);
        return [{ nombre: formData.nombre, descripcion: formData.descripcion }, ...filtered.slice(0, 4)];
      });

      setMessage({
        type: "success",
        text: `🎉 Categoría "${formData.nombre}" creada correctamente`,
      });

      setFormData({ nombre: "", descripcion: "" });

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      const errorMsg =
        error.response?.status === 403
          ? "⛔ No tienes permisos para crear categorías"
          : error.response?.status === 409
          ? "⚠️ Esta categoría ya existe en el sistema"
          : `❌ Error: ${error.message || "Error al crear la categoría"}`;

      setMessage({ type: "error", text: errorMsg });
      console.error("❌ Error al crear una Categoría", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ nombre: "", descripcion: "" });
    setMessage(null);
  };

  const handleChipClick = (categoria: { nombre: string; descripcion: string }) => {
    setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion });
  };

  // Obtener inicial del nombre para el badge
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Formatear descripción para vista previa
  const formatDescription = (desc: string) => {
    if (desc.length > 100) {
      return desc.substring(0, 100) + "...";
    }
    return desc;
  };

  return (
    <div className="categoria-form-container">
      {/* Header */}
      <div className="form-header">
        <span className="form-icon">📂</span>
        <h1 className="form-title">Nueva Categoría</h1>
        <p className="form-subtitle">Agrega una nueva categoría al catálogo del sistema</p>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`form-message message-${message.type}`}>
          <span className="message-icon">{message.type === "success" ? "✅" : "⚠️"}</span>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Campo Nombre */}
        <div className="form-group">
          <label className="form-label" htmlFor="nombre">
            Nombre de la Categoría
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Ropa, Calzado, Accesorios..."
            className="form-input"
            disabled={loading}
            required
            maxLength={100}
            autoComplete="off"
          />
          <div className="size-indicator">
            <span className="current-size">{formData.nombre.length}/100 caracteres</span>
            <span className="size-limit">Solo letras y espacios</span>
          </div>
        </div>

        {/* Campo Descripción */}
        <div className="form-group">
          <label className="form-label" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe la categoría (máximo 255 caracteres)..."
            className="form-input"
            disabled={loading}
            required
            maxLength={255}
            rows={3}
          />
          <div className="size-indicator">
            <span className="current-size">{formData.descripcion.length}/255 caracteres</span>
            <span className="size-limit">Descripción clara y concisa</span>
          </div>
        </div>

        {/* Vista previa de la categoría */}
        {(formData.nombre || formData.descripcion) && (
          <div className="categoria-preview-container">
            <div className="preview-label">Vista previa</div>
            <div className="categoria-display">
              <div className="categoria-badge">
                {getInitial(formData.nombre) || "C"}
              </div>
              <div className="categoria-info">
                <div className="categoria-nombre">
                  {formData.nombre || "Nombre de categoría"}
                </div>
                <p className="categoria-descripcion">
                  {formData.descripcion ? formatDescription(formData.descripcion) : "Descripción de la categoría..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="form-buttons">
          <button
            type="button"
            className="btn btn-clear"
            onClick={handleClear}
            disabled={loading || (!formData.nombre && !formData.descripcion)}
          >
            <span className="btn-icon">🗑️</span>
            Limpiar
          </button>

          <button
            type="submit"
            className="btn btn-submit"
            disabled={loading || !formData.nombre.trim() || !formData.descripcion.trim()}
          >
            <span className="btn-icon">{loading ? "⏳" : "➕"}</span>
            {loading ? "Creando..." : "Registrar Categoría"}
          </button>
        </div>
      </form>

      {/* Categorías recientes */}
      {recentCategorias.length > 0 && (
        <div className="recent-categorias">
          <h3 className="recent-title">Categorías recientes</h3>
          <p style={{ fontSize: "14px", color: "#7f8c8d", marginBottom: "15px" }}>
            Haz clic para reutilizar
          </p>
          <div className="recent-categorias-grid">
            {recentCategorias.map((categoria, index) => (
              <div
                key={index}
                className="categoria-chip"
                onClick={() => handleChipClick(categoria)}
                title={`Usar categoría: ${categoria.nombre}\n${categoria.descripcion}`}
              >
                <div className="chip-nombre">{categoria.nombre}</div>
                <div className="chip-descripcion">{formatDescription(categoria.descripcion)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriaForm;