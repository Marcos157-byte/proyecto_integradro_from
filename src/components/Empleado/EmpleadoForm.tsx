import { useState, useEffect } from "react";
import { 
  Box, TextField, Button, Typography, Grid, Paper, 
  MenuItem, Divider, Alert, CircularProgress, Avatar 
} from "@mui/material";
import { 
  Save as SaveIcon, 
  PersonAdd as PersonIcon,
  ArrowBack as ArrowBackIcon 
} from "@mui/icons-material";

import type { CreateEmpleadoDto } from "../../types/empleado.type";
import { createEmpleado, updateEmpleado } from "../../services/empleadoService";

interface Props {
  empleado?: any; 
  onSuccess: () => void; // Esta función nos sirve para volver a la lista
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
      [name]: name === "edad" ? Number(value) : value,
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

  return (
    <Box>
      {/* BOTÓN VOLVER (Igual que en UsuarioForm) */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={onSuccess}
        sx={{ mb: 3, fontWeight: 700, color: '#64748b' }}
      >
        Volver a la Lista
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 900, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ bgcolor: "#3a7afe", mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {empleado ? "Editar Información de Empleado" : "Nuevo Registro de Empleado"}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>¡Datos guardados con éxito! ✅</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Campos del Formulario */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Primer Nombre" name="nombre" required value={formData.nombre} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Segundo Nombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Primer Apellido" name="apellido" required value={formData.apellido} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Segundo Apellido" name="segundoApellido" required value={formData.segundoApellido} onChange={handleChange} />
            </Grid>

            <Divider sx={{ width: "100%", my: 2, opacity: 0.5 }} />

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Cédula" name="cedula" required value={formData.cedula} onChange={handleChange} inputProps={{ maxLength: 10 }} />
            </Grid>
            <Grid  size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Teléfono" name="telefono" required value={formData.telefono} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Edad" name="edad" type="number" required value={formData.edad} onChange={handleChange} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth label="Fecha de Nacimiento" name="fechaNacimiento" type="date" required 
                InputLabelProps={{ shrink: true }} 
                value={formData.fechaNacimiento} onChange={handleChange} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Género" name="genero" required value={formData.genero} onChange={handleChange}>
                <MenuItem value="MASCULINO">Masculino</MenuItem>
                <MenuItem value="FEMENINO">Femenino</MenuItem>
                <MenuItem value="OTRO">Otro</MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField 
                fullWidth label="Dirección Completa" name="direccion" required multiline rows={2} 
                value={formData.direccion} onChange={handleChange} 
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={onSuccess} sx={{ borderRadius: 2 }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ 
                px: 4, py: 1.5, borderRadius: 2, fontWeight: "bold",
                background: "linear-gradient(45deg, #3a7afe 30%, #1e40af 90%)"
              }}
            >
              {loading ? "Procesando..." : empleado ? "Guardar Cambios" : "Registrar Empleado"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}