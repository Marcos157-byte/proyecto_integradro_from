import { useState, useEffect } from "react";
import { 
  Box, TextField, Button, Typography, Paper, 
  MenuItem, Divider, Alert, CircularProgress, Avatar, Stack 
} from "@mui/material";
import Grid from "@mui/material/Grid"; 
import { 
  PersonAdd as PersonIcon,
  ArrowBack as ArrowBackIcon,
  BadgeRounded as BadgeIcon,
  LocationOnRounded as MapIcon
} from "@mui/icons-material";

import type { CreateEmpleadoDto } from "../../types/empleado.type";
import { createEmpleado, updateEmpleado } from "../../services/empleadoService";

interface Props {
  empleado?: any; 
  onSuccess: () => void;
}

export default function EmpleadoForm({ empleado, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateEmpleadoDto>({
    nombre: "",
    segundoNombre: "",
    apellido: "",
    segundoApellido: "",
    cedula: "",
    direccion: "",
    telefono: "",
    genero: "MASCULINO",
    edad: 0,
    fechaNacimiento: "",
  });

  useEffect(() => {
    if (empleado) {
      setFormData({
        nombre: empleado.nombre || "",
        segundoNombre: empleado.segundoNombre || "",
        apellido: empleado.apellido || "",
        segundoApellido: empleado.segundoApellido || "",
        cedula: empleado.cedula || "",
        direccion: empleado.direccion || "",
        telefono: empleado.telefono || "",
        genero: empleado.genero || "MASCULINO",
        edad: empleado.edad || 0,
        fechaNacimiento: empleado.fechaNacimiento ? empleado.fechaNacimiento.split('T')[0] : "",
      });
    }
  }, [empleado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      // Si es edad, validamos que no sea negativo al escribir. Otros campos a Mayúsculas.
      [name]: name === "edad" 
        ? Math.max(0, Number(value)) 
        : value.toUpperCase(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (empleado?.id_empleado) {
        await updateEmpleado(empleado.id_empleado, formData);
      } else {
        await createEmpleado(formData);
      }
      setSuccess(true);
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  // ESTILOS BRUTALISTAS
  const inputStyles = {
    bgcolor: '#fff !important',
    borderRadius: 0,
    '& .MuiOutlinedInput-notchedOutline': { borderWidth: '2px', borderColor: '#000' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3a7afe' },
    '& input, & .MuiSelect-select': { fontWeight: 800, textTransform: 'uppercase' },
    // OCULTAR FLECHAS DE NÚMERO
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
  };

  return (
    <Box sx={{ bgcolor: '#f0f0f0', minHeight: '100vh', p: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={onSuccess}
        sx={{ mb: 3, fontWeight: 900, color: '#000', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
      >
        REGRESAR_AL_LISTADO
      </Button>

      <Paper sx={{ 
        p: 0, maxWidth: 900, mx: "auto", borderRadius: 0, 
        border: '4px solid #000', boxShadow: '12px 12px 0px #000',
        overflow: 'hidden'
      }}>
        <Box sx={{ bgcolor: '#000', p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ bgcolor: '#3a7afe', width: 60, height: 60, borderRadius: 0, border: '3px solid #fff' }}>
            <PersonIcon sx={{ fontSize: 35 }} />
          </Avatar>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', lineHeight: 1 }}>
              {empleado ? "ACTUALIZAR_FICHA_EMPLEADO" : "REGISTRO_NUEVA_IDENTIDAD"}
            </Typography>
            <Typography sx={{ color: '#3a7afe', fontFamily: 'monospace', fontWeight: 800, mt: 0.5 }}>
              HR_SYSTEM // DATABASE_ENTRY_v2
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          {error && <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 0, fontWeight: 800, border: '2px solid #000' }}>{error}</Alert>}
          {success && <Alert severity="success" variant="filled" sx={{ mb: 3, borderRadius: 0, fontWeight: 800, border: '2px solid #000' }}>DATOS_ALMACENADOS_CORRECTAMENTE ✅</Alert>}

          <Typography variant="overline" sx={{ fontWeight: 900, color: '#666' }}>I. DATOS_NOMINALES</Typography>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="PRIMER_NOMBRE" name="nombre" required value={formData.nombre} onChange={handleChange} InputProps={{ sx: inputStyles }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="SEGUNDO_NOMBRE" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} InputProps={{ sx: inputStyles }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="PRIMER_APELLIDO" name="apellido" required value={formData.apellido} onChange={handleChange} InputProps={{ sx: inputStyles }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="SEGUNDO_APELLIDO" name="segundoApellido" required value={formData.segundoApellido} onChange={handleChange} InputProps={{ sx: inputStyles }} />
            </Grid>

            <Grid size={12}><Divider sx={{ borderBottomWidth: 3, borderColor: '#000', my: 1 }} /></Grid>

            <Grid size={12}><Typography variant="overline" sx={{ fontWeight: 900, color: '#666' }}>II. IDENTIFICACIÓN_Y_CONTACTO</Typography></Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="CÉDULA_ID" name="cedula" required value={formData.cedula} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 10 } }} InputProps={{ sx: inputStyles, startAdornment: <BadgeIcon sx={{ mr: 1 }} /> }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="TELÉFONO" name="telefono" required value={formData.telefono} onChange={handleChange} InputProps={{ sx: inputStyles }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                fullWidth 
                label="EDAD" 
                name="edad" 
                type="number" 
                required 
                value={formData.edad === 0 ? "" : formData.edad} // Muestra vacío en lugar de 0 para facilitar escritura
                onChange={handleChange} 
                InputProps={{ sx: inputStyles }} 
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth label="FECHA_NACIMIENTO" name="fechaNacimiento" type="date" required 
                InputLabelProps={{ shrink: true }} 
                value={formData.fechaNacimiento} onChange={handleChange}
                InputProps={{ sx: inputStyles }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="GÉNERO_BIOLÓGICO" name="genero" required value={formData.genero} onChange={handleChange} InputProps={{ sx: inputStyles }}>
                <MenuItem value="MASCULINO" sx={{ fontWeight: 700 }}>MASCULINO</MenuItem>
                <MenuItem value="FEMENINO" sx={{ fontWeight: 700 }}>FEMENINO</MenuItem>
                <MenuItem value="OTRO" sx={{ fontWeight: 700 }}>OTRO</MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField 
                fullWidth label="DIRECCIÓN_DOMICILIARIA" name="direccion" required multiline rows={2} 
                value={formData.direccion} onChange={handleChange}
                InputProps={{ sx: inputStyles, startAdornment: <MapIcon sx={{ mr: 1, mt: -2 }} /> }}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 5, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={onSuccess} sx={{ borderRadius: 0, border: '3px solid #000', color: '#000', fontWeight: 900, px: 4 }}>
              CANCELAR
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ px: 6, py: 1.5, borderRadius: 0, fontWeight: 900, bgcolor: '#000', color: '#fff', border: '3px solid #000' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : empleado ? "GUARDAR_CAMBIOS" : "CONFIRMAR_REGISTRO"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}