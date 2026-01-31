import React, { useState, useEffect } from "react";
import { 
  TextField, Button, Box, Typography, Paper, 
  Alert, CircularProgress, Grid, Avatar, Divider, Stack 
} from "@mui/material";
import { PersonAdd as PersonIcon, Save as SaveIcon, Close as CloseIcon } from "@mui/icons-material";
import { createCliente, updateCliente } from "../../services/clienteService";
import type { Cliente } from "../../types/cliente.type";

interface ClienteFormProps {
  clienteEdit?: Cliente | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClienteForm({ clienteEdit, onSuccess, onCancel }: ClienteFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  useEffect(() => {
    if (clienteEdit) {
      setForm({
        nombre: clienteEdit.nombre || "",
        cedula: clienteEdit.cedula || "",
        telefono: clienteEdit.telefono || "",
        email: clienteEdit.email || "",
        direccion: clienteEdit.direccion || "",
      });
    }
  }, [clienteEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'cedula') {
      const value = e.target.value.replace(/[^0-9]/g, '');
      if (value.length <= 10) {
        setForm({ ...form, [e.target.name]: value });
      }
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      if (clienteEdit?.id_cliente) {
        await updateCliente(clienteEdit.id_cliente, form);
        setStatus({ type: 'success', msg: "SISTEMA: CLIENTE_ACTUALIZADO_CON_ÉXITO" });
      } else {
        await createCliente(form);
        setStatus({ type: 'success', msg: "SISTEMA: CLIENTE_REGISTRADO_CON_ÉXITO" });
      }
      setTimeout(onSuccess, 1000);
    } catch (err: any) {
      let errorMsg = "ERROR_INTERNO_SERVIDOR";
      const serverResponse = err.response?.data;
      const detail = serverResponse?.detail || "";
      
      if (detail.includes("already exists") || detail.includes("ya existe")) {
        if (detail.includes("cedula")) {
          errorMsg = `CONFLICTO: LA CÉDULA "${form.cedula}" YA EXISTE.`;
        } else if (detail.includes("email")) {
          errorMsg = `CONFLICTO: EL CORREO "${form.email}" YA EXISTE.`;
        } else {
          errorMsg = "ERROR: DATOS_DUPLICADOS_EN_SISTEMA.";
        }
      } 
      else if (Array.isArray(serverResponse?.message)) {
        errorMsg = serverResponse.message.join(" | ").toUpperCase();
      } 
      else if (serverResponse?.message) {
        errorMsg = serverResponse.message.toUpperCase();
      }

      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        maxWidth: 700, 
        mx: "auto", 
        borderRadius: 0, 
        border: '4px solid #000',
        bgcolor: '#fff' 
      }}
    >
      {/* HEADER DEL FORMULARIO */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{ bgcolor: '#000', color: '#fff', p: 1.5, display: 'flex' }}>
          <PersonIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -1 }}>
            {clienteEdit ? "EDITAR_EXPEDIENTE" : "NUEVO_REGISTRO_CLIENTE"}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>
            ID_PROCESO: {clienteEdit ? clienteEdit.id_cliente : 'NUEVO_ENTRY'}
          </Typography>
        </Box>
      </Box>

      {status && (
        <Alert 
          severity={status.type} 
          icon={false}
          sx={{ 
            mb: 3, 
            borderRadius: 0, 
            border: '2px solid #000', 
            fontWeight: 900,
            bgcolor: status.type === 'success' ? '#000' : '#fff',
            color: status.type === 'success' ? '#fff' : '#ff0000',
          }}
        >
          {status.msg}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField 
              label="NOMBRE_COMPLETO" 
              name="nombre" 
              value={form.nombre} 
              fullWidth 
              required 
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 0, border: '1px solid #000', fontWeight: 700 } }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="CÉDULA / RUC" 
              name="cedula" 
              value={form.cedula} 
              fullWidth 
              required 
              onChange={handleChange}
              inputProps={{ maxLength: 10, style: { fontFamily: 'monospace', fontWeight: 700 } }}
              helperText={form.cedula.length === 10 ? "LÍMITE_ALCANZADO" : "FORMATO: 10_DÍGITOS"}
              InputProps={{ sx: { borderRadius: 0, border: '1px solid #000' } }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="TELÉFONO" 
              name="telefono" 
              value={form.telefono} 
              fullWidth 
              onChange={handleChange} 
              inputProps={{ style: { fontFamily: 'monospace', fontWeight: 700 } }}
              InputProps={{ sx: { borderRadius: 0, border: '1px solid #000' } }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
            />
          </Grid>
          <Grid size={12}>
            <TextField 
              label="CORREO_ELECTRÓNICO" 
              name="email" 
              type="email" 
              value={form.email} 
              fullWidth 
              onChange={handleChange} 
              InputProps={{ sx: { borderRadius: 0, border: '1px solid #000', fontWeight: 700 } }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
            />
          </Grid>
          <Grid size={12}>
            <TextField 
              label="DIRECCIÓN_GEOGRÁFICA" 
              name="direccion" 
              value={form.direccion} 
              fullWidth 
              multiline 
              rows={2} 
              onChange={handleChange} 
              InputProps={{ sx: { borderRadius: 0, border: '1px solid #000', fontWeight: 700 } }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderBottomWidth: 2, borderColor: '#000' }} />

        <Stack direction="row" spacing={2}>
          <Button 
            fullWidth 
            variant="outlined" 
            onClick={onCancel} 
            disabled={submitting}
            startIcon={<CloseIcon />}
            sx={{ 
              borderRadius: 0, 
              border: '2px solid #000', 
              color: '#000', 
              fontWeight: 900,
              '&:hover': { border: '2px solid #000', bgcolor: '#f5f5f5' }
            }}
          >
            ABORTAR
          </Button>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={submitting}
            startIcon={!submitting && <SaveIcon />}
            sx={{ 
              bgcolor: '#000', 
              color: '#fff',
              borderRadius: 0, 
              fontWeight: 900,
              '&:hover': { bgcolor: '#333' },
              border: '2px solid #000'
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "GUARDAR_REGISTRO"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}