import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, CircularProgress, Box, Typography, Divider, Stack
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Cambiado a Grid2 para soportar la prop 'size'

// Importaciones de servicios
import { getCategorias } from "../../services/categoriaService";
import { getTallas } from "../../services/tallaService";
import { listColores } from "../../services/colorService";
import { getProveedores } from "../../services/proveedorService";
import { EditNote as EditIcon, Close as CloseIcon } from "@mui/icons-material";

export default function ModalEditarProducto({ open, onClose, producto, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  
  const [categorias, setCategorias] = useState<any[]>([]);
  const [tallas, setTallas] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    nombre: "",
    precio: 0,
    stock_total: 0,
    id_categoria: "",
    id_talla: "",
    id_color: "",
    id_proveedor: ""
  });

  // 1. Cargar catálogos al abrir el modal
  useEffect(() => {
    if (open) {
      const cargarCatalogos = async () => {
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
          console.error("Error cargando catálogos", error);
        } finally {
          setLoading(false);
        }
      };
      cargarCatalogos();
    }
  }, [open]);

  // 2. Sincronizar formulario con el producto seleccionado
  useEffect(() => {
    if (producto && open) {
      setForm({
        nombre: producto.nombre || "",
        precio: producto.precio || 0,
        stock_total: producto.stock_total ?? 0,
        id_categoria: producto.categoria?.id_categoria || producto.id_categoria || "", 
        id_talla: producto.talla?.id_talla || producto.id_talla || "",
        id_color: producto.color?.id_color || producto.id_color || "",
        id_proveedor: producto.proveedor?.id_proveedor || producto.id_proveedor || ""
      });
    }
  }, [producto, open]);

  // --- LÓGICA DE RESTRICCIÓN (IGUAL AL CREATE) ---
  const handleNumericChange = (field: string, value: string) => {
    // Si el usuario borra el contenido, seteamos 0 pero el input mostrará vacío
    if (value === "") {
      setForm({ ...form, [field]: 0 });
      return;
    }
    const numericValue = parseFloat(value);
    
    // Evitar que el estado guarde números negativos
    if (numericValue < 0) return;

    setForm({ ...form, [field]: numericValue });
  };

  const blockNegativeSigns = (e: React.KeyboardEvent) => {
    // Bloqueo físico de teclas prohibidas: "-", "e" (exponencial)
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleUpdate = () => {
    // Validación final antes de enviar al servicio
    if (form.precio <= 0) {
      alert("ERROR: EL PRECIO DEBE SER UN VALOR POSITIVO");
      return;
    }
    onUpdate(form);
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
        <EditIcon />
        <Typography sx={{ fontWeight: 900, letterSpacing: 1 }}>MODIFICAR_REGISTRO_PRODUCTO</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5, gap: 2 }}>
            <CircularProgress color="inherit" thickness={6} />
            <Typography sx={{ fontWeight: 900, fontFamily: 'monospace' }}>SINCRONIZANDO_DATOS...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField 
                label="DESCRIPCIÓN_PRODUCTO" 
                fullWidth 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value.toUpperCase()})}
                InputProps={{ sx: { borderRadius: 0, fontWeight: 800 } }}
              />
            </Grid>

            {/* PRECIO: ESCRITURA MANUAL SIN NEGATIVOS */}
            <Grid size={6}>
              <TextField 
                label="PRECIO_AJUSTADO ($)" 
                type="number" 
                fullWidth 
                // Muestra vacío si es 0 para facilitar la edición limpia
                value={form.precio === 0 ? "" : form.precio}
                onKeyDown={blockNegativeSigns}
                onChange={(e) => handleNumericChange("precio", e.target.value)}
                placeholder="0.00"
                InputProps={{ 
                  sx: { borderRadius: 0, fontWeight: 900, fontFamily: 'monospace', bgcolor: '#fffbed' } 
                }}
              />
            </Grid>

            <Grid size={6}>
              <TextField 
                label="STOCK_ACTUAL" 
                fullWidth 
                disabled 
                value={form.stock_total}
                variant="filled"
                InputProps={{ sx: { borderRadius: 0, fontWeight: 900, fontFamily: 'monospace' } }}
                helperText="EL STOCK NO ES EDITABLE DESDE AQUÍ"
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
          <Button 
            fullWidth 
            onClick={onClose} 
            variant="outlined" 
            startIcon={<CloseIcon />}
            sx={{ borderRadius: 0, border: '2px solid #000', color: '#000', fontWeight: 900 }}
          >
            CANCELAR
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleUpdate} 
            disabled={loading || !form.nombre || form.precio <= 0}
            sx={{ 
              borderRadius: 0, 
              bgcolor: '#000', 
              fontWeight: 900, 
              border: '2px solid #000', 
              '&:hover': { bgcolor: '#333' } 
            }}
          >
            CONFIRMAR_CAMBIOS
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}