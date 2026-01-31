import React, { useState, useEffect } from "react";
import { 
  TextField, Button, Box, Typography, Paper, 
  Alert, CircularProgress, Avatar, Divider, Stack, 
  MenuItem, Checkbox, ListItemText 
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { 
  AdminPanelSettingsRounded as ShieldIcon, 
  SaveRounded as SaveIcon,
  CloseRounded as CancelIcon,
  BadgeRounded as IDIcon,
  LockRounded as LockIcon,
  ContactMailRounded as MailIcon,
  SecurityRounded as RoleIcon
} from "@mui/icons-material";

// Servicios y Tipos
import { createUsuario, updateUsuario } from "../../services/usuarioService";
import { listEmpleados } from "../../services/empleadoService"; 
import { getRoles } from "../../services/rolService";
import type { Usuario, CreateUsuarioDto } from "../../types/usuario.type";
import type { Rol } from "../../types/rol.type";
import type { Empleado } from "../../types/empleado.type";

interface UsuarioFormProps {
  usuarioEdit?: Usuario | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UsuarioForm({ usuarioEdit, onSuccess, onCancel }: UsuarioFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  const [form, setForm] = useState<CreateUsuarioDto>({
    nombre: "",
    email: "",
    password: "",
    id_empleado: "",
    rolesIds: []
  });

  // Carga inicial de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [resEmp, resRol] = await Promise.all([
          listEmpleados(1, 100), // Usamos el servicio con paginación amplia
          getRoles(1, 100)
        ]);
        
        // Sincronización con el mapeo de tu servicio de empleados
        // Tu servicio devuelve un objeto con { docs: Empleado[], totalDocs... }
        setEmpleados(resEmp.docs || []);
        
        // Mapeo según SuccessResponseDto { data: { data: [] } } para roles
        const listaRoles = resRol.data?.data || []; 
        setRoles(listaRoles);
      } catch (error) {
        console.error("Error cargando dependencias:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Carga de datos en modo edición
  useEffect(() => {
    if (usuarioEdit) {
      setForm({
        nombre: usuarioEdit.nombre || "",
        email: usuarioEdit.email || "",
        password: "", 
        id_empleado: usuarioEdit.empleado?.id_empleado || "",
        rolesIds: usuarioEdit.rolUsuarios?.map(r => r.rol.id_rol) || []
      });
    }
  }, [usuarioEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "rolesIds") {
      setForm({ ...form, rolesIds: typeof value === 'string' ? value.split(',') : (value as any) });
    } else {
      const safeValue = value || "";
      // Mantenemos la consistencia de nombres en mayúsculas
      setForm({ ...form, [name]: name === "nombre" ? safeValue.toUpperCase() : safeValue });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rolesIds.length === 0) {
      setStatus({ type: 'error', msg: "DEBE_ASIGNAR_AL_MENOS_UN_ROL_SISTEMA" });
      return;
    }
    
    setSubmitting(true);
    setStatus(null);

    try {
      if (usuarioEdit?.id_usuario) {
        const { password, ...updateData } = form;
        await updateUsuario(usuarioEdit.id_usuario, password ? form : updateData);
      } else {
        await createUsuario(form);
      }
      onSuccess();
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || "ERROR_EN_EL_NÚCLEO_DE_DATOS" });
    } finally {
      setSubmitting(false);
    }
  };

  // Estilo Neobrutalista Unificado
  const inputStyles = {
    bgcolor: '#fff !important',
    borderRadius: 0,
    '& .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#000' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3a7afe' },
    '& input, & .MuiSelect-select': { fontWeight: 800, bgcolor: '#fff !important' },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #fff inset !important',
      WebkitTextFillColor: '#000 !important',
    },
  };

  return (
    <Paper sx={{ p: 0, maxWidth: 850, mx: "auto", borderRadius: 0, border: '4px solid #000', boxShadow: '12px 12px 0px #000', bgcolor: '#fff', overflow: 'hidden' }}>
      {/* CABECERA */}
      <Box sx={{ bgcolor: '#000', p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar sx={{ bgcolor: '#3a7afe', width: 70, height: 70, borderRadius: 0, border: '3px solid #fff' }}>
          <ShieldIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>
            {usuarioEdit ? "MODIFICAR_IDENTIDAD" : "NUEVO_ACCESO_SEGURIDAD"}
          </Typography>
          <Typography sx={{ color: '#3a7afe', fontFamily: 'monospace', fontWeight: 800, mt: 0.5 }}>
            DENIM_LAB // AUTH_PROTOCOL_v2
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        {status && (
          <Alert severity={status.type} variant="filled" sx={{ mb: 4, borderRadius: 0, fontWeight: 900, border: '2px solid #000' }}>
            {status.msg}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* SECCIÓN I */}
          <Grid size={12}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: '#666' }}>I. CREDENCIALES_PRIMARIAS</Typography>
            <TextField label="NOMBRE_COMPLETO" name="nombre" value={form.nombre} fullWidth required onChange={handleChange} variant="outlined" InputProps={{ sx: inputStyles }} />
          </Grid>
          
          <Grid  size={{ xs: 12, sm: 6 }}>
            <TextField label="CORREO_ELECTRÓNICO" name="email" type="email" value={form.email} fullWidth required onChange={handleChange} variant="outlined" InputProps={{ sx: inputStyles, startAdornment: <MailIcon sx={{ mr: 1 }} /> }} />
          </Grid>

          <Grid  size={{ xs: 12, sm: 6 }}>
            <TextField label={usuarioEdit ? "TOKEN (VACÍO PARA NO CAMBIAR)" : "CLAVE_DE_ACCESO"} name="password" type="password" value={form.password} fullWidth required={!usuarioEdit} onChange={handleChange} variant="outlined" InputProps={{ sx: inputStyles, startAdornment: <LockIcon sx={{ mr: 1 }} /> }} />
          </Grid>

          <Grid size={12}><Divider sx={{ my: 1, borderBottomWidth: 2, borderColor: '#000' }} /></Grid>

          {/* SECCIÓN II */}
          <Grid size={12}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: '#666' }}>II. VINCULACIÓN_Y_PERMISOS</Typography>
          </Grid>

          <Grid  size={{ xs: 12, sm: 6 }}>
            <TextField select label="ASOCIAR_EMPLEADO" name="id_empleado" value={form.id_empleado} fullWidth required onChange={handleChange} variant="outlined" InputProps={{ sx: inputStyles, startAdornment: <IDIcon sx={{ mr: 1 }} /> }}>
              {loadingData ? <MenuItem disabled>SINCRONIZANDO...</MenuItem> : 
                empleados.map((emp) => (
                  <MenuItem key={emp.id_empleado} value={emp.id_empleado} sx={{ fontWeight: 700 }}>
                    {`${String(emp.nombre || '').toUpperCase()} ${String(emp.apellido || '').toUpperCase()}`}
                  </MenuItem>
                ))
              }
            </TextField>
          </Grid>

          <Grid  size={{ xs: 12, sm: 6 }}>
            <TextField
              select label="ROLES_DE_SISTEMA" name="rolesIds" value={form.rolesIds} fullWidth required onChange={handleChange} variant="outlined"
              SelectProps={{
                multiple: true,
                renderValue: (selected: any) => {
                  const selectedNames = roles
                    .filter(r => selected.includes(r.id_rol))
                    .map(r => String(r.rol || '').toUpperCase());
                  return selectedNames.join(', ');
                }
              }}
              InputProps={{ sx: inputStyles, startAdornment: <RoleIcon sx={{ mr: 1 }} /> }}
            >
              {roles.map((rol) => (
                <MenuItem key={rol.id_rol} value={rol.id_rol}>
                  <Checkbox checked={form.rolesIds.indexOf(rol.id_rol as never) > -1} />
                  <ListItemText primary={String(rol.rol || '').toUpperCase()} sx={{ '& span': { fontWeight: 700 } }} />
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          <Button fullWidth variant="outlined" onClick={onCancel} startIcon={<CancelIcon />} sx={{ borderRadius: 0, border: '3px solid #000', color: '#000', fontWeight: 900, py: 1.5, '&:hover': { border: '3px solid #000', bgcolor: '#f5f5f5' } }}>
            ABORTAR
          </Button>
          <Button type="submit" fullWidth variant="contained" disabled={submitting || loadingData} startIcon={!submitting && <SaveIcon />} sx={{ py: 1.5, fontWeight: 900, borderRadius: 0, bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' }, boxShadow: 'none' }}>
            {submitting ? <CircularProgress size={24} color="inherit" /> : "REGISTRAR_ACCESO"}
          </Button>
        </Stack>
      </Box>
      
      <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderTop: '2px solid #000', textAlign: 'center' }}>
        <Typography sx={{ fontSize: '10px', fontWeight: 800, fontFamily: 'monospace', color: '#666' }}>
          DENIM_LAB_SYSTEM // SECURE_ACCESS // TERMINAL_{Math.floor(Math.random() * 9999)}
        </Typography>
      </Box>
    </Paper>
  );
}