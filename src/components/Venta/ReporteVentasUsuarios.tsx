import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Avatar, IconButton, 
  TextField, InputAdornment, Button, CircularProgress,
  Grid, Divider, Card, CardContent, TablePagination, Stack
} from "@mui/material";
import { 
  Search as SearchIcon,
  Visibility as EyeIcon,
  ArrowBack as BackIcon,
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
    setPage(0); 
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

  const ventasPaginadas = detallesVenta.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // VISTA 1: RANKING
  if (!vendedorSeleccionado) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2 }}>
              RANKING_VENDEDORES
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#666" }}>
              CONTROL DE DESEMPEÑO COMERCIAL // DATA_LOG
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder="FILTRAR_USUARIO..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#000' }} /></InputAdornment>,
              sx: { borderRadius: 0, border: '2px solid #000', fontWeight: 800, bgcolor: '#fff' }
            }}
            sx={{ width: { xs: '100%', md: 320 }, mt: { xs: 2, md: 0 } }}
          />
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ border: "2px solid #000", borderRadius: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#000' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 900 }}>POS</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 900 }}>OPERADOR</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 900 }}>TRANSACCIONES</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 900 }}>TOTAL_ACUMULADO</TableCell>
                <TableCell align="right" sx={{ color: '#fff', fontWeight: 900 }}>LOGS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: '#fff' }}>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><CircularProgress color="inherit" /></TableCell></TableRow>
              ) : (
                ranking
                  .filter(v => v.nombre_vendedor.toLowerCase().includes(filter.toLowerCase()))
                  .map((v, index) => (
                  <TableRow key={v.id_usuario} hover sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '1.2rem' }}>
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: index === 0 ? '#000' : '#eee', 
                          color: index === 0 ? '#fff' : '#000', 
                          fontWeight: 900,
                          borderRadius: 0,
                          border: '1px solid #000'
                        }}>
                          {v.nombre_vendedor.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                          {v.nombre_vendedor}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {v.total_ventas} OPS
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 900, color: '#000', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        ${parseFloat(v.monto_total_acumulado).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={() => verDetalles(v)}
                        sx={{ border: '1px solid #000', borderRadius: 0, "&:hover": { bgcolor: '#000', color: '#fff' } }}
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

  // VISTA 2: DETALLE
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Button 
        startIcon={<BackIcon />} 
        onClick={() => setVendedorSeleccionado(null)}
        sx={{ mb: 3, fontWeight: 900, color: '#000', borderRadius: 0, border: '2px solid #000', '&:hover': { bgcolor: '#000', color: '#fff' } }}
      >
        VOLVER_AL_RANKING
      </Button>

      <Grid container spacing={3}>
        {/* Panel Izquierdo: Resumen */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ borderRadius: 0, border: '2px solid #000', bgcolor: '#fff' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#000', borderRadius: 0, border: '2px solid #000' }}>
                <PersonIcon sx={{ fontSize: 40, color: '#fff' }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
                {vendedorSeleccionado.nombre_vendedor}
              </Typography>
              <Divider sx={{ my: 3, borderBottomWidth: 2, borderColor: '#000' }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#666' }}>RECAUDACIÓN_TOTAL</Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#000', mb: 2, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  ${parseFloat(vendedorSeleccionado.monto_total_acumulado).toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#666' }}>OPERACIONES_EXITOSAS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{vendedorSeleccionado.total_ventas} ITEMS</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel Derecho: Historial */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon /> HISTORIAL_TRANSACCIONES
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {ventasPaginadas.map((venta) => (
              <Paper key={venta.factura} elevation={0} sx={{ borderRadius: 0, border: '2px solid #000', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: '#000', p: 1.5, display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>TICKET_ID: #{venta.factura}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                    {new Date(venta.fecha).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: '#fff' }}>
                  <Typography variant="body2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>CLIENTE: {venta.cliente}</Typography>
                  <Box sx={{ p: 1.5, border: '1px dashed #ccc', mb: 2 }}>
                    {venta.items.map((item: any, i: number) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.producto.toUpperCase()} (x{item.cantidad})</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>${item.subtotal.toFixed(2)}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#000', fontFamily: 'monospace' }}>
                      TOTAL_TICKET: ${venta.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          <TablePagination
            component="div"
            count={detallesVenta.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="LOGS_PAG:"
            sx={{ 
              bgcolor: '#fff', 
              border: '2px solid #000', 
              borderRadius: 0,
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontWeight: 900 }
            }}
          />
        </Grid>
      </Grid>
      
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="inherit" thickness={6} />
        </Box>
      )}
    </Box>
  );
}