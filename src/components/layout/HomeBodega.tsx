import { Box, Typography, Grid as Grid, Paper, Button } from "@mui/material";
import { 
  InventoryRounded as InventoryIcon, 
  ErrorOutlineRounded as AlertIcon, 
  AddBoxRounded as AddIcon,
  CategoryRounded as CategoryIcon 
} from "@mui/icons-material";
import StatCardBodega from "../dashboard/bodega/StatCardBodega";// Componente simple de tarjeta

export default function HomeBodega() {
  return (
    <Box sx={{ p: 4 }}>
      {/* Saludo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b" }}>
          Panel de <span style={{ color: "#3a7afe" }}>Logística</span>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Control de inventario y gestión de atributos.
        </Typography>
      </Box>

      {/* Fila 1: KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCardBodega 
            title="Stock Total" 
            value="1,240" 
            icon={<InventoryIcon color="primary" />} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCardBodega 
            title="Stock Crítico" 
            value="12" 
            icon={<AlertIcon sx={{ color: "#ef4444" }} />} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCardBodega 
            title="Categorías" 
            value="8" 
            icon={<CategoryIcon sx={{ color: "#8b5cf6" }} />} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ 
            height: '100%', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', bgcolor: '#3a7afe', borderRadius: 4,
            cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: '#2563eb' }
          }}>
             <Button variant="contained" startIcon={<AddIcon />} sx={{ boxShadow: 'none' }}>
               Nueva Entrada
             </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Fila 2: Lo más urgente */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '400px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Movimientos Recientes
            </Typography>
            {/* Aquí podrías poner una lista de las últimas categorías o productos creados */}
            <Typography color="text.secondary">Próximamente: Historial de entradas...</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '400px', border: '2px dashed #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recordatorio
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              * Verificar que las tallas de MongoDB coincidan con las etiquetas físicas.
            </Typography>
            <Typography variant="body2">
              * Reportar productos dañados al administrador.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}