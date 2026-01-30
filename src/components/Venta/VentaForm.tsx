import  { useState, useEffect, useCallback } from "react";
import { 
  Box, Grid, Paper, Typography, TextField, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Divider, Autocomplete, Alert, MenuItem, Stack 
} from "@mui/material";
import { Delete as DeleteIcon, AddShoppingCart as CartIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { registrarVenta } from "../../services/ventaService";
import client from "../../api/client"; 

// Importación de tipos
import type { Producto } from "../../types/producto.types";
import type { Cliente } from "../../types/cliente.type";
import type { CreateVentaDto, CreateVentaDetalleDto } from "../../types/venta.types";

/**
 * Interfaz extendida para el manejo local del carrito
 */
interface ItemCarrito extends CreateVentaDetalleDto {
  nombre: string;
  precio: number;
}

export default function NuevaVenta() {
  const { user } = useAuth(); 
  
  // Estados de Catálogos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); 
  
  // Estados de la Venta
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null); 
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  
  // Estados de Feedback UI
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);

  /**
   * Carga de catálogos desde el API.
   * Se usa useCallback para refrescar los datos tras una venta exitosa.
   */
  const fetchData = useCallback(async () => {
    try {
      const [resProd, resCli] = await Promise.all([
        client.get("/productos"), 
        client.get("/clientes") 
      ]);
      
      // Manejo de respuesta flexible según SuccessResponseDto
      setProductos(resProd.data.data?.data || resProd.data.data || []);
      setClientes(resCli.data.data?.data || resCli.data.data || []);
    } catch (err) {
      console.error("Error cargando catálogos:", err);
      setError("No se pudieron cargar los productos o clientes.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Agrega un producto al carrito controlando el stock disponible.
   */
  const agregarAlCarrito = (producto: Producto) => {
    const itemEnCarrito = carrito.find((item) => item.id_producto === producto.id_producto);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    // Validación de Stock local (Stock total vs cantidad en carrito)
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

  /**
   * Cálculos de la factura (IVA 15%)
   */
  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  /**
   * Envía la venta al servidor.
   */
  const handleFinalizarVenta = async () => {
    setError("");
    const userId = user?.id_usuario; 

    // Validaciones previas
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
      
      // Resetear formulario
      setSuccess(true);
      setCarrito([]);
      setClienteSeleccionado(null);
      
      // Refrescar el stock real desde el servidor
      await fetchData(); 

      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || "Error interno al procesar la venta Primero tiene que abrir la caja para poder finalizar las ventas.";
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
      
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "12px" }}>¡Venta registrada con éxito! El inventario ha sido actualizado.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        {/* PANEL IZQUIERDO: Selección y Carrito */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0px 10px 30px rgba(0,0,0,0.05)" }}>
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
                    <TableCell align="right"><b>Precio</b></TableCell>
                    <TableCell align="center"><b>Cant.</b></TableCell>
                    <TableCell align="right"><b>Subtotal</b></TableCell>
                    <TableCell align="center"><b>Acción</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrito.map((item) => (
                    <TableRow key={item.id_producto}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell align="right">${item.precio.toFixed(2)}</TableCell>
                      <TableCell align="center">{item.cantidad}</TableCell>
                      <TableCell align="right">${(item.cantidad * item.precio).toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => setCarrito(carrito.filter(c => c.id_producto !== item.id_producto))}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {carrito.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                        Seleccione productos para agregarlos a la venta.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* PANEL DERECHO: Facturación y Pago */}
        <Grid size={{ xs: 12, md: 4 }} >
          <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0px 10px 30px rgba(0,0,0,0.05)" }}>
             <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>Detalles de Facturación</Typography>
                
                <Autocomplete
                  options={clientes}
                  getOptionLabel={(option) => `${option.nombre} — ${option.cedula}`}
                  value={clienteSeleccionado}
                  onChange={(_, value) => setClienteSeleccionado(value)}
                  renderInput={(params) => <TextField {...params} label="Cliente" />}
                />

                <TextField 
                  select 
                  label="Método de Pago" 
                  value={metodoPago} 
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <MenuItem value="Efectivo">💵 Efectivo</MenuItem>
                  <MenuItem value="Transferencia">📱 Transferencia</MenuItem>
                  <MenuItem value="Tarjeta">💳 Tarjeta</MenuItem>
                </TextField>

                <Divider />

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Subtotal:</Typography>
                    <Typography fontWeight={600}>${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">IVA (15%):</Typography>
                    <Typography fontWeight={600}>${iva.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h5" color="primary" fontWeight={800}>
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  startIcon={<CartIcon />} 
                  onClick={handleFinalizarVenta} 
                  fullWidth 
                  disabled={carrito.length === 0 || cargando}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: "12px", 
                    textTransform: "none", 
                    fontSize: "1.1rem",
                    boxShadow: "0px 4px 12px rgba(67, 24, 255, 0.3)"
                  }}
                >
                  {cargando ? "Procesando..." : "Finalizar Venta"}
                </Button>
             </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}