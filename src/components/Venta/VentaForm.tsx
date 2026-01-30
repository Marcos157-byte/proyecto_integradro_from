import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Box, Grid, Paper, Typography, TextField, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Divider, Autocomplete, Alert, MenuItem, Stack 
} from "@mui/material";
import { Delete as DeleteIcon, AddShoppingCart as CartIcon } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "../../context/AuthContext";
import { registrarVenta } from "../../services/ventaService";
import client from "../../api/client"; 

// Importación de tipos
import type { Producto } from "../../types/producto.types";
import type { Cliente } from "../../types/cliente.type";
import type { CreateVentaDto, CreateVentaDetalleDto } from "../../types/venta.types";

/**
 * COMPONENTE DEL TICKET (Ajustado para 58mm)
 */
const TicketImpresion = ({ venta, ref }: { venta: any, ref: any }) => (
  <div ref={ref} style={{ width: '58mm', padding: '2mm', fontFamily: 'monospace', color: 'black', backgroundColor: 'white' }}>
    <style>{`
      @media print {
        @page { margin: 0; size: 58mm auto; }
        body { margin: 0; }
      }
    `}</style>
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ margin: 0 }}>JEANS STORE</h3>
      <p style={{ fontSize: '10px', margin: 0 }}>Quito, Ecuador</p>
      <p style={{ fontSize: '10px', margin: 0 }}>---------------------------</p>
    </div>
    <div style={{ fontSize: '11px' }}>
      <p style={{ margin: 0 }}><b>Fecha:</b> {new Date().toLocaleString()}</p>
      <p style={{ margin: 0 }}><b>Cliente:</b> {venta.cliente?.nombre || 'C. Final'}</p>
      <p style={{ margin: '5px 0' }}>---------------------------</p>
      <table style={{ width: '100%', fontSize: '10px' }}>
        {venta.productos.map((p: any, i: number) => (
          <tr key={i}>
            <td colSpan={2}>{p.nombre.substring(0, 15)}</td>
          </tr>
        ))}
        {venta.productos.map((p: any, i: number) => (
          <tr key={i + 'sub'}>
            <td>{p.cantidad} x ${p.precio.toFixed(2)}</td>
            <td align="right">${(p.cantidad * p.precio).toFixed(2)}</td>
          </tr>
        ))}
      </table>
      <p style={{ margin: '5px 0' }}>---------------------------</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total:</span>
        <span style={{ fontWeight: 'bold' }}>${venta.total.toFixed(2)}</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ fontSize: '10px' }}>¡Gracias por su compra!</p>
        <br />.
      </div>
    </div>
  </div>
);

interface ItemCarrito extends CreateVentaDetalleDto {
  nombre: string;
  precio: number;
}

