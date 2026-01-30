import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Grid, TextField, MenuItem, CircularProgress, Box 
} from "@mui/material";

// 1. Importaciones de servicios (Asegúrate de que getCategorias esté exportada en su service)
import { getCategorias } from "../../services/categoriaService";
import { getTallas } from "../../services/tallaService";
import { listColores } from "../../services/colorService";
import { getProveedores } from "../../services/proveedorService";

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
          // LLAMADAS EN PARALELO
          const [catRes, talRes, colRes, provRes] = await Promise.all([
            getCategorias(1, 100),         // Mongo (Cambiado CategoriaList por getCategorias)
            getTallas(1, 100),             // Mongo
            listColores(),                 // Postgres
            getProveedores({ limit: 100 })  // Postgres
          ]);

          // EXTRACCIÓN SEGÚN ESTRUCTURA DE RESPUESTA
          // Mongo (PaginatedResponseMongo): la data real está en .data.docs
          setCategorias(catRes.data?.docs || []);
          setTallas(talRes.data?.docs || []);
          
          // Postgres: Depende de cómo devuelvas la data en tus otros services
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

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1 }}>
        📦 Registrar Nuevo Producto
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5, gap: 2 }}>
            <CircularProgress />
            <Box sx={{ color: 'text.secondary', variant: 'body2' }}>Sincronizando bases de datos...</Box>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Nombre */}
            <Grid size={{ xs: 12}}>
              <TextField label="Nombre del Producto" fullWidth value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} />
            </Grid>

            {/* Precio */}
            <Grid size={{ xs: 6}}>
              <TextField label="Precio ($)" type="number" fullWidth value={form.precio}
                onChange={(e) => setForm({...form, precio: Number(e.target.value)})} />
            </Grid>

            {/* Stock */}
            <Grid size={{ xs: 6 }}>
              <TextField label="Stock Inicial" type="number" fullWidth value={form.stock_total}
                onChange={(e) => setForm({...form, stock_total: Number(e.target.value)})} />
            </Grid>

            {/* Categoría (Mongo) */}
            <Grid size={{ xs: 6}}>
              <TextField select label="Categoría" fullWidth value={form.id_categoria}
                onChange={(e) => setForm({...form, id_categoria: e.target.value})}>
                {categorias.map((c) => (
                  <MenuItem key={c.id_categoria} value={c.id_categoria}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Talla (Mongo) */}
            <Grid size={{ xs: 6}}>
              <TextField select label="Talla" fullWidth value={form.id_talla}
                onChange={(e) => setForm({...form, id_talla: e.target.value})}>
                {tallas.map((t) => (
                  <MenuItem key={t.id_talla} value={t.id_talla}>{t.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Color (Postgres) */}
            <Grid size={{ xs: 6 }}>
              <TextField select label="Color" fullWidth value={form.id_color}
                onChange={(e) => setForm({...form, id_color: e.target.value})}>
                {colores.map((col) => (
                  <MenuItem key={col.id_color} value={col.id_color}>{col.color}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Proveedor (Postgres) */}
            <Grid size={{ xs: 6 }}>
              <TextField select label="Proveedor" fullWidth value={form.id_proveedor}
                onChange={(e) => setForm({...form, id_proveedor: e.target.value})}>
                {proveedores.map((p) => (
                  <MenuItem key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} color="inherit" variant="outlined">Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={loading || !form.nombre || !form.id_categoria || !form.id_talla || !form.id_color}
          sx={{ fontWeight: 700, px: 4 }}
        >
          {loading ? "Cargando..." : "Guardar Producto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}