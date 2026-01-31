import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, TextField, Button, Alert, 
  Divider, Stack, Chip, CircularProgress 
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { 
  SaveRounded as SaveIcon, 
  DeleteSweepRounded as ClearIcon,
  HistoryRounded as HistoryIcon,
  CategoryRounded as CategoryIcon
} from "@mui/icons-material";
import { createCategoria } from "../../services/categoriaService";

function CategoriaForm() {
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [recentCategorias, setRecentCategorias] = useState<{ nombre: string; descripcion: string }[]>([]);

  // 1. Cargar del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentCategorias");
    if (saved) setRecentCategorias(JSON.parse(saved));
  }, []);

  // 2. Guardar en localStorage
  useEffect(() => {
    if (recentCategorias.length > 0) {
      localStorage.setItem("recentCategorias", JSON.stringify(recentCategorias));
    }
  }, [recentCategorias]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Forzamos mayúsculas para el nombre
    const finalValue = name === "nombre" ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones Lógicas
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(formData.nombre)) {
      setMessage({ type: "error", text: "ERROR_SINTAXIS: EL NOMBRE SOLO PERMITE LETRAS Y ESPACIOS" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await createCategoria({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      });

      // Actualizar recientes (lógica de chips)
      setRecentCategorias((prev) => {
        const filtered = prev.filter((c) => c.nombre !== formData.nombre.toUpperCase());
        return [{ nombre: formData.nombre.toUpperCase(), descripcion: formData.descripcion }, ...filtered.slice(0, 4)];
      });

      setMessage({ type: "success", text: `REGISTRO_EXITOSO: "${formData.nombre}" AÑADIDO AL CATÁLOGO` });
      setFormData({ nombre: "", descripcion: "" });
      setTimeout(() => setMessage(null), 5000);

    } catch (error: any) {
      const errorMsg = error.response?.status === 409 
        ? "ADVERTENCIA: ESTA CATEGORÍA YA EXISTE EN EL MAESTRO" 
        : "ERROR_SISTEMA: NO SE PUDO COMPLETAR EL REGISTRO";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Paper 
        sx={{ 
          p: 4, borderRadius: 0, border: '4px solid #000', 
          maxWidth: 700, width: '100%', bgcolor: '#fff',
          boxShadow: '12px 12px 0px #000'
        }}
      >
        {/* HEADER TÉCNICO */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <CategoryIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', lineHeight: 1 }}>
              NUEVA_CATEGORÍA
            </Typography>
            <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'text.secondary' }}>
              DATABASE_ENTRY // MONGODB_ENGINE
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4, borderBottomWidth: 2, borderColor: '#000' }} />

        {/* FEEDBACK DE STATUS */}
        {message && (
          <Alert 
            severity={message.type} 
            variant="filled" 
            sx={{ mb: 3, borderRadius: 0, fontWeight: 800, border: '2px solid #000' }}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* INPUT NOMBRE */}
            <Grid size={12}>
              <TextField
                fullWidth label="ETIQUETA_CATEGORÍA"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="EJ: CALZADO DEPORTIVO"
                helperText={`${formData.nombre.length}/100 CARACTERES - SOLO ALFABÉTICO`}
                slotProps={{ 
                  input: { sx: { borderRadius: 0, fontWeight: 900, fontSize: '1.1rem' } },
                  formHelperText: { sx: { fontWeight: 700, fontFamily: 'monospace' } }
                }}
              />
            </Grid>

            {/* INPUT DESCRIPCIÓN */}
            <Grid size={12}>
              <TextField
                fullWidth label="DESCRIPCIÓN_SISTEMA"
                name="descripcion"
                multiline rows={3}
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="DETALLES TÉCNICOS DE LA CLASIFICACIÓN..."
                helperText={`${formData.descripcion.length}/255 CARACTERES`}
                slotProps={{ 
                  input: { sx: { borderRadius: 0, fontWeight: 700 } },
                  formHelperText: { sx: { fontWeight: 700, fontFamily: 'monospace' } }
                }}
              />
            </Grid>

            {/* BOTONES DE ACCIÓN */}
            <Grid size={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => { setFormData({ nombre: "", descripcion: "" }); setMessage(null); }}
                  disabled={loading || (!formData.nombre && !formData.descripcion)}
                  sx={{ borderRadius: 0, border: '2px solid #000', color: '#000', fontWeight: 900 }}
                >
                  LIMPIAR_DATOS
                </Button>

                <Button
                  fullWidth variant="contained"
                  type="submit"
                  disabled={loading || !formData.nombre.trim() || !formData.descripcion.trim()}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ 
                    borderRadius: 0, bgcolor: '#000', fontWeight: 900, 
                    '&:hover': { bgcolor: '#333' } 
                  }}
                >
                  {loading ? "PROCESANDO..." : "REGISTRAR_EN_SISTEMA"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>

        {/* SECCIÓN DE HISTORIAL (CHIPS) */}
        {recentCategorias.length > 0 && (
          <Box sx={{ mt: 5, p: 2, bgcolor: '#f8fafc', border: '2px dashed #000' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <HistoryIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontWeight: 900, fontSize: '0.8rem', letterSpacing: 1 }}>
                RECIENTES_EN_SESIÓN (CLIC_PARA_RECARGAR)
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {recentCategorias.map((cat, index) => (
                <Chip
                  key={index}
                  label={cat.nombre}
                  onClick={() => setFormData({ nombre: cat.nombre, descripcion: cat.descripcion })}
                  sx={{ 
                    borderRadius: 0, border: '2px solid #000', fontWeight: 800,
                    bgcolor: '#fff', '&:hover': { bgcolor: '#3a7afe', color: '#fff' }
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default CategoriaForm;