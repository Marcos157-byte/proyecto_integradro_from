import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, TextField, Button, Alert, 
  Divider, Stack, CircularProgress, Avatar 
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { 
  SaveRounded as SaveIcon, 
  DeleteSweepRounded as ClearIcon,
  HistoryRounded as HistoryIcon,
  CategoryRounded as CategoryIcon,
  VisibilityRounded as ViewIcon
} from "@mui/icons-material";
import { createCategoria } from "../../services/categoriaService";

function CategoriaForm() {
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [recentCategorias, setRecentCategorias] = useState<{ nombre: string; descripcion: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentCategorias");
    if (saved) setRecentCategorias(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (recentCategorias.length > 0) {
      localStorage.setItem("recentCategorias", JSON.stringify(recentCategorias));
    }
  }, [recentCategorias]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = name === "nombre" ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/i.test(formData.nombre)) {
      setMessage({ type: "error", text: "ERROR_SINTAXIS: EL NOMBRE SOLO PERMITE LETRAS" });
      return;
    }

    setLoading(true);
    try {
      await createCategoria({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      });

      setRecentCategorias((prev) => {
        const filtered = prev.filter((c) => c.nombre !== formData.nombre.toUpperCase());
        return [{ nombre: formData.nombre.toUpperCase(), descripcion: formData.descripcion }, ...filtered.slice(0, 4)];
      });

      setMessage({ type: "success", text: "REGISTRO_COMPLETADO_CON_ÉXITO" });
      setFormData({ nombre: "", descripcion: "" });
    } catch (error: any) {
      setMessage({ type: "error", text: "ERROR_SISTEMA: FALLO EN LA CREACIÓN" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 0, border: '4px solid #000', maxWidth: 800, width: '100%', boxShadow: '12px 12px 0px #000' }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <CategoryIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', lineHeight: 1 }}>NUEVA_CATEGORÍA</Typography>
            <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'text.secondary' }}>CATALOG_MANAGER // v2.0</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4, borderBottomWidth: 2, borderColor: '#000' }} />

        {message && (
          <Alert severity={message.type} variant="filled" sx={{ mb: 3, borderRadius: 0, fontWeight: 800, border: '2px solid #000' }}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth label="NOMBRE_CATEGORÍA"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  slotProps={{ input: { sx: { borderRadius: 0, fontWeight: 900 } } }}
                  helperText={`${formData.nombre.length}/100 CARACTERES`}
                />
                <TextField
                  fullWidth label="DESCRIPCIÓN_TÉCNICA"
                  name="descripcion"
                  multiline rows={3}
                  value={formData.descripcion}
                  onChange={handleChange}
                  slotProps={{ input: { sx: { borderRadius: 0, fontWeight: 600 } } }}
                  helperText={`${formData.descripcion.length}/255 CARACTERES`}
                />
                <Stack direction="row" spacing={2}>
                  <Button fullWidth variant="outlined" startIcon={<ClearIcon />} onClick={() => setFormData({ nombre: "", descripcion: "" })} sx={{ borderRadius: 0, border: '2px solid #000', color: '#000', fontWeight: 900 }}>
                    BORRAR
                  </Button>
                  <Button fullWidth variant="contained" type="submit" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} sx={{ borderRadius: 0, bgcolor: '#000', fontWeight: 900 }}>
                    REGISTRAR
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Grid>

          {/* VISTA PREVIA INDUSTRIAL */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ border: '2px dashed #ccc', p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 900, fontSize: '0.7rem', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewIcon fontSize="small" /> VISTA_PREVIA_DE_ETIQUETA
              </Typography>
              
              <Box sx={{ 
                bgcolor: '#000', color: '#fff', p: 2, 
                display: 'flex', alignItems: 'center', gap: 2,
                opacity: formData.nombre ? 1 : 0.3,
                transition: '0.3s'
              }}>
                <Avatar sx={{ bgcolor: '#3a7afe', borderRadius: 0, fontWeight: 900, width: 50, height: 50, border: '2px solid #fff' }}>
                  {formData.nombre.charAt(0) || "?"}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formData.nombre || "SIN_NOMBRE"}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#aaa', lineHeight: 1.2 }}>
                    {formData.descripcion || "ESPERANDO_DESCRIPCIÓN..."}
                  </Typography>
                </Box>
              </Box>
              
              {/* RECIENTES */}
              {recentCategorias.length > 0 && (
                <Box sx={{ mt: 'auto', pt: 3 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.7rem', mb: 1 }}>REGISTROS_RECIENTES:</Typography>
                  <Stack spacing={1}>
                    {recentCategorias.map((cat, i) => (
                      <Box 
                        key={i} 
                        onClick={() => setFormData(cat)}
                        sx={{ 
                          p: 1, border: '1px solid #000', cursor: 'pointer',
                          '&:hover': { bgcolor: '#f0f0f0', transform: 'translateX(5px)' },
                          transition: '0.2s', display: 'flex', justifyContent: 'space-between'
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: '0.8rem' }}>{cat.nombre}</Typography>
                        <HistoryIcon sx={{ fontSize: 16 }} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default CategoriaForm;