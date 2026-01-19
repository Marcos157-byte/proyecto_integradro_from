import React, { useEffect, useState } from "react";
import { listProducto } from "../services/productoService";

function ProductoList() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listProducto();
        console.log("📦 Productos recibidos:", res.docs); // ✅ aquí sí hay datos
        setProductos(res.docs); // ✅ usar docs, no data
      } catch (error) {
        console.error("❌ Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (productos.length === 0) return <p>No hay productos disponibles.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
          <th>Talla</th>
          <th>Color</th>
          <th>Proveedor</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.id_producto}>
            <td>{p.nombre}</td>
            <td>{p.precio}</td>
            <td>{p.stock_total}</td>
            <td>{p.categoria?.nombre || "Sin categoría"}</td>
            <td>{p.talla?.nombre || "Sin talla"}</td>
            <td>{p.color?.color || "Sin color"}</td>
            <td>{p.proveedor?.nombre || "Sin proveedor"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductoList;

