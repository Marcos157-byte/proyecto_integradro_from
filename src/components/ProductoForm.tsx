import React, { useState, useEffect } from "react";
import { createProducto } from "../services/productoService";
import { listCategoria } from "../services/categoriaService";
import { listTalla } from "../services/tallaService";
import { listProveedor } from "../services/proveedorService";
import { listColor } from "../services/colorService";
import "../styles/ProductoForm.css";

function ProductoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock_total: "",
    id_talla: "",
    id_color: "",
    id_proveedor: "",
    id_categoria: "", // 👈 corregido: antes estaba como id_categoria
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [tallas, setTallas] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { docs: tallasData } = await listTalla();
        const { docs: categoriasData } = await listCategoria();
        const { docs: proveedoresData } = await listProveedor();
        const { docs: coloresData } = await listColor();

        setTallas(tallasData || []);
        setCategorias(categoriasData || []);
        setProveedores(proveedoresData || []);
        setColores(coloresData || []);
      } catch (error) {
        console.error("❌ Error cargando listas:", error);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!formData.nombre.trim()) throw new Error("El nombre es obligatorio");
      if (!formData.precio) throw new Error("El precio es obligatorio");
      if (!formData.stock_total) throw new Error("El stock es obligatorio");
      if (!formData.id_talla) throw new Error("Debe seleccionar una talla");
      if (!formData.id_color) throw new Error("Debe seleccionar un color");
      if (!formData.id_proveedor) throw new Error("Debe seleccionar un proveedor");
      if (!formData.id_categoria) throw new Error("Debe seleccionar una categoría");

      const nuevo = await createProducto({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        stock_total: parseInt(formData.stock_total, 10),
        activo: formData.activo,
        id_talla: formData.id_talla,
        id_color: formData.id_color,
        id_proveedor: formData.id_proveedor,
        id_categoria: formData.id_categoria, // 👈 corregido
      });

      console.log("✅ Producto creado:", nuevo);
      setMessage({ type: "success", text: "Producto creado correctamente ✓" });

      setFormData({
        nombre: "",
        precio: "",
        stock_total: "",
        id_talla: "",
        id_color: "",
        id_proveedor: "",
        id_categoria: "", // 👈 corregido
        activo: true,
      });

      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      let errorMessage = "Error al crear el producto";
      if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para crear productos";
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage({ type: "error", text: errorMessage });
      console.error("❌ Error al crear un Producto", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="producto-form">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre del producto"
        value={formData.nombre}
        onChange={handleChange}
      />
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
      />
      <input
        type="number"
        name="stock_total"
        placeholder="Stock total"
        value={formData.stock_total}
        onChange={handleChange}
      />

      <select name="id_talla" value={formData.id_talla} onChange={handleChange}>
        <option value="">Seleccione una talla</option>
        {tallas.map((t) => (
          <option key={t.id_talla} value={t.id_talla}>
            {t.nombre}
          </option>
        ))}
      </select>


      <select name="id_color" value={formData.id_color} onChange={handleChange}>
        <option value="">Seleccione un color</option>
        {colores.map((c) => (
          <option key={c.id_color} value={c.id_color}>
            {c.color}
          </option>
        ))}
      </select>

      <select name="id_proveedor" value={formData.id_proveedor} onChange={handleChange}>
        <option value="">Seleccione un proveedor</option>
        {proveedores.map((p) => (
          <option key={p.id_proveedor} value={p.id_proveedor}>
            {p.nombre}
          </option>
        ))}
      </select>

      <select name="id_categoria" value={formData.id_categoria} onChange={handleChange}>
        <option value="">Seleccione una categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id_categoria} value={cat.id_categoria}>
            {cat.nombre}
          </option>
        ))}
      </select>


      <label>
        <input
          type="checkbox"
          name="activo"
          checked={formData.activo}
          onChange={handleChange}
        />
        Activo
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "⏳ Guardando..." : "Guardar producto"}
      </button>

      {message && (
        <p className={`message ${message.type}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}

export default ProductoForm;
