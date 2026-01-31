import { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, Alert, Skeleton, alpha } from "@mui/material";
import { 
  WarningAmberRounded as WarningIcon, 
  DangerousRounded as CriticalIcon,
  SensorsRounded as LiveIcon 
} from "@mui/icons-material";
import type { DashboardStats, StockAlerta } from "../../types/dashboardAdmin.types";
import { getDashboardStats, getStockAlerts } from "../../services/productoService";
import StatsCards from "../dashboard/StatsCards";
import TopProductsChart from "../dashboard/TopProductsChart";
import StockAlertsTable from "../dashboard/StockAlertsTable";

export default function HomeAdmin() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<StockAlerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, alertsData] = await Promise.all([
          getDashboardStats(),
          getStockAlerts()
        ]);
        setStats(statsData);
        setAlerts(alertsData);
      } catch (err: any) {
        setError(err.message || "Error de conexión con el servidor central");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (error) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ borderRadius: 0, fontWeight: 900, bgcolor: "#ff0000", border: '4px solid #000' }}
        >
          [SYSTEM_FAILURE]: {error}. INICIANDO PROTOCOLO DE RECUERACIÓN.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        
        {/* CABECERA CON ESTILO DE TERMINAL */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ borderLeft: '10px solid #000', pl: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2, lineHeight: 0.8 }}>
              ADMIN_DASHBOARD
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", fontWeight: 800, letterSpacing: 2 }}>
              ESTADO_OPERATIVO // DENIM_LAB_OS_V2.6
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#000', color: '#fff', px: 2, py: 0.5 }}>
            <LiveIcon sx={{ fontSize: 18, color: '#00ff00' }} />
            <Typography sx={{ fontSize: '12px', fontWeight: 900, fontFamily: 'monospace' }}>LIVE_SYSTEM_ACTIVE</Typography>
          </Box>
        </Box>

        {/* KPIs SECCIÓN */}
        <Box sx={{ mb: 6 }}>
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12, sm: 3 }} key={i}>
                  <Skeleton variant="rectangular" height={140} sx={{ bgcolor: alpha('#000', 0.1) }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            stats && <StatsCards stats={stats} />
          )}
        </Box>

        <Grid container spacing={4}>
          {/* ANALÍTICA DE VENTAS */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ border: '4px solid #000', height: '100%' }}>
              <Box sx={{ bgcolor: '#000', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '0.85rem', letterSpacing: 1 }}>
                  ANÁLISIS_FLUJO_VENTAS
                </Typography>
                <Box sx={{ width: 12, height: 12, bgcolor: '#3a7afe' }} />
              </Box>
              <Box sx={{ p: 2 }}>
                {loading ? <Skeleton variant="rectangular" height={400} /> : stats && <TopProductsChart data={stats.masVendidos} />}
              </Box>
            </Box>
          </Grid>

          {/* STOCK CRÍTICO - DISEÑO DE EMERGENCIA */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ 
              border: `4px solid ${alerts.length > 0 ? '#ff0000' : '#000'}`, 
              height: '100%',
              boxShadow: alerts.length > 0 ? '8px 8px 0px rgba(255, 0, 0, 0.2)' : '8px 8px 0px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}>
              <Box sx={{ 
                bgcolor: alerts.length > 0 ? '#ff0000' : '#000', 
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}>
                {alerts.length > 0 ? <CriticalIcon sx={{ color: '#fff' }} /> : <WarningIcon sx={{ color: '#fff' }} />}
                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '0.85rem', letterSpacing: 1.5 }}>
                  {alerts.length > 0 ? "ALERTAS_DE_STOCK_CRÍTICO" : "SISTEMA_DE_INVENTARIO_ESTABLE"}
                </Typography>
                <Typography sx={{ ml: 'auto', bgcolor: '#fff', color: alerts.length > 0 ? '#ff0000' : '#000', px: 1, fontWeight: 900, fontSize: '0.8rem' }}>
                  {alerts.length}
                </Typography>
              </Box>

              <Box sx={{ p: 2 }}>
                {loading ? (
                  <Skeleton variant="rectangular" height={400} />
                ) : alerts.length > 0 ? (
                  <StockAlertsTable alerts={alerts} />
                ) : (
                  <Box sx={{ py: 10, textAlign: 'center', opacity: 0.5 }}>
                    <WarningIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography sx={{ fontWeight: 800, fontFamily: 'monospace' }}>TODO_EN_ORDEN. SIN_ALERTAS_PENDIENTES.</Typography>
                  </Box>
                )}
              </Box>
              
              {alerts.length > 0 && (
                <Box sx={{ bgcolor: alpha('#ff0000', 0.05), p: 1, borderTop: '2px solid #ff0000' }}>
                  <Typography sx={{ color: '#ff0000', fontSize: '10px', fontWeight: 900, textAlign: 'center', animation: 'blink 1.5s infinite' }}>
                    ATENCIÓN: REPOSICIÓN INMEDIATA REQUERIDA
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* FOOTER */}
        <Box sx={{ mt: 8, pt: 2, borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: 'monospace', color: '#bbb', fontWeight: 800, fontSize: '10px' }}>
              ADMIN_ACCESS_LEVEL: ROOT // ENCRYPTION: AES-256
            </Typography>
            <Typography sx={{ fontFamily: 'monospace', color: '#bbb', fontWeight: 800, fontSize: '10px' }}>
              PÁGINA GENERADA: {new Date().toLocaleTimeString()}
            </Typography>
        </Box>
      </Container>

      {/* Animación de parpadeo para alertas */}
      <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
}