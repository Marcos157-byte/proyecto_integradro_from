import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  alpha,
  useTheme,
  Stack
} from "@mui/material";
import { TrendingUpRounded, Inventory2Rounded } from "@mui/icons-material";
import { getProductosMasVendidos } from "../../services/ventaService"; 
import type { ProductoMasVendidoDto } from "../../types/reportes.dto";

export default function VentaReportes() {
  const [productos, setProductos] = useState<ProductoMasVendidoDto[]>([]);
  const theme = useTheme();

  useEffect(() => {
    // Es buena práctica manejar posibles errores de la API
    getProductosMasVendidos("mes")
      .then((data) => setProductos(data || []))
      .catch(() => setProductos([]));
  }, []);

  return (
    <TableContainer 
      component={Paper} 
      elevation={0} 
      sx={{ 
        borderRadius: 3, 
        border: '1px solid #eee',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}
    >
      {/* Encabezado con Estilo Dashboard */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Inventory2Rounded sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight="800">
            Top Productos
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          ESTE MES
        </Typography>
      </Box>

      <Table size="small">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 1.5 }}>Producto</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Vendidos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((p, i) => (
            <TableRow 
              key={i} 
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 }, 
                '&:hover': { bgcolor: '#f1f5f9' },
                transition: '0.2s'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {/* SOLUCIÓN AL ERROR: Validamos que p.producto exista */}
                    {p.producto ? p.producto.charAt(0).toUpperCase() : "?"}
                  </Avatar>
                  <Typography variant="body2" fontWeight="600" sx={{ color: '#1e293b' }}>
                    {p.producto || "Sin nombre"}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  <Typography variant="body2" fontWeight="800" color="primary.main">
                    {p.cantidadVendida}
                  </Typography>
                  <TrendingUpRounded sx={{ fontSize: 16, color: '#4caf50' }} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Mensaje si no hay datos */}
      {productos.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">No hay ventas registradas este mes.</Typography>
        </Box>
      )}
    </TableContainer>
  );
}