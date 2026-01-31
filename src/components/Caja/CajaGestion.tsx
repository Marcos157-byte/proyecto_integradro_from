import { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Grid, 
  Card, Divider, Alert, CircularProgress, Stack, IconButton 
} from '@mui/material';
import { 
  LockOpenRounded as LockOpen, 
  RefreshRounded as RefreshIcon,
  PointOfSaleRounded as PosIcon,
  ReportProblemRounded as WarningIcon
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
      const response = await getEstadoCaja();
      setEstado(response.data); 
    } catch (err: any) {
      console.error("Error al cargar estado de caja");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // --- LÓGICA DE CONTROL DE INPUT ESTRICTO ---
  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Regex: Permite vacío, números y un punto. Bloquea letras y el signo "-"
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setMontoInput(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Bloqueo físico de teclas de dirección y símbolos negativos
    if (['ArrowUp', 'ArrowDown', '-', 'e', 'E', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const commonInputStyles = {
    mb: 3,
    '& .MuiOutlinedInput-root': { 
      borderRadius: 0, 
      border: '2px solid #000', 
      fontWeight: 900 
    },
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
    '& input[type=number]': {
      MozAppearance: 'textfield',
    },
  };

  const handleAbrir = async () => {
    // CORRECCIÓN: Permite 0 pero no campos vacíos o negativos
    if (montoInput === '' || Number(montoInput) < 0) {
      return setError("INGRESE UN MONTO DE APERTURA VÁLIDO (MÍNIMO 0).");
    }
    try {
      setLoading(true);
      setError(null);
      await abrirCaja(Number(montoInput));
      setMontoInput('');
      setResumenCierre(null); 
      await cargarDatos();
    } catch (err: any) {
      setError(err.response?.data?.message || "ERROR AL ABRIR CAJA");
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = async () => {
    // CORRECCIÓN: Permite 0 para cierres en cero, pero no negativos
    if (montoInput === '' || Number(montoInput) < 0) {
      return setError("INGRESE EL MONTO FÍSICO CONTADO (MÍNIMO 0).");
    }
    try {
      setLoading(true);
      setError(null);
      const res = await cerrarCaja(Number(montoInput));
      setResumenCierre(res.data.resumen); 
      setEstado(null); 
      setMontoInput('');
    } catch (err: any) {
      setError(err.response?.data?.message || "ERROR AL CERRAR CAJA");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !estado && !resumenCierre) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 2 }}>
        <CircularProgress color="inherit" thickness={6} />
        <Typography sx={{ fontWeight: 900, letterSpacing: 2 }}>CARGANDO ESTADO SISTEMA...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#000", letterSpacing: -2 }}>
                TERMINAL DE CAJA
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#666" }}>
                ESTADO ACTUAL: {estado ? 'OPERATIVO SISTEMA' : 'STANDBY LOCK'}
            </Typography>
        </Box>
        <IconButton 
            onClick={cargarDatos} 
            disabled={loading}
            sx={{ border: '2px solid #000', borderRadius: 0, color: '#000' }}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>

      {error && (
        <Alert 
            severity="error" 
            icon={<WarningIcon />}
            sx={{ mb: 3, borderRadius: 0, border: '2px solid #000', fontWeight: 800, bgcolor: '#fff', color: '#000' }}
        >
            {error.toUpperCase()}
        </Alert>
      )}

      {resumenCierre && !estado && (
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4, borderRadius: 0, p: 3, border: '4px solid #000',
            bgcolor: resumenCierre.diferencia < 0 ? '#fff' : '#000',
            color: resumenCierre.diferencia < 0 ? '#000' : '#fff'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
            CIERRE_EJECUTADO: {resumenCierre.resultado.toUpperCase()}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.7 }}>ESPERADO LOG</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>${Number(resumenCierre.total_esperado).toFixed(2)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.7 }}>FÍSICO REPORTADO</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>${Number(resumenCierre.contado_fisico).toFixed(2)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.7 }}>DIFERENCIA NETA</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'monospace', color: resumenCierre.diferencia < 0 ? '#f44336' : '#4caf50' }}>
                    ${Number(resumenCierre.diferencia).toFixed(2)}
                </Typography>
            </Grid>
          </Grid>
          <Button 
            onClick={() => setResumenCierre(null)}
            sx={{ mt: 3, fontWeight: 900, color: 'inherit', border: '1px solid', borderColor: 'inherit', borderRadius: 0 }}
          >
            ENTENDIDO / LIMPIAR PANTALLA
          </Button>
        </Paper>
      )}

      {!estado ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 0, border: '4px solid #000', bgcolor: '#fff' }}>
          <LockOpen sx={{ fontSize: 80, color: '#000', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>CAJA CERRADA</Typography>
          <Typography sx={{ fontWeight: 700, color: '#666', mb: 4 }}>
            SISTEMA BLOQUEADO. INGRESE EL MONTO BASE PARA INICIAR ACTIVIDADES.
          </Typography>
          
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <TextField
              fullWidth
              label="BASE_EFECTIVO_USD"
              type="text"
              value={montoInput}
              onChange={handleMontoChange}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              sx={commonInputStyles}
              InputProps={{ startAdornment: <Typography sx={{ mr: 1, fontWeight: 900 }}>$</Typography> }}
            />
            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              onClick={handleAbrir}
              disabled={loading}
              sx={{ py: 2, borderRadius: 0, fontWeight: 900, bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
            >
              {loading ? 'PROCESANDO...' : 'DESBLOQUEAR CAJA Y TURNO'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ p: 3, borderRadius: 0, border: '2px solid #000', bgcolor: '#fff', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#666' }}>MONTO APERTURA</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                ${Number(estado.monto_apertura).toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ p: 3, borderRadius: 0, border: '2px solid #000', bgcolor: '#fff', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#666' }}>VENTAS REGISTRADAS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                ${Number(estado.ventas_efectivo).toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ p: 3, borderRadius: 0, border: '2px solid #000', bgcolor: '#000', color: '#fff', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.7 }}>TOTAL ESPERADO</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                ${Number(estado.monto_esperado).toFixed(2)}
              </Typography>
            </Card>
          </Grid>

          <Grid size={12}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 0, mt: 2, border: '2px solid #000', bgcolor: '#fff' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <PosIcon />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>PROCEDIMIENTO DE CIERRE</Typography>
              </Stack>
              <Divider sx={{ mb: 3, borderBottomWidth: 2, borderColor: '#000' }} />
              
              <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    <span style={{ backgroundColor: '#000', color: '#fff', padding: '2px 6px' }}>PASO 01:</span> REALICE EL CONTEO FÍSICO EN GAVETA.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    fullWidth
                    label="EFECTIVO_FÍSICO_USD"
                    type="text"
                    value={montoInput}
                    onChange={handleMontoChange}
                    onKeyDown={handleKeyDown}
                    sx={commonInputStyles}
                    InputProps={{ startAdornment: <Typography sx={{ mr: 1, fontWeight: 900 }}>$</Typography> }}
                  />
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    onClick={handleCerrar}
                    disabled={loading}
                    sx={{ py: 2, borderRadius: 0, fontWeight: 900, bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
                  >
                    {loading ? 'SINCRONIZANDO...' : 'EJECUTAR ARQUEO Y CIERRE'}
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