import React, { useState, useEffect, useContext } from "react";
import { createVenta } from "../services/ventaService";
import { listProducto } from "../services/productoService";
import { listClientes } from "../services/clienteService";
import { AuthContext } from "../context/AuthContext";

function VentaForm() {
  const { user } = useContext(AuthContext)!; // 👈 aquí es user
  const [productos, setProductos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [ventasDetalles, setVentasDetalles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_cliente: "",
    metodoPago: "",
    productoSeleccionado: "",
    cantidad: 1,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Cargar productos y clientes
  useEffect(() => {
    async function fetchData() {
      const resProd = await listProducto();
      setProductos(resProd.docs);

      const resCli = await listClientes();
      console.log("Clientes recibidos:", resCli.docs);
      setClientes(resCli.docs);
    }
    fetchData();
  }, []);

  // Manejo de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message) setMessage(null);
  };

  // Agregar producto al carrito
  const agregarProducto = () => {
    if (!formData.productoSeleccionado) return;
    const producto = productos.find((p) => p.id_producto === formData.productoSeleccionado);
    if (!producto) return;

    if (formData.cantidad > producto.stock_total) {
      setMessage({ type: "error", text: `Stock insuficiente para ${producto.nombre}` });
      return;
    }

    setVentasDetalles([
      ...ventasDetalles,
      {
        id_producto: producto.id_producto,
        cantidad: formData.cantidad,
      },
    ]);

    // Reset selección
    setFormData({ ...formData, productoSeleccionado: "", cantidad: 1 });
  };

  // Registrar venta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!formData.id_cliente) throw new Error("Debe seleccionar un cliente");
      if (!formData.metodoPago.trim()) throw new Error("Debe ingresar un método de pago");
      if (ventasDetalles.length === 0) throw new Error("Debe agregar al menos un producto");

      const ventaPayload = {
        id_cliente: formData.id_cliente,
        id_usuario: user?.id, // 👈 UUID del vendedor
        metodoPago: formData.metodoPago,
        ventasDetalles, // 👈 solo id_producto y cantidad
      };

      const venta = await createVenta(ventaPayload);
      console.log("✅ Venta registrada:", venta);

      setMessage({ type: "success", text: "Venta registrada correctamente ✓" });
      setVentasDetalles([]);
      setFormData({ id_cliente: "", metodoPago: "", productoSeleccionado: "", cantidad: 1 });
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Error al registrar la venta" });
      console.error("❌ Error al registrar venta", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="venta-form">
      {/* Selección de cliente */}
      <select name="id_cliente" value={formData.id_cliente} onChange={handleChange}>
        <option value="">Seleccione un cliente</option>
        {clientes.map((c) => (
          <option key={c.id_cliente} value={c.id_cliente}>
            {c.nombre} - {c.email}
          </option>
        ))}
      </select>

      {/* Método de pago */}
      <input
        type="text"
        name="metodoPago"
        placeholder="Método de pago (ej: Efectivo, Tarjeta)"
        value={formData.metodoPago}
        onChange={handleChange}
      />

      {/* Selección de producto */}
      <select
        name="productoSeleccionado"
        value={formData.productoSeleccionado}
        onChange={handleChange}
      >
        <option value="">Seleccione un producto</option>
        {productos.map((p) => (
          <option key={p.id_producto} value={p.id_producto}>
            {p.nombre} - Stock: {p.stock_total} - Precio: {p.precio}
          </option>
        ))}
      </select>

      {/* Cantidad */}
      <input
        type="number"
        name="cantidad"
        value={formData.cantidad}
        onChange={handleChange}
        min={1}
      />

      <button type="button" onClick={agregarProducto}>
        Agregar producto
      </button>

      {/* Carrito */}
      <ul>
        {ventasDetalles.map((d, i) => {
          const producto = productos.find((p) => p.id_producto === d.id_producto);
          return (
            <li key={i}>
              Producto: {producto?.nombre} | Cantidad: {d.cantidad} | Precio: {producto?.precio}
            </li>
          );
        })}
      </ul>

      <button type="submit" disabled={loading}>
        {loading ? "⏳ Registrando..." : "Registrar venta"}
      </button>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}
    </form>
  );
}

export default VentaForm;

