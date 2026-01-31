import { useState } from 'react';
import { 
  Box, Paper, Typography, Button, Grid, Stack, 
  TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Card,
  CircularProgress, Alert} from '@mui/material';
import { 
  FilterListRounded as FilterIcon,
  FilePresentRounded as ExcelIcon,
  ReceiptLongRounded as DetailIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

// IMPORTACIÓN DEL SERVICIO CONECTADO AL BACKEND
import { getReporteVentas } from '../../services/ventaService'; 

// Tipado detallado para la auditoría
interface ReporteData {
  id: string;
  fecha: string;
  vendedor: string;
  cliente: string;
  identificacion: string;
  productos: string;
  metodo: string;
  subtotal: number;
  iva: number;
  total: number;
}

export default function Reportes() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datos, setDatos] = useState<ReporteData[]>([]);

  const handleGenerarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("SELECCIONE UN RANGO DE FECHAS PARA CONTINUAR.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getReporteVentas(fechaInicio, fechaFin);
      
      // Mapeo exhaustivo de la respuesta del backend
      const datosFormateados = data.map((v: any) => ({
        id: v.id || v.id_venta,
        fecha: new Date(v.fecha).toLocaleString(),
        vendedor: v.vendedor || 'SISTEMA',
        cliente: v.cliente || 'CONSUMIDOR FINAL',
        identificacion: v.identificacion || '9999999999',
        productos: v.productos || 'SIN DETALLE',
        metodo: v.metodo || 'EFECTIVO',
        subtotal: Number(v.subtotal || 0),
        iva: Number(v.iva || 0),
        total: Number(v.total || v.monto)
      }));

      setDatos(datosFormateados);
    } catch (err: any) {
      setError(err.response?.data?.message || "ERROR DE CONEXIÓN CON EL SERVIDOR");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (datos.length === 0) return;
    
    // Preparamos los datos para que el Excel sea legible
    const dataParaExcel = datos.map(d => ({
        'ID_TRANSACCION': d.id,
        'FECHA_HORA': d.fecha,
        'VENDEDOR': d.vendedor,
        'CLIENTE': d.cliente,
        'ID_CLIENTE': d.identificacion,
        'DETALLE_PRODUCTOS': d.productos,
        'METODO_PAGO': d.metodo,
        'SUBTOTAL': d.subtotal,
        'IVA_15': d.iva,
        'TOTAL_USD': d.total
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AUDITORIA_VENTAS");
    
    // Ajuste de columnas para el Excel
    worksheet['!cols'] = [{wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:15}, {wch:40}, {wch:15}, {wch:10}, {wch:10}, {wch:10}];
    
    XLSX.writeFile(workbook, `REPORTE_DETALLADO_${fechaInicio}_A_${fechaFin}.xlsx`);
  };

  const granTotal = datos.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      
      {/* HEADER ESTILO BRUTALISTA */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ bgcolor: '#000', p: 1.5, color: '#fff', display: 'flex' }}>
            <DetailIcon sx={{ fontSize: 40 }} />
        </Box>
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
                AUDITORÍA_MAESTRA
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>
                Reporte Detallado de Transacciones y Flujo de Inventario
            </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 0, border: '3px solid #000', fontWeight: 900 }}>
          {error.toUpperCase()}
        </Alert>
      )}

      {/* FILTROS */}
      <Paper elevation={0} sx={{ p: 3, border: '4px solid #000', borderRadius: 0, mb: 4, bgcolor: '#f5f5f5' }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>FECHA_DESDE</Typography>
            <TextField 
              fullWidth type="date" value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, border: '2px solid #000', bgcolor: '#fff' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>FECHA_HASTA</Typography>
            <TextField 
              fullWidth type="date" value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, border: '2px solid #000', bgcolor: '#fff' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button 
              fullWidth variant="contained" onClick={handleGenerarReporte}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FilterIcon />}
              sx={{ 
                bgcolor: '#000', py: 2, borderRadius: 0, fontWeight: 900, fontSize: '1rem',
                '&:hover': { bgcolor: '#333' }
              }}
            >
              {loading ? 'PROCESANDO...' : 'GENERAR ANALÍTICA'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {datos.length > 0 && (
        <>
          {/* DASHBOARD DE RESULTADOS */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card elevation={0} sx={{ p: 3, borderRadius: 0, border: '4px solid #000', bgcolor: '#000', color: '#fff' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.8 }}>RECAUDACIÓN TOTAL BRUTA</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                    ${granTotal.toFixed(2)}
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button 
                fullWidth onClick={handleExportExcel}
                startIcon={<ExcelIcon sx={{ fontSize: 40 }} />}
                sx={{ 
                    height: '100%', border: '4px solid #000', borderRadius: 0, 
                    color: '#000', fontWeight: 900, fontSize: '1.2rem',
                    bgcolor: '#fff', '&:hover': { bgcolor: '#e0e0e0' }
                }}
              >
                EXPORTAR AUDITORÍA (.XLSX)
              </Button>
            </Grid>
          </Grid>

          {/* TABLA DETALLADA */}
          <TableContainer component={Paper} sx={{ borderRadius: 0, border: '4px solid #000', boxShadow: 'none', mb: 4 }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead sx={{ bgcolor: '#000' }}>
                <TableRow>
                  {['FECHA_HORA', 'VENDEDOR / CLIENTE', 'DETALLE_PRODUCTOS', 'MÉTODO', 'TOTAL_USD'].map((head) => (
                    <TableCell key={head} sx={{ color: '#fff', fontWeight: 900, fontSize: '0.8rem' }}>
                        {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {datos.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f0f0f0' }, borderBottom: '2px solid #000' }}>
                    <TableCell sx={{ fontWeight: 800, fontSize: '0.85rem' }}>{row.fecha}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{row.vendedor}</Typography>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>C: {row.cliente}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1, display: 'block' }}>
                        {row.productos}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ px: 1, bgcolor: '#000', color: '#fff', fontWeight: 900 }}>
                        {row.metodo}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, fontSize: '1.1rem' }}>
                        ${row.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {datos.length === 0 && !loading && (
        <Box sx={{ p: 10, textAlign: 'center', border: '4px dashed #000' }}>
            <Typography sx={{ fontWeight: 900, color: '#000' }}>ESPERANDO RANGO DE FECHAS PARA ANÁLISIS...</Typography>
        </Box>
      )}
    </Box>
  );
}