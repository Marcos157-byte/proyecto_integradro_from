import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination, 
  Chip, CircularProgress, IconButton, 
  Dialog, DialogTitle, DialogContent, Stack      
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
  
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<VentaResponse | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  const cargarVentas = async () => {
    setLoading(true);
    try {
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

  const handleOpenDetail = (venta: VentaResponse) => {
    setSelectedVenta(venta);
    setOpenDetail(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 4 }}>
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2 }}>
                HISTORIAL_VENTAS
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#666" }}>
                TERMINAL: 01 // OPERADOR: {user?.nombre?.toUpperCase() || "SISTEMA"}
            </Typography>
        </Box>
        <Box sx={{ bgcolor: "#000", p: 1, display: { xs: 'none', md: 'block' } }}>
            <HistoryIcon sx={{ color: "#fff", fontSize: 40 }} />
        </Box>
      </Stack>

      {/* TABLA PRINCIPAL */}
      <Paper elevation={0} sx={{ border: "2px solid #000", borderRadius: 0, bgcolor: "#fff" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>FECHA_LOG</TableCell>
                <TableCell sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>CLIENTE</TableCell>
                <TableCell align="center" sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>METODO</TableCell>
                <TableCell align="right" sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>TOTAL_FINAL</TableCell>
                <TableCell align="center" sx={{ bgcolor: "#000", color: "#fff", fontWeight: 900 }}>LOG</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress color="inherit" size={30} />
                  </TableCell>
                </TableRow>
              ) : (
                ventas.map((v) => (
                  <TableRow key={v.id_venta} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {new Date(v.fechaVenta).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                      {v.cliente?.nombre_completo || 'C. FINAL'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={v.metodoPago.toUpperCase()} 
                        size="small" 
                        sx={{ borderRadius: 0, fontWeight: 900, border: '1px solid #000' }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {/* CORRECCIÓN: whiteSpace: 'nowrap' evita que el número se corte con puntos suspensivos */}
                      <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        ${Number(v.total).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleOpenDetail(v)}
                        sx={{ border: '1px solid #000', borderRadius: 0, "&:hover": { bgcolor: '#000', color: '#fff' } }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
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
          sx={{ borderTop: '2px solid #000' }}
        />
      </Paper>

      {/* MODAL DE DETALLES */}
      <Dialog 
        open={openDetail} 
        onClose={() => setOpenDetail(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000' } }}
      >
        <DialogTitle sx={{ bgcolor: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 900 }}>
          DATA_LOG: #{selectedVenta?.id_venta.toString().slice(-5).toUpperCase()}
          <IconButton onClick={() => setOpenDetail(false)} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mb: 3, p: 2, border: '1px dashed #000' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>CLIENTE</Typography>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>{selectedVenta?.cliente?.nombre_completo || 'CONSUMIDOR FINAL'}</Typography>
          </Box>
          
          <TableContainer sx={{ border: '1px solid #000' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 900 }}>PRODUCTO</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 900 }}>CANT</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900 }}>SUBTOTAL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedVenta?.ventasDetalles?.map((det) => (
                  <TableRow key={det.id_ventaDetalle}>
                    {/* CORRECCIÓN: Protección contra null en toUpperCase() */}
                    <TableCell sx={{ fontWeight: 700 }}>
                        {det.producto?.nombre ? det.producto.nombre.toUpperCase() : 'PRODUCTO'}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>{det.cantidad}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                      ${(det.cantidad * Number(det.precio_unitario)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* CORRECCIÓN FINAL: Total sin recortes y bien visible */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>TOTAL_DUE</Typography>
            <Typography 
                variant="h4" 
                sx={{ 
                    fontWeight: 900, 
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                    overflow: 'visible' 
                }}
            >
              ${Number(selectedVenta?.total || 0).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}