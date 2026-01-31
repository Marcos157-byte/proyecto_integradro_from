import { useEffect, useState } from "react";
import { Container,  Grid, Typography, Box, Alert, Skeleton, Stack, Divider, alpha } from "@mui/material";
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
          sx={{ borderRadius: 0, fontWeight: 900, bgcolor: "#ff0000" }}
        >
          [ERROR_SISTEMA]: {error}. REVISE LA CONEXIÓN A LA BASE DE DATOS.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        
        {/* ENCABEZADO INDUSTRIAL */}
        <Box sx={{ mb: 6, borderLeft: '8px solid #000', pl: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2, lineHeight: 1 }}>
            ADMIN_CONTROL_PANEL
          </Typography>
          <Typography variant="caption" sx={{ color: "#666", fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Estado Global de Operaciones // DENIM_LAB SYSTEM v2.6
          </Typography>
        </Box>

        {/* ZONA 1: KPIs (TARJETAS) */}
        <Box sx={{ mb: 6 }}>
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12, sm: 3 }} key={i}>
                  <Skeleton variant="rectangular" height={140} sx={{ bgcolor: alpha('#000', 0.05) }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            stats && <StatsCards stats={stats} />
          )}
        </Box>

        <Divider sx={{ mb: 6, borderColor: alpha('#000', 0.1) }} />

        {/* ZONA 2: ANALÍTICA Y ALERTAS */}
        <Grid container spacing={4}>
          {/* Gráfico de Ventas */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ border: '1px solid #eee', p: 1 }}>
                <Box sx={{ bgcolor: '#000', p: 1.5, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 900, letterSpacing: 1 }}>
                        PRODUCTOS_LÍDERES_VENTA
                    </Typography>
                </Box>
                {loading ? (
                <Skeleton variant="rectangular" height={400} />
                ) : (
                stats && <TopProductsChart data={stats.masVendidos} />
                )}
            </Box>
          </Grid>

          {/* Tabla de Alertas de Stock */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ border: '1px solid #eee', p: 1 }}>
                <Box sx={{ bgcolor: alerts.length > 0 ? '#ff0000' : '#000', p: 1.5, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 900, letterSpacing: 1 }}>
                        NOTIFICACIONES_CRÍTICAS [{alerts.length}]
                    </Typography>
                </Box>
                {loading ? (
                <Skeleton variant="rectangular" height={400} />
                ) : (
                <StockAlertsTable alerts={alerts} />
                )}
            </Box>
          </Grid>
        </Grid>

        {/* FOOTER TÉCNICO */}
        <Box sx={{ mt: 8, pt: 2, borderTop: '1px solid #eee', textAlign: 'right' }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#ccc', fontWeight: 700 }}>
                SISTEMA_OPERATIVO: DENIM_LAB_OS // ENCRYPTED_CONNECTION: TRUE // USUARIO: ADMIN_ROOT
            </Typography>
        </Box>

      </Container>
    </Box>
  );
}