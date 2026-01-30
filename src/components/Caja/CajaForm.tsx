import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, Alert, CircularProgress, InputAdornment } from "@mui/material";
import { AccountBalanceWalletRounded as WalletIcon, LockOpenRounded as OpenIcon, AttachMoneyRounded as MoneyIcon } from "@mui/icons-material";
import { abrirCaja } from "../../services/cajaService";

export default function CajaForm() {
  const [monto, setMonto] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir a número antes de enviar
    const montoNum = Number(parseFloat(monto).toFixed(2));
    
    if (isNaN(montoNum) || montoNum < 0) {
      setStatus({ type: "error", msg: "Ingresa un monto válido." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // El backend extrae el id_usuario del JWT, enviamos el monto_apertura
      const res = await abrirCaja({ 
        monto_apertura: montoNum,
        id_usuario: "" 
      });

      if (res) {
        setStatus({ 
          type: "success", 
          msg: "¡Caja abierta correctamente! Ya puedes registrar ventas." 
        });
        setMonto(""); 
      }
    } catch (error: any) {
      // Capturamos el mensaje: "Ya tienes una sesión de caja activa" o errores de validación
      const backendError = error.response?.data?.message;
      const errorMsg = Array.isArray(backendError) ? backendError[0] : backendError;
      
      setStatus({ 
        type: "error", 
        msg: errorMsg || "Error al intentar abrir la caja." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 6 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "#fff" }}>
        <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ bgcolor: "#eff6ff", p: 2, borderRadius: 4, color: "#2563eb", display: "flex" }}>
            <WalletIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Apertura de Caja
          </Typography>
        </Stack>

        {status && (
          <Alert severity={status.type} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setStatus(null)}>
            {status.msg}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Monto Inicial en Efectivo"
            fullWidth
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !monto}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <OpenIcon />}
            sx={{ py: 1.8, borderRadius: 3, bgcolor: "#0f172a", fontWeight: "bold", textTransform: "none" }}
          >
            {loading ? "Procesando..." : "Confirmar Apertura"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}