export default function NuevaVenta() {
  const { user } = useAuth(); 
  const componentRef = useRef<HTMLDivElement>(null); // Referencia para la impresora
  
  // Estados
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); 
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null); 
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [datosParaTicket, setDatosParaTicket] = useState<any>(null); // Datos temporales para el ticket

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Lógica de Impresión
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const fetchData = useCallback(async () => {
    try {
      const [resProd, resCli] = await Promise.all([
        client.get("/productos"), 
        client.get("/clientes") 
      ]);
      setProductos(resProd.data.data?.data || resProd.data.data || []);
      setClientes(resCli.data.data?.data || resCli.data.data || []);
    } catch (err) {
      setError("No se pudieron cargar los productos o clientes.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const agregarAlCarrito = (producto: Producto) => {
    const itemEnCarrito = carrito.find((item) => item.id_producto === producto.id_producto);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    if (Number(producto.stock_total) <= cantidadActual) {
      setError(`Stock insuficiente para ${producto.nombre}.`);
      return;
    }

    if (itemEnCarrito) {
      setCarrito(carrito.map((item) => 
        item.id_producto === producto.id_producto 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      ));
    } else {
      setCarrito([...carrito, { 
        id_producto: producto.id_producto, 
        nombre: producto.nombre, 
        precio: parseFloat(producto.precio.toString()), 
        cantidad: 1 
      }]);
    }
    setError(""); 
  };

  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  const handleFinalizarVenta = async () => {
    setError("");
    const userId = user?.id_usuario; 

    if (!userId) return setError("Error: No se detecta usuario autenticado.");
    if (!clienteSeleccionado) return setError("Debe seleccionar un cliente.");
    if (carrito.length === 0) return setError("El carrito está vacío.");

    const ventaData: CreateVentaDto = {
      id_cliente: clienteSeleccionado.id_cliente,
      id_usuario: userId,
      metodoPago: metodoPago,
      ventasDetalles: carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad
      }))
    };

    try {
      setCargando(true);
      await registrarVenta(ventaData);
      
      // Guardamos datos para el ticket antes de borrar el carrito
      setDatosParaTicket({
        cliente: clienteSeleccionado,
        productos: [...carrito],
        total: total
      });

      setSuccess(true);
      setCarrito([]);
      setClienteSeleccionado(null);
      await fetchData(); 

      // Pequeño delay para asegurar que el componente ticket se renderice antes de imprimir
      setTimeout(() => {
        handlePrint();
        setSuccess(false);
      }, 500);

    } catch (err: any) {
      const serverMsg = err.response?.data?.message || "Debe abrir la caja para realizar ventas.";
      setError(Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: "#1B2559" }}>
        🛒 Nueva Venta
      </Typography>
      
      {success && <Alert severity="success" sx={{ mb: 2 }}>¡Venta registrada! Imprimiendo ticket...</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Paper sx={{ p: 3, borderRadius: "20px" }}>
            <Autocomplete
              options={productos}
              getOptionLabel={(option) => `${option.nombre} - $${option.precio} (Stock: ${option.stock_total})`}
              onChange={(_, value) => { value && agregarAlCarrito(value); }}
              renderInput={(params) => <TextField {...params} label="Buscar Producto" fullWidth />}
              sx={{ mb: 3 }}
            />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Producto</b></TableCell>
                    <TableCell align="right"><b>Cant.</b></TableCell>
                    <TableCell align="right"><b>Subtotal</b></TableCell>
                    <TableCell align="center"><b>Acción</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrito.map((item) => (
                    <TableRow key={item.id_producto}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell align="right">{item.cantidad}</TableCell>
                      <TableCell align="right">${(item.cantidad * item.precio).toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => setCarrito(carrito.filter(c => c.id_producto !== item.id_producto))}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }} >
          <Paper sx={{ p: 3, borderRadius: "20px" }}>
             <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>Facturación</Typography>
                
                <Autocomplete
                  options={clientes}
                  getOptionLabel={(option) => `${option.nombre} — ${option.cedula}`}
                  value={clienteSeleccionado}
                  onChange={(_, value) => setClienteSeleccionado(value)}
                  renderInput={(params) => <TextField {...params} label="Cliente" />}
                />

                <TextField select label="Pago" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                  <MenuItem value="Efectivo">💵 Efectivo</MenuItem>
                  <MenuItem value="Transferencia">📱 Transferencia</MenuItem>
                  <MenuItem value="Tarjeta">💳 Tarjeta</MenuItem>
                </TextField>

                <Divider />

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Total:</Typography>
                    <Typography variant="h5" color="primary" fontWeight={800}>${total.toFixed(2)}</Typography>
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  startIcon={<CartIcon />} 
                  onClick={handleFinalizarVenta} 
                  fullWidth 
                  disabled={carrito.length === 0 || cargando}
                  sx={{ py: 1.5, borderRadius: "12px" }}
                >
                  {cargando ? "Procesando..." : "Finalizar Venta"}
                </Button>
             </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* COMPONENTE OCULTO PARA LA IMPRESORA */}
      <div style={{ display: 'none' }}>
        {datosParaTicket && (
          <TicketImpresion 
            ref={componentRef} 
            venta={datosParaTicket} 
          />
        )}
      </div>
    </Box>
  );
}