import React, { useState } from "react";
import { 
  Box, TextField, Button, Typography, Paper, 
  Alert, CircularProgress, Divider 
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { SaveRounded as SaveIcon, Business as BusinessIcon } from "@mui/icons-material";
import { createProveedor } from "../../services/proveedorService";

function ProveedorForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Normalizamos a MAYÚSCULAS para mantener el estilo industrial
    const formattedValue = (name === "nombre" || name === "contacto" || name === "direccion") 
      ? value.toUpperCase() 
      : value;

    setFormData({ ...formData, [name]: formattedValue });
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) throw new Error("EL NOMBRE ES OBLIGATORIO");
      if (!formData.email.trim()) throw new Error("EL EMAIL ES OBLIGATORIO");

      await createProveedor(formData);

      setMessage({ type: "success", text: "REGISTRO COMPLETADO EXITOSAMENTE ✓" });

      // Resetear formulario
      setFormData({
        nombre: "",
        contacto: "",
        telefono: "",
        email: "",
        direccion: "",
      });

      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      let errorMessage = "ERROR AL PROCESAR EL REGISTRO";
      if (error.response?.status === 403) {
        errorMessage = "ACCESO DENEGADO: PERMISOS INSUFICIENTES";
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 4, 
        borderRadius: 0, 
        border: '4px solid #000', 
        maxWidth: 600, 
        mx: 'auto', 
        mt: 4,
        boxShadow: '10px 10px 0px #000' // Sombra sólida estilo brutalista
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <BusinessIcon sx={{ fontSize: 32 }} />
        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: 1 }}>
          ALTA_DE_PROVEEDORES
        </Typography>
      </Box>

      <Divider sx={{ mb: 4, borderBottomWidth: 2, borderColor: '#000' }} />

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3, borderRadius: 0, fontWeight: 800, border: '1px solid' }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="RAZÓN SOCIAL / NOMBRE"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 0, fontWeight: 800 } }}
            />
          </Grid>
          
          <Grid size={12}>
            <TextField
              fullWidth
              label="PERSONA DE CONTACTO"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="TELÉFONO"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 0, fontFamily: 'monospace', fontWeight: 700 } }}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="EMAIL"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 0, fontFamily: 'monospace', fontWeight: 700 } }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="DIRECCIÓN"
              name="direccion"
              multiline
              rows={2}
              value={formData.direccion}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}
            />
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ 
                borderRadius: 0, 
                bgcolor: '#000', 
                py: 1.5, 
                fontWeight: 900,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#333' }
              }}
            >
              {loading ? "PROCESANDO..." : "GUARDAR_PROVEEDOR"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default ProveedorForm;