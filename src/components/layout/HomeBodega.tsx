import { useEffect, useState } from "react";
import { 
   Grid, Paper, Typography, Box, Card, CardContent, 
  CircularProgress, Divider, Stack, Button, alpha 
} from "@mui/material";
import { 
  InventoryRounded as InventoryIcon, 
  WarningAmberRounded as WarningIcon,
  AttachMoneyRounded as MoneyIcon,
  TrendingUpRounded as TrendingIcon,
  RefreshRounded as RefreshIcon
} from "@mui/icons-material";

import { getDashboardStats, getStockAlerts } from "../../services/productoService";

export default function BodegaHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({ totalProductos: 0, valorInventario: 0 });
  const [alertas, setAlertas] = useState<any[]>([]);

  const cargarData = async () => {
    try {
      setLoading(true);
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
      <CircularProgress sx={{ color: '#000' }} size={50} thickness={5} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#fff', minHeight: '100vh' }}>
      
      {/* HEADER INDUSTRIAL */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        sx={{ mb: 5, borderBottom: '2px solid #000', pb: 2 }} 
        spacing={2}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#000', letterSpacing: -2 }}>
            CONTROL_DE_BODEGA
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, letterSpacing: 1 }}>
            SISTEMA DE GESTIÓN DE ACTIVOS E INVENTARIO // DENIM LAB
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />} 
          onClick={cargarData}
          sx={{ 
            borderRadius: 0, 
            bgcolor: '#000', 
            textTransform: 'uppercase', 
            fontWeight: 900,
            px: 3,
            "&:hover": { bgcolor: '#333' }
          }}
        >
          SINCRO_DATA
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {/* KPI 1: TOTAL STOCK - NEGRO */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 0, bgcolor: '#000', color: '#fff', border: '1px solid #000' }}>
            <CardContent sx={{ py: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <InventoryIcon sx={{ color: alpha('#fff', 0.5), fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 2, color: alpha('#fff', 0.5) }}>
                  TOTAL_PRODUCTOS
                </Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
                {stats?.totalProductos || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 2: VALOR MONETARIO - BLANCO BORDER */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 0, bgcolor: '#fff', border: '1px solid #000' }}>
            <CardContent sx={{ py: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <MoneyIcon sx={{ color: '#000', fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 2, color: '#000' }}>
                  VALOR_ALMACÉN
                </Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, color: '#000' }}>
                ${(stats?.valorInventario || 0).toLocaleString('es-CL')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 3: ALERTAS CRÍTICAS - ROJO INDUSTRIAL */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 0, bgcolor: alertas.length > 0 ? '#ff0000' : '#000', color: '#fff' }}>
            <CardContent sx={{ py: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <WarningIcon sx={{ color: alpha('#fff', 0.8), fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 2, color: alpha('#fff', 0.8) }}>
                  ALERTAS_CRÍTICAS
                </Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>{alertas.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* PANEL DE ALERTAS - ESTILO LISTADO TÉCNICO */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 4, borderRadius: 0, border: '1px solid #eee', bgcolor: '#fff' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 1 }}>
              <TrendingIcon fontSize="small" />  REABASTECIMIENTO INMEDIATO
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: '#000' }} />
            
            {alertas.length > 0 ? (
              <Stack spacing={1}>
                {alertas.map((item, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 2, 
                      border: '1px solid #000', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: (item.stock || item.stock_total) === 0 ? alpha('#ff0000', 0.05) : '#fff'
                    }}
                  >
                    <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '0.8rem' }}>
                            ITEM: {String(item.nombre).toUpperCase()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                            ESPECIFICACIÓN: TALLA {item.talla || 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 900, color: (item.stock || item.stock_total) === 0 ? '#ff0000' : '#000' }}>
                            STOCK: {item.stock || item.stock_total} UNITS
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#999' }}>
                            ESTADO: CRÍTICO
                        </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6, border: '2px dashed #eee' }}>
                <Typography variant="h6" sx={{ color: '#000', fontWeight: 900, letterSpacing: 1 }}>
                  NO_DISRUPTIONS_FOUND
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  EL INVENTARIO SE ENCUENTRA DENTRO DE LOS PARÁMETROS NOMINALES
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}