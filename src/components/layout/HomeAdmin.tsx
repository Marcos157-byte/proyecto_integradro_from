import { useEffect, useState } from "react";
import { Container, Grid as Grid, Typography, Box, Alert, Skeleton } from "@mui/material";
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
        setError(null); // Limpiamos errores previos al reintentar

        // Ejecutamos ambas peticiones en paralelo
        const [statsData, alertsData] = await Promise.all([
          getDashboardStats(),
          getStockAlerts()
        ]);
        
        setStats(statsData);
        setAlerts(alertsData);
      } catch (err: any) {
        // Captura el mensaje de error de tu interceptor de Axios
        setError(err.message || "Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 1. Estado de Error: Ahora con un diseño más limpio
  if (error) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          {error}. Por favor, verifica tu base de datos y conexión.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Encabezado */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: -0.5 }}>
            Panel de <span style={{ color: "#3a7afe" }}>Control</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido, aquí tienes el estado actual de **Promax Jeans**.
          </Typography>
        </Box>

        {/* Zona 1: Tarjetas de estadísticas (KPIs) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {loading ? (
            [1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 4 }} key={i}>
                <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
              </Grid>
            ))
          ) : (
            stats && (
              <Grid size={{ xs: 12 }}>
                <StatsCards stats={stats} />
              </Grid>
            )
          )}
        </Grid>

        {/* Zona 2: Gráficos y Tablas de Alerta */}
        <Grid container spacing={3}>
          {/* Gráfico de Barras - 7 columnas en escritorio */}
          <Grid size={{ xs: 12, md: 7 }}>
            {loading ? (
              <Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} />
            ) : (
              stats && <TopProductsChart data={stats.masVendidos} />
            )}
          </Grid>

          {/* Tabla de Alertas - 5 columnas en escritorio */}
          <Grid size={{ xs: 12, md: 5 }}>
            {loading ? (
              <Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} />
            ) : (
              <StockAlertsTable alerts={alerts} />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}