import React, { useState, useEffect } from "react";
import { 
  TextField, Button, MenuItem, Select, InputLabel, 
  FormControl, Box, Typography, Paper, Checkbox, 
  ListItemText, OutlinedInput, Alert, CircularProgress, Grid, Avatar
} from "@mui/material";
import { PersonAdd as PersonIcon } from "@mui/icons-material";

// Servicios
import { createUsuario } from "../../services/usuarioService";
import { listEmpleados } from "../../services/empleadoService";
import { getRoles } from "../../services/rol.service";

// Interfaz para corregir el error de onSuccess en el padre
interface UsuarioFormProps {
  onSuccess: () => void;
}

export default function UsuarioForm({ onSuccess }: UsuarioFormProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    id_empleado: "",
    rolesIds: [] as string[],
  });

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setLoading(true);
        const [resRoles, resEmpleados] = await Promise.all([
          getRoles(1, 100),
          listEmpleados(1, 100)
        ]);
        setRoles(resRoles.data?.data || []);
        setEmpleados(resEmpleados.docs || []);
      } catch (err) {
        setStatus({ type: 'error', msg: "Error al cargar datos" });
      } finally {
        setLoading(false);
      }
    };
    cargarCatalogos();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUsuario(form);
      setStatus({ type: 'success', msg: "¡Usuario registrado correctamente!" });
      setTimeout(() => onSuccess(), 1500); 
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || "Error al registrar" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    /* ESTILO ANTIGUO: Paper con sombra 3 y bordes muy redondeados */
    <Paper sx={{ p: 4, maxWidth: 650, mx: "auto", mt: 4, borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#4f69f9', mb: 1, width: 56, height: 56 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color="#1e293b">
          Nuevo Acceso
        </Typography>
      </Box>

      {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Nombre de Usuario" name="nombre" value={form.nombre} fullWidth required onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Correo Electrónico" name="email" type="email" value={form.email} fullWidth required onChange={handleChange} />
          </Grid>
        </Grid>

        <TextField label="Contraseña" name="password" type="password" value={form.password} fullWidth required onChange={handleChange} />

        <FormControl fullWidth required>
          <InputLabel>Vincular con Empleado</InputLabel>
          <Select 
            name="id_empleado" 
            value={form.id_empleado} 
            label="Vincular con Empleado" 
            onChange={handleChange}
          >
            {empleados.map((emp) => (
              <MenuItem key={emp.id_empleado} value={emp.id_empleado}>
                {emp.nombre} {emp.apellido} ({emp.cedula})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Asignar Roles</InputLabel>
          <Select
            multiple
            name="rolesIds"
            value={form.rolesIds}
            onChange={handleChange}
            input={<OutlinedInput label="Asignar Roles" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map(id => (
                  <Typography key={id} sx={{ bgcolor: '#eef2ff', color: '#4f69f9', px: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {roles.find(r => r.id_rol === id)?.rol.toUpperCase()}
                  </Typography>
                ))}
              </Box>
            )}
          >
            {roles.map((rol) => (
              <MenuItem key={rol.id_rol} value={rol.id_rol}>
                <Checkbox checked={form.rolesIds.indexOf(rol.id_rol) > -1} />
                <ListItemText primary={rol.rol.toUpperCase()} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          type="submit" 
          variant="contained" 
          disabled={submitting}
          sx={{ 
            mt: 2, py: 1.5, fontWeight: 'bold', borderRadius: 2,
            bgcolor: '#4f69f9', '&:hover': { bgcolor: '#3f51b5' }
          }}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : "REGISTRAR ACCESO"}
        </Button>
      </Box>
    </Paper>
  );
}