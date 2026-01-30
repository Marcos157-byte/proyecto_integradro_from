import { useState } from "react";
import { 
  Box, TextField, Button, Typography, Grid, Paper, 
  MenuItem, Divider, Alert, CircularProgress, Avatar 
} from "@mui/material";
import { Save as SaveIcon, PersonAdd as PersonIcon } from "@mui/icons-material";

import type { CreateEmpleadoDto } from "../../types/empleado.type";
import { createEmpleado } from "../../services/empleadoService";

interface Props {
  onSuccess?: () => void; // Para recargar la tabla tras guardar
}

export default function EmpleadoForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado inicial cumpliendo con los campos obligatorios de tu DB
  const [formData, setFormData] = useState<CreateEmpleadoDto>({
    nombre: "",
    segundoNombre: "",
    apellido: "",
    segundoApellido: "", // Obligatorio
    cedula: "",          // Obligatorio
    direccion: "",       // Obligatorio
    telefono: "",        // Obligatorio
    genero: "MASCULINO", // Obligatorio
    edad: 0,             // Obligatorio
    fechaNacimiento: "", // Obligatorio
  });

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
    setSuccess(false);

    try {
      await createEmpleado(formData);
      setSuccess(true);
      if (onSuccess) onSuccess();
      // Limpiar formulario si es necesario
    } catch (err: any) {
      setError(err.message || "Error al registrar el empleado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 900, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "#3a7afe", mr: 2 }}><PersonIcon /></Avatar>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Nuevo Registro de Empleado</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>¡Empleado guardado exitosamente! ✅</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Nombres y Apellidos */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Primer Nombre" name="nombre" required value={formData.nombre} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Segundo Nombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Primer Apellido" name="apellido" required value={formData.apellido} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Segundo Apellido" name="segundoApellido" required value={formData.segundoApellido} onChange={handleChange} />
          </Grid>

          <Divider sx={{ width: "100%", my: 2, opacity: 0.5 }} />

          {/* Datos de Identidad y Contacto */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Cédula" name="cedula" required value={formData.cedula} onChange={handleChange} inputProps={{ maxLength: 10 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Teléfono" name="telefono" required value={formData.telefono} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Edad" name="edad" type="number" required value={formData.edad} onChange={handleChange} />
          </Grid>

          {/* Datos Demográficos */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField 
              fullWidth 
              label="Fecha de Nacimiento" 
              name="fechaNacimiento" 
              type="date" 
              required 
              InputLabelProps={{ shrink: true }} 
              value={formData.fechaNacimiento}
              onChange={handleChange} 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth select label="Género" name="genero" required value={formData.genero} onChange={handleChange}>
              <MenuItem value="MASCULINO">Masculino</MenuItem>
              <MenuItem value="FEMENINO">Femenino</MenuItem>
              <MenuItem value="OTRO">Otro</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField 
              fullWidth 
              label="Dirección Completa" 
              name="direccion" 
              required 
              multiline 
              rows={2} 
              value={formData.direccion}
              onChange={handleChange} 
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
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
            {loading ? "Procesando..." : "Registrar Empleado"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}