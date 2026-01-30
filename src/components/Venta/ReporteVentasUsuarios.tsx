import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Avatar, IconButton, 
  Tooltip, TextField, InputAdornment, Button, CircularProgress,
  Grid, Divider, Chip, Card, CardContent, TablePagination
} from "@mui/material";
import { 
  Search as SearchIcon,
  Visibility as EyeIcon,
  ArrowBack as BackIcon,
  TrendingUp as TrendingIcon,
  ShoppingBag as BagIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon
} from "@mui/icons-material";

import { getRankingVendedores, getVentasPorUsuario } from "../../services/ventaService";

export default function ReporteVentasUsuarios() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<any | null>(null);
  const [detallesVenta, setDetallesVenta] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  // ESTADOS PARA PAGINACIÓN DE DETALLES (Igual a ProveedorList)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const cargarRanking = async () => {
    setLoading(true);
    try {
      const data = await getRankingVendedores();
      setRanking(data || []);
    } catch (error) {
      console.error("Error al cargar ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRanking();
  }, []);

  const verDetalles = async (vendedor: any) => {
    setLoading(true);
    setPage(0); // Reiniciar a la primera página al cambiar de vendedor
    try {
      const data = await getVentasPorUsuario(vendedor.id_usuario);
      setVendedorSeleccionado(vendedor);
      setDetallesVenta(data || []);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Lógica de segmentación de datos para la paginación local
  const ventasPaginadas = detallesVenta.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // VISTA 1: RANKING (Manteniendo estilo EmpleadoList)
  if (!vendedorSeleccionado) {
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Ranking de <span style={{ color: "#4f69f9" }}>Vendedores</span>
            </Typography>
            <Typography variant="body1" color="text.secondary">Desempeño comercial por usuario.</Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Buscar vendedor..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ bgcolor: 'white', borderRadius: 2, width: 320 }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafd' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>POSICIÓN</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>VENDEDOR</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>VENTAS TOTALES</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>MONTO ACUMULADO</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><CircularProgress /></TableCell></TableRow>
              ) : (
                ranking
                  .filter(v => v.nombre_vendedor.toLowerCase().includes(filter.toLowerCase()))
                  .map((v, index) => (
                  <TableRow key={v.id_usuario} hover>
                    <TableCell>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        sx={{ fontWeight: 800, bgcolor: index === 0 ? '#fef3c7' : '#f1f5f9', color: index === 0 ? '#92400e' : '#64748b' }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: index === 0 ? '#4f69f9' : '#eef2ff', color: index === 0 ? 'white' : '#4f69f9', fontWeight: 'bold' }}>
                          {v.nombre_vendedor.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          {v.nombre_vendedor}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BagIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{v.total_ventas} transacciones</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#166534' }}>
                        ${parseFloat(v.monto_total_acumulado).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#4f69f9', bgcolor: '#f0f2ff' }} 
                        onClick={() => verDetalles(v)}
                      >
                        <EyeIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // VISTA 2: DETALLE (Con Paginación estilo ProveedorList)
  return (
    <Box sx={{ p: 4 }}>
      <Button 
        startIcon={<BackIcon />} 
        onClick={() => setVendedorSeleccionado(null)}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 700 }}
      >
        Volver al Ranking
      </Button>

      <Grid container spacing={3}>
        {/* Panel Izquierdo: Resumen */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#4f69f9' }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                {vendedorSeleccionado.nombre_vendedor}
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>TOTAL RECAUDADO</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#4f69f9', mb: 2 }}>
                  ${parseFloat(vendedorSeleccionado.monto_total_acumulado).toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b' }}>TOTAL OPERACIONES</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{vendedorSeleccionado.total_ventas} Ventas</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel Derecho: Listado de Ventas con Paginación */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon /> Historial de Transacciones
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {ventasPaginadas.map((venta) => (
              <Paper key={venta.factura} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <Box sx={{ bgcolor: '#f8fafc', p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>TICKET #{venta.factura}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                    {new Date(venta.fecha).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>CLIENTE: {venta.cliente.toUpperCase()}</Typography>
                  <Divider sx={{ mb: 1 }} />
                  {venta.items.map((item: any, i: number) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                      <Typography variant="caption">{item.producto} (x{item.cantidad})</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>${item.subtotal.toFixed(2)}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#166534' }}>
                      TOTAL: ${venta.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* COMPONENTE DE PAGINACIÓN (Igual que en ProveedorList) */}
          <TablePagination
            component="div"
            count={detallesVenta.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Tickets por página"
            sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0' }}
          />
        </Grid>
      </Grid>
      
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#4f69f9' }} />
        </Box>
      )}
    </Box>
  );
}