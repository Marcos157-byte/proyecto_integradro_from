import  { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Grid, 
  Card, Divider, Alert, CircularProgress, Stack, IconButton 
} from '@mui/material';
import { 
  LockOpen, 
  Lock, 
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getEstadoCaja, abrirCaja, cerrarCaja } from '../../services/cajaService';
import type { CajaActivaResumen } from '../../types/caja.types';

export default function CajaGestion() {
  const [estado, setEstado] = useState<CajaActivaResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [montoInput, setMontoInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [resumenCierre, setResumenCierre] = useState<any>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      // CORRECCIÓN: Accedemos a data.data por el SuccessResponseDto
      const response = await getEstadoCaja();
      setEstado(response.data); 
    } catch (err: any) {
      console.error("Error al cargar estado de caja");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleAbrir = async () => {
    if (montoInput === '' || Number(montoInput) < 0) {
      return setError("Por favor, ingrese un monto de apertura válido (0 o superior).");
    }
    try {
      setLoading(true);
      setError(null);
      await abrirCaja(Number(montoInput));
      setMontoInput('');
      setResumenCierre(null); 
      await cargarDatos();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al abrir caja");
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = async () => {
    if (montoInput === '' || Number(montoInput) < 0) {
      return setError("Ingrese el monto físico contado en caja.");
    }
    try {
      setLoading(true);
      setError(null);
      const res = await cerrarCaja(Number(montoInput));
      
      // CORRECCIÓN: Accedemos a res.data.resumen según la estructura del backend
      setResumenCierre(res.data.resumen); 
      setEstado(null); 
      setMontoInput('');
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cerrar caja");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !estado && !resumenCierre) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Control de Caja Diario
        </Typography>
        <IconButton onClick={cargarDatos} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* --- MODO: RESULTADO DEL CIERRE (ARQUEO) --- */}
      {resumenCierre && !estado && (
        <Alert 
          severity={resumenCierre.diferencia < 0 ? "warning" : "success"} 
          sx={{ mb: 4, borderRadius: 3, p: 2 }}
          onClose={() => setResumenCierre(null)}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Caja Cerrada: {resumenCierre.resultado}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography>Total Esperado: <strong>${Number(resumenCierre.total_esperado).toFixed(2)}</strong></Typography>
            <Typography>Contado Físico: <strong>${Number(resumenCierre.contado_fisico).toFixed(2)}</strong></Typography>
            <Typography>Diferencia: <strong style={{ color: resumenCierre.diferencia < 0 ? '#d32f2f' : '#2e7d32' }}>
              ${Number(resumenCierre.diferencia).toFixed(2)}
            </strong></Typography>
          </Box>
        </Alert>
      )}

      {!estado ? (
        /* --- MODO: CAJA CERRADA --- */
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <LockOpen sx={{ fontSize: 80, color: '#4f69f9', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Caja Cerrada</Typography>
          <Typography color="textSecondary" sx={{ mb: 4 }}>
            Inicie su turno ingresando el monto base de efectivo disponible.
          </Typography>
          
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <TextField
              fullWidth
              label="Monto Inicial en Efectivo"
              type="number"
              value={montoInput}
              onChange={(e) => setMontoInput(e.target.value)}
              placeholder="0.00"
              sx={{ mb: 3 }}
              InputProps={{ startAdornment: <Typography sx={{ mr: 1, fontWeight: 700 }}>$</Typography> }}
            />
            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              onClick={handleAbrir}
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, bgcolor: '#4f69f9', '&:hover': { bgcolor: '#3b54d9' } }}
            >
              {loading ? 'PROCESANDO...' : 'INICIAR TURNO'}
            </Button>
          </Box>
        </Paper>
      ) : (
        /* --- MODO: CAJA ABIERTA (RESUMEN EN TIEMPO REAL) --- */
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Typography color="textSecondary" variant="subtitle2" sx={{ fontWeight: 600 }}>APERTURA</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#64748b' }}>
                ${Number(estado.monto_apertura).toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#eef2ff', border: '1px solid #e0e7ff', textAlign: 'center' }}>
              <Typography color="#4f69f9" variant="subtitle2" sx={{ fontWeight: 600 }}>VENTAS (EFECTIVO)</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#4f69f9' }}>
                ${Number(estado.ventas_efectivo).toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f0fdf4', border: '1px solid #dcfce7', textAlign: 'center' }}>
              <Typography color="#166534" variant="subtitle2" sx={{ fontWeight: 600 }}>MONTO ESPERADO</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#166534' }}>
                ${Number(estado.monto_esperado).toFixed(2)}
              </Typography>
            </Card>
          </Grid>

          <Grid size={12}>
            <Paper sx={{ p: 4, borderRadius: 4, mt: 2, border: '1px solid #fee2e2' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Lock color="error" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Finalizar Turno y Arqueo</Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Typography variant="body1" sx={{ color: '#475569' }}>
                    <strong>Instrucción:</strong> Ingrese el total de efectivo físico que tiene actualmente en su caja. El sistema comparará este valor con el monto esperado.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    fullWidth
                    label="Efectivo Físico Contado"
                    type="number"
                    value={montoInput}
                    onChange={(e) => setMontoInput(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{ startAdornment: <Typography sx={{ mr: 1, fontWeight: 700 }}>$</Typography> }}
                  />
                  <Button 
                    variant="contained" 
                    color="error" 
                    fullWidth 
                    size="large"
                    onClick={handleCerrar}
                    disabled={loading}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                  >
                    {loading ? 'CERRANDO...' : 'CERRAR CAJA Y TURNO'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}