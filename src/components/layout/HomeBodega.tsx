import { useEffect, useState } from "react";
import { 
  Grid as Grid, Paper, Typography, Box, Alert, Card, CardContent, 
  CircularProgress, Divider, Stack, Button 
} from "@mui/material";
import { 
  InventoryRounded as InventoryIcon, 
  WarningAmberRounded as WarningIcon,
  AttachMoneyRounded as MoneyIcon,
  TrendingUpRounded as TrendingIcon,
  RefreshRounded as RefreshIcon
} from "@mui/icons-material";

// Importamos los servicios que configuramos en el frontend
import { getDashboardStats, getStockAlerts } from "../../services/productoService";

export default function BodegaHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({ totalProductos: 0, valorInventario: 0 });
  const [alertas, setAlertas] = useState<any[]>([]);

  // Función para cargar los datos de la API
  const cargarData = async () => {
    try {
      setLoading(true);
      // Ejecutamos ambas peticiones al mismo tiempo
      const [statsRes, alertasRes] = await Promise.all([
        getDashboardStats(),
        getStockAlerts()
      ]);
      
      setStats(statsRes);
      setAlertas(Array.isArray(alertasRes) ? alertasRes : []); 
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarData();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Cabecera del Dashboard */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
            Control de <span style={{ color: "#3a7afe" }}>Bodega</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Resumen en tiempo real del inventario y activos.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={cargarData}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Actualizar datos
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* KPI 1: Total Stock */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 4, borderLeft: '6px solid #3a7afe', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: 3 }}>
                <InventoryIcon sx={{ color: '#3a7afe', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stats?.totalProductos || 0}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">Productos Registrados</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 2: Valor Monetario */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 4, borderLeft: '6px solid #10b981', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#f0fdf4', p: 1.5, borderRadius: 3 }}>
                <MoneyIcon sx={{ color: '#10b981', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  ${(stats?.valorInventario || 0).toLocaleString('es-CL')}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">Valor Total en Almacén</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 3: Alertas Críticas */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 4, borderLeft: '6px solid #ef4444', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#fef2f2', p: 1.5, borderRadius: 3 }}>
                <WarningIcon sx={{ color: '#ef4444', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{alertas.length}</Typography>
                <Typography variant="subtitle2" color="text.secondary">Stock por Agotarse</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel Detallado de Alertas */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingIcon color="primary" /> Alertas de Reabastecimiento Inmediato
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {alertas.length > 0 ? (
              <Grid container spacing={2}>
                {alertas.map((item, index) => (
                  <Grid size={{ xs: 12 }} key={index}>
                    <Alert 
                      severity={ (item.stock || item.stock_total) === 0 ? "error" : "warning"}
                      variant="outlined"
                      sx={{ borderRadius: 3, bgcolor: (item.stock || item.stock_total) === 0 ? '#fff1f0' : '#fffbe6' }}
                    >
                      El producto <strong>{item.nombre}</strong> (Talla: {item.talla || 'N/A'}) 
                      está en nivel crítico: <strong>{item.stock || item.stock_total} unidades</strong>.
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: '#059669', fontWeight: 600 }}>
                  ✅ ¡Inventario saludable! No se han detectado productos con stock crítico.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}