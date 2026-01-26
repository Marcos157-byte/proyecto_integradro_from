import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Box
} from "@mui/material";
import type { StockAlerta } from "../../types/dashboardAdmin.types";

interface Props {
  // Definimos que alerts puede ser una lista o null/undefined inicialmente
  alerts?: StockAlerta[] | null; 
}

export default function StockAlertsTable({ alerts = [] }: Props) {
  // Al poner { alerts = [] } arriba, nos aseguramos de que si llega undefined, 
  // se convierta automáticamente en una lista vacía y no rompa el .length
  
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          ⚠️ Stock Crítico
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tallas que necesitan reposición inmediata
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, bgcolor: '#fff' }}>Modelo</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: '#fff' }} align="center">Talla</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: '#fff' }} align="right">Quedan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Usamos Optional Chaining (?.) por seguridad extra */}
            {alerts && alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No hay alertas de stock hoy. ¡Todo al día!
                </TableCell>
              </TableRow>
            ) : (
              alerts?.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{row.nombre}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.talla} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                      sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'error.main', fontWeight: 700 }}>
                    {row.stock}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}