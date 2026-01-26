import React, { useState } from "react";
import { createColor } from "../../services/colorService";


function ColorForm() {
  const [formData, setFormData] = useState({ color: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ color: e.target.value });
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.color.trim()) {
      setMessage({ type: 'error', text: "Por favor, ingresa un nombre de color" });
      return;
    }

    setLoading(true);
    setMessage(null);
    
    try {
      const nuevo = await createColor(formData);
      console.log("✅ Color creado:", nuevo);
      
      // Agregar a colores recientes
      setRecentColors(prev => [formData.color, ...prev.slice(0, 5)]);
      
      setMessage({ 
        type: 'success', 
        text: `🎉 Color "${formData.color}" creado correctamente` 
      });
      
      setFormData({ color: "" });
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(null), 5000);
      
    } catch (error: any) {
      const errorMsg = error.response?.status === 403 
        ? "⛔ No tienes permisos para crear colores" 
        : `❌ Error: ${error.message || "Error al crear el color"}`;
      
      setMessage({ type: 'error', text: errorMsg });
      console.error("❌ Error al crear un Color", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ color: "" });
    setMessage(null);
  };

  // Función para obtener color HEX basado en nombre
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

  const handleColorChipClick = (color: string) => {
    setFormData({ color });
  };

  return (
    <div className="color-form-container">
      {/* Header */}
      <div className="form-header">
        <span className="form-icon">🎨</span>
        <h1 className="form-title">Nuevo Color</h1>
        <p className="form-subtitle">Agrega un nuevo color al catálogo del sistema</p>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`form-message message-${message.type}`}>
          <span className="message-icon">
            {message.type === 'success' ? '✅' : '⚠️'}
          </span>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Campo de entrada */}
        <div className="form-group">
          <label className="form-label" htmlFor="color">
            Nombre del Color
          </label>
          <input
            id="color"
            name="color"
            type="text"
            value={formData.color}
            onChange={handleChange}
            placeholder="Ej: Rojo, Azul marino, Verde lima..."
            className="form-input"
            disabled={loading}
            required
          />
        </div>

        {/* Vista previa del color */}
        {formData.color && (
          <div className="color-preview-container">
            <div className="preview-label">Vista previa</div>
            <div className="color-display">
              <div 
                className="color-circle"
                style={{ backgroundColor: getColorHex(formData.color) }}
              ></div>
              <div>
                <h3 className="color-name-display">{formData.color}</h3>
                <div className="color-hex">{getColorHex(formData.color).toUpperCase()}</div>
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
            disabled={loading || !formData.color}
          >
            <span className="btn-icon">🗑️</span>
            Limpiar
          </button>
          
          <button
            type="submit"
            className="btn btn-submit"
            disabled={loading || !formData.color.trim()}
            style={{
              background: formData.color 
                ? `linear-gradient(135deg, ${getColorHex(formData.color)} 0%, #6c63ff 100%)`
                : undefined
            }}
          >
            <span className="btn-icon">
              {loading ? '⏳' : '➕'}
            </span>
            {loading ? 'Creando...' : 'Registrar Color'}
          </button>
        </div>
      </form>

      {/* Colores recientes */}
      {recentColors.length > 0 && (
        <div className="recent-colors">
          <h3 className="recent-title">Colores recientes</h3>
          <div className="recent-colors-grid">
            {recentColors.map((color, index) => (
              <div
                key={index}
                className="color-chip"
                onClick={() => handleColorChipClick(color)}
                style={{
                  background: `linear-gradient(135deg, ${getColorHex(color)}20 0%, #ffffff 100%)`,
                  borderColor: getColorHex(color)
                }}
              >
                <div 
                  className="chip-color"
                  style={{ backgroundColor: getColorHex(color) }}
                ></div>
                {color}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorForm;