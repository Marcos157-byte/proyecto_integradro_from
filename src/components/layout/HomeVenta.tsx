import { useEffect, useState } from "react";
import { 
  Box, Grid, Typography, Button, CircularProgress, Paper, alpha, Stack 
} from "@mui/material";
import { 
  PointOfSaleRounded as PointOfSaleIcon, 
  AccountBalanceWalletRounded as CashIcon,
  StarRounded as StarIcon,
  TrendingUpRounded as TrendingIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getResumenDashboard } from "../../services/ventaService";
import { getTopProductos } from "../../services/productoService";
// Importamos las funciones actualizadas


export default function HomeVentas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [datosResumen, setDatosResumen] = useState({ totalCaja: 0, conteoVentas: 0 });
  const [topProductos, setTopProductos] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // ELIMINAMOS la lógica de extraer el id_usuario del localStorage,
        // ya que el Token en el header de Axios hace todo el trabajo.

        const [resumen, top] = await Promise.all([
          getResumenDashboard(), // Ya no recibe parámetros
          getTopProductos('dia')  // Solo recibe el periodo
        ]);
        
        setDatosResumen(resumen || { totalCaja: 0, conteoVentas: 0 });
        setTopProductos(Array.isArray(top) ? top : []);
      } catch (error: any) {
        console.error("Error cargando dashboard:", error);
        // Si el error es 401, podrías redirigir al login
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [navigate]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress sx={{ color: '#000' }} />
    </Box>
  );

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
        <Box sx={{ bgcolor: "#000", p: 1, display: 'flex' }}>
          <TrendingIcon sx={{ color: "#fff" }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#000", letterSpacing: -1 }}>
          RESUMEN_DE_TURNO
        </Typography>
      </Stack>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 5 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 0, 
              bgcolor: "#000", 
              color: "#fff",
              border: "1px solid #000",
              display: "flex", 
              flexDirection: "column",
              justifyContent: "center",
              height: "100%"
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <CashIcon sx={{ color: alpha("#fff", 0.5), fontSize: 20 }} />
                <Typography sx={{ color: alpha("#fff", 0.5), fontSize: "0.7rem", fontWeight: 900, letterSpacing: 2 }}>
                    EFECTIVO_EN_CAJA
                </Typography>
            </Stack>
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: -2 }}>
              ${Number(datosResumen.totalCaja || 0).toFixed(2)}
            </Typography>
            <Typography variant="caption" sx={{ color: alpha("#fff", 0.3), mt: 1, fontWeight: 700 }}>
                TURNO_ACTUAL_SINCRO // VENTAS: {datosResumen.conteoVentas}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 7 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 0, 
              border: "1px solid #e0e0e0", 
              bgcolor: "#fff",
              height: "100%"
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <StarIcon sx={{ color: "#000", fontSize: 18 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#000", letterSpacing: 1 }}>
                MÁS_VENDIDOS_HOY
              </Typography>
            </Stack>
            
            <Stack spacing={0.5}>
                {topProductos.length > 0 ? (
                topProductos.map((p, i) => (
                    <Box key={i} sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        py: 2, 
                        borderBottom: "1px solid #f0f0f0",
                        "&:last-child": { borderBottom: 0 }
                    }}>
                    <Typography sx={{ fontWeight: 800, color: "#000", fontSize: '0.85rem' }}>
                        {String(p.producto || "PRODUCTO").toUpperCase()}
                    </Typography>
                    <Typography sx={{ fontWeight: 400, color: "#666", fontFamily: 'monospace' }}>
                        [{p.cantidadVendida || 0} UDS]
                    </Typography>
                    </Box>
                ))
                ) : (
                <Typography variant="body2" sx={{ color: "#999", fontStyle: 'italic' }}>
                    Sin registros de venta en el periodo actual.
                </Typography>
                )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => navigate("/ventas/nueva")}
            sx={{ 
              py: 4, 
              borderRadius: 0, 
              fontWeight: 900, 
              fontSize: "1.1rem",
              bgcolor: "#000",
              color: "#fff",
              letterSpacing: 3,
              border: "2px solid #000",
              "&:hover": {
                bgcolor: "#fff",
                color: "#000",
              }
            }}
            startIcon={<PointOfSaleIcon />}
          >
            INICIAR NUEVA VENTA
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}