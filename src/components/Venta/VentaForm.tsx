import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Box, Grid, Paper, Typography, TextField, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Divider, Autocomplete, Alert, MenuItem, Stack} from "@mui/material";
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
 * COMPONENTE DEL TICKET
 */
const TicketImpresion = ({ venta, ref }: { venta: any, ref: any }) => (
  <div ref={ref} style={{ width: '58mm', padding: '4mm 2mm', fontFamily: 'monospace', color: 'black', backgroundColor: 'white' }}>
    <style>{`
      @media print {
        @page { margin: 0; size: 58mm auto; }
        body { margin: 0; }
      }
    `}</style>
    <div style={{ textAlign: 'center', borderBottom: '1px dashed black', paddingBottom: '2mm' }}>
      <h3 style={{ margin: 0, letterSpacing: '-1px' }}>DENIM_LAB</h3>
      <p style={{ fontSize: '9px', margin: 0 }}>SISTEMA DE VENTAS POS</p>
      <p style={{ fontSize: '9px', margin: 0 }}>---------------------------</p>
    </div>
    <div style={{ fontSize: '10px', marginTop: '2mm' }}>
      <p style={{ margin: 0 }}>FECHA: {new Date().toLocaleString()}</p>
      <p style={{ margin: 0 }}>CLIENTE: {String(venta.cliente?.nombre || 'C. FINAL').toUpperCase()}</p>
      <div style={{ borderBottom: '1px dashed black', margin: '2mm 0' }} />
      <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse' }}>
        <tbody>
          {venta.productos.map((p: any, i: number) => (
            <tr key={i}>
              <td colSpan={2} style={{ paddingTop: '1mm', fontWeight: 'bold' }}>{p.nombre.toUpperCase()}</td>
            </tr>
          ))}
          {venta.productos.map((p: any, i: number) => (
            <tr key={i + 'sub'}>
              <td>{p.cantidad} x ${p.precio.toFixed(2)}</td>
              <td align="right">${(p.cantidad * p.precio).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ borderBottom: '1px dashed black', margin: '2mm 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
        <span>TOTAL:</span>
        <span>${venta.total.toFixed(2)}</span>
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
  const componentRef = useRef<HTMLDivElement>(null);
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); 
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null); 
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [datosParaTicket, setDatosParaTicket] = useState<any>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  const fetchData = useCallback(async () => {
    try {
      const [resProd, resCli] = await Promise.all([
        client.get("/productos"), 
        client.get("/clientes") 
      ]);
      setProductos(resProd.data.data?.data || resProd.data.data || []);
      setClientes(resCli.data.data?.data || resCli.data.data || []);
    } catch (err) {
      setError("ERROR_SYNC: No se pudieron cargar los datos.");
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const agregarAlCarrito = (producto: Producto) => {
    const itemEnCarrito = carrito.find((item) => item.id_producto === producto.id_producto);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    if (Number(producto.stock_total) <= cantidadActual) {
      setError(`STOCK_LOW: Insuficiente para ${producto.nombre}.`);
      return;
    }

    if (itemEnCarrito) {
      setCarrito(carrito.map((item) => 
        item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + 1 } : item
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
    if (!userId) return setError("AUTH_ERROR: Usuario no detectado.");
    if (!clienteSeleccionado) return setError("INPUT_MISSING: Seleccione un cliente.");
    if (carrito.length === 0) return setError("CART_EMPTY: Carrito vacío.");

    const ventaData: CreateVentaDto = {
      id_cliente: clienteSeleccionado.id_cliente,
      id_usuario: userId,
      metodoPago: metodoPago,
      ventasDetalles: carrito.map(item => ({ id_producto: item.id_producto, cantidad: item.cantidad }))
    };

    try {
      setCargando(true);
      await registrarVenta(ventaData);
      setDatosParaTicket({ cliente: clienteSeleccionado, productos: [...carrito], total: total });
      setSuccess(true);
      setCarrito([]);
      setClienteSeleccionado(null);
      await fetchData(); 
      setTimeout(() => { handlePrint(); setSuccess(false); }, 500);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || "CAJA_CLOSED: Abra caja para vender.";
      setError(serverMsg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 4 }}>
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2 }}>
                NUEVA_VENTA
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#666" }}>
                TERMINAL: 01 // OPERADOR: {user?.nombre?.toUpperCase() || "SISTEMA"}
            </Typography>
        </Box>
        
        {(success || error) && (
            <Box sx={{ width: { xs: '100%', md: '450px' }, mt: { xs: 2, md: 0 } }}>
                {success && <Alert severity="success" variant="filled" sx={{ borderRadius: 0, fontWeight: 800 }}>VENTA REGISTRADA // IMPRIMIENDO</Alert>}
                {error && <Alert severity="error" variant="filled" sx={{ borderRadius: 0, fontWeight: 800 }}>{error}</Alert>}
            </Box>
        )}
      </Stack>
      
      <Grid container spacing={3}>
        {/* LISTADO DE PRODUCTOS */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            <Paper elevation={0} sx={{ p: 2, border: "2px solid #000", borderRadius: 0, bgcolor: "#fff" }}>
                <Autocomplete
                options={productos}
                getOptionLabel={(option) => `${option.nombre} — $${option.precio} [STOCK: ${option.stock_total}]`}
                onChange={(_, value) => { value && agregarAlCarrito(value); }}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="BUSCAR PRODUCTO (F1)" 
                        variant="standard" 
                        fullWidth 
                        autoFocus
                        sx={{ "& .MuiInputLabel-root": { fontWeight: 900, color: '#000' } }} 
                    />
                )}
                />
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #000", borderRadius: 0, maxHeight: '65vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>DESCRIPCIÓN</TableCell>
                    <TableCell align="right" sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>CANT</TableCell>
                    <TableCell align="right" sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>TOTAL</TableCell>
                    <TableCell align="center" sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>ELIMINAR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrito.map((item) => (
                    <TableRow key={item.id_producto} hover>
                      <TableCell sx={{ fontWeight: 900 }}>{item.nombre.toUpperCase()}</TableCell>
                      <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{item.cantidad}</TableCell>
                      <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>${(item.cantidad * item.precio).toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => setCarrito(carrito.filter(c => c.id_producto !== item.id_producto))}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Grid>

        {/* PANEL DE PAGO - TOTAL CORREGIDO */}
        <Grid size={{ xs: 12, lg: 4 }} >
          <Paper 
            elevation={10} 
            sx={{ 
                p: 3, 
                bgcolor: "#000", 
                color: "#fff", 
                borderRadius: 0, 
                borderLeft: "5px solid #fff",
                position: 'sticky', 
                top: 24,
                width: '100%',
                boxSizing: 'border-box'
            }}
          >
             <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Resumen de Cargo
                </Typography>

                <Box sx={{ borderBottom: "1px solid #333", pb: 2 }}>
                    <Autocomplete
                        options={clientes}
                        getOptionLabel={(option) => `${option.cedula} | ${option.nombre}`}
                        value={clienteSeleccionado}
                        onChange={(_, value) => setClienteSeleccionado(value)}
                        renderInput={(params) => (
                            <TextField {...params} label="CLIENTE" variant="standard" 
                            sx={{ 
                                "& .MuiInputLabel-root": { color: "#aaa", fontWeight: 700 }, 
                                "& .MuiInput-input": { color: "#fff", fontSize: '0.9rem' }, 
                                "& .MuiInput-underline:before": { borderBottomColor: "#333" } 
                            }} 
                            />
                        )}
                    />

                    <TextField select label="PAGO" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} variant="standard" fullWidth sx={{ mt: 2, "& .MuiInputLabel-root": { color: "#aaa", fontWeight: 700 }, "& .MuiInput-input": { color: "#fff" }, "& .MuiInput-underline:before": { borderBottomColor: "#333" } }}>
                        <MenuItem value="Efectivo">CASH_EFECTIVO</MenuItem>
                        <MenuItem value="Transferencia">WIRE_TRANSFER</MenuItem>
                        <MenuItem value="Tarjeta">DEBIT_CREDIT_CARD</MenuItem>
                    </TextField>
                </Box>

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: '#aaa' }}>SUBTOTAL:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: '#aaa' }}>IVA (15%):</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>${iva.toFixed(2)}</Typography>
                  </Stack>
                  <Divider sx={{ bgcolor: "#222", my: 1 }} />
                  
                  {/* SECCIÓN DEL TOTAL SIN RECORTE */}
                  <Box sx={{ pt: 1, width: '100%' }}>
                    <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#aaa', mb: 0 }}>
                        TOTAL_DUE
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontWeight: 900, 
                        fontSize: { xs: '2.2rem', xl: '3rem' }, // Tamaño dinámico según pantalla
                        lineHeight: 1.1,
                        wordBreak: 'break-word', // Si el número es gigante, baja de línea en vez de ocultarse
                        overflow: 'visible',     // Asegura que nada se esconda
                        display: 'block',
                        width: '100%'
                      }}
                    >
                        ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                <Button 
                  variant="contained" 
                  startIcon={<CartIcon />} 
                  onClick={handleFinalizarVenta} 
                  fullWidth 
                  disabled={carrito.length === 0 || cargando}
                  sx={{ 
                    py: 2.5, borderRadius: 0, bgcolor: "#fff", color: "#000", fontWeight: 900, fontSize: '1.1rem',
                    "&:hover": { bgcolor: "#ddd" },
                    "&.Mui-disabled": { bgcolor: "#333", color: "#555" }
                  }}
                >
                  {cargando ? "PROCESANDO..." : "FINALIZAR VENTA"}
                </Button>
                
                <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.5 }}>
                    SISTEMA POS v2.6 // DENIM_LAB
                </Typography>
             </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* TICKET OCULTO */}
      <div style={{ display: 'none' }}>
        {datosParaTicket && <TicketImpresion ref={componentRef} venta={datosParaTicket} />}
      </div>
    </Box>
  );
}