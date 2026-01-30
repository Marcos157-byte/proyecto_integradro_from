import { useEffect, useState } from "react";
import { listVentaDetalles } from "../../services/ventaDetalleService";

function VentaList() {
  const [detalles, setDetalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetalles() {
      setLoading(true);
      try {
        const res = await listVentaDetalles(); // ✅ sin "all"
        console.log("Detalles recibidos:", res.docs);
        setDetalles(res.docs);
      } catch (err: any) {
        setError(err.message || "Error al cargar detalles de ventas");
      } finally {
        setLoading(false);
      }
    }
    fetchDetalles();
  }, []);

  if (loading) return <p>Cargando ventas...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="venta-list">
      {detalles.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Método de Pago</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.id_ventaDetalle}>
                <td>{new Date(d.venta.fechaVenta).toLocaleString()}</td>
                <td>{d.venta.metodoPago}</td>
                <td>{d.venta.subtotal}</td>
                <td>{d.venta.iva}</td>
                <td>{d.venta.total}</td>
                <td>{d.producto?.nombre}</td>
                <td>{d.cantidad}</td>
                <td>{d.precio_unitario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VentaList;

