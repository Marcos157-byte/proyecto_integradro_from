import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, IconButton, Tooltip, CircularProgress, Alert, Divider,
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText
} from '@mui/material';
import { 
  Visibility as ViewIcon, 
  ReceiptLong as ReceiptIcon,
  Person as PersonIcon,
  ShoppingBag as BagIcon,
  Close as CloseIcon,
  Inventory as ProductIcon
} from '@mui/icons-material';
import { listarMisVentas } from '../../services/ventaService';

export default function VentaList() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el Modal de Detalle
  const [openDetail, setOpenDetail] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await listarMisVentas(page + 1, rowsPerPage);
      setVentas(result.data); 
      setTotalRecords(result.total);
    } catch (err: any) {
      setError("No se pudo cargar tu historial de ventas. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, [page, rowsPerPage]);

  // Funciones para manejar el Modal
  const handleOpenDetail = (venta: any) => {
    setVentaSeleccionada(venta);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setVentaSeleccionada(null);
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && ventas.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 10, gap: 2 }}>
        <CircularProgress size={50} thickness={4} sx={{ color: '#4f69f9' }} />
        <Typography color="textSecondary">Cargando tus ventas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        {/* Cabecera */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: '#eef2ff', borderRadius: 2 }}>
              <ReceiptIcon sx={{ color: '#4f69f9', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Mis Ventas del Turno
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Listado de transacciones realizadas por ti
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {error && <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>}

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>FECHA Y HORA</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>CLIENTE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>PRODUCTOS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>MÉTODO</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }} align="right">TOTAL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }} align="center">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id_venta} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date(venta.fechaVenta).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(venta.fechaVenta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                      <Typography variant="body2">{venta.cliente.nombre_completo}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BagIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography variant="body2" color="textSecondary">
                        {venta.ventasDetalles?.length || 0} items
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={venta.metodoPago} 
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        textTransform: 'uppercase',
                        bgcolor: venta.metodoPago.toLowerCase() === 'efectivo' ? '#dcfce7' : '#dbeafe',
                        color: venta.metodoPago.toLowerCase() === 'efectivo' ? '#15803d' : '#1d4ed8'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
                      ${Number(venta.total).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalle de productos">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDetail(venta)}
                        sx={{ color: '#6366f1', '&:hover': { bgcolor: '#eef2ff' } }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas:"
        />
      </Paper>

      {/* MODAL DE DETALLES INTEGRADO */}
      <Dialog 
        open={openDetail} 
        onClose={handleCloseDetail} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Detalle de la Venta</Typography>
          <IconButton onClick={handleCloseDetail} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {ventaSeleccionada && (
            <List disablePadding>
              {ventaSeleccionada.ventasDetalles?.map((det: any, idx: number) => (
                <ListItem key={idx} sx={{ px: 0, py: 1.5 }}>
                  <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                      <ProductIcon sx={{ color: '#64748b' }} />
                    </Box>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 700 }}>{det.producto.nombre}</Typography>}
                      secondary={`Cant: ${det.cantidad} x $${Number(det.precio_unitario).toFixed(2)}`}
                    />
                    <Typography sx={{ fontWeight: 800 }}>
                      ${(det.cantidad * Number(det.precio_unitario)).toFixed(2)}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                <Typography variant="body1" color="textSecondary">Monto Total:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#4f69f9' }}>
                  ${Number(ventaSeleccionada.total).toFixed(2)}
                </Typography>
              </Box>
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}