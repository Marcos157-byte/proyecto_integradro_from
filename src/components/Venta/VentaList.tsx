import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, IconButton, Tooltip, CircularProgress, Alert, 
  Dialog, DialogTitle, DialogContent, List, ListItem, Stack
} from '@mui/material';
import { 
  Visibility as ViewIcon, 
  ReceiptLong as ReceiptIcon,
  Person as PersonIcon,
  Close as CloseIcon} from '@mui/icons-material';
import { listarMisVentas } from '../../services/ventaService';

export default function VentaList() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 10, gap: 2, minHeight: '60vh' }}>
        <CircularProgress size={40} thickness={5} sx={{ color: '#000' }} />
        <Typography sx={{ fontWeight: 900, letterSpacing: 2, color: '#000' }}>SINCRONIZANDO DATOS...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* HEADER INDUSTRIAL */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 4 }}>
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2, lineHeight: 1 }}>
                REGISTRO TURNOS
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#666", textTransform: 'uppercase' }}>
                HISTORIAL DE TRANSACCIONES // VISTA DE OPERADOR
            </Typography>
        </Box>
        <Box sx={{ bgcolor: "#000", p: 1.5, display: { xs: 'none', md: 'block' } }}>
            <ReceiptIcon sx={{ color: "#fff", fontSize: 35 }} />
        </Box>
      </Stack>

      {/* TABLA BRUTALISTA */}
      <Paper elevation={0} sx={{ border: "2px solid #000", borderRadius: 0, bgcolor: "#fff", overflow: 'hidden' }}>
        {error && <Alert severity="error" sx={{ borderRadius: 0, fontWeight: 700, borderBottom: '2px solid #000' }}>{error}</Alert>}

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#000' }}>
                <TableCell sx={{ fontWeight: 900, color: '#fff', border: 'none' }}>TIMESTAMP ID</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#fff', border: 'none' }}>CLIENTE RECEPTOR</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#fff', border: 'none' }}>ITEMS</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#fff', border: 'none' }}>METODO PAGO</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#fff', border: 'none' }} align="right">TOTAL FINAL</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#fff', border: 'none' }} align="center">ACCION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id_venta} hover sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                      {new Date(venta.fechaVenta).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#666' }}>
                      {new Date(venta.fechaVenta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: '#000' }} />
                      <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                        {venta.cliente.nombre_completo}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {venta.ventasDetalles?.length || 0} PCS
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={venta.metodoPago.toUpperCase()} 
                      size="small"
                      sx={{ 
                        fontWeight: 900, 
                        borderRadius: 0,
                        border: '1px solid #000',
                        fontSize: '0.65rem',
                        bgcolor: 'transparent'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 900, color: '#000', fontSize: '1.1rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      ${Number(venta.total).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="VER LOGS">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDetail(venta)}
                        sx={{ color: '#000', border: '1px solid #000', borderRadius: 0, '&:hover': { bgcolor: '#000', color: '#fff' } }}
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
          labelRowsPerPage="MOSTRAR:"
          sx={{ borderTop: '2px solid #000', bgcolor: '#f9f9f9', '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontWeight: 800 } }}
        />
      </Paper>

      {/* MODAL DETALLE TÉCNICO */}
      <Dialog 
        open={openDetail} 
        onClose={handleCloseDetail} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000' } }}
      >
        <DialogTitle sx={{ bgcolor: '#000', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Typography sx={{ fontWeight: 900, letterSpacing: 1 }}>TICKET_ID: #{ventaSeleccionada?.id_venta}</Typography>
          <IconButton onClick={handleCloseDetail} size="small" sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {ventaSeleccionada && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 2, p: 1.5, border: '1px dashed #000' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#666', display: 'block' }}>RECEPTOR:</Typography>
                <Typography sx={{ fontWeight: 900, textTransform: 'uppercase' }}>{ventaSeleccionada.cliente.nombre_completo}</Typography>
              </Box>

              <List disablePadding>
                {ventaSeleccionada.ventasDetalles?.map((det: any, idx: number) => (
                  <ListItem key={idx} sx={{ px: 0, py: 1, borderBottom: '1px solid #eee' }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                                {det.producto.nombre ? det.producto.nombre.toUpperCase() : 'UNKNOWN_ITEM'}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                {det.cantidad} UNIT x ${Number(det.precio_unitario).toFixed(2)}
                            </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                            ${(det.cantidad * Number(det.precio_unitario)).toFixed(2)}
                        </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: '#000', color: '#fff', textAlign: 'right' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: -0.5 }}>TOTAL DUE</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  ${Number(ventaSeleccionada.total).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}