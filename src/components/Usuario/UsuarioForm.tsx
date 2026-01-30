import React, { useState, useEffect } from "react";
import { 
  TextField, Button, MenuItem, Select, InputLabel, 
  FormControl, Box, Typography, Paper, Checkbox, 
  ListItemText, OutlinedInput, Alert, CircularProgress, Grid 
} from "@mui/material";

// Servicios
import { createUsuario } from "../../services/usuarioService";
import { listEmpleados } from "../../services/empleadoService";
import { getRoles } from "../../services/rol.service";

export default function UsuarioForm() {
  const [roles, setRoles] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  // Estructura idéntica a tu Postman
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    id_empleado: "",
    rolesIds: [] as string[], // Almacenará los UUIDs de los roles
  });

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setLoading(true);
        const [resRoles, resEmpleados] = await Promise.all([
          getRoles(1, 100),
          listEmpleados(1, 100)
        ]);

        // Sincronización con tus servicios:
        // Roles viene de SuccessResponse -> data.data
        setRoles(resRoles.data?.data || []);
        
        // Empleados viene de tu service que retorna { docs: [...] }
        setEmpleados(resEmpleados.docs || []);

      } catch (err: any) {
        console.error("Error al cargar datos:", err);
        setStatus({ type: 'error', msg: "Error al cargar datos del servidor" });
      } finally {
        setLoading(false);
      }
    };
    cargarCatalogos();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // Material UI gestiona automáticamente el array en Select múltiple
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Validación mínima antes de enviar
    if (!form.id_empleado) return setStatus({ type: 'error', msg: "Seleccione un empleado" });
    if (form.rolesIds.length === 0) return setStatus({ type: 'error', msg: "Asigne al menos un rol" });

    try {
      // Enviamos el objeto 'form' que ya tiene la estructura de tu Postman
      await createUsuario(form);
      setStatus({ type: 'success', msg: "¡Usuario registrado correctamente!" });
      
      // Limpiar formulario
      setForm({ nombre: "", email: "", password: "", id_empleado: "", rolesIds: [] });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || "Error al registrar usuario" });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 4, maxWidth: 650, mx: "auto", mt: 4, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" mb={1} fontWeight="bold" color="primary">
        CREAR NUEVO USUARIO
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Asigne credenciales de acceso a un empleado registrado.
      </Typography>

      {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Nombre de Usuario (Nickname)" name="nombre" value={form.nombre} fullWidth required onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Correo Electrónico" name="email" type="email" value={form.email} fullWidth required onChange={handleChange} />
          </Grid>
        </Grid>

        <TextField label="Contraseña" name="password" type="password" value={form.password} fullWidth required onChange={handleChange} />

        {/* SELECT EMPLEADO (ID_EMPLEADO) */}
        <FormControl fullWidth required>
          <InputLabel>Empleado Responsable</InputLabel>
          <Select 
            name="id_empleado" 
            value={form.id_empleado} 
            label="Empleado Responsable" 
            onChange={handleChange}
          >
            {empleados.length === 0 ? (
              <MenuItem disabled>No hay empleados disponibles</MenuItem>
            ) : (
              empleados.map((emp) => (
                <MenuItem key={emp.id_empleado} value={emp.id_empleado}>
                  {emp.nombre} {emp.apellido} ({emp.cedula})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* SELECT ROLES (ROLES_IDS) */}
        <FormControl fullWidth required>
          <InputLabel>Roles de Usuario</InputLabel>
          <Select
            multiple
            name="rolesIds"
            value={form.rolesIds}
            onChange={handleChange}
            input={<OutlinedInput label="Roles de Usuario" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {roles
                  .filter(r => (selected as string[]).includes(r.id_rol))
                  .map(r => (
                    <Typography key={r.id_rol} sx={{ bgcolor: 'primary.main', color: 'white', px: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                      {r.rol.toUpperCase()}
                    </Typography>
                  ))
                }
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
          size="large" 
          sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
        >
          GUARDAR USUARIO
        </Button>
      </Box>
    </Paper>
  );
}