import React, { useState } from "react";
import { createProveedor } from "../../services/proveedorService";


function ProveedorForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!formData.nombre.trim()) throw new Error("El nombre es obligatorio");
      if (!formData.contacto.trim()) throw new Error("El contacto es obligatorio");
      if (!formData.telefono.trim()) throw new Error("El teléfono es obligatorio");
      if (!formData.email.trim()) throw new Error("El email es obligatorio");
      if (!formData.direccion.trim()) throw new Error("La dirección es obligatoria");

      const nuevo = await createProveedor(formData);
      console.log("✅ Proveedor creado:", nuevo);

      setMessage({ type: "success", text: "Proveedor creado correctamente ✓" });

      // Resetear formulario
      setFormData({
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
      });

      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      let errorMessage = "Error al crear el proveedor";
      if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para crear proveedores";
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage({ type: "error", text: errorMessage });
      console.error("❌ Error al crear proveedor", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="proveedor-form">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del proveedor"
        value={formData.nombre}
        onChange={handleChange}
      />
      <input
        type="text"
        name="contacto"
        placeholder="Nombre del contacto"
        value={formData.contacto}
        onChange={handleChange}
      />
      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="direccion"
        placeholder="Dirección"
        value={formData.direccion}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "⏳ Guardando..." : "Guardar proveedor"}
      </button>

      {message && (
        <p className={`message ${message.type}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}

export default ProveedorForm;

