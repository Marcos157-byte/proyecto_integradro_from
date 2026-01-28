import  { useEffect, useState } from "react";
import { 
  Box, Grid, Typography, Button, CircularProgress, Paper, alpha, Stack 
} from "@mui/material";
// ✅ IMPORTACIONES CORREGIDAS: Soluciona "Uncaught ReferenceError: CashIcon is not defined"
import { 
  PointOfSaleRounded as PointOfSaleIcon, 
  AccountBalanceWalletRounded as CashIcon,
  StarRounded as StarIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// ✅ SERVICIOS: Sincronizados con las rutas del Backend para evitar el Error 404
import { getResumenDashboard, getTopProductosVendedor } from "../../services/ventaService";

export default function HomeVentas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Inicialización de estados segura
  const [datosResumen, setDatosResumen] = useState({ totalCaja: 0, conteoVentas: 0 });
  const [topProductos, setTopProductos] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // 1. ✅ EXTRACCIÓN DE ID: Recupera el objeto completo guardado en el AuthContext
        const usuarioStorage = localStorage.getItem('usuario');
        const userObj = usuarioStorage ? JSON.parse(usuarioStorage) : null;
        
        // 2. ✅ VALIDACIÓN CLAVE: Buscamos 'id_usuario' que es el nombre en tu BD
        const id_usuario = userObj?.id_usuario;

        if (!id_usuario) {
          // Si ves este error, es porque el login no guardó correctamente al 'usuario'
          console.error("No se encontró el ID del usuario en storage"); 
          setLoading(false);
          return;
        }

        // 3. ✅ LLAMADAS SINCRONIZADAS: Pasa el ID real al backend
        const [resumen, top] = await Promise.all([
          getResumenDashboard(id_usuario),
          getTopProductosVendedor(id_usuario, 'dia')
        ]);
        
        // Seteo de datos corregido para actualizar el "$0.00"
        setDatosResumen(resumen || { totalCaja: 0, conteoVentas: 0 });
        setTopProductos(Array.isArray(top) ? top : []);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#2B3674", mb: 4 }}>
        Mi Resumen de Turno
      </Typography>
      
      <Grid container spacing={3}>
        {/* Card de Caja: Ahora muestra el total real del vendedor logueado */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid #E0E5F2", display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ bgcolor: alpha("#05CD99", 0.1), p: 2, borderRadius: "15px" }}>
              <CashIcon sx={{ color: "#05CD99", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "#A3AED0", fontSize: "0.85rem", fontWeight: 700 }}>TU CAJA HOY</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#2B3674" }}>
                ${Number(datosResumen.totalCaja || 0).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Card de Top Productos: Muestra el nombre y cantidad del backend */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid #E0E5F2" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <StarIcon sx={{ color: "#FFB800" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#2B3674" }}>Mis Más Vendidos</Typography>
            </Stack>
            {topProductos.length > 0 ? (
              topProductos.map((p, i) => (
                <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #F4F7FE" }}>
                  <Typography sx={{ fontWeight: 600, color: "#2B3674" }}>
                    {p.nombre_producto || p.producto}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: "#4318FF" }}>
                    {p.total_vendido || p.cantidadVendida} uds
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">Aún no has realizado ventas hoy.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={() => navigate("/ventas/nueva")}
            sx={{ 
              py: 3, borderRadius: "20px", fontWeight: 900, fontSize: "1.2rem",
              background: "linear-gradient(135deg, #4318FF 0%, #5E37FF 100%)",
              textTransform: "none",
              boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)"
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