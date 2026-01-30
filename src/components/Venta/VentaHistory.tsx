import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination, 
  Chip, CircularProgress, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent        
} from "@mui/material";
import { 
  VisibilityRounded as ViewIcon, 
  ReceiptLongRounded as HistoryIcon,
  CloseRounded as CloseIcon 
} from "@mui/icons-material";

import { listarMisVentas } from "../../services/ventaService";
import { useAuth } from "../../context/AuthContext"; 
import type { VentaResponse } from "../../types/venta.types";

export default function VentaHistory() {
  const { user } = useAuth();
  const [ventas, setVentas] = useState<VentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal de Detalles
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<VentaResponse | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      // Llamada al servicio con paginación
      const res = await listarMisVentas(page + 1, rowsPerPage);
      setVentas(res.data);
      setTotalDocs(res.total);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) cargarVentas();
  }, [page, rowsPerPage, user]);

  // Función para abrir detalles
  const handleOpenDetail = (venta: VentaResponse) => {
    setSelectedVenta(venta);
    setOpenDetail(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Cabecera de la Sección */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <HistoryIcon sx={{ fontSize: 40, color: '#3a7afe' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Mis <span style={{ color: "#3a7afe" }}>Ventas</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consulta el detalle de tus transacciones realizadas.
          </Typography>
        </Box>
      </Box>

      {/* Tabla de Historial */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Método</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : (
                ventas.map((v) => (
                  <TableRow key={v.id_venta} hover>
                    <TableCell>{new Date(v.fechaVenta).toLocaleString()}</TableCell>
                    {/* Muestra nombre_completo enviado desde el backend actualizado */}
                    <TableCell sx={{ fontWeight: 500 }}>
                      {v.cliente?.nombre_completo || 'Consumidor Final'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={v.metodoPago} 
                        size="small" 
                        variant="outlined" 
                        color="primary" 
                        sx={{ textTransform: 'capitalize', fontWeight: 600 }} 
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                      ${Number(v.total).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalles de productos">
                        <IconButton color="info" onClick={() => handleOpenDetail(v)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination 
          component="div" 
          count={totalDocs} 
          page={page} 
          onPageChange={(_, p) => setPage(p)} 
          rowsPerPage={rowsPerPage} 
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} 
        />
      </Paper>

      {/* --- MODAL DE DETALLES --- */}
      <Dialog 
        open={openDetail} 
        onClose={() => setOpenDetail(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
          Detalle de Venta #{selectedVenta?.id_venta.toString().slice(-5)}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Cliente: <b>{selectedVenta?.cliente?.nombre_completo || 'Consumidor Final'}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fecha: {selectedVenta && new Date(selectedVenta.fechaVenta).toLocaleString()}
            </Typography>
          </Box>
          
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Cant.</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Precio</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedVenta?.ventasDetalles?.map((det) => (
                  <TableRow key={det.id_ventaDetalle}>
                    <TableCell>{det.producto?.nombre}</TableCell>
                    <TableCell align="center">{det.cantidad}</TableCell>
                    <TableCell align="right">${Number(det.precio_unitario).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      ${(det.cantidad * Number(det.precio_unitario)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#2e7d32' }}>
              TOTAL: ${Number(selectedVenta?.total).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}