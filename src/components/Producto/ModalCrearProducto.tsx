import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, CircularProgress, Box, Typography, Divider, Stack
} from "@mui/material";
import Grid from "@mui/material/Grid";

// Importaciones de servicios
import { getCategorias } from "../../services/categoriaService";
import { getTallas } from "../../services/tallaService";
import { listColores } from "../../services/colorService";
import { getProveedores } from "../../services/proveedorService";
import { AddBox as AddIcon } from "@mui/icons-material";

export default function ModalCrearProducto({ open, onClose, onSave }: any) {
  const [loading, setLoading] = useState(false);
  
  const [categorias, setCategorias] = useState<any[]>([]);
  const [tallas, setTallas] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  const [form, setForm] = useState({ 
    nombre: "", 
    precio: 0,
    stock_total: 0, 
    id_categoria: "", 
    id_talla: "",     
    id_color: "",     
    id_proveedor: "", 
    activo: true
  });

  useEffect(() => {
    if (open) {
      const cargarOpciones = async () => {
        setLoading(true);
        try {
          const [catRes, talRes, colRes, provRes] = await Promise.all([
            getCategorias(1, 100),
            getTallas(1, 100),
            listColores(),
            getProveedores({ limit: 100 })
          ]);
          setCategorias(catRes.data?.docs || []);
          setTallas(talRes.data?.docs || []);
          setColores(colRes || []); 
          setProveedores(provRes.data?.data || provRes.data || []);
        } catch (error) {
          console.error("Error cargando opciones:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarOpciones();
    }
  }, [open]);

  // MANEJADOR DE ENTRADA MANUAL CON BLOQUEO DE NEGATIVOS
  const handleNumericChange = (field: string, value: string) => {
    // Si el usuario borra todo, dejamos un string vacío temporal o 0
    if (value === "") {
      setForm({ ...form, [field]: 0 });
      return;
    }

    // Convertimos a número
    const numericValue = parseFloat(value);

    // BLOQUEO: Si el número es menor a 0, no actualizamos el estado
    if (numericValue < 0) return;

    setForm({ ...form, [field]: numericValue });
  };

  // BLOQUEO DE TECLA: Impide escribir el signo "-" físicamente
  const blockNegativeSigns = (e: React.KeyboardEvent) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 0, border: '4px solid #000', boxShadow: 'none' }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#000', color: '#fff', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AddIcon />
        <Typography sx={{ fontWeight: 900, letterSpacing: 1 }}>NUEVA_ENTRADA_PRODUCTO</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5, gap: 2 }}>
            <CircularProgress color="inherit" thickness={6} />
            <Typography sx={{ fontWeight: 900, fontFamily: 'monospace' }}>CARGANDO_DATOS...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField 
                label="NOMBRE_DEL_PRODUCTO" 
                fullWidth 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value.toUpperCase()})}
                InputProps={{ sx: { borderRadius: 0, fontWeight: 800 } }}
              />
            </Grid>

            {/* PRECIO: ESCRITURA MANUAL */}
            <Grid size={6}>
              <TextField 
                label="PRECIO_UNITARIO ($)" 
                type="number" 
                fullWidth 
                value={form.precio === 0 ? "" : form.precio}
                onKeyDown={blockNegativeSigns}
                onChange={(e) => handleNumericChange("precio", e.target.value)}
                placeholder="0.00"
                InputProps={{ sx: { borderRadius: 0, fontWeight: 900, fontFamily: 'monospace', bgcolor: '#fffbed' } }}
              />
            </Grid>

            {/* STOCK: ESCRITURA MANUAL */}
            <Grid size={6}>
              <TextField 
                label="CANTIDAD_STOCK" 
                type="number" 
                fullWidth 
                value={form.stock_total === 0 ? "" : form.stock_total}
                onKeyDown={blockNegativeSigns}
                onChange={(e) => handleNumericChange("stock_total", e.target.value)}
                placeholder="0"
                InputProps={{ sx: { borderRadius: 0, fontWeight: 900, fontFamily: 'monospace' } }}
              />
            </Grid>

            <Grid size={12}><Divider sx={{ borderBottomWidth: 2, borderColor: '#000' }} /></Grid>

            <Grid size={6}>
              <TextField select label="CATEGORÍA" fullWidth value={form.id_categoria} onChange={(e) => setForm({...form, id_categoria: e.target.value})} InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}>
                {categorias.map((c) => (
                  <MenuItem key={c.id_categoria} value={c.id_categoria} sx={{ fontWeight: 700 }}>{c.nombre.toUpperCase()}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6}>
              <TextField select label="TALLA" fullWidth value={form.id_talla} onChange={(e) => setForm({...form, id_talla: e.target.value})} InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}>
                {tallas.map((t) => (
                  <MenuItem key={t.id_talla} value={t.id_talla} sx={{ fontWeight: 700 }}>{t.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6}>
              <TextField select label="COLOR" fullWidth value={form.id_color} onChange={(e) => setForm({...form, id_color: e.target.value})} InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}>
                {colores.map((col) => (
                  <MenuItem key={col.id_color} value={col.id_color} sx={{ fontWeight: 700 }}>{col.color.toUpperCase()}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6}>
              <TextField select label="PROVEEDOR" fullWidth value={form.id_proveedor} onChange={(e) => setForm({...form, id_proveedor: e.target.value})} InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}>
                {proveedores.map((p) => (
                  <MenuItem key={p.id_proveedor} value={p.id_proveedor} sx={{ fontWeight: 700 }}>{p.nombre.toUpperCase()}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '2px solid #eee' }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button fullWidth onClick={onClose} variant="outlined" sx={{ borderRadius: 0, border: '2px solid #000', color: '#000', fontWeight: 900 }}>
            CANCELAR
          </Button>
          <Button 
            fullWidth variant="contained" onClick={handleSave} 
            disabled={loading || !form.nombre || form.precio <= 0}
            sx={{ borderRadius: 0, bgcolor: '#000', fontWeight: 900, border: '2px solid #000', '&:hover': { bgcolor: '#333' } }}
          >
            GUARDAR_PRODUCTO
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}