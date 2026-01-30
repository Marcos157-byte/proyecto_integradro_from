import React, { useState, useEffect } from "react";
import { 
  TextField, Button, Box, Typography, Paper, 
  Alert, CircularProgress, Grid, Avatar 
} from "@mui/material";
import { PersonAdd as PersonIcon, Save as SaveIcon } from "@mui/icons-material";
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
    // Si es cédula, evitamos que escriban más de 10 caracteres o caracteres no deseados
    if (e.target.name === 'cedula') {
      const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números (opcional, según tu regla)
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
        setStatus({ type: 'success', msg: "Cliente actualizado correctamente" });
      } else {
        await createCliente(form);
        setStatus({ type: 'success', msg: "Cliente registrado con éxito" });
      }
      setTimeout(onSuccess, 1000);
    } catch (err: any) {
      let errorMsg = "Error al procesar la solicitud";
      const serverResponse = err.response?.data;

      // 1. CONTROL DE DUPLICADOS (ERROR 23505 POSTGRES)
      // Buscamos en el 'detail' que envía el driver de BD
      const detail = serverResponse?.detail || "";
      
      if (detail.includes("already exists") || detail.includes("ya existe")) {
        if (detail.includes("cedula")) {
          errorMsg = `La cédula "${form.cedula}" ya está registrada en el sistema.`;
        } else if (detail.includes("email")) {
          errorMsg = `El correo "${form.email}" ya pertenece a otro cliente.`;
        } else {
          errorMsg = "Ya existe un registro con estos datos únicos.";
        }
      } 
      // 2. VALIDACIONES DE NESTJS (MAX LENGTH, FORMATO, ETC)
      else if (Array.isArray(serverResponse?.message)) {
        errorMsg = serverResponse.message.join(" | ");
      } 
      // 3. MENSAJES DIRECTOS
      else if (serverResponse?.message) {
        errorMsg = serverResponse.message;
      }

      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 650, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#4f69f9', mb: 1, width: 56, height: 56 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight="bold">
          {clienteEdit ? "Editar Cliente" : "Nuevo Cliente"}
        </Typography>
      </Box>

      {status && (
        <Alert severity={status.type} sx={{ mb: 3, borderRadius: 2 }}>
          {status.msg}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField 
              label="Nombre Completo" 
              name="nombre" 
              value={form.nombre} 
              fullWidth 
              required 
              onChange={handleChange} 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Cédula / RUC" 
              name="cedula" 
              value={form.cedula} 
              fullWidth 
              required 
              onChange={handleChange}
              inputProps={{ maxLength: 10 }}
              helperText={form.cedula.length === 10 ? "Máximo alcanzado" : "10 dígitos requeridos"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Teléfono" 
              name="telefono" 
              value={form.telefono} 
              fullWidth 
              onChange={handleChange} 
            />
          </Grid>
          <Grid size={12}>
            <TextField 
              label="Correo Electrónico" 
              name="email" 
              type="email" 
              value={form.email} 
              fullWidth 
              onChange={handleChange} 
            />
          </Grid>
          <Grid size={12}>
            <TextField 
              label="Dirección" 
              name="direccion" 
              value={form.direccion} 
              fullWidth 
              multiline 
              rows={2} 
              onChange={handleChange} 
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button fullWidth variant="outlined" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={submitting}
            startIcon={!submitting && <SaveIcon />}
            sx={{ 
              bgcolor: '#4f69f9', 
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#3d54d9' }
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Guardar Cliente"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}