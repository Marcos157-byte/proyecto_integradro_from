import React, { useState, useEffect } from "react";
import { 
  TextField, Button, Box, Typography, Paper, 
  Alert, CircularProgress, Grid, Avatar} from "@mui/material";
import { PersonAdd as PersonIcon, Save as SaveIcon } from "@mui/icons-material";
import { createUsuario, updateUsuario } from "../../services/usuarioService";
import type { Usuario, CreateUsuarioDto } from "../../types/usuario.type";

interface UsuarioFormProps {
  usuarioEdit?: Usuario | null; // Cambiado para coincidir con la prop que pasas en UsuarioList
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UsuarioForm({ usuarioEdit, onSuccess, onCancel }: UsuarioFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  // Estado del formulario basado en CreateUsuarioDto
  const [form, setForm] = useState<CreateUsuarioDto>({
    nombre: "",
    email: "",
    password: "",
    id_empleado: "", // Debe ser un UUID válido de un empleado
    rolesIds: []     // Array de IDs de roles
  });

  // EFECTO: Carga datos si es edición
  useEffect(() => {
    if (usuarioEdit) {
      setForm({
        nombre: usuarioEdit.nombre || "",
        email: usuarioEdit.email || "",
        password: "", // Normalmente no se edita el password aquí por seguridad
        id_empleado: usuarioEdit.empleado?.id_empleado || "",
        rolesIds: usuarioEdit.rolUsuarios?.map(r => r.rol.id_rol) || []
      });
    } else {
      setForm({ nombre: "", email: "", password: "", id_empleado: "", rolesIds: [] });
    }
  }, [usuarioEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      if (usuarioEdit?.id_usuario) {
        // En edición, el password puede ser opcional
        const { password, ...updateData } = form;
        await updateUsuario(usuarioEdit.id_usuario, password ? form : updateData);
        setStatus({ type: 'success', msg: "¡Usuario actualizado con éxito!" });
      } else {
        await createUsuario(form);
        setStatus({ type: 'success', msg: "¡Usuario creado correctamente!" });
      }
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || "Error al procesar el usuario" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 2, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#4f69f9', mb: 1, width: 60, height: 60 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight="800" color="#1e293b">
          {usuarioEdit ? "Editar Usuario" : "Registro de Usuario"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Complete los campos para gestionar el acceso al sistema
        </Typography>
      </Box>

      {status && <Alert severity={status.type} sx={{ mb: 3, borderRadius: 2 }}>{status.msg}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField label="Nombre del Usuario" name="nombre" value={form.nombre} fullWidth required onChange={handleChange} variant="filled" />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Correo Electrónico" name="email" type="email" value={form.email} fullWidth required onChange={handleChange} variant="filled" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label={usuarioEdit ? "Nueva Contraseña (opcional)" : "Contraseña"} 
              name="password" 
              type="password" 
              value={form.password} 
              fullWidth 
              required={!usuarioEdit} 
              onChange={handleChange} 
              variant="filled" 
            />
          </Grid>

          <Grid size={12}>
            <TextField 
              label="ID del Empleado (UUID)" 
              name="id_empleado" 
              value={form.id_empleado} 
              fullWidth 
              required 
              onChange={handleChange} 
              helperText="Vincule este usuario a un empleado existente"
              variant="filled"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button 
            fullWidth 
            variant="text" 
            onClick={onCancel} 
            sx={{ borderRadius: 2, color: '#64748b', fontWeight: 700, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            disabled={submitting}
            startIcon={!submitting && <SaveIcon />}
            sx={{ py: 1.5, fontWeight: 800, borderRadius: 2, bgcolor: '#4f69f9', textTransform: 'none', boxShadow: '0 4px 14px rgba(79, 105, 249, 0.4)' }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Guardar Usuario"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}