import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, CircularProgress,
  TablePagination, Chip, Stack 
} from "@mui/material";
import type { VentaResponse } from "../../types/venta.types";
import { listarMisVentas } from "../../services/ventaService";


export default function MisVentasCajero() {
  const [ventas, setVentas] = useState<VentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDocs, setTotalDocs] = useState(0);
  
  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      // Llamamos a la función que usa el Token (sin pasar ID)
      const response = await listarMisVentas(page + 1, rowsPerPage);
      setVentas(response.data);
      setTotalDocs(response.total);
    } catch (error) {
      console.error("Error al cargar tus ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, [page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* CABECERA ESTILO BRUTALISTA (Como tu ranking) */}
      <Stack sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2 }}>
          MIS_OPERACIONES
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 800, color: "#666" }}>
          HISTORIAL PERSONAL DE VENTAS // ID_SESSION_LOG
        </Typography>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ border: "2px solid #000", borderRadius: 0 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#000" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 900 }}>FECHA</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 900 }}>CLIENTE</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 900 }}>MÉTODO</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 900 }} align="right">TOTAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ bgcolor: "#fff" }}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <CircularProgress color="inherit" />
                </TableCell>
              </TableRow>
            ) : ventas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, fontWeight: 800 }}>
                  NO SE REGISTRAN VENTAS EN ESTE PERIODO
                </TableCell>
              </TableRow>
            ) : (
              ventas.map((venta) => (
                <TableRow key={venta.id_venta} hover>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    {new Date(venta.fechaVenta).toLocaleDateString()} <br/>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                       {new Date(venta.fechaVenta).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>
                      {venta.cliente?.nombre_completo || 'CONSUMIDOR FINAL'}
                    </Typography>
                    <Typography variant="caption">{venta.cliente?.cedula || 'S/N'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={venta.metodoPago.toUpperCase()} 
                      sx={{ borderRadius: 0, fontWeight: 900, border: '1px solid #000', bgcolor: '#eee' }} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: 'monospace' }}>
                      ${venta.total.toFixed(2)}
                    </Typography>
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
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="LÍNEAS:"
        sx={{ 
          bgcolor: '#fff', 
          border: '2px solid #000', 
          borderTop: 0, 
          borderRadius: 0,
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontWeight: 900 }
        }}
      />
    </Box>
  );
}